const $ = (el) => document.querySelector(el);
const $$ = (els) => document.querySelectorAll(els);

const itemClass = "image-item";

const imageInput = $("#image-input");
const itemSection = $("#selector-items");

const idFunctionGen = () => {
  let count = 0;

  return () => {
    return `item-${count++}`;
  };
};
getItemId = idFunctionGen();

const tiers = $$(".tier");
tiers.forEach((tier) => {
  tier.addEventListener("dragenter", handleDragEnter);
  tier.addEventListener("dragover", handleDragOver);
  tier.addEventListener("dragleave", handleDragLeave);
  tier.addEventListener("drop", handleDrop);
  tier.classList.add("dropzone");
});
itemSection.addEventListener("dragenter", handleDragEnter);
itemSection.addEventListener("dragover", handleDragOver);
itemSection.addEventListener("dragleave", handleDragLeave);
itemSection.addEventListener("drop", handleDrop);
itemSection.classList.add("dropzone");

function createItem(src) {
  const imgElement = document.createElement("img");
  imgElement.src = src;
  imgElement.className = itemClass;
  imgElement.id = getItemId();
  imgElement.draggable = true;

  imgElement.addEventListener("dragstart", handleDragStart);
  imgElement.addEventListener("dragend", handleDragEnd);

  itemSection.appendChild(imgElement);
}

imageInput.addEventListener("change", (event) => {
  let files = event.target.files;
  if (!files) return;
  files = Array.from(files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (eventReader) => {
      createItem(eventReader.target.result);
    };
    reader.readAsDataURL(file);
  });
});

let dragged = null;

function handleDragStart(event) {
  dragged = event.target;
  event.dataTransfer.clearData();
  event.dataTransfer.setData("text/plain", dragged.id);
}

function handleDragEnd(event) {
  event.preventDefault();
  dragged = null;
}

function handleDragEnter(event) {
  event.preventDefault();
  console.log("enter");
  const sourceContainer = dragged.parentNode;
  if (sourceContainer == event.currentTarget) return;

  const { currentTarget } = event;
  currentTarget.classList.add("drag-over");
}

// This is a pain in the **s. Why can't be supressed this handler??
function handleDragOver(event) {
  event.preventDefault();
}

function handleDragLeave(event) {
  event.preventDefault();
  const { currentTarget } = event;
  currentTarget.classList.remove("drag-over");
}

function handleDrop(event) {
  event.preventDefault();
  if (event.target.classList.contains("dropzone")) {
    const draggedData = event.dataTransfer.getData("text");
    console.log(draggedData);
    const item = document.getElementById(draggedData);
    item.className = itemClass;
    event.target.appendChild(item);

    const { currentTarget } = event;
    currentTarget.classList.remove("drag-over");
  }
}
