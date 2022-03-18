fora.scripts.push(async () => {
	//CART.PUG
	fora.account.reserved = await getItems(user.reserved);
	displayItems('#reservedItems', fora.account.reserved);

	let cart = {};
	let subtotals = [];

	function makeDiscountSelector() {
		let itemSubtotal = 0;
		let discountIdx = 0;
		let deliveryIdx = 0;

		for (let i = 0; i < fora.account.reserved.length; i++) {
			//adds the price of every item in user.reserved
			itemSubtotal += fora.account.reserved[i].price;
		}
		itemSubtotal = Number(itemSubtotal.toFixed(2));
		$('#preCouponSubtotal').text(itemSubtotal + ' RMB');
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

		subtotals[0] = itemSubtotal;

		//sets discountBilling array to the discounted price options
		//"discount": [10, 25, 40, 55, 70]
		//ex.total = 100 rmb -> after this loop, discountBilling = [90, 75, 60, 45, 30] rmb
		$(`#discountSelector`).append(`<option value="0"> no discount | ${itemSubtotal} RMB </option>`);

		for (let i = 1; i < 6; i++) {
			let discount = (100 - fora.discount[i]) / 100;
			subtotals[i] = Number((itemSubtotal * discount).toFixed(2));
			$(`#discountSelector`).append(
				`<option value="${i}" ${!user.coupons[i] ? 'disabled' : ''}> ${fora.discount[i]}% discount | ${subtotals[
					i
				].toFixed(2)} RMB </option>`
			);
		}

		$('#discountSelector')[0].onchange = () => {
			discountIdx = Number($('#discountSelector').val());
			calculateBilling(discountIdx, deliveryIdx);
		};

		$('#deliveryMethodSelector')[0].onchange = () => {
			deliveryIdx = $('#deliveryMethodSelector').val();
			if (deliveryIdx == 0) {
				$('#delivery').hide();
			} else {
				$('#delivery').show();
			}
			calculateBilling(discountIdx, deliveryIdx);
		};
	}

	makeDiscountSelector();

	//calculates discounted price, sales tax, rewarded points
	function calculateDiscount(discountIdx) {
		//set discounted price
		cart.subtotal = subtotals[discountIdx];
		//set sales tax at 7%
		cart.salesTax = Number((cart.subtotal * 0.07).toFixed(2));
		//set rewarded pts
		cart.rewardPoints = Math.ceil(cart.subtotal * 2);

		$('#subtotal').text(cart.subtotal.toFixed(2) + ' RMB');
		$('#salesTax').text(cart.salesTax.toFixed(2) + ' RMB');
		$('#rewardPoints').text(cart.rewardPoints + 'pts');
	}

	//calculates shipping fee
	function calculateShipping(deliveryIdx) {
		//set shipping cost
		if (deliveryIdx == 0) {
			cart.shipping = 0;
		} else {
			cart.shipping = 12;
		}
		$('#shipping').text(cart.shipping.toFixed(2) + ' RMB');
	}

	//calculate Billing function calculates both Discount and Shipping
	function calculateBilling(discountIdx, deliveryIdx) {
		calculateDiscount(discountIdx);
		calculateShipping(deliveryIdx);
		//set total= discounted price + sales tax + shipping cost
		cart.total = Number((cart.subtotal + cart.salesTax + cart.shipping).toFixed(2));
		$('#total').text(cart.total.toFixed(2) + ' RMB');

		//cart.items[] copies user.reserved[]
		cart.items = user.reserved;
		//cart.coupon copies selected discountIdx
		cart.coupon = discountIdx - 1;

		//set variables back to 0
		discountIdx = 0;
		deliveryIdx = 0;
		itemSubtotal = 0;
	}

	calculateBilling(0, 0);

	window.submitCartForm = async () => {
		// send cart to server
		cart.timeRequested = Date.now();
		cart.username = user.username;
		cart.wechatID = user.wechatID;
		cart.sent = false;
		let res = await (
			await fetch('/account/cart/orderRequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(cart)
			})
		).json();
		if (res.msg == 'success') {
			$('#orderStatusAlert').append(`
	<div class="alert alert-success" role="alert">
	Your request is successful! Payment should be received within 24hrs (view payment QR code and your order in "orders" tab). It may take 2 business days for admin to confirm your order. 
	</div>`);
			//reference to clear array: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
			// user.reserved = [];
			user.coupons[cart.coupon]--;
			//orders.JSON counter adds one
			cart = {};
			$('#confirmOrderModal').modal('hide');
		} else {
			$('#orderStatusAlert').append(`
	<div class="alert alert-danger" role="alert">
	Order failed :(
	</div>`);
		}
	};
});
