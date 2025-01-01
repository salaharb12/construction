/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

import BackgroundPreview from './background-preview.js';

/**
 * @param strings.background_styles
 * @param strings.bottom_center
 * @param strings.bottom_left
 * @param strings.bottom_right
 * @param strings.center_center
 * @param strings.center_left
 * @param strings.center_right
 * @param strings.choose_image
 * @param strings.image_url
 * @param strings.media_library
 * @param strings.no_repeat
 * @param strings.repeat_x
 * @param strings.repeat_y
 * @param strings.select_background_image
 * @param strings.select_image
 * @param strings.stock_photo
 * @param strings.tile
 * @param strings.top_center
 * @param strings.top_left
 * @param strings.top_right
 */

/**
 * Gutenberg editor block.
 *
 * Background styles panel module.
 *
 * @since 1.8.8
 */
export default ( function() {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { PanelColorSettings } = wp.blockEditor || wp.editor;
	const { SelectControl, PanelBody, Flex, FlexBlock, __experimentalUnitControl, TextControl, Button } = wp.components;
	const { useState, useEffect } = wp.element;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { strings, defaults, isPro, isLicenseActive } = wpforms_gutenberg_form_selector;

	/**
	 * Whether the background is selected.
	 *
	 * @since 1.8.8
	 *
	 * @type {boolean}
	 */
	let backgroundSelected = false;

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Get block attributes.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Block attributes.
		 */
		getBlockAttributes() {
			return {
				backgroundImage: {
					type: 'string',
					default: defaults.backgroundImage,
				},
				backgroundPosition: {
					type: 'string',
					default: defaults.backgroundPosition,
				},
				backgroundRepeat: {
					type: 'string',
					default: defaults.backgroundRepeat,
				},
				backgroundSizeMode: {
					type: 'string',
					default: defaults.backgroundSizeMode,
				},
				backgroundSize: {
					type: 'string',
					default: defaults.backgroundSize,
				},
				backgroundWidth: {
					type: 'string',
					default: defaults.backgroundWidth,
				},
				backgroundHeight: {
					type: 'string',
					default: defaults.backgroundHeight,
				},
				backgroundColor: {
					type: 'string',
					default: defaults.backgroundColor,
				},
				backgroundUrl: {
					type: 'string',
					default: defaults.backgroundUrl,
				},
			};
		},

		/**
		 * Get Background Styles panel JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props              Block properties.
		 * @param {Object} handlers           Block handlers.
		 * @param {Object} formSelectorCommon Block properties.
		 * @param {Object} stockPhotos        Stock Photos module.
		 *
		 * @return {Object} Field styles JSX code.
		 */
		getBackgroundStyles( props, handlers, formSelectorCommon, stockPhotos ) { // eslint-disable-line max-lines-per-function, complexity
			const [ showBackgroundPreview, setShowBackgroundPreview ] = useState( app._showBackgroundPreview( props ) ); // eslint-disable-line react-hooks/rules-of-hooks
			const [ lastBgImage, setLastBgImage ] = useState( '' ); // eslint-disable-line react-hooks/rules-of-hooks
			const [ isNotDisabled, _setIsNotDisabled ] = useState( isPro && isLicenseActive ); // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars
			const [ isProEnabled, _setIsProEnabled ] = useState( isPro ); // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars

			const tabIndex = isNotDisabled ? 0 : -1;
			const cssClass = formSelectorCommon.getPanelClass( props ) + ( isNotDisabled ? '' : ' wpforms-gutenberg-panel-disabled' );

			useEffect( () => { // eslint-disable-line react-hooks/rules-of-hooks
				setShowBackgroundPreview(
					props.attributes.backgroundImage !== 'none' &&
					props.attributes.backgroundUrl &&
					props.attributes.backgroundUrl !== 'url()'
				);
			}, [ backgroundSelected, props.attributes.backgroundImage, props.attributes.backgroundUrl ] ); // eslint-disable-line react-hooks/exhaustive-deps

			return (
				<PanelBody className={ cssClass } title={ strings.background_styles }>
					<div // eslint-disable-line jsx-a11y/no-static-element-interactions
						className="wpforms-gutenberg-form-selector-panel-body"
						onClick={ ( event ) => {
							if ( isNotDisabled ) {
								return;
							}

							event.stopPropagation();

							if ( ! isProEnabled ) {
								return formSelectorCommon.education.showProModal( 'background', strings.background_styles );
							}

							formSelectorCommon.education.showLicenseModal( 'background', strings.background_styles, 'background-styles' );
						} }
						onKeyDown={ ( event ) => {
							if ( isNotDisabled ) {
								return;
							}

							event.stopPropagation();

							if ( ! isProEnabled ) {
								return formSelectorCommon.education.showProModal( 'background', strings.background_styles );
							}

							formSelectorCommon.education.showLicenseModal( 'background', strings.background_styles, 'background-styles' );
						} }
					>
						<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
							<FlexBlock>
								<SelectControl
									label={ strings.image }
									tabIndex={ tabIndex }
									value={ props.attributes.backgroundImage }
									options={ [
										{ label: strings.none, value: 'none' },
										{ label: strings.media_library, value: 'library' },
										{ label: strings.stock_photo, value: 'stock' },
									] }
									onChange={ ( value ) => app.setContainerBackgroundImageWrapper( props, handlers, value, lastBgImage, setLastBgImage ) }
								/>
							</FlexBlock>
							<FlexBlock>
								{ ( props.attributes.backgroundImage !== 'none' || ! isNotDisabled ) && (
									<SelectControl
										label={ strings.position }
										value={ props.attributes.backgroundPosition }
										tabIndex={ tabIndex }
										options={ [
											{ label: strings.top_left, value: 'top left' },
											{ label: strings.top_center, value: 'top center' },
											{ label: strings.top_right, value: 'top right' },
											{ label: strings.center_left, value: 'center left' },
											{ label: strings.center_center, value: 'center center' },
											{ label: strings.center_right, value: 'center right' },
											{ label: strings.bottom_left, value: 'bottom left' },
											{ label: strings.bottom_center, value: 'bottom center' },
											{ label: strings.bottom_right, value: 'bottom right' },
										] }
										disabled={ ( props.attributes.backgroundImage === 'none' && isNotDisabled ) }
										onChange={ ( value ) => handlers.styleAttrChange( 'backgroundPosition', value ) }
									/>
								) }
							</FlexBlock>
						</Flex>
						{ ( props.attributes.backgroundImage !== 'none' || ! isNotDisabled ) && (
							<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
								<FlexBlock>
									<SelectControl
										label={ strings.repeat }
										tabIndex={ tabIndex }
										value={ props.attributes.backgroundRepeat }
										options={ [
											{ label: strings.no_repeat, value: 'no-repeat' },
											{ label: strings.tile, value: 'repeat' },
											{ label: strings.repeat_x, value: 'repeat-x' },
											{ label: strings.repeat_y, value: 'repeat-y' },
										] }
										disabled={ ( props.attributes.backgroundImage === 'none' && isNotDisabled ) }
										onChange={ ( value ) => handlers.styleAttrChange( 'backgroundRepeat', value ) }
									/>
								</FlexBlock>
								<FlexBlock>
									<SelectControl
										label={ strings.size }
										tabIndex={ tabIndex }
										value={ props.attributes.backgroundSizeMode }
										options={ [
											{ label: strings.dimensions, value: 'dimensions' },
											{ label: strings.cover, value: 'cover' },
										] }
										disabled={ ( props.attributes.backgroundImage === 'none' && isNotDisabled ) }
										onChange={ ( value ) => app.handleSizeFromDimensions( props, handlers, value ) }
									/>
								</FlexBlock>
							</Flex>
						) }
						{ ( ( props.attributes.backgroundSizeMode === 'dimensions' && props.attributes.backgroundImage !== 'none' ) || ! isNotDisabled ) && (
							<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
								<FlexBlock>
									<__experimentalUnitControl
										label={ strings.width }
										tabIndex={ tabIndex }
										value={ props.attributes.backgroundWidth }
										isUnitSelectTabbable={ isNotDisabled }
										onChange={ ( value ) => app.handleSizeFromWidth( props, handlers, value ) }
									/>
								</FlexBlock>
								<FlexBlock>
									<__experimentalUnitControl
										label={ strings.height }
										tabIndex={ tabIndex }
										value={ props.attributes.backgroundHeight }
										isUnitSelectTabbable={ isNotDisabled }
										onChange={ ( value ) => app.handleSizeFromHeight( props, handlers, value ) }
									/>
								</FlexBlock>
							</Flex>
						) }
						{ ( ! showBackgroundPreview || props.attributes.backgroundUrl === 'url()' ) && (
							( props.attributes.backgroundImage === 'library' && (
								<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
									<FlexBlock>
										<Button
											isSecondary
											tabIndex={ tabIndex }
											className={ 'wpforms-gutenberg-form-selector-media-library-button' }
											onClick={ app.openMediaLibrary.bind( null, props, handlers, setShowBackgroundPreview ) }
										>
											{ strings.choose_image }
										</Button>
									</FlexBlock>
								</Flex>
							) ) || ( props.attributes.backgroundImage === 'stock' && (
								<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
									<FlexBlock>
										<Button
											isSecondary
											tabIndex={ tabIndex }
											className={ 'wpforms-gutenberg-form-selector-media-library-button' }
											onClick={ stockPhotos?.openModal.bind( null, props, handlers, 'bg-styles', setShowBackgroundPreview ) }
										>
											{ strings.choose_image }
										</Button>
									</FlexBlock>
								</Flex>
							) )
						) }
						{ ( ( showBackgroundPreview && props.attributes.backgroundImage !== 'none' ) || props.attributes.backgroundUrl !== 'url()' ) && (
							<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
								<FlexBlock>
									<div>
										<BackgroundPreview
											attributes={ props.attributes }
											onRemoveBackground={
												() => {
													app.onRemoveBackground( setShowBackgroundPreview, handlers, setLastBgImage );
												}
											}
											onPreviewClicked={ () => {
												if ( props.attributes.backgroundImage === 'library' ) {
													return app.openMediaLibrary( props, handlers, setShowBackgroundPreview );
												}

												return stockPhotos?.openModal( props, handlers, 'bg-styles', setShowBackgroundPreview );
											} }
										/>
									</div>
									<TextControl
										label={ strings.image_url }
										tabIndex={ tabIndex }
										value={ props.attributes.backgroundImage !== 'none' && props.attributes.backgroundUrl }
										className={ 'wpforms-gutenberg-form-selector-image-url' }
										onChange={ ( value ) => handlers.styleAttrChange( 'backgroundUrl', value ) }
										onLoad={ ( value ) => props.attributes.backgroundImage !== 'none' && handlers.styleAttrChange( 'backgroundUrl', value ) }
									/>
								</FlexBlock>
							</Flex>
						) }
						<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
							<FlexBlock>
								<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
								<PanelColorSettings
									__experimentalIsRenderedInSidebar
									enableAlpha
									showTitle={ false }
									tabIndex={ tabIndex }
									className="wpforms-gutenberg-form-selector-color-panel"
									colorSettings={ [
										{
											value: props.attributes.backgroundColor,
											onChange: ( value ) => {
												if ( ! isNotDisabled ) {
													return;
												}

												handlers.styleAttrChange( 'backgroundColor', value );
											},
											label: strings.background,
										},
									] }
								/>
							</FlexBlock>
						</Flex>
					</div>
				</PanelBody>
			);
		},

		/**
		 * Open media library modal and handle image selection.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object}   props                    Block properties.
		 * @param {Object}   handlers                 Block handlers.
		 * @param {Function} setShowBackgroundPreview Set show background preview.
		 */
		openMediaLibrary( props, handlers, setShowBackgroundPreview ) {
			const frame = wp.media( {
				title: strings.select_background_image,
				multiple: false,
				library: {
					type: 'image',
				},
				button: {
					text: strings.select_image,
				},
			} );

			frame.on( 'select', () => {
				const attachment = frame.state().get( 'selection' ).first().toJSON();
				const setAttr = {};
				const attribute = 'backgroundUrl';

				if ( attachment.url ) {
					const value = `url(${ attachment.url })`;

					setAttr[ attribute ] = value;

					props.setAttributes( setAttr );

					handlers.styleAttrChange( 'backgroundUrl', value );

					setShowBackgroundPreview( true );
				}
			} );

			frame.open();
		},

		/**
		 * Set container background image.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setContainerBackgroundImage( container, value ) {
			if ( value === 'none' ) {
				container.style.setProperty( `--wpforms-background-url`, 'url()' );
			}

			return true;
		},

		/**
		 * Set container background image.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object}   props          Block properties.
		 * @param {Object}   handlers       Block event handlers.
		 * @param {string}   value          Value.
		 * @param {string}   lastBgImage    Last background image.
		 * @param {Function} setLastBgImage Set last background image.
		 */
		setContainerBackgroundImageWrapper( props, handlers, value, lastBgImage, setLastBgImage ) {
			if ( value === 'none' ) {
				setLastBgImage( props.attributes.backgroundUrl );
				props.attributes.backgroundUrl = 'url()';

				handlers.styleAttrChange( 'backgroundUrl', 'url()' );
			} else if ( lastBgImage ) {
				props.attributes.backgroundUrl = lastBgImage;
				handlers.styleAttrChange( 'backgroundUrl', lastBgImage );
			}

			handlers.styleAttrChange( 'backgroundImage', value );
		},

		/**
		 * Set container background position.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setContainerBackgroundPosition( container, value ) {
			container.style.setProperty( `--wpforms-background-position`, value );

			return true;
		},

		/**
		 * Set container background repeat.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setContainerBackgroundRepeat( container, value ) {
			container.style.setProperty( `--wpforms-background-repeat`, value );

			return true;
		},

		/**
		 * Handle real size from dimensions.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props    Block properties.
		 * @param {Object} handlers Block handlers.
		 * @param {string} value    Value.
		 */
		handleSizeFromDimensions( props, handlers, value ) {
			if ( value === 'cover' ) {
				props.attributes.backgroundSize = 'cover';

				handlers.styleAttrChange( 'backgroundWidth', props.attributes.backgroundWidth );
				handlers.styleAttrChange( 'backgroundHeight', props.attributes.backgroundHeight );
				handlers.styleAttrChange( 'backgroundSizeMode', 'cover' );
				handlers.styleAttrChange( 'backgroundSize', 'cover' );
			} else {
				props.attributes.backgroundSize = 'dimensions';

				handlers.styleAttrChange( 'backgroundSizeMode', 'dimensions' );
				handlers.styleAttrChange( 'backgroundSize', props.attributes.backgroundWidth + ' ' + props.attributes.backgroundHeight );
			}
		},

		/**
		 * Handle real size from width.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props    Block properties.
		 * @param {Object} handlers Block handlers.
		 * @param {string} value    Value.
		 */
		handleSizeFromWidth( props, handlers, value ) {
			props.attributes.backgroundSize = value + ' ' + props.attributes.backgroundHeight;
			props.attributes.backgroundWidth = value;

			handlers.styleAttrChange( 'backgroundSize', value + ' ' + props.attributes.backgroundHeight );
			handlers.styleAttrChange( 'backgroundWidth', value );
		},

		/**
		 * Handle real size from height.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props    Block properties.
		 * @param {Object} handlers Block handlers.
		 * @param {string} value    Value.
		 */
		handleSizeFromHeight( props, handlers, value ) {
			props.attributes.backgroundSize = props.attributes.backgroundWidth + ' ' + value;
			props.attributes.backgroundHeight = value;

			handlers.styleAttrChange( 'backgroundSize', props.attributes.backgroundWidth + ' ' + value );
			handlers.styleAttrChange( 'backgroundHeight', value );
		},

		/**
		 * Set container background width.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setContainerBackgroundWidth( container, value ) {
			container.style.setProperty( `--wpforms-background-width`, value );

			return true;
		},

		/**
		 * Set container background height.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setContainerBackgroundHeight( container, value ) {
			container.style.setProperty( `--wpforms-background-height`, value );

			return true;
		},

		/**
		 * Set container background url.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setBackgroundUrl( container, value ) {
			container.style.setProperty( `--wpforms-background-url`, value );

			return true;
		},

		/**
		 * Set container background color.
		 *
		 * @since 1.8.8
		 *
		 * @param {HTMLElement} container Container element.
		 * @param {string}      value     Value.
		 *
		 * @return {boolean} True if the value was set, false otherwise.
		 */
		setBackgroundColor( container, value ) {
			container.style.setProperty( `--wpforms-background-color`, value );

			return true;
		},

		_showBackgroundPreview( props ) {
			return props.attributes.backgroundImage !== 'none' &&
				props.attributes.backgroundUrl &&
				props.attributes.backgroundUrl !== 'url()';
		},

		/**
		 * Remove background image.
		 *
		 * @since 1.8.8
		 *
		 * @param {Function} setShowBackgroundPreview Set show background preview.
		 * @param {Object}   handlers                 Block handlers.
		 * @param {Function} setLastBgImage           Set last background image.
		 */
		onRemoveBackground( setShowBackgroundPreview, handlers, setLastBgImage ) {
			setShowBackgroundPreview( false );
			handlers.styleAttrChange( 'backgroundUrl', 'url()' );
			setLastBgImage( '' );
		},

		/**
		 * Handle theme change.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 */
		onSetTheme( props ) {
			backgroundSelected = props.attributes.backgroundImage !== 'url()';
		},
	};

	return app;
}() );
