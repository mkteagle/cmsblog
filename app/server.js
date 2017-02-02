(function () {
	let express = require('express');
	let app = express();

	let bodyParser = require('body-parser');
	let morgan      = require('morgan');

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(morgan('prod'));
	// Get our API routes
	const api = require('./server/routes/api');
	// Set our api routes
	app.use('/api', api);
	app.use('/uploads', express.static(__dirname + '/uploads'));
	app.use('/admin', express.static(__dirname + '/admin'));
	app.use('/', express.static(__dirname + '/'));

	let port = (process.env.PORT || 8080);

	app.get('*', function (req, res) {
		res.sendFile(__dirname + '/index.html');
	});
	app.listen(port, function () {
		console.log(`App listening on port ${port}...`);
	});
})();