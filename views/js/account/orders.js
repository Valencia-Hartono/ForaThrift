fora.scripts.push(async () => {
	let userOrders = (
		await (
			await fetch('/userOrders', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()
	).userOrders;

	for (let i = 0; i < userOrders.length; i++) {
		//each item ordered-> append to card
		displayItems('#orderedItems' + i, await getItems(userOrders[i].items));
		displayItems('#requestItems' + i, await getItems(userOrders[i].items));
	}
});
