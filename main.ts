import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import {HeadingPlugin} from "./src/HeadingPlugin";

// Remember to rename these classes and interfaces!

interface StickyHeadingSettings {
	sticky: boolean;
}

const DEFAULT_SETTINGS: StickyHeadingSettings = {
	sticky: true
}

export default class StickyHeadingPlugin extends Plugin {
	// settings: StickyHeadingSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new StickyHeadingSettingTab(this.app, this));
		this.app.workspace.trigger("parse-style-settings")
		this.registerEditorExtension([HeadingPlugin()])

	}

	onunload() {

	}

	async loadSettings() {
		// this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		// await this.saveData(this.settings);
	}
}

class StickyHeadingSettingTab extends PluginSettingTab {
	plugin: StickyHeadingPlugin;

	constructor(app: App, plugin: StickyHeadingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		/*
		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				// .setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					// this.plugin.settings.mySetting = value;
					// await this.plugin.saveSettings();
				}));
		*/
	}
}
