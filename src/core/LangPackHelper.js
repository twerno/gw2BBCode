
	function LangPackHelper() {};
	
	LangPackHelper.getExprStr_profs = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.prof_s_langEn, 'prof');
	}
	
	LangPackHelper.getExprStr_stances = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.stances_langEn, 'stance');
	}
	
	LangPackHelper.getExprStr_types = function(gw2Global, resourceMgr) {
		return LangPackHelper.getExprStr_generic(gw2Global, resourceMgr, gw2Global.types_langEn, 'types');
	}

	LangPackHelper.getExprStr_generic = function(gw2Global, resourceMgr, masterPack_arr, dictName) {
		var i = 0, 
		    j = 0,
			pack = null,
		    result = '';
			
		for (i = 0; i < masterPack_arr.length; i++) {
			result += masterPack_arr[i]+'|';
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
	
	LangPackHelper.getProfIDFrom = function(gw2Global, resourceMgr, profStr) {
		return LangPackHelper.getMasterItemIDFor(gw2Global, resourceMgr, profStr, gw2Global.prof_s_langEn, 'prof');
	}
	
	LangPackHelper.getStanceIDFrom = function(gw2Global, resourceMgr, stanceStr) {
		return LangPackHelper.getMasterItemIDFor(gw2Global, resourceMgr, stanceStr, gw2Global.stances_langEn, 'stance');
	}
	
	LangPackHelper.getTypeIDFrom = function(gw2Global, resourceMgr, typeStr) {
		return LangPackHelper.getMasterItemIDFor(gw2Global, resourceMgr, typeStr, gw2Global.types_langEn, 'types');
	}
	
	LangPackHelper.getMasterItemIDFor = function(gw2Global, resourceMgr, itemStr, masterPack_arr, dictName) {
		if (itemStr === "")
			return "";

		var i = 0, j = 0, pack = null, itemLow = itemStr.toLowerCase();
		
		for (i = 0; i < masterPack_arr.length; i++) {
			if (itemLow === masterPack_arr[i].toLowerCase())
				return masterPack_arr[i];
		};
		
		for (i = 0; i < gw2Global.lang_packs.length; i++) {
			pack = resourceMgr.getResource(gw2Global.lang_packs[i]['url'], gw2Global.lang_packs[i]['ver']);
			if (pack === null)
				continue;

			for (j = 0; j < pack.dicts[dictName].length && j < masterPack_arr.length; j++) {
				if (itemLow === pack.dicts[dictName][j].toLowerCase())
					return masterPack_arr[j];
			};
		}
		
		return '';
	}
	