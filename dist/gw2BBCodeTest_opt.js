(function(window) {function loadStyle(a){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.href=a;b.media="all";document.getElementsByTagName("head")[0].appendChild(b)}function compareStrLow(a,b){return a.toLowerCase()===b.toLowerCase()}String.prototype.format=function(){var a=arguments;return this.replace(/{(\d+)}/g,function(b,c){return"undefined"!=typeof a[c]?a[c]:b})};Task=function(){this.status=0;this.successFn=this.errorFn=this.workFn=null};Task.prototype.isDone=function(){return 2===this.status};Task.prototype.error=function(a){this.errorFn=a;return this};Task.prototype.success=function(a){this.successFn=a;return this};
Task.prototype.doWork=function(){if(!this.isDone()){if(null==(this.workFn||null))throw Error("workFn not defined");if(null==(this.errorFn||null))throw Error("errorFn not defined");if(null==(this.successFn||null))throw Error("successFn not defined");this.status=1;this.workFn(this)}};JSONTask=function(a){this.url=a||"";this.data=null;this.workFn=function(){var a=this;jQuery.getJSON(this.url).success(function(c){a.status=2;a.data=c;a.successFn(a)}).error(function(c,d){a.status=-1;a.errorFn(a,"Error while retrieving data from "+a.url+" . ("+d+")")})}};JSONTask.prototype=new Task;TaskList=function(){this.timeout=1E3*("undefined"!==typeof tasksTimeout?tasksTimeout:15);this.tasks=[];var a=null;this.clear=function(){this.tasks=[];this.status=0};this.addTask=function(b){var c=this;this.tasks.push(b.success(function(){-1!==c.status&&c.isDone()&&(clearTimeout(a),c.status=2,c.successFn(c))}).error(function(b){clearTimeout(a);c.status=-1;c.errorFn(c,"Error while retrieving data. ("+b+")")}))};this.workFn=function(){var b=this,c=0;null!==this.timeout&&0<this.timeout&&(a=setTimeout(function(){b.status=
-1;throw Error("TaskList: timeout reached.");},this.timeout));for(c=0;c<this.tasks.length;c++)this.tasks[c].doWork();0===this.tasks.length&&this.successFn(this)};this.isDone=function(){for(var a=0;a<this.tasks.length;a++)if(!this.tasks[a].isDone())return!1;return!0}};TaskList.prototype=new Task;function LocalStorageHelper(){}LocalStorageHelper.isSupported=function(){return"undefined"!==typeof Storage&&"undefined"!==JSON};LocalStorageHelper.putObject=function(a,b,c,d){b={data:b,ver:Math.max(1,c||0),ttl:Math.max(0,d||0),created:Date.now()};localStorage.setItem(a,JSON.stringify(b))};LocalStorageHelper.getObject=function(a,b){var c=JSON.parse(localStorage.getItem(a));return this.isValid(c,b)?c.data:null};LocalStorageHelper.containsKey=function(a){return null!==localStorage.getItem(a)};
LocalStorageHelper.remove=function(a){localStorage.removeItem(a)};LocalStorageHelper.clear=function(){localStorage.clear()};LocalStorageHelper.isValid=function(a,b){return null!==a&&a.ver===b&&(0===a.ttl||0!==a.ttl&&a.created+a.ttl<Date.now())};LocalStorageHelper.isUpToDate=function(a,b){return null!==LocalStorageHelper.getObject(a,b)};Gw2BBCodeGlobal=function(){this.contentUrl="https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/NEXT/";this.imagesUrl="https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2_images";this.popup_cssURL="https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/tooltip.css";this.gw2_cssURL="https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2BBCode.css";this.main_pack={url:this.contentUrl+"main_resource_pack.json",ver:2};this.stances_langEn=["air","earth","fire","water"];this.prof_s_langEn="el en gu me ne ra th wa".split(" ");
this.prof_l_langEn="Elementalist Engineer Guardian Mesmer Necromancer Ranger Thief Warrior".split(" ");this.types_langEn=["skill","trait","boon","condition"];this.lang_packs=[{url:this.contentUrl+"lang_pack_fr.json",ver:1,lang:"fr"}];this.element_type={s:"skills",tr:"traits",b:"boons",co:"conditions"};this.gw2WikiUrl="http://wiki.guildwars2.com/wiki";this.gw2DBUrl="http://www.gw2db.com";this.onClickGoTo="gw2DB"};LoadResourceTask=function(a,b,c){this.data=null;this.ttl=c;this.version=b;this.gw2ResourceUrl=a;this.workFn=function(){var a=this,b=null,c=null;LocalStorageHelper.isSupported()&&(b=LocalStorageHelper.getObject(this.gw2ResourceUrl,this.version));null!==b?(a.status=2,a.data=b.data,a.successFn(a)):(c=(new JSONTask(this.gw2ResourceUrl)).success(function(b){a.data=b.data;LocalStorageHelper.putObject(a.gw2ResourceUrl,a.data,a.version,a.ttl);a.status=2;a.successFn(a)}).error(function(b,c){a.status=-1;a.errorFn(a,
c)}),c.doWork())}};LoadResourceTask.prototype=new Task;ResourceManager=function(){this.loadResource=function(a,b,c,d){this.getResourceList([{url:Gw2BBCodeConst.contentUrl+a,ver:b,ttl:c,data:null}],d)};this.loadResourceList=function(a,b){if(null===a||0===a.length)b(a);else{var c=new TaskList(30),d=0;c.resourceArr=a;c.callback=b;for(d=0;d<a.length;d++)c.addTask(new LoadResourceTask(a[d].url,a[d].ver||1,a[d].ttl||0));c.success(function(a){for(var b=0;b<a.tasks.length;b++)a.resourceArr[b].data=a.tasks[b].data;a.callback(a.resourceArr)}).error(function(a,
b){throw Error(b);});c.doWork()}};this.isUpToDate=function(a,b){return LocalStorageHelper.isSupported()&&LocalStorageHelper.isUpToDate(a,b)};this.isUpToDateArr=function(a){var b;for(b=0;b<a.length;b++)if(!this.isUpToDate(a[b].url,a[b].ver))return!1;return!0};this.getResource=function(a,b){return LocalStorageHelper.getObject(a,b)};this.putResource=function(a,b,c,d){LocalStorageHelper.putObject(a,b,c,d)}};
NoLocalStorageResourceManager=function(){this.resources={};this.getResource=function(a,b,c,d){this.getResourceList([{url:a,ver:b,ttl:c,data:null}],d)};this.getResourceList=function(){}};function LangPackHelper(){}LangPackHelper.getExprStr_profs=function(a,b){return LangPackHelper.getExprStr_generic(a,b,a.prof_s_langEn,"prof")};LangPackHelper.getExprStr_stances=function(a,b){return LangPackHelper.getExprStr_generic(a,b,a.stances_langEn,"stance")};LangPackHelper.getExprStr_types=function(a,b){return LangPackHelper.getExprStr_generic(a,b,a.types_langEn,"types")};
LangPackHelper.getExprStr_generic=function(a,b,c,d){for(var g=0,e=0,f=null,k="",g=0;g<c.length;g++)k+=c[g]+"|";for(g=0;g<a.lang_packs.length;g++)if(f=b.getResource(a.lang_packs[g].url,a.lang_packs[g].ver),null!==f)for(e=0;e<f.dicts[d].length;e++)-1===k.indexOf(f.dicts[d][e])&&(k+=f.dicts[d][e]+"|");return k.slice(0,k.length-1)};LangPackHelper.getProfIDFrom=function(a,b,c){return LangPackHelper.getMasterItemIDFor(a,b,c,a.prof_s_langEn,"prof")};
LangPackHelper.getStanceIDFrom=function(a,b,c){return LangPackHelper.getMasterItemIDFor(a,b,c,a.stances_langEn,"stance")};LangPackHelper.getTypeIDFrom=function(a,b,c){return LangPackHelper.getMasterItemIDFor(a,b,c,a.types_langEn,"types")};
LangPackHelper.getMasterItemIDFor=function(a,b,c,d,g){if(""===c)return"";var e=0,f=0,k=null;c=c.toLowerCase();for(e=0;e<d.length;e++)if(c===d[e].toLowerCase())return d[e];for(e=0;e<a.lang_packs.length;e++)if(k=b.getResource(a.lang_packs[e].url,a.lang_packs[e].ver),null!==k)for(f=0;f<k.dicts[g].length&&f<d.length;f++)if(c===k.dicts[g][f].toLowerCase())return d[f];return""};BBCodeDataEntry=function(a){this.name=a;this.nameObj=this.dataObj=null;this.isMacro=function(){return null!==this.dataObj&&"m"===this.dataObj.t};this.dataObjSet=[];this.fillWeaponSetData=function(a){if(this.isMacro())for(var c=0;c<this.dataObj.m.length;c++)this.dataObjSet.push(a.dataMap[this.dataObj.m[c]])}};
BBCodeData=function(a,b,c){this.gw2Global=a;this.resourceMgr=b;this.patternType=c;this.regex="";this.entry2=this.entry1=null;this.isPrefixed=this.showAsText=!1;this.stance="";this.forcedIdx=-1;this.prof=this.type="";this.isWeaponSet=function(){return null!==this.entry1&&null!==this.entry2};this.toString=function(){return"regex: "+this.regex+"<br>name1: "+this.name1+"<br>name2: "+this.name2+"<br>showAsText: "+this.showAsText+"<br>isPrefixed: "+this.isPrefixed+"<br>stance: "+this.stance+"<br>forcedIdx: "+
this.forcedIdx+"<br>type: "+this.type+"<br>prof: "+this.prof+"<br><br>"};this.setStance=function(c){this.stance=LangPackHelper.getStanceIDFrom(a,b,c)};this.setType=function(c){this.type=LangPackHelper.getTypeIDFrom(a,b,c)};this.setProfession=function(c){this.prof=LangPackHelper.getProfIDFrom(a,b,c)};this.isCorrect=function(){return null===this.entry1&&null!==this.entry2||null!==this.entry1&&(null===this.entry1.dataObj||null===this.entry1.dataObj)||null!==this.entry2&&(null===this.entry2.dataObj||
null===this.entry2.dataObj)?!1:!0}};ClassicPattern=function(a,b){var c=RegExp("\\[([@^_]*)(gw2:)?(("+LangPackHelper.getExprStr_profs(a,b)+"):)?(("+LangPackHelper.getExprStr_types(a,b)+"):)?(.*?)(\\|(.*?))?(:("+LangPackHelper.getExprStr_stances(a,b)+"))?(\\.(\\d+))?\\]","gi");this.process=function(d){for(var g=[],e=c.exec(d),f=null;null!==e;)f=new BBCodeData(a,b,"gw2BBCode"),f.regex=RegExp((e[0]||"").replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"gi"),f.showAsText=-1!==(e[1]||"").indexOf("@"),f.isPrefixed="gw2:"===(e[2]||"").toLowerCase(),
f.setProfession(e[4]||""),f.setType(e[6]||""),f.entry1=e[7]?new BBCodeDataEntry(e[7]):null,f.entry2=e[9]?new BBCodeDataEntry(e[9]):null,f.setStance(e[11]||""),f.forcedIdx=Math.max(1,e[13]||1),e=c.exec(d),g.push(f);return g}};PatternFinders=function(a){this.registeredPatterns=[];this.registerPattern=function(a){this.registeredPatterns.push(a)};this.find=function(b){for(var c=[],d=0,g=0,e,d=0;d<this.registeredPatterns.length;d++){e=this.registeredPatterns[d].process(b);for(g=0;g<e.length;g++)c.push(e[g])}for(d=0;d<c.length;d++)a.findDataAndNameFor(c[d]);return c}};Gw2DBCOMGenerator=function(a){this.getBBCode=function(a){var k="";null!==a.entry1&&!a.entry1.isMacro()?k=b(a.entry1,a):null!==a.entry1&&a.entry1.isMacro()&&(k=c(a.entry1,a));null!==a.entry2&&!a.entry2.isMacro()?b(a.entry2,a):null!==a.entry2&&a.entry2.isMacro()&&c(a.entry2,a);return k};var b=function(a,b){var c=a.dataObj,j=e(c,a.nameObj.lang,"en");return d(c.id,j,c.t,g(j,c,b))},c=function(a,b){var c,j=[],h=null,l="",m="";for(c=0;c<a.dataObj.m.length;c++)h=a.dataObjSet[c],l=e(h,a.nameObj.lang,"en"),
j.push(d(h.id,l,h.t,g(l,h,b)));for(c=0;c<j.length;c++)m+=j[c]+(b.showAsText&&c!==j.length-1?" ":"");return m},d=function(b,c,d,e){return"<a href='{0}' class='gw2DBTooltip gw2DB_{1}_{2}'>{3}</a>".format("gw2Wiki"===a.onClickGoTo?"{0}/{1}".format(a.gw2WikiUrl,c.replace(/\s/g,"-").replace(/['"!]/g,"")):"gw2DB"===a.onClickGoTo?"{0}/{1}/{2}".format(a.gw2DBUrl,a.element_type[d],b):"#",a.element_type[d],b,e)},g=function(b,c,d){if(d.showAsText)return b;b=c.t;d=c.id;c="tr"===b?"<img src='{0}/{1}/{2}.png'>".format(a.imagesUrl,
a.element_type[b],c.tr||""):"<img src='{0}/{1}/{2}.png'>".format(a.imagesUrl,a.element_type[b],d);return c},e=function(a,b,c){return(b=a.names[b])?b:a.names[c]||""}};HTMLProcessor=function(a,b){var c="html,head,style,title,link,meta,script,object,iframe,code,textarea,a",c=c+",";this.processAll=function(){this.processNode(document.body)};this.processNode=function(d){if(!(null===d||"undefined"==d)){d=d.childNodes;for(var g=0,e=null,f=null,g=0;g<d.length;g++)if(f=d[g],1===f.nodeType&&-1===(c+",").indexOf(f.nodeName.toLowerCase()+",")&&this.processNode(f),!(3!==f.nodeType||""===(f.data||"").trim()))if(e=b.find(f.data),0!==e.length){for(var k=a,p=f.parentNode,j=e.length,
h=f.data,l=0,m=null,m=l=null,l=0;l<j;l++)m=e[l],m.isCorrect()&&(h=h.replace(m.regex,k.getBBCode(m)));if(h!==f.data){l=document.createElement("div");m=document.createDocumentFragment();for(l.innerHTML=h;l.firstChild;)m.appendChild(l.firstChild);p.insertBefore(m,f);p.removeChild(f)}}}}};Gw2DataMap=function(a,b,c){this.dataMap={};this.nameMap={};var d=!0;this.init=function(c){var e=0;b.isUpToDate(a.main_pack.url,a.main_pack.ver)||(d=!1,c.push(a.main_pack));for(e=0;e<a.lang_packs.length;e++)b.isUpToDate(a.lang_packs[e].url,a.lang_packs[e].ver)||(d=!1,c.push(a.lang_packs[e]))};this.init(c);this.findDataAndNameFor=function(a){var b=null;null!==a.entry1&&(b=g(this,a.entry1.name,a),null!==b&&(a.entry1.dataObj=b.data,a.entry1.nameObj=b.name,a.entry1.fillWeaponSetData(this)));null!==a.entry2&&
(b=g(this,a.entry2.name,a),null!==b&&(a.entry2.dataObj=b.data,a.entry2.nameObj=b.name,a.entry2.fillWeaponSetData(this)))};this.fillGw2DataMap=function(){!0===d&&(this.dataMap=b.getResource("Gw2DataMap",1),this.nameMap=b.getResource("Gw2NameMap",1),d=null!==this.dataMap&&null!==this.nameMap);if(!d){var c,g,j=null,h,l;this.dataMap={};this.nameMap={};j=b.getResource(a.main_pack.url,a.main_pack.ver);for(c=0;c<j.length;c++)h=j[c],h.names={en:h.n},this.dataMap[h.id]=h,this.nameMap[e(h.n)]=this.nameMap[e(h.n)]||
[],this.nameMap[e(h.n)].push({id:h.id,n:h.n,lang:"en"});for(c=0;c<a.lang_packs.length;c++){j=b.getResource(a.lang_packs[c].url,a.lang_packs[c].ver);for(g=0;g<j.names.length;g++){h=j.names[g];if(null===(this.dataMap[h[0]]||null))console.log("ERROR: no data for id:{0}, name:{1} in langPack:{2}".format(h[0],h[1],j.lang)),this.dataMap[h[0]]={id:h[0],name:h[1],t:"?",names:{}};this.nameMap[e(h[1])]=this.nameMap[e(h[1])]||[];this.nameMap[e(h[1])].push({id:h[0],n:h[1],lang:j.lang});this.dataMap[h[0]].names[j.lang]=
h[1]}}for(l in this.nameMap)-1!==l.indexOf("gw2_")&&this.nameMap[l].sort(f);b.putResource("Gw2DataMap",this.dataMap,1,0);b.putResource("Gw2NameMap",this.nameMap,1,0);d=!0}};var g=function(a,b,c){var d,f,g=0,n=null,q=b.toLowerCase();if(""===b)return null;d=a.nameMap[e(b)]||null;if(null===d)return null;for(f=0;f<d.length;f++)if(d[f].n.toLowerCase()===q){n=a.dataMap[d[f].id]||null;if(null===n)throw Error("no data for "+b);if((""!==c.stance&&compareStrLow(c.stance,n.st||"")||""===c.stance)&&(""!==c.type&&
compareStrLow(c.type,n.t||"")||""===c.type)&&(""!==c.prof&&compareStrLow(c.prof,n.p||"")||""===c.prof)&&++g===c.forcedIdx)return{data:n,name:d[f]}}return null},e=function(a){return"gw2_"+a.substr(0,3).toLowerCase()},f=function(a,b){return a.n===b.n?0<a.id&&0<b.id||0>a.id&&0>b.id?a.id>b.id?-1:1:0<a.id?-1:1:a.n>b.n?1:-1}};Gw2BBCode=function(){this.resourcesLoaded=this.documentReady=!1;this.gw2Global=this.gw2DataMap=this.contentGenerator=this.processor=this.patternFinders=this.resourceMgr=null;this.init=function(){this.gw2Global=new Gw2BBCodeGlobal;if(LocalStorageHelper.isSupported())this.resourceMgr=new ResourceManager;else throw Error("not implmeneted yet");var a=[],b=this;loadStyle(this.gw2Global.gw2_cssURL);loadStyle(this.gw2Global.popup_cssURL);this.gw2DataMap=new Gw2DataMap(this.gw2Global,this.resourceMgr,a);
this.patternFinders=new PatternFinders(this.gw2DataMap);this.contentGenerator=new Gw2DBCOMGenerator(this.gw2Global);this.processor=new HTMLProcessor(this.contentGenerator,this.patternFinders);this.resourceMgr.loadResourceList(a,function(a){b.onResourcesLoaded(a)});jQuery(document).ready(function(){b.onDocumentReady()})};this.onResourcesLoaded=function(){this.resourcesLoaded=!0;this.gw2DataMap.fillGw2DataMap();this.patternFinders.registerPattern(new ClassicPattern(this.gw2Global,this.resourceMgr));
this.loadedAndReady()};this.onDocumentReady=function(){this.documentReady=!0;this.loadedAndReady()};this.loadedAndReady=function(){this.resourcesLoaded&&this.documentReady&&this.processor.processAll()}};LocalStorageHelper.clear();window.gw2BBCode=new Gw2BBCode;window.gw2BBCode.init();var testObject={one:1,two:2,three:3};console.log("isLocalStorageSupported: ",LocalStorageHelper.isSupported());console.log("containsKey: ",LocalStorageHelper.containsKey("obj"));console.log("putObject: ",LocalStorageHelper.putObject("obj",testObject));console.log("containsKey: ",LocalStorageHelper.containsKey("obj"));console.log("getObject: ",LocalStorageHelper.getObject("obj"));console.log("containsKey: ",LocalStorageHelper.containsKey("obj"));console.log("remove: ",LocalStorageHelper.remove("obj"));
console.log("containsKey: ",LocalStorageHelper.containsKey("obj"));var taskList=new TaskList(30);taskList.success(function(){console.log("AsyncTaskList: done")});taskList.error(function(a,b){console.log("Error "+b)});taskList.doWork();})(window);