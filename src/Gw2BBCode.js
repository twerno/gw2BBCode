
	Gw2BBCode = function() {

		var self            = this;
		var documentReady   = false;
		var resourcesLoaded = false;
	
		this.gw2Global        = new Gw2BBCodeGlobal();
		this.processor        = null;
		this.gw2DataMap       = null;
		this.tooltipMgr       = null;
		this.resourceMgr      = null;
		this.patternFinders   = null;
		this.contentGenerator = null;
		this.weaponSwapHelper = null;
	
		this.init = function() {
		
			if (LocalStorageHelper.isSupported())
				this.resourceMgr = new ResourceManager();
			else	
				throw new Error('Not implmeneted yet');
			
			var resourceList = [];
			loadStyle(this.gw2Global.gw2_cssURL);
			loadStyle(this.gw2Global.popup_cssURL);
			
			this.tooltipMgr       = new TooltipMgr(this.gw2Global, this.resourceMgr);
			this.gw2DataMap       = new Gw2DataMap(this.gw2Global, this.resourceMgr, resourceList);
			this.patternFinders   = new PatternFinders(this.gw2DataMap);
			this.contentGenerator = new Gw2DBCOMGenerator(this.gw2Global);
			this.processor        = new HTMLProcessor(this.contentGenerator, this.patternFinders);
			this.weaponSwapHelper = new WeaponSwapHelper(this.tooltipMgr);
			
			this.resourceMgr.loadResourceList(resourceList, onResourcesLoaded);
			jQuery(document).ready(onDocumentReady);
		};
		
		this.isLoadedAndReady = function() {
			return resourcesLoaded && documentReady;
		}
		
		this.registerAllHandlers = function() {
			if (!this.isLoadedAndReady())
				return;

			this.weaponSwapHelper.registerWeaponSwapHandlers();
			this.tooltipMgr.registerTooltipsHandlers();
		}
		
		var onResourcesLoaded = function(resources) {
			resourcesLoaded = true;
			self.gw2DataMap.fillGw2DataMap();
			
			self.patternFinders.registerPattern(new ClassicPattern(self.gw2Global, self.resourceMgr));
			onLoadedAndReady();
		}
		
		var onDocumentReady = function() {
			documentReady = true;
			onLoadedAndReady();
		}
		
		var onLoadedAndReady = function() {
			if (!self.isLoadedAndReady())
				return;

			self.processor.processAll();
			self.tooltipMgr.initPopups();
			self.registerAllHandlers();
		}
	}

	//LocalStorageHelper.clear();
	window['gw2BBCode'] = new Gw2BBCode();
	window['gw2BBCode'].init();