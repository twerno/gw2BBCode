
	ClassicPattern = function(gw2Global, resourceMgr) {
		
		var resourceMgr = resourceMgr;
		var gw2Global   = gw2Global;
		
		var regExpr = new RegExp(
			"\\[([@^_]*)(gw2:)?(("
		   +LangPackHelper.getExprStr_profs(gw2Global, resourceMgr)	
		   +"):)?(("
		   +LangPackHelper.getExprStr_types(gw2Global, resourceMgr)	
		   +"):)?(.*?)(\\|(.*?))?(:("
		   +LangPackHelper.getExprStr_stances(gw2Global, resourceMgr)	
		   +"))?(\\.(\\d+))?\\]", "gi");
		
		this.process = function(data) {
			var result = [],
				match = regExpr.exec(data),
				found = null;
			while (match !== null) {
				found = getResultForMatch(match);
				match = regExpr.exec(data);
				result.push(found);
			};
			return result;
		};
		
		var getResultForMatch = function(match) {
			var result        = new BBCodeData(gw2Global, resourceMgr, 'gw2BBCode');
			result.orig       = (match[0]||"");
			result.regex      = new RegExp((match[0]||"").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"), "gi");
			result.showAsText = (match[1]||"").indexOf('@') !== -1;;
			result.options    = (match[1]||"");
			result.isPrefixed = (match[2]||"").toLowerCase() === "gw2:";
			result.entry1     = ((match[7]||'') !== "") ? new BBCodeDataEntry(match[7]) : null;
			result.entry2     = ((match[9]||'') !== "") ? new BBCodeDataEntry(match[9]) : null;
			result.forcedIdx  = Math.max(1, match[13]||1);

			result.setProfession(match[4]||"");
			result.setType(match[6]||"");
			result.setStance(match[11]||"");

			return result;
		};
	};