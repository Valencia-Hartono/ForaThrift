/* STORE */

$(async () => {
	// jQuery wrapper

	await fora.load();

	fora.clickedItemID = null;

	//fetch items in inventory.json
	let items = (await (await fetch('items/1/0/0')).json()).items;
	log(items);
	displayItems('#items', items);
});
