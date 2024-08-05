Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}


Date.prototype.subDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() - days);
  return dat;
}

let internals = {};

internals.h_format = function(shr){
	let hh = parseInt(shr.slice(0,2));
	let mm = parseInt(shr.slice(2));
	let st = "";

	if (hh < 0 || hh > 24){
		throw Error(`internals.h_format - Value ${hh} is not a valid hour`);
	}

	if (mm < 0 || mm > 60){
		throw Error(`internals.h_format - Value ${mm} is not a valid minute`);
	}

	if (hh > 12){
		hh -= 12;
		st = "PM";
	} else if (hh === 12) {
		st = "PM";
	} else {
		st = "AM";
	}

	return hh + ":" + (mm < 10 ? '0':'') + mm + " " + st;
}

internals.string_to_date_es = function( text ){
	month_list_es = [
		'enero','febrero', 'marzo', 
		'abril','mayo','junio',
		'julio','agosto','septiembre',
		'octubre','noviembre','diciembre'
	];

	let date_vector = text.split(' ');
	let date  = parseInt(date_vector[0]);
	let month = month_list_es.indexOf( date_vector[2].toLowerCase() );
	let year  = parseInt(date_vector[4]);

	let result = new Date( year, month, date );
	return result;
}

module.exports = internals;