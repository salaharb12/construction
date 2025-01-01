/* global jconfirm, wpforms_gutenberg_form_selector, Choices, JSX, DOM, WPFormsUtils */
/* jshint es3: false, esversion: 6 */

/**
 * @param strings.copy_paste_error
 * @param strings.error_message
 * @param strings.form_edit
 * @param strings.form_entries
 * @param strings.form_keywords
 * @param strings.form_select
 * @param strings.form_selected
 * @param strings.form_settings
 * @param strings.label_styles
 * @param strings.other_styles
 * @param strings.page_break
 * @param strings.panel_notice_head
 * @param strings.panel_notice_link
 * @param strings.panel_notice_link_text
 * @param strings.panel_notice_text
 * @param strings.show_description
 * @param strings.show_title
 * @param strings.sublabel_hints
 * @param strings.form_not_available_message
 * @param urls.entries_url
 * @param urls.form_url
 * @param window.wpforms_choicesjs_config
 * @param wpforms_education.upgrade_bonus
 * @param wpforms_gutenberg_form_selector.block_empty_url
 * @param wpforms_gutenberg_form_selector.block_preview_url
 * @param wpforms_gutenberg_form_selector.get_started_url
 * @param wpforms_gutenberg_form_selector.is_full_styling
 * @param wpforms_gutenberg_form_selector.is_modern_markup
 * @param wpforms_gutenberg_form_selector.logo_url
 * @param wpforms_gutenberg_form_selector.wpforms_guide
 */

/**
 * Gutenberg editor block.
 *
 * Common module.
 *
 * @since 1.8.8
 */
export default ( function( document, window, $ ) {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { serverSideRender: ServerSideRender = wp.components.ServerSideRender } = wp;
	const { createElement, Fragment, createInterpolateElement } = wp.element;
	const { registerBlockType } = wp.blocks;
	const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;
	const { SelectControl, ToggleControl, PanelBody, Placeholder } = wp.components;
	const { __ } = wp.i18n;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { strings, defaults, sizes, urls, isPro, isLicenseActive, isAdmin } = wpforms_gutenberg_form_selector;
	const defaultStyleSettings = defaults;

	// noinspection JSUnusedLocalSymbols
	/**
	 * WPForms Education script.
	 *
	 * @since 1.8.8
	 */
	const WPFormsEducation = window.WPFormsEducation || {}; // eslint-disable-line no-unused-vars

	/**
	 * List of forms.
	 *
	 * The default value is localized in FormSelector.php.
	 *
	 * @since 1.8.4
	 *
	 * @type {Object}
	 */
	let formList = wpforms_gutenberg_form_selector.forms;

	/**
	 * Blocks runtime data.
	 *
	 * @since 1.8.1
	 *
	 * @type {Object}
	 */
	const blocks = {};

	/**
	 * Whether it is needed to trigger server rendering.
	 *
	 * @since 1.8.1
	 *
	 * @type {boolean}
	 */
	let triggerServerRender = true;

	/**
	 * Popup container.
	 *
	 * @since 1.8.3
	 *
	 * @type {Object}
	 */
	let $popup = {};

	/**
	 * Track fetch status.
	 *
	 * @since 1.8.4
	 *
	 * @type {boolean}
	 */
	let isFetching = false;

	/**
	 * Elements holder.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Common block attributes.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	let commonAttributes = {
		clientId: {
			type: 'string',
			default: '',
		},
		formId: {
			type: 'string',
			default: defaultStyleSettings.formId,
		},
		displayTitle: {
			type: 'boolean',
			default: defaultStyleSettings.displayTitle,
		},
		displayDesc: {
			type: 'boolean',
			default: defaultStyleSettings.displayDesc,
		},
		preview: {
			type: 'boolean',
		},
		theme: {
			type: 'string',
			default: defaultStyleSettings.theme,
		},
		themeName: {
			type: 'string',
			default: defaultStyleSettings.themeName,
		},
		labelSize: {
			type: 'string',
			default: defaultStyleSettings.labelSize,
		},
		labelColor: {
			type: 'string',
			default: defaultStyleSettings.labelColor,
		},
		labelSublabelColor: {
			type: 'string',
			default: defaultStyleSettings.labelSublabelColor,
		},
		labelErrorColor: {
			type: 'string',
			default: defaultStyleSettings.labelErrorColor,
		},
		pageBreakColor: {
			type: 'string',
			default: defaultStyleSettings.pageBreakColor,
		},
		customCss: {
			type: 'string',
			default: defaultStyleSettings.customCss,
		},
		copyPasteJsonValue: {
			type: 'string',
			default: defaultStyleSettings.copyPasteJsonValue,
		},
	};

	/**
	 * Handlers for custom styles settings, defined outside this module.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	let customStylesHandlers = {};

	/**
	 * Dropdown timeout.
	 *
	 * @since 1.8.8
	 *
	 * @type {number}
	 */
	let dropdownTimeout;

	/**
	 * Whether copy-paste content was generated on edit.
	 *
	 * @since 1.9.1
	 *
	 * @type {boolean}
	 */
	let isCopyPasteGeneratedOnEdit = false;

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.1
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Panel modules.
		 *
		 * @since 1.8.8
		 *
		 * @type {Object}
		 */
		panels: {},

		/**
		 * Start the engine.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} blockOptions Block options.
		 */
		init( blockOptions ) {
			el.$window = $( window );
			app.panels = blockOptions.panels;
			app.education = blockOptions.education;

			app.initDefaults( blockOptions );
			app.registerBlock( blockOptions );

			app.initJConfirm();

			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.1
		 */
		ready() {
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.1
		 */
		events() {
			el.$window
				.on( 'wpformsFormSelectorEdit', _.debounce( app.blockEdit, 250 ) )
				.on( 'wpformsFormSelectorFormLoaded', app.formLoaded );
		},

		/**
		 * Init jConfirm.
		 *
		 * @since 1.8.8
		 */
		initJConfirm() {
			// jquery-confirm defaults.
			jconfirm.defaults = {
				closeIcon: false,
				backgroundDismiss: false,
				escapeKey: true,
				animationBounce: 1,
				useBootstrap: false,
				theme: 'modern',
				boxWidth: '400px',
				animateFromElement: false,
			};
		},

		/**
		 * Get a fresh list of forms via REST-API.
		 *
		 * @since 1.8.4
		 *
		 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-api-fetch/
		 */
		async getForms() {
			// If a fetch is already in progress, exit the function.
			if ( isFetching ) {
				return;
			}

			// Set the flag to true indicating a fetch is in progress.
			isFetching = true;

			try {
				// Fetch forms.
				formList = await wp.apiFetch( {
					path: wpforms_gutenberg_form_selector.route_namespace + 'forms/',
					method: 'GET',
					cache: 'no-cache',
				} );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( error );
			} finally {
				isFetching = false;
			}
		},

		/**
		 * Open builder popup.
		 *
		 * @since 1.6.2
		 *
		 * @param {string} clientID Block Client ID.
		 */
		openBuilderPopup( clientID ) {
			if ( $.isEmptyObject( $popup ) ) {
				const parent = $( '#wpwrap' );
				const canvasIframe = $( 'iframe[name="editor-canvas"]' );
				const isFseMode = Boolean( canvasIframe.length );
				const tmpl = isFseMode ? canvasIframe.contents().find( '#wpforms-gutenberg-popup' ) : $( '#wpforms-gutenberg-popup' );

				parent.after( tmpl );

				$popup = parent.siblings( '#wpforms-gutenberg-popup' );
			}

			const url = wpforms_gutenberg_form_selector.get_started_url,
				$iframe = $popup.find( 'iframe' );

			app.builderCloseButtonEvent( clientID );
			$iframe.attr( 'src', url );
			$popup.fadeIn();
		},

		/**
		 * Close button (inside the form builder) click event.
		 *
		 * @since 1.8.3
		 *
		 * @param {string} clientID Block Client ID.
		 */
		builderCloseButtonEvent( clientID ) {
			$popup
				.off( 'wpformsBuilderInPopupClose' )
				.on( 'wpformsBuilderInPopupClose', function( e, action, formId, formTitle ) {
					if ( action !== 'saved' || ! formId ) {
						return;
					}

					// Insert a new block when a new form is created from the popup to update the form list and attributes.
					const newBlock = wp.blocks.createBlock( 'wpforms/form-selector', {
						formId: formId.toString(), // Expects string value, make sure we insert string.
					} );

					// eslint-disable-next-line camelcase
					formList = [ { ID: formId, post_title: formTitle } ];

					// Insert a new block.
					wp.data.dispatch( 'core/block-editor' ).removeBlock( clientID );
					wp.data.dispatch( 'core/block-editor' ).insertBlocks( newBlock );
				} );
		},

		/**
		 * Register block.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} blockOptions Additional block options.
		 */
		// eslint-disable-next-line max-lines-per-function
		registerBlock( blockOptions ) {
			registerBlockType( 'wpforms/form-selector', {
				title: strings.title,
				description: strings.description,
				icon: app.getIcon(),
				keywords: strings.form_keywords,
				category: 'widgets',
				attributes: app.getBlockAttributes(),
				supports: {
					customClassName: app.hasForms(),
				},
				example: {
					attributes: {
						preview: true,
					},
				},
				edit( props ) {
					const { attributes } = props;
					const formOptions = app.getFormOptions();
					const handlers = app.getSettingsFieldsHandlers( props );

					// Store block clientId in attributes.
					if ( ! attributes.clientId || ! app.isClientIdAttrUnique( props ) ) {
						// We just want the client ID to update once.
						// The block editor doesn't have a fixed block ID, so we need to get it on the initial load, but only once.
						props.setAttributes( { clientId: props.clientId } );
					}

					// Main block settings.
					const jsx = [
						app.jsxParts.getMainSettings( attributes, handlers, formOptions ),
					];

					// Block preview picture.
					if ( ! app.hasForms() ) {
						jsx.push(
							app.jsxParts.getEmptyFormsPreview( props ),
						);

						return jsx;
					}

					const sizeOptions = app.getSizeOptions();

					// Show placeholder when form is not available (trashed, deleted etc.).
					if ( attributes && attributes.formId && app.isFormAvailable( attributes.formId ) === false ) {
						// Block placeholder (form selector).
						jsx.push(
							app.jsxParts.getBlockPlaceholder( props.attributes, handlers, formOptions ),
						);

						return jsx;
					}

					// Form style settings & block content.
					if ( attributes.formId ) {
						// Subscribe to block events.
						app.maybeSubscribeToBlockEvents( props, handlers, blockOptions );

						jsx.push(
							app.jsxParts.getStyleSettings( props, handlers, sizeOptions, blockOptions ),
							app.jsxParts.getBlockFormContent( props )
						);

						if ( ! isCopyPasteGeneratedOnEdit ) {
							handlers.updateCopyPasteContent();

							isCopyPasteGeneratedOnEdit = true;
						}

						el.$window.trigger( 'wpformsFormSelectorEdit', [ props ] );

						return jsx;
					}

					// Block preview picture.
					if ( attributes.preview ) {
						jsx.push(
							app.jsxParts.getBlockPreview(),
						);

						return jsx;
					}

					// Block placeholder (form selector).
					jsx.push(
						app.jsxParts.getBlockPlaceholder( props.attributes, handlers, formOptions ),
					);

					return jsx;
				},
				save: () => null,
			} );
		},

		/**
		 * Init default style settings.
		 *
		 * @since 1.8.1
		 * @since 1.8.8 Added blockOptions parameter.
		 *
		 * @param {Object} blockOptions Additional block options.
		 */
		initDefaults( blockOptions = {} ) {
			commonAttributes = {
				...commonAttributes,
				...blockOptions.getCommonAttributes(),
			};
			customStylesHandlers = blockOptions.setStylesHandlers;

			[ 'formId', 'copyPasteJsonValue' ].forEach( ( key ) => delete defaultStyleSettings[ key ] );
		},

		/**
		 * Check if the site has forms.
		 *
		 * @since 1.8.3
		 *
		 * @return {boolean} Whether site has at least one form.
		 */
		hasForms() {
			return formList.length > 0;
		},

		/**
		 * Check if form is available to be previewed.
		 *
		 * @since 1.8.9
		 *
		 * @param {number} formId Form ID.
		 *
		 * @return {boolean} Whether form is available.
		 */
		isFormAvailable( formId ) {
			return formList.find( ( { ID } ) => ID === Number( formId ) ) !== undefined;
		},

		/**
		 * Set triggerServerRender flag.
		 *
		 * @since 1.8.8
		 *
		 * @param {boolean} $flag The value of the triggerServerRender flag.
		 */
		setTriggerServerRender( $flag ) {
			triggerServerRender = Boolean( $flag );
		},

		/**
		 * Maybe subscribe to block events.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} subscriberProps        Subscriber block properties.
		 * @param {Object} subscriberHandlers     Subscriber block event handlers.
		 * @param {Object} subscriberBlockOptions Subscriber block options.
		 */
		maybeSubscribeToBlockEvents( subscriberProps, subscriberHandlers, subscriberBlockOptions ) {
			const id = subscriberProps.clientId;

			// Unsubscribe from block events.
			// This is needed to avoid multiple subscriptions when the block is re-rendered.
			el.$window
				.off( 'wpformsFormSelectorDeleteTheme.' + id )
				.off( 'wpformsFormSelectorUpdateTheme.' + id )
				.off( 'wpformsFormSelectorSetTheme.' + id );

			// Subscribe to block events.
			el.$window
				.on( 'wpformsFormSelectorDeleteTheme.' + id, app.subscriberDeleteTheme( subscriberProps, subscriberBlockOptions ) )
				.on( 'wpformsFormSelectorUpdateTheme.' + id, app.subscriberUpdateTheme( subscriberProps, subscriberBlockOptions ) )
				.on( 'wpformsFormSelectorSetTheme.' + id, app.subscriberSetTheme( subscriberProps, subscriberBlockOptions ) );
		},

		/**
		 * Block event `wpformsFormSelectorDeleteTheme` handler.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} subscriberProps        Subscriber block properties
		 * @param {Object} subscriberBlockOptions Subscriber block options.
		 *
		 * @return {Function} Event handler.
		 */
		subscriberDeleteTheme( subscriberProps, subscriberBlockOptions ) {
			return function( e, themeSlug, triggerProps ) {
				if ( subscriberProps.clientId === triggerProps.clientId ) {
					return;
				}

				if ( subscriberProps?.attributes?.theme !== themeSlug ) {
					return;
				}

				if ( ! subscriberBlockOptions?.panels?.themes ) {
					return;
				}

				// Reset theme to default one.
				subscriberBlockOptions.panels.themes.setBlockTheme( subscriberProps, 'default' );
			};
		},

		/**
		 * Block event `wpformsFormSelectorDeleteTheme` handler.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} subscriberProps        Subscriber block properties
		 * @param {Object} subscriberBlockOptions Subscriber block options.
		 *
		 * @return {Function} Event handler.
		 */
		subscriberUpdateTheme( subscriberProps, subscriberBlockOptions ) {
			return function( e, themeSlug, themeData, triggerProps ) {
				if ( subscriberProps.clientId === triggerProps.clientId ) {
					return;
				}

				if ( subscriberProps?.attributes?.theme !== themeSlug ) {
					return;
				}

				if ( ! subscriberBlockOptions?.panels?.themes ) {
					return;
				}

				// Reset theme to default one.
				subscriberBlockOptions.panels.themes.setBlockTheme( subscriberProps, themeSlug );
			};
		},

		/**
		 * Block event `wpformsFormSelectorSetTheme` handler.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} subscriberProps        Subscriber block properties
		 * @param {Object} subscriberBlockOptions Subscriber block options.
		 *
		 * @return {Function} Event handler.
		 */
		subscriberSetTheme( subscriberProps, subscriberBlockOptions ) {
			// noinspection JSUnusedLocalSymbols
			return function( e, block, themeSlug, triggerProps ) { // eslint-disable-line no-unused-vars
				if ( subscriberProps.clientId === triggerProps.clientId ) {
					return;
				}

				if ( ! subscriberBlockOptions?.panels?.themes ) {
					return;
				}

				// Set theme.
				subscriberBlockOptions.panels.background.onSetTheme( subscriberProps );
			};
		},

		/**
		 * Block JSX parts.
		 *
		 * @since 1.8.1
		 *
		 * @type {Object}
		 */
		jsxParts: {

			/**
			 * Get main settings JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} attributes  Block attributes.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} formOptions Form selector options.
			 *
			 * @return {JSX.Element} Main setting JSX code.
			 */
			getMainSettings( attributes, handlers, formOptions ) {
				if ( ! app.hasForms() ) {
					return app.jsxParts.printEmptyFormsNotice( attributes.clientId );
				}

				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-inspector-main-settings">
						<PanelBody className="wpforms-gutenberg-panel wpforms-gutenberg-panel-form-settings" title={ strings.form_settings }>
							<SelectControl
								label={ strings.form_selected }
								value={ attributes.formId }
								options={ formOptions }
								onChange={ ( value ) => handlers.attrChange( 'formId', value ) }
							/>
							{ attributes.formId ? (
								<p className="wpforms-gutenberg-form-selector-actions">
									<a href={ urls.form_url.replace( '{ID}', attributes.formId ) } rel="noreferrer" target="_blank">
										{ strings.form_edit }
									</a>
									{ isPro && isLicenseActive && (
										<>
											&nbsp;&nbsp;|&nbsp;&nbsp;
											<a
												href={ urls.entries_url.replace( '{ID}', attributes.formId ) }
												rel="noreferrer"
												target="_blank"
											>{ strings.form_entries }</a>
										</>
									) }
								</p>
							) : null }
							<ToggleControl
								label={ strings.show_title }
								checked={ attributes.displayTitle }
								onChange={ ( value ) => handlers.attrChange( 'displayTitle', value ) }
							/>
							<ToggleControl
								label={ strings.show_description }
								checked={ attributes.displayDesc }
								onChange={ ( value ) => handlers.attrChange( 'displayDesc', value ) }
							/>
							<p className="wpforms-gutenberg-panel-notice">
								<strong>{ strings.panel_notice_head }</strong>
								{ strings.panel_notice_text }
								<a href={ strings.panel_notice_link } rel="noreferrer" target="_blank">{ strings.panel_notice_link_text }</a>
							</p>
						</PanelBody>
					</InspectorControls>
				);
			},

			/**
			 * Print empty forms notice.
			 *
			 * @since 1.8.3
			 *
			 * @param {string} clientId Block client ID.
			 *
			 * @return {JSX.Element} Field styles JSX code.
			 */
			printEmptyFormsNotice( clientId ) {
				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-inspector-main-settings">
						<PanelBody className="wpforms-gutenberg-panel" title={ strings.form_settings }>
							<p className="wpforms-gutenberg-panel-notice wpforms-warning wpforms-empty-form-notice" style={ { display: 'block' } }>
								<strong>{ __( 'You haven’t created a form, yet!', 'wpforms-lite' ) }</strong>
								{ __( 'What are you waiting for?', 'wpforms-lite' ) }
							</p>
							<button type="button" className="get-started-button components-button is-secondary"
								onClick={
									() => {
										app.openBuilderPopup( clientId );
									}
								}
							>
								{ __( 'Get Started', 'wpforms-lite' ) }
							</button>
						</PanelBody>
					</InspectorControls>
				);
			},

			/**
			 * Get Label styles JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props       Block properties.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} sizeOptions Size selector options.
			 *
			 * @return {Object} Label styles JSX code.
			 */
			getLabelStyles( props, handlers, sizeOptions ) {
				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.label_styles }>
						<SelectControl
							label={ strings.size }
							value={ props.attributes.labelSize }
							className="wpforms-gutenberg-form-selector-fix-bottom-margin"
							options={ sizeOptions }
							onChange={ ( value ) => handlers.styleAttrChange( 'labelSize', value ) }
						/>

						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.labelColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelColor', value ),
										label: strings.label,
									},
									{
										value: props.attributes.labelSublabelColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelSublabelColor', value ),
										label: strings.sublabel_hints.replace( '&amp;', '&' ),
									},
									{
										value: props.attributes.labelErrorColor,
										onChange: ( value ) => handlers.styleAttrChange( 'labelErrorColor', value ),
										label: strings.error_message,
									},
								] }
							/>
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get Page Indicator styles JSX code.
			 *
			 * @since 1.8.7
			 *
			 * @param {Object} props    Block properties.
			 * @param {Object} handlers Block event handlers.
			 *
			 * @return {Object} Page Indicator styles JSX code.
			 */
			getPageIndicatorStyles( props, handlers ) { // eslint-disable-line complexity
				const hasPageBreak = app.hasPageBreak( formList, props.attributes.formId );
				const hasRating = app.hasRating( formList, props.attributes.formId );

				if ( ! hasPageBreak && ! hasRating ) {
					return null;
				}

				let label = '';
				if ( hasPageBreak && hasRating ) {
					label = `${ strings.page_break } / ${ strings.rating }`;
				} else if ( hasPageBreak ) {
					label = strings.page_break;
				} else if ( hasRating ) {
					label = strings.rating;
				}

				return (
					<PanelBody className={ app.getPanelClass( props ) } title={ strings.other_styles }>
						<div className="wpforms-gutenberg-form-selector-color-picker">
							<div className="wpforms-gutenberg-form-selector-control-label">{ strings.colors }</div>
							<PanelColorSettings
								__experimentalIsRenderedInSidebar
								enableAlpha
								showTitle={ false }
								className="wpforms-gutenberg-form-selector-color-panel"
								colorSettings={ [
									{
										value: props.attributes.pageBreakColor,
										onChange: ( value ) => handlers.styleAttrChange( 'pageBreakColor', value ),
										label,
									},
								] } />
						</div>
					</PanelBody>
				);
			},

			/**
			 * Get style settings JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props        Block properties.
			 * @param {Object} handlers     Block event handlers.
			 * @param {Object} sizeOptions  Size selector options.
			 * @param {Object} blockOptions Block options loaded from external modules.
			 *
			 * @return {Object} Inspector controls JSX code.
			 */
			getStyleSettings( props, handlers, sizeOptions, blockOptions ) {
				return (
					<InspectorControls key="wpforms-gutenberg-form-selector-style-settings">
						{ blockOptions.getThemesPanel( props, app, blockOptions.stockPhotos ) }
						{ blockOptions.getFieldStyles( props, handlers, sizeOptions, app ) }
						{ app.jsxParts.getLabelStyles( props, handlers, sizeOptions ) }
						{ blockOptions.getButtonStyles( props, handlers, sizeOptions, app ) }
						{ blockOptions.getContainerStyles( props, handlers, app ) }
						{ blockOptions.getBackgroundStyles( props, handlers, app, blockOptions.stockPhotos ) }
						{ app.jsxParts.getPageIndicatorStyles( props, handlers ) }
					</InspectorControls>
				);
			},

			/**
			 * Get block content JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} props Block properties.
			 *
			 * @return {JSX.Element} Block content JSX code.
			 */
			getBlockFormContent( props ) {
				if ( triggerServerRender ) {
					return (
						<ServerSideRender
							key="wpforms-gutenberg-form-selector-server-side-renderer"
							block="wpforms/form-selector"
							attributes={ props.attributes }
						/>
					);
				}

				const clientId = props.clientId;
				const block = app.getBlockContainer( props );

				// In the case of empty content, use server side renderer.
				// This happens when the block is duplicated or converted to a reusable block.
				if ( ! block?.innerHTML ) {
					triggerServerRender = true;

					return app.jsxParts.getBlockFormContent( props );
				}

				blocks[ clientId ] = blocks[ clientId ] || {};
				blocks[ clientId ].blockHTML = block.innerHTML;
				blocks[ clientId ].loadedFormId = props.attributes.formId;

				return (
					<Fragment key="wpforms-gutenberg-form-selector-fragment-form-html">
						<div dangerouslySetInnerHTML={ { __html: blocks[ clientId ].blockHTML } } />
					</Fragment>
				);
			},

			/**
			 * Get block preview JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @return {JSX.Element} Block preview JSX code.
			 */
			getBlockPreview() {
				return (
					<Fragment
						key="wpforms-gutenberg-form-selector-fragment-block-preview">
						<img src={ wpforms_gutenberg_form_selector.block_preview_url } style={ { width: '100%' } } alt="" />
					</Fragment>
				);
			},

			/**
			 * Get block empty JSX code.
			 *
			 * @since 1.8.3
			 *
			 * @param {Object} props Block properties.
			 * @return {JSX.Element} Block empty JSX code.
			 */
			getEmptyFormsPreview( props ) {
				const clientId = props.clientId;

				return (
					<Fragment
						key="wpforms-gutenberg-form-selector-fragment-block-empty">
						<div className="wpforms-no-form-preview">
							<img src={ wpforms_gutenberg_form_selector.block_empty_url } alt="" />
							<p>
								{
									createInterpolateElement(
										__(
											'You can use <b>WPForms</b> to build contact forms, surveys, payment forms, and more with just a few clicks.',
											'wpforms-lite'
										),
										{
											b: <strong />,
										}
									)
								}
							</p>
							<button type="button" className="get-started-button components-button is-primary"
								onClick={
									() => {
										app.openBuilderPopup( clientId );
									}
								}
							>
								{ __( 'Get Started', 'wpforms-lite' ) }
							</button>
							<p className="empty-desc">
								{
									createInterpolateElement(
										__(
											'Need some help? Check out our <a>comprehensive guide.</a>',
											'wpforms-lite'
										),
										{
											// eslint-disable-next-line jsx-a11y/anchor-has-content
											a: <a href={ wpforms_gutenberg_form_selector.wpforms_guide } target="_blank" rel="noopener noreferrer" />,
										}
									)
								}
							</p>

							{ /* Template for popup with builder iframe */ }
							<div id="wpforms-gutenberg-popup" className="wpforms-builder-popup">
								<iframe src="about:blank" width="100%" height="100%" id="wpforms-builder-iframe" title="WPForms Builder Popup"></iframe>
							</div>
						</div>
					</Fragment>
				);
			},

			/**
			 * Get block placeholder (form selector) JSX code.
			 *
			 * @since 1.8.1
			 *
			 * @param {Object} attributes  Block attributes.
			 * @param {Object} handlers    Block event handlers.
			 * @param {Object} formOptions Form selector options.
			 *
			 * @return {JSX.Element} Block placeholder JSX code.
			 */
			getBlockPlaceholder( attributes, handlers, formOptions ) {
				const isFormNotAvailable = attributes.formId && ! app.isFormAvailable( attributes.formId );

				return (
					<Placeholder
						key="wpforms-gutenberg-form-selector-wrap"
						className="wpforms-gutenberg-form-selector-wrap">
						<img src={ wpforms_gutenberg_form_selector.logo_url } alt="" />
						{ isFormNotAvailable && (
							<p style={ { textAlign: 'center', marginTop: '0' } }>
								{ strings.form_not_available_message }
							</p>
						) }
						<SelectControl
							key="wpforms-gutenberg-form-selector-select-control"
							value={ attributes.formId }
							options={ formOptions }
							onChange={ ( value ) => handlers.attrChange( 'formId', value ) }
						/>
					</Placeholder>
				);
			},
		},

		/**
		 * Determine if the form has a Page Break field.
		 *
		 * @since 1.8.7
		 *
		 * @param {Object}        forms  The forms' data object.
		 * @param {number|string} formId Form ID.
		 *
		 * @return {boolean} True when the form has a Page Break field, false otherwise.
		 */
		hasPageBreak( forms, formId ) {
			const currentForm = forms.find( ( form ) => parseInt( form.ID, 10 ) === parseInt( formId, 10 ) );

			if ( ! currentForm.post_content ) {
				return false;
			}

			const fields = JSON.parse( currentForm.post_content )?.fields;

			return Object.values( fields ).some( ( field ) => field.type === 'pagebreak' );
		},

		hasRating( forms, formId ) {
			const currentForm = forms.find( ( form ) => parseInt( form.ID, 10 ) === parseInt( formId, 10 ) );

			if ( ! currentForm.post_content || ! isPro || ! isLicenseActive ) {
				return false;
			}

			const fields = JSON.parse( currentForm.post_content )?.fields;

			return Object.values( fields ).some( ( field ) => field.type === 'rating' );
		},

		/**
		 * Get Style Settings panel class.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 * @param {string} panel Panel name.
		 *
		 * @return {string} Style Settings panel class.
		 */
		getPanelClass( props, panel = '' ) {
			let cssClass = 'wpforms-gutenberg-panel wpforms-block-settings-' + props.clientId;

			if ( ! app.isFullStylingEnabled() ) {
				cssClass += ' disabled_panel';
			}

			// Restrict styling panel for non-admins.
			if ( ! ( isAdmin || panel === 'themes' ) ) {
				cssClass += ' wpforms-gutenberg-panel-restricted';
			}

			return cssClass;
		},

		/**
		 * Get color panel settings CSS class.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} borderStyle Border style value.
		 *
		 * @return {string} Style Settings panel class.
		 */
		getColorPanelClass( borderStyle ) {
			let cssClass = 'wpforms-gutenberg-form-selector-color-panel';

			if ( borderStyle === 'none' ) {
				cssClass += ' wpforms-gutenberg-form-selector-border-color-disabled';
			}

			return cssClass;
		},

		/**
		 * Determine whether the full styling is enabled.
		 *
		 * @since 1.8.1
		 *
		 * @return {boolean} Whether the full styling is enabled.
		 */
		isFullStylingEnabled() {
			return wpforms_gutenberg_form_selector.is_modern_markup && wpforms_gutenberg_form_selector.is_full_styling;
		},

		/**
		 * Determine whether the block has lead forms enabled.
		 *
		 * @since 1.9.0
		 *
		 * @param {Object} block Gutenberg block
		 *
		 * @return {boolean} Whether the block has lead forms enabled
		 */
		isLeadFormsEnabled( block ) {
			if ( ! block ) {
				return false;
			}

			const $form = $( block.querySelector( '.wpforms-container' ) );

			return $form.hasClass( 'wpforms-lead-forms-container' );
		},

		/**
		 * Get block container DOM element.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Element} Block container.
		 */
		getBlockContainer( props ) {
			const blockSelector = `#block-${ props.clientId } > div`;
			let block = document.querySelector( blockSelector );

			// For FSE / Gutenberg plugin, we need to take a look inside the iframe.
			if ( ! block ) {
				const editorCanvas = document.querySelector( 'iframe[name="editor-canvas"]' );

				block = editorCanvas?.contentWindow.document.querySelector( blockSelector );
			}

			return block;
		},

		/**
		 * Update CSS variable(s) value(s) of the given attribute for given container on the preview.
		 *
		 * @since 1.8.8
		 *
		 * @param {string}  attribute Style attribute: field-size, label-size, button-size, etc.
		 * @param {string}  value     Property new value.
		 * @param {Element} container Form container.
		 * @param {Object}  props     Block properties.
		 */
		updatePreviewCSSVarValue( attribute, value, container, props ) { // eslint-disable-line complexity, max-lines-per-function
			if ( ! container || ! attribute ) {
				return;
			}

			const property = attribute.replace(
				/[A-Z]/g,
				( letter ) => `-${ letter.toLowerCase() }`
			);

			if ( typeof customStylesHandlers[ property ] === 'function' ) {
				customStylesHandlers[ property ]( container, value );

				return;
			}

			switch ( property ) {
				case 'field-size':
				case 'label-size':
				case 'button-size':
				case 'container-shadow-size':
					for ( const key in sizes[ property ][ value ] ) {
						container.style.setProperty(
							`--wpforms-${ property }-${ key }`,
							sizes[ property ][ value ][ key ],
						);
					}

					break;
				case 'field-border-style':
					if ( value === 'none' ) {
						app.toggleFieldBorderNoneCSSVarValue( container, true );
					} else {
						app.toggleFieldBorderNoneCSSVarValue( container, false );
						container.style.setProperty( `--wpforms-${ property }`, value );
					}

					break;
				case 'button-background-color':
					app.maybeUpdateAccentColor( props.attributes.buttonBorderColor, value, container );
					value = app.maybeSetButtonAltBackgroundColor( value, props.attributes.buttonBorderColor, container );
					app.maybeSetButtonAltTextColor( props.attributes.buttonTextColor, value, props.attributes.buttonBorderColor, container );
					container.style.setProperty( `--wpforms-${ property }`, value );

					break;
				case 'button-border-color':
					app.maybeUpdateAccentColor( value, props.attributes.buttonBackgroundColor, container );
					app.maybeSetButtonAltTextColor( props.attributes.buttonTextColor, props.attributes.buttonBackgroundColor, value, container );
					container.style.setProperty( `--wpforms-${ property }`, value );

					break;
				case 'button-text-color':
					app.maybeSetButtonAltTextColor( value, props.attributes.buttonBackgroundColor, props.attributes.buttonBorderColor, container );
					container.style.setProperty( `--wpforms-${ property }`, value );

					break;
				default:
					container.style.setProperty( `--wpforms-${ property }`, value );
					container.style.setProperty( `--wpforms-${ property }-spare`, value );
			}
		},

		/**
		 * Set/unset field border vars in case of border-style is none.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object}  container Form container.
		 * @param {boolean} set       True when set, false when unset.
		 */
		toggleFieldBorderNoneCSSVarValue( container, set ) {
			const cont = container.querySelector( 'form' );

			if ( set ) {
				cont.style.setProperty( '--wpforms-field-border-style', 'solid' );
				cont.style.setProperty( '--wpforms-field-border-size', '1px' );
				cont.style.setProperty( '--wpforms-field-border-color', 'transparent' );

				return;
			}

			cont.style.setProperty( '--wpforms-field-border-style', null );
			cont.style.setProperty( '--wpforms-field-border-size', null );
			cont.style.setProperty( '--wpforms-field-border-color', null );
		},

		/**
		 * Maybe set the button's alternative background color.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} value             Attribute value.
		 * @param {string} buttonBorderColor Button border color.
		 * @param {Object} container         Form container.
		 *
		 * @return {string|*} New background color.
		 */
		maybeSetButtonAltBackgroundColor( value, buttonBorderColor, container ) {
			// Setting css property value to child `form` element overrides the parent property value.
			const form = container.querySelector( 'form' );

			form.style.setProperty( '--wpforms-button-background-color-alt', value );

			if ( WPFormsUtils.cssColorsUtils.isTransparentColor( value ) ) {
				return WPFormsUtils.cssColorsUtils.isTransparentColor( buttonBorderColor ) ? defaultStyleSettings.buttonBackgroundColor : buttonBorderColor;
			}

			return value;
		},

		/**
		 * Maybe set the button's alternative text color.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} value                 Attribute value.
		 * @param {string} buttonBackgroundColor Button background color.
		 * @param {string} buttonBorderColor     Button border color.
		 * @param {Object} container             Form container.
		 */
		maybeSetButtonAltTextColor( value, buttonBackgroundColor, buttonBorderColor, container ) {
			const form = container.querySelector( 'form' );

			let altColor = null;

			value = value.toLowerCase();

			if (
				WPFormsUtils.cssColorsUtils.isTransparentColor( value ) ||
				value === buttonBackgroundColor ||
				(
					WPFormsUtils.cssColorsUtils.isTransparentColor( buttonBackgroundColor ) &&
					value === buttonBorderColor
				)
			) {
				altColor = WPFormsUtils.cssColorsUtils.getContrastColor( buttonBackgroundColor );
			}

			container.style.setProperty( `--wpforms-button-text-color-alt`, value );
			form.style.setProperty( `--wpforms-button-text-color-alt`, altColor );
		},

		/**
		 * Maybe update accent color.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} color                 Color value.
		 * @param {string} buttonBackgroundColor Button background color.
		 * @param {Object} container             Form container.
		 */
		maybeUpdateAccentColor( color, buttonBackgroundColor, container ) {
			// Setting css property value to child `form` element overrides the parent property value.
			const form = container.querySelector( 'form' );

			// Fallback to default color if the border color is transparent.
			color = WPFormsUtils.cssColorsUtils.isTransparentColor( color ) ? defaultStyleSettings.buttonBackgroundColor : color;

			if ( WPFormsUtils.cssColorsUtils.isTransparentColor( buttonBackgroundColor ) ) {
				form.style.setProperty( '--wpforms-button-background-color-alt', 'rgba( 0, 0, 0, 0 )' );
				form.style.setProperty( '--wpforms-button-background-color', color );
			} else {
				container.style.setProperty( '--wpforms-button-background-color-alt', buttonBackgroundColor );
				form.style.setProperty( '--wpforms-button-background-color-alt', null );
				form.style.setProperty( '--wpforms-button-background-color', null );
			}
		},

		/**
		 * Get settings fields event handlers.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Object} Object that contains event handlers for the settings fields.
		 */
		getSettingsFieldsHandlers( props ) { // eslint-disable-line max-lines-per-function
			return {
				/**
				 * Field style attribute change event handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} attribute Attribute name.
				 * @param {string} value     New attribute value.
				 */
				styleAttrChange( attribute, value ) {
					const block = app.getBlockContainer( props ),
						container = block.querySelector( `#wpforms-${ props.attributes.formId }` ),
						setAttr = {};

					// Unset the color means setting the transparent color.
					if ( attribute.includes( 'Color' ) ) {
						value = value ?? 'rgba( 0, 0, 0, 0 )';
					}

					app.updatePreviewCSSVarValue( attribute, value, container, props );

					setAttr[ attribute ] = value;

					app.setBlockRuntimeStateVar( props.clientId, 'prevAttributesState', props.attributes );
					props.setAttributes( setAttr );

					triggerServerRender = false;

					this.updateCopyPasteContent();

					app.panels.themes.updateCustomThemeAttribute( attribute, value, props );

					this.maybeToggleDropdown( props, attribute );

					// Trigger event for developers.
					el.$window.trigger( 'wpformsFormSelectorStyleAttrChange', [ block, props, attribute, value ] );
				},

				/**
				 * Handles the toggling of the dropdown menu's visibility.
				 *
				 * @since 1.8.8
				 *
				 * @param {Object} props     The block properties.
				 * @param {string} attribute The name of the attribute being changed.
				 */
				maybeToggleDropdown( props, attribute ) { // eslint-disable-line no-shadow
					const formId = props.attributes.formId;
					const menu = document.querySelector( `#wpforms-form-${ formId } .choices__list.choices__list--dropdown` );
					const classicMenu = document.querySelector( `#wpforms-form-${ formId } .wpforms-field-select-style-classic select` );

					if ( attribute === 'fieldMenuColor' ) {
						if ( menu ) {
							menu.classList.add( 'is-active' );
							menu.parentElement.classList.add( 'is-open' );
						} else {
							this.showClassicMenu( classicMenu );
						}

						clearTimeout( dropdownTimeout );

						dropdownTimeout = setTimeout( () => {
							const toClose = document.querySelector( `#wpforms-form-${ formId } .choices__list.choices__list--dropdown` );

							if ( toClose ) {
								toClose.classList.remove( 'is-active' );
								toClose.parentElement.classList.remove( 'is-open' );
							} else {
								this.hideClassicMenu( document.querySelector( `#wpforms-form-${ formId } .wpforms-field-select-style-classic select` ) );
							}
						}, 5000 );
					} else if ( menu ) {
						menu.classList.remove( 'is-active' );
					} else {
						this.hideClassicMenu( classicMenu );
					}
				},

				/**
				 * Shows the classic menu.
				 *
				 * @since 1.8.8
				 *
				 * @param {Object} classicMenu The classic menu.
				 */
				showClassicMenu( classicMenu ) {
					if ( ! classicMenu ) {
						return;
					}

					classicMenu.size = 2;
					classicMenu.style.cssText = 'padding-top: 40px; padding-inline-end: 0; padding-inline-start: 0; position: relative;';
					classicMenu.querySelectorAll( 'option' ).forEach( ( option ) => {
						option.style.cssText = 'border-left: 1px solid #8c8f94; border-right: 1px solid #8c8f94; padding: 0 10px; z-index: 999999; position: relative;';
					} );
					classicMenu.querySelector( 'option:last-child' ).style.cssText = 'border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; padding: 0 10px; border-left: 1px solid #8c8f94; border-right: 1px solid #8c8f94; border-bottom: 1px solid #8c8f94; z-index: 999999; position: relative;';
				},

				/**
				 * Hides the classic menu.
				 *
				 * @since 1.8.8
				 *
				 * @param {Object} classicMenu The classic menu.
				 */
				hideClassicMenu( classicMenu ) {
					if ( ! classicMenu ) {
						return;
					}

					classicMenu.size = 0;
					classicMenu.style.cssText = 'padding-top: 0; padding-inline-end: 24px; padding-inline-start: 12px; position: relative;';
					classicMenu.querySelectorAll( 'option' ).forEach( ( option ) => {
						option.style.cssText = 'border: none;';
					} );
				},

				/**
				 * Field regular attribute change event handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} attribute Attribute name.
				 * @param {string} value     New attribute value.
				 */
				attrChange( attribute, value ) {
					const setAttr = {};

					setAttr[ attribute ] = value;

					app.setBlockRuntimeStateVar( props.clientId, 'prevAttributesState', props.attributes );
					props.setAttributes( setAttr );

					triggerServerRender = true;

					this.updateCopyPasteContent();
				},

				/**
				 * Update content of the "Copy/Paste" fields.
				 *
				 * @since 1.8.1
				 */
				updateCopyPasteContent() {
					const content = {};
					const atts = wp.data.select( 'core/block-editor' ).getBlockAttributes( props.clientId );

					for ( const key in defaultStyleSettings ) {
						content[ key ] = atts[ key ];
					}

					props.setAttributes( { copyPasteJsonValue: JSON.stringify( content ) } );
				},

				/**
				 * Paste settings handler.
				 *
				 * @since 1.8.1
				 *
				 * @param {string} value New attribute value.
				 */
				pasteSettings( value ) {
					value = value.trim();

					const pasteAttributes = app.parseValidateJson( value );

					if ( ! pasteAttributes ) {
						wp.data.dispatch( 'core/notices' ).createErrorNotice(
							strings.copy_paste_error,
							{ id: 'wpforms-json-parse-error' }
						);

						this.updateCopyPasteContent();

						return;
					}

					pasteAttributes.copyPasteJsonValue = value;

					const themeSlug = app.panels.themes.maybeCreateCustomThemeFromAttributes( pasteAttributes );

					app.setBlockRuntimeStateVar( props.clientId, 'prevAttributesState', props.attributes );
					props.setAttributes( pasteAttributes );
					app.panels.themes.setBlockTheme( props, themeSlug );

					triggerServerRender = false;
				},
			};
		},

		/**
		 * Parse and validate JSON string.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} value JSON string.
		 *
		 * @return {boolean|object} Parsed JSON object OR false on error.
		 */
		parseValidateJson( value ) {
			if ( typeof value !== 'string' ) {
				return false;
			}

			let atts;

			try {
				atts = JSON.parse( value.trim() );
			} catch ( error ) {
				atts = false;
			}

			return atts;
		},

		/**
		 * Get WPForms icon DOM element.
		 *
		 * @since 1.8.1
		 *
		 * @return {DOM.element} WPForms icon DOM element.
		 */
		getIcon() {
			return createElement(
				'svg',
				{ width: 20, height: 20, viewBox: '0 0 612 612', className: 'dashicon' },
				createElement(
					'path',
					{
						fill: 'currentColor',
						d: 'M544,0H68C30.445,0,0,30.445,0,68v476c0,37.556,30.445,68,68,68h476c37.556,0,68-30.444,68-68V68 C612,30.445,581.556,0,544,0z M464.44,68L387.6,120.02L323.34,68H464.44z M288.66,68l-64.26,52.02L147.56,68H288.66z M544,544H68 V68h22.1l136,92.14l79.9-64.6l79.56,64.6l136-92.14H544V544z M114.24,263.16h95.88v-48.28h-95.88V263.16z M114.24,360.4h95.88 v-48.62h-95.88V360.4z M242.76,360.4h255v-48.62h-255V360.4L242.76,360.4z M242.76,263.16h255v-48.28h-255V263.16L242.76,263.16z M368.22,457.3h129.54V408H368.22V457.3z',
					},
				),
			);
		},

		/**
		 * Get WPForms blocks.
		 *
		 * @since 1.8.8
		 *
		 * @return {Array} Blocks array.
		 */
		getWPFormsBlocks() {
			const wpformsBlocks = wp.data.select( 'core/block-editor' ).getBlocks();

			return wpformsBlocks.filter( ( props ) => {
				return props.name === 'wpforms/form-selector';
			} );
		},

		/**
		 * Get WPForms blocks.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Object} Block attributes.
		 */
		isClientIdAttrUnique( props ) {
			const wpformsBlocks = app.getWPFormsBlocks();

			for ( const key in wpformsBlocks ) {
				// Skip the current block.
				if ( wpformsBlocks[ key ].clientId === props.clientId ) {
					continue;
				}

				if ( wpformsBlocks[ key ].attributes.clientId === props.attributes.clientId ) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Get block attributes.
		 *
		 * @since 1.8.1
		 *
		 * @return {Object} Block attributes.
		 */
		getBlockAttributes() {
			return commonAttributes;
		},

		/**
		 * Get block runtime state variable.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} clientId Block client ID.
		 * @param {string} varName  Block runtime variable name.
		 *
		 * @return {*} Block runtime state variable value.
		 */
		getBlockRuntimeStateVar( clientId, varName ) {
			return blocks[ clientId ]?.[ varName ];
		},

		/**
		 * Set block runtime state variable value.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} clientId Block client ID.
		 * @param {string} varName  Block runtime state key.
		 * @param {*}      value    State variable value.
		 *
		 * @return {boolean} True on success.
		 */
		setBlockRuntimeStateVar( clientId, varName, value ) { // eslint-disable-line complexity
			if ( ! clientId || ! varName ) {
				return false;
			}

			blocks[ clientId ] = blocks[ clientId ] || {};
			blocks[ clientId ][ varName ] = value;

			// Prevent referencing to object.
			if ( typeof value === 'object' && ! Array.isArray( value ) && value !== null ) {
				blocks[ clientId ][ varName ] = { ...value };
			}

			return true;
		},

		/**
		 * Get form selector options.
		 *
		 * @since 1.8.1
		 *
		 * @return {Array} Form options.
		 */
		getFormOptions() {
			const formOptions = formList.map( ( value ) => (
				{ value: value.ID, label: value.post_title }
			) );

			formOptions.unshift( { value: '', label: strings.form_select } );

			return formOptions;
		},

		/**
		 * Get size selector options.
		 *
		 * @since 1.8.1
		 *
		 * @return {Array} Size options.
		 */
		getSizeOptions() {
			return [
				{
					label: strings.small,
					value: 'small',
				},
				{
					label: strings.medium,
					value: 'medium',
				},
				{
					label: strings.large,
					value: 'large',
				},
			];
		},

		/**
		 * Event `wpformsFormSelectorEdit` handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e     Event object.
		 * @param {Object} props Block properties.
		 */
		blockEdit( e, props ) {
			const block = app.getBlockContainer( props );

			if ( ! block?.dataset ) {
				return;
			}

			app.initLeadFormSettings( block.parentElement );
		},

		/**
		 * Init Lead Form Settings panels.
		 *
		 * @since 1.8.1
		 *
		 * @param {Element} block         Block element.
		 * @param {Object}  block.dataset Block element.
		 */
		initLeadFormSettings( block ) {
			if ( ! block?.dataset ) {
				return;
			}

			if ( ! app.isFullStylingEnabled() ) {
				return;
			}

			const clientId = block.dataset.block;
			const $panel = $( `.wpforms-block-settings-${ clientId }` );

			if ( app.isLeadFormsEnabled( block ) ) {
				$panel
					.addClass( 'disabled_panel' )
					.find( '.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice' )
					.css( 'display', 'block' );

				$panel
					.find( '.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice' )
					.css( 'display', 'none' );

				return;
			}

			$panel
				.removeClass( 'disabled_panel' )
				.find( '.wpforms-gutenberg-panel-notice.wpforms-lead-form-notice' )
				.css( 'display', 'none' );

			$panel
				.find( '.wpforms-gutenberg-panel-notice.wpforms-use-modern-notice' )
				.css( 'display', null );
		},

		/**
		 * Event `wpformsFormSelectorFormLoaded` handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e Event object.
		 */
		formLoaded( e ) {
			app.initLeadFormSettings( e.detail.block );
			app.updateAccentColors( e.detail );
			app.loadChoicesJS( e.detail );
			app.initRichTextField( e.detail.formId );
			app.initRepeaterField( e.detail.formId );

			$( e.detail.block )
				.off( 'click' )
				.on( 'click', app.blockClick );
		},

		/**
		 * Click on the block event handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e Event object.
		 */
		blockClick( e ) {
			app.initLeadFormSettings( e.currentTarget );
		},

		/**
		 * Update accent colors of some fields in GB block in Modern Markup mode.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} detail Event details object.
		 */
		updateAccentColors( detail ) {
			if (
				! wpforms_gutenberg_form_selector.is_modern_markup ||
				! window.WPForms?.FrontendModern ||
				! detail?.block
			) {
				return;
			}

			const $form = $( detail.block.querySelector( `#wpforms-${ detail.formId }` ) ),
				FrontendModern = window.WPForms.FrontendModern;

			FrontendModern.updateGBBlockPageIndicatorColor( $form );
			FrontendModern.updateGBBlockIconChoicesColor( $form );
			FrontendModern.updateGBBlockRatingColor( $form );
		},

		/**
		 * Init Modern style Dropdown fields (<select>).
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} detail Event details object.
		 */
		loadChoicesJS( detail ) {
			if ( typeof window.Choices !== 'function' ) {
				return;
			}

			const $form = $( detail.block.querySelector( `#wpforms-${ detail.formId }` ) );

			$form.find( '.choicesjs-select' ).each( function( idx, selectEl ) {
				const $el = $( selectEl );

				if ( $el.data( 'choice' ) === 'active' ) {
					return;
				}

				const args = window.wpforms_choicesjs_config || {},
					searchEnabled = $el.data( 'search-enabled' ),
					$field = $el.closest( '.wpforms-field' );

				args.searchEnabled = 'undefined' !== typeof searchEnabled ? searchEnabled : true;
				args.callbackOnInit = function() {
					const self = this,
						$element = $( self.passedElement.element ),
						$input = $( self.input.element ),
						sizeClass = $element.data( 'size-class' );

					// Add CSS-class for size.
					if ( sizeClass ) {
						$( self.containerOuter.element ).addClass( sizeClass );
					}

					/**
					 * If a multiple select has selected choices - hide a placeholder text.
					 * In case if select is empty - we return placeholder text.
					 */
					if ( $element.prop( 'multiple' ) ) {
						// On init event.
						$input.data( 'placeholder', $input.attr( 'placeholder' ) );

						if ( self.getValue( true ).length ) {
							$input.hide();
						}
					}

					this.disable();
					$field.find( '.is-disabled' ).removeClass( 'is-disabled' );
				};

				try {
					if ( ! ( selectEl instanceof parent.HTMLSelectElement ) ) {
						Object.setPrototypeOf( selectEl, parent.HTMLSelectElement.prototype );
					}

					$el.data( 'choicesjs', new parent.Choices( selectEl, args ) );
				} catch ( e ) {} // eslint-disable-line no-empty
			} );
		},

		/**
		 * Initialize RichText field.
		 *
		 * @since 1.8.1
		 *
		 * @param {number} formId Form ID.
		 */
		initRichTextField( formId ) {
			// Set default tab to `Visual`.
			$( `#wpforms-${ formId } .wp-editor-wrap` ).removeClass( 'html-active' ).addClass( 'tmce-active' );
		},

		/**
		 * Initialize Repeater field.
		 *
		 * @since 1.8.9
		 *
		 * @param {number} formId Form ID.
		 */
		initRepeaterField( formId ) {
			const $rowButtons = $( `#wpforms-${ formId } .wpforms-field-repeater > .wpforms-field-repeater-display-rows .wpforms-field-repeater-display-rows-buttons` );

			// Get the label height and set the button position.
			$rowButtons.each( function() {
				const $cont = $( this );
				const $label = $cont.siblings( '.wpforms-layout-column' )
					.find( '.wpforms-field' ).first()
					.find( '.wpforms-field-label' );
				const labelStyle = window.getComputedStyle( $label.get( 0 ) );
				const margin = labelStyle?.getPropertyValue( '--wpforms-field-size-input-spacing' ) || 0;
				const height = $label.outerHeight() || 0;
				const top = height + parseInt( margin, 10 ) + 10;

				$cont.css( { top } );
			} );

			// Init buttons and descriptions for each repeater in each form.
			$( `.wpforms-form[data-formid="${ formId }"]` ).each( function() {
				const $repeater = $( this ).find( '.wpforms-field-repeater' );

				$repeater.find( '.wpforms-field-repeater-display-rows-buttons' ).addClass( 'wpforms-init' );
				$repeater.find( '.wpforms-field-repeater-display-rows:last .wpforms-field-description' ).addClass( 'wpforms-init' );
			} );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );
