fora.scripts.push(async () => {
	$('.filter-check').on('click', async function () {
		let url = window.location.href.split('/store')[1].split('?')[0];

		let data = getFormData('searchFilterForm');
		log(data);

		if (!data) return;

		let filters = {};
		for (let checked in data) {
			checked = checked.split('-');
			let filterName = checked[0];
			let val = checked[1];
			if (!filters[filterName]) {
				filters[filterName] = [val];
			} else {
				filters[filterName].push(val);
			}
		}
		if (Object.keys(filters).length) url += '?';
		for (let filterName in filters) {
			url += filterName + '=' + filters[filterName].join('+');
		}

		fetchItems(url);
	});
});
