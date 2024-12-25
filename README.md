# Tier Maker

## Proceso de creación

Queremos que se entienda visualmente lo que hacen nuestro botones, pero no hace falta crear nuestros propios íconos. Hay miles de ellos en formato escalable SVG en [páginas como esta](https://tabler.io/icons), donde además podemos personalizar su tamaño, grosor, color, etc.

Podemos copiar directamente en nuestro HTML el código SVG, pero la manera más ordenada es guardar el archivo SVG descargable en una carpeta junto con las demás imágenes, y luego referenciarla como cualquier imagen en el HTML. Por ejemplo, así incluimos el ícono SVG del botón para añadir una imagen:

```html
<img src="images/square-rounded-plus.svg" alt="add image" />
```

¿Cómo cargamos imágenes? El que menos pensaría que se necesita JavaScript:

```html
<input type="file" id="image-input" hidden />
<button id="reload-tier-list">
  <img src="images/reload.svg" alt="reload tier list" />
</button>
```

```js
const addButton = $("#add-image-button");
const imageInput = $("#image-input");
addButton.addEventListener("click", () => {
  imageInput.click();
});
```

Pero en realidad se puede hacer con HTML puro:

```html
<label id="add-image-button">
  <img src="images/square-rounded-plus.svg" alt="add image" />
  <input type="file" id="image-input" hidden />
</label>
```
