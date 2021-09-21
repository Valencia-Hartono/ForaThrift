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

$(() => {
	// superCategories(clothing, accessories, shoes, bags), categories (ex.bottoms, tops, overalls), subCategories (ex.jeans, shorts...)
	let superCategories = {
		clothing: {
			Bottoms: ['Jeans', 'Shorts', 'Skirts', 'Slacks', 'Sweatpants'],
			Tops: ['Shirts', 'Blazers', 'Coats', 'Hoodies', 'Jackets', 'Sweater'],
			Overalls: ['Beachwear', 'Dresses', 'Jumpsuits', 'Loungewear']
		},
		accessories: {
			Jewelry: ['Earrings', 'Bracelets', 'Necklaces'],
			Belts: [],
			'Hair accessories': [],
			Gloves: [],
			Scarves: [],
			Sunglasses: [],
			Watches: []
		},
		shoes: {
			Boots: ['Leather', 'k', 'l'],
			Heels: ['k', 'a'],
			Formal: ['a', 'b'],
			Casual: ['Espadrilles'],
			r: ['k', 'f']
		},
		bags: {
			Backpacks: [],
			'Chain bags': [],
			Clutches: [],
			'Duffle bags': [],
			'Shoulder bags': [],
			'Tote bags': []
		}
	};

	function addColumns(superCategory) {
		let $menu = $('#' + superCategory + 'Menu');
		$menu.append(`
<div class="row">
	<div class="col-8 px-4">
		<div class="row">
			<div class="col-12 fs-4 green">Shop ${superCategory[0].toUpperCase() + superCategory.slice(1)}</div>
			<div class="col"> _____________ </div>
			<div class="col"> _____________ </div>
			<div class="col"> _____________ </div>
		</div>
	</div>
	<div class="col-4">
		images
	</div>
</div>`);
		let $cols = $menu.find('.col');
		let $superCategories = $('#superCategories');
		$superCategories.append('<div id="' + superCategory + 'Sidebar" class="row"></div>'); //ex. id=clothingSidebar
		let $superCategory = $('#' + superCategory + 'Sidebar'); // retrieves the element
		$superCategory.hide();
		let categories = Object.keys(superCategories[superCategory]); // returns an array of category names ex. tops, bottoms

		let cols = [0, 0, 0];

		for (let i = 0; i < categories.length; i++) {
			//loops through array of category names
			let category = categories[i]; //retrieves a category name (ex.top or bottom)

			// find which column has the least amount of items
			// place the category and sub-cat options in that column
			let colNumMin = 0;
			for (let i = 1; i < cols.length; i++) {
				if (cols[colNumMin] > cols[i]) {
					colNumMin = i;
				}
			}

			$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col">' + category + '</a></div>');
			$superCategory.append('<a href="#" class="col-12">' + category + '</a>');

			let subCats = superCategories[superCategory][category]; // retrieves the array of the category names
			for (let j = 0; j < subCats.length; j++) {
				$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col"> - ' + subCats[j] + '</a></div>');
				$superCategory.append('<a href="#" class="col-12"> - ' + subCats[j] + '</a>');
			}
			cols[colNumMin] += subCats.length + 1;
		}
	}

	addColumns('clothing');
	addColumns('shoes');
	addColumns('bags');
	addColumns('accessories');

	$('#clothingSidebar').show();

	$('#shoes').show();
});
