/* STORE */

$(async () => {
	// jQuery wrapper

	await fora.load();

	let clickedItem;

	//fetch items in inventory.json
	let items = (await (await fetch('items/1/0/0')).json()).items;
	log(items);
	//let items take the ID items in store.pug
	let $items = $('#items');
	//loop through items array
	for (let item of items) {
		//in each grid, add the div with item's id. This div includes the image, and then a container on the bottom with the name and the price
		$items.append(`
			<div id="${item.id}" class="col-6 col-md-3">
				<img src="${item.img}" object-fit width="300" height="350"/>
				<div class="container">
					<div class="row">
						${item.name}
					</div>
					<div class="row">
						${item.price} RMB
					</div>
				</div>
			</div>`);
		//appends item information in its respective descriptor modal (found in item_descriptor.pug) and should open on click
		$('#' + item.id)[0].onclick = () => {
			log(item.id);
			clickedItem = item.id;
			$('#item_descriptor').modal('show');
			$('#item_descriptor #item_img').text("<img src='${item.img}' />");
			//appends item ratings to column 1
			$('#item_descriptor #item_qualityRating').text('Quality: ' + item.rating[0] + '/5');
			$('#item_descriptor #item_styleRating').text('Style: ' + item.rating[1] + '/5');
			$('#item_descriptor #item_valueRating').text('Value: ' + item.rating[2] + '/5');

			//appends item information to column 2
			$('#item_descriptor #item_name').text(item.name);
			$('#item_descriptor #item_brand').text(' Brand: ' + item.brand);

			//appends item information to second row
			$('#item_descriptor #item_description').text(' Item Description: ' + item.description);

			let colorName = [
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
			];
			$('#item_descriptor #item_colorName').text(' Color: ' + colorName[item.colorName]);

			$('#item_descriptor #item_size').text(' Size: ' + fora.selectors.size[item.size]);
			$('#item_descriptor #item_price').text(' Price: ' + item.price + ' RMB');

			//appends number of people queueing for item to column 3 by returning length of queue array storing users' names
			$('#item_descriptor #numQueue').text(item.queue.length);

			$('#item_queue')[0].checked = user.reserved.includes(item.id);
			$('#item_favorite')[0].checked = user.favorites.includes(item.id);
		};
	}

	async function itemInteraction(list, action) {
		log(action);
		let data = {
			username: user.username,
			item: clickedItem,
			list: list,
			action: action
		};
		user[list] = await (
			await fetch('/item', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();
	}

	$('#item_queue')[0].onclick = () => {
		itemInteraction('reserved', $('#item_queue')[0].checked ? 'add' : 'remove');
	};

	$('#item_favorite')[0].onclick = () => {
		itemInteraction('favorites', $('#item_favorite')[0].checked ? 'add' : 'remove');
	};
});
