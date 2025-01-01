import { __ } from '@wordpress/i18n';
const { themeStatus } = starterTemplates;
import apiFetch from '@wordpress/api-fetch';

export const getDemo = async ( id, storedState ) => {
	const [ { currentIndex }, dispatch ] = storedState;

	const generateData = new FormData();
	generateData.append( 'action', 'astra-sites-api-request' );
	generateData.append( 'url', 'astra-sites/' + id );
	generateData.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: generateData,
	} )
		.then( ( response ) => response.json() )
		.then( ( response ) => {
			if ( response.success ) {
				const isEcommerce = response?.data[ 'required-plugins' ]?.some(
					( plugin ) =>
						plugin?.slug === 'surecart' ||
						plugin?.slug === 'woocommerce'
				);
				starterTemplates.previewUrl =
					'https:' + response.data[ 'astra-site-url' ];
				dispatch( {
					type: 'set',
					templateId: id,
					templateResponse: response.data,
					importErrorMessages: {},
					importErrorResponse: [],
					importError: false,
					isEcommerce,
				} );
			} else {
				let errorMessages = {};

				if ( undefined !== response.data.response_code ) {
					const code = response.data.code.toString();
					switch ( code ) {
						case '401':
						case '404':
							errorMessages = {
								primaryText:
									astraSitesVars?.server_import_primary_error,
								secondaryText: '',
								errorCode: code,
								errorText: response.data.message,
								solutionText: '',
								tryAgain: true,
							};
							break;
						case '500':
							errorMessages = {
								primaryText:
									astraSitesVars?.server_import_primary_error,
								secondaryText: '',
								errorCode: code,
								errorText: response.data.message,
								solutionText:
									astraSitesVars?.ajax_request_failed_secondary,
								tryAgain: true,
							};
							break;

						case 'WP_Error':
							errorMessages = {
								primaryText:
									astraSitesVars?.client_import_primary_error,
								secondaryText: '',
								errorCode: code,
								errorText: response.data.message,
								solutionText: '',
								tryAgain: true,
							};
							break;

						case 'Cloudflare':
							errorMessages = {
								primaryText:
									astraSitesVars?.cloudflare_import_primary_error,
								secondaryText: '',
								errorCode: code,
								errorText: response.data.message,
								solutionText: '',
								tryAgain: true,
							};
							break;

						default:
							errorMessages = {
								primaryText: __(
									'Fetching related demo failed.',
									'astra-sites'
								),
								secondaryText: '',
								errorCode: '',
								errorText: response.data,
								solutionText:
									astraSitesVars?.ajax_request_failed_secondary,
								tryAgain: false,
							};
							break;
					}
					dispatch( {
						type: 'set',
						importError: true,
						importErrorMessages: errorMessages,
						importErrorResponse: response.data,
						templateResponse: null,
						currentIndex: currentIndex + 3,
					} );
				}
			}
		} )
		.catch( ( error ) => {
			dispatch( {
				type: 'set',
				importError: true,
				importErrorMessages: {
					primaryText: __(
						'Fetching related demo failed.',
						'astra-sites'
					),
					secondaryText:
						astraSitesVars?.ajax_request_failed_secondary,
					errorCode: '',
					errorText: error,
					solutionText: '',
					tryAgain: false,
				},
			} );
		} );
};

export const getAiDemo = async (
	{ businessName, selectedTemplate },
	storedState,
	websiteInfo
) => {
	const [ , dispatch ] = storedState;
	const { uuid } = websiteInfo;
	const aiResponse = await apiFetch( {
		path: 'zipwp/v1/ai-site',
		method: 'POST',
		data: {
			template: selectedTemplate,
			business_name: businessName,
			uuid,
		},
	} );

	if ( aiResponse.success ) {
		dispatch( {
			type: 'set',
			templateId: selectedTemplate,
			templateResponse: aiResponse.data?.data,
			importErrorMessages: {},
			importErrorResponse: [],
			importError: false,
		} );
		return { success: true, data: aiResponse.data?.data };
	}
	dispatch( {
		type: 'set',
		importError: true,
		importErrorMessages: {
			primaryText: __( 'Fetching related demo failed.', 'astra-sites' ),
			secondaryText: '',
			errorCode: '',
			errorText:
				typeof aiResponse.data === 'string'
					? aiResponse.data
					: aiResponse?.data?.data ?? '',
			solutionText: '',
			tryAgain: false,
		},
	} );
	return { success: false, data: aiResponse.data };
};

export const checkRequiredPlugins = async ( storedState ) => {
	const [ { enabledFeatureIds, selectedEcommercePlugin }, dispatch ] =
		storedState;
	const reqPlugins = new FormData();
	reqPlugins.append( 'action', 'astra-sites-required_plugins' );
	reqPlugins.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
	if ( enabledFeatureIds.length !== 0 ) {
		const featurePlugins = getFeaturePluginList(
			enabledFeatureIds,
			selectedEcommercePlugin
		);
		reqPlugins.append(
			'feature_plugins',
			JSON.stringify( featurePlugins )
		);
	}

	await fetch( ajaxurl, {
		method: 'post',
		body: reqPlugins,
	} )
		.then( ( response ) => response.json() )
		.then( ( response ) => {
			if ( response.success ) {
				const rPlugins = response.data?.required_plugins;
				const notInstalledPlugin = rPlugins.notinstalled || '';
				const notActivePlugins = rPlugins.inactive || '';
				dispatch( {
					type: 'set',
					requiredPlugins: response.data,
					notInstalledList: notInstalledPlugin,
					notActivatedList: notActivePlugins,
				} );
			}
		} );
};

function getFeaturePluginList( features, selectedEcommercePlugin ) {
	const requiredPlugins = [];

	features?.forEach( ( feature ) => {
		switch ( feature ) {
			case 'ecommerce':
				if ( selectedEcommercePlugin === 'surecart' ) {
					requiredPlugins.push( {
						name: 'SureCart',
						slug: 'surecart',
						init: 'surecart/surecart.php',
					} );
				} else if ( selectedEcommercePlugin === 'woocommerce' ) {
					requiredPlugins.push( {
						name: 'WooCommerce',
						slug: 'woocommerce',
						init: 'woocommerce/woocommerce.php',
					} );
					requiredPlugins.push( {
						name: 'Checkout Plugins Stripe Woo',
						slug: 'checkout-plugins-stripe-woo',
						init: 'checkout-plugins-stripe-woo/checkout-plugins-stripe-woo.php',
					} );
				}
				break;
			case 'donations':
				requiredPlugins.push( {
					name: 'SureCart',
					slug: 'surecart',
					init: 'surecart/surecart.php',
				} );
				break;
			case 'automation-integrations':
				requiredPlugins.push( {
					name: 'SureTriggers',
					slug: 'suretriggers',
					init: 'suretriggers/suretriggers.php',
				} );
				break;
			case 'sales-funnels':
				requiredPlugins.push( {
					name: 'CartFlows',
					slug: 'cartflows',
					init: 'cartflows/cartflows.php',
				} );
				requiredPlugins.push( {
					name: 'Woocommerce Cart Abandonment Recovery',
					slug: 'woo-cart-abandonment-recovery',
					init: 'woo-cart-abandonment-recovery/woo-cart-abandonment-recovery.php',
				} );
				break;
			case 'video-player':
				requiredPlugins.push( {
					name: 'Preso Player',
					slug: 'presto-player',
					init: 'presto-player/presto-player.php',
				} );
				break;
			case 'live-chat':
				requiredPlugins.push( {
					name: 'WP Live Chat Support',
					slug: 'wp-live-chat-support',
					init: 'wp-live-chat-support/wp-live-chat-support.php',
				} );
				break;
			default:
				break;
		}
	} );

	return requiredPlugins;
}

export const activateAstra = ( storedState ) => {
	const [ , dispatch ] = storedState;

	const data = new FormData();
	data.append( 'action', 'astra-sites-activate_theme' );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	fetch( ajaxurl, {
		method: 'post',
		body: data,
	} )
		.then( ( response ) => response.json() )
		.then( ( response ) => {
			if ( response.success ) {
				dispatch( {
					type: 'set',
					themeStatus: response,
					importStatus: __( 'Astra Theme Installed.', 'astra-sites' ),
				} );
			} else {
				dispatch( {
					type: 'set',
					importError: true,
					importErrorMessages: {
						primaryText: __(
							'Astra theme installation failed.',
							'astra-sites'
						),
						secondaryText: '',
						errorCode: '',
						errorText: response.data,
						solutionText: '',
						tryAgain: true,
					},
				} );
			}
		} )
		.catch( ( error ) => {
			/* eslint-disable-next-line no-console -- We are displaying errors in the console. */
			console.error( error );
		} );
};

export const installAstra = ( storedState ) => {
	const [ { importPercent }, dispatch ] = storedState;
	const themeSlug = 'astra';
	let percentage = importPercent;

	if ( 'not-installed' === themeStatus ) {
		if (
			wp.updates.shouldRequestFilesystemCredentials &&
			! wp.updates.ajaxLocked
		) {
			wp.updates.requestFilesystemCredentials();
		}

		percentage += 5;
		dispatch( {
			type: 'set',
			importPercent: percentage,
			importStatus: __( 'Installing Astra Theme…', 'astra-sites' ),
		} );

		wp.updates.installTheme( {
			slug: themeSlug,
			ajax_nonce: astraSitesVars?._ajax_nonce,
		} );

		// eslint-disable-next-line no-undef
		jQuery( document ).on( 'wp-theme-install-success', function () {
			dispatch( {
				type: 'set',
				importStatus: __( 'Astra Theme Installed.', 'astra-sites' ),
			} );
			activateAstra( storedState );
		} );
	}

	if ( 'installed-but-inactive' === themeStatus ) {
		// WordPress adds "Activate" button after waiting for 1000ms. So we will run our activation after that.
		setTimeout( () => activateAstra( storedState ), 3000 );
	}

	if ( 'installed-and-active' === themeStatus ) {
		dispatch( {
			type: 'set',
			themeStatus: true,
		} );
	}
};

export const setSiteLogo = async ( logo ) => {
	if ( '' === logo.id ) {
		return;
	}
	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-logo' );
	data.append( 'logo', logo.id );
	data.append( 'logo-width', logo.width );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} );
};

export const setColorPalettes = async ( palette ) => {
	if ( ! palette ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-colors' );
	data.append( 'palette', palette );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} );
};

export const setSiteTitle = async ( businessName ) => {
	if ( ! businessName ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-title' );
	data.append( 'business-name', businessName );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} );
};

export const setSiteLanguage = async ( siteLanguage = 'en_US' ) => {
	if ( ! siteLanguage ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-site-language' );
	data.append( 'language', siteLanguage );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} );
};

export const saveTypography = async ( selectedValue ) => {
	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-typography' );
	data.append( 'typography', JSON.stringify( selectedValue ) );
	data.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} );
};

export const divideIntoChunks = ( chunkSize, inputArray ) => {
	const values = Object.keys( inputArray );
	const final = [];
	let counter = 0;
	let portion = {};

	for ( const key in inputArray ) {
		if ( counter !== 0 && counter % chunkSize === 0 ) {
			final.push( portion );
			portion = {};
		}
		portion[ key ] = inputArray[ values[ counter ] ];
		counter++;
	}
	final.push( portion );

	return final;
};

export const checkFileSystemPermissions = async ( [ , dispatch ] ) => {
	try {
		const formData = new FormData();
		formData.append( 'action', 'astra-sites-filesystem_permission' );
		formData.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
		const response = await fetch( astraSitesVars?.ajaxurl, {
			method: 'POST',
			body: formData,
		} );
		const data = await response.json();

		dispatch( {
			type: 'set',
			fileSystemPermissions: data.data,
		} );
	} catch ( error ) {
		/* eslint-disable-next-line no-console -- We are displaying errors in the console. */
		console.error( error );
	}
};

export const generateAnalyticsLead = async (
	tryAgainCount,
	status,
	templateId,
	builder
) => {
	const importContent = new FormData();
	importContent.append( 'action', 'astra-sites-generate-analytics-lead' );
	importContent.append( 'status', status );
	importContent.append( 'id', templateId );
	importContent.append( 'try-again-count', tryAgainCount );
	importContent.append( 'type', 'astra-sites' );
	importContent.append( 'page-builder', builder );
	importContent.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
	await fetch( ajaxurl, {
		method: 'post',
		body: importContent,
	} );
};
