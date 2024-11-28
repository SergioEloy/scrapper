import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());

app.post('/get-products', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    res
      .status(400)
      .json({ error: 'La URL es requerida en el cuerpo de la solicitud.' });
  }

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      });
    });

    await page.screenshot({ path: 'debug.png', fullPage: true });

    const products = await page.evaluate(() => {
      const productsData = [];

      const priceElementsMain = document.querySelectorAll(
        '#items-price > div > div'
      );
      const nameElementsMain = document.querySelectorAll('h3 > span');
      const brandElementsMain = document.querySelectorAll(
        'div:nth-child(8) > div > span'
      );
      const imageElementsMain = document.querySelectorAll(
        'img.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image.vtex-product-summary-2-x-mainImageHovered'
      );

      const priceElementsSearch = document.querySelectorAll(
        '#items-price > div > div'
      );
      const nameElementsSearch = document.querySelectorAll(
        '#gallery-layout-container > div > section > a > article > div > div:nth-child(9) > div > h3 > span'
      );
      const brandElementsSearch = document.querySelectorAll(
        '#gallery-layout-container > div > section > a > article > div > div:nth-child(8) > div > span'
      );
      const imageElementsSearch = document.querySelectorAll(
        '#gallery-layout-container > div > section > a > article > div > div:nth-child(4) > div > div > div > div > div > div > div > img'
      );

      const priceElements = priceElementsMain.length
        ? priceElementsMain
        : priceElementsSearch;
      const nameElements = nameElementsMain.length
        ? nameElementsMain
        : nameElementsSearch;
      const brandElements = brandElementsMain.length
        ? brandElementsMain
        : brandElementsSearch;
      const imageElements = imageElementsMain.length
        ? imageElementsMain
        : imageElementsSearch;

      for (let i = 0; i < priceElements.length; i++) {
        const price = priceElements[i]?.textContent?.trim() || '';
        const name = nameElements[i]?.textContent?.trim() || '';
        const brand = brandElements[i]?.textContent?.trim() || '';
        const imageUrl = imageElements[i]?.getAttribute('src') || '';

        productsData.push({
          price,
          name,
          brand,
          imageUrl,
        });
      }

      return productsData;
    });

    await browser.close();

    res.json({ products });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al procesar la URL:', error.message);
    }
    res.status(500).json({ error: 'Error al procesar la URL.' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
