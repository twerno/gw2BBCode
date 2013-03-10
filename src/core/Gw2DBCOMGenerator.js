
	Gw2DBCOMGenerator = function(gw2Global) {
	
		var gw2Global = gw2Global;
	
		this.getBBCode = function(bbCodeData) {
			var content1 = '', content2 = '';
			
			if (bbCodeData.entry1 !== null && !bbCodeData.entry1.isMacro()) 
				content1 = getBBCodeForItem(bbCodeData.entry1, bbCodeData);
			else if (bbCodeData.entry1 !== null && bbCodeData.entry1.isMacro()) 
				content1 = getBBCodeForMacro(bbCodeData.entry1, bbCodeData);
			
			if (bbCodeData.entry2 !== null && !bbCodeData.entry2.isMacro()) 
				content2 = getBBCodeForItem(bbCodeData.entry2, bbCodeData);
			else if (bbCodeData.entry2 !== null && bbCodeData.entry2.isMacro()) 
				content2 = getBBCodeForMacro(bbCodeData.entry2, bbCodeData);
			
			if (content1 !== "" && content2 === "")
				return content1;
			else if (content1 !== "" && content2 !== "")
				return weaponSwapWrapper(content1, content2);
			else
				return bbCodeData.orig;
		}

		var getBBCodeForItem = function(entry, bbCodeData) {
			var dataObj = entry.dataObj, 
				name    = getNameFrom(dataObj, entry.nameObj['lang'], 'en');
			return generateBBCodeFor( dataObj['id'], Gw2DBHelper.getGw2DBID(dataObj), name, dataObj['t'], getImgOrTextDesc(name, dataObj, bbCodeData) );
		}
		
		var getBBCodeForMacro = function(entry, bbCodeData) {
			var i, tmpArr = [], dataObj = null, name = '', result = '';

			for (i = 0; i < entry.dataObj['m'].length; i++) {
				dataObj = entry.dataObjSet[i];
				if (dataObj === null)
					throw new Error("[WeaponSet:{0}] No dataObj for id:{1}".format(entry.name, entry.dataObj['m'][i]));
				name = getNameFrom(dataObj, entry.nameObj['lang'], 'en');

				tmpArr.push(
					generateBBCodeFor( dataObj['id'], Gw2DBHelper.getGw2DBID(dataObj), name, dataObj['t'], getImgOrTextDesc(name, dataObj, bbCodeData) )
				);
			}

			for (i = 0; i < tmpArr.length; i++)
				result += tmpArr[i] +(bbCodeData.showAsText && i !== tmpArr.length -1 ? " " : "");

			return result;	
		}
		
		var generateBBCodeFor = function(id, gw2dbId, name, type, imgOrTextDesc) {
			return ("<a href='{0}' class='gw2DBTooltip gw2DB_{1}_{2}'>{3}</a>")
				.format(getGoToUrl(gw2dbId, name, type), gw2Global.convertCode(type, gw2Global.types_En), id, imgOrTextDesc);
		}
		
		var getGoToUrl = function (id, name, type) {
			if (gw2Global.onClickGoTo === 'gw2Wiki')
				return "{0}/{1}".format(gw2Global.gw2WikiUrl, get_wikiElement_name(name));
			else if (gw2Global.onClickGoTo === 'gw2DB')
				return "{0}/{1}/{2}".format(gw2Global.gw2DBUrl, gw2Global.types_names[type], id);
			else
				return "#";
		}

		var get_wikiElement_name = function (gw2ElementName) {
			return gw2ElementName.replace(/\s/g, '-').replace(/['"!]/g, "");
		}

		var getImgOrTextDesc = function(name, dataObj, bbCodeData) {
			if (bbCodeData.showAsText)
				return getImg(dataObj, bbCodeData, true) +name;
			else
				return getImg(dataObj, bbCodeData, false);
		}

		var getImg = function(dataObj, bbCodeData, small) {
			var id       = dataObj['id'],
				prof     = dataObj['p']||"",
			    type     = dataObj['t'],
			    traitIdx = dataObj['ti'],
				gw2db    = dataObj['gw2db']||0,
				folder   = gw2Global.types_names[type],
				imgTag   = '';

			if (gw2db !== 0)
				id = gw2db;
				
			if ((folder||"") === "")
				throw new Error("Undefined img folder for type:" +type +" !");

			imgTag = "<img src='{0}/{1}/{2}.png'" + (small ? " style='width:18px;height:18px;vertical-align:text-bottom;'" : "") +">";
				
			if (type === 'tr' && (prof === "" || traitIdx === 0)) 
				return imgTag.format(gw2Global.imagesUrl, folder, traitIdx); /*trait image*/
			else if (type === 'tr' && prof !== "" && traitIdx === 0)
				return imgTag.format(gw2Global.imagesUrl, folder, prof); /*trait image*/
			else
				return imgTag.format(gw2Global.imagesUrl, folder, id);
		};

		var getNameFrom = function(dataObj, preferredLang, mainLang) {
			var result = dataObj['names'][preferredLang];
			if ((result||"") !== "")
				return result;
			else 
				return dataObj['names'][mainLang]||"";
		}

		var weaponSwapWrapper = function(content1, content2) {
			var tnSet2 = (content2||"") !== "";
			
			return "<div class='gw2BBCode_weaponSetWraper'>{0}<div class='gw2BBCode_weaponSet'>{1}</div>{2}</div>"
				.format(tnSet2 ? "<div class='gw2BBCode_weaponSwap'></div>" : "",
				        content1,
						tnSet2 ? "<div class='gw2BBCode_weaponSet' style='display:none;'>{0}</div>".format(content2) : "");
		}

	}