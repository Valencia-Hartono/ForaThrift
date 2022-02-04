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
		items.push(await getItem(id));
	}
	return items;
}

function displayItems(elem, items) {
	if (!items || !items.length) {
		console.warn('no items in array!');
		return;
	}
	// gets the element with id="items"
	let $items = $(elem);
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
			$('#itemModal #item_colorName').text(' Color: ' + fora.colorName[item.colorName]);
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

window.fora = {};

fora.load = async () => {
	// prevents the rest of this function from
	// running if it is called twice
	if (fora.loading) return;
	fora.loading = true;

	let settings = await (await fetch('/settings.json')).json();
	Object.assign(fora, settings);

	//instead of inputing types manually, use a function
	for (let category of fora.categories.names) {
		addColumns(category);
	}

	$('#clothingSidebar').show();

	$('#shoes').show();

	//for nav bar; adds category types and subtypes on second nav bar, evenly split in three column
	function addColumns(category) {
		let $menu = $('#' + category + 'Menu');
		let $cols = $menu.find('.col');
		let $categories = $('#categories');
		$categories.append('<div id="' + category + 'Sidebar" class="row"></div>'); //ex. id=clothingSidebar
		let $category = $('#' + category + 'Sidebar'); // retrieves the element
		$category.hide();
		let types = fora.categories[category].typeNames; // get the array of type names ex. tops, bottoms

		//evenly distribute category types within the three columns
		let cols = [0, 0, 0];

		for (let i = 0; i < types.length; i++) {
			//loops through array of type names
			let type = types[i]; //retrieves a type name (ex.top or bottom)
			// find which column has the least amount of items
			// place the type and sub-cat options in that column
			let colNumMin = 0;
			for (let i = 1; i < cols.length; i++) {
				if (cols[colNumMin] > cols[i]) {
					colNumMin = i;
				}
			}

			$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col">' + type + '</a></div>');
			$category.append('<a href="#" class="col-12">' + type + '</a>');

			let subtypes = fora.categories[category][type]; // retrieves the array of the type names
			for (let j = 0; j < subtypes.length; j++) {
				let subtype = subtypes[j];
				$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col"> ➤ ' + subtype + '</a></div>');
				$category.append('<a href="#" class="col-12"> ➤ ' + subtype + '</a>');
			}
			cols[colNumMin] += subtypes.length + 1;
		}
	}
};
