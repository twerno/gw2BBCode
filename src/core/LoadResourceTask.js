
	LoadResourceTask = function(gw2ResourceUrl, version, ttl) {
		this.data           = null;
		this.ttl            = ttl
		this.version        = version;
		this.gw2ResourceUrl = gw2ResourceUrl;
		
		this.workFn = function() {
			var self = this,
				storageObj = null,
				JSONtask = null;
			if (LocalStorageHelper.isSupported())
				storageObj = LocalStorageHelper.getObject(this.gw2ResourceUrl, this.version);
			if (storageObj !== null) {
				self.status = 2;
				self.data = storageObj.data;
				self.successFn(self);
			} else {
				JSONtask = new JSONTask(this.gw2ResourceUrl)
					.success(function (task) {
						self.data = task.data;
						LocalStorageHelper.putObject(self.gw2ResourceUrl, self.data, self.version, self.ttl);
						self.status = 2;
						self.successFn(self);
					})
					.error(function(task, errorMsg) {
						self.status = -1;
						self.errorFn(self, errorMsg);
					});
				JSONtask.doWork();
			};
		};
	};
	
	LoadResourceTask.prototype = new Task;