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

	// how to earn points?
	$(`#minPts`).text(fora.starValues[1] * 3 + 'pts');
	$(`#maxPts`).text(fora.starValues[5] * 3 + 'pts');
	for (let i = 1; i < fora.starValues.length; i++) {
		$(`#${i}star`).text(fora.starValues[i]);
	}
});
