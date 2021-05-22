var XLSX = require('xlsx');

const excelToJSON = (path) => {
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  var headers = {};
  var data = [];
  sheet_name_list.forEach(function (y) {
    var worksheet = workbook.Sheets[y];

    // var headers = {};
    // var data = [];
    for (z in worksheet) {
      if (z[0] === '!') continue;
      //parse out the column, row, and value
      var col = z.substring(0, 1);
      var row = parseInt(z.substring(1));
      var value = worksheet[z].v;
      if (row == 1) {
        headers[col] = value;
        // storing the header names
        continue;
      }
      if (!data[row]) data[row] = {};
      data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
    JSON.stringify(data);
    //console.log(data);
    // return data;
  });
  return data;
};

module.exports = {excelToJSON};
