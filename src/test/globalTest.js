var testObject = { 'one': 1, 'two': 2, 'three': 3 };

console.log('isLocalStorageSupported: ', LocalStorageHelper.isSupported());
console.log('containsKey: ', LocalStorageHelper.containsKey('obj'));
console.log('putObject: ', LocalStorageHelper.putObject('obj', testObject));
console.log('containsKey: ', LocalStorageHelper.containsKey('obj'));
console.log('getObject: ', LocalStorageHelper.getObject('obj'));
console.log('containsKey: ', LocalStorageHelper.containsKey('obj'));
console.log('remove: ', LocalStorageHelper.remove('obj'));
console.log('containsKey: ', LocalStorageHelper.containsKey('obj'));

var taskList = new TaskList(30);
taskList.success(function(taskList){ console.log('AsyncTaskList: done'); });
taskList.error(function(taskList, errorMsg){ console.log('Error ' +errorMsg); });
//taskList.addTask(new Task(function(task, callback){callback(task);}));
//taskList.addTask(new JSONTask('http://gw2bbcode.pl/NEXT/names2ID_test.json'));
//taskList.addTask(new LoadResourceTask('http://www.gw2db.com/skills/13492/tooltip?x&callback=?', '1'));
taskList.doWork();

/*if (LocalStorageHelper.isSupported())
	var manager = new ResourceManager();
else	
	var manager = new NoLocalStorageResourceManager();*/
	
/*manager.success = function(mgr) {alert('ResourceManager: done');};
for (var i = 0; i < resources.length; i++) {
	manager.askForResource(contentUrl+resources[i].n, resources[i].v);
};
manager.loadResources();
*/

/*var gw2BBCode = new Gw2BBCode();*/


//jQuery(document).load( function() {gw2BBCode.processor.processAll();});