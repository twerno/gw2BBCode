
	var gw2DBMap        = {};
	var img_host        = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2_images";
	//var img_host        = "../dist/gw2_images";
	var gw2DB_Url       = "http://www.gw2db.com";
	var wiki_Url        = "http://wiki.guildwars2.com/wiki";
	var gw2DB_PopupHost = "http://www.gw2db.com/{0}/{1}/tooltip?x&advanced=1&callback=?";
	//var popup_style     = "http://static-ascalon.cursecdn.com/current/skins/Ascalon/css/tooltip.css";
	var popup_style     = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/tooltip.css";
	//var popup_style     = "../dist/tooltip.css";
	
	function init() {
		$(includeTo.join(',')).addClass('gw2BBCode');
		initElements();
		addPopup2Gw2DBLinks();
		loadStyle(popup_style);
		gw2BBCode();
		initPopups();
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
	
	function addEvent(obj, evType, fn){ 
		if (obj.addEventListener){ 
			obj.addEventListener(evType, fn, false); 
		} else if (obj.attachEvent)
			r = obj.attachEvent("on"+evType, fn); 
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
			$(".gw2BBCode").each(function() {
				processMacros(this);
				processGw2BBCode(this);
			});
		} finally {
			processExclusion(/\{#\}/g, '[');
		}
	}
	
	function processMacros(obj) {
		var myRegexp = /\[(@?)(.*?)(\.\d+)?\]/g;
		var text = obj.innerHTML;
		var match = myRegexp.exec(text);
		while (match != null) {
			var newContent = getNewContentForMacro(match[2], match[1], element_type['s'], (match[3] || "1").replace(".", ""));
			if (newContent != '') {
				text = text.replace(match[0], newContent);
			}
			match = myRegexp.exec(text);
		}
		if (obj.innerHTML != text)
			obj.innerHTML = text;
	}
	
	function processGw2BBCode(obj) {
		var myRegexp = /\[(@?)(skill:|trait:|boon:|condition:)?(.*?)(\.\d+)?\]/g;
		var text = obj.innerHTML;
		var match = myRegexp.exec(text);
		while (match != null) {
			var newContent = getNewContentFor(match[3], match[1], 
				(match[2] ? match[2].replace(":", "") + 's':match[2]), 
				(match[4] || "1").replace(".", ""));
			if (newContent != '')
				text = text.replace(match[0], newContent);
			match = myRegexp.exec(text);
		}
		if (obj.innerHTML != text)
			obj.innerHTML = text;
	}
	
	function processExclusion(a, b) {
		$((".gw2BBCode {0}".format(excludeFrom.join(',')))).each(function() {
			var text = this.innerHTML.replace(a, b);
			if (text != this.innerHTML)
				this.innerHTML = text;
		});
	}
	
	function getNewContentFor(gw2ElementName, showAsTest, forceType, forceIdx) {
		var gw2Element = findGw2ElementByName(gw2DBMap[getKeyFromName(gw2ElementName)], gw2ElementName, forceType, forceIdx);
		if (gw2Element == null) return "";
		return newContentForGw2Element(gw2Element, showAsTest);
	}
	
	function newContentForGw2Element(gw2Element, showAsTest) {
		if (showAsTest)
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
			return "{0}/{1}/{2}.png".format(img_host, gw2Element.type, gw2Element.ti); /*trait image*/
		else
			return "{0}/{1}/{2}.png".format(img_host, gw2Element.type, gw2Element.id);
	}
	
	function get_gw2DBElement_name(gw2ElementName) {
		return gw2ElementName.toLowerCase().replace(/\s/g, '-').replace(/['"!]/g, "");
	}
	
	function get_wikiElement_name(gw2ElementName) {
		return gw2ElementName.replace(/\s/g, '-').replace(/['"!]/g, "");
	}
	
	function getNewContentForMacro(macroName, showAsTest, forceType, forceIdx) {
		var macro = findGw2ElementByName(macros, macroName, '', forceIdx);
		if (macro == null) return "";
		result = "";
		for (var i = 0; i < macro.m.length; i++) {
			var gw2Element = findGw2ElementById(gw2Elements, macro.m[i], forceType);
			result += (i != 0 && showAsTest ? " " : "");
			if (gw2Element)
				result += newContentForGw2Element(gw2Element, showAsTest);
			else
				result += "[m:"+macro.m[i]+"]";
		}
		return result;
	}

	function findGw2ElementById(array, gw2ElementId, forceType) {
		for (var i = 0; i < array.length; i++)
			if (array[i].id == gw2ElementId && ((forceType || "") == "" || array[i].type == forceType))
				return array[i];
		return null;
	}
	
	function findGw2ElementByName(array, gw2ElementName, forceType, forceIdx) {
		forceIdx = forceIdx || 1;
		if (array)
			for (var i = 0; i < array.length; i++)
				if (((incrementalSearch && gw2ElementName.length >= 4 && array[i].n.toLowerCase().indexOf(gw2ElementName.toLowerCase()) == 0) ||
				    ((!incrementalSearch || gw2ElementName.length <= 4) && array[i].n.toLowerCase() == gw2ElementName.toLowerCase())) && 
				   ((forceType || "") == "" || array[i].type == forceType) &&
				   (forceIdx-- <= 1))
					return array[i];
		return null;
	}
	
	addEvent(window, "load", setTimeout(function() {
		init();
	}, 300));