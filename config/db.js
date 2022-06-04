const { sequelize } = require("../models");

module.exports = async function () {
	try {
		await sequelize.authenticate();
		console.log('Database connected');
		return sequelize;
	} catch (e) {
		console.log(e);
	}
};
