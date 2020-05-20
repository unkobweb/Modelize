// Modules
const fs = require("fs");

// Create array to chose the correct Sequelize type from PostgreSQL type
const postgres = [
  "serial",
  "integer",
  "text",
  "timestamp",
  "timestamp without time zone",
  "date",
  "boolean",
  "numeric",
];
const sequelize = [
  "INTEGER",
  "INTEGER",
  "STRING",
  "DATE",
  "DATE",
  "DATEONLY",
  "BOOLEAN",
  "FLOAT",
];

let convert = [];
for (let i = 0; i < postgres.length; i++) {
  convert[postgres[i]] = sequelize[i];
}

// Check if Models directory exist, if not, create it
let dir = "./models";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Change .sql to a JSON object
function fromPostgreToJSON(sqlData) {
  let db = [];
  let tempArray = sqlData.split(";");

  for (let requete of tempArray) {
    let splitReq = requete.split("\r\n");

    if (splitReq.length > 1 && requete.indexOf("CREATE TABLE") != -1) {
      let table = {
        nom: "",
        attributs: [],
      };

      for (let ligne of splitReq) {
        ligne = ligne.toLowerCase();

        if (ligne == "" || ligne == ")" || ligne.indexOf("foreign key") != -1) {
          continue;
        } else if (ligne.indexOf("create table") != -1) {
          table.nom = ligne
            .replace("create table", "")
            .replace("if not exists", "")
            .trim()
            .slice(0, -1);
        } else {
          console.log("LIGNE : " + ligne);
          ligne = ligne.toLowerCase();
          ligne = ligne.trim();
          ligne = ligne.replace(",", "");
          let attribut = {
            nom: ligne.split(" ")[0],
            type: ligne.split(" ")[1],
            primaryKey: ligne.indexOf("primary key") != -1 ? true : false,
          };
          table.attributs.push(attribut);
        }
      }
      db.push(table);
    }
  }
  return db;
}

// Change JSON object to a .js model
function fromJSONtoModel(table) {
  let nom =
    table.nom[table.nom.length - 1] == "s" ? table.nom.slice(0, -1) : table.nom;
  nom = nom[0].toUpperCase() + nom.slice(1);
  let content =
    'const Sequelize = require("sequelize");\nconst db = require("../config/database");\n\nconst ' +
    nom +
    ' = db.define(\n\t"' +
    table.nom +
    '",\n\t{';
  for (let attribut of table.attributs) {
    content +=
      "\n\t\t" +
      attribut.nom +
      ": {\n\t\t\ttype: Sequelize." +
      convert[attribut.type] +
      ",";
    if (attribut.primaryKey == true) {
      content += "\n\t\t\tprimaryKey: true,\n\t\t},";
    } else {
      content += "\n\t\t},";
    }
  }
  content +=
    "\n\t},\n\t{\n\t\ttimestamps: false,\n\t}\n);\n\nmodule.exports = " +
    nom +
    ";";
  fs.writeFile("./models/" + nom + ".js", content, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// Read content of data.sql
fs.readFile("./data.sql", "utf8", function (err, contents) {
  if (err) {
    console.log("Read ERROR : " + err);
  } else {
    //console.log(JSON.stringify(fromPostgreToJSON(contents), null, 2));
    let db = fromPostgreToJSON(contents);
    console.log(JSON.stringify(db, null, 2));
    for (let table of db) {
      fromJSONtoModel(table);
    }
  }
});
