
	Gw2BBCodeGlobal = function() {

		this.imagesUrl  = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/gw2_images";
		this.contentUrl = 'https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/NEXT/';
	
		this.popup_cssURL = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/NEXT/tooltip.css";
		this.gw2_cssURL   = "https://s3-eu-west-1.amazonaws.com/gw2bbcode.pl/NEXT/gw2BBCode.css";

		this.main_pack      = {'url':this.contentUrl+'main_resource_pack.json', 'ver':12};
		this.lang_packs     = [{'url':this.contentUrl+'lang_pack_fr.json', 'ver':3, 'lang':'fr'}];
		
		this.gw2WikiUrl      = "http://wiki.guildwars2.com/wiki";
		this.gw2DBUrl        = "http://www.gw2db.com";
		this.onClickGoTo     = 'gw2DB'; //gw2Wiki, gw2DB
		this.gw2DB_PopupHost = "http://www.gw2db.com/{0}/{1}/tooltip?x&advanced=1&callback=?";
		this.gw2DBObj_ttl    = 1000*60*60*24; // 1 day
		
		this.types_En = [['s',  "skill"], 
		                 ['tr', "trait"], 
					     ['b',  'boon'],
						 ['co', 'condition']];

		this.types_names = {'s'  : "skills", 
		                    'tr' : "traits", 
						    'b'  : 'boons', 
							'co' : 'conditions'};

		this.profs_En = [['el', "Elementalist"], 
		                 ['en', "Engineer"], 
						 ['gu', "Guardian"], 
						 ['me', "Mesmer"], 
						 ['ne', "Necromancer"], 
						 ['ra', "Ranger"], 
						 ['th', "Thief"], 
						 ['wa', "Warrior"]];

		this.stances_En = [["air",   'air'], 
		                   ["earth", 'earth'], 
						   ["fire",  'fire'], 
						   ["water", 'water']];
	}