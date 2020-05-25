#!/usr/bin/env node

// Modules
const fs = require("fs");
const inquirer = require("inquirer");
const chalk = require("chalk");

// Controllers
const pgController = require("../controllers/pgController");
const postgre = new pgController();
const mariadbController = require("../controllers/mariadbController");
const mariadb = new mariadbController();

// Check if Models directory exist, if not, create it
let dir = "./models";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// CLI
async function askUser() {
  console.log("\n");

  let answer = await inquirer.prompt({
    type: "list",
    name: "SQLType",
    message: "Would you use a SQL file or a DB connection ?\n",
    choices: [
      "DB Connection - " + chalk.green.bold("RECOMMANDED"),
      "SQL File - " + chalk.blue.bold("PostgreSQL only"),
    ],
  });
  answer = answer.SQLType.toString();
  console.log("\n");

  let ORM = await inquirer.prompt({
    type: "list",
    name: "ORM",
    message: "Select your ORM ?\n",
    choices: [chalk.yellow.bold("Sequelize"), chalk.magenta.bold("Eloquent")],
  });
  ORM = ORM.ORM.toString();

  console.log("\n");
  let database = await inquirer.prompt({
    type: "list",
    name: "database",
    message: "What is the database used ?\n",
    choices:
      answer == "SQL File"
        ? [chalk.blue.bold("PostgreSQL")]
        : [chalk.blue.bold("PostgreSQL"), chalk.yellow.bold("MariaDB / MySQL")],
  });
  database = database.database.toString();
  console.log("\n");

  if (answer == "SQL File - " + chalk.blue.bold("PostgreSQL only")) {
    // SQL FILE
    let filename = "";
    while (1) {
      filename = await inquirer.prompt({
        type: "input",
        name: "filename",
        message: "What is the name of the SQL file ?\n",
      });
      filename = filename.filename.replace("./", "").replace(".sql", "");
      if (fs.existsSync("./" + filename + ".sql")) {
        console.log(chalk.green.bold("\n./" + filename + ".sql found !\n"));
        break;
      }
      console.log(chalk.red.bold("\n./" + filename + ".sql not found !\n"));
    }
    if (database == chalk.blue.bold("PostgreSQL")) {
      postgre.readFile(filename);
    }
  } else {
    // DB CONNECTION
    if (!process.env.DB_HOST) {
      console.log(chalk.red("DB_HOST in .env not found !"));
      process.exit(1);
    }
    if (!process.env.DB_PORT) {
      console.log(
        chalk.red("DB_PORT in .env not found !") +
          " Default port will be used !\n"
      );
    }
    if (!process.env.DB_USER) {
      console.log(chalk.red("DB_USER in .env not found !"));
      process.exit(1);
    }
    if (!process.env.DB_PASS) {
      console.log(chalk.red("DB_PASS in .env not found !"));
      process.exit(1);
    }
    if (!process.env.DB_NAME) {
      console.log(chalk.red("DB_NAME in .env not found !"));
      process.exit(1);
    }
    if (database == chalk.blue.bold("PostgreSQL")) {
      postgre.fromPostgreDBToJSON(ORM);
    } else if (database == chalk.yellow.bold("MariaDB / MySQL")) {
      mariadb.fromMariaDBToJSON(ORM);
    }
  }
}
askUser();
