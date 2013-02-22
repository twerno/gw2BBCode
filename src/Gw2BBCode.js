
	Gw2BBCode = function() {

		var self            = this;
		var documentReady   = false;
		var resourcesLoaded = false;
	
		this.gw2Global        = new Gw2BBCodeGlobal();
		var processor         = null;
		var gw2DataMap        = null;
		var resourceMgr       = null;
		var patternFinders    = null;
		var contentGenerator  = null;
		var weaponSwapHelper  = null;
		var tooltipContentObj = null;
		
		var gw2TooltipMgr    = null;
	
		this.isLoadedAndReady = function() {
			return resourcesLoaded && documentReady;
		}
		
		this.registerAllHandlers = function() {
			if (!this.isLoadedAndReady())
				 return false;

			weaponSwapHelper.registerWeaponSwapHandlers();
			gw2TooltipMgr.registerTooltipsHandlers(".gw2DBTooltip");
			
			return true;
		}
	
		var init = function() {
		
			if (LocalStorageHelper.isSupported())
				resourceMgr = new ResourceManager();
			else	
				resourceMgr = new NoLocalStorageResourceManager();
			
			var resourceList = [];
			loadStyle(self.gw2Global.gw2_cssURL);
			loadStyle(self.gw2Global.popup_cssURL);

			tooltipContentObj = new Gw2TooltipContentObj(self.gw2Global, resourceMgr);
			gw2TooltipMgr     = new NestedTooltipMgr(tooltipContentObj);
			
			gw2DataMap       = new Gw2DataMap(self.gw2Global, resourceMgr, resourceList);
			patternFinders   = new PatternFinders(gw2DataMap);
			contentGenerator = new Gw2DBCOMGenerator(self.gw2Global);
			processor        = new HTMLProcessor(contentGenerator, patternFinders);
			weaponSwapHelper = new WeaponSwapHelper(gw2TooltipMgr);
			
			resourceMgr.loadResourceList(resourceList, onResourcesLoaded);
			jQuery(document).ready(onDocumentReady);
		};

		var onResourcesLoaded = function(resources) {
			resourcesLoaded = true;
			gw2DataMap.fillGw2DataMap();
			
			patternFinders.registerPattern(new ClassicPattern(self.gw2Global, resourceMgr));
			onLoadedAndReady();
		}
		
		var onDocumentReady = function() {
			documentReady = true;
			onLoadedAndReady();
		}
		
		var onLoadedAndReady = function() {
			if (!self.isLoadedAndReady())
				return;

			processor.processAll();
			self.registerAllHandlers();
		}
		
		init();
	}

	window['gw2BBCode'] = new Gw2BBCode();