// Modules
const fs = require("fs");
// Controllers
const modelController = require("./controllers/modelController");
const pgController = require("./controllers/pgController");
const postgre = new pgController();

// Check if Models directory exist, if not, create it
let dir = "./models";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

postgre.readFile();

//formPostgreDBToJSON().then((res) => console.log(JSON.stringify(res, null, 2)));
/*formPostgreDBToJSON().then((res) => {
  for (let table of res) {
    fromJSONtoModel(table);
  }
});*/
