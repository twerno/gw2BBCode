
	function LocalStorageHelper() {};
	
	LocalStorageHelper.isSupported = function() {
		return (typeof(Storage) !== "undefined") && (JSON !== "undefined");
	};
	
	LocalStorageHelper.putObject = function(key, object, version, ttl) {
		var storageObj = {
			'data': object,
			'ver': Math.max(1, version||0),
			'ttl': Math.max(0, ttl||0),
			'created': Date.now()
		};
		localStorage.setItem(key, JSON.stringify(storageObj));
	};
	
	LocalStorageHelper.getObject = function(key, version) {
		var storageObj = JSON.parse(localStorage.getItem(key));
		if (this.isValid(storageObj, version))
			return storageObj.data;
		else
			return null;
	};

	LocalStorageHelper.containsKey = function(key) {
		return localStorage.getItem(key) !== null;
	};

	LocalStorageHelper.remove = function(key) {
		localStorage.removeItem(key);
	};
	
	LocalStorageHelper.clear = function() {
		localStorage.clear();
	}
	
	LocalStorageHelper.isValid = function(storageObj, version) {
		return storageObj !== null && storageObj['ver'] === version && 
		      (storageObj['ttl'] === 0 || (storageObj['ttl'] !== 0 && storageObj['created'] +storageObj['ttl'] >= Date.now()));
	}
	
	LocalStorageHelper.isUpToDate = function(key, ver) {
		return LocalStorageHelper.getObject(key, ver) !== null;
	}
	