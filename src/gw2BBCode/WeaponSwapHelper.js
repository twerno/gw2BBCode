
	WeaponSwapHelper = function(tooltipMgr) {
		
		var tooltipMgr = tooltipMgr;
	
		this.registerWeaponSwapHandlers = function() {
			jQuery('.gw2BBCode_weaponSwap')
				.unbind('click')
				.click(weaponSwapHandler);
		}
		
		var weaponSwapHandler = function(event) {
			if (typeof(window.getSelection().removeAllRanges) !== "undefined")
				window.getSelection().removeAllRanges();
			
			jQuery(event.target.parentElement).find('.gw2BBCode_weaponSet').each(function(){
				jQuery(this).css('display', (jQuery(this).css('display') == 'inline' ? 'none' : 'inline') );
			});
			tooltipMgr.hidePopup(true);
		}
	}
	
	
	
	