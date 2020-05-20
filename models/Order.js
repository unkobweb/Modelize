const Sequelize = require("sequelize");
const db = require("../config/database");

const Order = db.define(
	"orders",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		user_id: {
			type: Sequelize.INTEGER,
		},
		date_of_sale: {
			type: Sequelize.undefined,
		},
		state: {
			type: Sequelize.INTEGER,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Order;