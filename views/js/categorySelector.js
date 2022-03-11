function categorySelection(val) {
	$('#categorySelector button').removeClass('show');
	$('#categorySelector ul').removeClass('show');

	$('#categorySelector button').eq(0).text(val);

	let c = val.split(' | ');
	let cat = fora.categories.names.indexOf(c[0]);
	let type = fora.categories[c[0]].typeNames.indexOf(c[1]);
	let subtype = 0;
	if (c[2]) subtype = fora.categories[c[0]][c[1]].indexOf(c[2]);

	$('#categorySelector input').val([cat, type, subtype].join(''));
}
