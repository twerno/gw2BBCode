
	function LangPackHelper() {};
	
	LangPackHelper.getExprStr_profs = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.profs_En, 'prof');
	}
	
	LangPackHelper.getExprStr_stances = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.stances_En, 'stance');
	}
	
	LangPackHelper.getExprStr_types = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.types_En, 'types');
	}

	LangPackHelper.getExprStr_generic = function(gw2Global, resourceMgr, masterPack_arr, dictName) {
		var i = 0, 
		    j = 0,
			pack = null,
		    result = '';
			
		for (i = 0; i < masterPack_arr.length; i++) {
			result += masterPack_arr[i][0]+'|';
		};
			
		for (i = 0; i < gw2Global.lang_packs.length; i++) {
			pack = resourceMgr.getResource(gw2Global.lang_packs[i]['url'], gw2Global.lang_packs[i]['ver']);
			if (pack === null)
				continue;
			for (j = 0; j < pack.dicts[dictName].length; j++) {
				if (result.indexOf(pack.dicts[dictName][j]) === -1)
					result += pack.dicts[dictName][j]+'|';
			};
		};
		
		return result.slice(0, result.length -1);
	}
	
	LangPackHelper.getProfCodeFor = function(gw2Global, resourceMgr, profStr) {
		return LangPackHelper.getCodeFor(gw2Global, resourceMgr, profStr, gw2Global.profs_En, 'prof');
	}
	
	LangPackHelper.getStanceCodeFor = function(gw2Global, resourceMgr, stanceStr) {
		return LangPackHelper.getCodeFor(gw2Global, resourceMgr, stanceStr, gw2Global.stances_En, 'stance');
	}
	
	LangPackHelper.getTypeCodeFor = function(gw2Global, resourceMgr, typeStr) {
		return LangPackHelper.getCodeFor(gw2Global, resourceMgr, typeStr, gw2Global.types_En, 'types');
	}
	
	LangPackHelper.getCodeFor = function(gw2Global, resourceMgr, itemStr, masterPack_arr, dictName) {
		if (itemStr === "")
			return "";

		var i = 0, j = 0, pack = null, itemLow = itemStr.toLowerCase();
		
		for (i = 0; i < masterPack_arr.length; i++) {
			if (itemLow === masterPack_arr[i][1].toLowerCase())
				return masterPack_arr[i][0];
		};
		
		for (i = 0; i < gw2Global.lang_packs.length; i++) {
			pack = resourceMgr.getResource(gw2Global.lang_packs[i]['url'], gw2Global.lang_packs[i]['ver']);
			if (pack === null)
				continue;

			for (j = 0; j < pack.dicts[dictName].length && j < masterPack_arr.length; j++) {
				if (itemLow === pack.dicts[dictName][j].toLowerCase())
					return masterPack_arr[j][0];
			};
		}
		
		return '';
	}
	