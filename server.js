let arg = require('minimist')(process.argv.slice(2));
global.log = (msg) => {
	if (arg.dev) console.log(msg);
};
global.__root = __dirname;

const enableDestroy = require('server-destroy');
const express = require('express');
const http = require('http');
global.opn = require('open');
global.os = require('os');
global.path = require('path');
// const https = require('https');
let app = express();

global.osType = os.type();
global.linux = osType == 'Linux';
global.mac = osType == 'Darwin';
global.win = osType == 'Windows_NT';
if (win) {
	osType = 'win';
} else if (mac) {
	osType = 'mac';
} else if (linux) {
	osType = 'linux';
}

global.klaw = function (dir, opt) {
	return new Promise((resolve, reject) => {
		let items = [];
		let i = 0;
		require('klaw')(dir, opt)
			.on('data', (item) => {
				if (i > 0) {
					if (!(mac && i == 1 && path.parse(item.path).base == '.DS_Store')) {
						if (win) item.path = item.path.replace(/\\/g, '/');
						items.push(item.path);
					}
				}
				i++;
			})
			.on('end', () => resolve(items))
			.on('error', (err, item) => reject(err, item));
	});
};

function useStatic(folder) {
	app.use(folder, express.static(__root + folder));
}
useStatic('/node_modules/bootstrap');
useStatic('/node_modules/jquery');
useStatic('/node_modules/moment');
useStatic('/node_modules/@popperjs');
useStatic('/node_modules/tether');
// useStatic('/views/img');

// sets the views folder as the main folder
app.set('views', __root + '/views');
app.use(express.static(__root + '/views'));
// sets up pug as the view engine
// pug is template framework for rendering html dynamically
app.set('view engine', 'pug');

async function loadViews() {
	let files = await klaw(__root + '/views/pug');
	for (file of files) {
		file = path.parse(file);
		if (file.ext != '.pug') continue;
		if (file.name == 'index') file.name = '';

		app.get('/' + file.name, (req, res) => {
			let name = req.url;
			if (name == '/') {
				name = 'index';
			}
			log('requested ' + name);
			res.render('pug/' + name, {});
		});
	}
}

async function startServer() {
	await loadViews();

	let server = http.createServer(app);

	server.listen(3001, () => {
		log('server listening on port 3001');
		opn('http://localhost:3001');
	});

	enableDestroy(server);

	process.on('SIGINT', () => {
		log('\nGracefully shutting down from SIGINT (Ctrl-C)');
		server.destroy(() => {
			log(`closing server`);
			process.exit();
		});
	});
}

startServer();
