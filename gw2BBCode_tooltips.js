	 
	var tndoHide = false;
	var popup = null;
	var popup_info = {id:-1, type:"", dispatcher:null}
	
	var popup_cache = [];

	function initPopups() {
		popup = document.createElement('div');
		popup.setAttribute("id", "db-tooltip-container");
		document.getElementsByTagName("body")[0].appendChild(popup);
		
		registerTooltipsHandlers();
	}
	
	function registerTooltipsHandlers() {
		$(".gw2DBTooltip").each(function() {registerTooltipsHandler(this)});
			
		$(popup)
			.unbind('mouseenter')
			.mouseenter(function(eventObject) {
				tndoHide = false;
			})
			.unbind('mouseleave')
			.mouseleave(function(eventObject) {
				hideIn(150);
			});
	}
	
	function registerTooltipsHandler(element) {
		$(element)
			.unbind('mouseenter')
			.mouseenter(mouseEnterHandler)
			.unbind('mouseleave')
			.mouseleave(function(eventObject) {
				hideIn(150);
			});
	}
	
	function mouseEnterHandler(eventObject) {
		var match = /gw2DB(skills|tasks|traits|items|recipes|achievements|creatures|boons|conditions|guildupgrades)_(\d+)/.exec( this.getAttribute('class').toString() );
		if (!match) return;
		tndoHide = false;
		if (popup_info.id == match[2] && 
		    popup_info.type == match[1] && 
		   (popup_info.dispatcher === eventObject.currentTarget || popup_info.dispatcher === popup)) return;
		$(popup).css("top", eventObject.pageY +10);
		$(popup).css("left",eventObject.pageX +10);

		popup_info = {id:match[2], type:match[1], dispatcher:eventObject.currentTarget};
		showPopup("<div class='db-tooltip'><div class='db-description' style='width: auto'>Loading..</div></div>");
			
		loadData(match[1], match[2]);
	}

	
	function calculatePopupPosition() {
		var top  = $(popup).css("top").replace("px", "");
		var left = $(popup).css("left").replace("px", "");
		if (popup_info.dispatcher) {
			dispatcher = popup_info.dispatcher;
				
			var newTop = Math.max(1, $(dispatcher).offset().top +$(dispatcher).height() -3);
			if (newTop > $(window).height() +$(window).scrollTop() -$(popup).outerHeight() -5)
				newTop = $(dispatcher).offset().top +$(dispatcher).height() -computeHeightOf(dispatcher) -$(popup).outerHeight() -5;
			
			var newLeft = $(dispatcher).offset().left;
			if (newLeft > $(window).width() +$(window).scrollLeft() -367)
				newLeft =  Math.min(left, $(dispatcher).offset().left +$(dispatcher).outerWidth() -367);

			$(popup).css("top", newTop);
			$(popup).css("left", newLeft);
		}
	}
	
	function computeHeightOf(obj) {
		var result = $(obj).height();
		$(obj).children().each(function() {
			result = Math.max(result, computeHeightOf(this));
		});
		return result;
	}
	
	function showPopup(msg) {
		tndoHide = false;
		$(popup).css('display', 'none');
		$(popup).html( msg );
   		$(".p-tooltip-image,.db-image").css('display', 'none');
		calculatePopupPosition();
		$(popup).css('display', 'inline');
	}

	function hideIn(milisec) {
		if (tndoHide) return;
		tndoHide = true;
		setTimeout(hidePopup, milisec);
	}
	
	function hidePopup(force) {
		if (!force && !tndoHide) return;
		tndoHide = false;
		popup_info = {id:-1, type:"", dispatcher:null};
		$(popup).css('display', 'none');
		$(popup).html = '';
	}
	
	function loadData(type, id) {
		var data_fromCache = getFromCache(type, id);
	
		if (data_fromCache) {
			showPopup(data_fromCache);
		} else {
			$.getJSON(gw2DB_PopupHost.format(type, id), function(data) {
				saveInCache(type, id, formatResult(data));
				if (popup_info.id == -1 ||
					popup_info.id != id ||
					popup_info.type != type) return;
				showPopup(formatResult(data));
			});
		}	
	}

	function getFromCache(type, id) {
		for (var i = 0; i < popup_cache.length; i++) {
			if (popup_cache[i].id == id && popup_cache[i].type == type)
				return popup_cache[i].data;
		}
		return null;
	}
	
	function saveInCache(type, id, data) {
		if (!getFromCache(type, id)) {
			var newData = {"id":id, "type":type, "data":data}
			popup_cache.push(newData);
		}
	}

	function formatResult(data) {
		return data["Tooltip"]
			.replace(/<div class="db-image">\s+<img src=".*?\/>\s+<\/div>/g, "")
			.replace("<a href=\"", "<a href=\""+gw2DB_Url);
	}