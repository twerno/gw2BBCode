
	NestedTooltip = function(dispatcher, parentTooltip, activeStatusChanged, onHiding) {
		this.parentTooltip = parentTooltip||null;
		this.childTooltip  = null;
		this.zindex        = (parentTooltip !== null ? parentTooltip.zindex +1 : 9999);
		this.dispatcher   = dispatcher||null;
		
		if (parentTooltip !== null)
			parentTooltip.childTooltip = this;
		
		var tooltip      = null;
		var self         = this;
		var timeout      = 0;
		
		var isMouseOverDispatcher = false;
		var isMouseOverTooltip    = false;
		var activeStatusChanged   = activeStatusChanged;
		var onHiding              = onHiding;
		
		this.isMouseOver = function() {
			return isMouseOverTooltip || isMouseOverDispatcher;
		}

		this.setContent = function(content) {
			tooltip.innerHTML = content;
		}

		this.isHidding = function() {
			return timeout !== 0;
		}
		
		this.stopHiding = function() {
			if (this.isHidding())
				clearTimeout(timeout);
		}
		
		this.showTooltip = function(content) {
			this.stopHiding();
			if (tooltip === null) {
				registerTooltip();
				registerEvents();
				isMouseOverDispatcher = true;
				isMouseOverTooltip    = false;
			}
			jQuery(tooltip).css('display', 'none');
			jQuery(tooltip).css('z-index', this.zindex);
			jQuery(tooltip).html( content );
			jQuery(".p-tooltip-image,.db-image").css('display', 'none');
			calculatePopupPosition();
			jQuery(tooltip).css('display', 'inline');
		}
		
		this.hideIn = function(milisec) {
			this.stopHiding();
			timeout = setTimeout(function() {self.hideNow();}, milisec);
		}
		
		this.hideNow = function() {
			this.stopHiding();
			hideChild();
			unregisterEvents();
			unregisterTooltip();
			onHiding(this);
		}
		
		var hideChild = function() {
			if (self.childTooltip !== null)
				self.childTooltip.hideNow();
		}
		
		var registerTooltip = function() {
			if (tooltip !== null)	
				return;
			tooltip = document.createElement('div');
			tooltip.setAttribute("id", "db-tooltip-container");
			jQuery(tooltip).css('display', 'none');
			document.getElementsByTagName("body")[0].appendChild(tooltip);
		}
		
		var unregisterTooltip = function() {
			if (tooltip === null)	
				return;
			document.getElementsByTagName("body")[0].removeChild(tooltip);
			tooltip = null;
		}
		
		var registerEvents = function() {
			jQuery(self.dispatcher).mouseenter(onDispatcherMouseOver);
			jQuery(self.dispatcher).mouseleave(onDispatcherMouseOut);
			jQuery(tooltip).mouseenter(onTooltipMouseOver);
			jQuery(tooltip).mouseleave(onTooltipMouseOut);
		}
		
		var unregisterEvents = function() {
			jQuery(self.dispatcher).unbind('mouseenter', onDispatcherMouseOver);
			jQuery(self.dispatcher).unbind('mouseleave', onDispatcherMouseOut);
			jQuery(tooltip).unbind('mouseenter', onTooltipMouseOver);
			jQuery(tooltip).unbind('mouseleave', onTooltipMouseOut);
		}
		
		var calculatePopupPosition = function() {
			var top, left, newTop, newLeft,
			  jq_dispatcher = jQuery(self.dispatcher),
			  jq_win        = jQuery(window),
			  jq_tooltip    = jQuery(tooltip);
		
			top  = jq_tooltip.css("top").replace("px", "");
			left = jq_tooltip.css("left").replace("px", "");

			newTop = Math.max(1, jq_dispatcher.offset().top +jq_dispatcher.height() -3);
			if (newTop > jq_win.height() +jq_win.scrollTop() -jq_tooltip.outerHeight() -5)
				newTop = jq_dispatcher.offset().top +jq_dispatcher.height() -computeHeightOf(self.dispatcher) -jq_tooltip.outerHeight() -5;
				
			newLeft = jq_dispatcher.offset().left;
			if (newLeft > jq_win.width() +jq_win.scrollLeft() -367)
				newLeft =  Math.min(left, jq_dispatcher.offset().left +jq_dispatcher.outerWidth() -367);

			jq_tooltip.css("top", newTop);
			jq_tooltip.css("left", newLeft);
		}
		
		var computeHeightOf = function(element) {
			var result = jQuery(element).height();
			jQuery(element).children().each(function() {
				result = Math.max(result, computeHeightOf(this));
			});
			return result;
		}

		var onDispatcherMouseOver = function() {
			isMouseOverDispatcher = true;
			activeStatusChanged(self);
		}

		var onDispatcherMouseOut = function() {
			isMouseOverDispatcher = false;
			activeStatusChanged(self);
		}

		var onTooltipMouseOver = function() {
			isMouseOverTooltip = true;
			activeStatusChanged(self);
		}

		var onTooltipMouseOut = function() {
			isMouseOverTooltip = false;
			activeStatusChanged(self);
		}
	}