fora.scripts.push(async () => {
	let unconfirmed = (
		await //use link created in server to get the unconfirmed order objects
		(
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
		await //use link created in server to get the confirmed order objects
		(
			await fetch('/admin/confirmed', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json()
	).confirmed;

	for (let i = 0; i < unconfirmed.length; i++) {
		displayItems('#unconfirmedItems' + i, await getItems(unconfirmed[i].items));
	}

	for (let i = 0; i < confirmed.length; i++) {
		displayItems('#confirmedItems' + i, await getItems(confirmed[i].items));
	}

	window.confirmRequest = async (id) => {
		// move order from unconfirmed array to confirmed array in orders.JSON and reload page
		let response = (
			await (
				await fetch('/admin/confirmRequest/' + id, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
			).json()
		).msg;

		if (response == 'success') {
			// reload page
		} else {
			alert('Order request confirmation failed!');
		}
	};

	window.sendItems = async (id) => {
		// change order's "sent" attribute in orders.JSON to true
		//display "item has been sent"
		await (
			await fetch('/admin/sendItems/' + id, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})
		).json();
	};
});
