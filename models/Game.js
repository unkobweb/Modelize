const Sequelize = require("sequelize");
const db = require("../config/database");

const Game = db.define(
	"games",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		title: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.STRING,
		},
		slug: {
			type: Sequelize.STRING,
		},
		quantity: {
			type: Sequelize.INTEGER,
		},
		price: {
			type: Sequelize.FLOAT,
		},
		discount: {
			type: Sequelize.INTEGER,
		},
		plateform_id: {
			type: Sequelize.INTEGER,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Game;