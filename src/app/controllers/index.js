const fs = require("fs");
const path = require("path");

module.exports = app => {
  //  ler um diretorio, filtra que o nome nao comeca com '.' e nao queremos que seja o index.js
  fs.readdirSync(__dirname)
    .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
    .forEach(file => require(path.resolve(__dirname, file))(app));
};
