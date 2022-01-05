$(async () => {
	// jQuery wrapper

	async function updateUserData(data) {
		let url = window.location.href;
		url = url.slice(0, url.lastIndexOf('/')) + '/admin';
		window.user = await (
			await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
		).json();
	}
	//submit profile changes
	window.submitAdminForm = async () => {
		//takes all input forms
		let data = getFormData('adminForm');
		//call function above
		console.log('test');
		console.log(data);
		await updateUserData(data);
	};
});
