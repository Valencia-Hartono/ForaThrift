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
				<div>${item.name}</div>
				<div>$${item.price}</div>
			</div>`);
		//appends the item information in its descriptor modal
		$('#' + item.id)[0].onclick = () => {
			log(item.id);
			$('#item_descriptor').modal('show');
			//appends item image to column 1
			$('#item_descriptor #item_image').text('item.img');
			//appends item information to column 2
			$('#item_descriptor #item_information').text(
				'Name: ' +
					item.name +
					'; Brand: ' +
					item.brand +
					'; Color: ' +
					item.colorName +
					'; Size: ' +
					item.size +
					'; Price: ' +
					item.price +
					'RMB'
			);
			//appends number of people queueing for item to column 3 by returning length of queue array storing users' names
			$('#item_descriptor #numQueue').text(item.queue.length);
		};
	}
});
