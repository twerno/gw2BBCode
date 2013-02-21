	
	PatternFinders = function(gw2DataMap) {
		this.registeredPatterns = [];
		
		var gw2DataMap = gw2DataMap;
		
		this.registerPattern = function(pattern) {
			this.registeredPatterns.push(pattern);
		};
		
		this.find = function(data) {
			var result = [],
				i = 0,
				j = 0,
				bbCodeArr;
			for (i = 0; i < this.registeredPatterns.length; i++) {
				bbCodeArr = this.registeredPatterns[i].process(data);
				for (j = 0; j < bbCodeArr.length; j++)
					result.push(bbCodeArr[j]);
			};

			for (i = 0; i < result.length; i++)
				gw2DataMap.findDataAndNameFor(result[i]);
			
			return result;
		};
	};