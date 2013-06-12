
	Gw2DBSyndicationPlugin = function() {

		this.markAllGw2DBLink = function() {
			jQuery("a").each(function() {
				register(this);
			});
		}
		
		var register = function(a) {
			if (a.host == 'www.gw2db.com') {
				var match = /http:\/\/www.gw2db.com\/(\w+)\/(\d+)-/g.exec(a.href);
				if (match !== null && !jQuery(a).hasClass('gw2DBTooltip')) {
					jQuery(a).addClass("gw2DB_touchFriendly gw2DBTooltip gw2DB_{0}_{1}".format(match[1], match[2]));
					a.url = a.href;
					a.href = 'javascript:void(0);';
				}
			}
		}
	}