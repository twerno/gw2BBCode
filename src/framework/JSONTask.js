
	JSONTask = function(url) {
		this.url  = url||"";
		this.data = null;	
		
		this.workFn = function() {
			var self = this;

			/*jQuery.getJSON(this.url)
				.done(function(data) { 
					self.status = 2;
					self.data = data;
					self.successFn(self);
				})
				.fail(function(jqXhr, textStatus, error) { 
					self.status = -1;
					self.errorFn(self, "Error while retrieving data from " +self.url +" . (" +textStatus +")");
				});*/
				
			// compatibility with jQuery 1.4.2	
			jQuery.getJSON(this.url, 
				function(data) { 
					self.status = 2;
					self.data = data;
					self.successFn(self);
				});
		};
	};
	
	JSONTask.prototype = new Task;