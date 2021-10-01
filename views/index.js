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

$(async () => {
	// categories(clothing, accessories, shoes, bags), types (ex.bottoms, tops, overalls), subCategories (ex.jeans, shorts...)
	let categories = await (await fetch('categories.json')).json();
	log(categories);

	function addColumns(category) {
		let $menu = $('#' + category + 'Menu');
		$menu.append(`
<div class="row mb-4">
	<div class="col-8 px-4">
		<div class="row">
			<a href="/store/${category}" class="col-12 fs-4 green">Shop ${category[0].toUpperCase() + category.slice(1)}</a>
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
		let $categories = $('#categories');
		$categories.append('<div id="' + category + 'Sidebar" class="row"></div>'); //ex. id=clothingSidebar
		let $category = $('#' + category + 'Sidebar'); // retrieves the element
		$category.hide();
		let types = categories[category].typeNames; // get the array of type names ex. tops, bottoms

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

			let subtypes = categories[category][type]; // retrieves the array of the type names
			for (let j = 0; j < subtypes.length; j++) {
				let subtype = subtypes[j];
				$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col"> - ' + subtype + '</a></div>');
				$category.append('<a href="#" class="col-12"> - ' + subtype + '</a>');
			}
			cols[colNumMin] += subtypes.length + 1;
		}
	}
	//instead of inputing types manually, use a function
	for (let category of categories.names) {
		addColumns(category);
	}

	$('#clothingSidebar').show();

	$('#shoes').show();

	// add Get Started/Sign In forms
	function openForm() {
		document.getElementById('myForm').style.display = 'block';
	}

	function closeForm() {
		document.getElementById('myForm').style.display = 'none';
	}
});
