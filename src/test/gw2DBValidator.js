
	Gw2DBValidator = function(gw2Global, gw2DataMap) {
		
		var gw2Global = gw2Global;
		var gw2DataMap = gw2DataMap;
		
		var tasks = [];
		var i = 0;
		var __element = null;
		
		this.valid = function(element) {
			
			if (!gw2BBCode.isLoadedAndReady()) {
				alert('not loaded yet');
				return;
			}
			__element = element;
			var task, p, dataObj;
			
			for (p in gw2DataMap.dataMap) {
				dataObj = gw2DataMap.dataMap[p];
				if (dataObj && dataObj['id'] && dataObj['id'] >= 0) {
					task = new JSONTask(
						gw2Global.gw2DB_PopupHost.format(gw2Global.element_type[dataObj['t']], dataObj['id']));
					task.success(function() {processNextTask();})
					task.error(function(task) {
							var id   = task.dataObj['id'],
								name = task.dataObj['n'],
								url  = task.url;
							__element.innerHTML += "[ERROR] id: {0} name: {1} <A HREF='{2}'>{2}</a> <A HREF='http://www.gw2db.com/search?search={1}'>Search for</a><br>".format(id, name, url);
							processNextTask();
						})
					task.dataObj = dataObj;
					tasks.push(task);
				}
			}
			processNextTask();
		}
			
		var processNextTask = function() {
			if (i < tasks.length ) {
				tasks[i++].doWork();
			} else {
				__element.innerHTML += "DONE<BR>";
			}
		}
	}