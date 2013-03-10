
	Gw2DBValidator = function(gw2Global, gw2DataMap) {
		
		var gw2Global = gw2Global;
		var gw2DataMap = gw2DataMap;
		
		var tasks = [];
		var i = 0;
		var __element = null;
		var __counter = null;
		var __taskList = null;
		
		this.validDB = function(element, counter) {
			
			if (!gw2BBCode.isLoadedAndReady()) {
				alert('not loaded yet');
				return;
			}
			__element = element;
			__counter = counter;
			var task, p, dataObj;
			
			for (p in gw2DataMap.dataMap) {
				dataObj = gw2DataMap.dataMap[p];
				if (dataObj && dataObj['id'] && dataObj['id'] >= 0) {
					task = new JSONTask(
						gw2Global.gw2DB_PopupHost.format(gw2Global.types_names[dataObj['t']], Gw2DBHelper.getGw2DBID(dataObj)));
					task.dataObj = dataObj;
					tasks.push(task);
				}
			}
			processNextTask();
		}
		
		this.validMacros = function(element) {
			var i, p, dataObj;
			for (p in gw2DataMap.dataMap) {
				dataObj = gw2DataMap.dataMap[p];
				if (dataObj && dataObj['id'] && dataObj['id'] < 0) {
					for (i = 0; i < dataObj['m'].length; i++) {
						if (!gw2DataMap.dataMap[dataObj['m'][i]])
							element.innerHTML += "[ERROR] id: {0} name: {1} prof: {2} idx: {3} || No data for id: <A href='{4}'>{5}</a><br>".format(
								dataObj['id'], dataObj['n'], dataObj['p'], i.toString(), gw2Global.gw2DB_PopupHost.format('skills', dataObj['id']), dataObj['m'][i]);
					}
				}
			}
			element.innerHTML += "DONE<BR>";
		}
		
		this.validUniqnessOfIDS = function(element) {
			var p, dataObj, reg = {};
			for (p in gw2DataMap.dataMap) {
				dataObj = gw2DataMap.dataMap[p];
				if (dataObj && dataObj['id']) {
					if (reg[dataObj['id']])
						element.innerHTML += "[ERROR] doubled ID={0}<br>".format(dataObj['id']);
					reg[dataObj['id']] = true;
				}
			}
			element.innerHTML += "DONE<BR>";
		}
			
		var processNextTask = function() {
			if (i < tasks.length ) {
				__taskList = new TaskList(5);
				__taskList.addTask(tasks[i++]);
				__taskList.success(function() {processNextTask();});
				__taskList.error(function(taskList) {
					var id   = taskList.tasks[0].dataObj['id'],
						name = taskList.tasks[0].dataObj['n'],
						url  = taskList.tasks[0].url;
					__element.innerHTML += "[ERROR] id: {0} name: {1} <A HREF='{2}'>{2}</a> <A HREF='http://www.gw2db.com/search?search={1}'>Search for</a><br>".format(id, name, url);
					processNextTask();
				})
				__taskList.doWork();
				__counter.innerHTML = "Processed {0}/{1}".format(i.toString(), tasks.length.toString());
			} else {
				__element.innerHTML += "DONE<BR>";
			}
		}
	}