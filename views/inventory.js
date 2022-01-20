// /* INVENTORY */
$(async () => {
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
		let data = getFormData('adminInventoryForm');

		if (!data.img.size) data.img = null;
		log(data);

		window.user = await (
			await fetch('/admin/inventory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();
	};

	function checkRewardedPoints(ratings) {
		//admin can customize if they change their mind about how the value works; 1 star can be 10pts or 20pts or 25pts etc.
		//starValues=[0, 10, 40, 90, 160, 250] (index 0 is always 0) constant for all items
		let starValues = [0, 10, 40, 90, 160, 250];
		let points = 0;
		for (let i = 0; i < ratings.length; i++) {
			points += starValues[ratings[i]];
		}
		//ratings=[2, 5, 4] unique to each item; corresponds with type in inventory.JSON; holds index of starValues array
		$('#reward').text(points + 'pts');
	}

	for (let i = 0; i < 3; i++) {
		$('.ratingSel')[i].onchange = async () => {
			let item = getFormData('adminInventoryForm');
			let ratings = [item.qualityRating, item.styleRating, item.valueRating];
			checkRewardedPoints(ratings);
		};
	}

	function addOptions() {
		//add ID
		let selectors = {
			category: ['NA', '👚 Clothing', '👟 Shoes', '👜 Bags', '💍 Accessories', '🧢 Miscellaneous'],
			occasion: ['NA', '⚽️ Sports', '🥂 Formal', '🚶 Casual'],
			season: ['NA', '☘️ Spring', '☀️ Summer', '🍂 Fall', '❄️ Winter'],
			colorName: [
				'NA',
				'Black',
				'White',
				'Gold',
				'Silver',
				'Brown',
				'Red',
				'Orange',
				'Yellow',
				'Green',
				'Turquoise',
				'Blue',
				'Purple',
				'Pink',
				'Nude',
				'Taupe'
			],
			size: ['NA', 'XS', 'S', 'M', 'L', 'XL']
		};
		//"in" loops through keys; "of" loops through key's values (in this case the arrays)

		for (let selName in selectors) {
			let options = selectors[selName];
			for (let j = 0; j < options.length; j++) {
				log(selName);
				$(`#${selName}`).append(`<option value="${j}"> ${options[j]} </option>`);
			}
		}
	}

	addOptions();
});
