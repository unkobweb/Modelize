// Modules
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");

class modelController {
  // Change JSON object to a .js model
  static async fromJSONtoModel(table, convert, orm) {
    let nom =
      table.nom[table.nom.length - 1] == "s"
        ? table.nom.slice(0, -1)
        : table.nom;
    nom = nom[0].toUpperCase() + nom.slice(1);
    if (orm == chalk.yellow.bold("Sequelize")) {
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
    } else {
      let content = `<?php\n\nnamespace App;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass ${nom} extends Model\n{\n\tprotected $name = '${table.nom}';\n\tprotected $fillable = [`;
      for (let attribut of table.attributs) {
        content += `\n\t\t'${attribut.nom}',`;
      }
      content += `\n\t];\n}`;
      await fs.writeFile("./models/" + nom + ".php", content, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(nom + " model has been created");
        }
      });
    }
  }

  static async selectTable(tables) {
    let allChoices = [];
    for (let table of tables) {
      allChoices.push({
        name: table.TABLE_NAME || table.table_name,
        checked: true,
      });
    }
    let choosen = await inquirer.prompt({
      type: "checkbox",
      name: "choosen",
      message: `${tables.length} tables found, choose which you want :\n`,
      choices: allChoices,
    });
    console.log();
    return choosen;
  }
}

module.exports = modelController;
