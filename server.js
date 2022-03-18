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
const { filters } = require('pug/lib');
global.pug = (str, locals, insert) => {
	str = pDog.compile(str)(locals);
	if (insert) {
		str = str.insert(insert, str.lastIndexOf('<'));
	}
	return str;
};

// load database;fs = file system
let orders = JSON.parse(fs.readFileSync('orders.json'));
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

let currentUser = 'valencia01';

let defaultLocals = {
	fora: fora,
	user: users[currentUser]
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
			if (req.url == '/account/orders') {
				//must get from specific user
				locals.userOrders = getUserOrders();
			}
			if (req.url == '/admin/orderRequests') {
				//can access orders.JSON file directly
				locals.unconfirmed = orders.unconfirmed;
				locals.confirmed = orders.confirmed;
			}
			req.url = req.url.split('?')[0];
			log('requested ' + req.url);
			res.render('pug/' + req.url, locals);
		});
	}
}

function getUserOrders() {
	let userOrders = [];
	let user = users[currentUser];

	//user.orders is an array of order IDs
	for (let orderID of user.orders) {
		//check if the orderID is in the unconfirmed section in orders.JSON
		let order = orders.unconfirmed.find((x) => x.id == orderID);
		//if not found, it checks in the confirmed section in orders.JSON
		if (!order) order = orders.confirmed.find((x) => x.id == orderID);
		userOrders.push(order);
	}
	log(userOrders);
	//userOrders return an array of order objects
	return userOrders;
}

async function startServer() {
	await loadViews();

	app.get('/userOrders', (req, res) => {
		res.json({
			userOrders: getUserOrders()
		});
	});

	//create request for unconfirmed orders through this link
	app.get('/admin/unconfirmed', (req, res) => {
		res.json({
			unconfirmed: orders.unconfirmed
		});
	});

	//create request for confirmed orders through this link
	app.get('/admin/confirmed', (req, res) => {
		res.json({
			confirmed: orders.confirmed
		});
	});

	app.get('/admin/confirmRequest/:id', async (req, res) => {
		let { id } = req.params;

		// find order in unconfrimed orders array
		let order = orders.unconfirmed.find((x) => x.id == orderID);
		// move to beginning of confirmed orders array
		orders.confirmed.unshift(order);
		// change confirmed attr with time confirmed
		order.confirmed = Date.now();
		// save orders in order.json

		log(id);

		res.json({
			msg: 'success'
		});
	});

	app.get('/admin/sendItemsRequest/:id', async (req, res) => {
		let { id } = req.params;

		// find order in confirmed orders array

		// change sent attr with time sent

		// save orders in orders.json

		res.json({
			msg: 'success'
		});
	});

	app.all('/settings.json', (req, res) => {
		res.json(fora);
	});

	function getItemIDNums(category, type, subtype) {
		let id = {
			category: fora.categories.names.indexOf(category) + 1
		};

		if (type) {
			id.type = fora.categories[category].typeNames.indexOf(type) + 1;
			if (subtype) {
				id.subtype = fora.categories[category][type].indexOf(subtype) + 1;
			} else {
				id.subtype = 0;
			}
		} else {
			id.type = 0;
		}
		return id;
	}

	function getStorePage(req, res) {
		let { category, type, subtype } = req.params;
		let locals = defaultLocals;
		// numbers go here
		locals.store = getItemIDNums(category, type, subtype);
		res.render('pug/store', locals);
	}

	app.get('/store/:category', getStorePage);

	app.get('/store/:category/:type', getStorePage);

	app.get('/store/:category/:type/:subtype', getStorePage);

	//reference: https://expressjs.com/en/guide/routing.html
	app.get('/store/:category/:type/:subtype?*', getStorePage);

	// category is a number (0 is not valid)
	// type is a number (0 for all)
	// subtype is a number (0 for all)
	function searchForItems(req, res, url) {
		try {
			// url: /clothing/tops?season=fall+winter&size=M&color=Black
			if (url) {
				// let filters = {season: ['fall', 'winter'],size: 'M',color:'Black'};
				let filters = {};
			}
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
							if (!filters.season || filters.season.includes(item.season)) {
								items.push(item);
							}
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

	app.all('/items/:category/:type/:subtype?*', (req, res) => {
		let url = req.url;
		searchForItems(req.params, res, url);
	});

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
		await fs.outputFile('users.json', JSON.stringify(users, null, 2));

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

	app.get('/admin/inventoryNumOfItems', (req, res) => {
		let { clothing, shoes, bags, accessories } = db;
		let inventoryNumOfItems = clothing.length + shoes.length + bags.length + accessories.length;
		res.json({ inventoryNumOfItems });
	});

	app.post('/admin/inventory', async (req, res) => {
		let item = req.body; // request body is the json sent

		for (let prop of fora.numberProps) {
			if (item[prop]) item[prop] = Number(item[prop]);
		}

		let newItem = !item.id;

		if (newItem) {
			item.id = [item.category, item.type, item.subtype].join('');
			item.id += Math.floor(Math.random() * 9000 + 1000);
		}
		// if item should be edited it will be found in the inventory
		let items = db[fora.categories.names[item.category]];
		let idx = null;
		while (idx == null || (newItem && idx >= 0)) {
			idx = items.findIndex((x) => x.id == item.id);
			if (newItem && idx >= 0) {
				item.id = (item.id + 1) % 10000;
			}
		}
		// if idx is 0 or greater it was found
		if (idx >= 0) {
			items[idx] = item;
		} else {
			// if item was not found in the list add it
			items.push(item);
		}
		log(item);
		// save updated user info to users file
		await fs.outputFile('inventory.json', JSON.stringify(db, null, 2));

		res.json(item);
	});

	app.post('/account/cart/orderRequest', async (req, res) => {
		let order = req.body;
		log(order);

		order.id = orders.numOfOrders;

		//add to beginning of array instead of end
		orders.unconfirmed.unshift(order);

		let user = users[currentUser];
		user.orders.unshift(order.id);

		user.reserved = [];
		if (order.coupon != 0) {
			user.coupons[order.coupon]--;
		}
		orders.numOfOrders++;

		await fs.outputFile('orders.json', JSON.stringify(orders, null, 2));
		await fs.outputFile('users.json', JSON.stringify(users, null, 2));

		res.json({
			msg: 'success'
		});
	});

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
