
	Gw2TooltipContentObj = function(gw2Global, resourceManager) {
		
		var gw2Global       = gw2Global;
		var resourceManager = resourceManager;
		
		this.getMatchFor = function(dispatcher) {
			return /gw2DB_(skills|tasks|traits|items|recipes|achievements|creatures|boons|conditions|guildupgrades)_(\-?\d+)/.exec( 
				dispatcher.getAttribute('class').toString() );
		}
		
		this.getLoadingContent = function() {
			return "<div class='db-tooltip'><div class='db-description' style='width: auto'>Loading..</div></div>";
		}
	
		this.loadData = function(dispatcher, tooltipMgr, match) {
			var url = Gw2DBHelper.getGw2DBTooltipUrl(gw2Global, match[1], match[2]),
			    data_fromCache = resourceManager.getResource(url, 1);
		
			if (data_fromCache !== null) {
				tooltipMgr.updateTooltip(dispatcher, formatResult(data_fromCache));
			} else {
				resourceManager.loadResource(url, 1, gw2Global.gw2DBObj_ttl, function() {
					data_fromCache = resourceManager.getResource(url, 1);
					if (data_fromCache !== null)
						tooltipMgr.updateTooltip(dispatcher, formatResult(data_fromCache));
				});
			}
		}

		var formatResult = function(data) {
			return data["Tooltip"]
				.replace(/<div class="db-image">\s+<img src=".*?\/>\s+<\/div>/g, "")
				.replace(/<a href=\"/g, "<a href=\""+gw2Global.gw2DBUrl);
		}
	}