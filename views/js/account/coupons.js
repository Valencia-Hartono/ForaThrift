fora.scripts.push(async () => {
	function appendCouponButtons(discountArray, deductionArray) {
		//coupon discount percentage is i ranges [1,6), returns 10, 25, 40, 55, 70
		//deduction points is i ranges [1,6), returns 240, 480, 720, 960, 1200
		//user.coupons is i-1 ranges [0,5)
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
	// this is the original hard code the function above replaced:
	// button#redeem240.btn.btn-green Redeem 10% discount (-240pts)
	// |	Number of 10% coupons you have:
	// span#couponAmount240= user.coupons[0] || '0'

	let coupon = {};
	for (let i = 1; i < fora.deductionPts.length; i++) {
		// code is i-1 ranges [0,5), returns 0, 1, 2, 3, 4
		// deduction points is i ranges [1,6), returns 240, 480, 720, 960, 1200
		let code = i - 1;
		let points = fora.deductionPts[i];
		$('#get' + points)[0].onclick = () => {
			// creates {240, 0}, {480, 1}, {720, 2}, {960, 3}, {1200, 4}
			coupon = { points, code };
			// checks if user has enough points to redeem points for the coupon clicked
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
	//check if points is enough to deduct points, because modal may be still opened
	$('#confirmRedeem')[0].onclick = async () => {
		if (user.pointsForExchange >= coupon.points) {
			user.pointsForExchange -= coupon.points;
			user.coupons[coupon.code]++;
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
		await updateUserData(user);
	};
});
