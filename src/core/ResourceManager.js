
	ResourceManager = function() {
		
		this.loadResource = function(resourceUrl, version, ttl, callback) {
			this.loadResourceList([{'url':resourceUrl, 'ver':version, 'ttl':ttl, 'data':null}], callback);
		};
		
		this.loadResourceList = function(resourceArr, callback) {
			if (resourceArr === null || resourceArr.length === 0) {
				callback(resourceArr);
			} else {				
				var taskList = new TaskList(30),
					i = 0;
				taskList.resourceArr = resourceArr;
				taskList.callback     = callback;
				for (i = 0; i < resourceArr.length; i++) {
					taskList.addTask(new LoadResourceTask(resourceArr[i]['url'], resourceArr[i]['ver']||1, resourceArr[i]['ttl']||0))
				};
				taskList.success(
					function (taskList) {
						for (var i = 0; i < taskList.tasks.length; i++) {
							taskList.resourceArr[i].data = taskList.tasks[i].data;
						};
						taskList.callback(taskList.resourceArr);
				})
				.error(function(taskList, errorMsg) {
					throw new Error(errorMsg);
				});
				taskList.doWork();
			}
		};
		
		this.isUpToDate = function(url, ver) {
			return LocalStorageHelper.isSupported() && LocalStorageHelper.isUpToDate(url, ver);
		};
		
		this.isUpToDateArr = function(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (!this.isUpToDate(arr[i]['url'], arr[i]['ver']))
					return false;
			};
			return true;
		};
		
		this.getResource = function(resourceUrl, version) {
			return LocalStorageHelper.getObject(resourceUrl, version);
		}
		
		this.putResource = function(resourceUrl, data, version, ttl ) {
			LocalStorageHelper.putObject(resourceUrl, data, version, ttl);
		}
	};
	
	NoLocalStorageResourceManager = function() {
	
		var cache = {};
	
		this.loadResource = function(resourceUrl, version, ttl, callback) {
			this.getResourceList([{'url':resourceUrl, 'data':null}], callback);
		};
		
		this.loadResourceList = function(resourceArr, callback) {
			if (resourceArr === null || resourceArr.length === 0) {
				callback(resourceArr);
			} else {				
				var taskList = new TaskList(30),
					i = 0;
				taskList.resourceArr = resourceArr;
				taskList.callback     = callback;
				for (i = 0; i < resourceArr.length; i++) {
					taskList.addTask(new JSONTask(resourceArr[i]['url']))
				};
				taskList.success(
					function (taskList) {
						for (var i = 0; i < taskList.tasks.length; i++) {
							taskList.resourceArr[i].data = taskList.tasks[i].data;
							cache[taskList.resourceArr[i].url] = taskList.tasks[i].data;
						};
						taskList.callback(taskList.resourceArr);
				})
				.error(function(taskList, errorMsg) {
					throw new Error(errorMsg);
				});
				taskList.doWork();
			}
		};
		
		this.isUpToDate = function(url, ver) {
			return (cache[url]||null) !== null;
		};
		
		this.isUpToDateArr = function(arr) {
			for (var i = 0; i < arr.length; i++) {
				if (!this.isUpToDate(arr[i]['url'], arr[i]['ver']))
					return false;
			};
			return true;
		};
		
		this.getResource = function(resourceUrl, version) {
			return cache[resourceUrl]||null;
		}
		
		this.putResource = function(resourceUrl, data, version, ttl ) {
			cache[resourceUrl] = data;
		}
	};