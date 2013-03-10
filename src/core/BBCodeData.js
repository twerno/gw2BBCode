	
	BBCodeDataEntry = function(name) {
		this.name = name;
		this.dataObj = null;
		this.nameObj = null;
		
		this.isMacro = function() {
			return this.dataObj !== null && this.dataObj['t'] === "m";
		};
		this.dataObjSet = [];
		
		this.fillWeaponSetData = function(gw2DataMap) {
			if (this.isMacro())
				for (var i = 0; i < this.dataObj['m'].length; i++)
					this.dataObjSet.push(gw2DataMap.dataMap[this.dataObj['m'][i]]||null);
		}
	}
	
	BBCodeData = function(gw2Global, resourceMgr, patternType) {
		this.gw2Global = gw2Global;
		this.resourceMgr = resourceMgr;

		this.patternType = patternType;
		this.orig  = '';
		this.regex = '';
		this.entry1 = null;
		this.entry2 = null;
		
		this.showAsText = false;
		this.isPrefixed = false; /* gw2: */
		this.options    = '';
		
		this.forcedIdx = -1;
		
		this.stance    = '';
		this.type      = '';
		this.prof      = '';
		this.stanceStr = '';
		this.typeStr   = '';
		this.profStr   = '';
		
		
		this.isWeaponSet = function() {return this.entry1 !== null && this.entry2 !== null};

		this.toString = function() {
			return "regex: " +this.regex +"<br>"
			      +"name1: " +this.name1 +"<br>" 
				  +"name2: " +this.name2 +"<br>"
				  +"showAsText: " +this.showAsText +"<br>"
				  +"isPrefixed: " +this.isPrefixed +"<br>"
				  +"stance: " +this.stance +"<br>"
				  +"forcedIdx: " +this.forcedIdx +"<br>"
				  +"type: " +this.type +"<br>"
				  +"prof: " +this.prof +'<br><br>';
		};
		
		this.setStance = function(stanceStr) {
			this.stance    = LangPackHelper.getStanceCodeFor(gw2Global, resourceMgr, stanceStr); 
			this.stanceStr = stanceStr;
		}
		
		this.setType = function(typeStr) {
			this.type    = LangPackHelper.getTypeCodeFor(gw2Global, resourceMgr, typeStr);
			this.typeStr = typeStr;
		}
		
		this.setProfession = function(profStr) {
			this.prof    = LangPackHelper.getProfCodeFor(gw2Global, resourceMgr, profStr);
			this.profStr = profStr;
		}
		
		this.isCorrect = function() {
			if ((this.entry1 === null) && (this.entry2 !== null))
				return false;
			if ((this.entry1 !== null) && (this.entry1.dataObj === null || this.entry1.dataObj === null))
				return false;
			if ((this.entry2 !== null) && (this.entry2.dataObj === null || this.entry2.dataObj === null))
				return false;
			
			return true;
		}
	};