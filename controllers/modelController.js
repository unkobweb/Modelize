// Modules
const fs = require("fs");

class modelController {
  // Change JSON object to a .js model
  static async fromJSONtoModel(table, convert) {
    let nom =
      table.nom[table.nom.length - 1] == "s"
        ? table.nom.slice(0, -1)
        : table.nom;
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
    await fs.writeFile("./models/" + nom + ".js", content, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(nom + " model has been created");
      }
    });
  }
}

module.exports = modelController;
