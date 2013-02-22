
	Gw2BBCodeGlobal = function() {

		this.imagesUrl  = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2_images";
		this.contentUrl = 'https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/NEXT/';
	
		this.popup_cssURL = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/tooltip.css";
		this.gw2_cssURL   = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2BBCode.css";

		this.main_pack      = {'url':this.contentUrl+'main_resource_pack.json', 'ver':2};
		this.stances_langEn = ['air', 'earth', 'fire', 'water'];
		this.prof_s_langEn  = ['el', 'en', 'gu', 'me', 'ne', 'ra', 'th', 'wa'];
		this.prof_l_langEn  = ["Elementalist", "Engineer", "Guardian", "Mesmer", "Necromancer", "Ranger", "Thief", "Warrior"];
		this.types_langEn   = ['skill', 'trait', 'boon', 'condition'];
		this.lang_packs     = [{'url':this.contentUrl+'lang_pack_fr.json', 'ver':1, 'lang':'fr'}];
		this.element_type   = {"s":"skills","tr":"traits","b":"boons","co":"conditions"};
		
		this.gw2WikiUrl      = "http://wiki.guildwars2.com/wiki";
		this.gw2DBUrl        = "http://www.gw2db.com";
		this.onClickGoTo     = 'gw2DB'; //gw2Wiki, gw2DB
		this.gw2DB_PopupHost = "http://www.gw2db.com/{0}/{1}/tooltip?x&advanced=1&callback=?";
		this.gw2DBObj_ttl    = 1000*60*60*24; // 1 day
	}