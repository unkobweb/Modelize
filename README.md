![npm](https://img.shields.io/npm/v/modelize-cli)
![npm bundle size](https://img.shields.io/bundlephobia/min/modelize)
# Modelize
Modelize is a NodeJS script which allow you to transform a sql file or a database connexion into several models (one by table) for different ORM.

## Compatibility
#### SQL File
- PostgreSQL syntax
#### Databases
- PostgreSQL
- MariaDB / MySQL
#### ORM
- Sequelize
- Eloquent

## Configuration

#### SQL File

A `data.sql` sql file contains the script of creation of your tables, using syntaxs supported (See category « Compatibility »). Don’t forget to use ` ; `  at the end of your requests to make the script work.

#### Database connection

Create .env file at the root of your project containing the next informations :

    DB_HOST=<your_host_address>
    DB_PORT=<port_of_the_database> //If it's empty, it will take the default port of your SGBDR
    DB_USER=<username>
    DB_PASS=<password>
    DB_NAME=<name_of_the_database>
    

## Utilisation
 
Instruction to install the project :  
`npm install -g modelize-cli`

Then you just need to launch the nex instruction from the root of your project :
`modelize`
