const log = console.log; // shortcut

// enable popovers
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
	return new bootstrap.Popover(popoverTriggerEl);
});
// enable tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	return new bootstrap.Tooltip(tooltipTriggerEl);
});

$(async () => {
	// categories(clothing, accessories, shoes, bags), types (ex.bottoms, tops, overalls), subTypes (ex.jeans, shorts...)
	let categories = await (await fetch('categories.json')).json();
	log(categories);
	//adds category types and subtypes on second nav bar, evenly split in three column
	function addColumns(category) {
		let $menu = $('#' + category + 'Menu');
		let $cols = $menu.find('.col');
		let $categories = $('#categories');
		$categories.append('<div id="' + category + 'Sidebar" class="row"></div>'); //ex. id=clothingSidebar
		let $category = $('#' + category + 'Sidebar'); // retrieves the element
		$category.hide();
		let types = categories[category].typeNames; // get the array of type names ex. tops, bottoms

		let cols = [0, 0, 0];

		for (let i = 0; i < types.length; i++) {
			//loops through array of type names
			let type = types[i]; //retrieves a type name (ex.top or bottom)
			// find which column has the least amount of items
			// place the type and sub-cat options in that column
			let colNumMin = 0;
			for (let i = 1; i < cols.length; i++) {
				if (cols[colNumMin] > cols[i]) {
					colNumMin = i;
				}
			}

			$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col">' + type + '</a></div>');
			$category.append('<a href="#" class="col-12">' + type + '</a>');

			let subtypes = categories[category][type]; // retrieves the array of the type names
			for (let j = 0; j < subtypes.length; j++) {
				let subtype = subtypes[j];
				$cols.eq(colNumMin).append('<div class="row"><a href="#" class="col"> - ' + subtype + '</a></div>');
				$category.append('<a href="#" class="col-12"> - ' + subtype + '</a>');
			}
			cols[colNumMin] += subtypes.length + 1;
		}
	}
	//instead of inputing types manually, use a function
	for (let category of categories.names) {
		addColumns(category);
	}

	$('#clothingSidebar').show();

	$('#shoes').show();

	// add Get Started/Sign In forms
	function openForm() {
		document.getElementById('myForm').style.display = 'block';
	}

	function closeForm() {
		document.getElementById('myForm').style.display = 'none';
	}
	//PROFILE
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

	if (window.location.href.includes('store')) {
		let items = (await (await fetch('items/1/0/0')).json()).items;

		let $items = $('#items');
		for (let item of items) {
			$items.append(`
			<div class="col-6 col-md-3">
				<img src="${item.img}"/>
				<div>${item.name}</div>
				<div>$${item.price}</div>
			</div>`);
		}
	}

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

		let url = window.location.href;
		url = url.slice(0, url.lastIndexOf('/')) + '/user';
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		});

		$('.pointsExchangable').text(user.pointsForExchange);
		$('#couponAmount' + coupon.points).text(user.coupons[coupon.code]);
		$('#couponAmount' + coupon.points).addClass('green');

		$('#couponStatus').append(`
<div class="alert alert-success" role="alert">
  Coupon for ${coupon.points} points successfully redeemed!
</div>`);
	};
});

//ACCOUNT PAGE FUNCTIONS
//PROFILE
// //check which rank and avatar depending on the total points status

// function checkPointsTotal() {
// 		var TotalPoints=____; //getPoints from user account
// 		$('#pointsTotal')=TotalPoints;
// 		return TotalPoints;
// }

//COUPONS
//when button is clicked, should display redeem success or sorry not enough points
