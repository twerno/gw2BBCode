cd dist
java -jar ../compiler.jar --compilation_level WHITESPACE_ONLY --externs ../libs/jquery-1.8.1.min.js --externs ../gw2BBCode_options_work.js --js ../gw2BBCode_consts_work.js --js ../gw2BBCode_code_work.js --module gw2BBCode:2 --warning_level QUIET
java -jar ../compiler.jar --compilation_level WHITESPACE_ONLY --js ../gw2BBCode_options_work.js --js gw2BBCode.js --module gw2BBCode:2
pause