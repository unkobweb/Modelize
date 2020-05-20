const Sequelize = require("sequelize");
const db = require("../config/database");

const Cdkey = db.define(
	"cdkeys",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		game_id: {
			type: Sequelize.INTEGER,
		},
		cd_key: {
			type: Sequelize.STRING,
		},
		is_used: {
			type: Sequelize.BOOLEAN,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Cdkey;