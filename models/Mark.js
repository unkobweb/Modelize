const Sequelize = require("sequelize");
const db = require("../config/database");

const Mark = db.define(
	"marks",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		user_id: {
			type: Sequelize.INTEGER,
		},
		game_id: {
			type: Sequelize.INTEGER,
		},
		mark: {
			type: Sequelize.INTEGER,
		},
		review: {
			type: Sequelize.STRING,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Mark;