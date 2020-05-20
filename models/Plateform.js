const Sequelize = require("sequelize");
const db = require("../config/database");

const Plateform = db.define(
	"plateforms",
	{
		id: {
			type: Sequelize.INTEGER,
		},
		name: {
			type: Sequelize.STRING,
		},
	},
	{
		timestamps: false,
	}
);

module.exports = Plateform;