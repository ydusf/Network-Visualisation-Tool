const parseJSON = require('./parseJSON');
const parseCSV = require('./parseCSV');
const parseGraphML = require('./parseGraphML');

function convertData(data, dataType) {
  switch (dataType) {
    case 'json':
      return parseJSON(data);
    case 'csv':
      return parseCSV(data);
    case 'graphml':
      return parseGraphML(data)
        .then(jsonData => {
          return jsonData;
        })
        .catch(error => {
          console.error('Error parsing GraphML:', error);
        });
    default:
      console.error('Unsupported data type');
  }
}

module.exports = convertData;
