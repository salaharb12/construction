import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import toast from 'react-hot-toast';
import { toastBody } from '../../helpers';

const { themeStatus } = aiBuilderVars;

export const getDemo = async ( id, storedState ) => {
	const [ { currentIndex }, dispatch ] = storedState;

	const generateData = new FormData();
	generateData.append( 'action', 'astra-sites-api_request' );
	generateData.append( 'url', 'astra-sites/' + id );
	generateData.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: generateData,
	} )
		.then( ( response ) => response.json() )
		.then( ( response ) => {
			if ( response.success ) {
				aiBuilderVars.previewUrl =
					'https:' + response.data[ 'astra-site-url' ];
				dispatch( {
					templateId: id,
					templateResponse: response.data,
					importErrorMessages: {},
					importErrorResponse: [],
					importError: false,
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
									aiBuilderVars.server_import_primary_error,
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
									aiBuilderVars.server_import_primary_error,
								secondaryText: '',
								errorCode: code,
								errorText: response.data.message,
								solutionText:
									aiBuilderVars.ajax_request_failed_secondary,
								tryAgain: true,
							};
							break;

						case 'WP_Error':
							errorMessages = {
								primaryText:
									aiBuilderVars.client_import_primary_error,
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
									aiBuilderVars.cloudflare_import_primary_error,
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
									'ai-builder'
								),
								secondaryText: '',
								errorCode: '',
								errorText: response.data,
								solutionText:
									aiBuilderVars.ajax_request_failed_secondary,
								tryAgain: false,
							};
							break;
					}
					dispatch( {
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
				importError: true,
				importErrorMessages: {
					primaryText: __(
						'Fetching related demo failed.',
						'ai-builder'
					),
					secondaryText: aiBuilderVars?.ajax_request_failed_secondary,
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
	dispatch,
	websiteInfo
) => {
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
			templateId: selectedTemplate,
			templateResponse: aiResponse.data?.data,
			importErrorMessages: {},
			importErrorResponse: [],
			importError: false,
		} );
		return { success: true, data: aiResponse.data?.data };
	}
	dispatch( {
		importError: true,
		importErrorMessages: {
			primaryText: __( 'Fetching related demo failed.', 'ai-builder' ),
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

export const checkRequiredPlugins = async ( dispatch ) => {
	const reqPlugins = new FormData();
	reqPlugins.append( 'action', 'astra-sites-required_plugins' );
	reqPlugins.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

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
					requiredPlugins: response.data,
					notInstalledList: notInstalledPlugin,
					notActivatedList: notActivePlugins,
				} );
			} else {
				dispatch( {
					importError: true,
					importErrorMessages: {
						primaryText: __(
							'Required plugins could not be verified.',
							'ai-builder'
						),
						tryAgain: true,
						errorText: response?.data?.error,
					},
				} );
			}
		} );
};

export const activateAstra = ( dispatch ) => {
	const data = new FormData();
	data.append( 'action', 'astra-sites-activate_theme' );
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	fetch( ajaxurl, {
		method: 'post',
		body: data,
	} )
		.then( ( response ) => response.json() )
		.then( ( response ) => {
			if ( response.success ) {
				dispatch( {
					themeStatus: response,
					importStatus: __( 'Astra Theme Installed.', 'ai-builder' ),
				} );
			} else {
				dispatch( {
					importError: true,
					importErrorMessages: {
						primaryText: __(
							'Astra theme activation failed.',
							'ai-builder'
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

export const installAstra = ( importPercent, dispatch ) => {
	const themeSlug = 'astra';
	let percentage = importPercent;
	if ( 'not-installed' === themeStatus ) {
		percentage += 5;
		dispatch( {
			importPercent: percentage,
			importStatus: __( 'Installing Astra Theme…', 'ai-builder' ),
		} );
		if (
			wp.updates.shouldRequestFilesystemCredentials &&
			! wp.updates.ajaxLocked
		) {
			wp.updates.requestFilesystemCredentials();
		}

		wp.updates
			.installTheme( {
				slug: themeSlug,
				ajax_nonce: aiBuilderVars._ajax_nonce,
			} )
			.catch( ( error ) => {
				console.log( error );
				dispatch( {
					importError: true,
					importErrorMessages: {
						primaryText:
							error?.errorMessage ??
							__( 'Theme installation failed.', 'ai-builder' ),
						tryAgain: true,
					},
				} );
			} );

		jQuery( document ).on( 'wp-theme-install-success', function () {
			dispatch( {
				importStatus: __( 'Astra Theme Installed.', 'ai-builder' ),
			} );
			activateAstra( dispatch );
		} );
	}

	if ( 'installed-but-inactive' === themeStatus ) {
		// WordPress adds "Activate" button after waiting for 1000ms. So we will run our activation after that.
		setTimeout( () => activateAstra( dispatch ), 3000 );
	}

	if ( 'installed-and-active' === themeStatus ) {
		dispatch( {
			themeStatus: true,
		} );
	}
};

export const showErrorToast = ( title = '', error = {} ) => {
	toast.error(
		toastBody( { title, message: JSON.stringify( error, null, 4 ) } )
	);
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
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} ).catch( ( e ) =>
		showErrorToast( __( 'Failed to save Site Logo', 'ai-builder' ), e )
	);
};

export const setColorPalettes = async ( palette ) => {
	if ( ! palette ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-colors' );
	data.append( 'palette', palette );
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} ).catch( ( e ) =>
		showErrorToast( __( 'Failed to save Color Palletes', 'ai-builder' ), e )
	);
};

export const setSiteTitle = async ( businessName, showSiteTitle ) => {
	if ( ! businessName ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-title' );
	data.append( 'business-name', businessName );
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );
	data.append( 'show-site-title', showSiteTitle );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} ).catch( ( e ) =>
		showErrorToast( __( 'Failed to save Color Palletes', 'ai-builder' ), e )
	);
};

export const saveTypography = async ( selectedValue ) => {
	const data = new FormData();
	data.append( 'action', 'astra-sites-set_site_data' );
	data.append( 'param', 'site-typography' );
	data.append( 'typography', JSON.stringify( selectedValue ) );
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} ).catch( ( e ) =>
		showErrorToast( __( 'Failed to save Typography', 'ai-builder' ), e )
	);
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

export const checkFileSystemPermissions = async ( dispatch ) => {
	const formData = new FormData();
	formData.append( 'action', 'astra-sites-filesystem_permission' );
	formData.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );
	const data = await fetch( aiBuilderVars.ajax_url, {
		method: 'POST',
		body: formData,
	} )
		.then( ( res ) => res.json )
		.catch( ( e ) =>
			showErrorToast(
				__( 'Failed to check File Permissions', 'ai-builder' ),
				e
			)
		);
	dispatch( {
		fileSystemPermissions: data.data,
	} );
};

export const setSiteLanguage = async ( siteLanguage = 'en_US' ) => {
	if ( ! siteLanguage ) {
		return;
	}

	const data = new FormData();
	data.append( 'action', 'astra-sites-site_language' );
	data.append( 'language', siteLanguage );
	data.append( '_ajax_nonce', aiBuilderVars._ajax_nonce );

	await fetch( ajaxurl, {
		method: 'post',
		body: data,
	} ).catch( ( e ) =>
		showErrorToast( __( 'Failed to save Site Language', 'ai-builder' ), e )
	);
};
