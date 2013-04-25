	var stances = ['air', 'earth', 'fire', 'water'];
	var prow_s = ['el', 'en', 'gu', 'me', 'ne', 'ra', 'th', 'wa'];
	var type = ['skill', 'trait', 'boon', 'condition'];

	function sortNPrint() {
		gw2Elements.sort(compare);
		var newArr = [];
		for (var i = 0; i < gw2Elements.length; i++) {
			//newArr.push( copyObj(gw2Elements[i], ['id', 't', 'ti', 'td', 'm', 'p', 'n', 'st', 'gw2db']) );
			newArr.push( copyObj(gw2Elements[i], ['id', 't', 'ti', 'tc', 'm', 'p', 'n', 'st', 'gw2db']) );
		}
		document.write(JSON.stringify(newArr));
	}

	function sortNPrint2() {
		gw2Elements.sort(compare);
		var newArr = [];
		for (var i = 0; i < gw2Elements.length; i++) {
			newArr.push( copyObj(gw2Elements[i], ['id', 'n']) );
		}
		document.write(JSON.stringify({names:newArr,dicts:{'stance':stances, prof:prow_s, types:type}}));
	}

	function sortNPrint3() {
		gw2Elements.sort(compare);
		var newArr = [];
		for (var i = 0; i < gw2Elements.length; i++) {
			newArr.push( [Gw2DBHelper.getUniqID(gw2Elements[i]), gw2Elements[i].n] );
		}
		document.write(JSON.stringify({lang:'fr',names:newArr,dicts:{'stance':stances, prof:prow_s, types:type}}));
	}
	
	function sortNPrint4() {
		gw2Elements.sort(compare2);
		var newArr = [];
		for (var i = 0; i < gw2Elements.length; i++) {
			newArr.push( [gw2Elements[i].id, gw2Elements[i].n] );
		}
		document.write(JSON.stringify({lang:'put lang here',names:newArr,dicts:{'stance':stances, prof:prow_s, types:type}}));
	}
	
	function copyObj(source, element) {
		var result = new Object();
		for (var i = 0; i < element.length; i++) {
			result[element[i]] = (typeof(source[element[i]]) === "string") ? source[element[i]].replace(/</g, '&lt;').replace(/>/g, '&gt') : source[element[i]];
			
			if (element[i] === 'm' && (result['m']||null) !== null) {
			  for (var j = 0; j < result['m'].length; j++)
				result['m'][j] = 's-' +result['m'][j];
			}
		}
		return result;
	}
	
	function compare(a, b) {
		if (a['n'] === b['n']) {
			if (a.t == 'b' || a.t == 'co')
				return 1;
			if (b.t == 'b' || b.t == 'co')
				return -1;
			if ((a.id > 0 && b.id > 0) || (a.id < 0 && b.id < 0)) 
				return (a.id > b.id) ? -1 : 1;  
			else
				return (a.id > 0) ? -1 : 1;
		} else 
			return (a.n > b.n) ? 1 : -1;
	}
	
	function compare2(a, b) {
		if (a.t === b.t)
			return (a.n > b.n) ? 1 : -1;
		else
			return (a.t > b.t) ? 1 : -1;
	}