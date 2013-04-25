		
	function Gw2DBHelper() {};	
		
	Gw2DBHelper.getGw2DBID = function(dataObj) {
		return (dataObj['gw2db']||0) !== 0 ? dataObj['gw2db'] : dataObj['id'];
	}
	
	Gw2DBHelper.convertCode = function(code, converter) {
		var i, result = '??';
		for (i = 0; i < converter.length; i++)
			if (converter[0] === code) {
				result = converter[1];
				break;
			}
		return result;	
	}
	
	Gw2DBHelper.getUniqID = function(dataObj) {
		return dataObj['t'] +"-" +Gw2DBHelper.getGw2DBID(dataObj);
	}