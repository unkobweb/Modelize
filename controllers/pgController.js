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
    "timestamp without time zone",
    "date",
    "boolean",
    "numeric",
  ];
  sequelize = [
    "INTEGER",
    "INTEGER",
    "STRING",
    "DATE",
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
  async fromPostgreDBToJSON(orm) {
    let db = [];
    const client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    client.connect().catch((err) => {
      console.log(
        "Modelize can't connect to you DB ! Please check your .env !\n"
      );
    });

    let res = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    );

    let allChoices = await modelController.selectTable(res.rows);
    for (let table of allChoices.choosen) {
      let objet = {
        nom: table,
        attributs: [],
      };
      //console.log(table.table_name);
      let lignes = await client.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
        [table]
      );
      let primary = await client.query(
        "select column_name from information_schema.table_constraints tco join information_schema.key_column_usage kcu on kcu.constraint_name = tco.constraint_name and kcu.constraint_schema = tco.constraint_schema and kcu.constraint_name = tco.constraint_name where tco.constraint_type = 'PRIMARY KEY' AND kcu.table_name = $1 order by kcu.table_schema, kcu.table_name;",
        [table]
      );
      let primarys = [];
      for (let key of primary.rows) {
        primarys.push(key.column_name);
      }
      for (let ligne of lignes.rows) {
        let attribut = {
          nom: ligne.column_name,
          type: ligne.data_type,
        };
        if (primarys.indexOf(ligne.column_name) != -1) {
          attribut.primaryKey = true;
        }
        objet.attributs.push(attribut);
      }
      //console.log(objet);
      db.push(objet);
    }
    for (let table of db) {
      modelController.fromJSONtoModel(table, this.convert, orm);
    }
  }

  // Read content of data.sql
  readFile(filename = "data") {
    fs.readFile("./" + filename + ".sql", "utf8", (err, contents) => {
      if (err) {
        console.log("Read ERROR : " + err);
      } else {
        //console.log(JSON.stringify(fromPostgreToJSON(contents), null, 2));
        let db = this.fromPostgreSQLToJSON(contents);
        console.log(`${db.length} tables found\n`);
        for (let table of db) {
          modelController.fromJSONtoModel(table, this.convert, orm);
        }
      }
    });
  }
}

module.exports = pgController;
