		
	function Gw2DBHelper() {};	
		
	Gw2DBHelper.getGw2DBID = function(dataObj) {
		return (dataObj['gw2db']||0) !== 0 ? dataObj['gw2db'] : dataObj['id'];
	}