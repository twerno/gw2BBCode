cd dist
java -jar ../compiler.jar --compilation_level WHITESPACE_ONLY --externs ../libs/jquery-1.8.1.min.js --externs ../gw2BBCode_options.js --js ../gw2BBCode_consts.js --js ../gw2BBCode_tooltips.js --js ../gw2BBCode_core.js --js ../gw2BBCode_tools.js --module gw2BBCode:4 --warning_level QUIET
java -jar ../compiler.jar --compilation_level WHITESPACE_ONLY --js ../gw2BBCode_options.js --js gw2BBCode.js --module gw2BBCode:2
pause