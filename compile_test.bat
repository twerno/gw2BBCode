cd dist
java -jar ../compiler/compiler.jar --compilation_level WHITESPACE_ONLY --externs ../libs/jQueryExterns.js --js ../src/framework/Helpers.js --js ../src/framework/Task.js --js ../src/framework/JSONTask.js --js ../src/framework/TaskList.js --js ../src/framework/LocalStorageHelper.js --js ../src/framework/NestedTooltip.js --js ../src/framework/NestedTooltipMgr.js --js ../src/Global.js --js ../src/core/LoadResourceTask.js --js ../src/core/ResourceManager.js --js ../src/core/Gw2TooltipContentObj.js --js ../src/core/LangPackHelper.js --js ../src/core/BBCodeData.js --js ../src/gw2BBCode/ClassicPattern.js --js ../src/gw2BBCode/WeaponSwapHelper.js --js ../src/gw2BBCode/Gw2DBSyndicationPlugin.js --js ../src/core/PatternFinders.js --js ../src/core/Gw2DBCOMGenerator.js --js ../src/core/HTMLProcessor.js --js ../src/core/Gw2DataMap.js --js ../src/test/gw2DBValidator.js --js ../src/Gw2BBCode.js --js ../src/test/globalTest.js --js_output_file gw2BBCodeTest.js
pause
cd ..
test.html
