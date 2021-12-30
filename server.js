const log = console.log;
let arg = require('minimist')(process.argv.slice(2));
global.log = (msg) => {
	if (arg.dev) console.log(msg);
};
global.__root = __dirname;

const enableDestroy = require('server-destroy');
const express = require('express');
const http = require('http');
const fs = require('fs-extra');
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

// klaw gets the names of files in a directory
// makes klaw async
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

const pDog = require('pug');
global.pug = (str, locals, insert) => {
	str = pDog.compile(str)(locals);
	if (insert) {
		str = str.insert(insert, str.lastIndexOf('<'));
	}
	return str;
};

// load database;fs = file system
let db = JSON.parse(fs.readFileSync('inventory.json'));
let users = JSON.parse(fs.readFileSync('users.json'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function useStatic(folder) {
	app.use(folder, express.static(__root + folder));
}
useStatic('/node_modules/bootstrap');
useStatic('/node_modules/jquery');
useStatic('/node_modules/moment');
useStatic('/node_modules/@popperjs');
useStatic('/node_modules/tether');
useStatic('/node_modules/font-awesome');
useStatic('/node_modules/mdb-ui-kit');
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
		file = file.split('?')[0];
		file = path.parse(file);
		if (file.ext != '.pug') continue;
		if (file.name == 'index') file.name = '';

		let dir = file.dir.split('/').slice(-1);
		if (dir == 'pug') dir = null;

		let locals = {
			//set locals.cats equal to categories objects, use : instead of =
			cats: db.categories,
			user: null
		};

		app.get('/' + (dir ? dir + '/' : '') + file.name, (req, res) => {
			locals.user = users['valencia01'];

			if (req.url == '/') {
				req.url = 'index';
			}
			log('requested ' + req.url);
			res.render('pug/' + req.url, locals);
		});
	}
}

async function startServer() {
	await loadViews();

	app.all('/categories.json', (req, res) => {
		res.json(db.categories);
	});

	// category is a number (0 is not valid)
	// type is a number (0 for all)
	// subtype is a number (0 for all)
	app.all('/items/:category/:type/:subtype', (req, res) => {
		try {
			let p = req.params;
			let inventory = [];
			if (p.category == 0) {
				for (let category of db.categories.names) {
					inventory = inventory.concat(db[category]);
				}
			} else {
				inventory = db[db.categories.names[p.category - 1]];
			}
			let items = [];
			let count = 0;
			for (let item of inventory) {
				if (p.type == 0 || item.type == p.type) {
					if (p.subtype == 0 || item.subtype == p.subtype) {
						items.push(item);
						count++;
						if (count > 30) break;
					}
				}
			}
			res.json({ items });
		} catch (e) {
			res.send('404 Not found or invalid format ' + e.message);
		}
	});

	app.post('/user', async (req, res) => {
		let data = req.body; // request body is the json sent
		let user = users[data.username];
		Object.assign(user, data);
		log(user);

		// save updated user info to users file
		await fs.outputFile('users.json', JSON.stringify(users));

		res.json(user);
	});

	let server = http.createServer(app);

	server.listen(3001, () => {
		log('server listening on port 3001');
		// opn('http://localhost:3001');
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
