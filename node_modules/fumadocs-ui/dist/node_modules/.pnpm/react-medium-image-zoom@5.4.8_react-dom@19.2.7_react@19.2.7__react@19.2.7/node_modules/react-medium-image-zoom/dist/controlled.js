import { adjustSvgIDs } from "./utils/adjust-svg-ids.js";
import { testDiv, testImg, testImgLoaded, testSvg } from "./utils/element-tests.js";
import { getImgAlt } from "./utils/get-img-alt.js";
import { getImgSrc } from "./utils/get-img-src.js";
import { getStyleGhost } from "./utils/get-style-ghost.js";
import { getStyleModalImg } from "./utils/get-style-modal-img.js";
import React from "react";
import ReactDOM from "react-dom";
//#region ../../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/controlled.js
const IMAGE_QUERY = [
	"img",
	"svg",
	"[role=\"img\"]",
	"[data-zoom]"
].map((x) => `${x}:not([aria-hidden="true"])`).join(",");
const defaultBodyAttrs = {
	overflow: "",
	width: ""
};
function getDialogContainer() {
	const existing = document.querySelector("[data-rmiz-portal]");
	if (existing != null) return existing;
	const el = document.createElement("div");
	el.setAttribute("data-rmiz-portal", "");
	document.body.appendChild(el);
	return el;
}
function handleDialogCancelStatic(e) {
	e.preventDefault();
}
function Controlled(props) {
	return React.createElement(ControlledBase, { ...props });
}
var ControlledBase = class extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			id: "",
			isZoomImgLoaded: false,
			loadedImgEl: void 0,
			modalState: "UNLOADED",
			shouldRefresh: false,
			styleGhost: {}
		};
		this.refContent = React.createRef();
		this.refDialog = React.createRef();
		this.refModalContent = React.createRef();
		this.refModalImg = React.createRef();
		this.refWrap = React.createRef();
		this.imgEl = null;
		this.isScaling = false;
		this.prevBodyAttrs = defaultBodyAttrs;
		this.styleModalImg = {};
		this.handleModalStateChange = (prevModalState) => {
			const { state: { modalState } } = this;
			if (prevModalState !== "LOADING" && modalState === "LOADING") {
				this.isScaling = false;
				this.loadZoomImg();
				window.addEventListener("resize", this.handleResize, { passive: true });
				window.addEventListener("touchstart", this.handleTouchStart, { passive: true });
				window.addEventListener("touchmove", this.handleTouchMove, { passive: true });
				window.addEventListener("touchend", this.handleTouchEnd, { passive: true });
				window.addEventListener("touchcancel", this.handleTouchCancel, { passive: true });
				document.addEventListener("keydown", this.handleKeyDown, true);
			} else if (prevModalState !== "LOADED" && modalState === "LOADED") window.addEventListener("wheel", this.handleWheel, { passive: true });
			else if (prevModalState !== "UNLOADING" && modalState === "UNLOADING") {
				this.ensureImgTransitionEnd();
				window.removeEventListener("wheel", this.handleWheel);
				window.removeEventListener("touchstart", this.handleTouchStart);
				window.removeEventListener("touchmove", this.handleTouchMove);
				window.removeEventListener("touchend", this.handleTouchEnd);
				window.removeEventListener("touchcancel", this.handleTouchCancel);
				document.removeEventListener("keydown", this.handleKeyDown, true);
			} else if (prevModalState !== "UNLOADED" && modalState === "UNLOADED") {
				this.bodyScrollEnable();
				window.removeEventListener("resize", this.handleResize);
				this.refDialog.current?.close();
			}
		};
		this.setId = () => {
			const gen4 = () => Math.random().toString(16).slice(-4);
			this.setState({ id: gen4() + gen4() + gen4() });
		};
		this.setAndTrackImg = () => {
			const { refContent: { current: contentEl } } = this;
			if (contentEl == null) return;
			this.imgEl = contentEl.querySelector(IMAGE_QUERY);
			if (this.imgEl !== null) {
				this.contentNotFoundChangeObserver?.disconnect();
				this.imgEl.addEventListener("load", this.handleImgLoad);
				this.imgEl.addEventListener("click", this.handleZoom);
				if (this.state.loadedImgEl == null) this.handleImgLoad();
				this.imgElResizeObserver = new ResizeObserver((entries) => {
					const [entry] = entries;
					if (entry?.target !== void 0) {
						this.imgEl = entry.target;
						this.setState({ styleGhost: getStyleGhost(this.imgEl) });
					}
				});
				this.imgElResizeObserver.observe(this.imgEl);
				if (this.contentChangeObserver == null) {
					this.contentChangeObserver = new MutationObserver(() => {
						this.setState({ styleGhost: getStyleGhost(this.imgEl) });
					});
					this.contentChangeObserver.observe(contentEl, {
						attributes: true,
						childList: true,
						subtree: true
					});
				}
			} else if (this.contentNotFoundChangeObserver == null) {
				this.contentNotFoundChangeObserver = new MutationObserver(this.setAndTrackImg);
				this.contentNotFoundChangeObserver.observe(contentEl, {
					childList: true,
					subtree: true
				});
			}
		};
		this.handleIfZoomChanged = (prevIsZoomed) => {
			const { props: { isZoomed } } = this;
			if (!prevIsZoomed && isZoomed) this.zoom();
			else if (prevIsZoomed && !isZoomed) this.unzoom();
		};
		this.handleImgLoad = () => {
			const imgSrc = getImgSrc(this.imgEl);
			if (imgSrc == null || imgSrc === "") return;
			const img = new Image();
			const { imgEl } = this;
			if (testImg(imgEl)) {
				const { sizes, srcset, crossOrigin } = imgEl;
				img.sizes = sizes;
				img.srcset = srcset;
				img.crossOrigin = crossOrigin;
			}
			img.src = imgSrc;
			const setLoaded = () => {
				this.setState({
					loadedImgEl: img,
					styleGhost: getStyleGhost(this.imgEl)
				});
			};
			img.decode().then(setLoaded).catch(() => {
				if (testImgLoaded(img)) {
					setLoaded();
					return;
				}
				img.onload = setLoaded;
			});
		};
		this.handleZoom = (e) => {
			if (this.props.isDisabled !== true && this.hasImage()) this.props.onZoomChange?.(true, { event: e });
		};
		this.handleUnzoom = (e) => {
			if (this.props.isDisabled !== true) this.props.onZoomChange?.(false, { event: e });
		};
		this.handleBtnUnzoomClick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.handleUnzoom(e);
		};
		this.handleDialogClick = (e) => {
			if (e.target === this.refModalContent.current || e.target === this.refModalImg.current) {
				e.stopPropagation();
				this.handleUnzoom(e);
			}
		};
		this.handleDialogClose = (e) => {
			e.stopPropagation();
			this.handleUnzoom(e);
		};
		this.handleKeyDown = (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				this.handleUnzoom(e);
			}
		};
		this.handleWheel = (e) => {
			if (e.ctrlKey) return;
			if (this.isScaling) return;
			if ((window.visualViewport?.scale ?? 1) > 1) return;
			e.stopPropagation();
			queueMicrotask(() => {
				this.handleUnzoom(e);
			});
		};
		this.handleTouchStart = (e) => {
			if (e.touches.length > 1) {
				this.isScaling = true;
				return;
			}
			const { changedTouches } = e;
			const [changedTouch] = changedTouches;
			if (changedTouches.length === 1 && changedTouch !== void 0) {
				const { screenY } = changedTouch;
				this.touchYStart = screenY;
			}
		};
		this.handleTouchMove = (e) => {
			const browserScale = window.visualViewport?.scale ?? 1;
			const { changedTouches: changedTouchesMove } = e;
			const [changedTouchMove] = changedTouchesMove;
			if (this.props.canSwipeToUnzoom && !this.isScaling && browserScale <= 1 && this.touchYStart != null && changedTouchMove !== void 0) {
				const { screenY } = changedTouchMove;
				this.touchYEnd = screenY;
				const max = Math.max(this.touchYStart, this.touchYEnd);
				const min = Math.min(this.touchYStart, this.touchYEnd);
				if (Math.abs(max - min) > this.props.swipeToUnzoomThreshold) {
					this.touchYStart = void 0;
					this.touchYEnd = void 0;
					this.handleUnzoom(e);
				}
			}
		};
		this.handleTouchEnd = () => {
			this.touchYStart = void 0;
			this.touchYEnd = void 0;
		};
		this.handleTouchCancel = () => {
			this.touchYStart = void 0;
			this.touchYEnd = void 0;
		};
		this.handleResize = () => {
			this.setState({ shouldRefresh: true });
		};
		this.hasImage = () => this.imgEl !== null && (this.state.loadedImgEl !== void 0 || testSvg(this.imgEl)) && window.getComputedStyle(this.imgEl).display !== "none";
		this.zoom = () => {
			this.bodyScrollDisable();
			this.refDialog.current?.showModal();
			this.setState({ modalState: "LOADING" });
		};
		this.unzoom = () => {
			this.setState({ modalState: "UNLOADING" });
		};
		this.handleImgTransitionEnd = () => {
			clearTimeout(this.timeoutTransitionEnd);
			if (this.state.modalState === "LOADING") this.setState({ modalState: "LOADED" });
			else if (this.state.modalState === "UNLOADING") this.setState({
				shouldRefresh: false,
				modalState: "UNLOADED"
			});
		};
		this.ensureImgTransitionEnd = () => {
			if (this.refModalImg.current !== null) {
				const { transitionDuration: td } = window.getComputedStyle(this.refModalImg.current);
				const tdFloat = parseFloat(td);
				if (tdFloat !== 0 && !Number.isNaN(tdFloat)) {
					const tdMs = tdFloat * (td.endsWith("ms") ? 1 : 1e3) + 50;
					this.timeoutTransitionEnd = setTimeout(this.handleImgTransitionEnd, tdMs);
				}
			}
		};
		this.bodyScrollDisable = () => {
			const bodyStyle = document.body.style;
			this.prevBodyAttrs = {
				overflow: bodyStyle.overflow,
				width: bodyStyle.width
			};
			const clientWidth = document.body.clientWidth;
			bodyStyle.overflow = "hidden";
			bodyStyle.width = `${clientWidth}px`;
		};
		this.bodyScrollEnable = () => {
			const bodyStyle = document.body.style;
			const prev = this.prevBodyAttrs;
			bodyStyle.width = prev.width;
			bodyStyle.overflow = prev.overflow;
			this.prevBodyAttrs = defaultBodyAttrs;
		};
		this.loadZoomImg = () => {
			const { props: { zoomImg } } = this;
			if (zoomImg == null) return;
			const { src: zoomImgSrc } = zoomImg;
			if (zoomImgSrc !== void 0 && zoomImgSrc !== "") {
				const img = new Image();
				img.sizes = zoomImg.sizes ?? "";
				img.srcset = zoomImg.srcSet ?? "";
				img.crossOrigin = zoomImg.crossOrigin ?? void 0;
				img.src = zoomImgSrc;
				const setLoaded = () => {
					this.setState({ isZoomImgLoaded: true });
				};
				img.decode().then(setLoaded).catch(() => {
					if (testImgLoaded(img)) {
						setLoaded();
						return;
					}
					img.onload = setLoaded;
				});
			}
		};
		this.UNSAFE_handleSvg = () => {
			const { imgEl, refModalImg, styleModalImg } = this;
			if (testSvg(imgEl)) {
				const svgEl = imgEl.cloneNode(true);
				adjustSvgIDs(svgEl);
				svgEl.style.width = `${styleModalImg.width ?? 0}px`;
				svgEl.style.height = `${styleModalImg.height ?? 0}px`;
				svgEl.addEventListener("click", this.handleUnzoom);
				refModalImg.current?.firstChild?.remove();
				refModalImg.current?.appendChild(svgEl);
			}
		};
	}
	render() {
		const { handleBtnUnzoomClick, handleDialogClick, handleDialogClose, handleUnzoom, handleZoom, imgEl, props: { a11yNameButtonUnzoom, a11yNameButtonZoom, children, classDialog, IconUnzoom, IconZoom, wrapElement: WrapElement, ZoomContent, zoomImg, zoomMargin }, refContent, refDialog, refModalContent, refModalImg, refWrap, state: { id, isZoomImgLoaded, loadedImgEl, modalState, shouldRefresh, styleGhost } } = this;
		const idModal = `rmiz-modal-${id}`;
		const idModalImg = `rmiz-modal-img-${id}`;
		const isDiv = testDiv(imgEl);
		const isImg = testImg(imgEl);
		const isSvg = testSvg(imgEl);
		const imgAlt = getImgAlt(imgEl);
		const imgSrc = getImgSrc(imgEl);
		const imgSizes = isImg ? imgEl.sizes : void 0;
		const imgSrcSet = isImg ? imgEl.srcset : void 0;
		const imgCrossOrigin = isImg ? imgEl.crossOrigin : void 0;
		const hasZoomImg = zoomImg?.src !== void 0 && zoomImg.src !== "";
		const hasImage = this.hasImage();
		const labelBtnZoom = imgAlt !== void 0 && imgAlt !== "" ? `${a11yNameButtonZoom}: ${imgAlt}` : a11yNameButtonZoom;
		const isModalActive = modalState === "LOADING" || modalState === "LOADED";
		const dataContentState = hasImage ? "found" : "not-found";
		const dataOverlayState = modalState === "UNLOADED" || modalState === "UNLOADING" ? "hidden" : "visible";
		const styleContent = { visibility: modalState === "UNLOADED" ? "visible" : "hidden" };
		this.styleModalImg = hasImage && imgEl !== null ? getStyleModalImg({
			hasZoomImg,
			imgSrc,
			isSvg,
			isZoomed: isModalActive,
			loadedImgEl,
			offset: zoomMargin,
			shouldRefresh,
			targetEl: imgEl
		}) : {};
		let modalContent = null;
		if (hasImage) {
			const modalImg = isImg || isDiv ? React.createElement("img", {
				alt: imgAlt,
				crossOrigin: imgCrossOrigin,
				sizes: imgSizes,
				src: imgSrc,
				srcSet: imgSrcSet,
				...isZoomImgLoaded && modalState === "LOADED" ? zoomImg : {},
				"data-rmiz-modal-img": "",
				height: this.styleModalImg.height ?? void 0,
				id: idModalImg,
				onTransitionEnd: this.handleImgTransitionEnd,
				ref: refModalImg,
				style: this.styleModalImg,
				width: this.styleModalImg.width ?? void 0
			}) : isSvg ? React.createElement("div", {
				"data-rmiz-modal-img": true,
				onTransitionEnd: this.handleImgTransitionEnd,
				ref: refModalImg,
				style: this.styleModalImg
			}) : null;
			const modalBtnUnzoom = React.createElement("button", {
				"aria-label": a11yNameButtonUnzoom,
				"data-rmiz-btn-unzoom": "",
				onClick: handleBtnUnzoomClick,
				type: "button"
			}, React.createElement(IconUnzoom, null));
			modalContent = ZoomContent == null ? React.createElement(React.Fragment, null, modalImg, modalBtnUnzoom) : React.createElement(ZoomContent, {
				buttonUnzoom: modalBtnUnzoom,
				modalState,
				img: modalImg,
				isZoomImgLoaded,
				onUnzoom: handleUnzoom
			});
		}
		return React.createElement(WrapElement, {
			"data-rmiz": "",
			ref: refWrap
		}, React.createElement(WrapElement, {
			"data-rmiz-content": dataContentState,
			ref: refContent,
			style: styleContent
		}, children), hasImage && React.createElement(WrapElement, {
			"data-rmiz-ghost": "",
			style: styleGhost
		}, React.createElement("button", {
			"aria-label": labelBtnZoom,
			"data-rmiz-btn-zoom": "",
			onClick: handleZoom,
			type: "button"
		}, React.createElement(IconZoom, null))), hasImage && ReactDOM.createPortal(React.createElement("dialog", {
			"aria-labelledby": idModalImg,
			"aria-modal": "true",
			className: classDialog,
			"data-rmiz-modal": "",
			id: idModal,
			onClick: handleDialogClick,
			onClose: handleDialogClose,
			onCancel: handleDialogCancelStatic,
			ref: refDialog,
			role: "dialog"
		}, React.createElement("div", { "data-rmiz-modal-overlay": dataOverlayState }), React.createElement("div", {
			"data-rmiz-modal-content": "",
			ref: refModalContent
		}, modalContent)), getDialogContainer()));
	}
	componentDidMount() {
		this.setId();
		this.setAndTrackImg();
		this.handleImgLoad();
		this.UNSAFE_handleSvg();
	}
	componentWillUnmount() {
		if (this.state.modalState !== "UNLOADED") this.bodyScrollEnable();
		this.contentChangeObserver?.disconnect();
		this.contentNotFoundChangeObserver?.disconnect();
		this.imgElResizeObserver?.disconnect();
		this.imgEl?.removeEventListener("load", this.handleImgLoad);
		this.imgEl?.removeEventListener("click", this.handleZoom);
		clearTimeout(this.timeoutTransitionEnd);
		window.removeEventListener("wheel", this.handleWheel);
		window.removeEventListener("touchstart", this.handleTouchStart);
		window.removeEventListener("touchmove", this.handleTouchMove);
		window.removeEventListener("touchend", this.handleTouchEnd);
		window.removeEventListener("touchcancel", this.handleTouchCancel);
		window.removeEventListener("resize", this.handleResize);
		document.removeEventListener("keydown", this.handleKeyDown, true);
	}
	componentDidUpdate(prevProps, prevState) {
		this.handleModalStateChange(prevState.modalState);
		this.UNSAFE_handleSvg();
		this.handleIfZoomChanged(prevProps.isZoomed);
	}
};
ControlledBase.defaultProps = {
	a11yNameButtonUnzoom: "Minimize image",
	a11yNameButtonZoom: "Expand image",
	canSwipeToUnzoom: true,
	IconUnzoom: ICompress,
	IconZoom: IEnlarge,
	isDisabled: false,
	swipeToUnzoomThreshold: 10,
	wrapElement: "div",
	zoomMargin: 0
};
function ICompress() {
	return React.createElement("svg", {
		"aria-hidden": "true",
		"data-rmiz-btn-unzoom-icon": true,
		fill: "currentColor",
		focusable: "false",
		viewBox: "0 0 16 16",
		xmlns: "http://www.w3.org/2000/svg"
	}, React.createElement("path", { d: "M 14.144531 1.148438 L 9 6.292969 L 9 3 L 8 3 L 8 8 L 13 8 L 13 7 L 9.707031 7 L 14.855469 1.851563 Z M 8 8 L 3 8 L 3 9 L 6.292969 9 L 1.148438 14.144531 L 1.851563 14.855469 L 7 9.707031 L 7 13 L 8 13 Z" }));
}
function IEnlarge() {
	return React.createElement("svg", {
		"aria-hidden": "true",
		"data-rmiz-btn-zoom-icon": true,
		fill: "currentColor",
		focusable: "false",
		viewBox: "0 0 16 16",
		xmlns: "http://www.w3.org/2000/svg"
	}, React.createElement("path", { d: "M 9 1 L 9 2 L 12.292969 2 L 2 12.292969 L 2 9 L 1 9 L 1 14 L 6 14 L 6 13 L 2.707031 13 L 13 2.707031 L 13 6 L 14 6 L 14 1 Z" }));
}
//#endregion
export { Controlled };
