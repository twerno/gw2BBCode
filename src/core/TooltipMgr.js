
	TooltipMgr = function(gw2Global, resourceMgr) {
	 
		var tndoHide = false;
		var popup = null;
		var popup_info = {id:-1, type:"", dispatcher:null};
		var self = this;
		var gw2Global = gw2Global;
		var resourceMgr = resourceMgr;
		
		var popup_cache = [];

		this.initPopups = function() {
			popup = document.createElement('div');
			popup.setAttribute("id", "db-tooltip-container");
			document.getElementsByTagName("body")[0].appendChild(popup);
			
			this.registerTooltipsHandlers();
		}
		
		this.registerTooltipsHandlers = function() {
			jQuery(".gw2DBTooltip").each(function() {registerTooltipsHandler(this)});
				
			jQuery(popup)
				.unbind('mouseenter')
				.mouseenter(function(eventObject) {
					tndoHide = false;
				})
				.unbind('mouseleave')
				.mouseleave(function(eventObject) {
					self.hideIn(150);
				});
		}
		
		this.showPopup = function(msg) {
			tndoHide = false;
			jQuery(popup).css('display', 'none');
			jQuery(popup).html( msg );
			jQuery(".p-tooltip-image,.db-image").css('display', 'none');
			calculatePopupPosition();
			jQuery(popup).css('display', 'inline');
		}

		this.hideIn = function(milisec) {
			if (tndoHide) return;
			tndoHide = true;
			setTimeout(this.hidePopup, milisec);
		}
		
		this.hidePopup = function(force) {
			if (!force && !tndoHide) return;
			tndoHide = false;
			popup_info = {id:-1, type:"", dispatcher:null};
			jQuery(popup).css('display', 'none');
			jQuery(popup).html = '';
		}
		
		var registerTooltipsHandler = function(element) {
			jQuery(element)
				.unbind('mouseenter')
				.mouseenter(mouseEnterHandler)
				.unbind('mouseleave')
				.mouseleave(function(eventObject) {
					self.hideIn(150);
				});
		}
		
		var mouseEnterHandler = function(eventObject) {
			var match = /gw2DB_(skills|tasks|traits|items|recipes|achievements|creatures|boons|conditions|guildupgrades)_(\d+)/.exec( this.getAttribute('class').toString() );
			if (!match) return;
			tndoHide = false;
			if (popup_info.id == match[2] && 
				popup_info.type == match[1] && 
			   (popup_info.dispatcher === eventObject.currentTarget || popup_info.dispatcher === popup)) return;
			jQuery(popup).css("top", eventObject.pageY +10);
			jQuery(popup).css("left",eventObject.pageX +10);

			popup_info = {id:match[2], type:match[1], dispatcher:eventObject.currentTarget};
			self.showPopup("<div class='db-tooltip'><div class='db-description' style='width: auto'>Loading..</div></div>");
				
			loadData(match[1], match[2]);
		}

		
		var calculatePopupPosition = function() {
			var top  = jQuery(popup).css("top").replace("px", "");
			var left = jQuery(popup).css("left").replace("px", "");
			if (popup_info.dispatcher) {
				dispatcher = popup_info.dispatcher;
					
				var newTop = Math.max(1, jQuery(dispatcher).offset().top +jQuery(dispatcher).height() -3);
				if (newTop > jQuery(window).height() +jQuery(window).scrollTop() -jQuery(popup).outerHeight() -5)
					newTop = jQuery(dispatcher).offset().top +jQuery(dispatcher).height() -computeHeightOf(dispatcher) -jQuery(popup).outerHeight() -5;
				
				var newLeft = jQuery(dispatcher).offset().left;
				if (newLeft > jQuery(window).width() +jQuery(window).scrollLeft() -367)
					newLeft =  Math.min(left, jQuery(dispatcher).offset().left +jQuery(dispatcher).outerWidth() -367);

				jQuery(popup).css("top", newTop);
				jQuery(popup).css("left", newLeft);
			}
		}
		
		var computeHeightOf = function(obj) {
			var result = jQuery(obj).height();
			jQuery(obj).children().each(function() {
				result = Math.max(result, computeHeightOf(this));
			});
			return result;
		}
		
		var loadData = function(type, id) {
			var data_fromCache = getFromCache(type, id);
		
			if (data_fromCache) {
				self.showPopup(data_fromCache);
			} else {
				jQuery.getJSON(gw2Global.gw2DB_PopupHost.format(type, id), function(data) {
					saveInCache(type, id, formatResult(data));
					if (popup_info.id == -1 ||
						popup_info.id != id ||
						popup_info.type != type) return;
					self.showPopup(formatResult(data));
				});
			}	
		}

		var getFromCache = function(type, id) {
			for (var i = 0; i < popup_cache.length; i++) {
				if (popup_cache[i].id == id && popup_cache[i].type == type)
					return popup_cache[i].data;
			}
			return null;
		}
		
		var saveInCache = function(type, id, data) {
			if (!getFromCache(type, id)) {
				var newData = {"id":id, "type":type, "data":data}
				popup_cache.push(newData);
			}
		}

		var formatResult = function(data) {
			return data["Tooltip"]
				.replace(/<div class="db-image">\s+<img src=".*?\/>\s+<\/div>/g, "")
				.replace("<a href=\"", "<a href=\""+gw2Global.gw2DBUrl);
		}
	}