/* ACCOUNT */

$(async () => {
	// jQuery wrapper

	await fora.load();

	fora.account = {};

	async function updateUserData(data) {
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
	}

	//PROFILE.PUG
	//submit profile changes-> takes data from form and calls above "updateUserData" function
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

	//COUPONS.PUG
	function appendCouponButtons(discountArray, deductionArray) {
		// $(`#discountButtons`).append(`new version`);
		for (let i = 0; i < discountArray.length; i++) {
			$(`#discountButtons`).append(`
			<p>
				<button id="get${deductionArray[i]}" class="btn btn-green">
					Get ${discountArray[i]}% discount coupon (-${deductionArray[i]}pts)
				</button>
				Number of ${discountArray[i]}% coupons you have:
				<span id="couponAmount${deductionArray[i]}">
					${user.coupons[i] || '0'}
				</span>
			</p>
			`);
		}
	}
	appendCouponButtons(fora.discount, fora.deductionPts);

	// p.mt-4
	// button#redeem240.btn.btn-green Redeem 10% discount (-240pts)
	// |	Number of 10% coupons you have:
	// span#couponAmount240= user.coupons[0] || '0'

	//Checks if user has enough points to redeem points for the coupon clicked
	let coupon = {};
	//set how much points each coupon deducts, marked by the index of the corresponding discount %. (ex. 0 is 10%, 1 is 25%, 2 is 40%, 3 is 55%, 4 is 70%)
	function couponSetter(deductionArray) {
		for (let i = 0; i < deductionArray.length; i++) {
			let code = i;
			let points = deductionArray[i];

			$('#get' + points)[0].onclick = () => {
				coupon = { points, code };
				//if fail, display alert saying it is unsuccessful
				if (user.pointsForExchange < coupon.points) {
					$('#couponStatusAlert').append(`
	<div class="alert alert-danger" role="alert">
		Failed to redeem points! Not enough points: ${user.pointsForExchange}
	</div>`);
					return;
				}
				//if user has enough points to redeem points, confirm modal in coupons.pug will be displayed
				$('#confirmRedeemModal').modal('show');
			};
		}
	}
	couponSetter(fora.deductionPts);

	//once confirm button is clicked, corresponding points are deducted from user's "points for exchange"
	//check if points is enough to deduct points, because modal may be still opened

	$('#confirmRedeem')[0].onclick = async () => {
		if (user.pointsForExchange >= coupon.points) {
			user.pointsForExchange -= coupon.points;
			user.coupons[coupon.code]++;

			await updateUserData(user);
			//display newly updated span.pointsExchangable in coupons.pug, donations.pug, and profile.pug
			$('.pointsExchangable').text(user.pointsForExchange);
			//display newly updated coupon amount
			$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
			//newly updated # of coupons in coupons.pug should be displayed in green color (CSS)
			$('#couponAmount' + coupon.points).addClass('green');
			//if successful, display alert saying it is successful
			$('#couponStatusAlert').append(`
	<div class="alert alert-success" role="alert">
		Coupon for ${coupon.points} points successfully redeemed!
	</div>`);
		}
	};

	//CART.PUG
	fora.account.reserved = await getItems(user.reserved);
	displayItems('#reservedItems', fora.account.reserved);

	let discountedSubtotal = [];

	function makeDiscountSelector() {
		let itemSubtotal = 0;
		for (let i = 0; i < user.reserved.length; i++) {
			//adds the price of every item in user.reserved
			itemSubtotal += fora.account.reserved[i].price;
		}
		$('#preCouponSubtotal').text(itemSubtotal.toFixed(2) + ' RMB');

		//Rounds billing
		// -> 99.49230420 * 100 to 9949.230420
		// -> math floor to 9949
		// -> 9949 / 100 to 99.49
		discountedSubtotal[0] = itemSubtotal;

		//sets discountBilling array to the discounted price options
		//"discount": [10, 25, 40, 55, 70]
		//ex.totalBilling = 100 rmb -> after this loop, discountBilling = [90, 75, 60, 45, 30] rmb
		$(`#discountSelector`).append(`<option value="0"> no discount | ${itemSubtotal.toFixed(2)} RMB </option>`);

		for (let i = 0; i < 5; i++) {
			let discount = (100 - fora.discount[i]) / 100;
			discountedSubtotal[i + 1] = itemSubtotal * discount;
			$(`#discountSelector`).append(
				`<option value="${i + 1}" ${!user.coupons[i] ? 'disabled' : ''}> ${
					fora.discount[i]
				}% discount | ${discountedSubtotal[i + 1].toFixed(2)} RMB </option>`
			);
		}

		$('#discountSelector')[0].onchange = () => {
			let idx = $('#discountSelector').val();
			calculateBilling(idx);
		};
	}

	makeDiscountSelector();

	function calculateBilling(discountIdx) {
		let subtotal = discountedSubtotal[discountIdx];
		let salesTax = (subtotal * 7) / 100;
		let rewardPoints = Math.ceil(subtotal * 2);
		let totalBilling = subtotal + salesTax + 12;
		$('#itemSubtotal').text(subtotal.toFixed(2) + ' RMB');
		$('#salesTax').text(salesTax.toFixed(2) + ' RMB');
		$('#rewardPoints').text(rewardPoints + 'pts');
		$('#totalBilling').text(totalBilling.toFixed(2) + ' RMB');
	}

	calculateBilling(0);
	$('#shippingCost').text('12.00 RMB');

	$('#banTime').text(user.requestBanTime);

	$('#requestOrderButton')[0].onclick = () => {
		//if fail, display alert saying it is unsuccessful
		if (user.requestBanTime > 0) {
			$('#orderStatusAlert').append(`
<div class="alert alert-danger" role="alert">
Failed to request order! Waiting time before next order: ${user.requestBanTime} hr
</div>`);
			return;
		}
		//if user has enough points to redeem points, confirm modal in coupons.pug will be displayed
		$('#confirmOrderModal').modal('show');
	};

	$('#confirmOrder')[0].onclick = async () => {
		//sends request to admin server
		if (user.coupons[i] >= coupon.points) {
			user.pointsForExchange -= coupon.points;
			user.coupons[coupon.code]++;

			await updateUserData(user);
			//display newly updated span.pointsExchangable in coupons.pug, donations.pug, and profile.pug
			$('.pointsExchangable').text(user.pointsForExchange);
			//display newly updated coupon amount
			$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
			//newly updated # of coupons in coupons.pug should be displayed in green color (CSS)
			$('#couponAmount' + coupon.points).addClass('green');
			//if successful, display alert saying it is successful
			$('#orderStatusAlert').append(`
	<div class="alert alert-success" role="alert">
		Coupon for ${coupon.points} points successfully redeemed!
	</div>`);
		}
	};

	//FAVORITES.PUG
	fora.account.favorites = await getItems(user.favorites);
	displayItems('#favoritesItems', fora.account.favorites);

	//POINTS_SYSTEM.PUG
	$(`#minPts`).text(fora.starValues[1] * 3 + 'pts');
	$(`#maxPts`).text(fora.starValues[5] * 3 + 'pts');
	for (let i = 1; i < fora.starValues.length; i++) {
		$(`#${i}star`).text(fora.starValues[i]);
	}
});
