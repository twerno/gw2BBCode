
	NestedTooltipMgr = function(tooltipContentObj) {
		var firstTooltip = null;
		var self = this;
		var tooltipContentObj = tooltipContentObj;
	
		this.showTooltip = function(dispatcher, content) {
			var tooltip = this.getTooltipFor(dispatcher);
			if (tooltip === null) {
				tooltip = new NestedTooltip(dispatcher, getLastActive(), activeStatusChanged, onHiding);
				
				if (firstTooltip === null)
					firstTooltip = tooltip;
			}
			
			tooltip.showTooltip(content);
			return tooltip;
		}
		
		this.updateTooltip = function(dispatcher, content) {
			var tooltip = this.getTooltipFor(dispatcher);
			if (tooltip !== null)
				tooltip.showTooltip(content);
			return tooltip;
		}
		
		this.hideAll = function() {
			if (firstTooltip !== null)
				firstTooltip.hideNow();
		}
		
		this.registerTooltipsHandlers = function(selector) {
			jQuery(selector).each(function() {registerHandlerFor(this)});
		}
		
		this.getTooltipFor = function(dispatcher) {
			if (firstTooltip === null)
				return null;
			
			if (firstTooltip.dispatcher === dispatcher)
				return firstTooltip;
				
			var tooltip = firstTooltip;
			while (tooltip.childTooltip !== null) {
				if (tooltip.dispatcher === dispatcher)
					return tooltip;
				tooltip = tooltip.childTooltip;
			}
			return null;
		}
		
		var registerHandlerFor = function(element) {
			jQuery(element)
				.unbind('mouseenter', mouseEnterHandler)
				.mouseenter(mouseEnterHandler);
		}
		
		var mouseEnterHandler = function(eventObject) {
			var lastActive = getLastActive();
			if (lastActive !== null)
				lastActive.hideNow();
			else
				self.hideAll();

			var match = tooltipContentObj.getMatchFor(eventObject.currentTarget);
			if (!match) return;
			self.showTooltip(eventObject.currentTarget, tooltipContentObj.getLoadingContent());
			tooltipContentObj.loadData(eventObject.currentTarget, self, match);
		}

		var getLastActive = function() {
			if (firstTooltip !== null) {
				var tooltip = firstTooltip,
					lastActive = null;
				
				while(tooltip.childTooltip !== null) {
					if (tooltip.isMouseOver())
						lastActive = tooltip;
					tooltip = tooltip.childTooltip;
				}
				return tooltip; 
			}
			return null;
		}
		
		var activeStatusChanged = function(tooltip) {
			if (tooltip.isMouseOver())
				tooltip.stopHiding()
			else
				tooltip.hideIn(150);
		}

		var onHiding = function(tooltip) {
			if (tooltip === firstTooltip)
				firstTooltip = null;
		}
	}