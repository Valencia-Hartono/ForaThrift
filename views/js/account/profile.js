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
		let rank = 'π₯Bronze';
		if (points >= 5200) {
			rank = 'π₯Gold';
		} else if (points >= 2600) {
			rank = 'π₯Silver';
		}
		$('#rank').empty();
		$('#rank').append(rank);
	}

	//append/display avatar based on checking points and gender
	function checkAvatar(points, gender) {
		var avatar = 'π§';
		let arrayF = ['π§ββοΈ', 'π§ββοΈ', 'π§ββοΈ'];
		let arrayM = ['π§ββοΈ', 'π§', 'π§ββοΈ'];
		let arrayN = ['π§', 'π§ββοΈ', 'π§'];
		let pointsCheck = [5200, 2600, 0];
		for (let i = pointsCheck.length - 1; i >= 0; i--) {
			if (points >= pointsCheck[i]) {
				if (gender == 'f') {
					avatar = arrayF[i];
				} else if (gender == 'm') {
					avatar = arrayM[i];
				} else if (gender == 'n') {
					avatar = arrayN[i];
				}
			}
		}
		$('.avatar').empty();
		$('.avatar').append(avatar);
	}
	checkRank(user.totalPoints);
	checkAvatar(user.totalPoints, user.gender);

	// this is the original hard code the function above replaced:
	// if (points >= 5200 && gender == 'f') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points >= 5200 && gender == 'm') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points >= 5200 && gender == 'n') {
	// 	avatar = 'π§';
	// } else if (points >= 2600 && gender == 'f') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points >= 2600 && gender == 'm') {
	// 	avatar = 'π§';
	// } else if (points >= 2600 && gender == 'n') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points < 2600 && gender == 'f') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points < 2600 && gender == 'm') {
	// 	avatar = 'π§ββοΈ';
	// } else if (points < 2600 && gender == 'n') {
	// 	avatar = 'π§';
	// }
});
