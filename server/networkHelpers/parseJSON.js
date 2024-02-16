function parseJSON(data) {
  try {
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (error) {
    console.error('Error converting data to JSON');
    throw error;
  }
}

module.exports = parseJSON;
