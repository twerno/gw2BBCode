
	// status 0 - waiting
	//        1 - working
	//        2 - done
	//       -1 - error
	
	Task = function() {
		this.status     = 0;
		//this.parentTask = null;
		
		this.workFn    = null;
		this.errorFn   = null;
		this.successFn = null;
	};
	
	Task.prototype.isDone  = function() {return this.status === 2;};

	Task.prototype.error   = function(errorFn)   {this.errorFn   = errorFn;   return this;};
	Task.prototype.success = function(successFn) {this.successFn = successFn; return this;};

	Task.prototype.doWork = function() {
		if (this.isDone()) return;
	
		if ((this.workFn||null) == null)
			throw new Error('workFn not defined');

		if ((this.errorFn||null) == null)
			throw new Error('errorFn not defined');

		if ((this.successFn||null) == null)
			throw new Error('successFn not defined');
	
		this.status = 1;
	
		this.workFn(this);
	};