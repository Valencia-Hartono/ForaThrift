function categorySelection(val) {
	log(val);
	log(val.split(' '));

	$('#categorySelector button').removeClass('show');
	$('#categorySelector ul').removeClass('show');

	$('#categorySelector button').eq(0).text(val);
	$('#categorySelector input').val(val);
}
