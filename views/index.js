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
	function couponSetter(couponTag, deductedPts) {
		$('#' + couponTag).click(function () {
			if (user.pointsForExchange >= deductedPts) {
				user.pointsForExchange -= deductedPts;
				alert('redeem success');
			} else {
				alert('not enough points');
			}
		});
	}
	couponSetter('redeem10', 240);
	couponSetter('redeem25', 480);
	couponSetter('redeem40', 720);
	couponSetter('redeem70', 1200);
});

//ACCOUNT PAGE FUNCTIONS
//PROFILE
// //check which rank and avatar depending on the total points status

// function checkPointsTotal() {
// 		var TotalPoints=____; //getPoints from user account
// 		$('#points-total')=TotalPoints;
// 		return TotalPoints;
// }

//COUPONS
//when button is clicked, should display redeem success or sorry not enough points
