	function gw2BBCodeAt(element) {
		if (!element) return;
		processExclusionAt(/\[/g, '{#}', element);
		try {
			$(element).each(function() {
				processMacros(this);
				processGw2BBCode(this);
				initPopups();
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
	
	window['gw2BBCodeAt']        = gw2BBCodeAt;
	window['processExclusionAt'] = processExclusionAt;