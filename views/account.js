/* ACCOUNT */

$(async () => {
	// jQuery wrapper

	async function updateUserData(data) {
		let url = window.location.href;
		url = url.slice(0, url.lastIndexOf('/')) + '/user';
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});
	}

	window.submitProfileForm = async () => {
		let data = new FormData($('#profileForm')[0]);
		console.log(data);
		await updateUserData(data);
	};

	function checkRank(points) {
		let rank = '🥉Bronze';
		if (points >= 5200) {
			rank = '🥇Gold';
		} else if (points >= 2600) {
			rank = '🥈Silver';
		}
		$('#rank').append(rank);
	}

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
		$('.avatar').append(avatar);
	}
	checkRank(user.totalPoints);
	checkAvatar(user.totalPoints, user.gender);

	let coupon = {};
	function couponSetter(points, code) {
		$('#redeem' + points)[0].onclick = () => {
			coupon = { points, code };
			if (user.pointsForExchange < coupon.points) {
				$('#couponStatus').append(`
<div class="alert alert-danger" role="alert">
  Failed to redeem points! Not enough points: ${user.pointsForExchange}
</div>`);
				return;
			}
			$('#confirmRedeemModal').modal('show');
		};
	}
	couponSetter(240, 0);
	couponSetter(480, 1);
	couponSetter(720, 2);
	couponSetter(960, 3);
	couponSetter(1200, 4);

	$('#confirmRedeem')[0].onclick = async () => {
		user.pointsForExchange -= coupon.points;
		user.coupons[coupon.code]++;

		await updateUserData(user);

		$('.pointsExchangable').text(user.pointsForExchange);
		$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
		$('#couponAmount' + coupon.points).addClass('green');

		$('#couponStatus').append(`
<div class="alert alert-success" role="alert">
  Coupon for ${coupon.points} points successfully redeemed!
</div>`);
	};
});
