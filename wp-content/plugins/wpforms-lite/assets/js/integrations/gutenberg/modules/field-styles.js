/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.field_styles
 * @param strings.lead_forms_panel_notice_head
 * @param strings.lead_forms_panel_notice_text
 * @param strings.learn_more
 * @param strings.use_modern_notice_head
 * @param strings.use_modern_notice_link
 * @param strings.use_modern_notice_text
 */

/**
 * Gutenberg editor block.
 *
 * Field styles panel module.
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
				fieldSize: {
					type: 'string',
					default: defaults.fieldSize,
				},
				fieldBorderStyle: {
					type: 'string',
					default: defaults.fieldBorderStyle,
				},
				fieldBorderSize: {
					type: 'string',
					default: defaults.fieldBorderSize,
				},
				fieldBorderRadius: {
					type: 'string',
					default: defaults.fieldBorderRadius,
				},
				fieldBackgroundColor: {
					type: 'string',
					default: defaults.fieldBackgroundColor,
				},
				fieldBorderColor: {
					type: 'string',
					default: defaults.fieldBorderColor,
				},
				fieldTextColor: {
					type: 'string',
					default: defaults.fieldTextColor,
				},
				fieldMenuColor: {
					type: 'string',
					default: defaults.fieldMenuColor,
				},
			};
		},

		/**
		 * Get Field styles JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props              Block properties.
		 * @param {Object} handlers           Block event handlers.
		 * @param {Object} sizeOptions        Size selector options.
		 * @param {Object} formSelectorCommon Form selector common object.
		 *
		 * @return {Object}  Field styles JSX code.
		 */
		getFieldStyles( props, handlers, sizeOptions, formSelectorCommon ) { // eslint-disable-line max-lines-per-function
			return (
				<PanelBody className={ formSelectorCommon.getPanelClass( props ) } title={ strings.field_styles }>
					<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
						<FlexBlock>
							<SelectControl
								label={ strings.size }
								value={ props.attributes.fieldSize }
								options={ sizeOptions }
								onChange={ ( value ) => handlers.styleAttrChange( 'fieldSize', value ) }
							/>
						</FlexBlock>
						<FlexBlock>
							<SelectControl
								label={ strings.border }
								value={ props.attributes.fieldBorderStyle }
								options={
									[
										{ label: strings.none, value: 'none' },
										{ label: strings.solid, value: 'solid' },
										{ label: strings.dashed, value: 'dashed' },
										{ label: strings.dotted, value: 'dotted' },
									]
								}
								onChange={ ( value ) => handlers.styleAttrChange( 'fieldBorderStyle', value ) }
							/>
						</FlexBlock>
					</Flex>
					<Flex gap={ 4 } align="flex-start" className={ 'wpforms-gutenberg-form-selector-flex' } justify="space-between">
						<FlexBlock>
							<__experimentalUnitControl
								label={ strings.border_size }
								value={ props.attributes.fieldBorderStyle === 'none' ? '' : props.attributes.fieldBorderSize }
								min={ 0 }
								disabled={ props.attributes.fieldBorderStyle === 'none' }
								onChange={ ( value ) => handlers.styleAttrChange( 'fieldBorderSize', value ) }
								isUnitSelectTabbable
							/>
						</FlexBlock>
						<FlexBlock>
							<__experimentalUnitControl
								label={ strings.border_radius }
								value={ props.attributes.fieldBorderRadius }
								min={ 0 }
								isUnitSelectTabbable
								onChange={ ( value ) => handlers.styleAttrChange( 'fieldBorderRadius', value ) }
							/>
						</FlexBlock>
					</Flex>

					<div className="wpforms-gutenberg-form-selector-color-picker">
						<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
						<PanelColorSettings
							__experimentalIsRenderedInSidebar
							enableAlpha
							showTitle={ false }
							className={ formSelectorCommon.getColorPanelClass( props.attributes.fieldBorderStyle ) }
							colorSettings={ [
								{
									value: props.attributes.fieldBackgroundColor,
									onChange: ( value ) => handlers.styleAttrChange( 'fieldBackgroundColor', value ),
									label: strings.background,
								},
								{
									value: props.attributes.fieldBorderColor,
									onChange: ( value ) => handlers.styleAttrChange( 'fieldBorderColor', value ),
									label: strings.border,
								},
								{
									value: props.attributes.fieldTextColor,
									onChange: ( value ) => handlers.styleAttrChange( 'fieldTextColor', value ),
									label: strings.text,
								},
								{
									value: props.attributes.fieldMenuColor,
									onChange: ( value ) => handlers.styleAttrChange( 'fieldMenuColor', value ),
									label: strings.menu,
								},
							] }
						/>
					</div>
				</PanelBody>
			);
		},
	};

	return app;
} )() );
