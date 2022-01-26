$(async () => {
	await fora.load();

	let onAccountPage = window.location.href.includes('account');

	async function itemInteraction(list, action) {
		log(action);
		let data = {
			username: user.username,
			item: fora.clickedItemID,
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

		if (onAccountPage) {
			$('#' + list + 'Items').empty();
			let idx = fora.account[list].findIndex((x) => x.id == fora.clickedItemID);
			fora.account[list].splice(idx, 1);
			displayItems('#' + list + 'Items', fora.account[list]);
		}
	}

	$('#item_queue')[0].onclick = () => {
		itemInteraction('reserved', $('#item_queue')[0].checked ? 'add' : 'remove');
	};

	$('#item_favorite')[0].onclick = () => {
		itemInteraction('favorites', $('#item_favorite')[0].checked ? 'add' : 'remove');
	};
});
