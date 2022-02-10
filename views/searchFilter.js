$(async () => {
	await fora.load();
	for (let selName of [
		'season',
		'category',
		'size',
		'shoeSize',
		'type',
		'style',
		'length',
		'pattern',
		'sleeve',
		'colorName',
		'material',
		'neckline'
	]) {
		let options = fora[selName];
		//if looping item is size, split into two cols
		if (selName == 'size') {
			for (let j = 0; j < options.length; j = j + 2) {
				log(selName);
				$(`#sizeSearch1`).append(`<input type="checkbox" class="form-check-input" id="#${options[j]}">
				<label class="form-check-label" for="${options[j]}"> ${options[j]}</label> <br>`);
			}
			for (let j = 1; j < options.length; j = j + 2) {
				log(selName);
				$(`#sizeSearch2`).append(`<input type="checkbox" class="form-check-input" id="#${options[j]}">
				<label class="form-check-label" for="${options[j]}"> ${options[j]}</label> <br>`);
			}
		}
		if (selName == 'shoeSize') {
			for (let j = 0; j < options.length; j = j + 2) {
				log(selName);
				$(`#sizeSearch1`).append(`<input type="checkbox" class="form-check-input" id="#${options[j]}">
				<label class="form-check-label" for="${options[j]}"> ${options[j]}</label> <br>`);
			}
			for (let j = 1; j < options.length; j = j + 2) {
				log(selName);
				$(`#sizeSearch2`).append(`<input type="checkbox" class="form-check-input" id="#${options[j]}">
				<label class="form-check-label" for="${options[j]}"> ${options[j]}</label> <br>`);
			}
		}
		//if looping item is category, need to get suptypes from fora.categories
		if (selName == 'category') {
			for (let j = 0; j < options.length; j++) {
				let subtype = fora.categories.names[j - 1];
				log(selName);
				// let categoryName = 'NA';
				// if (j > 0) {
				// 	categoryName = fora.categories.names[j - 1];
				// }
				$(`#${selName}Search`).append(`<div class="btn-group dropend">
  <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    ${options[j]}
  </button>
  <ul class="dropdown-menu" id="${subtype}Subtype">
    <!-- Dropdown menu links -->
  </ul>
</div> <br>`);
				// 	for (let k = 0; k < fora.categories.subtype.typeNames.length; k++) {
				// 		$(`#${subtype}Subtype`)
				// 			.append(`<li> <input type="checkbox" class="form-check-input" id="#${fora.categories.subtype.typeNames[k]}">
				// <label class="form-check-label" for="${fora.categories.subtype.typeNames[k]}"> ${fora.categories.subtype.typeNames[k]}</label>
				// </li>`);
				// 	}
			}
		} else {
			for (let j = 0; j < options.length; j++) {
				log(selName);
				$(`#${selName}Search`).append(`<input type="checkbox" class="form-check-input" id="#${options[j]}">
				<label class="form-check-label" for="${options[j]}"> ${options[j]}</label> <br>`);
			}
		}
	}
});
