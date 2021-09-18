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
	let clothingOptions = [
		'All',
		'Clothing',
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

	let $clothesMenu = $('#clothesMenu');
	let $cols = $clothesMenu.find('.col');

	for (let i = 0; i < clothingOptions.length; i++) {
		let opt = clothingOptions[i];
		let colNum = i % 3;
		$cols.eq(colNum).append('<div class="row"><a href="#" class="col">' + opt + '</a></div>');
	}
});
