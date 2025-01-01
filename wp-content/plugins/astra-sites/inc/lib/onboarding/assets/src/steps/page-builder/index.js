import React, { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { DefaultStep, PreviousStepLink } from '../../components/index';
import { useStateValue } from '../../store/store';
import './style.scss';
const { imageDir, isBrizyEnabled, isElementorDisabled } = starterTemplates;

const PageBuilder = () => {
	const [ { currentIndex }, dispatch ] = useStateValue();

	useEffect( () => {
		const startTime = localStorage.getItem( 'st-import-start' );
		const endTime = localStorage.getItem( 'st-import-end' );

		if ( startTime || endTime ) {
			localStorage.removeItem( 'st-import-start' );
			localStorage.removeItem( 'st-import-end' );
		}
	} );

	const update = ( builder ) => {
		const content = new FormData();
		content.append( 'action', 'astra-sites-change-page-builder' );
		content.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
		content.append( 'page_builder', builder );

		fetch( ajaxurl, {
			method: 'post',
			body: content,
		} );

		dispatch( {
			type: 'set',
			builder,
			currentIndex: currentIndex + 1,
		} );
	};

	const handleKeyPress = ( e, value ) => {
		e = e || window.event;

		if ( e.keyCode === 37 ) {
			//Left Arrow
			if ( e.target.previousSibling ) {
				e.target.previousSibling.focus();
			}
		} else if ( e.keyCode === 39 ) {
			//Right Arrow
			if ( e.target.nextSibling ) {
				e.target.nextSibling.focus();
			}
		} else if ( e.key === 'Enter' ) {
			//Enter
			update( value );
		}
	};

	return (
		<DefaultStep
			content={
				<div className="page-builder-screen-wrap">
					<h1>{ __( 'Select Page Builder', 'astra-sites' ) }</h1>
					<p className="screen-description">
						{ __(
							'Please choose your preferred page builder from the list below.',
							'astra-sites'
						) }
					</p>
					<div className="page-builder-wrap ist-fadeinUp">
						<div
							className="page-builder-item d-flex-center-align"
							onClick={ () => {
								update( 'gutenberg' );
							} }
							tabIndex="0"
							onKeyDown={ ( event ) =>
								handleKeyPress( event, 'gutenberg' )
							}
						>
							<div className="elementor-image-wrap image-wrap">
								<img
									src={ `${ imageDir }block-editor.svg` }
									alt={ __( 'Block Editor', 'astra-sites' ) }
								/>
							</div>
							<h6 className="label-name">
								{ __( 'Block Editor', 'astra-sites' ) }
							</h6>
						</div>
						{ isElementorDisabled === '' && (
							<div
								className="page-builder-item d-flex-center-align"
								onClick={ () => {
									update( 'elementor' );
								} }
								tabIndex="0"
								onKeyDown={ ( event ) =>
									handleKeyPress( event, 'elementor' )
								}
							>
								<div className="elementor-image-wrap image-wrap">
									<img
										src={ `${ imageDir }elementor.svg` }
										alt={ __( 'Elementor', 'astra-sites' ) }
									/>
								</div>
								<h6 className="label-name">
									{ __( 'Elementor', 'astra-sites' ) }
								</h6>
							</div>
						) }
						<div
							className="page-builder-item d-flex-center-align"
							onClick={ () => {
								update( 'beaver-builder' );
							} }
							tabIndex="0"
							onKeyDown={ ( event ) =>
								handleKeyPress( event, 'beaver-builder' )
							}
						>
							<div className="beaver-builder-image-wrap image-wrap">
								<img
									src={ `${ imageDir }beaver-builder.svg` }
									alt={ __(
										'Beaver Builder',
										'astra-sites'
									) }
								/>
							</div>
							<h6 className="label-name">
								{ __( 'Beaver Builder', 'astra-sites' ) }
							</h6>
						</div>
						{ isBrizyEnabled === '1' && (
							<div
								className="page-builder-item d-flex-center-align"
								onClick={ () => {
									update( 'brizy' );
								} }
								tabIndex="0"
								onKeyDown={ ( event ) =>
									handleKeyPress( event, 'brizy' )
								}
							>
								<div className="brizy-image-wrap image-wrap">
									<img
										src={ `${ imageDir }brizy.svg` }
										alt={ __( 'Brizy', 'astra-sites' ) }
									/>
								</div>
								<h6 className="label-name">
									{ __( 'Brizy', 'astra-sites' ) }
								</h6>
							</div>
						) }
					</div>
					<div className="mt-10 text-zip-body-text">
						<PreviousStepLink
							customizeStep={ true }
							before
							onClick={ () => {
								dispatch( {
									type: 'set',
									currentIndex: 0,
									builder: 'ai-builder',
								} );
							} }
						>
							{ __( 'Back', 'astra-sites' ) }
						</PreviousStepLink>
					</div>
				</div>
			}
			// actions={
			// 	<>
			// 		<PreviousStepLink
			// 			customizeStep={ true }
			// 			before
			// 			onClick={ () => {
			// 				dispatch( {
			// 					type: 'set',
			// 					currentIndex: 0,
			// 					builder: 'ai-builder',
			// 				} );
			// 			} }
			// 		>
			// 			{ __( 'Back', 'astra-sites' ) }
			// 		</PreviousStepLink>
			// 	</>
			// }
		/>
	);
};

export default PageBuilder;
