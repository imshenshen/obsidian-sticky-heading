import {Plugin} from 'obsidian';
import {HeadingPlugin} from "./src/HeadingPlugin";
import {DEFAULT_SETTINGS, StickyHeadingSettings, StickyHeadingSettingTab} from "./src/settings";


export default class StickyHeadingPlugin extends Plugin {
	settings: StickyHeadingSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new StickyHeadingSettingTab(this.app, this));

		this.app.workspace.trigger("parse-style-settings")

		this.registerEditorExtension([HeadingPlugin(this.settings,this.app)])
	}

	onunload() {

	}

	async loadSettings() {
		const data = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
	}

	async saveSettings(settings: any) {
		Object.assign(this.settings, settings)
		await this.saveData(this.settings);
	}
}
