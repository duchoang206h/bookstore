const app = require('./app');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.IP, () => {
	console.log(`Server started on port ${PORT} on ${process.env.NODE_ENV} mode`);
});
