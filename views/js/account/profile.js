fora.scripts.push(async () => {
	//submit profile changes-> takes data from form and calls above "updateUserData" function
	window.submitProfileForm = async () => {
		let data = getFormData('profileForm');
		data.username = user.username;
		await updateUserData(data);
		location.reload();
	};

	//display ranking based on checking points
	function checkRank(points) {
		let rank = '🥉Bronze';
		if (points >= 5200) {
			rank = '🥇Gold';
		} else if (points >= 2600) {
			rank = '🥈Silver';
		}
		$('#rank').empty();
		$('#rank').append(rank);
	}

	//append/display avatar based on checking points and gender
	function checkAvatar(points, gender) {
		var avatar = '🧚';
		if (points >= 5200 && gender == 'f') {
			avatar = '🧞‍♀️';
		} else if (points >= 5200 && gender == 'm') {
			avatar = '🧞‍♂️';
		} else if (points >= 5200 && gender == 'n') {
			avatar = '🧞';
		} else if (points >= 2600 && gender == 'f') {
			avatar = '🧜‍♀️';
		} else if (points >= 2600 && gender == 'm') {
			avatar = '🧜';
		} else if (points >= 2600 && gender == 'n') {
			avatar = '🧜‍♂️';
		} else if (points < 2600 && gender == 'f') {
			avatar = '🧚‍♀️';
		} else if (points < 2600 && gender == 'm') {
			avatar = '🧚‍♂️';
		} else if (points < 2600 && gender == 'n') {
			avatar = '🧚';
		}
		$('.avatar').empty();
		$('.avatar').append(avatar);
	}
	checkRank(user.totalPoints);
	checkAvatar(user.totalPoints, user.gender);
});
