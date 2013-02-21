
	// based on: http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/

	HTMLProcessor = function(contentGenerator, patternFinders) {
	
		var contentGenerator = contentGenerator;
		var patternFinders   = patternFinders;
		
		var excludes = 'html,head,style,title,link,meta,script,object,iframe,code,textarea,a';
		excludes += ',';
		
		this.processAll = function() {
			this.processNode(document.body);
		};
		
		this.processNode = function(node) {
			if (node === null || node == "undefined") 
				return;

			var childNodes = node.childNodes,
				i = 0,
				bbCodeDataArr = null,
				currentNode = null;

			for (i = 0; i < childNodes.length; i++) {
				currentNode = childNodes[i];
				if (currentNode.nodeType === 1 &&
					(excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
					this.processNode(currentNode);
				};
				
				if (currentNode.nodeType !== 3 || (currentNode.data||"").trim() === "")
					continue;
					
				bbCodeDataArr = patternFinders.find(currentNode.data);

				if (bbCodeDataArr.length !== 0)
					generateBBCodeContentIn(currentNode, bbCodeDataArr, contentGenerator);
			}
		};
		
		var generateBBCodeContentIn = function(node, bbCodeDataArr, contentGenerator) {
			var parent = node.parentNode,
				bbCodeDataArrLength = bbCodeDataArr.length,
				html = node.data,
				i = 0,
				bbCodeData = null,
				wrap = null,
				frag = null;
			
			for(i = 0; i < bbCodeDataArrLength; i++) {
				bbCodeData = bbCodeDataArr[i];
				if (bbCodeData.isCorrect())
					html = html.replace(bbCodeData.regex, contentGenerator.getBBCode(bbCodeData));
			};
			
			if (html === node.data)
				return;
			
			wrap = document.createElement('div');
			frag = document.createDocumentFragment();
			wrap.innerHTML = html;
			while (wrap.firstChild) {
				frag.appendChild(wrap.firstChild);
			}

			parent.insertBefore(frag, node);
			parent.removeChild(node);
		};
	}
