export function convertData(data, dataType) {
  switch (dataType) {
    case "json":
      try {
        const jsonData = JSON.parse(data);
        return jsonData;
      } catch (error) {
        console.error("Error converting data to JSON");
        throw error;
      }
    case "csv":
      try {
        csvtojson()
          .fromFile("file_upload")
          .then((jsonObj) => {
            console.log(jsonObj);
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error("Error converting data from CSV to JSON");
        throw error;
      }
    default:
      console.error("Unsupported data type");
      throw error;
  }
}
