
	var gw2DBMap = {};
	
	function init() {
		$(includeTo.join(',')).addClass('gw2BBCode');
		initElements();
		addPopup2Gw2DBLinks();
		loadStyle(popup_style);
		loadStyle(gw2_styles);
		gw2BBCode();
		initPopups();
		registerWeaponSwapHandlers();
		initGoogleAnalitics();
	}	
	
	/*
	 *  Utilities
	 *
	 */
	
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	};	
	
	function loadLib(libUrl) {
		var fileRef=document.createElement('script');
		fileRef.setAttribute("type","text/javascript");
		fileRef.setAttribute("src", libUrl);
		document.getElementsByTagName('head')[0].appendChild(fileRef);
	}
	
	function loadStyle(libUrl) {
		var link = document.createElement('link');
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = libUrl;
		link.media = 'all';
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	
	function addPopup2Gw2DBLinks() {
		$(".gw2BBCode a").each(function() {
			if (this.host == 'www.gw2db.com') {
				var myRegexp = /http:\/\/www.gw2db.com\/(\w+)\/(\d+)-/g;
				var match = myRegexp.exec(this.href);
				if (match != null)
					$(this).addClass("gw2DBTooltip gw2DB{0}_{1}".format(match[1], match[2]));
			}
		});
	}

	function getKeyFromName(gw2ElementName) {
		var match = /(\w)/.exec(gw2ElementName);
		if (match)
			return match[1].toLowerCase();
		return "";	
	}
	
	function initElements() {
		var key;
		var arr;
		for (var i = 0; i < gw2Elements.length; i++) {
			gw2Elements[i].type = element_type[gw2Elements[i].t];
			
			if(gw2Elements[i].t == "tr") {
				saveInCache(gw2Elements[i].type, 
					gw2Elements[i].id, 
					"<div class='db-tooltip db-tooltip-skill'><div class='db-description'><dl class='db-summary'>"
				   +"<dt class='db-title'>{0}</dt></dl><p>{1}</p></div></div>".format(gw2Elements[i].n, gw2Elements[i].td))
			}
			
			key = getKeyFromName(gw2Elements[i].n);
			arr = gw2DBMap[key];
			if (!arr) {
				arr = new Array();
				gw2DBMap[key] = arr;	
			}
			arr.push(gw2Elements[i]);
		}
	}
	
	/*
	 *
	 *  Gw2BBCode 
	 *
	 */
	
	function gw2BBCode() {
		processExclusion(/\[/g, '{#}');
		try {
			//$($("*").get().reverse()).each(function() {
			$(".gw2BBCode").each(function() { gw2BBCodeAt(this); });
		} finally {
			processExclusion(/\{#\}/g, '[');
		}
	}
	
	function gw2BBCodeAt(element) {
		/* process macros */
		var regExpr = new RegExp("\\[(gw2:)?(@?)(.*?)(\\.\\d+)?\\]", "g");
		processContent(element, regExpr, function(match) {
			return genMacroContent(match[3], match[2]=="@", element_type['s'], (match[4] || "1").replace(".", ""), 
				match[1] == "gw2:");
		});

		/* process gw2BBCode */
		regExpr = new RegExp("\\[(gw2:)?(@?)(skill:|trait:|boon:|condition:)?(.*?)(\\.\\d+)?\\]", "g");
		processContent(element, regExpr, function(match) {
			return genBBCodeContent(match[4], match[2]=="@", 
				(match[3] ? match[3].replace(":", "") + 's':match[3]), 
				(match[5] || "1").replace(".", ""),
				match[1] == "gw2:");
		});
	
		/* process weapons sets */
		regExpr = new RegExp("\\[(gw2:)?(@?)(\\w+):(\\w+(/\\w+)?)(\\|(\\w+(/\\w+)?))?(:(\\w+))?\\]", "g");
		processContent(element, regExpr, function(match) {
			return genWeaponSetsContent(match[3]||"", match[4]||"", match[7]||"", match[10]||"", match[2]=="@", 
			match[1] == "gw2:");
		}); 
	}
	
	function processContent(element, regExpr, genContentForMatch) {
		var text = element.innerHTML;
		var match = regExpr.exec(text);
		while (match != null) {
			var newContent = genContentForMatch(match);
			if (newContent != '')
				text = text.replace(match[0], newContent);
			match = regExpr.exec(text);
		}
		if (element.innerHTML != text)
			element.innerHTML = text;
	}
	
	function processExclusion(a, b) {
		$((".gw2BBCode {0}".format(excludeFrom.join(',')))).each(function() {
			var text = this.innerHTML.replace(a, b);
			if (text != this.innerHTML)
				this.innerHTML = text;
		});
	}
	
	function genWeaponSetsContent(profAlias, set1, set2, stance, showAsText) {
		var set1_content = weaponSetContent(profAlias, set1, stance, showAsText);
		var set2_content = weaponSetContent(profAlias, set2, stance, showAsText);
		if (set1_content == "" || (set2 != "" && set2_content == "")) return "";
		
		var tnSet2 = set2_content!="";
		return "<div class='gw2BBCode_weaponSetWraper'>{0}<div class='gw2BBCode_weaponSet'>{1}</div>{2}{3}{4}</div>"
			.format((tnSet2 ? "<div class='gw2BBCode_weaponSwap'></div>" : ""),
				set1_content,
				(tnSet2 ? "<div class='gw2BBCode_weaponSet' style='display:none;'>" : ""),
				set2_content,
				(tnSet2 ? "</div>" : ""));
	}
	
	function weaponSwapHandler(event) {
		if (window.getSelection().removeAllRanges)
			window.getSelection().removeAllRanges();
		$(event.target.parentElement).find('.gw2BBCode_weaponSet').each(function(){
			$(this).css('display', ($(this).css('display') == 'inline' ? 'none' : 'inline') );
		});
		hidePopup(true);
	}
	
	function registerWeaponSwapHandlers() {
		$('.gw2BBCode_weaponSwap')
			.unbind('click')
			.click(weaponSwapHandler);
	}
	
	function weaponSetContent(profAlias, setName, stance, showAsText, allowIncrementalSearch) {
		var setKey = "{0}:{1}{2}".format(profAlias || "", setName || "", ((stance||"")=="" ? "" : ":"+stance));
		var macro  = findGw2ElementByName(weaponMacros, setKey, '', 1, allowIncrementalSearch);
		if (macro)
			return genMacroContent2(macro.m, showAsText, element_type['s'], 1);
		else return "";	
	}
	
	function genBBCodeContent(gw2ElementName, showAsText, forceType, forceIdx, allowIncrementalSearch) {
		var gw2Element = findGw2ElementByName(gw2DBMap[getKeyFromName(gw2ElementName)], gw2ElementName, forceType, forceIdx, allowIncrementalSearch);
		if (gw2Element == null) return "";
		return genGw2ElementContent(gw2Element, showAsText);
	}
	
	function genGw2ElementContent(gw2Element, showAsText) {
		if (showAsText)
			return ("<a href='{0}' class='gw2DBTooltip gw2DB{1}_{2}'>{3}</a>")
				.format(getDescriptionUrl(gw2Element), gw2Element.type, gw2Element.id, gw2Element.n);
		else
			return ("<a href='{0}' class='gw2DBTooltip gw2DB{1}_{2}'><img src='{3}'></a>")
				.format(getDescriptionUrl(gw2Element), gw2Element.type, gw2Element.id, getImageUrl(gw2Element));
	}
	
	function getDescriptionUrl(gw2Element) {
		if (showOnClick == show_gw2Wiki)
			return "{0}/{1}".format(wiki_Url, get_wikiElement_name(gw2Element.n));
		else if (showOnClick == show_gw2DB || true)
			return "{0}/{1}/{2}-{3}"
				.format(gw2DB_Url, gw2Element.type, gw2Element.id, get_gw2DBElement_name(gw2Element.n));
	}
	
	function getImageUrl(gw2Element) {
		if (gw2Element.t == 'tr') 
			return "{0}/{1}/{2}.png".format(gw2BBCode_img_host, gw2Element.type, gw2Element.ti); /*trait image*/
		else
			return "{0}/{1}/{2}.png".format(gw2BBCode_img_host, gw2Element.type, gw2Element.id);
	}
	
	function get_gw2DBElement_name(gw2ElementName) {
		return gw2ElementName.toLowerCase().replace(/\s/g, '-').replace(/['"!]/g, "");
	}
	
	function get_wikiElement_name(gw2ElementName) {
		return gw2ElementName.replace(/\s/g, '-').replace(/['"!]/g, "");
	}
	
	function genMacroContent(macroName, showAsText, forceType, forceIdx, allowIncrementalSearch) {
		var macro = findGw2ElementByName(macros, macroName, '', forceIdx, allowIncrementalSearch);
		if (!macro) return "";
		return genMacroContent2(macro.m, showAsText, forceType, forceIdx);
	}
	
	function genMacroContent2(elementIds_Array, showAsText, forceType, forceIdx) {
		if (!elementIds_Array) return "";
		var result = "";
		for (var i = 0; i < elementIds_Array.length; i++) {
			var gw2Element = findGw2ElementById(gw2Elements, elementIds_Array[i], forceType);
			result += (i != 0 && showAsText ? " " : "");
			if (gw2Element)
				result += genGw2ElementContent(gw2Element, showAsText);
			else
				result += "[m:"+elementIds_Array[i]+"]";
		}
		return result;
	}

	function findGw2ElementById(array, gw2ElementId, forceType) {
		for (var i = 0; i < array.length; i++)
			if (array[i].id == gw2ElementId && ((forceType || "") == "" || array[i].type == forceType))
				return array[i];
		return null;
	}
	
	function findGw2ElementByName(array, gw2ElementName, forceType, forceIdx, allowIncrementalSearch) {
		forceIdx = forceIdx || 1;
		allowIncrementalSearch = (allowIncrementalSearch || false) && incrementalSearch;
		if (array)
			for (var i = 0; i < array.length; i++)
				if (((allowIncrementalSearch && array[i].n.toLowerCase().indexOf(gw2ElementName.toLowerCase()) == 0) ||
				    (!allowIncrementalSearch && array[i].n.toLowerCase() == gw2ElementName.toLowerCase())) && 
				   ((forceType || "") == "" || array[i].type == forceType) &&
				   (forceIdx-- <= 1))
					return array[i];
		return null;
	}
	
	function initGoogleAnalitics() {
		_gaq.push(
			['x._setAccount', 'UA-35005283-2'],
			['x._setAllowLinker', true],
			['x._setDomainName', document.domain],
			['x._trackPageview']);
	
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	}
	
	$(window).load(function() {setTimeout(function() {init();}, 300)});