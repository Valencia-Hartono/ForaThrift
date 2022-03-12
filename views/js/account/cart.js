fora.scripts.push(async () => {
	//CART.PUG
	fora.account.reserved = await getItems(user.reserved);
	displayItems('#reservedItems', fora.account.reserved);

	let cart = {};
	let discountedSubtotal = [];

	function makeDiscountSelector() {
		let itemSubtotal = 0;
		let discountIdx = 0;
		let deliveryIdx = 0;
		for (let i = 0; i < user.address.length; i++) {
			$(`#selectedDeliveryAddress`).append(
				//NEED HELP
				`<option value="${i}" ${(deliveryIdx = 0 ? 'disabled' : '')}> ${user.address[i]} </option>`
			);
		}
		for (let i = 0; i < user.reserved.length; i++) {
			//adds the price of every item in user.reserved
			itemSubtotal += fora.account.reserved[i].price;
		}
		$('#preCouponSubtotal').text(itemSubtotal.toFixed(2) + ' RMB');
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

		discountedSubtotal[0] = itemSubtotal;

		//sets discountBilling array to the discounted price options
		//"discount": [10, 25, 40, 55, 70]
		//ex.totalBilling = 100 rmb -> after this loop, discountBilling = [90, 75, 60, 45, 30] rmb
		$(`#discountSelector`).append(`<option value="0"> no discount | ${itemSubtotal.toFixed(2)} RMB </option>`);

		for (let i = 1; i < 6; i++) {
			let discount = (100 - fora.discount[i]) / 100;
			discountedSubtotal[i + 1] = itemSubtotal * discount;
			$(`#discountSelector`).append(
				`<option value="${i + 1}" ${!user.coupons[i] ? 'disabled' : ''}> ${
					fora.discount[i]
				}% discount | ${discountedSubtotal[i + 1].toFixed(2)} RMB </option>`
			);
		}

		$('#discountSelector')[0].onchange = () => {
			discountIdx = $('#discountSelector').val();
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
		cart.subtotal = discountedSubtotal[discountIdx];
		//set sales tax
		cart.salesTax = (cart.subtotal * 7) / 100;
		//set rewarded pts
		cart.totalRewardedPoints = Math.ceil(cart.subtotal * 2);

		$('#itemSubtotal').text(cart.subtotal.toFixed(2) + ' RMB');
		$('#salesTax').text(cart.salesTax.toFixed(2) + ' RMB');
		$('#totalRewardedPoints').text(cart.totalRewardedPoints + 'pts');
		//set discounted price + sales tax
		cart.total = cart.subtotal + cart.salesTax;
	}

	//calculates shipping fee
	function calculateShipping(deliveryIdx) {
		//set shipping cost
		if (deliveryIdx == 0) {
			cart.shippingCost = 0;
		} else {
			cart.shippingCost = 12;
		}
		$('#shippingCost').text(cart.shippingCost + ' RMB');
	}

	//calculate Billing function calculates both Discount and Shipping
	function calculateBilling(discountIdx, deliveryIdx) {
		calculateDiscount(discountIdx);
		calculateShipping(deliveryIdx);
		//set totalBilling= discounted price + sales tax + shipping cost
		cart.totalBilling = cart.total + cart.shipping;
		$('#totalBilling').text(cart.totalBilling.toFixed(2) + ' RMB');

		//cart.items[] copies user.reserved[]
		cart.items = user.reserved;
		//cart.couponUsed copies selected discountIdx
		cart.couponUsed = discountIdx;

		//set variables back to 0
		discountIdx = 0;
		deliveryIdx = 0;
		itemSubtotal = 0;
	}

	calculateBilling(0, 0);

	window.submitCartForm = async () => {
		// send cart to server
		//let cart.timeRequested= Date.now()
	};
});
