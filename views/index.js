const log = console.log; // shortcut

// enable popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
	return new bootstrap.Popover(popoverTriggerEl);
});
// enable tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

function getFormData(formID) {
	let fd = new FormData(document.getElementById(formID));
	let data = {};
	for (var entry of fd.entries()) {
		data[entry[0]] = entry[1];
	}
	return data;
}

async function getItem(id) {
	let url = '/item/' + id;
	let res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	res = await res.json();
	if (!res.item) {
		console.warn('Item not found: ' + id);
		return null;
	}
	return res.item;
}

async function getItems(itemIDs) {
	let items = [];
	for (let id of itemIDs) {
		let item = await getItem(id);
		if (item) items.push(item);
	}
	return items;
}

function displayItems(elem, items) {
	// gets the element with id="items"
	let $items = $(elem);
	$items.empty();

	if (!items || !items.length) {
		$items.text('No items were found that match your search!');
		return;
	}
	//loop through items array
	for (let item of items) {
		//in each grid, add the div with item's id. This div includes the image, and then a container on the bottom with the name and the price
		$items.append(`
		<div id="${item.id}" class="col-6 col-md-3 mt-3 mb-3">
			<img src="${item.img}" object-fit width="300" height="300"/>
			<div class="container mt-2">
				<font size="2px">
					<div class="row">
						${item.name}
					</div>
					<div class="row">
						${item.price} RMB
					</div>
				</font>
			</div>
		</div>`);
		//appends item information in its respective descriptor modal (found in itemModal.pug) and should open on click
		$('#' + item.id)[0].onclick = () => {
			log(item.id);
			fora.clickedItemID = item.id;
			$('#itemModal').modal('show');
			// $('#itemModal #item_img').prepend(`<img src='${item.img}' />`);

			//appends item information to modal header
			$('#itemModal #item_name').text(item.name);
			$('#itemModal #item_id').text(item.id);

			//appends item ratings to column 1
			$('#itemModal #item_qualityRating').text('Quality: ' + item.rating[0] + '/5');
			$('#itemModal #item_styleRating').text('Style: ' + item.rating[1] + '/5');
			$('#itemModal #item_valueRating').text('Value: ' + item.rating[2] + '/5');

			//appends item information to column 2
			$('#itemModal #item_brand').text(' Brand: ' + item.brand);
			$('#itemModal #item_color').text(' Color: ' + fora.color[item.color]);
			$('#itemModal #item_size').text(' Size: ' + fora.size[item.size]);
			$('#itemModal #item_price').text(' Price: ' + item.price + ' RMB');

			//appends number of people queueing for item to column 3 by returning length of queue array storing users' names
			$('#itemModal #numReserve').text(item.reserved.length);

			$('#item_reserved')[0].checked = user.reserved.includes(item.id);
			$('#item_favorite')[0].checked = user.favorites.includes(item.id);

			//appends item information to second row
			$('#itemModal #item_description').text(item.description);
		};
	}
}

window.fora = {
	scripts: []
};

fora.scripts.push(() => {
	window.fetchItems = async (category, type, subtype) => {
		category ??= 1;
		type ??= 0;
		subtype ??= 0;
		let itemsUrl = `/items/${category}/${type}/${subtype}`;
		log(itemsUrl);

		category = fora.categories.names[category - 1];

		let storeUrl = '/store/' + category;
		if (type) {
			type = fora.categories[category].typeNames[type - 1];
			storeUrl += '/' + type;
			if (subtype) {
				subtype = fora.categories[category][type][subtype - 1];
				storeUrl += '/' + subtype;
			}
		}

		// changes the url without reloading the page
		history.pushState({}, 'test', storeUrl);

		// get items from the server
		let res = await fetch(itemsUrl);
		res = await res.json();
		let items = res.items;
		log(items);
		displayItems('#items', items);
	};

	//instead of inputing types manually, use a function
	for (let i = 0; i < fora.categories.names.length; i++) {
		addColumns(fora.categories.names[i], i);
	}

	$('#clothingSidebar').show();

	$('#shoes').show();

	//for nav bar; adds category types and subtypes on second nav bar, evenly split in three column
	function addColumns(category, i) {
		let $menu = $('#' + category + 'Menu');
		let $cols = $menu.find('.col');
		let types = fora.categories[category].typeNames; // get the array of type names ex. tops, bottoms

		//evenly distribute category types within the three columns
		let cols = [0, 0, 0];

		for (let j = 0; j < types.length; j++) {
			//loops through array of type names
			let type = types[j]; //retrieves a type name (ex.top or bottom)
			// find which column has the least amount of items
			// place the type and sub-cat options in that column
			let colNumMin = 0;
			for (let colIdx = 1; colIdx < cols.length; colIdx++) {
				if (cols[colNumMin] > cols[colIdx]) {
					colNumMin = colIdx;
				}
			}

			$cols
				.eq(colNumMin)
				.append(
					`<div class="row"><a onclick="fetchItems(${i + 1}, ${j + 1})" class="col">` +
						type[0].toUpperCase() +
						type.slice(1) +
						'</a></div>'
				);

			let subtypes = fora.categories[category][type]; // retrieves the array of the type names
			for (let k = 0; k < subtypes.length; k++) {
				let subtype = subtypes[k];
				$cols
					.eq(colNumMin)
					.append(
						`<div class="row"><a onclick="fetchItems(${i + 1}, ${j + 1}, ${k + 1})" class="col"> ➤ ${
							subtype[0].toUpperCase() + subtype.slice(1)
						}</a></div>`
					);
			}
			cols[colNumMin] += subtypes.length + 1;
		}
	}
});

$(async () => {
	let settings = await (await fetch('/settings.json')).json();
	Object.assign(fora, settings);

	for (let scr of fora.scripts) {
		scr();
	}
});
