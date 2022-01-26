// /* INVENTORY */
$(async () => {
	await fora.load();

	// get total number of items in the inventory
	let inventoryNumOfItems = (
		await (
			await fetch('/admin/inventoryNumOfItems', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()
	).inventoryNumOfItems;
	$('#totalItems').text(inventoryNumOfItems);

	window.submitAdminInventoryForm = async () => {
		let item = getFormData('adminInventoryForm');

		if (!item.img.size) item.img = null;
		log(item);

		item.rating = [item.qualityRating, item.styleRating, item.valueRating];

		window.user = await (
			await fetch('/admin/inventory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(item)
			})
		).json();
	};

	function showRewardPoints(ratings) {
		// admin can customize if they change their mind about how the value works
		// by editing the settings.json file. 1 star can be 10pts or 20pts or 25pts etc.
		let points = 0;
		for (let i = 0; i < ratings.length; i++) {
			points += fora.starValues[ratings[i]];
		}
		//ratings=[2, 5, 4] unique to each item; corresponds with type in inventory.JSON; holds index of starValues array
		$('#reward').text(points + 'pts');
	}

	for (let i = 0; i < 3; i++) {
		$('.ratingSel')[i].onchange = async () => {
			let item = getFormData('adminInventoryForm');
			let ratings = [item.qualityRating, item.styleRating, item.valueRating];
			showRewardPoints(ratings);
		};
	}

	// requires the fora global variable created in index.js
	function addOptions() {
		//add ID
		//"in" loops through keys; "of" loops through key's values (in this case the arrays)

		for (let selName of ['category', 'occasion', 'season', 'colorName', 'size']) {
			let options = fora[selName];
			for (let j = 0; j < options.length; j++) {
				log(selName);
				$(`#${selName}`).append(`<option value="${j}"> ${options[j]} </option>`);
			}
		}
	}

	addOptions();

	$('#search')[0].onclick = async () => {
		let item = await getItem($('#searchItemID').val());

		for (let prop in item) {
			if (prop == 'img') continue;
			$('#' + prop).val(item[prop]);
		}
		$('#styleRating').val(item.rating[0]);
		$('#qualityRating').val(item.rating[1]);
		$('#valueRating').val(item.rating[2]);
	};
});
