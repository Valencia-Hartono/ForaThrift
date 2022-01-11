$(async () => {
	window.submitAdminInventoryForm = async () => {
		let data = getFormData('adminInventoryForm');

		if (!data.img.size) data.img = null;
		log(data);

		window.user = await (
			await fetch('/admin/inventory', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();
	};
});
