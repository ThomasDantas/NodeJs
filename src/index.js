const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // mandar requisicoes para api em json
app.use(bodyParser.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
//   // req - paremetros de requisao; res - 'mostrar' alguma coisa para o usuario
//   res.send("ok");
// });

require("./app/controllers/index")(app);
app.listen(3000);
