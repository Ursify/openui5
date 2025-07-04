/*!
 * ${copyright}
 */
sap.ui.define([
	"./Utils",
	"../library",
	"sap/ui/core/Lib",
	"sap/m/IllustratedMessageType",
	"sap/ui/base/BindingParser"
], function (
	Utils,
	library,
	Library,
	IllustratedMessageType,
	BindingParser
) {
	"use strict";

	var CardBlockingMessageType = library.CardBlockingMessageType;
	const oResourceBundle = Library.getResourceBundleFor("sap.ui.integration");

	function formatJson(oJson) {
		return BindingParser.complexParser.escape(JSON.stringify(oJson, null, 4));
	}

	function formatRequest(oRequest) {
		if (oRequest.options) {
			oRequest.options.body = oRequest.body && oRequest.body.toString();
			oRequest.options.headers = Object.fromEntries(oRequest.options.headers);
		}

		return formatJson(oRequest);
	}

	/**
	 * Utility class for handling errors in the cards.
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @private
	 * @ui5-restricted
	 * @alias sap.ui.integration.util.ErrorHandler
	 */
	var ErrorHandler = {};

	/**
	 * @param {object} mErrorInfo Information about the ocurred request error
	 * @param {object} mErrorInfo.requestErrorParams Error parameters
	 * @param {string} mErrorInfo.requestErrorParams.message Error message
	 * @param {module:sap/base/util/SimpleResponse} [mErrorInfo.requestErrorParams.response] Response object
	 * @param {string} [mErrorInfo.requestErrorParams.responseText] Response text
	 * @param {object} [mErrorInfo.requestErrorParams.settings] Request settings
	 * @param {object} mErrorInfo.requestSettings Data provider settings
	 * @param {sap.ui.integration.widgets.Card} oCard the card
	 * @returns {sap.ui.integration.BlockingMessageSettings} Blocking message settings
	 */
	ErrorHandler.configureDataRequestErrorInfo = function (mErrorInfo, oCard) {
		var oResponse = mErrorInfo.requestErrorParams.response,
			sResponseText = mErrorInfo.requestErrorParams.responseText,
			sIllustrationType = IllustratedMessageType.UnableToLoad,
			sTitle = oResourceBundle.getText("CARD_ERROR_CONFIGURATION_TITLE"),
			sDescription = oResourceBundle.getText("CARD_ERROR_CONFIGURATION_DESCRIPTION"),
			requestSettings = mErrorInfo.requestSettings,
			sUrl = requestSettings.request ? requestSettings.request.url : "",
			sDetails = oResourceBundle.getText("CARD_ERROR_REQUEST_DETAILS", [sUrl]);

		if (oResponse) {
			sTitle = oResponse.status + " " + oResponse.statusText;
			sDescription = oResourceBundle.getText("CARD_ERROR_REQUEST_DESCRIPTION");

			switch (oResponse.status) {
				case 0:
					switch (oResponse.statusText) {
						case "timeout":
							sIllustrationType = IllustratedMessageType.UnableToLoad;
							sTitle = "408 " + oResourceBundle.getText("CARD_ERROR_REQUEST_TIMEOUT_TITLE");
							sDetails = oResourceBundle.getText("CARD_ERROR_REQUEST_TIMEOUT_DETAILS", [sUrl]);
							break;
						default:
							sIllustrationType = IllustratedMessageType.PageNotFound;
							sTitle = "404 " + oResourceBundle.getText("CARD_ERROR_REQUEST_NOTFOUND_TITLE");
							break;
					}
					break;
				case 404:
					sIllustrationType = IllustratedMessageType.PageNotFound;
					if (!oResponse.statusText) {
						sTitle = "404 " + oResourceBundle.getText("CARD_ERROR_REQUEST_NOTFOUND_TITLE");
					}
					break;
				case 408:
					sIllustrationType = IllustratedMessageType.UnableToLoad;
					sDetails = oResourceBundle.getText("CARD_ERROR_REQUEST_TIMEOUT_DETAILS", [sUrl]);
					break;
				case 401: // Unauthorized
				case 403: // Forbidden
				case 511: // Network Authentication Required
					sDescription = oResourceBundle.getText("CARD_ERROR_REQUEST_ACCESS_DENIED_DESCRIPTION");
					break;
				default:
					break;
			}
		}

		sDetails = sTitle + "\n" +
			sDescription + "\n" +
			sDetails + "\n\n";

		sDetails += oResourceBundle.getText("CARD_LOG_MSG") + "\n" +
			(oResponse ? oResponse.statusText : mErrorInfo.requestErrorParams.message) + "\n\n";

		sDetails += oResourceBundle.getText("CARD_REQUEST_SETTINGS") + "\n" +
			formatJson(requestSettings) + "\n\n";

		if (oResponse) {
			sDetails += oResourceBundle.getText("CARD_REQUEST") + "\n" +
				formatRequest(mErrorInfo.requestErrorParams.settings) + "\n\n" +
				oResourceBundle.getText("CARD_RESPONSE_HEADERS") + "\n" +
				formatJson(Object.fromEntries(oResponse.headers)) + "\n\n";
		}

		if (oResponse && sResponseText) {
			sDetails += oResourceBundle.getText("CARD_RESPONSE") + "\n";

			if (Utils.isJson(sResponseText)) {
				sDetails += formatJson(JSON.parse(sResponseText));
			} else {
				sDetails += BindingParser.complexParser.escape(sResponseText);
			}

			sDetails += "\n\n";
		}

		sDetails += oResourceBundle.getText("CARD_MANIFEST") + "\n" + formatJson(oCard._oCardManifest.getJson()) + "\n\n";

		sDetails += oResourceBundle.getText("CARD_STACK_TRACE") + "\n" + new Error().stack;

		return {
			type: CardBlockingMessageType.Error,
			illustrationType: sIllustrationType,
			title: sTitle,
			description: sDescription,
			details: sDetails,
			httpResponse: oResponse
		};
	};

	ErrorHandler.configureErrorInfo = function (mErrorInfo, oCard) {
		var sDetails = oResourceBundle.getText("CARD_MANIFEST") + "\n" + formatJson(oCard._oCardManifest.getJson()) + "\n\n" +
				oResourceBundle.getText("CARD_STACK_TRACE") + "\n" +
				(mErrorInfo.originalError ? mErrorInfo.originalError.stack : new Error().stack);

		return {
			type: CardBlockingMessageType.Error,
			illustrationType: mErrorInfo.illustrationType,
			title: mErrorInfo.title,
			description: mErrorInfo.description,
			details: sDetails
		};
	};

	return ErrorHandler;
});
