
	Gw2BBCode = function() {

		var documentReady = false;
		var resourcesLoaded = false;
		var weaponSwapHelper = null;
		var self = this;
	
		this.resourceMgr = null;
		this.patternFinders = null;
		this.processor = null;
		this.contentGenerator = null;
		this.gw2DataMap = null;
		this.gw2Global = null;
		this.tooltipMgr = null;
	
		this.init = function() {
			this.gw2Global = new Gw2BBCodeGlobal();
		
			if (LocalStorageHelper.isSupported())
				this.resourceMgr = new ResourceManager();
			else	
				throw new Error('not implmeneted yet');
			
			var resourceList = [];
			
			loadStyle(this.gw2Global.gw2_cssURL);
			loadStyle(this.gw2Global.popup_cssURL);	
			this.tooltipMgr = new TooltipMgr(this.gw2Global, this.resourceMgr);
			weaponSwapHelper = new WeaponSwapHelper(this.tooltipMgr);
			
			this.gw2DataMap = new Gw2DataMap(this.gw2Global, this.resourceMgr, resourceList);
			this.patternFinders = new PatternFinders(this.gw2DataMap);
			this.contentGenerator = new Gw2DBCOMGenerator(this.gw2Global);
			this.processor = new HTMLProcessor(this.contentGenerator, this.patternFinders);
			
			this.resourceMgr.loadResourceList(resourceList, onResourcesLoaded);
			jQuery(document).ready(onDocumentReady());
		};
		
		this.isLoadedAndReady = function() {
			return resourcesLoaded && documentReady;
		}
		
		this.registerAllHandlers = function() {
			weaponSwapHelper.registerWeaponSwapHandlers();
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

	LocalStorageHelper.clear();
	window['gw2BBCode'] = new Gw2BBCode();
	window['gw2BBCode'].init();