
	NestedTooltipMgr = function(tooltipContentObj, onContentChanged) {
		var firstTooltip = null;
		var self = this;
		var tooltipContentObj = tooltipContentObj;
		var onContentChanged  = onContentChanged;

		this.showTooltip = function(dispatcher, content) {
			var tooltip = this.getTooltipFor(dispatcher);
			if (tooltip === null) {
				tooltip = new NestedTooltip(dispatcher, getLastActive(), activeStatusChanged, onHiding, onContentChanged);
				
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
				if (tooltip.childTooltip.dispatcher === dispatcher)
					return tooltip.childTooltip;
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
			if (lastActive === null)
				self.hideAll();

			var match = tooltipContentObj.getMatchFor(eventObject.currentTarget);
			if (match === null) return;
			self.showTooltip(eventObject.currentTarget, tooltipContentObj.getLoadingContent());
			tooltipContentObj.loadData(eventObject.currentTarget, self, match);
		}

		var getLastActive = function() {
			var tooltip = firstTooltip,
				lastActive = null;
			
			while (tooltip !== null) {
				if (tooltip.isActive())
					lastActive = tooltip;
				tooltip = tooltip.childTooltip;
			}
			return lastActive; 
		}

		var activeStatusChanged = function(tooltip) {
			var lastActive = getLastActive();
			if (lastActive === null && firstTooltip !== null) {
				firstTooltip.hideIn(150);
			}
		}

		var onHiding = function(tooltip) {
			if (tooltip === firstTooltip)
				firstTooltip = null;
		}
	}