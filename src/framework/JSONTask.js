
	JSONTask = function(url) {
		this.url  = url||"";
		this.data = null;	
		
		this.workFn = function() {
			var self = this;
		
			jQuery.getJSON(this.url)
				.success(function(data) { 
					self.status = 2;
					self.data = data;
					self.successFn(self);
				})
				.error(function(jqXhr, textStatus, error) { 
					self.status = -1;
					self.errorFn(self, "Error while retrieving data from " +self.url +" . (" +textStatus +")");
				});
		};
	};
	
	JSONTask.prototype = new Task;