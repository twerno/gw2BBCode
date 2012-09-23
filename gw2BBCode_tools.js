	function updateElement(element) {
		if (!element) return;
		processExclusionAt(/\[/g, '{#}', element);
		try {
			$(element).each(function() {
				gw2BBCodeAt(this);
				registerTooltipsHandlers();
				registerWeaponSwapHandlers();
			});
		} finally {
			processExclusionAt(/\{#\}/g, '[', element);
		}
	}
	
	function processExclusionAt(a, b, element) {
		$(element).find("{0}".format(excludeFrom.join(','))).each(function() {
			var text = this.innerHTML.replace(a, b);
			if (text != this.innerHTML)
				this.innerHTML = text;
		});
	}
	
	window['updateElement'] = updateElement;