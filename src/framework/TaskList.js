
	TaskList = function(timeout) {
		this.timeout = (typeof(tasksTimeout) !== 'undefined' ? tasksTimeout : 15) *1000;
		this.tasks = [];
		var __timeout = null;
		
		this.clear = function() {
			this.tasks = [];
			this.status = 0;
		};
		
		this.addTask = function(task) {
			var self = this;
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
				__timeout = setTimeout(function() {
					self.status = -1;
					throw new Error('TaskList: timeout reached.');
				}, this.timeout);
			
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
	}
	
	TaskList.prototype = new Task;