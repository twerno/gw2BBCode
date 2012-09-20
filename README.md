What is Gw2BBCode ?
-------------------

Gw2BBCode is javascript plugin, which alow you to post Guild Wars 2 resources (like skills, traits and builds) on your web page.

Most of used images, descriptions & tooltips comes from http://www.gw2db.com.


How to use it ?
---------------

* All you need to do is write resource's name in brackets:

	`[Charge], ["Fear Me!"], [Ember's Might], [Poison], [Swiftness]`.


* Need resource's name instead of icon? It's simple! Just add `@` just after first brackets:

	`[@Charge], [@"Fear Me!"], [@Ember's Might], [@Poison], [@Swiftness]`.


* There is more than one resource with the same name? (Disabling Shot shortbow and harpoon gun skill).

    `the first one:  [Disabling Shot] or [Disabling Shot.1]`

    `the second one: [Disabling Shot.2]`


How to use macros ?
-------------------

Macro allow you to post entire set of skills at onces.
For instance if you want to post build for double dagger thief you only need to write `[th:Dagger/Dagger]`.

### Sets of weapons

    [profession*:main_hand/offhand:attunement**]
    *  just first 2 letters of profession name
    ** ele only (default fire)

	More examples:
    [El:scepter] == [el:scepter:fire]
    [Wa:Mace/Warhorn]
    [Th:Sword]
    [Th:Sword/Pistol]


What're main difrences between GW2DB Tooltip Syndication and Gw2BBCode?
---------------------------------------------------------------------

* Gw2BBCode use BBCode style, GW2DB Tooltip don't
* Gw2BBCode shows recources' icons, GW2DB Tooltip don't
* Gw2BBCode has macros, GW2DB Tooltip don't
* Gw2BBCode cache loaded recources, GW2DB Tooltip don't
* Both can show tooltips, but Gw2BBCode do it better ;)
* Both can show tooltips over link to GW2DB resources


How to install and configure gw2BBCode on my website ?
--------------------------------------------------

WIP