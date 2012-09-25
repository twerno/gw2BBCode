	
	var _gaq        = _gaq || [];
	var includeTo   = ['.post', '.list_posts'];
	var excludeFrom = ["code" ,"textarea"];
	
	var show_gw2DB   = 1;
	var show_gw2Wiki = 2;
	
	var showOnClick = show_gw2DB;
	
	var incrementalSearch = true;
	
	var gw2BBCode_img_host = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2_images";
	var gw2DB_Url          = "http://www.gw2db.com";
	var wiki_Url           = "http://wiki.guildwars2.com/wiki";
	var gw2DB_PopupHost    = "http://www.gw2db.com/{0}/{1}/tooltip?x&advanced=1&callback=?";
	//var popup_style      = "http://static-ascalon.cursecdn.com/current/skins/Ascalon/css/tooltip.css";
	var popup_style        = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/tooltip.css";
	//var popup_style      = "../dist/tooltip.css";