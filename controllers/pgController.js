// Modules
const { Client } = require("pg");
require("dotenv").config();
const modelController = require("./modelController");
const fs = require("fs");

class pgController {
  postgres = [
    "serial",
    "integer",
    "text",
    "timestamp",
    "date",
    "boolean",
    "numeric",
  ];
  sequelize = [
    "INTEGER",
    "INTEGER",
    "STRING",
    "DATE",
    "DATEONLY",
    "BOOLEAN",
    "FLOAT",
  ];

  convert = [];
  constructor() {
    // Create array to chose the correct Sequelize type from PostgreSQL type
    for (let i = 0; i < this.postgres.length; i++) {
      this.convert[this.postgres[i]] = this.sequelize[i];
    }
  }

  fromPostgreSQLToJSON(sqlData) {
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

          if (
            ligne == "" ||
            ligne == ")" ||
            ligne.indexOf("foreign key") != -1
          ) {
            continue;
          } else if (ligne.indexOf("create table") != -1) {
            table.nom = ligne
              .replace("create table", "")
              .replace("if not exists", "")
              .trim()
              .slice(0, -1);
          } else {
            //console.log("LIGNE : " + ligne);
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

  // Take all tables from a postgre database and transform it to a JSON object
  async formPostgreDBToJSON() {
    let db = [];
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    client.connect();

    let res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );
    //console.log(err ? err : res.rows);

    for (let table of res.rows) {
      let objet = {
        nom: table.table_name,
        attributs: [],
      };
      //console.log(table.table_name);
      let lignes = await client.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
        [table.table_name]
      );
      //console.log(lignes.rows);
      for (let ligne of lignes.rows) {
        objet.attributs.push({
          nom: ligne.column_name,
          type: ligne.data_type,
        });
      }
      //console.log(objet);
      db.push(objet);
    }
    return db;
  }

  // Read content of data.sql
  readFile(filename = "data") {
    fs.readFile("./" + filename + ".sql", "utf8", (err, contents) => {
      if (err) {
        console.log("Read ERROR : " + err);
      } else {
        //console.log(JSON.stringify(fromPostgreToJSON(contents), null, 2));
        let db = this.fromPostgreSQLToJSON(contents);
        for (let table of db) {
          modelController.fromJSONtoModel(table, this.convert);
        }
      }
    });
  }
}

module.exports = pgController;
