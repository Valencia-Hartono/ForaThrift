/* ACCOUNT */

$(async () => {
	// jQuery wrapper

	async function updateUserData(data) {
		let url = window.location.href;
		url = url.slice(0, url.lastIndexOf('/')) + '/user';
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
	window.submitProfileForm = async () => {
		let data = getFormData('profileForm');
		data.username = user.username;
		await updateUserData(data);
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

	//takes in deduction points and checks if user has enough points to exchange for coupon
	let coupon = {};
	function couponSetter(points, code) {
		$('#redeem' + points)[0].onclick = () => {
			coupon = { points, code };
			//if fail, display alert
			if (user.pointsForExchange < coupon.points) {
				$('#couponStatus').append(`
<div class="alert alert-danger" role="alert">
  Failed to redeem points! Not enough points: ${user.pointsForExchange}
</div>`);
				return;
			}
			//if successful, display confirm modal found in coupons.pug
			$('#confirmRedeemModal').modal('show');
		};
	}
	//set how much points each coupon deducts, marked by the index of the corresponding discount %. (0 is 10%, 1 is 25%, 2 is 40%, 3 is 55%, 4 is 70%)
	couponSetter(240, 0);
	couponSetter(480, 1);
	couponSetter(720, 2);
	couponSetter(960, 3);
	couponSetter(1200, 4);

	//once confirm button is clicked, corresponding points should be deducted from user's points for exchange
	//the element in the discount index will add one
	//for example, alexa [0, 0, 0, 0, 0], after clicking on the [1], it will become [0, 1, 0, 0, 0] (you have a 25% discount coupon)
	//after clicking on the [1] again, it will become [0, 2, 0, 0, 0] (you have two 25% discount coupons)
	//after clicking on the [4], it will become [0, 2, 0, 0, 1] (you have two 25% and one 70% discount coupons)

	$('#confirmRedeem')[0].onclick = async () => {
		user.pointsForExchange -= coupon.points;
		user.coupons[coupon.code]++;

		await updateUserData(user);

		//display newly updated span.pointsExchangable in coupons.pug, donations.pug, and profile.pug
		$('.pointsExchangable').text(user.pointsForExchange);
		//display newly updated coupon amount
		$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
		//newly updated # of coupons in coupons.pug should be displayed in green color (CSS)
		$('#couponAmount' + coupon.points).addClass('green');

		$('#couponStatus').append(`
<div class="alert alert-success" role="alert">
  Coupon for ${coupon.points} points successfully redeemed!
</div>`);
	};
});
