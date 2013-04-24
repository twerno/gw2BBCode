		
	function Gw2BBCodeHelper() {};	
		
	Gw2BBCodeHelper.getImgUrl = function(gw2Global, dataObj) {
		var id       = dataObj['id'],
			prof     = dataObj['p']||"",
		    type     = dataObj['t'],
		    traitIdx = dataObj['ti'],
			gw2db    = dataObj['gw2db']||0,
			folder   = gw2Global.types_names[type],
			imgTag   = '';
	
		if ((folder||"") === "")
			throw new Error("Undefined img folder for type:" +type +" !");	
			
		if (gw2db !== 0)
			id = gw2db;			
			
		if (type === 'tr' && (prof === "" || traitIdx === 0)) 
			return "{0}/{1}/{2}.png".format(gw2Global.imagesUrl, folder, traitIdx); /*trait image*/
		else if (type === 'tr' && prof !== "" && traitIdx === 0)
			return "{0}/{1}/{2}.png".format(gw2Global.imagesUrl, folder, prof); /*trait image*/
		else
			return "{0}/{1}/{2}.png".format(gw2Global.imagesUrl, folder, id);
	}