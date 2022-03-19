fora.scripts.push(async () => {
	function appendCouponButtons(discountArray, deductionArray) {
		// $(`#discountButtons`).append(`new version`);
		for (let i = 1; i < discountArray.length; i++) {
			$(`#discountButtons`).append(`
			<p>
				<button id="get${deductionArray[i]}" class="btn btn-green">
					Get ${discountArray[i]}% discount coupon (-${deductionArray[i]}pts)
				</button>
				Number of ${discountArray[i]}% coupons you have:
				<span id="couponAmount${deductionArray[i]}">
					${user.coupons[i - 1] || '0'}
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

	for (let i = 1; i < fora.deductionPts.length; i++) {
		let code = i;
		let points = fora.deductionPts[i];

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
});
