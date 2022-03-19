fora.scripts.push(async () => {
	fora.account.favorites = await getItems(user.favorites);
	displayItems('#favoritesItems', fora.account.favorites);
});
