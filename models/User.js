const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.define(
	"users",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		username: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		date_of_birth: {
			type: Sequelize.DATEONLY,
		},
		balance: {
			type: Sequelize.FLOAT,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = User;