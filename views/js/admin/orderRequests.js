fora.scripts.push(async () => {
	let unconfirmed = (
		await (
			await fetch('/admin/unconfirmed', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()
	).unconfirmed;

	for (let i = 0; i < unconfirmed.length; i++) {
		//each item ordered-> append to card
		displayItems('#unconfirmedItems' + i, await getItems(unconfirmed[i].items));
	}

	let confirmed = (
		await (
			await fetch('/admin/confirmed', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()
	).confirmed;

	for (let i = 0; i < confirmed.length; i++) {
		//each item ordered-> append to card
		displayItems('#confirmedItems' + i, await getItems(confirmed[i].items));
	}
});
