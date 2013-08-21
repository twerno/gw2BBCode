		
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
		return dataObj['t'] +"-" +dataObj['id'];
	}
	
	Gw2DBHelper.getGw2DBTooltipUrl = function(gw2Global, type, gw2DBID) {
		return gw2Global.gw2DB_PopupHost.format(type, gw2DBID);
	}
	
	Gw2DBHelper.getTooltipContent = function(name, text) {
		return {'Tooltip': "<div class='db-tooltip db-tooltip-skill p-tooltip_gw2'><div class='db-description'><dl class='db-summary'><dt class='db-title'>{0}</dt><dd class='db-skill-description'>{1}</dd></dl></div></div>"
		  .format(name, text)};
	}
	
	Gw2DBHelper.gw2DBItemUrl = function(gw2Global, dataObj) {
		var gw2ItemID = Gw2DBHelper.getGw2DBID(dataObj);

		if (gw2ItemID === -1)
			return '#'
		else	
			return "{0}/{1}/{2}".format(gw2Global.gw2DBUrl, 
										gw2Global.types_names[dataObj['t']], 
										gw2ItemID);
	}