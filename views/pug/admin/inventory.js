// /* INVENTORY */

// $(async () => {
// 	//style, quality, value ratings are added in an arrayRatings; each holds a value from 0-5
// 	//function checkRewardedPoints takes in the parameter of an array of ratings and the rewarded points for each star
// 	//starValue is taken out of function as a general value instead of a set value
// 	let arrayRatings=[styleRating, qualityRating, valueRating];
// 	function checkRewardedPoints(array, starValue1, starValue2, starValue3, starValue4, starValue5) {
// 		let totalRewardedPoints=0;
// 		for (let i=0; i<array.length; i++){
// 			if (array[i]=1){
// 				totalRewardedPoints=totalRewardedPoints+starValue1;
// 			}
// 			else if (array[i]=2){
// 				totalRewardedPoints=totalRewardedPoints+starValue2;
// 			}
// 			else if (array[i]=3){
// 				totalRewardedPoints=totalRewardedPoints+starValue3;
// 			}
// 			else if (array[i]=4){
// 				totalRewardedPoints=totalRewardedPoints+starValue4;
// 			}
// 			else if (array[i]=5){
// 				totalRewardedPoints=totalRewardedPoints+starValue5;
// 			}
// 		}
// 		return totalRewardedPoints;
// 		$('#rank').empty();
// 		$('#rank').append(rank);
// 	}
// 	//admin can customize if they change their mind about how the value works; 1 star can be 10pts or 20pts or 25pts etc.
// 	checkRewardedPoints(arrayRatings, 10, 40, 90, 160, 250);
// }

//NEW MODIFIED CODE
$('#calculateRewardedPoints')[0].onclick = async () => {
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

	//style, quality, value ratings are added in an arrayRatings; each holds a value from 0-5
	//function checkRewardedPoints takes in the parameter of an array of ratings and the rewarded points for each star
	//starValue is taken out of function as a general value instead of a set value
	let styleRating = 2;
	let qualityRating = 5;
	let valueRating = 4;

	let starValue1 = 10;
	let starValue2 = 40;
	let starValue3 = 90;
	let starValue4 = 160;
	let starValue5 = 250;

	//ratings=[2,5,4]
	let ratings = [styleRating, qualityRating, valueRating];
	//starValues=[10,40,90,160,250]
	let starValues = [starValue1, starValue2, starValue3, starValue4, starValue5];

	function checkRewardedPoints(ratingArray, starValueArray) {
		let totalRewardedPoints = 0;
		for (let i = 0; i < ratingArray.length; i++) {
			let value = array[i] - 1;
			totalRewardedPoints = totalRewardedPoints + starValueArray[value];
			totalRewardedPoints = 10;
		}
		$('#reward').append(totalRewardedPoints + 'pts');
	}
	//admin can customize if they change their mind about how the value works; 1 star can be 10pts or 20pts or 25pts etc.
	checkRewardedPoints(ratings, starValues);
};
