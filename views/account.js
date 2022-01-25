/* ACCOUNT */

$(async () => {
	// jQuery wrapper

	await fora.load();

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

	let discount = [10, 25, 40, 55, 70];
	let deductionPts = [400, 480, 720, 960, 1200];

	function appendCouponButtons(discountArray, deductionArray) {
		// $(`#discountButtons`).append(`new version`);
		for (let i = 0; i < discountArray.length; i++) {
			$(`#discountButtons`).append(`
			<p>
				<button id="redeem${deductionArray[i]}" class="btn btn-green">
					Redeem ${discountArray[i]}% discount (-${deductionArray[i]}pts)
				</button>
				Number of ${discountArray[i]}% coupons you have:
				<span id="couponAmount${deductionPts[i]}">
					${user.coupons[i] || '0'}
				</span>
			</p>
			`);
		}
	}
	appendCouponButtons(discount, deductionPts);

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

			$('#redeem' + points)[0].onclick = () => {
				coupon = { points, code };
				//if fail, display alert saying it is unsuccessful
				if (user.pointsForExchange < coupon.points) {
					$('#couponStatus').append(`
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
	couponSetter(deductionPts);

	//once confirm button is clicked, corresponding points are deducted from user's "points for exchange"
	//the element in the discount index will add one
	//for example, alexa [0, 0, 0, 0, 0]
	//after clicking on the [1], it becomes [0, 1, 0, 0, 0] (one 25% discount coupon is gained, 480pts are deducted)
	//after clicking on the [3], it becomes [0, 1, 0, 1, 0] (one 55% discount coupon is gained, additional 960pts are deducted)
	//after clicking on the [4], it becomes [0, 1, 0, 1, 1] (one 70% discount coupon is gained. additional 1200pts are deducted)

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
			$('#couponStatus').append(`
	<div class="alert alert-success" role="alert">
		Coupon for ${coupon.points} points successfully redeemed!
	</div>`);
		}
	};

	// 	//make a function that checks if a user has that item in their user.___ array
	// 	//takes in parameter user.__ array and item.ID and return a boolean value true or false
	// 	function checkArrayForItem(searchedArray, searchedItemID){
	// 		let found=0;
	// 		for (let i = 0; i < length; i++) {
	// 			//loops through array
	// 			if (searchedArray[i]==searchedItemID){
	// 				found++;
	// 			}
	// 		}
	// 		if (found==1){
	// 			return true;
	// 		}
	// 		else {
	// 			return false;
	// 		}
	// 	}

	// 	$('#confirmChanges')[0].onclick = async () => {
	// 		// var warningSpeech;
	// 		// //if item is not
	// 		// if (!checkArrayForItem(reserved))//queue is unchecked){
	// 		// 	warningSpeech="give up your spot in line for this item";
	// 		// }
	// 		// else if (//confirmRedeemModal is

	// 		// $('#confirmChangesAlert').text('Are you sure you want to ' + warningSpeech + ' ?');
	// 		if (//#item_queue checkbox in item_descriptor.pug is checked){
	// 			//check if user.reserved array contains item.ID
	// 			//if yes, leave it
	// 			//if no, add it
	// 		}
	// 		else if (//#item_queue checkbox in item_descriptor.pug is not checked){
	// 			//check if user.reserved array contains item.ID
	// 			//if yes, remove it
	// 			//if no, leave it
	// 		}
	// 		if (//#item_favorite checkbox in item_descriptor.pug is checked){
	// 			//check if user.favorites array contains item.ID
	// 			//if yes, leave it
	// 			//if no, add it
	// 		}
	// 		else if (//#item_favorite checkbox in item_descriptor.pug is not checked){
	// 			//check if user.favorites array contains item.ID
	// 			//if yes, remove it
	// 			//if no, leave it
	// 		}

	// 		//modified IF statements
	// 		if (checked&&existing || !checked&&!existing){
	// 			//leave it
	// 		}
	// 		else if (checked&&!existing){
	// 			//add it
	// 		}
	// 		else if (!checked&&existing){
	// 			//delete it
	// 		}
	// 		user.reserved -= coupon.points;
	// 		user.coupons[coupon.code]++;

	// 		await updateUserData(user);

	// 		//display newly updated items in reserved.pug and favorites.pug (format similar to store.pug)
	// 		//reserved.pug only loops through user.reserved array
	// 		//favorites.pug only loops through user.favorites array

	// 		//update item queue and favorite status in store.pug when modals are opened
	// 		//or just set it so that in the item_descriptor area it always displays the boolean value (same one checked in above if statement)
	// 		//boolean value is if user.reserved array contains item.ID & user.favorites array contains item.ID

	// 		$('.pointsExchangable').text(user.pointsForExchange);
	// 		//display newly updated coupon amount
	// 		$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
	// 		//newly updated # of coupons in coupons.pug should be displayed in green color (CSS)
	// 		$('#couponAmount' + coupon.points).addClass('green');

	// 		$('#couponStatus').append(`
	// <div class="alert alert-success" role="alert">
	//   Coupon for ${coupon.points} points successfully redeemed!
	// </div>`);
	// 	};
	// });

	// $(async () => {
	// 	// categories(clothing, accessories, shoes, bags), types (ex.bottoms, tops, overalls), subTypes (ex.jeans, shorts...)
	// 	let reserved = await (await fetch('reserved.json')).json();
	// 	log(reserved);

	// 	//instead of inputing types manually, use a function
	// 	for (let category of categories.names) {
	// 		addColumns(category);
	// 	}

	// 	$('#clothingSidebar').show();

	// 	$('#shoes').show();

	// 	//for nav bar; adds category types and subtypes on second nav bar, evenly split in three column
	// 	function addColumns(category) {
	// 		let $menu = $('#' + category + 'Menu');
	// 		let $cols = $menu.find('.col');
	// 		let $categories = $('#categories');
	// 		$categories.append('<div id="' + category + 'Sidebar" class="row"></div>'); //ex. id=clothingSidebar
	// 		let $category = $('#' + category + 'Sidebar'); // retrieves the element
	// 		$category.hide();
	// 		let types = categories[category].typeNames; // get the array of type names ex. tops, bottoms

	// 		//evenly distribute category types within the three columns
	// 		let cols = [0, 0, 0];

	// 		for (let i = 0; i < types.length; i++) {
	// 			//loops through array of type names
	// 			let type = types[i]; //retrieves a type name (ex.top or bottom)
	// 			// find which column has the least amount of items
	// 			// place the type and sub-cat options in that column
	// 			let colNumMin = 0;
	// 			for (let i = 1; i < cols.length; i++) {
	// 				if (cols[colNumMin] > cols[i]) {
	// 					colNumMin = i;
	// 				}
	// 			}

	// 			$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col">' + type + '</a></div>');
	// 			$category.append('<a href="#" class="col-12">' + type + '</a>');

	// 			let subtypes = categories[category][type]; // retrieves the array of the type names
	// 			for (let j = 0; j < subtypes.length; j++) {
	// 				let subtype = subtypes[j];
	// 				$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col"> ➤ ' + subtype + '</a></div>');
	// 				$category.append('<a href="#" class="col-12"> ➤ ' + subtype + '</a>');
	// 			}
	// 			cols[colNumMin] += subtypes.length + 1;
	// 		}
	// 	}
});
