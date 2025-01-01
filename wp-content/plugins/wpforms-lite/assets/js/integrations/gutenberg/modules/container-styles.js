/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.border_color
 * @param strings.border_style
 * @param strings.border_width
 * @param strings.container_styles
 * @param strings.shadow_size
 */

/**
 * Gutenberg editor block.
 *
 * Container styles panel module.
 *
 * @since 1.8.8
 */
export default ( ( $ ) => {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { PanelColorSettings } = wp.blockEditor || wp.editor;
	const { SelectControl, PanelBody, Flex, FlexBlock, __experimentalUnitControl } = wp.components;
	const { useState } = wp.element;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { strings, defaults, isPro, isLicenseActive } = wpforms_gutenberg_form_selector;

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Start the engine.
		 *
		 * @since 1.8.8
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.8
		 */
		ready() {
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.8
		 */
		events() {
		},

		/**
		 * Get block attributes.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Block attributes.
		 */
		getBlockAttributes() {
			return {
				containerPadding: {
					type: 'string',
					default: defaults.containerPadding,
				},
				containerBorderStyle: {
					type: 'string',
					default: defaults.containerBorderStyle,
				},
				containerBorderWidth: {
					type: 'string',
					default: defaults.containerBorderWidth,
				},
				containerBorderColor: {
					type: 'string',
					default: defaults.containerBorderColor,
				},
				containerBorderRadius: {
					type: 'string',
					default: defaults.containerBorderRadius,
				},
				containerShadowSize: {
					type: 'string',
					default: defaults.containerShadowSize,
				},
			};
		},

		/**
		 * Get Container Styles panel JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props              Block properties.
		 * @param {Object} handlers           Block handlers.
		 * @param {Object} formSelectorCommon Common form selector functions.
		 *
		 * @return {Object} Field styles JSX code.
		 */
		getContainerStyles( props, handlers, formSelectorCommon ) { // eslint-disable-line max-lines-per-function, complexity
			const [ isNotDisabled, _setIsNotDisabled ] = useState( isPro && isLicenseActive ); // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars
			const [ isProEnabled, _setIsProEnabled ] = useState( isPro ); // eslint-disable-line react-hooks/rules-of-hooks, no-unused-vars

			let cssClass = formSelectorCommon.getPanelClass( props );

			if ( ! isNotDisabled ) {
				cssClass += ' wpforms-gutenberg-panel-disabled';
			}

			return (
				<PanelBody className={ cssClass } title={ strings.container_styles }>
					<div // eslint-disable-line jsx-a11y/no-static-element-interactions
						className="wpforms-gutenberg-form-selector-panel-body"
						onClick={ ( event ) => {
							if ( isNotDisabled ) {
								return;
							}

							event.stopPropagation();

							if ( ! isProEnabled ) {
								return formSelectorCommon.education.showProModal( 'container', strings.container_styles );
							}

							formSelectorCommon.education.showLicenseModal( 'container', strings.container_styles, 'container-styles' );
						} }
						onKeyDown={ ( event ) => {
							if ( isNotDisabled ) {
								return;
							}

							event.stopPropagation();

							if ( ! isProEnabled ) {
								return formSelectorCommon.education.showProModal( 'container', strings.container_styles );
							}

							formSelectorCommon.education.showLicenseModal( 'container', strings.container_styles, 'container-styles' );
						} }
					>
						<Flex gap={ 4 } align="flex-start" className="wpforms-gutenberg-form-selector-flex" justify="space-between">
							<FlexBlock>
								<__experimentalUnitControl
									label={ strings.padding }
									tabIndex={ isNotDisabled ? 0 : -1 }
									value={ props.attributes.containerPadding }
									min={ 0 }
									isUnitSelectTabbable={ isNotDisabled }
									onChange={ ( value ) => handlers.styleAttrChange( 'containerPadding', value ) }
								/>
							</FlexBlock>
							<FlexBlock>
								<SelectControl
									label={ strings.border_style }
									tabIndex={ isNotDisabled ? 0 : -1 }
									value={ props.attributes.containerBorderStyle }
									options={ [
										{ label: strings.none, value: 'none' },
										{ label: strings.solid, value: 'solid' },
										{ label: strings.dotted, value: 'dotted' },
										{ label: strings.dashed, value: 'dashed' },
										{ label: strings.double, value: 'double' },
									] }
									onChange={ ( value ) => handlers.styleAttrChange( 'containerBorderStyle', value ) }
								/>
							</FlexBlock>
						</Flex>
						<Flex gap={ 4 } align="flex-start" className="wpforms-gutenberg-form-selector-flex" justify="space-between">
							<FlexBlock>
								<__experimentalUnitControl
									label={ strings.border_width }
									tabIndex={ isNotDisabled ? 0 : -1 }
									value={ props.attributes.containerBorderStyle === 'none' ? '' : props.attributes.containerBorderWidth }
									min={ 0 }
									disabled={ props.attributes.containerBorderStyle === 'none' }
									isUnitSelectTabbable={ isNotDisabled }
									onChange={ ( value ) => handlers.styleAttrChange( 'containerBorderWidth', value ) }
								/>
							</FlexBlock>
							<FlexBlock>
								<__experimentalUnitControl
									label={ strings.border_radius }
									tabIndex={ isNotDisabled ? 0 : -1 }
									value={ props.attributes.containerBorderRadius }
									min={ 0 }
									isUnitSelectTabbable={ isNotDisabled }
									onChange={ ( value ) => handlers.styleAttrChange( 'containerBorderRadius', value ) }
								/>
							</FlexBlock>
						</Flex>
						<Flex gap={ 4 } align="flex-start" className="wpforms-gutenberg-form-selector-flex" justify="space-between">
							<FlexBlock>
								<SelectControl
									label={ strings.shadow_size }
									tabIndex={ isNotDisabled ? 0 : -1 }
									value={ props.attributes.containerShadowSize }
									options={ [
										{ label: strings.none, value: 'none' },
										{ label: strings.small, value: 'small' },
										{ label: strings.medium, value: 'medium' },
										{ label: strings.large, value: 'large' },
									] }
									onChange={ ( value ) => handlers.styleAttrChange( 'containerShadowSize', value ) }
								/>
							</FlexBlock>
						</Flex>
						<Flex gap={ 4 } align="flex-start" className="wpforms-gutenberg-form-selector-flex" justify="space-between">
							<FlexBlock>
								<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
								<PanelColorSettings
									__experimentalIsRenderedInSidebar
									enableAlpha
									showTitle={ false }
									tabIndex={ isNotDisabled ? 0 : -1 }
									className={ props.attributes.containerBorderStyle === 'none' ? 'wpforms-gutenberg-form-selector-color-panel wpforms-gutenberg-form-selector-color-panel-disabled' : 'wpforms-gutenberg-form-selector-color-panel' }
									colorSettings={ [
										{
											value: props.attributes.containerBorderColor,
											onChange: ( value ) => {
												if ( ! isNotDisabled ) {
													return;
												}
												handlers.styleAttrChange( 'containerBorderColor', value );
											},
											label: strings.border_color,
										},
									] }
								/>
							</FlexBlock>
						</Flex>
					</div>
				</PanelBody>
			);
		},
	};

	return app;
} )( jQuery );
