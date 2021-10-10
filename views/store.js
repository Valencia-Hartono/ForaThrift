/* STORE */

$(async () => {
	// jQuery wrapper

	let items = await (await fetch('items/1/0/0')).json().items;

	let $items = $('#items');
	for (let item of items) {
		$items.append(`
			<div class="col-6 col-md-3">
				<img src="${item.img}"/>
				<div>${item.name}</div>
				<div>$${item.price}</div>
			</div>`);
	}
});
