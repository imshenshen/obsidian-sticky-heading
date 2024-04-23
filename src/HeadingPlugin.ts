import {EditorView, PluginValue, ViewPlugin, ViewUpdate} from "@codemirror/view";
import {syntaxTree} from "@codemirror/language";
import {StickyHeadingSettings} from "./settings";
import {App, Component, MarkdownRenderer} from "obsidian";

const headingExp = /^HyperMD-header_HyperMD-header-(\d)$/
// 如果要修改的话，要同时修改css中的样式
const OBSIDIAN_STICKY_HEADING_CLASS = "obsidian-sticky-heading"
const CONTENT_CLASS = 'cm-content'


function getDistanceFromContentToScroller(view: EditorView) {
	const scroller = view.scrollDOM
	const contentContainer = view.scrollDOM.querySelector(`.${CONTENT_CLASS}`)
	let distance = 0;
	if (scroller == null || contentContainer == null) {
		return distance
	}

	let currentElement = contentContainer as HTMLElement;
	while (currentElement != null && currentElement != scroller) {
		distance += currentElement.offsetTop;
		currentElement = currentElement.offsetParent as HTMLElement;
	}
	return distance;
}


export function HeadingPlugin(settings: StickyHeadingSettings, app: App) {

	return ViewPlugin.fromClass(
		class HeadingViewPlugin implements PluginValue {
			stickyDom: HTMLElement
			view: EditorView
			headings: [number, string][]
			oldHeadings: [number, string][]
			settings: StickyHeadingSettings

			constructor(view: EditorView) {
				let dom = document.createElement("div");
				dom.classList.add(OBSIDIAN_STICKY_HEADING_CLASS)
				dom.classList.add('markdown-rendered')
				this.stickyDom = dom

				this.view = view

				this.headings = []
				this.oldHeadings = []

				this.settings = settings

				this.init(view)
			}

			init(view: EditorView) {
				// add stickyDom to view.dom
				view.dom.appendChild(this.stickyDom)
				// register scroll event
				view.scrollDOM.addEventListener("scroll", this.handleScroll.bind(this))
				this.updateHeaders(view);
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.heightChanged) {
					this.updateHeaders(update.view);
				}
			}

			destroy() {
				this.stickyDom.remove()
			}

			handleScroll(event: Event) {
				this.updateHeaders(this.view)
			}

			updateStickyDom() {
				// create Fragment and add to stickyDom
				const dom = document.createElement("div")
				dom.classList.add(`${OBSIDIAN_STICKY_HEADING_CLASS}_inner`)

				this.headings.forEach(([level, text]) => {
					const header = document.createElement("div")
					header.classList.add("HyperMD-header", `HyperMD-header-${level}`)
					const headerContent = document.createElement("div")
					headerContent.classList.add("cm-header", `cm-header-${level}`)
					//append .obsidian-sticky-heading_level and .obsidian-sticky-heading_text
					const levelDom = document.createElement("div")
					levelDom.classList.add(`${OBSIDIAN_STICKY_HEADING_CLASS}_level`)
					levelDom.textContent = `h${level}`
					headerContent.appendChild(levelDom)
					const textDom = document.createElement("div")
					textDom.classList.add(`${OBSIDIAN_STICKY_HEADING_CLASS}_text`)

					MarkdownRenderer.render(app, text, textDom, '', new Component())

					// textDom.textContent = text
					headerContent.appendChild(textDom)
					header.appendChild(headerContent)
					dom.appendChild(header)
				})
				this.stickyDom.replaceChildren(dom)
			}

			updateHeaders(view?: EditorView) {
				let editorView = view || this.view
				if (editorView) {
					let headerChanged = false
					editorView.requestMeasure({
						read: () => {
							this.oldHeadings = this.headings
							const oldHeadingsJsonStr = JSON.stringify(this.headings)
							this.findHeaders(editorView)
							if (this.oldHeadings.length !== this.headings.length || oldHeadingsJsonStr !== JSON.stringify(this.headings)) {
								headerChanged = true
							}
						},
						write: () => {
							headerChanged && this.updateStickyDom()
						}
					})

				}
			}

			findHeaders(view: EditorView): [number, string][] {
				const headerOutViewList: [number, string][] = []

				let distance = getDistanceFromContentToScroller(view);
				const headings: [number, string][] = []
				let offset = -10
				if (this.oldHeadings.length !== 0) {
					offset = 10
				}
				if (settings.stickyType === "prevToH1") {
					if (this.stickyDom?.clientHeight) {
						offset = this.stickyDom?.clientHeight - 16
					}
				}
				let height = view.scrollDOM.scrollTop - distance + offset;
				if (height > 0) {
					const firstElementBlockInfo = view.elementAtHeight(height)
					syntaxTree(view.state).iterate({
						from: 0,
						// 经测试，即使 form=0 ，下面的 iterate() 也会遍历到第一个 header，因此特殊处理一下
						to: firstElementBlockInfo.from,
						enter(node) {
							let regExpExecArray = headingExp.exec(node.name);
							if (regExpExecArray) {
								const level = Number(regExpExecArray[1])
								const text = view.state.sliceDoc(node.from, node.to).trim()
								headerOutViewList.unshift([level, text])
							}
						},
					});
				}
				const type = settings.stickyType // prev , prevToH1
				let biggestLevel = Number.MAX_SAFE_INTEGER
				for (let i = 0; i < headerOutViewList.length; i++) {
					const value = headerOutViewList[i]
					if (type === "prev") {
						headings.unshift(value)
						break
					} else if (type === "prevToH1") {
						const level = value[0]
						if (level < biggestLevel) {
							headings.unshift(value)
							biggestLevel = level
						}
					}
				}
				this.headings = headings
				return headings
			}
		}
	)
}
