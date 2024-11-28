# Scrapper App
Este proyecto es una aplicación de scraping desarrollada con Node.js, Express, y TypeScript. La aplicación incluye un servidor que utiliza Puppeteer para extraer información de productos desde una página inicial o una página de búsqueda de un sitio web y un script que genera un archivo CSV a partir de datos JSON alojados en un servidor.

## Características principales
- Extracción de productos: El servidor puede recibir una URL mediante un método POST para extraer información sobre productos (nombre, marca, precio e imagen).
- Archivo CSV generado: Un script independiente (products.ts) descarga y procesa un archivo JSON y lo convierte en un archivo CSV que contiene atributos personalizados de productos.

### Tecnologías utilizadas
- Node.js: Para ejecutar el servidor.
- Express: Para manejar las rutas y solicitudes HTTP.
- TypeScript: Para tipado estático y mayor seguridad en el desarrollo.
- Puppeteer: Para realizar scraping de páginas web.
- csv-writer: Para generar archivos CSV.
- node-fetch: Para realizar solicitudes HTTP en el script products.ts.

### Requisitos previos
Node.js (v18 o superior)
NPM (instalado junto con Node.js)
Docker (opcional, si deseas contenerizar el proyecto)

## Instalación
Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/scrapper-app.git
```

Navega al directorio del proyecto:
```bash
cd scrapper-app
```

Instala las dependencias:
```bash
npm install
```

## Uso
1. Servidor de scraping
El servidor se encuentra en el archivo index.ts. Para ejecutarlo:

Compila el proyecto TypeScript:
```bash
npm run build
```

Inicia el servidor:

```bash
npm run server
```

El servidor estará disponible en http://localhost:3000.

Ruta POST /get-products

Puedes enviar una solicitud POST al servidor con un cuerpo JSON en uno de los siguientes formatos:

Para la página principal:

```json

{
    "url": "https://www.tiendasjumbo.co/"
}
```

Para una página de búsqueda:
```json
{
    "url": "https://www.tiendasjumbo.co/%C3%A1rbol%20navidad?_q=%C3%A1rbol%20navidad&map=ft"
}
```
Ejemplo de solicitud con cURL:

```curl
curl -X POST http://localhost:3000/get-products \
-H "Content-Type: application/json" \
-d '{"url":"https://www.tiendasjumbo.co/"}'
```

Respuesta: El servidor devolverá un JSON con una lista de productos, incluyendo:

name: Nombre del producto.
brand: Marca del producto.
price: Precio del producto.
imageUrl: URL de la imagen del producto.
Ejemplo de respuesta:

```json
{
  "products": [
    {
      "price": "$100,000",
      "name": "Árbol de Navidad",
      "brand": "Navideña",
      "imageUrl": "https://www.tiendasjumbo.co/images/arbol.jpg"
    }
  ]
}
```

2. Generador de CSV
El archivo products.ts descarga un archivo JSON desde una URL y genera un archivo CSV con atributos personalizados.

Ejecuta el script:

```bash
npm run products
```
El archivo CSV generado se guardará en la raíz del proyecto como output-product.csv.

El archivo incluirá información como:

- allergens: Alérgenos del producto.
- sku: Código SKU.
- vegan, kosher, organic, etc.: Atributos booleanos.
- unit_size y net_weight: Tamaño y peso del producto.

## Ejecución con Docker (opcional)
Si prefieres ejecutar el proyecto dentro de un contenedor Docker:

Construye la imagen:

```bash
docker build -t scrapper-app .
```

Inicia el contenedor:

```bash
docker run -p 3000:3000 scrapper-app
```

El servidor estará disponible en http://localhost:3000.
