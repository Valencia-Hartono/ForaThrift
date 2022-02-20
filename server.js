const log = console.log;
let arg = require('minimist')(process.argv.slice(2));
global.log = (msg) => {
	if (arg.dev) console.log(msg);
};
global.__root = __dirname;

const delay = require('delay');
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
let fora = JSON.parse(fs.readFileSync('settings.json'));

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

let defaultLocals = {
	fora: fora,
	user: users['valencia01']
};

async function loadViews() {
	let files = await klaw(__root + '/views/pug');
	for (file of files) {
		file = file.split('?')[0];
		file = path.parse(file);
		if (file.ext != '.pug') continue;
		if (file.name == 'index') file.name = '';

		let dir = file.dir.split('/').slice(-1);
		if (dir == 'pug') dir = null;

		app.get('/' + (dir ? dir + '/' : '') + file.name, (req, res) => {
			let locals = defaultLocals;
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

	app.all('/settings.json', (req, res) => {
		res.json(fora);
	});

	function getStorePage(req, res) {
		let { category, type, subtype } = req.params;
		let locals = defaultLocals;
		// numbers go here
		locals.store = {
			category: fora.categories.names.indexOf(category) + 1,
			type: fora.categories[category].typeNames.indexOf(type) + 1
		};

		if (type) {
			locals.store.subtype = fora.categories[category][type].indexOf(subtype) + 1;
		} else {
			locals.store.subtype = 0;
		}
		res.render('pug/store', locals);
	}

	app.get('/store/:category', getStorePage);

	app.get('/store/:category/:type', getStorePage);

	app.get('/store/:category/:type/:subtype', getStorePage);

	// category is a number (0 is not valid)
	// type is a number (0 for all)
	// subtype is a number (0 for all)
	function searchForItems(req, res) {
		try {
			let inventory = [];
			if (req.category == 0) {
				for (let category of fora.categories.names) {
					inventory = inventory.concat(db[category]);
				}
			} else {
				inventory = db[fora.categories.names[req.category - 1]];
			}
			let items = [];
			let count = 0;
			for (let item of inventory) {
				if (req.type == 0 || item.type == req.type - 1) {
					if (req.subtype == 0 || item.subtype == req.subtype - 1) {
						if (!req.id || item.id == req.id) {
							items.push(item);
						}
						count++;
						if (count > 30) break;
					}
				}
			}
			if (!req.id) {
				res.json({ items });
			} else {
				res.json({ item: items[0] });
			}
		} catch (e) {
			res.send('404 Not found or invalid format ' + e.message);
		}
	}

	app.all('/items/:category/:type/:subtype', (req, res) => {
		searchForItems(req.params, res);
	});

	app.all('/item/:id', (req, res) => {
		req = req.params;
		req.category = Number(req.id[0]) + 1;
		req.type = Number(req.id[1]) + 1;
		req.subtype = Number(req.id[2]) + 1;
		searchForItems(req, res);
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

	app.post('/item', async (req, res) => {
		let data = req.body; // request body is the json sent
		let user = users[data.username];

		if (data.action == 'add') {
			if (!user[data.list].includes(data.item)) user[data.list].push(data.item);
		} else {
			user[data.list].splice(user[data.list].indexOf(data.item), 1);
		}

		// save updated user info to users file
		await fs.outputFile('users.json', JSON.stringify(users, null, 2));

		res.json(user[data.list]);
	});

	app.post('/admin/inventoryNumOfItems', async (req, res) => {
		let { clothing, shoes, bags, accessories } = db;
		let inventoryNumOfItems = clothing.length + shoes.length + bags.length + accessories.length;
		res.json({ inventoryNumOfItems });
	});

	app.post('/admin/inventory', async (req, res) => {
		let item = req.body; // request body is the json sent
		log(item);

		let items = db[item.category];

		// if item should be edited it will be found in the inventory
		let idx = items.findIndex((x) => x == item.id);
		// if idx is 0 or greater it was found
		if (idx >= 0) {
			items[idx] = item;
		} else {
			// if item was not found in the list add it
			items.push(item);
		}

		// save updated user info to users file
		await fs.outputFile('inventory.json', JSON.stringify(db));

		res.json(item);
	});

	// (async function saveDataPeriodically() {
	// 	await delay(10000);

	// })();

	let server = http.createServer(app);

	let port = 3125;

	server.listen(port, () => {
		log('server listening on port ' + port);
		// opn('http://localhost:3125');
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
