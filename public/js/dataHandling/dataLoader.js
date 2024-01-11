export function loadData(dataFilePath) {
  const fileExtension = dataFilePath.split(".").pop().toLowerCase();
  return new Promise((resolve, reject) => {
    switch (fileExtension) {
      case "json":
        d3.json(dataFilePath)
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.error("Error loading JSON data:", error);
            reject(error);
          });
        break;
      case "csv":
        d3.csv(dataFilePath)
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.error("Error loading CSV data:", error);
            reject(error);
          });
        break;
      default:
        console.error("Unsupported file format");
        reject("Unsupported file format");
    }
  });
}
