const $ = (el) => document.querySelector(el);
const $$ = (els) => document.querySelectorAll(els);

const images = $$("img");
images.forEach((image) => (image.draggable = false));

const itemClass = "image-item";

const imageInput = $("#image-input");
const itemSection = $("#selector-items");
const dropVeil = $("#drop-veil");
const resetButton = $("#reset-button");
const downloadButton = $("#download-screenshot-button");

const getItemId = (() => {
  let count = 0;
  return () => {
    return `item-${count++}`;
  };
})();

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

document.addEventListener("dragenter", handleEnterFromDesktop);
document.addEventListener("dragover", handleOverFromDesktop);
document.addEventListener("dragleave", handleLeaveFromDesktop);
document.addEventListener("drop", handleDropFromDesktop);

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

function createItemsFromFiles(files) {
  if (!files || files.length === 0) return;
  files = Array.from(files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (eventReader) => {
      createItem(eventReader.target.result);
    };
    reader.readAsDataURL(file);
  });
}

imageInput.addEventListener("change", (event) => {
  let files = event.target.files;
  createItemsFromFiles(files);
});

let draggedItem = null;
let lastDragEnterContainer = null;
let dragFileCounter = 0;

function handleEnterFromDesktop(event) {
  event.preventDefault();
  if (draggedItem) return;
  dragFileCounter++;
  dropVeil.style.display = "flex";
}

function handleOverFromDesktop(event) {
  event.preventDefault();
}

function handleLeaveFromDesktop(event) {
  if (draggedItem) return;
  dragFileCounter--;
  if (dragFileCounter === 0) {
    dropVeil.style.display = "none";
  }
}

function handleDropFromDesktop(event) {
  event.preventDefault();
  const { currentTarget, dataTransfer } = event;
  if (draggedItem) return;
  createItemsFromFiles(dataTransfer.files);
  dragFileCounter = 0;
  dropVeil.style.display = "none";
}

function handleDragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.clearData();
  event.dataTransfer.setData("text/plain", draggedItem.id);
}

function handleDragEnd(event) {
  event.preventDefault();
  const { currentTarget } = event;
  draggedItem = null;
  if (!lastDragEnterContainer) return;
  lastDragEnterContainer.classList.remove("drag-over");
  lastDragEnterContainer = null;
}

function handleDragEnter(event) {
  event.preventDefault();
  if (!draggedItem) return;
  const sourceContainer = draggedItem.parentNode;
  if (sourceContainer == event.currentTarget) return;

  const { currentTarget } = event;
  currentTarget.classList.add("drag-over");
  lastDragEnterContainer = currentTarget;
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
    if (!draggedData) return;
    const item = document.getElementById(draggedData);
    item.className = itemClass;
    event.target.appendChild(item);

    const { currentTarget } = event;
    currentTarget.classList.remove("drag-over");
  }
}

const sectionPhrase = $("#selector-items span");

// Create a MutationObserver
const observer = new MutationObserver(() => {
  // Check if the dropzone is empty or has children
  sectionPhrase.style.display =
    itemSection.children.length === 1 ? "inline" : "none";
  console.log(itemSection.children.length);
});

// Start observing the dropzone
observer.observe(itemSection, { childList: true });

// reset: returns images to file drop zone
resetButton.addEventListener("click", () => {
  items = $$(`.tier-list .${itemClass}`);
  items.forEach((item) => {
    item.remove();
    itemSection.appendChild(item);
  });
});

// Download screenshot
downloadButton.addEventListener("click", () => {
  const tierList = document.querySelector(".tier-list");

  import(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js"
  ).then(({ default: html2canvas }) => {
    const scaleFactor = 2; // Change for higher resolution

    // Render screenshot with adjusted scaling
    html2canvas(tierList, {
      scale: scaleFactor, // Render at higher resolution
      width: tierList.offsetWidth, // Match element's width
      height: tierList.offsetHeight, // Match element's height
    }).then((canvas) => {
      const imgURL = canvas.toDataURL("image/png"); // Convert to image
      const downloadLink = document.createElement("a");
      downloadLink.download = "tier.png";
      downloadLink.href = imgURL;
      downloadLink.click();
    });
  });
});
