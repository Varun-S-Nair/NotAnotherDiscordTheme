//META{"name":"ShowHiddenChannels","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/ShowHiddenChannels","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/ShowHiddenChannels/ShowHiddenChannels.plugin.js"}*//

class ShowHiddenChannels {
	getName () {return "ShowHiddenChannels";}

	getVersion () {return "2.4.7";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Displays channels that are hidden from you by role restrictions.";}

	initConstructor () {
		this.changelog = {
			"added":[["Voice Users","Added the option to also display all current connected voice users in a hidden voice channel in the info tooltip (default is turned off)"]]
		};
		
		this.patchModules = {
			"Channels":["componentDidMount","componentDidUpdate"],
			"ChannelItem":"componentDidMount",
			"ChannelCategoryItem":"componentDidMount",
			"StandardSidebarView":"componentWillUnmount"
		};

		this.categoryMarkup = 
			`<div class="container-hidden">
				<div class="${BDFDB.disCN.categorycontainerdefault} hidden-channel">
					<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.alignstart + BDFDB.disCNS.nowrap + BDFDB.disCNS.categorywrapperdefault + BDFDB.disCN.cursorpointer}" style="flex: 1 1 auto;">
						<svg class="${BDFDB.disCNS.categoryicondefault + BDFDB.disCNS.categoryicontransition + BDFDB.disCN.directiondown}" width="12" height="12" viewBox="0 0 24 24">
							<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 10L12 15 17 10"></path>
						</svg>
						<div class="${BDFDB.disCNS.categorynamedefault + BDFDB.disCNS.categorycolortransition + BDFDB.disCN.categoryoverflowellipsis}" style="flex: 1 1 auto;">hidden</div>
					</div>
				</div>
			</div>`;

		this.channelMarkup = 
			`<div class="${BDFDB.disCN.channelcontainerdefault} hidden-channel">
				<div class="${BDFDB.disCNS.channelwrapperdefaulttext + BDFDB.disCN.channelwrapper}">
					<div class="${BDFDB.disCNS.channelcontentdefaulttext + BDFDB.disCN.channelcontent}">
						<div class="${BDFDB.disCN.marginreset}" style="flex: 0 0 auto;">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="${BDFDB.disCNS.channelcolordefaulttext + BDFDB.disCN.channelicon}">
								<path class="${BDFDB.disCN.channelbackground}" fill="currentColor" d=""></path>
								<path class="${BDFDB.disCN.channelforeground}" fill="currentColor" fill-rule="nonzero" d="M15.1,3.2 L15.1,2 C15.1,0.88 14.05,0 13,0 C11.95,0 10.9,0.88 10.9,2 L10.9,3.2 C10.45,3.2 10,3.68 10,4.16 L10,6.96 C10,7.52 10.45,8 10.9,8 L15.025,8 C15.55,8 16,7.52 16,7.04 L16,4.24 C16,3.68 15.55,3.2 15.1,3.2 Z M14,3 L12,3 L12,1.92857143 C12,1.35714286 12.4666667,1 13,1 C13.5333333,1 14,1.35714286 14,1.92857143 L14,3 Z"></path>
							</svg>
						</div>
						<div class="${BDFDB.disCNS.channelnamedefaulttext + BDFDB.disCNS.channelname + BDFDB.disCN.channeloverflowellipsis}" style="flex: 1 1 auto;"></div>
						<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginreset}" style="flex: 0 1 auto;"></div>
					</div>
				</div>
			</div>`;
			
		this.channelMessage = {
			TEXT: `enter the hidden text channel`,
			VOICE: `enter the hidden voice channel`,
			CATEGORY: `open the hidden category`
		}
			
		this.channelIcons = {
			TEXT: `M7.92,4.66666667 L6.50666667,4.66666667 L6.98,2 L5.64666667,2 L5.17333333,4.66666667 L2.50666667,4.66666667 L2.27333333,6 L4.94,6 L4.23333333,10 L1.56666667,10 L1.33333333,11.3333333 L4,11.3333333 L3.52666667,14 L4.86,14 L5.33333333,11.3333333 L9.33333333,11.3333333 L8.86,14 L10.1933333,14 L10.6666667,11.3333333 L13.3333333,11.3333333 L13.5666667,10 L12.2333333,10 L8.74333333,10 L5.56666667,10 L6.27333333,6 L7.92,6 L7.92,4.66666667 Z`,
			VOICE: `M13.6005009,10 C12.8887426,11.8438372 11.2906136,13.2480521 9.33333333,13.6933333 L9.33333333,12.3133333 C10.5512947,11.950895 11.5614504,11.1062412 12.1398042,10 L13.6005009,10 Z M10.7736513,8.99497564 C10.4978663,9.6613459 9.98676114,10.2040442 9.33333333,10.5133333 L9.33333333,8.99497564 L10.7736513,8.99497564 Z M2,5.84666667 L4.66666667,5.84666667 L8,2.51333333 L8,13.18 L4.66666667,9.84666667 L2,9.84666667 L2,5.84666667 Z`,
			CATEGORY: `M6,1 L6,4 L2,4 L2,1 L6,1 Z M14,5 L14,8 L10,8 L10,5 L14,5 Z M10,10 L14,10 L14,13 L10,13 L10,10.33333333 L10,10 Z M9,8 L5,8 L5,11 L9,11 L9,13 L5,13 L3,13 L3,5 L5,5 L5,6 L9,6 L9,8 Z`
		};

		this.defaults = {
			settings: {
				showText:				{value:true, 	description:"Show hidden Textchannels:"},
				showVoice:				{value:true, 	description:"Show hidden Voicechannels:"},
				showCategory:			{value:false, 	description:"Show hidden Categories:"},
				showAllowedRoles:		{value:true,	description:"Show allowed Roles on hover:"},
				showAllowedUsers:		{value:true,	description:"Show specifically allowed Users on hover:"},
				showOverWrittenRoles:	{value:true,	description:"Include overwritten Roles in allowed Roles:"},
				showDeniedRoles:		{value:true,	description:"Show denied Roles on hover:"},
				showDeniedUsers:		{value:true,	description:"Show denied Users on hover:"},
				showForNormal:			{value:false,	description:"Also show Roles/Users for allowed channels:"},
				showTopic:				{value:false, 	description:"Show the topic of hidden channels:"},
				showVoiceUsers:			{value:false, 	description:"Show current Users in a Voice channel:"}
			},
			amounts: {
				hoverDelay:				{value:0, 		min:0,	description:"Tooltip delay in millisec:"}
			}
		};
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		var settings = BDFDB.getAllData(this, "settings");
		var amounts = BDFDB.getAllData(this, "amounts");
		var settingshtml = `<div class="${this.name}-settings DevilBro-settings"><div class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.size18 + BDFDB.disCNS.height24 + BDFDB.disCNS.weightnormal + BDFDB.disCN.marginbottom8}">${this.name}</div><div class="DevilBro-settings-inner">`;
		for (let key in settings) {
			settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.settings[key].description}</h3><div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCN.switchthemedefault}" style="flex: 0 0 auto;"><input type="checkbox" value="settings ${key}" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner} settings-switch"${settings[key] ? " checked" : ""}></div></div>`;
		}
		for (let key in amounts) {
			settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCN.flexchild}" style="flex: 0 0 50%;">${this.defaults.amounts[key].description}</h3><div class="${BDFDB.disCN.inputwrapper} inputNumberWrapper ${BDFDB.disCNS.vertical +  BDFDB.disCNS.flex + BDFDB.disCNS.directioncolumn}" style="flex: 1 1 auto;"><span class="numberinput-buttons-zone"><span class="numberinput-button-up"></span><span class="numberinput-button-down"></span></span><input type="number"${(!isNaN(this.defaults.amounts[key].min) && this.defaults.amounts[key].min !== null ? ' min="' + this.defaults.amounts[key].min + '"' : '') + (!isNaN(this.defaults.amounts[key].max) && this.defaults.amounts[key].max !== null ? ' max="' + this.defaults.amounts[key].max + '"' : '')} option="${key}" value="${amounts[key]}" class="${BDFDB.disCNS.inputdefault + BDFDB.disCNS.input + BDFDB.disCN.size16} amount-input"></div></div>`;
		}
		settingshtml += `</div></div>`;

		let settingspanel = BDFDB.htmlToElement(settingshtml);

		BDFDB.initElements(settingspanel, this);

		return settingspanel;
	}

	//legacy
	load () {}

	start () {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js"]');
		if (!libraryScript || performance.now() - libraryScript.getAttribute("date") > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();});
			document.head.appendChild(libraryScript);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.loadMessage(this);

			this.React = BDFDB.WebModules.findByProperties("createElement", "cloneElement");
			this.ChannelTypes = BDFDB.WebModules.findByProperties("ChannelTypes").ChannelTypes;
			this.UserUtils = BDFDB.WebModules.findByProperties("getUsers", "getUser");
			this.MemberUtils = BDFDB.WebModules.findByProperties("getMember", "getMembers");
			this.GuildUtils = BDFDB.WebModules.findByProperties("getGuilds", "getGuild");
			this.ChannelUtils = BDFDB.WebModules.findByProperties("getChannels", "getDMFromUserId");
			this.VoiceUtils = BDFDB.WebModules.findByProperties("getAllVoiceStates", "getVoiceStatesForChannel");
			this.GuildChannels = BDFDB.WebModules.findByProperties("getChannels", "getDefaultChannel");
			this.Permissions = BDFDB.WebModules.findByProperties("Permissions", "ActivityTypes").Permissions;

			BDFDB.WebModules.forceAllUpdates(this, "Channels");
		}
		else {
			console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
		}
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			BDFDB.removeEles(".container-hidden");
			BDFDB.unloadMessage(this);
		}
	}


	// begin of own functions

	processChannels (instance, wrapper, methodnames) {
		if (instance.props && instance.props.guild) {
			if (methodnames.includes("componentDidMount")) this.appendHiddenContainer(instance.props.guild);
			if (methodnames.includes("componentDidUpdate")) this.reappendHiddenContainer(instance.props.guild);
		}
	}

	processChannelItem (instance, wrapper) {
		if (instance.props && instance.props.channel) this.reappendHiddenContainer(this.GuildUtils.getGuild(instance.props.channel.guild_id));
	}

	processChannelCategoryItem (instance, wrapper) {
		if (instance.props && instance.props.channel) this.reappendHiddenContainer(this.GuildUtils.getGuild(instance.props.channel.guild_id));
	}

	processStandardSidebarView (instance, wrapper) {
		if (this.SettingsUpdated) {
			delete this.SettingsUpdated;
			BDFDB.WebModules.forceAllUpdates(this, "Channels");
		}
	}

	appendHiddenContainer (guild) {
		BDFDB.removeEles(".container-hidden");
		if (!guild) return;
		this.currentGuild = guild.id;
		var allChannels = this.ChannelUtils.getChannels();
		var shownChannels = this.GuildChannels.getChannels(guild.id);
		var hiddenChannels = {};

		for (let type in this.ChannelTypes) hiddenChannels[this.ChannelTypes[type]] = [];

		for (let channel_id in allChannels) {
			var channel = allChannels[channel_id];
			if (channel.guild_id == guild.id) {
				var isHidden = true;
				if (channel.type == this.ChannelTypes.GUILD_CATEGORY) {
					for (let type in this.ChannelTypes) {
						let shownChannelsOfType = this.ChannelTypes[type] == 0 && shownChannels.SELECTABLE ? shownChannels.SELECTABLE : shownChannels[this.ChannelTypes[type]];
						if (shownChannelsOfType) for (let shownChannel of shownChannelsOfType) {
							if (!channel.id || shownChannel.channel.parent_id == channel.id) {
								isHidden = false;
								break;
							}
						}
					}
				}
				else {
					let shownChannelsOfType = channel.type == 0 && shownChannels.SELECTABLE ? shownChannels.SELECTABLE : shownChannels[channel.type];
					if (shownChannelsOfType) for (let shownChannel of shownChannelsOfType) if (shownChannel.channel.id == channel.id) {
						isHidden = false;
						break;
					}
				}
				if (isHidden) hiddenChannels[channel.type].push(channel);
			}
		}


		var settings = BDFDB.getAllData(this, "settings"); 
		var count = 0;
		for (let type in this.ChannelTypes) {
			if (!settings.showText && type == "GUILD_TEXT" || !settings.showVoice && type == "GUILD_VOICE" || !settings.showCategory && type == "GUILD_CATEGORY") {
				hiddenChannels[this.ChannelTypes[type]] = [];
			}
			BDFDB.sortArrayByKey(hiddenChannels[this.ChannelTypes[type]], "name");
			count += hiddenChannels[this.ChannelTypes[type]].length;
		}
		hiddenChannels.count = count;

		if (count > 0) {
			var category = BDFDB.htmlToElement(this.categoryMarkup);
			var wrapper = category.querySelector(BDFDB.dotCN.cursorpointer);
			var svg = category.querySelector(BDFDB.dotCN.categoryicontransition);
			var name = category.querySelector(BDFDB.dotCN.categorycolortransition);
			var inner = category.querySelector(BDFDB.dotCN.categorycontainerdefault + " > " + BDFDB.dotCN.flex);
			category.setAttribute("guild", guild.id);
			inner.addEventListener("click", () => {
				BDFDB.toggleClass(wrapper, BDFDB.disCN.categorywrapperhovered, BDFDB.disCN.categorywrapperhoveredcollapsed);
				BDFDB.toggleClass(svg, BDFDB.disCN.categoryiconhovered, BDFDB.disCN.categoryiconhoveredcollapsed, BDFDB.disCN.directiondown, BDFDB.disCN.directionright);
				BDFDB.toggleClass(name, BDFDB.disCN.categorynamehovered, BDFDB.disCN.categorynamehoveredcollapsed);

				var visible = BDFDB.containsClass(svg, BDFDB.disCN.directionright);
				BDFDB.toggleEles(category.querySelectorAll(BDFDB.dotCN.channelcontainerdefault), !visible);
				BDFDB.saveData(guild.id, !visible, this, "categorystatus");
			});
			var togglecontainer = () => {
				if (!BDFDB.containsClass(svg, BDFDB.disCN.directionright)) {
					BDFDB.toggleClass(wrapper, BDFDB.disCN.categorywrapperdefault, BDFDB.disCN.categorywrapperhovered);
					BDFDB.toggleClass(svg, BDFDB.disCN.categoryicondefault, BDFDB.disCN.categoryiconhovered);
					BDFDB.toggleClass(name, BDFDB.disCN.categorynamedefault,BDFDB.disCN.categorynamehovered);
				}
				else {
					BDFDB.toggleClass(wrapper, BDFDB.disCN.categorywrappercollapsed, BDFDB.disCN.categorywrapperhoveredcollapsed)
					BDFDB.toggleClass(svg, BDFDB.disCN.categoryiconcollapsed, BDFDB.disCN.categoryiconhoveredcollapsed);
					BDFDB.toggleClass(name, BDFDB.disCN.categorynamecollapsed, BDFDB.disCN.categorynamehoveredcollapsed)
				}
			};
			inner.addEventListener("mouseenter", togglecontainer);
			inner.addEventListener("mouseleave", togglecontainer);

			for (let hiddenChannel of hiddenChannels[0]) this.createChannel(guild, category, hiddenChannel, "TEXT");
			for (let hiddenChannel of hiddenChannels[2]) this.createChannel(guild, category, hiddenChannel, "VOICE");
			for (let hiddenChannel of hiddenChannels[4]) this.createChannel(guild, category, hiddenChannel, "CATEGORY");
			
			if (BDFDB.loadData(guild.id, this, "categorystatus") === false) {
				BDFDB.toggleClass(wrapper, BDFDB.disCN.categorywrapperdefault, BDFDB.disCN.categorywrappercollapsed);
				BDFDB.toggleClass(svg, BDFDB.disCN.categoryicondefault, BDFDB.disCN.categoryiconcollapsed, BDFDB.disCN.directiondown, BDFDB.disCN.directionright);
				BDFDB.toggleClass(name, BDFDB.disCN.categorynamedefault, BDFDB.disCN.categorynamecollapsed); 

				BDFDB.toggleEles(category.querySelectorAll(BDFDB.dotCN.channelcontainerdefault), false);
			}

			this.reappendHiddenContainer(guild, category);
		}
		let channellist = document.querySelector(BDFDB.dotCNS.channels + BDFDB.dotCN.scroller);
		if (channellist) {
			BDFDB.removeEventListener(this, channellist, "mouseenter", BDFDB.dotCNC.channelcontainerdefault + BDFDB.dotCN.categorycontainerdefault);
			if (settings.showForNormal) BDFDB.addEventListener(this, channellist, "mouseenter", BDFDB.dotCNC.channelcontainerdefault + BDFDB.dotCN.categorycontainerdefault, e => {
				if (!BDFDB.containsClass(e.currentTarget, "hidden-channel")) {
					var channel = BDFDB.getKeyInformation({"node":e.currentTarget,"key":"channel"});
					if (channel) this.showAccessRoles(guild, channel, e, false);
				}
			});
		}
	}
	
	createChannel (guild, category, info, type) {
		let channel =  BDFDB.htmlToElement(this.channelMarkup);
		let channelwrapper = channel.querySelector(BDFDB.dotCN.channelwrapper);
		let channelicon = channel.querySelector(BDFDB.dotCN.channelcontent);
		let channelsvg = channel.querySelector(BDFDB.dotCN.channelicon);
		let channelname = channel.querySelector(BDFDB.dotCN.channelname);
		this.setReactInstanceOfChannel(info, channel);
		channelname.innerText = info.name;
		channelsvg.querySelector(BDFDB.dotCN.channelbackground).setAttribute("d", this.channelIcons[type]);
		BDFDB.addChildEventListener(channel, "mouseenter mouseleave", BDFDB.dotCN.channelwrapper, e => {
			BDFDB.toggleClass(channelwrapper, BDFDB.disCN.channelwrapperdefaulttext, BDFDB.disCN.channelwrapperhoveredtext);
			BDFDB.toggleClass(channelicon, BDFDB.disCN.channelcontentdefaulttext, BDFDB.disCN.channelcontenthoveredtext);
			BDFDB.toggleClass(channelsvg, BDFDB.disCN.channelcolordefaulttext, BDFDB.disCN.channelcolorhoveredtext);
			BDFDB.toggleClass(channelname, BDFDB.disCN.channelnamedefaulttext, BDFDB.disCN.channelnamehoveredtext);
			this.showAccessRoles(guild, info, e, false);
		});
		channel.addEventListener("click", () => {
			BDFDB.showToast(`You can not ${this.channelMessage[type]}&nbsp;&nbsp;<strong>${BDFDB.encodeToHTML(info.name)}</strong>.`, {type:"error", html:true});
		});
		channel.addEventListener("contextmenu", e => {
			this.createHiddenObjContextMenu(guild, info, type, e);
		});
		category.appendChild(channel);
	}

	reappendHiddenContainer (guild, category = document.querySelector(BDFDB.dotCNS.channels + BDFDB.dotCNS.scroller + ".container-hidden")) {
		if (!guild) return;
		if (guild.id != this.currentGuild) this.appendHiddenContainer(guild);
		else if (category) {
			var scroller = document.querySelector(BDFDB.dotCNS.channels + BDFDB.dotCN.scroller);
			if (!scroller || scroller.lastChild.previousSibling == category) return;
			category.remove();
			let count = parseInt(scroller.lastChild.previousSibling.className.split("-")[1])+1;
			category.className = "container-" + count + " container-hidden";
			scroller.insertBefore(category, scroller.lastChild);
		}
	}

	setReactInstanceOfChannel (guild, div) {
		var reactInstance = BDFDB.React.createElement(div);
		reactInstance.memoizedProps = {channel:guild};
		div.__reactInternalInstance = reactInstance;
	}

	createHiddenObjContextMenu (guild, channel, type, e) {
		BDFDB.stopEvent(e);
		var contextMenu = BDFDB.htmlToElement(`<div class="${BDFDB.disCN.contextmenu} showhiddenchannels-contextmenu">${BDFDB.isPluginEnabled("PermissionsViewer") ? '<div class="' + BDFDB.disCN.contextmenuitemgroup + '"><div class="' + BDFDB.disCN.contextmenuitem + '" style="display: none !important;"></div></div>' : ''}<div class="${BDFDB.disCN.contextmenuitemgroup}"><div class="${BDFDB.disCN.contextmenuitem} copyid-item"><span>${BDFDB.LanguageStrings.COPY_ID}</span><div class="${BDFDB.disCN.contextmenuhint}"></div></div></div></div>`);
		var reactInstance = BDFDB.React.createElement(contextMenu);
		reactInstance.memoizedProps = {displayName:"ChannelDeleteGroup",guild,channel};
		reactInstance.return = {memoizedProps:{type:("CHANNEL_LIST_" + type),guild,channel}};
		contextMenu.__reactInternalInstance = reactInstance;
		BDFDB.addChildEventListener(contextMenu, "click", ".copyid-item", e2 => {
			contextMenu.remove();
			require("electron").clipboard.write({text: channel.id});
		});

		BDFDB.appendContextMenu(contextMenu, e);
	}

	showAccessRoles (guild, channel, e, allowed) {
		if ((e.type != "mouseenter" && e.type != "mouseover") || !guild || !channel) return;
		var settings = BDFDB.getAllData(this, "settings");
		var myMember = this.MemberUtils.getMember(guild.id, BDFDB.myData.id);
		var allowedRoles = [], allowedUsers = [], overwrittenRoles = [], deniedRoles = [], deniedUsers = [];
		var everyoneDenied = false;
		for (let id in channel.permissionOverwrites) {
			if (settings.showAllowedRoles && channel.permissionOverwrites[id].type == "role" && (guild.roles[id].name != "@everyone") && ((channel.permissionOverwrites[id].allow | this.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].allow || (channel.permissionOverwrites[id].allow | this.Permissions.CONNECT) == channel.permissionOverwrites[id].allow)) {
				if (myMember.roles.includes(id) && !allowed) {
					if (settings.showOverWrittenRoles) overwrittenRoles.push(guild.roles[id]);
				}
				else {
					allowedRoles.push(guild.roles[id]);
				}
			}
			else if (settings.showAllowedUsers && channel.permissionOverwrites[id].type == "member" && ((channel.permissionOverwrites[id].allow | this.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].allow || (channel.permissionOverwrites[id].allow | this.Permissions.CONNECT) == channel.permissionOverwrites[id].allow)) {
				let user = this.UserUtils.getUser(id);
				let member = this.MemberUtils.getMember(guild.id,id);
				if (user && member) allowedUsers.push(Object.assign({name:user.username,id:user.id},member));
			}
			if (settings.showDeniedRoles && channel.permissionOverwrites[id].type == "role" && ((channel.permissionOverwrites[id].deny | this.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].deny || (channel.permissionOverwrites[id].deny | this.Permissions.CONNECT) == channel.permissionOverwrites[id].deny)) {
				deniedRoles.push(guild.roles[id]);
				if (guild.roles[id].name == "@everyone") everyoneDenied = true;
			}
			else if (settings.showDeniedUsers && channel.permissionOverwrites[id].type == "member" && ((channel.permissionOverwrites[id].deny | this.Permissions.VIEW_CHANNEL) == channel.permissionOverwrites[id].deny || (channel.permissionOverwrites[id].deny | this.Permissions.CONNECT) == channel.permissionOverwrites[id].deny)) {
				let user = this.UserUtils.getUser(id);
				let member = this.MemberUtils.getMember(guild.id, id);
				if (user && member) deniedUsers.push(Object.assign({name:user.username,id:user.id},member));
			}
		}
		if (settings.showAllowedRoles && allowed && !everyoneDenied) {
			allowedRoles.push({"name":"@everyone"});
		}
		var htmlString = ``;
		if (settings.showTopic && !allowed && channel.topic && channel.topic.replace(/[\t\n\r\s]/g, "")) {
			htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Topic:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}"><div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-topic" style="border-color: rgba(255, 255, 255, 0.6); height: unset !important; padding-top: 5px; padding-bottom: 5px; max-width: ${window.outerWidth/3}px">${BDFDB.encodeToHTML(channel.topic)}</div></div>`;
		}
		if (settings.showVoiceUsers && (!allowed || e.currentTarget.querySelector(BDFDB.dotCN.channelnamelockedvoice)) && channel.type == 2) {
			let voicestates = this.VoiceUtils.getVoiceStatesForChannel(guild.id, channel.id);
			if (voicestates.length > 0) {
				htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Connected Voice Users:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}">`;
				for (let voicestate of voicestates) {
					let user = this.UserUtils.getUser(voicestate.userId);
					let member = this.MemberUtils.getMember(guild.id, voicestate.userId);
					if (user && member) {
						let color = member.colorString ? BDFDB.colorCONVERT(member.colorString, "RGBCOMP") : [255,255,255];
						htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-voiceuser" style="padding-left: 0; border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCNS.avatarimage + BDFDB.disCN.avatarxsmall}" style="margin-right: 4px; z-index: 1003; background-image: url(${BDFDB.getUserAvatar(user.id)});"></div><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}">${BDFDB.encodeToHTML(member.nick || user.username)}</div></div>`;
					}
				}
				htmlString += `</div>`;
			}
		}
		if (allowedRoles.length > 0 || overwrittenRoles.length > 0) {
			htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Allowed Roles:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}">`;
			for (let role of allowedRoles) {
				let color = role.colorString ? BDFDB.colorCONVERT(role.colorString, "RGBCOMP") : [255,255,255];
				htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-allowedrole" style="border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}">${BDFDB.encodeToHTML(role.name)}</div></div>`;
			}
			for (let role of overwrittenRoles) {
				let color = role.colorString ? BDFDB.colorCONVERT(role.colorString, "RGBCOMP") : [255,255,255];
				htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-overwrittenrole" style="border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}" style="text-decoration: line-through !important;">${BDFDB.encodeToHTML(role.name)}</div></div>`;
			}
			htmlString += `</div>`;
		}
		if (allowedUsers.length > 0) {
			htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Allowed Users:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}">`;
			for (let user of allowedUsers) {
				let color = user.colorString ? BDFDB.colorCONVERT(user.colorString, "RGBCOMP") : [255,255,255];
				htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-alloweduser" style="padding-left: 0; border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCNS.avatarimage + BDFDB.disCN.avatarxsmall}" style="margin-right: 4px; z-index: 1003; background-image: url(${BDFDB.getUserAvatar(user.id)});"></div><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}">${BDFDB.encodeToHTML(user.nick || user.name)}</div></div>`;
			}
			htmlString += `</div>`;
		}
		if (deniedRoles.length > 0) {
			htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Denied Roles:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}">`;
			for (let role of deniedRoles) {
				let color = role.colorString ? BDFDB.colorCONVERT(role.colorString, "RGBCOMP") : [255,255,255];
				htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-deniedrole" style="border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}">${BDFDB.encodeToHTML(role.name)}</div></div>`;
			}
			htmlString += `</div>`;
		}
		if (deniedUsers.length > 0) {
			htmlString += `<div class="${BDFDB.disCN.marginbottom4}">Denied Users:</div><div class="${BDFDB.disCNS.flex + BDFDB.disCN.wrap}">`;
			for (let user of deniedUsers) {
				let color = user.colorString ? BDFDB.colorCONVERT(user.colorString, "RGBCOMP") : [255,255,255];
				htmlString += `<div class="${BDFDB.disCNS.userpopoutrole + BDFDB.disCNS.flex + BDFDB.disCNS.aligncenter + BDFDB.disCN.wrap + BDFDB.disCNS.size12 + BDFDB.disCN.weightmedium} SHC-denieduser" style="padding-left: 0; border-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6);"><div class="${BDFDB.disCNS.avatarimage + BDFDB.disCN.avatarxsmall}" style="margin-right: 4px; z-index: 1003; background-image: url(${BDFDB.getUserAvatar(user.id)});"></div><div class="${BDFDB.disCN.userpopoutrolecircle}" style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]});"></div><div class="${BDFDB.disCNS.userpopoutrolename}">${BDFDB.encodeToHTML(user.nick || user.name)}</div></div>`;
			}
			htmlString += `</div>`;
		}
		if (htmlString) {
			var width = window.outerWidth/2;
			var tooltip = BDFDB.createTooltip(htmlString, e.currentTarget, {type:"right", selector:"showhiddenchannels-tooltip", html:true, style:`max-width: ${width < 200 ? 400 : width}px !important;`, delay:BDFDB.getData("hoverDelay", this, "amounts")});
			var style = getComputedStyle(e.currentTarget);
			tooltip.style.setProperty("top", BDFDB.getRects(tooltip).top - style.paddingBottom.replace("px","")/2 + style.paddingTop.replace("px","")/2 + "px");
		}
	}
}
