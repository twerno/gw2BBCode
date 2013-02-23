	var stances = ['air', 'terre', 'feux', 'eau'];
	var prow_s = ['el', 'in', 'ga', 'me', 'ne', 'ra', 'th', 'wa'];
	var prow_l = [];
	var type = ['skill', 'trait', 'boon', 'condition'];

	function sortNPrint() {
		gw2Elements.sort(compare);
		var newArr = [];
		for (var i = 0; i < gw2Elements.length; i++) {
			newArr.push( copyObj(gw2Elements[i], ['id', 't', 'ti', 'td', 'm', 'p', 'n', 'st']) );
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
			newArr.push( [gw2Elements[i].id, gw2Elements[i].n] );
		}
		document.write(JSON.stringify({lang:'fr',names:newArr,dicts:{'stance':stances, prof:prow_s, types:type}}));
	}
	
	function copyObj(source, element) {
		var result = new Object();
		for (var i = 0; i < element.length; i++) {
			result[element[i]] = (typeof(source[element[i]]) === "string") ? source[element[i]].replace(/</g, '&lt;').replace(/>/g, '&gt') : source[element[i]];
		}
		return result;
	}
	
	function compare(a, b) {
		if (a['n'] === b['n']) {
			if ((a.id > 0 && b.id > 0) || (a.id < 0 && b.id < 0)) 
				return (a.id > b.id) ? -1 : 1;  
			else
				return (a.id > 0) ? -1 : 1;
		} else 
			return (a.n > b.n) ? 1 : -1;
	}