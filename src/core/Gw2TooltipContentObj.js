
	Gw2TooltipContentObj = function(gw2Global) {
		
		var gw2Global = gw2Global;
		
		this.getMatchFor = function(dispatcher) {
			return /gw2DB_(skills|tasks|traits|items|recipes|achievements|creatures|boons|conditions|guildupgrades)_(\d+)/.exec( 
				dispatcher.getAttribute('class').toString() );
		}
		
		this.getLoadingContent = function() {
			return "<div class='db-tooltip'><div class='db-description' style='width: auto'>Loading..</div></div>";
		}
	
		this.loadData = function(dispatcher, tooltipMgr, match) {
			var data_fromCache = getFromCache(match[1], match[2]);
		
			if (data_fromCache) {
				tooltipMgr.updateTooltip(dispatcher, data_fromCache);
			} else {
				jQuery.getJSON(gw2Global.gw2DB_PopupHost.format(match[1], match[2]), function(data) {
					saveInCache(match[1], match[2], formatResult(data));
					tooltipMgr.updateTooltip(dispatcher, formatResult(data));
				});
			}	
		}

		var popup_cache = [];

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
				.replace(/<a href=\"/g, "<a href=\""+gw2Global.gw2DBUrl);
		}
	
	}