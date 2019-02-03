const APIPrefix =
  window.location.host === "localhost:3000"
    ? "http://localhost:5000"
    : "http://" + window.location.host;

(() => {
  if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    alert("get html5 for this app to work");
  }
})();

const dropFileForm = () => {
  return document.getElementById("dropFileForm");
};
const fileLabelText = () => {
  return document.getElementById("fileLabelText");
};
const uploadStatus = () => {
  return document.getElementById("uploadStatus");
};
const fileInput = () => {
  return document.getElementById("fileInput");
};
let droppedFiles;

function overrideDefault(event) {
  event.preventDefault();
  event.stopPropagation();
}

function fileHover() {
  dropFileForm().classList.add("fileHover");
}

function fileHoverEnd() {
  dropFileForm().classList.remove("fileHover");
}

function addFiles(event) {
  droppedFiles = event.target.files || event.dataTransfer.files;
  showFiles(droppedFiles);
}

function showFiles(files) {
  if (files.length > 1) {
    fileLabelText().innerText = files.length + " files selected";
  } else if(files.length > 0) {
    fileLabelText().innerText = files[0].name;
  }
}

function uploadFiles(event) {
  event.preventDefault();
  changeStatus("Uploading...");



  startRead(event);
}

function changeStatus(text) {
  uploadStatus().innerText = text;
}






function startRead(evt) {
    var file = document.getElementById('fileInput').files[0];
    if (file) {
        if (file.type.match("image.*")) {
            getAsImage(file);
        }
        else {
            getAsText(file);
        }
    }
    evt.stopPropagation();
    evt.preventDefault();
}
function startReadFromDrag(evt) {
    var file = evt.dataTransfer.files[0];
    if (file) {
        if (file.type.match("image.*")) {
            getAsImage(file);
        }
        else {
            getAsText(file);
        }
    }
    evt.stopPropagation();
    evt.preventDefault();
}
function getAsImage(readFile) {
    var reader = new FileReader();
    reader.readAsDataURL(readFile);
    reader.onload = sendImageToBackend;
}
function addImg(imgsrc) {
    var img = document.createElement('img');
    img.setAttribute("src", imgsrc.target.result);
    document.getElementById("op").insertBefore(img);
}

function sendImageToBackend(image) {
  let body = { image: image.target.result };
  
  fetch(`${APIPrefix}/api/parseimage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => console.log(res));
}
