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
	$('#totalUnconfirmed').text(unconfirmed.length);

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
	$('#totalConfirmed').text(confirmed.length);

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
			location.reload();
			alert('Order request confirmation success.');
		} else {
			alert('Order request confirmation failed!');
		}
	};

	window.declineRequest = async (id) => {
		// move order from unconfirmed array to declined array in orders.JSON and reload page
		let response = (
			await (
				await fetch('/admin/declineRequest/' + id, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
			).json()
		).msg;

		if (response == 'success') {
			// reload page
			location.reload();
			alert('Order decline success.');
		} else {
			alert('Order decline failed!');
		}
	};

	window.sendItems = async (id) => {
		// change order's "sent" attribute in orders.JSON to true
		//display "item has been sent"
		let response = (
			await (
				await fetch('/admin/shipped/' + id, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
			).json()
		).msg;

		if (response == 'success') {
			// reload page
			location.reload();
		} else {
			alert('Order shipped confirmation failed!');
		}
	};

	window.pickUpItems = async (id) => {
		// change order's "sent" attribute in orders.JSON to true
		//display "item has been sent"
		let response = (
			await (
				await fetch('/admin/pickedUp/' + id, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})
			).json()
		).msg;

		if (response == 'success') {
			// reload page
			location.reload();
		} else {
			alert('Order pick up confirmation failed!');
		}
	};
});
