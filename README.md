# Tier Maker

## Proceso de creación

### Tabler icons

Queremos que se entienda visualmente lo que hacen nuestro botones, pero no hace falta crear nuestros propios íconos. Hay miles de ellos en formato escalable SVG en [páginas como esta](https://tabler.io/icons), donde además podemos personalizar su tamaño, grosor, color, etc.

Podemos copiar directamente en nuestro HTML el código SVG, pero la manera más ordenada es guardar el archivo SVG descargable en una carpeta junto con las demás imágenes, y luego referenciarla como cualquier imagen en el HTML. Por ejemplo, así incluimos el ícono SVG del botón para añadir una imagen:

```html
<img src="images/square-rounded-plus.svg" alt="add image" />
```

### ¿Cómo cargamos imágenes?

El que menos pensaría que se necesita JavaScript:

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

### ¿Cómo convertimos la imagen cargada en un elemento HTML?

```js
imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;

  if (file) {
    const reader = new FileReader();
    reader.onload = (eventReader) => {
      const imgElement = document.createElement("img");
      imgElement.src = eventReader.target.result;
    };
    reader.readAsDataURL(file);
  }
});
```

Para mostrar el elemento HTML de imagen en pantalla solo hay que añadirlo con el método appendChild() a algún elemento del documento, como el área de selección que tenemos.

### Drag and drop

En lugar de copiar toda la información que consitituye la imagen, crear un elemento img nuevo y encima borrar el antiguo, puedes simplemente transmitir la id del elemento para seleccionarlo con un ``getElementById()`` y moverlo al área de drop mediante`` appendChild()`` cuando el evento respectivo suceda.

```js
const itemClass = "image-item"

const idFunctionGen = () => {
  let count = 0
  return () => {
    return `item-${count++}`
  }
}
getItemId = idFunctionGen()

function handleDragStart(event) {
  draggedElement = event.target;
  sourceContainer = draggedElement.parentNode;
  event.dataTransfer.clearData()
  event.dataTransfer.setData("text/plain", draggedElement.id) // transmite la id!
}

function handleDrop(event) {
  event.preventDefault()
  const data = event.dataTransfer.getData("text");
  const item = document.getElementById(data)
  item.className = itemClass
  event.target.appendChild(item)
}
```

Todo estaba aparentemente listo para la transmisión de los datos al área de drop, pero no funcionaba porque faltaba esto:

```js
function handleDragOver(event) {
  event.preventDefault();
}
```

### La imagen desaparece al soltarla sobre otra imagen

El evento drop se puede realizar sobre cualquier elemento. Esto puede hacer que nuestros elementos desaparezcan o aparezcan en lugares donde no deben estar. Por eso debemos distinguir los elementos que realmente queremos que puedan recibir el elemento soltado. Aquí lo hicimos especificando para estos la clase _dropzone_ (podía ser cualquier otra).

Lo que sigue es verificar que el elemento objetivo del evento drop sea de esta clase:

```js
function handleDrop(event) {
  event.preventDefault();
  if (event.target.classList.contains("dropzone")) {
    // rest of code
  }
```

### Animando los tiers

Esto no funciona:

```css
.tier {
    display: flex;
    ...

    & .drag-over {
        background: var(--border-color);
        scale: 1.01;
    }
```

Pero esto sí:

```css
.tier {
    display: flex;
    ...

    &.drag-over {
        background: var(--border-color);
        scale: 1.01;
    }
```

¿Qué pasó?

### drag-and-drop múltiple desde el explorador de archivos

```html
<input multiple type="file" accept="image/*" id="image-input" hidden />
```

```js
const files = event.target.files;
if (!files) return;
files = Array.from(files);
```
