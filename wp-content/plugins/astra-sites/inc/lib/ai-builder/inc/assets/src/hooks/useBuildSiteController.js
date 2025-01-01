import { useReducer, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { useNavigateSteps } from '../router';
import { STORE_KEY } from '../store';
import apiFetch from '@wordpress/api-fetch';
import toast from 'react-hot-toast';
import { toastBody } from '../helpers';

const useBuildSiteController = () => {
	const { nextStep } = useNavigateSteps();
	const {
		setWebsiteInfoAIStep,
		setLimitExceedModal,
		setApiErrorModal,
		updateImportAiSiteData,
	} = useDispatch( STORE_KEY );
	const {
		siteFeatures,
		stepsData: {
			businessName,
			selectedImages = [],
			keywords = [],
			businessType,
			businessDetails,
			businessContact,
			selectedTemplate,
			siteLanguage,
			selectedTemplateIsPremium,
			templateList,
		},
		siteFeaturesData,
	} = useSelect( ( select ) => {
		const { getSiteFeaturesData, getSiteFeatures, getAIStepData } =
			select( STORE_KEY );
		return {
			siteFeatures: getSiteFeatures(),
			stepsData: getAIStepData(),
			siteFeaturesData: getSiteFeaturesData(),
		};
	}, [] );

	const [ isInProgress, setIsInProgress ] = useState( false );
	const [ preBuildModal, setPreBuildModal ] = useState( {
		open: false,
		skipFeature: false,
	} );
	const [ premiumModal, setPremiumModal ] = useState( false );
	const [ prevErrorAlert, setPrevErrorAlert ] = useReducer(
			( state, action ) => ( {
				...state,
				...action,
			} ),
			{ open: false, error: {}, requestData: {} }
		),
		setPrevErrorAlertOpen = ( value ) =>
			setPrevErrorAlert( { open: value } );
	const selectedTemplateData = templateList?.find(
			( item ) => item?.uuid === selectedTemplate
		),
		isEcommarceSite = selectedTemplateData?.features?.ecommerce === 'yes';

	const handleClosePreBuildModal = ( value = false ) => {
		setPreBuildModal( ( prev ) => {
			return {
				...prev,
				open: value,
			};
		} );
	};

	const handleClickStartBuilding =
		( skipFeature = false ) =>
		() => {
			if ( isInProgress ) {
				return;
			}

			if (
				aiBuilderVars?.zip_plans?.active_plan?.slug === 'free' &&
				selectedTemplateIsPremium
			) {
				setPremiumModal( true );
				return;
			}

			if ( 'yes' !== aiBuilderVars.firstImportStatus ) {
				handleGenerateContent( skipFeature )();
				return;
			}

			setPreBuildModal( {
				open: true,
				skipFeature,
			} );
		};
	const limitExceeded = () => {
		const zipPlans = aiBuilderVars?.zip_plans;
		const sitesRemaining = zipPlans?.plan_data?.remaining;
		const aiSitesRemainingCount = sitesRemaining?.ai_sites_count;

		if (
			typeof aiSitesRemainingCount === 'number' &&
			aiSitesRemainingCount <= 0
		) {
			return true;
		}

		return false;
	};

	const createSite = async ( {
		template,
		email,
		description,
		name,
		phone,
		address,
		category,
		imageKeyword,
		socialProfiles,
		language,
		images,
		features,
		featuresData,
	} ) =>
		await apiFetch( {
			path: 'zipwp/v1/site',
			method: 'POST',
			data: {
				template,
				business_email: email,
				business_description: description,
				business_name: name,
				business_phone: phone,
				business_address: address,
				business_category: category,
				image_keyword: imageKeyword,
				social_profiles: socialProfiles,
				language,
				images,
				site_features: features,
				site_features_data: features?.includes( 'ecommerce' )
					? featuresData
					: {},
			},
		} );

	const previousErrors = async () => {
		try {
			const response = await apiFetch( {
				path: 'zipwp/v1/import-error-log',
				method: 'GET',
			} );
			if ( response.success ) {
				const errorData = response.data.data;
				if ( errorData && Object.values( errorData ).length > 0 ) {
					return errorData;
				}
			} else {
				throw new Error( response?.data?.data );
			}

			return {};
		} catch ( error ) {
			toast.error( toastBody( error ) );
		}
	};

	const handleCreateSiteResponse = async ( requestData ) => {
		if ( isInProgress ) {
			return;
		}
		// Start the process.
		setIsInProgress( true );

		const response = await createSite( requestData );

		if ( response.success ) {
			const websiteData = response.data.data.site;
			// Close the onboarding screen on success.
			setWebsiteInfoAIStep( websiteData );
			updateImportAiSiteData( {
				templateId: websiteData.uuid,
				importErrorMessages: {},
				importErrorResponse: [],
				importError: false,
			} );
			nextStep();
		} else {
			const error = response?.data?.data?.errors,
				statusCode = response?.data?.http_status_code,
				message = response?.data?.data?.message,
				code = response?.data?.data?.code;

			if ( 422 === statusCode || 403 === statusCode ) {
				if ( error ) {
					setApiErrorModal( {
						open: true,
						message,
						error,
					} );
				} else if (
					'site_creation_limit_exceeded' === code ||
					message.includes( 'limit' )
				) {
					// Handle site limit exceed error.
					setLimitExceedModal( {
						open: true,
					} );
				} else {
					setApiErrorModal( {
						open: true,
						error,
					} );
				}
			} else {
				setApiErrorModal( {
					open: true,
					error,
				} );
			}

			setIsInProgress( false );
		}
	};

	const handleGenerateContent =
		( skip = false ) =>
		async () => {
			if ( isInProgress ) {
				return;
			}

			if ( limitExceeded() ) {
				setLimitExceedModal( {
					open: true,
				} );
				return;
			}

			const enabledFeatures = skip
				? []
				: siteFeatures
						.filter( ( feature ) => feature.enabled )
						.map( ( feature ) => feature.id );

			// Add ecommerce feature if selected template is ecommerce.
			if ( isEcommarceSite ) {
				enabledFeatures.push( 'ecommerce' );
			}

			const requestData = {
				template: selectedTemplate,
				email: businessContact?.email,
				description: businessDetails,
				name: businessName,
				phone: businessContact?.phone,
				address: businessContact?.address,
				category: businessType,
				imageKeyword: keywords,
				socialProfiles: businessContact?.socialMedia,
				language: siteLanguage,
				images: selectedImages,
				features: enabledFeatures,
				featuresData: siteFeaturesData,
			};
			const previousError = await previousErrors();
			if ( previousError && Object.values( previousError ).length > 0 ) {
				setPrevErrorAlert( {
					open: true,
					error:
						previousError?.data?.error.primaryText +
						' ' +
						previousError?.data?.error.errorText,
					requestData,
				} );
				return;
			}

			await handleCreateSiteResponse( requestData );
		};

	const onConfirmErrorAlert = async () => {
		setPrevErrorAlert( { open: false, error: {}, requestData: {} } );
		await handleCreateSiteResponse( prevErrorAlert.requestData );
	};

	return {
		preBuildModal,
		handleClosePreBuildModal,
		handleGenerateContent,
		premiumModal,
		setPremiumModal,
		prevErrorAlert,
		setPrevErrorAlertOpen,
		onConfirmErrorAlert,
		handleClickStartBuilding,
		isInProgress,
	};
};

export default useBuildSiteController;
