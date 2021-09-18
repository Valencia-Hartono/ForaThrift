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
	let clothesOptions = [
		'All Clothing',
		'Beachwear',
		'Blazers',
		'Coats',
		'Denim',
		'Dresses',
		'Jackets',
		'Jeans',
		'Jumpsuits',
		'Leather',
		'Loungewear',
		'Pants',
		'Shorts',
		'Skirts',
		'Sportswear',
		'Sweater',
		'Swimwear',
		'Tops'
	];

	let accessoryOptions = [
		'All accessories',
		'Belts',
		'Hair accessories',
		'Jewelry/Chains',
		'Gloves',
		'Scarves',
		'Sunglasses',
		'Watches'
	];

	let shoesOptions = ['All shoes', 'Boots', 'Espadrilles', 'Heels', 'Sneakers', 'Sandals'];

	let bagsOptions = ['All bags', 'Backpacks', 'Chain bags', 'Clutches'];

	function addColumns(menu, options) {
		let $menu = $('#' + menu + 'Menu');
		$menu.append(`
<div class="row">
	<div class="col-8">
		<div class="row">
			<div class="col-12 fs-3 green">Shop ${menu[0].toUpperCase() + menu.slice(1)}</div>
			<div class="col"></div>
			<div class="col"></div>
			<div class="col"></div>
		</div>
	</div>
	<div class="col-4">
		images
	</div>
</div>`);
		let $cols = $menu.find('.col');

		for (let i = 0; i < options.length; i++) {
			let opt = options[i];
			let colNum = Math.floor((i / options.length) * 3);
			$cols.eq(colNum).append('<div class="row"><a href="#" class="col">' + opt + '</a></div>');
		}
	}

	addColumns('clothes', clothesOptions);
	addColumns('shoes', shoesOptions);
	addColumns('bags', bagsOptions);
	addColumns('accessories', accessoryOptions);
});
