/* ACCOUNT */
fora.account = {};
fora.scripts.push(async () => {
	window.updateUserData = async function (data) {
		// let url = window.location.href;
		// url = url.slice(0, url.lastIndexOf('/')) + '/user';
		window.user = await (
			await fetch('/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();
	};

	//FAVORITES.PUG
	fora.account.favorites = await getItems(user.favorites);
	displayItems('#favoritesItems', fora.account.favorites);

	//POINTS_SYSTEM.PUG
	$(`#minPts`).text(fora.starValues[1] * 3 + 'pts');
	$(`#maxPts`).text(fora.starValues[5] * 3 + 'pts');
	for (let i = 1; i < fora.starValues.length; i++) {
		$(`#${i}star`).text(fora.starValues[i]);
	}

	//ORDERS.PUG
	//entire order history
	for (let i = 0; i < user.orders.length; i++) {
		//each item ordered-> append to card
		displayItems('#orderedItems' + i, await getItems(user.orders[i].items));
	}

	//DONATIONS.PUG
	//entire donation history
	// for (let i = 0; i < user.donations.length; i++) {
	// 	//each item donated-> append to card
	// 	displayItems('#donatedItems' + i, await getItems(user.donations[i].items));
	// }
});
