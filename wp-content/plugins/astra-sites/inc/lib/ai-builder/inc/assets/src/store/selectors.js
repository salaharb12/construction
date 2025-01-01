const selectors = {
	getOnboardingAI( state ) {
		return state;
	},

	getAllPatternsCategories( { allPatternsCategories } ) {
		return allPatternsCategories;
	},

	getDynamicContent( { dynamicContent } ) {
		return dynamicContent;
	},

	getCurrentAIStep( { currentStep } ) {
		return currentStep;
	},

	getAIStepData( { stepData } ) {
		return stepData;
	},
	getWebsiteInfo( { websiteInfo } ) {
		return websiteInfo;
	},
	getWebsiteVersionList( { websiteVersionList } ) {
		return websiteVersionList;
	},
	getSelectedWebsiteVersion( { selectedWebsiteVersion } ) {
		return selectedWebsiteVersion;
	},
	getLimitExceedModalInfo( { limitExceedModal } ) {
		return limitExceedModal;
	},
	getApiErrorModalInfo( { apiErrorModal } ) {
		return apiErrorModal;
	},
	getContinueProgressModalInfo( { continueProgressModal } ) {
		return continueProgressModal;
	},
	getPlanInfoModalInfo( { planInformationModal } ) {
		return planInformationModal;
	},
	getDisableAi( { disableAi } ) {
		return disableAi;
	},

	getDisablePreview( { disablePreview } ) {
		return disablePreview;
	},
	getRegeneratingContentCategory( { regeneratingContentCategory } ) {
		return regeneratingContentCategory;
	},

	getImportInProgress( { importInProgress } ) {
		return importInProgress;
	},

	getSpecAITogglePopup( { specAITogglePopup } ) {
		return specAITogglePopup;
	},

	getShowPagesOnboarding( { showPagesOnboarding } ) {
		return showPagesOnboarding;
	},

	getCreditsDetails( { credits } ) {
		return credits;
	},

	getSiteFeatures( { stepData: { siteFeatures } } ) {
		return siteFeatures;
	},

	getSiteFeaturesData( state ) {
		return state.stepData?.siteFeaturesData || {};
	},

	getSiteLogo( { stepData: { siteLogo } } ) {
		return siteLogo;
	},

	getSiteTitleVisible( { stepData: { siteTitleVisible } } ) {
		return siteTitleVisible;
	},

	getActiveColorPalette( { stepData: { activeColorPalette } } ) {
		return activeColorPalette;
	},

	getActiveTypography( { stepData: { activeTypography } } ) {
		return activeTypography;
	},

	getImportSiteProgressData( { importSiteProgressData } ) {
		return importSiteProgressData;
	},

	getDefaultColorPalette( { stepData: { defaultColorPalette } } ) {
		return defaultColorPalette;
	},

	getLoadingNextStep( { loadingNextStep } ) {
		return loadingNextStep;
	},

	getFailedSites( { failedSites } ) {
		return failedSites;
	},
};

export default selectors;
