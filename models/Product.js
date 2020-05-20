const Sequelize = require("sequelize");
const db = require("../config/database");

const Product = db.define(
	"products",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		order_id: {
			type: Sequelize.INTEGER,
		},
		game_id: {
			type: Sequelize.INTEGER,
		},
		key_id: {
			type: Sequelize.INTEGER,
		},
		price: {
			type: Sequelize.FLOAT,
		},
		discount: {
			type: Sequelize.INTEGER,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Product;