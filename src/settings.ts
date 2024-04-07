import {App, PluginSettingTab, Setting} from "obsidian";
import StickyHeadingPlugin from "../main";

export interface StickyHeadingSettings {
	stickyType: string;
}

export const DEFAULT_SETTINGS: StickyHeadingSettings = {
	stickyType: "prev"
}

export class StickyHeadingSettingTab extends PluginSettingTab {
	plugin: StickyHeadingPlugin;

	constructor(app: App, plugin: StickyHeadingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Plugin Settings'});

		new Setting(containerEl)
			.setName('Sticky Type')
			.setDesc('prev: show prev heading; prevToH1: show prev headings until h1;')
			.addDropdown(dropdown => {
				dropdown.addOption('prev', 'prev');
				dropdown.addOption('prevToH1', 'prevToH1');
				dropdown.setValue(this.plugin.settings.stickyType);
				dropdown.onChange(async (value) => {
					this.plugin.settings.stickyType = value;
					await this.plugin.saveSettings(this.plugin.settings);
				});
			})


		containerEl.createEl('h2', {text: 'Plugin Style Settings'});
		const styleEl = containerEl.createEl('div')
		styleEl.addClass('callout')
		styleEl.setAttribute("data-callout", "warning");
		styleEl.createEl("div", {text: "🔔 Notice: You need to install [Style Settings plugin](https://github.com/mgmeyers/obsidian-style-settings) to config style"})
		styleEl.addClass("callout-title")
	}
}
