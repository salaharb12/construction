/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.border_radius
 * @param strings.border_size
 * @param strings.button_color_notice
 * @param strings.button_styles
 * @param strings.dashed
 * @param strings.solid
 */

/**
 * Gutenberg editor block.
 *
 * Button styles panel module.
 *
 * @since 1.8.8
 */
export default ( ( function() {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { PanelColorSettings } = wp.blockEditor || wp.editor;
	const { SelectControl, PanelBody, Flex, FlexBlock, __experimentalUnitControl } = wp.components;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { strings, defaults } = wpforms_gutenberg_form_selector;

	// noinspection UnnecessaryLocalVariableJS
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
				buttonSize: {
					type: 'string',
					default: defaults.buttonSize,
				},
				buttonBorderStyle: {
					type: 'string',
					default: defaults.buttonBorderStyle,
				},
				buttonBorderSize: {
					type: 'string',
					default: defaults.buttonBorderSize,
				},
				buttonBorderRadius: {
					type: 'string',
					default: defaults.buttonBorderRadius,
				},
				buttonBackgroundColor: {
					type: 'string',
					default: defaults.buttonBackgroundColor,
				},
				buttonTextColor: {
					type: 'string',
					default: defaults.buttonTextColor,
				},
				buttonBorderColor: {
					type: 'string',
					default: defaults.buttonBorderColor,
				},
			};
		},

		/**
		 * Get Button styles JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props              Block properties.
		 * @param {Object} handlers           Block event handlers.
		 * @param {Object} sizeOptions        Size selector options.
		 * @param {Object} formSelectorCommon Form selector common object.
		 *
		 * @return {Object}  Button styles JSX code.
		 */
		getButtonStyles( props, handlers, sizeOptions, formSelectorCommon ) { // eslint-disable-line max-lines-per-function
			return (
				<PanelBody className={ formSelectorCommon.getPanelClass( props ) } title={ strings.button_styles }>
					<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
						<FlexBlock>
							<SelectControl
								label={ strings.size }
								value={ props.attributes.buttonSize }
								options={ sizeOptions }
								onChange={ ( value ) => handlers.styleAttrChange( 'buttonSize', value ) }
							/>
						</FlexBlock>
						<FlexBlock>
							<SelectControl
								label={ strings.border }
								value={ props.attributes.buttonBorderStyle }
								options={
									[
										{ label: strings.none, value: 'none' },
										{ label: strings.solid, value: 'solid' },
										{ label: strings.dashed, value: 'dashed' },
										{ label: strings.dotted, value: 'dotted' },
									]
								}
								onChange={ ( value ) => handlers.styleAttrChange( 'buttonBorderStyle', value ) }
							/>
						</FlexBlock>
					</Flex>
					<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
						<FlexBlock>
							<__experimentalUnitControl
								label={ strings.border_size }
								value={ props.attributes.buttonBorderStyle === 'none' ? '' : props.attributes.buttonBorderSize }
								min={ 0 }
								disabled={ props.attributes.buttonBorderStyle === 'none' }
								onChange={ ( value ) => handlers.styleAttrChange( 'buttonBorderSize', value ) }
								isUnitSelectTabbable
							/>
						</FlexBlock>
						<FlexBlock>
							<__experimentalUnitControl
								onChange={ ( value ) => handlers.styleAttrChange( 'buttonBorderRadius', value ) }
								label={ strings.border_radius }
								min={ 0 }
								isUnitSelectTabbable
								value={ props.attributes.buttonBorderRadius } />
						</FlexBlock>
					</Flex>

					<div className="wpforms-gutenberg-form-selector-color-picker">
						<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
						<PanelColorSettings
							__experimentalIsRenderedInSidebar
							enableAlpha
							showTitle={ false }
							className={ formSelectorCommon.getColorPanelClass( props.attributes.buttonBorderStyle ) }
							colorSettings={ [
								{
									value: props.attributes.buttonBackgroundColor,
									onChange: ( value ) => handlers.styleAttrChange( 'buttonBackgroundColor', value ),
									label: strings.background,
								},
								{
									value: props.attributes.buttonBorderColor,
									onChange: ( value ) => handlers.styleAttrChange( 'buttonBorderColor', value ),
									label: strings.border,
								},
								{
									value: props.attributes.buttonTextColor,
									onChange: ( value ) => handlers.styleAttrChange( 'buttonTextColor', value ),
									label: strings.text,
								},
							] } />
						<div className="wpforms-gutenberg-form-selector-legend wpforms-button-color-notice">
							{ strings.button_color_notice }
						</div>
					</div>
				</PanelBody>
			);
		},
	};

	return app;
} )() );
