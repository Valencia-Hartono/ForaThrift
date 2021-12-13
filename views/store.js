/* STORE */

$(async () => {
	// jQuery wrapper

	let items = (await (await fetch('items/1/0/0')).json()).items;
	log(items);
	let $items = $('#items');
	for (let item of items) {
		$items.append(`
			<div id="${item.id}" class="col-6 col-md-3">
				<img src="${item.img}"/>
				<div class="container">
					<div class="row">
						${item.name}
					</div>
					<div class="row">
						${item.price} RMB
					</div>
				</div>
			</div>`);
		//appends the item information in its descriptor modal
		$('#' + item.id)[0].onclick = () => {
			log(item.id);
			$('#item_descriptor').modal('show');

			//image currently not working!!
			$('#item_descriptor #item_img').text("<img src='${item.img}' />");
			//appends item ratings to column 1
			$('#item_descriptor #item_qualityRating').text('Quality: ' + item.qualityRating + '/5');
			$('#item_descriptor #item_styleRating').text('Style: ' + item.styleRating + '/5');
			$('#item_descriptor #item_discretionRating').text('Overall: ' + item.discretionRating + '/5');

			//appends item information to column 2
			$('#item_descriptor #item_name').text(item.name);
			$('#item_descriptor #item_brand').text(' Brand: ' + item.brand);
			$('#item_descriptor #item_colorName').text(' Color: ' + item.colorName);
			$('#item_descriptor #item_size').text(' Size: ' + item.size);
			$('#item_descriptor #item_price').text(' Price: ' + item.price + ' RMB');
			//appends number of people queueing for item to column 3 by returning length of queue array storing users' names
			$('#item_descriptor #numQueue').text(item.queue.length);
		};
	}
});
