
	Gw2DataMap = function(gw2Global, resourceMgr, resourceList) {

		this.dataMap = {};
		this.nameMap = {};

		var resourceMgr = resourceMgr;
		var gw2Global   = gw2Global;
		var upToDate    = true;
		var dataMapName = 'Gw2DataMap';
		var nameMapName = 'Gw2NameMap';
		
		var init = function(resourceList) {
			var i = 0;
				
			if (!resourceMgr.isUpToDate(gw2Global.main_pack['url'], gw2Global.main_pack['ver'])) {
				upToDate = false;
				resourceList.push(gw2Global.main_pack);
			}
			
			for (i = 0; i < gw2Global.lang_packs.length; i++) {
				if (!resourceMgr.isUpToDate(gw2Global.lang_packs[i]['url'], gw2Global.lang_packs[i]['ver'])) {
					upToDate = false;
					resourceList.push(gw2Global.lang_packs[i]);
				}
			}
		}
		init(resourceList);

		this.findDataAndNameFor = function(bbCodeData) {
			var dataObj = null;
			
			if (bbCodeData.entry1 !== null) {
				dataObj = getDataObjectForName(this, bbCodeData.entry1.name, bbCodeData);
				if (dataObj !== null) {
					bbCodeData.entry1.dataObj = dataObj['data'];
					bbCodeData.entry1.nameObj = dataObj['name'];
					bbCodeData.entry1.fillWeaponSetData(this);
				};
			};
			
			if (bbCodeData.entry2 !== null) {
				dataObj = getDataObjectForName(this, bbCodeData.entry2.name, bbCodeData);
				if (dataObj !== null) {
					bbCodeData.entry2.dataObj = dataObj['data'];
					bbCodeData.entry2.nameObj = dataObj['name'];
					bbCodeData.entry2.fillWeaponSetData(this);
				};
			};
		};
		
		this.fillGw2DataMap = function() {
			if (upToDate === true) {
				this.dataMap = resourceMgr.getResource(dataMapName, 1);
				this.nameMap = resourceMgr.getResource(nameMapName, 1);
				upToDate = this.dataMap !== null && this.nameMap !== null;
			};

			if (!upToDate) {
				var i, j,
					pack = null,
					currentItem,
					names,
					p,
					uniqID;
				
				this.dataMap = {};
				this.nameMap = {};
				
				pack = resourceMgr.getResource(gw2Global.main_pack['url'], gw2Global.main_pack['ver']);
				for (i = 0; i < pack.length; i++) {
					currentItem = pack[i];
					currentItem['names'] = {'en':currentItem['n']};
					
					uniqID = Gw2DBHelper.getUniqID(currentItem);
					currentItem['uniqID'] = uniqID;
					
					if (this.dataMap[uniqID])
						console.log("Powt�rzony uniqID=" +uniqID);
					
					this.dataMap[uniqID] = currentItem;
					this.nameMap[getArrayIDFor(currentItem['n'])] = this.nameMap[getArrayIDFor(currentItem['n'])]||[];
					this.nameMap[getArrayIDFor(currentItem['n'])].push({'id':uniqID, 'n':currentItem['n'], 'lang':'en', 'data':currentItem});
					
					if ((currentItem['tc']||"") !== "") {
						resourceMgr.putResource(Gw2DBHelper.getGw2DBTooltipUrl(gw2Global, gw2Global.types_names[currentItem['t']], Gw2DBHelper.getGw2DBID(currentItem)),
						                        Gw2DBHelper.getTooltipContent(currentItem['n'], currentItem['tc']));
					}
				}

				for (i = 0; i < gw2Global.lang_packs.length; i++) {
					pack = resourceMgr.getResource(gw2Global.lang_packs[i]['url'], gw2Global.lang_packs[i]['ver']);
					if (typeof pack.names === "string")
						throw new Error("JSON.parse() error");
					names = pack.names;
					for (j = 0; j < names.length; j++) {
						currentItem = names[j];
						if ((this.dataMap[currentItem[0]]||null) === null) {
							console.log('ERROR: no data for id:{0}, name:{1} in langPack:{2}'.format(currentItem[0], currentItem[1], pack["lang"]));
							continue;
							//this.dataMap[currentItem[0]] = {'id':currentItem[0], 'name':currentItem[1], 't':'?', 'names':{}};
						}

						this.nameMap[getArrayIDFor(currentItem[1])] = this.nameMap[getArrayIDFor(currentItem[1])]||[];
						this.nameMap[getArrayIDFor(currentItem[1])].push({'id':currentItem[0], 'n':currentItem[1], 'lang':pack['lang'], 'data':this.dataMap[currentItem[0]]});
						this.dataMap[currentItem[0]]['names'][pack['lang']] = currentItem[1];
					}
				}
				
				for (p in this.nameMap) {
					if (p.indexOf("gw2_") !== -1)
						this.nameMap[p].sort(compare);
				}

				resourceMgr.putResource(dataMapName, this.dataMap, 1, 0);
				resourceMgr.putResource(nameMapName, this.nameMap, 1, 0);
				upToDate = true;
			}
		}
		
		var getDataObjectForName = function(gw2DataMap, name, bbCodeData) {
			var arr, i, matchedIdx = 0, data = null, nameLow = name.toLowerCase();
			
			if (name === "") 
				return null;
			
			arr = gw2DataMap.nameMap[getArrayIDFor(name)]||null;
			if (arr === null)
				return null;
			
			for (i = 0; i < arr.length; i++) {
				if (arr[i]['n'].toLowerCase() === nameLow) {
					data = gw2DataMap.dataMap[arr[i]['id']]||null;
					if (data === null) 
						throw new Error('no data for '+name);

					if (((bbCodeData.stance !== '' && compareStrLow(bbCodeData.stance, data['st']||"")) || bbCodeData.stance === '') &&
					    ((bbCodeData.type   !== '' && compareStrLow(bbCodeData.type,   data['t' ]||"")) || bbCodeData.type   === '') &&
						((bbCodeData.prof   !== '' && compareStrLow(bbCodeData.prof,   data['p' ]||"")) || bbCodeData.prof   === '') &&
						(++matchedIdx === bbCodeData.forcedIdx))
						return {'data': data, 'name': arr[i]};
				}
			}
			return null;
		};		
		
		var getArrayIDFor = function(name) {
			return "gw2_"+name.substr(0, 3).toLowerCase();
		}
		
		var compare = function compare(a, b) {
			if (a['n'] === b['n']) {
				if (a.data.t === 'b' || a.data.t === 'co')
					return -1;
				if (b.data.t === 'b' || b.data.t === 'co')
					return 1;			
				if ((a.id > 0 && b.id > 0) || (a.id < 0 && b.id < 0)) 
					return (a.id > b.id) ? -1 : 1;  
				else
					return (a.id > 0) ? -1 : 1;
			} else 
				return (a.n > b.n) ? 1 : -1;
		}
	};