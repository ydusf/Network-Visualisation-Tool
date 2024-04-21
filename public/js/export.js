function downloadJSON(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  
  element.click();

  document.body.removeChild(element);
};

const downloadJSONBtn = document.getElementById("export-json-btn");
downloadJSONBtn.addEventListener("click", e => {
  const networkFile = document.getElementById("network-data")
  e.preventDefault();
  downloadJSON('networks.json', networkFile.textContent)
}); 
