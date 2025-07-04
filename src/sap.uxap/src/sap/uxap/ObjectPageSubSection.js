/*!
 * ${copyright}
 */

// Provides control sap.uxap.ObjectPageSubSection.
sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/core/Lib",
	"sap/ui/core/library",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/ResizeHandler",
	"sap/ui/core/IntervalTrigger",
	"./ObjectPageSectionBase",
	"./ObjectPageLazyLoader",
	"./BlockBase",
	"sap/m/Button",
	"sap/ui/core/StashedControlSupport",
	"sap/ui/base/ManagedObjectObserver",
	"sap/m/Title",
	"sap/m/TitlePropagationSupport",
	"sap/m/OverflowToolbar",
	"sap/m/ToolbarSpacer",
	"./library",
	"sap/m/library",
	"./ObjectPageSubSectionRenderer",
	"sap/base/Log",
	"sap/ui/base/DataType",
	"sap/ui/events/KeyCodes",
	// jQuery Plugin "firstFocusableDomRef"
	"sap/ui/dom/jquery/Focusable"
], function(
	Element,
	Library,
	coreLibrary,
	jQuery,
	ResizeHandler,
	IntervalTrigger,
	ObjectPageSectionBase,
	ObjectPageLazyLoader,
	BlockBase,
	Button,
	StashedControlSupport,
	ManagedObjectObserver,
	Title,
	TitlePropagationSupport,
	OverflowToolbar,
	ToolbarSpacer,
	library,
	mobileLibrary,
	ObjectPageSubSectionRenderer,
	Log,
	DataType,
	KeyCodes
) {
	"use strict";

	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	var ToolbarStyle = mobileLibrary.ToolbarStyle;

	var ToolbarDesign = mobileLibrary.ToolbarDesign;

	// shortcut for sap.uxap.ObjectPageSubSectionMode
	var ObjectPageSubSectionMode = library.ObjectPageSubSectionMode;

	// shortcut for sap.uxap.ObjectPageSubSectionLayout
	var ObjectPageSubSectionLayout = library.ObjectPageSubSectionLayout;

	var TitleLevel = coreLibrary.TitleLevel;

	/**
	 * Constructor for a new <code>ObjectPageSubSection</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Second-level information container of an {@link sap.uxap.ObjectPageLayout}.
	 *
	 * An <code>ObjectPageSubSection</code> may only be used within sections in the
	 * <code>ObjectPageLayout</code>. Subsections are used to display primary information in
	 * the <code>blocks</code> aggregation (always visible) and not-so-important information in
	 * the <code>moreBlocks</code> aggregation. The content in the <code>moreBlocks</code>
	 * aggregation is initially hidden, but may be accessed with a "See more" (...) button.
	 *
	 * As of version 1.61, applications can enable auto-expand of the subsections to fit the sections container
	 * by adding the <code>sapUxAPObjectPageSubSectionFitContainer</code> class to the subsection. This is useful in
	 * situations where the sub-section contains a control that has “100%” height, for example,
	 * <code>sap.ui.table.Table</code> with <code>visibleRowCountMode</code> set to <code>Auto</code>.
	 *
	 * As of version 1.122, applications can set transparent background to subsections
	 * by adding the <code>sapUxAPObjectPageSubSectionTransparentBackground</code> class to the subsection.
	 *
	 * <b>Note:</b> This control is intended to be used only as part of the <code>ObjectPageLayout</code>.
	 *
	 * @extends sap.uxap.ObjectPageSectionBase
	 *
	 * @constructor
	 * @public
	 * @alias sap.uxap.ObjectPageSubSection
	 * @since 1.26
	 */
	var ObjectPageSubSection = ObjectPageSectionBase.extend("sap.uxap.ObjectPageSubSection", /** @lends sap.uxap.ObjectPageSubSection.prototype */ {
		metadata: {

			library: "sap.uxap",
			properties: {
				/**
				 * Determines whether to display the <code>SubSection</code> title or not.
				 *
				 * <b>Note:</b> If a subsection is the only one (or the only one visible) within a section, its title is
				 * displayed instead of the section title even if this property is set to <code>false</code>.
				 * To hide the title of a subsection which is the only one (or the only one visible), you need to set the
				 * <code>showTitle</code> properties to <code>false</code> for both the section and its subsection.
				 * @since 1.77
				 */
				showTitle: {type: "boolean", group: "Appearance", defaultValue: true},

				_columnSpan: {type: "string", group: "Appearance", defaultValue: "all", visibility: "hidden"},

				/**
				 * A mode property that will be passed to the controls in the blocks and moreBlocks aggregations. Only relevant if these aggregations use Object page blocks.
				 */
				mode: {
					type: "sap.uxap.ObjectPageSubSectionMode",
					group: "Appearance",
					defaultValue: ObjectPageSubSectionMode.Collapsed
				},

				/**
				 * Determines whether the Subsection title is displayed in upper case.
				 */
				titleUppercase: {type: "boolean", group: "Appearance", defaultValue: false}
			},
			defaultAggregation: "blocks",
			aggregations: {

				/**
				 * Controls to be displayed in the subsection
				 *
				 * <b>Note:</b> The SAP Fiori Design guidelines require that the
				 * <code>ObjectPageHeader</code>'s content and the <code>ObjectPage</code>'s subsection content
				 * are aligned vertically. When using {@link sap.ui.layout.form.Form},
				 * {@link sap.m.Panel}, {@link sap.m.Table} and {@link sap.m.List} in the subsection
				 * content area of <code>ObjectPage</code>, if the content is not already aligned, you need to adjust their left
				 * text offset to achieve the vertical alignment.  To do this, apply the
				 * <code>sapUxAPObjectPageSubSectionAlignContent</code>
				 * CSS class to them and set their <code>width</code> property to <code>auto</code>
				 * (if not set by default).
				 *
				 * Don't use the <code>sapUxAPObjectPageSubSectionAlignContent</code> CSS class in the following cases:
				 * <ul>
				 * <li>In combination with <code>ResponsiveLayout</code>, because <code>ResponsiveLayout</code> applies custom paddings.
				 * To align items with <code>sapUxAPObjectPageSubSectionAlignContent</code>, use <code>ColumnLayout</code>.</li>
				 * <li>If there are multiple controls in the same <code>ObjectPageSubSection</code>, because the CSS class
				 * interferes with their alignment.</li>
				 * </ul>
				 * Example:
				 *
				 * <pre>
				 * <code> &lt;Form class="sapUxAPObjectPageSubSectionAlignContent" width="auto"&gt;&lt;/Form&gt; </code>
				 * </pre>
				 *
				 */
				blocks: {type: "sap.ui.core.Control", multiple: true, singularName: "block"},

				/**
				 * Additional controls to display when the Show more / See all / (...) button is pressed
				 */
				moreBlocks: {type: "sap.ui.core.Control", multiple: true, singularName: "moreBlock"},

				/**
				 * Actions available for this subsection.
				 *
				 * Although this aggregation accepts type <code>sap.ui.core.Control</code>,
				 * it is strongly recommended to use only simple controls, such as buttons, so that
				 * the layout of the app is preserved.
				 *
				 * <b>Note:</b> Keep in mind that the controls set in the <code>actions</code> aggregation
				 * of <code>ObjectPageSubSection</code> do NOT have overflow behavior. If the
				 * available space is not enough, the controls will be displayed on more lines.
				 */
				actions: {type: "sap.ui.core.Control", multiple: true, singularName: "action"},

				/**
				 * Internal <code>OverflowToolbar</code> for the <code>ObjectPageSubSection</code> actions.
				 */
				_headerToolbar: {type: "sap.m.OverflowToolbar", multiple: false, visibility: "hidden"}
			},
			designtime: "sap/uxap/designtime/ObjectPageSubSection.designtime"
		},

		renderer: ObjectPageSubSectionRenderer
	});

	// Add Title Propagation Support
	TitlePropagationSupport.call(ObjectPageSubSection.prototype, "blocks", function () {
		return this._getTitleDomId();
	});


	ObjectPageSubSection.FIT_CONTAINER_CLASS = "sapUxAPObjectPageSubSectionFitContainer";

	// SubSection's Title and Spacer
	ObjectPageSubSection.NUMBER_OF_ADDITIONAL_ACTIONS = 2;

	// determines the number of columns the subsection will span accross (inside a single row)
	ObjectPageSubSection.COLUMN_SPAN = {
		/* this is the default option
		/* the subsection spans accross the entire row */
		all: "all",

		/* The columns span is based on the content:
		the subsection takes as many columns as required
		by the count and colspan of its visible blocks.

		In addition, if there are unused empty cells
		in the neighbouring columns,
		the subsection is automatically extended
		to span accross those empty cells
		(in order to utilize the remaining unused space on the row) */
		auto: "auto"
	};

	/**
	 * Retrieves the resource bundle for the <code>sap.uxap</code> library.
	 * @static
	 * @private
	 * @returns {Object} the resource bundle object
	 */
	ObjectPageSubSection._getLibraryResourceBundle = function() {
		return Library.getResourceBundleFor("sap.uxap");
	};

	/**
	 * @private
	 */
	ObjectPageSubSection.prototype.init = function () {
		ObjectPageSectionBase.prototype.init.call(this);
		this._aStashedControls = [];
		this._aUnStashedControls = [];
		this._bUnstashed = false;
		//proxy public aggregations
		this._bRenderedFirstTime = false;
		this._aAggregationProxy = {blocks: [], moreBlocks: []};

		//dom reference
		this._$spacer = [];
		this._sContainerSelector = ".sapUxAPBlockContainer";
		this._sMoreContainerSelector = ".sapUxAPSubSectionSeeMoreContainer";

		this._oObserver = new ManagedObjectObserver(ObjectPageSubSection.prototype._observeChanges.bind(this));
		this._oBlocksObserver = new ManagedObjectObserver(this._onBlocksChange.bind(this));

		//switch logic for the default mode
		this._switchSubSectionMode(this.getMode());

		// Title Propagation Support
		this._initTitlePropagationSupport();
		this._sBorrowedTitleDomId = false;
		this._height = ""; // css height property

		this._fnActionSubstituteParentFunction = function () {
			return this;
		}.bind(this);

		this._oTitle = null;
		this._bPromoted = false;
		this._sTitleStyle = TitleLevel.H5;
		this._sTitleId = this.getId() + "-headerTitle";
		this._getTitleControl().addStyleClass("sapUxAPObjectPageSubSectionTitle");

		var oActionsToolbar = this._getHeaderToolbar();
		oActionsToolbar?.insertContent(this._getTitleControl(), 0);
		oActionsToolbar?.insertContent(new ToolbarSpacer(), 1);
	};

	/**
	 * Override the parent getter to preserve the externally visible parent-child relationship
	 * @override
	 * @returns {sap.ui.base.ManagedObject|null} The technical parent managed object or <code>null</code>
	 */
	ObjectPageSubSection.prototype.getParent = function () {
		var oParent = ObjectPageSectionBase.prototype.getParent.apply(this, arguments);
		if (oParent && oParent.isA("sap.ui.layout.Grid")) {
			oParent = oParent.getParent();
		}
		return oParent;
	};

	/**
	 * Override the parent setter to preserve the externally visible parent-child relationship
	 * @override
	 * @returns {this} Returns <code>this</code> to allow method chaining
	 */
	ObjectPageSubSection.prototype.setParent = function () {
		var oResult = ObjectPageSectionBase.prototype.setParent.apply(this, arguments),
			oPublicParent = this.getParent();
		if (oPublicParent && oPublicParent.isA("sap.uxap.ObjectPageSection")
			&& this.sParentAggregationName !== "subSections") {
				this.sParentAggregationName = "subSections";
		}
		return oResult;
	};

	ObjectPageSubSection.prototype._getTitleControl = function () {
		if (!this._oTitle) {
			this._oTitle = new Title(this._sTitleId, {
				titleStyle: this._getTitleStyle(),
				level: this._getTitleLevel()
			});
		}

		return this._oTitle;
	};

	ObjectPageSubSection.prototype._getTitleUpperCaseStyleClass = function () {
		return "sapUxAPObjectPageSubSectionTitleUppercase";
	};

	/**
	 * Returns the label id for the subsection.
	 * @private
	 * @returns {string} aria-labeled by id
	 */
	ObjectPageSubSection.prototype._getAriaLabelledById = function () {
		// Each section should be labelled as:
		// 'titleID' - if title is visible
		if (this._isPromoted()) {
			return "";
		} else {
			return this._getTitleControl().getId();
		}
	};

	/* ========== ObjectPageSubSection actions aggregation methods ========== */

	ObjectPageSubSection.prototype.addAction = function (oAction) {
		this._getHeaderToolbar()?.insertContent(oAction, ObjectPageSubSection.NUMBER_OF_ADDITIONAL_ACTIONS + this.getActions().length);
		this._preProcessAction(oAction, "actions");

		return this;
	};

	ObjectPageSubSection.prototype.insertAction = function (oAction, iIndex) {
		var iIndexToInsertAt = iIndex + ObjectPageSubSection.NUMBER_OF_ADDITIONAL_ACTIONS;
		this._getHeaderToolbar()?.insertContent(oAction, iIndexToInsertAt);
		this._preProcessAction(oAction, "actions");

		return this;
	};

	ObjectPageSubSection.prototype.removeAction = function (oAction) {
		this._getHeaderToolbar()?.removeContent(oAction);
		this._postProcessAction(oAction);

		return this.removeAggregation("actions", oAction);
	};

	ObjectPageSubSection.prototype.removeAllActions = function () {
		var oActionsToolbar = this._getHeaderToolbar(),
			oActionsToRemove = this.getActions();

		oActionsToRemove.forEach(function (oAction) {
			oActionsToolbar?.removeContent(oAction);
			this._postProcessAction(oAction);
		}, this);

		return this;
	};

	ObjectPageSubSection.prototype.destroyActions = function () {
		this._getHeaderToolbar()?.destroyContent();
		this.getActions().forEach(function (oAction) {
			this._postProcessAction(oAction);
		}, this);

		return this;
	};

	ObjectPageSubSection.prototype.getActions = function () {
		return this._getHeaderToolbar()?.getContent().slice(ObjectPageSubSection.NUMBER_OF_ADDITIONAL_ACTIONS) || [];
	};

	ObjectPageSubSection.prototype.indexOfAction = function (oAction) {
		return this.getActions().indexOf(oAction);
	};

	ObjectPageSubSection.prototype._setIsPromoted = function (bPromoted, bInvalidate) {
		if (bPromoted != this._bPromoted) {
			this._bPromoted = bPromoted;
			if (bInvalidate) {
				this.invalidate();
			}
		}

		this.toggleStyleClass("sapUxAPObjectPageSubSectionPromoted", bPromoted);
	};

	ObjectPageSubSection.prototype._isPromoted = function () {
		return this._bPromoted;
	};

	/**
	 * Lazily retrieves the internal <code>_headerToolbar</code> aggregation.
	 * @returns {sap.m.OverflowToolbar}
	 * @private
	 */
	ObjectPageSubSection.prototype._getHeaderToolbar = function () {
		var sId = this.getId() + "-_headerToolbar";

		if (!this.getAggregation("_headerToolbar") && !this.isDestroyed()) {
			this.setAggregation("_headerToolbar", new OverflowToolbar({
				id: sId,
				style: ToolbarStyle.Clear,
				design: ToolbarDesign.Transparent,
				width: "100%"
			}).addStyleClass("sapUxAPObjectPageSubSectionHeaderToolbar"), true); // suppress invalidate, as this is always called onBeforeRendering
		}

		return this.getAggregation("_headerToolbar");
	};

	/**
	 * Pre-processes a <code>ObjectPageSubSection</code> action before inserting it in the aggregation.
	 * The action would returns the <code>ObjectPageSubSection</code> as its parent, rather than its real parent (the <code>OverflowToolbar</code>).
	 * This way, it looks like the <code>ObjectPageSubSection</code> aggregates the actions.
	 * @param {sap.ui.core.Control} oAction
	 * @param {string} sParentAggregationName
	 * @private
	 */
	ObjectPageSubSection.prototype._preProcessAction = function (oAction, sParentAggregationName) {
			if (isFunction(oAction._fnOriginalGetParent)) {
				return;
			}

			this._observeAction(oAction);

			oAction._fnOriginalGetParent = oAction.getParent;
			oAction.getParent = this._fnActionSubstituteParentFunction;

			oAction._sOriginalParentAggregationName = oAction.sParentAggregationName;
			oAction.sParentAggregationName = sParentAggregationName;
	};

	/**
	 * Post-processes a <code>ObjectPageSubSection</code> action before removing it from the aggregation, so it returns its real parent (the <code>OverflowToolbar</code>),
	 * thus allowing proper processing by the framework.
	 * @param {sap.ui.core.Control} oAction
	 * @private
	 */
	ObjectPageSubSection.prototype._postProcessAction = function (oAction) {
		if (!isFunction(oAction._fnOriginalGetParent)) {
			return;
		}

		this._unobserveAction(oAction);

		// The runtime adaptation tipically removes and then adds aggregations multiple times.
		// That is why we need to make sure that the controls are in their previous state
		// when preprocessed. Otherwise the wrong parent aggregation name is passed
		oAction.getParent = oAction._fnOriginalGetParent;
		oAction._fnOriginalGetParent = null;

		oAction.sParentAggregationName = oAction._sOriginalParentAggregationName;
		oAction._sOriginalParentAggregationName = null;
	};

	function isFunction(oObject) {
		return typeof oObject === "function";
	}

	/**
	 * Determines if the <code>ObjectPageSubSection</code> title is visible.
	 * @private
	 * @returns {boolean}
	 */
	ObjectPageSubSection.prototype._isTitleVisible = function () {
		return this._getInternalTitleVisible() && this.getShowTitle() && this.getTitle().trim() !== "";
	};

	ObjectPageSubSection.prototype._getImportance = function () {
		if (!this._isPromoted()) {
			return this.getImportance();
		}
		var sParentImportance = this.getParent()?.getImportance(),
			getLowestImportance = function (sImportance1, sImportance2) {
				return fnToNumber(sImportance1) > fnToNumber(sImportance2) ? sImportance1 : sImportance2;
			},
			fnToNumber = function (sImportance) {
				return ObjectPageSectionBase._importanceMap[sImportance];
			};
		return getLowestImportance(sParentImportance, this.getImportance());
	};

	ObjectPageSubSection.prototype._getWrapTitle = function () {
		if (this._isPromoted()) { // for backward compatibility
			return this.getParent()?._getWrapTitle();
		}
		return true;
	};

	ObjectPageSubSection.prototype.getEffectiveTitleLevel = function () {
		if (this._isPromoted()) {
			return this.getParent()?._getTitleLevel();
		} else {
			return this._getTitleLevel();
		}
	};

	ObjectPageSubSection.prototype._getTitleStyle = function () {
		if (this._isPromoted()) {
			return this.getParent()?._getTitleStyle();
		}

		return ObjectPageSectionBase.prototype._getTitleStyle.call(this);
	};

	ObjectPageSubSection.prototype._updateShowHideState  = function (bHide) {
		if (this._getIsHidden() === bHide) {
			return this;
		}

		this.$().children(this._sMoreContainerSelector).toggle(!bHide);

		return ObjectPageSectionBase.prototype._updateShowHideState.call(this, bHide);
	};

	ObjectPageSubSection.prototype._shouldBeHidden = function () {
		return ObjectPageSectionBase.prototype._shouldBeHidden.call(this);
	};

	/**
	 * Getter for the private "_columnSpan" property
	 * @returns {string}
	 * @restricted
	 */
	 ObjectPageSubSection.prototype._getColumnSpan = function () {
		return this.getProperty("_columnSpan");
	};

	/**
	 * Setter for the private "_columnSpan" property
	 * @param {string} sValue
	 * @returns {object} this
	 * @restricted
	 */
	ObjectPageSubSection.prototype._setColumnSpan = function (sValue) {
		var sOldValue = this.getProperty("_columnSpan"),
			oParent;
		if (sOldValue === sValue) {
			return;
		}
		this.setProperty("_columnSpan", sValue);
		oParent = this.getParent();
		oParent && oParent.invalidate(); // let parent section re-apply its layout

		return this;
	};

	ObjectPageSubSection.prototype._getHeight = function () {
		return this._height;
	};

	ObjectPageSubSection.prototype._setHeight = function (oValue) {

		var oType, oDom;

		if (this._height === oValue) {
			return;
		}

		oType = DataType.getType("sap.ui.core.CSSSize");

		if (!oType.isValid(oValue)) {
			throw new Error("\"" + oValue + "\" is of type " + typeof oValue + ", expected " +
				oType.getName() + " for property \"_height\" of " + this);
		}
		this._height = oValue;

		oDom = this.getDomRef();
		if (oDom) {
			oDom.style.height = this._height;
			this._executeAfterNextResizeHandlerChecks(this._adaptDomHeight.bind(this));
		}
	};

	ObjectPageSubSection.prototype._executeAfterNextResizeHandlerChecks = function(fnFunction) {
		function execute() {
			window.requestAnimationFrame(fnFunction); // requestAnimationFrame required for performance, but mainly to be in sync with the table, because the table also calls requestAnimationFrame before resizing itself in its listener to the ResizeHandler
			IntervalTrigger.removeListener(execute);
		}
		// listen for the same interval that triggers the ResizeHandler
		// (ResizeHandler will be first, our callback will be second)
		IntervalTrigger.addListener(execute);
	};

	ObjectPageSubSection.prototype._toggleContentResizeListener = function(bEnable) {
		if (bEnable && !this._iResizeId) {
			this._iResizeId = ResizeHandler.register(this._getContentWrapper(), this._adaptDomHeight.bind(this));
		}
		if (!bEnable && this._iResizeId) {
			ResizeHandler.deregister(this._iResizeId);
			this._iResizeId = null;
		}
	};

	ObjectPageSubSection.prototype._getContentWrapper = function() {
		return this.getAggregation("_grid");
	};

	/**
	 * Returns Title DOM ID of the Title of this SubSection
	 * @returns {string|boolean} DOM ID
	 * @private
	 */
	ObjectPageSubSection.prototype._getTitleDomId = function () {
		if (this._sBorrowedTitleDomId) {
			return this._sBorrowedTitleDomId;
		}
		if (!this.getTitle().trim()) {
			return false;
		}

		if (this._getInternalTitleVisible()) {
			return this.getId() + "-headerTitle";
		}
		return false;
	};

	/**
	 * Sets DOM ID of the Title borrowed from this SubSection
	 * @param {string} sId the ID of the DOM Element
	 * @private
	 * @ui5-restricted sap.uxap.ObjectPageLayout
	 */
	ObjectPageSubSection.prototype._setBorrowedTitleDomId = function (sId) {
		this._sBorrowedTitleDomId = sId;
	};

	ObjectPageSubSection.prototype._expandSection = function () {
		ObjectPageSectionBase.prototype._expandSection.call(this);
		var oParent = this.getParent();
		oParent && typeof oParent._expandSection === "function" && oParent._expandSection();
		return this;
	};

	ObjectPageSubSection.prototype._updateImportance = function (oCurrentMedia) {
		var sCurrentImportanceLevel = this._getImportanceLevelToHide(oCurrentMedia);
		this._applyImportanceRules(sCurrentImportanceLevel);
	};

	ObjectPageSubSection.prototype._hasVisibleActions = function () {
		var aActions = this.getActions();

		if (aActions.length === 0) {
			return false;
		}

		return aActions.filter(function(oAction) {
			return oAction.getVisible();
		}).length > 0;
	};

	/**
	 * Called whenever the actions aggregation is mutated.
	 * @param oChanges
	 * @private
	 */
	ObjectPageSubSection.prototype._observeChanges = function (oChanges) {
		var sChangeName = oChanges.name,
			bHasTitle;

		if (sChangeName === "visible") { // change of the actions elements` visibility
			bHasTitle = this._getInternalTitleVisible() && this.getTitle().trim() !== "";
			if (!bHasTitle) {
				this.$("header").toggleClass("sapUiHidden", !this._hasVisibleActions());
			}
		}
	};

	ObjectPageSubSection.prototype._onBlocksChange = function () {
		var oObjectPageLayout = this._getObjectPageLayout();

		if (!this._bRenderedFirstTime) {
			return;
		}

		this._applyLayout(oObjectPageLayout);
	};

	/**
	 * Starts observing the <code>visible</code> property.
	 * @param {sap.ui.core.Control} oControl
	 * @private
	 */
	ObjectPageSubSection.prototype._observeAction = function(oControl) {
		this._oObserver.observe(oControl, {
			properties: ["visible"]
		});
	};

	/**
	 * Stops observing the <code>visible</code> property.
	 * @param {sap.ui.core.Control} oControl
	 * @private
	 */
	ObjectPageSubSection.prototype._unobserveAction = function(oControl) {
		this._oObserver.unobserve(oControl, {
			properties: ["visible"]
		});
	};

	["addStyleClass", "toggleStyleClass", "removeStyleClass"].forEach(function(sMethodName) {
		ObjectPageSubSection.prototype[sMethodName] = function(sStyleClass, bSuppressRerendering) {
			if (sStyleClass === ObjectPageSubSection.FIT_CONTAINER_CLASS) {
				this._notifyObjectPageLayout();
			}
			return ObjectPageSectionBase.prototype[sMethodName].apply(this, arguments);
		};
	});

	/**@deprecated */
	ObjectPageSubSection.prototype._unStashControls = function () {
		var oUnstashedControl;
		this._aStashedControls.forEach(function (oControlHandle) {
			oControlHandle.control.unstash();
			oUnstashedControl = Element.getElementById(oControlHandle.control.getId());
			this.addAggregation(oControlHandle.aggregationName, oUnstashedControl, true);
		}.bind(this));
		this._aStashedControls = [];
	};

	ObjectPageSubSection.prototype._unStashControlsAsync = function () {
		var oUnstashedControl;

		if (!this._bUnstashed) {
			this._aStashedControls.forEach(function (oControlHandle) {
				var oUnstashResult = Promise.resolve(oControlHandle.control.unstash(true));
				this._aUnStashedControls.push(
					oUnstashResult.then(function () {
						oUnstashedControl = Element.getElementById(oControlHandle.control.getId());
						this.addAggregation(oControlHandle.aggregationName, oUnstashedControl, true);
					}.bind(this))
				);
			}.bind(this));

			this._bUnstashed = true;
		}

		return Promise.all(this._aUnStashedControls).then(() => {
			this._bUnstashed = false;
			this._aUnStashedControls = [];
			this._aStashedControls = [];
		});
	};

	/**@deprecated */
	ObjectPageSubSection.prototype.connectToModels = function () {
		var aBlocks = this.getBlocks() || [],
			aMoreBlocks = this.getMoreBlocks() || [],
			sCurrentMode = this.getMode();

		this._unStashControls();

		aBlocks.forEach(function (oBlock) {
			if (oBlock instanceof BlockBase) {
				if (!oBlock.getMode()) {
					oBlock.setMode(sCurrentMode);
				}
				oBlock.connectToModels();
			}
		});

		if (aMoreBlocks.length > 0 && sCurrentMode === ObjectPageSubSectionMode.Expanded) {
			aMoreBlocks.forEach(function (oMoreBlock) {
				if (oMoreBlock instanceof BlockBase) {
					if (!oMoreBlock.getMode()) {
						oMoreBlock.setMode(sCurrentMode);
					}
					oMoreBlock.connectToModels();
				}
			});
		}
	};

	ObjectPageSubSection.prototype.connectToModelsAsync = function () {
		var aBlocks = this.getBlocks() || [],
			aMoreBlocks = this.getMoreBlocks() || [],
			sCurrentMode = this.getMode();

		return this._unStashControlsAsync().then(function() {
			aBlocks.forEach(function (oBlock) {
				if (oBlock instanceof BlockBase) {
					if (!oBlock.getMode()) {
						oBlock.setMode(sCurrentMode);
					}
					oBlock.connectToModels();
				}
			});

			if (aMoreBlocks.length > 0 && sCurrentMode === ObjectPageSubSectionMode.Expanded) {
				aMoreBlocks.forEach(function (oMoreBlock) {
					if (oMoreBlock instanceof BlockBase) {
						if (!oMoreBlock.getMode()) {
							oMoreBlock.setMode(sCurrentMode);
						}
						oMoreBlock.connectToModels();
					}
				});
			}
		});
	};

	ObjectPageSubSection.prototype._allowPropagationToLoadedViews = function (bAllow) {
		var aBlocks = this.getBlocks() || [],
			aMoreBlocks = this.getMoreBlocks() || [];

		aBlocks.forEach(function (oBlock) {
			if (oBlock instanceof BlockBase) {
				oBlock._allowPropagationToLoadedViews(bAllow);
			}
		});

		aMoreBlocks.forEach(function (oMoreBlock) {
			if (oMoreBlock instanceof BlockBase) {
				oMoreBlock._allowPropagationToLoadedViews(bAllow);
			}
		});
	};

	ObjectPageSubSection.prototype.clone = function (sIdSuffix, aLocalIds, oOptions) {
		var oClone,
			bCloneChildren = true;

		if (oOptions) {
			bCloneChildren = !!oOptions.cloneChildren;
		}

		Object.keys(this._aAggregationProxy).forEach(function (sAggregationName){
			var oAggregation = this.mAggregations[sAggregationName];

			if (!oAggregation || oAggregation.length === 0){
				this.mAggregations[sAggregationName] = this._aAggregationProxy[sAggregationName];
			}

		}, this);

		oClone = ObjectPageSectionBase.prototype.clone.apply(this, arguments);
		if (!this.isBound("actions") && bCloneChildren) {
			var oAggregation = this.getMetadata().getAggregation("actions");

			oAggregation.get(this).forEach(function(oChild) {
				oAggregation.add(oClone, oChild.clone());
			}, this);
		}

		return oClone;
	};

	ObjectPageSubSection.prototype._cleanProxiedAggregations = function () {
		var oProxiedAggregations = this._aAggregationProxy;
		Object.keys(oProxiedAggregations).forEach(function (sKey) {
			oProxiedAggregations[sKey].forEach(function (oObject) {
				oObject.destroy();
			});
		});
	};

	ObjectPageSubSection.prototype._unobserveBlocks = function() {
		var aAllBlocks = this.getBlocks().concat(this.getMoreBlocks());
		aAllBlocks.forEach(function (oBlock) {
			oBlock && this._oBlocksObserver.unobserve(oBlock, {
				properties: ["visible"]
			});
		}, this);
	};

	ObjectPageSubSection.prototype.exit = function () {
		if (this._oSeeMoreButton) {
			this._oSeeMoreButton.destroy();
			this._oSeeMoreButton = null;
		}

		if (this._oSeeLessButton) {
			this._oSeeLessButton.destroy();
			this._oSeeLessButton = null;
		}

		this._getTitleControl().destroy();

		this._unobserveBlocks();

		this._oCurrentlyVisibleSeeMoreLessButton = null;

		this._cleanProxiedAggregations();

		if (ObjectPageSectionBase.prototype.exit) {
			ObjectPageSectionBase.prototype.exit.call(this);
		}
	};

	ObjectPageSubSection.prototype.onAfterRendering = function () {
		var oObjectPageLayout = this._getObjectPageLayout(),
			oParent = this.getParent();

		if (ObjectPageSectionBase.prototype.onAfterRendering) {
			ObjectPageSectionBase.prototype.onAfterRendering.call(this);
		}

		if (!oObjectPageLayout) {
			return;
		}

		if (this.hasStyleClass(ObjectPageSubSection.FIT_CONTAINER_CLASS)) {
			this._toggleContentResizeListener(true);
		}

		this._$spacer = oObjectPageLayout.$("spacer");

		if (this._bShouldFocusSeeMoreLessButton && document.activeElement === document.body) {
			this._oCurrentlyVisibleSeeMoreLessButton.focus();
		}

		this._bShouldFocusSeeMoreLessButton = false;

		// Removes the horizontal spacing of the grid, which is needed for
		// suport of Table inside ObjectPageSubSection scenario
		if (oParent && oParent.hasStyleClass("sapUiTableOnObjectPageAdjustmentsForSection") && !this.hasStyleClass("sapUiAdjustedSectionSubsectionWithoutTable")) {
			this.getAggregation("_grid").setProperty("hSpacing", 0);
		}
	};

	ObjectPageSubSection.prototype.onBeforeRendering = function () {
		var oObjectPageLayout = this._getObjectPageLayout();

		if (!oObjectPageLayout) {
			return;
		}

		if (ObjectPageSectionBase.prototype.onBeforeRendering) {
			ObjectPageSectionBase.prototype.onBeforeRendering.call(this);
		}

		this._toggleContentResizeListener(false);

		this.setTitleVisible();

		this._setAggregationProxy();
		this._applyLayout(oObjectPageLayout);
		this.refreshSeeMoreVisibility();

		this.toggleStyleClass("sapUxAPObjectPageSubSectionStashed", this._aStashedControls.length ? true : false);
		// SubSection is focusable only if it has its OWN title visible
		this.toggleStyleClass("sapUxAPObjectPageSubSectionFocusable", this.getTitleVisible());
		this._updateImportance();
	};

	ObjectPageSubSection.prototype._adaptDomHeight = function() {
		var oDom = this.getDomRef(),
			defaultSectionHeight = this._height,
			bFitContainerClass = this.hasStyleClass(ObjectPageSubSection.FIT_CONTAINER_CLASS);

		if (!oDom) {
			return;
		}

		if (bFitContainerClass && defaultSectionHeight) {
			var contentHeight = oDom.scrollHeight,
				containerHeight = Math.ceil(parseFloat(defaultSectionHeight));

			oDom.style.height = (contentHeight > containerHeight) ? "" : defaultSectionHeight;
			this._height = oDom.style.height;
		}
	};

	ObjectPageSubSection.prototype._hasRestrictedHeight = function() {
		var oDom = this.getDomRef();
		if (!oDom) {
			return;
		}
		return parseInt(oDom.style.height) > 0;
	};

	ObjectPageSubSection.prototype._applyLayout = function (oLayoutProvider) {
		var aVisibleBlocks,
			sCurrentMode = this.getMode(),
			sLayout = oLayoutProvider.getSubSectionLayout(),
			oLayoutConfig = this._calculateLayoutConfiguration(sLayout, oLayoutProvider),
			aBlocks = this.getBlocks(),
			aAllBlocks = aBlocks.concat(this.getMoreBlocks());

		this._oLayoutConfig = oLayoutConfig;
		this._resetLayoutData(aAllBlocks);

		//also add the more blocks defined for being visible in expanded mode only
		if (sCurrentMode === ObjectPageSubSectionMode.Expanded) {
			aVisibleBlocks = aAllBlocks;
		} else {
			aVisibleBlocks = aBlocks;
		}

		this._assignLayoutData(aVisibleBlocks, oLayoutConfig);

		try {
			aVisibleBlocks.forEach(function (oBlock) {
				this._setBlockMode(oBlock, sCurrentMode);
			}, this);
		} catch (sError) {
			Log.error("ObjectPageSubSection :: error while building layout " + sLayout + ": " + sError);
		}

		return this;
	};

	ObjectPageSubSection.prototype._calculateLayoutConfiguration = function (sLayout, oLayoutProvider) {
		var oLayoutConfig = {M: 2, L: 3, XL: 4},
			iLargeScreenColumns = oLayoutConfig.L,
			iExtraLargeScreenColumns = oLayoutConfig.XL,
			bTitleOnTheLeft = (sLayout === ObjectPageSubSectionLayout.TitleOnLeft),
			bUseTwoColumnsOnLargeScreen = oLayoutProvider.getUseTwoColumnsForLargeScreen();

		if (bTitleOnTheLeft) {
			iLargeScreenColumns -= 1;
			iExtraLargeScreenColumns -= 1;
		}

		if (bUseTwoColumnsOnLargeScreen) {
			iLargeScreenColumns -= 1;
		}

		oLayoutConfig.L = iLargeScreenColumns;
		oLayoutConfig.XL = iExtraLargeScreenColumns;

		return oLayoutConfig;
	};

	ObjectPageSubSection.prototype.refreshSeeMoreVisibility = function () {
		var oSeeMoreControl = this._getSeeMoreButton(),
			oSeeLessControl = this._getSeeLessButton();

		this._bBlockHasMore = !!this.getMoreBlocks().length;
		if (!this._bBlockHasMore) {
			this._bBlockHasMore = this.getBlocks().some(function (oBlock) {
				//check if the block ask for the global see more the rule is
				//by default we don't display the see more
				//if one control is visible and ask for it then we display it
				if (oBlock instanceof BlockBase && oBlock.getVisible() && oBlock.getShowSubSectionMore()) {
					return true;
				}
			});
		}

		this.toggleStyleClass("sapUxAPObjectPageSubSectionWithSeeMore", this._bBlockHasMore);

		oSeeMoreControl.toggleStyleClass("sapUxAPSubSectionSeeMoreButtonVisible", this._bBlockHasMore);
		oSeeLessControl.toggleStyleClass("sapUxAPSubSectionSeeMoreButtonVisible", this._bBlockHasMore);

		return this._bBlockHasMore;
	};

	ObjectPageSubSection.prototype.setMode = function (sMode) {
		if (this.getMode() !== sMode) {
			this._switchSubSectionMode(sMode);

			if (this._bRenderedFirstTime) {
				this.invalidate();
			}
		}
		return this;
	};

	/*******************************************************************************
	 * Keyboard navigation
	 ******************************************************************************/
	/**
	 * Handler for key down - handle
	 * @param oEvent - The event object
	 */

	ObjectPageSubSection.prototype.onkeydown = function (oEvent) {
		// Prevent browser scrolling in case of SPACE key
		if (oEvent.keyCode === KeyCodes.SPACE && oEvent.srcControl.isA("sap.uxap.ObjectPageSubSection")) {
			oEvent.preventDefault();
		}

		// Filter F7 key down
		if (oEvent.keyCode === KeyCodes.F7) {
			oEvent.stopPropagation();
			var oTarget = Element.getElementById(oEvent.target.id);

			//define if F7 is pressed from SubSection itself or active element inside SubSection
			if (oTarget instanceof ObjectPageSubSection) {
				this._handleSubSectionF7();
			} else if (!oEvent.isMarked()) {
				this._handleInteractiveElF7();
				this._oLastFocusedControlF7 = oTarget;
			}
		}
	};

	// It's used when F7 key is pressed and the focus is on interactive element
	ObjectPageSubSection.prototype._handleInteractiveElF7 = function () {
		//If there are more sub sections focus current subsection otherwise focus the parent section
		if (this.getParent().getSubSections().length > 1) {
			this.$().trigger("focus");
		} else {
			this.getParent().$().trigger("focus");
		}
	};

	//It's used when F7 key is pressed and the focus is on SubSection
	ObjectPageSubSection.prototype._handleSubSectionF7 = function (oEvent) {
		if (this._oLastFocusedControlF7) {
			this._oLastFocusedControlF7.$().trigger("focus");
		} else {
			this.$().firstFocusableDomRef().focus();
		}
	};

	/*************************************************************************************
	 * generic block layout calculation
	 ************************************************************************************/
	/**
	 * Returns the minimum required count of columns that the subsection should span accross.
	 * The number is derived from the value of the <code>_columnSpan</code> property
	 * and the content of the subSection
	 * @returns {number} the number
	 */
	ObjectPageSubSection.prototype._getMinRequiredColspan = function () {
		var sColumnSpan = this._getColumnSpan(),
			aAllBlocks,
			aVisibleBlocks,
			iColumnSpan;

		if (sColumnSpan === ObjectPageSubSection.COLUMN_SPAN.auto) {
			aAllBlocks = this.getBlocks().concat(this.getMoreBlocks());
			aVisibleBlocks = aAllBlocks.filter(function (oBlock) {
				return oBlock.getVisible && oBlock.getVisible();
			});
			return aVisibleBlocks.reduce(function(iSum, oBlock) {
				return iSum + this._getMinRequiredColspanForChild(oBlock);
			}.bind(this), 0);
		}

		iColumnSpan = parseInt(sColumnSpan);
		if (iColumnSpan > 0 && iColumnSpan <= 4) {
			return iColumnSpan;
		}

		// default case: ObjectPageSubSection.COLUMN_SPAN.all
		return 4;
	};

	/**
	 * Determines the minimal required number of columns that a child item
	 * should take, based on the child content and own colspan
	 * @override
	 */
	ObjectPageSubSection.prototype._getMinRequiredColspanForChild = function (oBlock) {
		var iLayoutCols = 1;

		if (!oBlock) {
			iLayoutCols = 0;
		} else if (oBlock instanceof BlockBase && oBlock.getColumnLayout() != "auto") {
			iLayoutCols = parseInt(oBlock.getColumnLayout());
		}

		return iLayoutCols;
	};

	/**
	 * Determines if allowed to automatically extend the number of columns to span accross
	 * (in case of unused columns on the side, in order to utilize that unused space
	 * @override
	 */
	ObjectPageSubSection.prototype._allowAutoextendColspanForChild = function (oBlock) {
		return this._hasAutoLayout(oBlock);
	};

	ObjectPageSubSection.prototype._hasAutoLayout = function (oBlock) {
		return !(oBlock instanceof BlockBase) || oBlock.getColumnLayout() == "auto";
	};

	/*************************************************************************************
	 *  blocks & moreBlocks aggregation proxy
	 *  getter and setters works with _aAggregationProxy instead of the blocks aggregation
	 ************************************************************************************/

	ObjectPageSubSection.prototype._setAggregationProxy = function () {
		var aAggregation;
		if (this._bRenderedFirstTime) {
			return;
		}

		//empty real aggregations and feed internal ones at first rendering only
		jQuery.each(this._aAggregationProxy, jQuery.proxy(function (sAggregationName, aValue) {
			aAggregation = this.removeAllAggregation(sAggregationName, true);
			aAggregation.forEach(function(oBlock) {
				this._onAddBlock(oBlock, sAggregationName, true); // this is always called onBeforeRendering so suppress invalidate
			}, this);
			this._setAggregation(sAggregationName, aAggregation, true);
		}, this));

		this._bRenderedFirstTime = true;
	};

	ObjectPageSubSection.prototype.hasProxy = function (sAggregationName) {
		return this._bRenderedFirstTime && this._aAggregationProxy.hasOwnProperty(sAggregationName);
	};

	ObjectPageSubSection.prototype._getAggregation = function (sAggregationName) {
		return this._aAggregationProxy[sAggregationName];
	};

	ObjectPageSubSection.prototype._setAggregation = function (sAggregationName, aValue, bSuppressInvalidate) {
		this._aAggregationProxy[sAggregationName] = aValue;
		if (bSuppressInvalidate !== true){
			this._notifyObjectPageLayout();
			this.invalidate();
		}
		return this._aAggregationProxy[sAggregationName];
	};

	ObjectPageSubSection.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		var aAggregation;

		if (oObject instanceof ObjectPageLazyLoader) {
			if (oObject.isStashed()) {
				this._aStashedControls.push({
					aggregationName: sAggregationName,
					control: oObject
				});
			} else {
				oObject.getContent().forEach(function (oControl) {
					this.addAggregation(sAggregationName, oControl, true);
				}, this);

				oObject.removeAllContent();
				oObject.destroy();
				this.invalidate();
			}

		} else if (this.hasProxy(sAggregationName)) {
			aAggregation = this._getAggregation(sAggregationName);
			aAggregation.push(oObject);
			if (oObject instanceof BlockBase) {
				oObject.setParent(this, sAggregationName); //let the block know of its parent subsection
			}
			this._onAddBlock(oObject, sAggregationName, bSuppressInvalidate);
			this._setAggregation(sAggregationName, aAggregation, bSuppressInvalidate);

		} else {
			ObjectPageSectionBase.prototype.addAggregation.apply(this, arguments);
		}

		return this;
	};

	/**
	* Adds an <code>sap.uxap.BlockBase</code> instance to the <code>blocks</code> aggregation.
	*
	* <b>Note:</b> The <code>insertBlock</code> method is not supported by design.
	* If used, it works as an <code>addBlock</code>,
	* adding a single block to the end of the <code>blocks</code> aggregation.
	* @param {sap.uxap.BlockBase} oObject The <code>sap.uxap.BlockBase</code> instance
	* @param {int} iIndex The insertion index
	* @returns {this} The <code>sap.uxap.ObjectPageSubSection</code> instance
	* @public
	*/
	ObjectPageSubSection.prototype.insertBlock = function (oObject, iIndex) {
		Log.warning("ObjectPageSubSection :: usage of insertBlock is not supported - addBlock is performed instead.");
		return this.addAggregation("blocks", oObject);
	};

	ObjectPageSubSection.prototype._onAddBlock = function (oBlock, sAggregationName, bSuppressInvalidate) {
		if (!oBlock) {
			return;
		}
		this._oBlocksObserver.observe(oBlock, {
			properties: ["visible"]
		});
		if (this._shouldForwardAggregationToGrid(sAggregationName)) {
			this._addBlockToGrid(oBlock, bSuppressInvalidate);
		}
	};

	ObjectPageSubSection.prototype._shouldForwardAggregationToGrid = function (sAggregationName) {
		return ((sAggregationName === "blocks")
			|| (sAggregationName === "moreBlocks" && this.getMode() === ObjectPageSubSectionMode.Expanded));
	};

	ObjectPageSubSection.prototype._addBlockToGrid = function (oBlock, bSuppressInvalidate) {
		var oGrid = this._getGrid();
		if (oGrid?.indexOfContent(oBlock) < 0) { // add only if not already added (to preserve the ordering of the blocks)
			oGrid?.addAggregation("content", oBlock, bSuppressInvalidate);
		}
	};

	ObjectPageSubSection.prototype._onRemoveBlock = function (oBlock, bSuppressInvalidate) {
		if (!oBlock) {
			return;
		}
		this._oBlocksObserver.unobserve(oBlock, {
			properties: ["visible"]
		});
		this._removeBlockFromGrid(oBlock, bSuppressInvalidate);
	};

	ObjectPageSubSection.prototype._removeBlockFromGrid = function (oBlock, bSuppressInvalidate) {
		var oGrid = this._getGrid();
		if (oGrid?.indexOfContent(oBlock) > -1) {
			oGrid?.removeAggregation("content", oBlock, bSuppressInvalidate);
		}
	};

	/**
	 * Adds an <code>sap.uxap.BlockBase</code> instance to the <code>moreBlocks</code> aggregation.
	 *
	 * <b>Note:</b> The <code>insertMoreBlock</code> method is not supported by design.
	 * If used, it works as an <code>addMoreBlock</code>,
	 * adding a single block to the end of the <code>moreBlocks</code> aggregation.
	 * @param {sap.uxap.BlockBase} oObject The <code>sap.uxap.BlockBase</code> instance
	 * @param {int} iIndex The insertion index
	 * @returns {this} The <code>sap.uxap.ObjectPageSubSection</code> instance
	 * @public
	 */
	ObjectPageSubSection.prototype.insertMoreBlock = function (oObject, iIndex) {
		Log.warning("ObjectPageSubSection :: usage of insertMoreBlock is not supported - addMoreBlock is performed instead.");
		return this.addAggregation("moreBlocks", oObject);
	};

	ObjectPageSubSection.prototype.removeAllAggregation = function (sAggregationName, bSuppressInvalidate) {
		var aInternalAggregation;

		if (this.hasProxy(sAggregationName)) {
			aInternalAggregation = this._getAggregation(sAggregationName);
			this._setAggregation(sAggregationName, [], bSuppressInvalidate);
			aInternalAggregation.forEach(function(oBlock) {
				this._onRemoveBlock(oBlock);
			}.bind(this));
			return aInternalAggregation.slice();
		}

		return ObjectPageSectionBase.prototype.removeAllAggregation.apply(this, arguments);
	};

	ObjectPageSubSection.prototype.removeAggregation = function (sAggregationName, vObject) {
		var bRemoved = false,
			aInternalAggregation;

		if (this.hasProxy(sAggregationName) && typeof vObject === "object") {
			aInternalAggregation = this._getAggregation(sAggregationName);
				aInternalAggregation.forEach(function (oObjectCandidate, iIndex) {
					if (oObjectCandidate.getId() === vObject.getId()) {
						aInternalAggregation.splice(iIndex, 1);
						this._onRemoveBlock(vObject);
						this._setAggregation(sAggregationName, aInternalAggregation);
						bRemoved = true;
					}
					return !bRemoved;
				}, this);

			return (bRemoved ? vObject : null);
		}

		return ObjectPageSectionBase.prototype.removeAggregation.apply(this, arguments);
	};

	ObjectPageSubSection.prototype.indexOfAggregation = function (sAggregationName, oObject) {
		var iIndexFound = -1;

		if (this.hasProxy(sAggregationName)) {
			this._getAggregation(sAggregationName).some(function (oObjectCandidate, iIndex) {
				if (oObjectCandidate.getId() === oObject.getId()) {
					iIndexFound = iIndex;
					return true;
				}
			}, this);

			return iIndexFound;
		}

		return ObjectPageSectionBase.prototype.indexOfAggregation.apply(this, arguments);
	};

	ObjectPageSubSection.prototype.getAggregation = function (sAggregationName) {
		if (this.hasProxy(sAggregationName)) {
			return this._getAggregation(sAggregationName);
		}

		return ObjectPageSectionBase.prototype.getAggregation.apply(this, arguments);
	};

	ObjectPageSubSection.prototype.destroyAggregation = function (sAggregationName) {
		if (this.hasProxy(sAggregationName)) {
			this._getAggregation(sAggregationName).forEach(function (object) {
				object.destroy();
			});

			this._setAggregation(sAggregationName, []);

			return this;
		}

		return ObjectPageSectionBase.prototype.destroyAggregation.apply(this, arguments);
	};

	ObjectPageSubSection.prototype.destroy = function() {
		// destroy all stashed controls which have not been unstashed
		this._aStashedControls.forEach(function(oControlHandle) {
			oControlHandle.control.destroy();
		});
		ObjectPageSectionBase.prototype.destroy.apply(this, arguments);
	};

	/*************************************************************************************
	 *  Private section : should overridden with care
	 ************************************************************************************/

	/**
	 * Builds the control that is used internally for the see more / see less button
	 * @private
	 */
	ObjectPageSubSection.prototype._getSeeMoreButton = function () {
		if (!this._oSeeMoreButton) {
			this._oSeeMoreButton = new Button(this.getId() + "--seeMore", {
				type: ButtonType.Transparent,
				iconFirst: false,
				text: ObjectPageSubSection._getLibraryResourceBundle().getText("SHOW_MORE")
			}).addStyleClass("sapUxAPSubSectionSeeMoreButton").attachPress(this._seeMoreLessControlPressHandler, this);
		}

		return this._oSeeMoreButton;
	};

	/**
	 * Builds the control that is used internally for the see more / see less button
	 * @private
	 */
	ObjectPageSubSection.prototype._getSeeLessButton = function () {
		if (!this._oSeeLessButton) {
			this._oSeeLessButton = new Button(this.getId() + "--seeLess", {
				type: ButtonType.Transparent,
				iconFirst: false,
				text: ObjectPageSubSection._getLibraryResourceBundle().getText("SHOW_LESS")
			}).addStyleClass("sapUxAPSubSectionSeeMoreButton").attachPress(this._seeMoreLessControlPressHandler, this);
		}

		return this._oSeeLessButton;
	};

	/**
	 * called when a user clicks on the see more or see all button
	 * @param oEvent
	 * @private
	 */
	ObjectPageSubSection.prototype._seeMoreLessControlPressHandler = function (oEvent) {
		var sCurrentMode = this.getMode(),
			sTargetMode,
			aMoreBlocks = this.getMoreBlocks() || [];

		//we just switch the layoutMode for the underlying blocks
		if (sCurrentMode === ObjectPageSubSectionMode.Expanded) {
			sTargetMode = ObjectPageSubSectionMode.Collapsed;
		} else {/* we are in Collapsed */
			sTargetMode = ObjectPageSubSectionMode.Expanded;

			aMoreBlocks.forEach(function (oBlock) {
				if (oBlock instanceof BlockBase) {
					oBlock.setMode(sCurrentMode);
					oBlock.connectToModels();
				}
			}, this);
		}
		this._switchSubSectionMode(sTargetMode);

		this._bShouldFocusSeeMoreLessButton = true;
	};

	/**
	 * switch the state for the subsection
	 * @param {sap.uxap.ObjectPageSubSectionMode} sSwitchToMode
	 * @private
	 */
	ObjectPageSubSection.prototype._switchSubSectionMode = function (sSwitchToMode) {
		sSwitchToMode = this.validateProperty("mode", sSwitchToMode);

		if (sSwitchToMode === ObjectPageSubSectionMode.Collapsed) {
			this.setProperty("mode", ObjectPageSubSectionMode.Collapsed);
			this._oCurrentlyVisibleSeeMoreLessButton = this._getSeeMoreButton().setVisible(true);
			this._getSeeLessButton().setVisible(false);
			this.getMoreBlocks().forEach(function(oBlock) {
				this._removeBlockFromGrid(oBlock);
			}, this);
		} else {
			this.setProperty("mode", ObjectPageSubSectionMode.Expanded);
			this._getSeeMoreButton().setVisible(false);
			this._oCurrentlyVisibleSeeMoreLessButton = this._getSeeLessButton().setVisible(true);
			this.getMoreBlocks().forEach(function(oBlock) {
				this._addBlockToGrid(oBlock);
			}, this);
		}
	};

	/**
	 * set the mode on a control if there is such mode property
	 * @param oBlock
	 * @param {string} sMode
	 * @private
	 */
	ObjectPageSubSection.prototype._setBlockMode = function (oBlock, sMode) {
		if (oBlock instanceof BlockBase) {
			oBlock.setMode(sMode);
		} else {
			Log.debug("ObjectPageSubSection :: cannot propagate mode " + sMode + " to " + oBlock.getMetadata().getName());
		}
	};

	ObjectPageSubSection.prototype._setToFocusable = function (bFocusable) {
		// SubSection is focusable only if it has its OWN title visible
		if (this.getTitleVisible()) {
			this.$().attr("tabindex", bFocusable ? "0" : "-1");
		} else {
			this.$().removeAttr("tabindex");
		}
		return this;
	};

	ObjectPageSubSection.prototype._getUseTitleOnTheLeft = function () {
		var oObjectPageLayout = this._getObjectPageLayout();

		return oObjectPageLayout && (oObjectPageLayout.getSubSectionLayout() === ObjectPageSubSectionLayout.TitleOnLeft);
	};

	ObjectPageSubSection.prototype.getVisibleBlocksCount = function () {
		var iVisibleBlocks = this._aStashedControls.length;

		(this.getBlocks() || []).forEach(function (oBlock) {
			// Skip if it's undefined
			if (!oBlock) {
				return;
			}

			if (oBlock.getVisible && !oBlock.getVisible()) {
				return true;
			}

			iVisibleBlocks++;
		});

		(this.getMoreBlocks() || []).forEach(function (oMoreBlock) {
			if (oMoreBlock.getVisible && !oMoreBlock.getVisible()) {
				return true;
			}

			iVisibleBlocks++;
		});

		return iVisibleBlocks;
	};

	return ObjectPageSubSection;
});