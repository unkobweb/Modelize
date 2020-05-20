const Sequelize = require("sequelize");
const db = require("../config/database");

const Cart = db.define(
	"carts",
	{
		user_id: {
			type: Sequelize.INTEGER,
		},
		game_id: {
			type: Sequelize.INTEGER,
		},
		quantity: {
			type: Sequelize.INTEGER,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Cart;