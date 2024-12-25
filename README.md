# Tier Maker

## Proceso de creación

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
