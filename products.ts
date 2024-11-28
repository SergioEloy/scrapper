import fetch from 'node-fetch';
import { createObjectCsvWriter } from 'csv-writer';
import {
  Allergen,
  Allergens,
  CustomAttributes,
} from './interface/productsInterface';

async function processProductJson() {
  try {
    const url =
      'https://storage.googleapis.com/resources-prod-shelftia/scrapers-prueba/product.json';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error al obtener el archivo JSON: ${response.statusText}`
      );
    }

    const data: any = await response.json();
    const { allVariants } = data;

    const products: CustomAttributes[] = [];

    allVariants.forEach((variant: any) => {
      const { sku, attributesRaw } = variant;

      const customAttributes = attributesRaw.find(
        (attr: any) => attr.name === 'custom_attributes'
      )?.value;

      if (!customAttributes) {
        console.error(`custom_attributes no encontrado para SKU: ${sku}`);
        return;
      }

      const languages = Object.keys(customAttributes);

      languages.forEach((lang) => {
        const customAttributesLang = JSON.parse(customAttributes[lang]);

        const allergensData: Allergens = customAttributesLang.allergens;
        const allergens =
          allergensData?.value
            ?.map((allergen: Allergen) => allergen.name)
            .join(', ') || '';

        const vegan = customAttributesLang.vegan?.value || false;
        const kosher = customAttributesLang.kosher?.value || false;
        const organic = customAttributesLang.organic?.value || false;
        const vegetarian = customAttributesLang.vegetarian?.value || false;
        const gluten_free = customAttributesLang.gluten_free?.value || false;
        const lactose_free = customAttributesLang.lactose_free?.value || false;
        const package_quantity =
          customAttributesLang.package_quantity?.value || 0;
        const unit_size = `${customAttributesLang.unit_size?.value || ''}${
          customAttributesLang.unit_size?.symbol || ''
        }`;
        const net_weight = `${customAttributesLang.net_weight?.value || ''}${
          customAttributesLang.net_weight?.symbol || ''
        }`;

        products.push({
          allergens,
          sku,
          vegan,
          kosher,
          organic,
          vegetarian,
          gluten_free,
          lactose_free,
          package_quantity,
          unit_size,
          net_weight,
          language: lang,
        });
      });
    });

    const csvWriter = createObjectCsvWriter({
      path: 'output-product.csv',
      header: [
        { id: 'allergens', title: 'Allergens' },
        { id: 'sku', title: 'SKU' },
        { id: 'vegan', title: 'Vegan' },
        { id: 'kosher', title: 'Kosher' },
        { id: 'organic', title: 'Organic' },
        { id: 'vegetarian', title: 'Vegetarian' },
        { id: 'gluten_free', title: 'Gluten Free' },
        { id: 'lactose_free', title: 'Lactose Free' },
        { id: 'package_quantity', title: 'Package Quantity' },
        { id: 'unit_size', title: 'Unit Size' },
        { id: 'net_weight', title: 'Net Weight' },
        { id: 'language', title: 'Language' },
      ],
    });

    await csvWriter.writeRecords(products);

    console.log('Archivo CSV generado correctamente: output-product.csv');
  } catch (error) {
    console.error('Error al procesar el archivo JSON:', error);
  }
}

processProductJson();
