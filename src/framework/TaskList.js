
	TaskList = function(timeout) {
		this.timeout = (typeof(tasksTimeout) !== 'undefined' ? tasksTimeout : 15) *1000;
		this.tasks = [];
		var __timeout = null;
		var self = this;
		
		this.clear = function() {
			this.tasks = [];
			this.status = 0;
		};
		
		this.addTask = function(task) {
			this.tasks.push(
				task.success(function(data) {
					if (self.status !== -1 && self.isDone()) {
						clearTimeout(__timeout);
						self.status = 2;
						self.successFn(self);
					};
				})
				.error(function(textStatus) {
					clearTimeout(__timeout);
					self.status = -1;
					self.errorFn(self, "Error while retrieving data. (" +textStatus +")");
				}));
		};
		
		this.workFn = function() {
			var self = this, 
			    i = 0;
			if (this.timeout !== null && this.timeout > 0)
				__timeout = setTimeout(onTimeout, this.timeout);
			
			for (i = 0; i < this.tasks.length; i++)
				this.tasks[i].doWork();
			
			if (this.tasks.length === 0)
				this.successFn(this);
		};
		
		this.isDone = function() {
			for (var i = 0; i < this.tasks.length; i++)
				if (!this.tasks[i].isDone())
					return false;
			return true;		
		};
		
		var onTimeout = function() {
			clearTimeout(__timeout);
			self.status = -1;
			self.errorFn(self, "TaskList: timeout reached.");
		}
	}
	
	TaskList.prototype = new Task;