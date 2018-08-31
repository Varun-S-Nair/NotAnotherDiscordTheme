//META{"name":"MemberCount","displayName":"MemberCount","website":"https://github.com/Arashiryuu","source":"https://github.com/Arashiryuu/crap/blob/master/ToastIntegrated/MemberCount/MemberCount.plugin.js"}*//

/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.\nJust reload Discord with Ctrl+R.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!\nJust reload Discord with Ctrl+R.", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

class MemberCount {
	constructor() {
		this.initialized = false;
		this.stylesheet;
		this.counter;
		this.guildStore;
		this.memberStore;
		this.loadedGuilds = [];

		this.membMO = new MutationObserver((changes) => {
			let reinject = false;
			let memberCount = false;
			for (const change of changes) {
				if (change.type === 'childList' && change.addedNodes.length) {
					for (const node of change.addedNodes.values()) {
						if (node.classList && node.classList.contains('membersWrap-2h-GB4')) {
							reinject = true;
						} else if (node.classList && ['chat-3bRxxu', 'messagesWrapper-3lZDfY'].includes(node.classList[0])) {
							reinject = true;
						} else if (node.classList && node.classList.contains('member-3W1lQa')) {
							memberCount = true;
						}
					}
				} else if (change.type === 'childList' && change.removedNodes.length) {
					for (const node of change.removedNodes.values()) {
						if (node.classList && node.classList.contains('member-3W1lQa')) {
							memberCount = true;
						}
					}
				}
				if (document.getElementById('memberCount')) {
					memberCount = true;
				}
			}
			if (reinject) this.reinject();
			if (memberCount) this.memberCount();
		});

		this.styleCSS = `
			#memberCount {
				position: absolute;
				font-size: 12px;
				letter-spacing: 0.08em;
				font-weight: 500;
				text-transform: uppercase;
				display: block;
				width: 100%;
				text-align: center;
				padding: 0.9vh 0;
				z-index: 5;
			}

			.theme-dark #memberCount {
				color: hsla(0, 0%, 100%, 0.4);
				background: #2f3136;
			} 
			
			.theme-light #memberCount {
				color: #99aab5;
				background: #f3f3f3;
			}

			.membersWrap-2h-GB4 .members-1998pB {
				margin-top: 2vh;
			}
		`;
	}

	load() {
		this.log('Loaded');
	}

	stop() {
		this.unwatch();
		this.remove();
		this.log('Stopped');
	}

	start() {
		this.log('Started');
		let libraryScript = window.ZeresLibrary;
		
		if (!libraryScript) {
			libraryScript = this.createElement('script', {
				id: 'zeresLibraryScript',
				src: 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js',
				type: 'text/javascript'
			});
			document.head.appendChild(libraryScript);
		} else if (libraryScript && libraryScript.isOutdated) {
			const lib = document.querySelectorAll('zeresLibraryScript');
			if (lib.length) {
				const len = lib.length;
				for (let i = 0; i < len; i++) lib[i].remove();
			}
			libraryScript = this.createElement('script', {
				id: 'zeresLibraryScript',
				src: 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js',
				type: 'text/javascript'
			});
			document.head.appendChild(libraryScript);
		}

		if (typeof window.ZeresLibrary !== 'undefined') this.initialize();
		else libraryScript.addEventListener('load', () => this.initialize());
	}

	initialize() {
		PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), this.downLink);

		this.guildStore = DiscordModules.SelectedGuildStore;
		this.memberStore = DiscordModules.GuildMemberStore;

		this.inject();
		this.memberCount(this.guildStore.getGuildId());
		this.watch();

		this.initialized = true;

		PluginUtilities.showToast(`${this.getName()} ${this.getVersion()} has started.`);
	}

	watch() {
		const app = document.querySelector('.app');
		if (!app) return false;
		this.membMO.observe(app, { childList: true, subtree: true, attributes: true });
		return true;
	}

	unwatch() {
		this.membMO.disconnect();
		return true;
	}

	reinject() {
		const m = document.querySelector('.membersWrap-2h-GB4');
		if (!m) return false;

		this.inject();

		return this.memberCount(this.guildStore.getGuildId());
	}

	inject() {
		const ss = document.getElementById('memberCountCSS');
		const c = document.getElementById('memberCount');
		const members = document.querySelector('.membersWrap-2h-GB4');
		if (!members) return false;

		if (!ss && !c) {
			this.stylesheet = this.createElement('style', { id: 'memberCountCSS', textContent: this.styleCSS });
			document.head.appendChild(this.stylesheet);
	
			this.counter = this.createElement('div', { id: 'memberCount', className: 'membersGroup-v9BXpm', textContent: '&nbsp;' });
			members.appendChild(this.counter);
	
			return true;
		} else if (!c || !ss) {
			$('#memberCountCSS, #memberCount').remove();
			this.stylesheet = this.createElement('style', { id: 'memberCountCSS', textContent: this.styleCSS });
			document.head.appendChild(this.stylesheet);
	
			this.counter = this.createElement('div', { id: 'memberCount', className: 'membersGroup-v9BXpm', textContent: '&nbsp;' });
			members.appendChild(this.counter);
	
			return true;
		}

		return false;
	}

	remove() {
		if (document.contains(this.stylesheet) && document.contains(this.counter)) {
			try {
				document.head.removeChild(this.stylesheet);
				document.querySelector('.membersWrap-2h-GB4').removeChild(this.counter);
				return true;
			} catch(e) {
				this.err(e.stack);
			}
		}

		return false;
	}

	createElement(type = '', properties = {}) {
		const element = document.createElement(type);
		
		for (const prop in properties) {
			element[prop] = properties[prop];
		}

		return element;
	}

	memberCount(guildId) {
		const members = document.querySelector('.membersWrap-2h-GB4');
		if (!members) return false;

		if (guildId && !this.loadedGuilds.includes(guildId)) {
			try {
				DiscordModules.GuildActions.requestMembers([guildId], '', 0);
				this.loadedGuilds.push(guildId);
			} catch(e) {
				this.err(e);
			}
		}
		
		const total = this.memberStore.getMemberIds(this.guildStore.getGuildId()).length;
		const mCount = document.getElementById('memberCount');

		if (mCount) {
			mCount.textContent = `Members—${total}`;
			return true;
		}

		return false;
	}

	observer({ addedNodes }) {
		if (addedNodes.length && addedNodes[0].classList && addedNodes[0].classList.contains('app')) {
			this.unwatch();
			this.watch();
		}
	}

	log(...extra) {
		return console.log(`[%c${this.getName()}%c]`, 'color: #59F;', '', ...extra);
	}

	err(...errors) {
		return console.error(`[%c${this.getName()}%c] `, 'color: #59F;', '', ...errors);
	}

	get downLink() {
		return `https://raw.githubusercontent.com/Arashiryuu/crap/master/ToastIntegrated/${this.getName()}/${this.getName()}.plugin.js`;
	}

	getName() {
		return 'MemberCount';
	}

	getAuthor() {
		return 'Arashiryuu';
	}

	getVersion() {
		return '1.0.11';
	}

	getDescription() {
		return 'Displays a server\'s member-count at the top of the member-list, can be styled with the #memberCount selector.';
	}
};

/*@end@*/
