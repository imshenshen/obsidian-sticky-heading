import {Decoration, DecorationSet, EditorView, PluginValue, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {RangeSetBuilder} from "@codemirror/state";

const headingExp = /header-(\d)$/
// 如果要修改的话，要同时修改css中的样式
const OBSIDIAN_STICKY_HEADING_CLASS = "obsidian-sticky-heading"

class HeadingWidget extends WidgetType {
	constructor(readonly headingLevel: Number) {
		super()
		this.headingLevel = headingLevel
	}

	toDOM(view: EditorView): HTMLElement {
		const dom = document.createElement("div")
		dom.classList.add(OBSIDIAN_STICKY_HEADING_CLASS)
		dom.classList.add(`h${this.headingLevel}`)
		return dom
	}
}

class HeadingViewPlugin implements PluginValue {
	decorations: DecorationSet;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {
	}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		for (let {from, to} of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node,) {
					let regExpExecArray = headingExp.exec(node.type.name);
					if (regExpExecArray) {
						const headingLevel = Number(regExpExecArray[1])
						if (headingLevel) {
							builder.add(node.from, node.from, Decoration.line({
								class: `${OBSIDIAN_STICKY_HEADING_CLASS}`,
								attributes: {
									[`data-${OBSIDIAN_STICKY_HEADING_CLASS}_level`]: 'h' + headingLevel,
								}
							}))
						}
					}
				},
			});
		}
		return builder.finish();
	}
}

const pluginSpec = {
	decorations(value: HeadingViewPlugin) {
		return value.decorations;
	}
}

export function HeadingPlugin() {
	const headingViewPlugin = ViewPlugin.fromClass(
		HeadingViewPlugin,
		pluginSpec
	)
	return headingViewPlugin
}
