const mysql = require("mysql");
require("dotenv").config();
const modelController = require("./modelController");
const fs = require("fs");

class mariadbController {
  mariadb = [
    "int",
    "bigint",
    "varchar",
    "timestamp",
    "tinyint",
    "text",
    "longtext",
  ];
  sequelize = [
    "INTEGER",
    "BIGINT",
    "STRING",
    "DATE",
    "TINYINT",
    "TEXT",
    "TEXT",
  ];

  convert = [];
  constructor() {
    // Create array to chose the correct Sequelize type from PostgreSQL type
    for (let i = 0; i < this.mariadb.length; i++) {
      this.convert[this.mariadb[i]] = this.sequelize[i];
    }
  }

  async fromMariaDBToJSON() {
    let db = [];

    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT || 3306,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    connection.connect();

    let getAllTable = new Promise((resolve, reject) => {
      connection.query(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE table_schema = '" +
          process.env.DB_NAME +
          "'",
        (err, rows) => {
          resolve(rows);
        }
      );
    });
    let allTable = await getAllTable;
    let allChoices = await modelController.selectTable(allTable);

    function getAllColumn(name) {
      return new Promise((resolve, reject) => {
        let objet = {
          nom: name,
          attributs: [],
        };
        connection.query(
          "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='" +
            name +
            "';",
          (err, rows) => {
            for (let ligne of rows) {
              objet.attributs.push({
                nom: ligne.column_name,
                type: ligne.data_type,
              });
            }
            db.push(objet);
            resolve();
          }
        );
      });
    }
    for (let table of allChoices.choosen) {
      await getAllColumn(table);
    }
    for (let table of db) {
      modelController.fromJSONtoModel(table, this.convert);
    }
  }
}

module.exports = mariadbController;

/*
 */
