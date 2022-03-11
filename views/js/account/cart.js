fora.scripts.push(async () => {
	//CART.PUG
	fora.account.reserved = await getItems(user.reserved);
	displayItems('#reservedItems', fora.account.reserved);

	let cart = {};

	let discountedSubtotal = [];
	function makeDiscountSelector() {
		let itemSubtotal = 0;
		let discountIdx = 0;
		let pickUpIdx = 0;
		for (let i = 0; i < user.address.length; i++) {
			$(`#selectedDeliveryAddress`).append(
				//NEED HELP
				`<option value="${i}" ${(pickUpIdx = 0 ? 'disabled' : '')}> ${user.address[i]} </option>`
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
			calculateBilling(discountIdx, pickUpIdx);
		};

		$('#pickupMethodSelector')[0].onchange = () => {
			pickUpIdx = $('#pickupMethodSelector').val();
			if (pickUpIdx == 0) {
				$('#delivery').hide();
			} else {
				$('#delivery').show();
			}
			calculateBilling(discountIdx, pickUpIdx);
		};
	}

	makeDiscountSelector();

	//calculates discounted price, sales tax, rewarded points
	function calculateDiscount(discountIdx) {
		let subtotal = discountedSubtotal[discountIdx];
		let salesTax = (subtotal * 7) / 100;
		let rewardPoints = Math.ceil(subtotal * 2);

		$('#itemSubtotal').text(subtotal.toFixed(2) + ' RMB');
		$('#salesTax').text(salesTax.toFixed(2) + ' RMB');
		$('#rewardPoints').text(rewardPoints + 'pts');
		return subtotal + salesTax;
	}

	//calculates shipping fee
	function calculateShipping(pickUpIdx) {
		let shippingCost;
		if (pickUpIdx == 0) {
			shippingCost = 0;
		} else {
			shippingCost = 12;
		}
		$('#shippingCost').text(shippingCost + ' RMB');
		return shippingCost;
	}

	//calculate Billing function calculates both Discount and Shipping
	function calculateBilling(discountIdx, pickUpIdx) {
		cart.subtotal = calculateDiscount(discountIdx);
		cart.shipping = calculateShipping(pickUpIdx);
		cart.totalBilling = cart.subtotal + cart.shipping;
		$('#totalBilling').text(cart.totalBilling.toFixed(2) + ' RMB');
		discountIdx = 0;
		pickUpIdx = 0;
	}

	calculateBilling(0);

	window.submitCartForm = async () => {
		// send cart to server
	};
});
