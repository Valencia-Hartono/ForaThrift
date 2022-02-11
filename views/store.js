/* STORE */

$(async () => {
	// jQuery wrapper

	await fora.load();

	fora.clickedItemID = null;

	//fetch items in inventory.json
	fetchItems();
});
