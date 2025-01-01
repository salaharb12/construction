import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Tooltip } from '@brainstormforce/starter-templates-components';
import Tooltip from '../components/tooltip/tooltip';
import { __ } from '@wordpress/i18n';
import { useStateValue } from '../store/store';
import ICONS from '../../icons';
import Logo from '../components/logo';
import { getStepIndex, storeCurrentState } from '../utils/functions';
import { STEPS } from './util';
const { adminUrl } = starterTemplates;
const $ = jQuery;

const pageBuilders = [ 'gutenberg', 'elementor', 'beaver-builder' ];

const Steps = () => {
	const [ stateValue, dispatch ] = useStateValue();
	const {
		builder,
		searchTerms,
		searchTermsWithCount,
		currentIndex,
		currentCustomizeIndex,
		templateResponse,
		designStep,
		importError,
	} = stateValue;
	const [ settingHistory, setSettinghistory ] = useState( true );
	const [ settingIndex, setSettingIndex ] = useState( true );
	const current = STEPS[ currentIndex ];
	const history = useNavigate();

	useEffect( () => {
		$( document ).on( 'heartbeat-send', sendHeartbeat );
		$( document ).on( 'heartbeat-tick', heartbeatDone );
	}, [ searchTerms, searchTermsWithCount ] );

	const heartbeatDone = ( event, data ) => {
		// Check for our data, and use it.
		if ( ! data[ 'ast-sites-search-terms' ] ) {
			return;
		}
		dispatch( {
			type: 'set',
			searchTerms: [],
			searchTermsWithCount: [],
		} );
	};

	const sendHeartbeat = ( event, data ) => {
		// Add additional data to Heartbeat data.
		if ( searchTerms.length > 0 ) {
			data[ 'ast-sites-search-terms' ] = searchTermsWithCount;
			data[ 'ast-sites-builder' ] = builder;
		}
	};

	useEffect( () => {
		const previousIndex = parseInt( currentIndex ) - 1;
		const nextIndex = parseInt( currentIndex ) + 1;

		if ( nextIndex > 0 && nextIndex < STEPS.length ) {
			document.body.classList.remove( STEPS[ nextIndex ].class );
		}

		if ( previousIndex > 0 ) {
			document.body.classList.remove( STEPS[ previousIndex ].class );
		}

		document.body.classList.add( STEPS[ currentIndex ].class );
	} );

	useEffect( () => {
		if ( importError ) {
			document.body.classList.add( 'st-error' );
		} else {
			document.body.classList.remove( 'st-error' );
		}
	}, [ importError ] );

	useEffect( () => {
		const currentUrlParams = new URLSearchParams( window.location.search );
		const storedStateValue = JSON.parse(
			localStorage.getItem( 'starter-templates-onboarding' )
		);
		const urlIndex = parseInt( currentUrlParams.get( 'ci' ) ) || 0;
		const designIndex =
			parseInt( currentUrlParams.get( 'designStep' ) ) || 0;
		const searchTerm = currentUrlParams.get( 's' ) || '';

		if ( urlIndex !== 0 ) {
			const stateValueUpdates = {};
			for ( const key in storedStateValue ) {
				if ( key === 'currentIndex' || key === 'siteSearchTerm' ) {
					continue;
				}

				if ( key === 'builder' ) {
					continue;
				}
				stateValueUpdates[ key ] = storedStateValue[ `${ key }` ];
			}

			dispatch( {
				type: 'set',
				currentIndex: urlIndex,
				designStep: designIndex,
				siteSearchTerm: searchTerm,
				...stateValueUpdates,
			} );
		} else {
			localStorage.removeItem( 'starter-templates-onboarding' );
		}

		setSettinghistory( false );
	}, [ history ] );

	useEffect( () => {
		const currentUrlParams = new URLSearchParams( window.location.search );
		const urlIndex = parseInt( currentUrlParams.get( 'ci' ) ) || 0;
		const builderValue = currentUrlParams.get( 'builder' ) || '';

		if ( currentIndex === getStepIndex( 'page-builder' ) ) {
			currentUrlParams.delete( 'ci' );
			currentUrlParams.delete( 'ai' );
			currentUrlParams.delete( 'builder' );
			if ( builderValue && pageBuilders.includes( builderValue ) ) {
				dispatch( {
					type: 'set',
					builder: builderValue,
					currentIndex: 2,
				} );
			}
			history(
				window.location.pathname + '?' + currentUrlParams.toString()
			);
		}

		if (
			( currentIndex !== getStepIndex( 'page-builder' ) &&
				urlIndex !== currentIndex ) ||
			templateResponse !== null
		) {
			storeCurrentState( stateValue );
			currentUrlParams.set( 'ci', currentIndex );
			history(
				window.location.pathname + '?' + currentUrlParams.toString()
			);
		}

		// Execute only for the last Customization step.
		if (
			designStep !== 0 &&
			urlIndex === STEPS.length - 1 &&
			templateResponse !== null
		) {
			storeCurrentState( stateValue );
			currentUrlParams.set( 'designStep', designStep );
			history(
				window.location.pathname + '?' + currentUrlParams.toString()
			);
		}

		if ( currentIndex === getStepIndex( 'site-list' ) ) {
			dispatch( {
				type: 'set',
				activePalette: {},
				activePaletteSlug: 'default',
				typography: {},
				typographyIndex: 0,
			} );
		}

		setSettingIndex( false );
	}, [ currentIndex, templateResponse, designStep ] );

	window.onpopstate = () => {
		if (
			!! designStep &&
			designStep !== 1 &&
			currentIndex !== getStepIndex( 'site-list' )
		) {
			if ( currentIndex >= getStepIndex( 'survey' ) ) {
				dispatch( {
					type: 'set',
					currentIndex: currentIndex - 1,
				} );
			} else {
				dispatch( {
					type: 'set',
					designStep: designStep - 1,
					currentCustomizeIndex: currentCustomizeIndex - 1,
					currentIndex,
				} );
			}
		}
		if ( currentIndex > getStepIndex( 'site-list' ) && designStep === 1 ) {
			dispatch( {
				type: 'set',
				currentIndex: currentIndex - 1,
			} );
		}
	};

	return (
		<div className={ `st-step ${ current.class }` }>
			{ ! [ getStepIndex( 'customizer' ) ].includes( currentIndex ) && (
				<div className="step-header">
					{ current.header ? (
						current.header
					) : (
						<div className="row">
							<div className="col">
								<Logo />
							</div>
							<div className="right-col">
								<div className="col exit-link">
									<a href={ adminUrl }>
										<Tooltip
											content={ __(
												'Exit to Dashboard',
												'astra-sites'
											) }
										>
											{ ICONS.remove }
										</Tooltip>
									</a>
								</div>
							</div>
						</div>
					) }

					<canvas
						id="ist-bashcanvas"
						width={ window.innerWidth }
						height={ window.innerHeight }
					/>
				</div>
			) }
			{ settingHistory === false && settingIndex === false && current
				? current.content
				: null }
		</div>
	);
};

export default Steps;
