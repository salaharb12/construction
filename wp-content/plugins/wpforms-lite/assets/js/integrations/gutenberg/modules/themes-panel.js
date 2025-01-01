/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

/**
 * @param wpforms_gutenberg_form_selector.route_namespace
 * @param strings.theme_name
 * @param strings.theme_delete
 * @param strings.theme_delete_title
 * @param strings.theme_delete_confirm
 * @param strings.theme_delete_cant_undone
 * @param strings.theme_delete_yes
 * @param strings.theme_copy
 * @param strings.theme_custom
 * @param strings.theme_noname
 * @param strings.button_background
 * @param strings.button_text
 * @param strings.field_label
 * @param strings.field_sublabel
 * @param strings.field_border
 */

/**
 * Gutenberg editor block.
 *
 * Themes panel module.
 *
 * @since 1.8.8
 */
export default ( function( document, window, $ ) {
	/**
	 * WP core components.
	 *
	 * @since 1.8.8
	 */
	const { PanelBody, ColorIndicator, TextControl, Button } = wp.components;
	const { __experimentalRadio: Radio, __experimentalRadioGroup: RadioGroup } = wp.components;

	/**
	 * Localized data aliases.
	 *
	 * @since 1.8.8
	 */
	const { isAdmin, isPro, isLicenseActive, strings, route_namespace: routeNamespace } = wpforms_gutenberg_form_selector;

	/**
	 * Form selector common module.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	let formSelectorCommon = null;

	/**
	 * Runtime state.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const state = {};

	/**
	 * Themes data.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const themesData = {
		wpforms: null,
		custom: null,
	};

	/**
	 * Enabled themes.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	let enabledThemes = null;

	/**
	 * Elements holder.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.8
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Initialize panel.
		 *
		 * @since 1.8.8
		 */
		init() {
			el.$window = $( window );

			app.fetchThemesData();

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
			wp.data.subscribe( function() { // eslint-disable-line complexity
				if ( ! isAdmin ) {
					return;
				}

				const isSavingPost = wp.data.select( 'core/editor' )?.isSavingPost();
				const isAutosavingPost = wp.data.select( 'core/editor' )?.isAutosavingPost();
				const isSavingWidget = wp.data.select( 'core/edit-widgets' )?.isSavingWidgetAreas();
				const currentPost = wp.data.select( 'core/editor' )?.getCurrentPost();
				const isBlockOrTemplate = currentPost?.type?.includes( 'wp_template' ) || currentPost?.type?.includes( 'wp_block' );

				if ( ( ! isSavingPost && ! isSavingWidget && ! isBlockOrTemplate ) || isAutosavingPost ) {
					return;
				}

				if ( isBlockOrTemplate ) {
					// Delay saving if this is FSE for better performance.
					_.debounce( app.saveCustomThemes, 500 )();

					return;
				}

				app.saveCustomThemes();
			} );
		},

		/**
		 * Get all themes data.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Themes data.
		 */
		getAllThemes() {
			return { ...( themesData.custom || {} ), ...( themesData.wpforms || {} ) };
		},

		/**
		 * Get theme data.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} slug Theme slug.
		 *
		 * @return {Object|null} Theme settings.
		 */
		getTheme( slug ) {
			return app.getAllThemes()[ slug ] || null;
		},

		/**
		 * Get enabled themes data.
		 *
		 * @since 1.8.8
		 *
		 * @return {Object} Themes data.
		 */
		getEnabledThemes() {
			if ( enabledThemes ) {
				return enabledThemes;
			}

			const allThemes = app.getAllThemes();

			if ( isPro && isLicenseActive ) {
				return allThemes;
			}

			enabledThemes = Object.keys( allThemes ).reduce( ( acc, key ) => {
				if ( allThemes[ key ].settings?.fieldSize && ! allThemes[ key ].disabled ) {
					acc[ key ] = allThemes[ key ];
				}
				return acc;
			}, {} );

			return enabledThemes;
		},

		/**
		 * Update enabled themes.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} slug  Theme slug.
		 * @param {Object} theme Theme settings.
		 */
		updateEnabledThemes( slug, theme ) {
			if ( ! enabledThemes ) {
				return;
			}

			enabledThemes = {
				...enabledThemes,
				[ slug ]: theme,
			};
		},

		/**
		 * Whether the theme is disabled.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} slug Theme slug.
		 *
		 * @return {boolean} True if the theme is disabled.
		 */
		isDisabledTheme( slug ) {
			return ! app.getEnabledThemes()?.[ slug ];
		},

		/**
		 * Whether the theme is one of the WPForms themes.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} slug Theme slug.
		 *
		 * @return {boolean} True if the theme is one of the WPForms themes.
		 */
		isWPFormsTheme( slug ) {
			return Boolean( themesData.wpforms[ slug ]?.settings );
		},

		/**
		 * Fetch themes data from API.
		 *
		 * @since 1.8.8
		 */
		fetchThemesData() {
			// If a fetch is already in progress, exit the function.
			if ( state.isFetchingThemes || themesData.wpforms ) {
				return;
			}

			// Set the flag to true indicating a fetch is in progress.
			state.isFetchingThemes = true;

			try {
				// Fetch themes data.
				wp.apiFetch( {
					path: routeNamespace + 'themes/',
					method: 'GET',
					cache: 'no-cache',
				} )
					.then( ( response ) => {
						themesData.wpforms = response.wpforms || {};
						themesData.custom = response.custom || {};
					} )
					.catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error( error?.message );
					} )
					.finally( () => {
						state.isFetchingThemes = false;
					} );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( error );
			}
		},

		/**
		 * Save custom themes.
		 *
		 * @since 1.8.8
		 */
		saveCustomThemes() {
			// Custom themes do not exist.
			if ( state.isSavingThemes || ! themesData.custom ) {
				return;
			}

			// Set the flag to true indicating a saving is in progress.
			state.isSavingThemes = true;

			try {
				// Save themes.
				wp.apiFetch( {
					path: routeNamespace + 'themes/custom/',
					method: 'POST',
					data: { customThemes: themesData.custom },
				} )
					.then( ( response ) => {
						if ( ! response?.result ) {
							// eslint-disable-next-line no-console
							console.log( response?.error );
						}
					} )
					.catch( ( error ) => {
						// eslint-disable-next-line no-console
						console.error( error?.message );
					} )
					.finally( () => {
						state.isSavingThemes = false;
					} );
			} catch ( error ) {
				// eslint-disable-next-line no-console
				console.error( error );
			}
		},

		/**
		 * Get the current style attributes state.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {boolean} Whether the custom theme is created.
		 */
		getCurrentStyleAttributes( props ) {
			const defaultAttributes = Object.keys( themesData.wpforms.default?.settings );
			const currentStyleAttributes = {};

			for ( const key in defaultAttributes ) {
				const attr = defaultAttributes[ key ];

				currentStyleAttributes[ attr ] = props.attributes[ attr ] ?? '';
			}

			return currentStyleAttributes;
		},

		/**
		 * Maybe create custom theme.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {boolean} Whether the custom theme is created.
		 */
		maybeCreateCustomTheme( props ) { // eslint-disable-line complexity
			const currentStyles = app.getCurrentStyleAttributes( props );
			const isWPFormsTheme = !! themesData.wpforms[ props.attributes.theme ];
			const isCustomTheme = !! themesData.custom[ props.attributes.theme ];

			let migrateToCustomTheme = false;

			// It is one of the default themes without any changes.
			if (
				isWPFormsTheme &&
				JSON.stringify( themesData.wpforms[ props.attributes.theme ]?.settings ) === JSON.stringify( currentStyles )
			) {
				return false;
			}

			const prevAttributes = formSelectorCommon.getBlockRuntimeStateVar( props.clientId, 'prevAttributesState' );

			// It is a block added in FS 1.0, so it doesn't have a theme.
			// The `prevAttributes` is `undefined` means that we are in the first render of the existing block.
			if ( props.attributes.theme === 'default' && props.attributes.themeName === '' && ! prevAttributes ) {
				migrateToCustomTheme = true;
			}

			// It is a modified default theme OR unknown custom theme.
			if ( isWPFormsTheme || ! isCustomTheme || migrateToCustomTheme ) {
				app.createCustomTheme( props, currentStyles, migrateToCustomTheme );
			}

			return true;
		},

		/**
		 * Create custom theme.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object}  props                Block properties.
		 * @param {Object}  currentStyles        Current style settings.
		 * @param {boolean} migrateToCustomTheme Whether it is needed to migrate to custom theme.
		 *
		 * @return {boolean} Whether the custom theme is created.
		 */
		createCustomTheme( props, currentStyles = null, migrateToCustomTheme = false ) { // eslint-disable-line complexity
			let counter = 0;
			let themeSlug = props.attributes.theme;

			const baseTheme = app.getTheme( props.attributes.theme ) || themesData.wpforms.default;
			let themeName = baseTheme.name;

			themesData.custom = themesData.custom || {};

			if ( migrateToCustomTheme ) {
				themeSlug = 'custom';
				themeName = strings.theme_custom;
			}

			// Determine the theme slug and the number of copies.
			do {
				counter++;
				themeSlug = themeSlug + '-copy-' + counter;
			} while ( themesData.custom[ themeSlug ] && counter < 10000 );

			const copyStr = counter < 2 ? strings.theme_copy : strings.theme_copy + ' ' + counter;

			themeName += ' (' + copyStr + ')';

			// The first migrated Custom Theme should be without `(Copy)` suffix.
			themeName = migrateToCustomTheme && counter < 2 ? strings.theme_custom : themeName;

			// Add the new custom theme.
			themesData.custom[ themeSlug ] = {
				name: themeName,
				settings: currentStyles || app.getCurrentStyleAttributes( props ),
			};

			app.updateEnabledThemes( themeSlug, themesData.custom[ themeSlug ] );

			// Update the block attributes with the new custom theme settings.
			props.setAttributes( {
				theme: themeSlug,
				themeName,
			} );

			return true;
		},

		/**
		 * Maybe create custom theme by given attributes.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} attributes Block properties.
		 *
		 * @return {string} New theme's slug.
		 */
		maybeCreateCustomThemeFromAttributes( attributes ) { // eslint-disable-line complexity
			const newThemeSlug = attributes.theme;
			const existingTheme = app.getTheme( attributes.theme );
			const keys = Object.keys( attributes );

			let isExistingTheme = Boolean( existingTheme?.settings );

			// Check if the theme already exists and has the same settings.
			if ( isExistingTheme ) {
				for ( const i in keys ) {
					const key = keys[ i ];

					if ( ! existingTheme.settings[ key ] || existingTheme.settings[ key ] !== attributes[ key ] ) {
						isExistingTheme = false;

						break;
					}
				}
			}

			// The theme exists and has the same settings.
			if ( isExistingTheme ) {
				return newThemeSlug;
			}

			// The theme doesn't exist.
			// Normalize the attributes to the default theme settings.
			const defaultAttributes = Object.keys( themesData.wpforms.default.settings );
			const newSettings = {};

			for ( const i in defaultAttributes ) {
				const attr = defaultAttributes[ i ];

				newSettings[ attr ] = attributes[ attr ] ?? '';
			}

			// Create a new custom theme.
			themesData.custom[ newThemeSlug ] = {
				name: attributes.themeName ?? strings.theme_custom,
				settings: newSettings,
			};

			app.updateEnabledThemes( newThemeSlug, themesData.custom[ newThemeSlug ] );

			return newThemeSlug;
		},

		/**
		 * Update custom theme.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} attribute Attribute name.
		 * @param {string} value     New attribute value.
		 * @param {Object} props     Block properties.
		 */
		updateCustomThemeAttribute( attribute, value, props ) { // eslint-disable-line complexity
			const themeSlug = props.attributes.theme;

			// Skip if it is one of the WPForms themes OR the attribute is not in the theme settings.
			if (
				themesData.wpforms[ themeSlug ] ||
				(
					attribute !== 'themeName' &&
					! themesData.wpforms.default.settings[ attribute ]
				)
			) {
				return;
			}

			// Skip if the custom theme doesn't exist.
			// It should never happen, only in some unique circumstances.
			if ( ! themesData.custom[ themeSlug ] ) {
				return;
			}

			// Update theme data.
			if ( attribute === 'themeName' ) {
				themesData.custom[ themeSlug ].name = value;
			} else {
				themesData.custom[ themeSlug ].settings = themesData.custom[ themeSlug ].settings || themesData.wpforms.default.settings;
				themesData.custom[ themeSlug ].settings[ attribute ] = value;
			}

			// Trigger event for developers.
			el.$window.trigger( 'wpformsFormSelectorUpdateTheme', [ themeSlug, themesData.custom[ themeSlug ], props ] );
		},

		/**
		 * Get Themes panel JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props                    Block properties.
		 * @param {Object} formSelectorCommonModule Common module.
		 * @param {Object} stockPhotosModule        StockPhotos module.
		 *
		 * @return {Object} Themes panel JSX code.
		 */
		getThemesPanel( props, formSelectorCommonModule, stockPhotosModule ) {
			// Store common module in app.
			formSelectorCommon = formSelectorCommonModule;
			state.stockPhotos = stockPhotosModule;

			// If there are no themes data, it is necessary to fetch it firstly.
			if ( ! themesData.wpforms ) {
				app.fetchThemesData();

				// Return empty JSX code.
				return ( <></> );
			}

			// Get event handlers.
			const handlers = app.getEventHandlers( props );
			const showCustomThemeOptions = isAdmin && formSelectorCommonModule.isFullStylingEnabled() && app.maybeCreateCustomTheme( props );
			const checked = formSelectorCommonModule.isFullStylingEnabled() ? props.attributes.theme : 'classic';
			const isLeadFormsEnabled = formSelectorCommonModule.isLeadFormsEnabled( formSelectorCommonModule.getBlockContainer( props ) );
			const displayLeadFormNotice = isLeadFormsEnabled ? 'block' : 'none';
			const modernNoticeStyles = displayLeadFormNotice === 'block' ? { display: 'none' } : {};

			let classes = formSelectorCommon.getPanelClass( props, 'themes' );

			classes += isLeadFormsEnabled ? ' wpforms-lead-forms-enabled' : '';
			classes += app.isMac() ? ' wpforms-is-mac' : '';

			return (
				<PanelBody className={ classes } title={ strings.themes }>
					<p className="wpforms-gutenberg-panel-notice wpforms-warning wpforms-use-modern-notice" style={ modernNoticeStyles }>
						<strong>{ strings.use_modern_notice_head }</strong>
						{ strings.use_modern_notice_text } <a href={ strings.use_modern_notice_link } rel="noreferrer" target="_blank">{ strings.learn_more }</a>
					</p>

					<p className="wpforms-gutenberg-panel-notice wpforms-warning wpforms-lead-form-notice" style={ { display: displayLeadFormNotice } }>
						<strong>{ strings.lead_forms_panel_notice_head }</strong>
						{ strings.lead_forms_panel_notice_text }
					</p>

					<RadioGroup
						className="wpforms-gutenberg-form-selector-themes-radio-group"
						label={ strings.themes }
						checked={ checked }
						defaultChecked={ props.attributes.theme }
						onChange={ ( value ) => handlers.selectTheme( value ) }
					>
						{ app.getThemesItemsJSX( props ) }
					</RadioGroup>
					{ showCustomThemeOptions && (
						<>
							<TextControl
								className="wpforms-gutenberg-form-selector-themes-theme-name"
								label={ strings.theme_name }
								value={ props.attributes.themeName }
								onChange={ ( value ) => handlers.changeThemeName( value ) }
							/>

							<Button isSecondary
								className="wpforms-gutenberg-form-selector-themes-delete"
								onClick={ handlers.deleteTheme }
								buttonSettings=""
							>
								{ strings.theme_delete }
							</Button>
						</>
					) }
				</PanelBody>
			);
		},

		/**
		 * Get the Themes panel items JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 *
		 * @return {Array} Themes items JSX code.
		 */
		getThemesItemsJSX( props ) { // eslint-disable-line complexity
			const allThemesData = app.getAllThemes();

			if ( ! allThemesData ) {
				return [];
			}

			const itemsJsx = [];
			const themes = Object.keys( allThemesData );
			let theme, firstThemeSlug;

			// Display the current custom theme on the top of the list.
			if ( ! app.isWPFormsTheme( props.attributes.theme ) ) {
				firstThemeSlug = props.attributes.theme;

				itemsJsx.push(
					app.getThemesItemJSX(
						props.attributes.theme,
						app.getTheme( props.attributes.theme )
					)
				);
			}

			for ( const key in themes ) {
				const slug = themes[ key ];

				// Skip the first theme.
				if ( firstThemeSlug && firstThemeSlug === slug ) {
					continue;
				}

				// Ensure that all the theme settings are present.
				theme = { ...allThemesData.default, ...( allThemesData[ slug ] || {} ) };
				theme.settings = { ...allThemesData.default.settings, ...( theme.settings || {} ) };

				itemsJsx.push( app.getThemesItemJSX( slug, theme ) );
			}

			return itemsJsx;
		},

		/**
		 * Get the Themes panel's single item JSX code.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} slug  Theme slug.
		 * @param {Object} theme Theme data.
		 *
		 * @return {Object|null} Themes panel single item JSX code.
		 */
		getThemesItemJSX( slug, theme ) {
			if ( ! theme ) {
				return null;
			}

			const title = theme.name?.length > 0 ? theme.name : strings.theme_noname;

			return (
				<Radio
					value={ slug }
					title={ title }
				>
					<div
						className={ app.isDisabledTheme( slug ) ? 'wpforms-gutenberg-form-selector-themes-radio-disabled' : '' }
					>
						<div className="wpforms-gutenberg-form-selector-themes-radio-title">{ title }</div>
					</div>
					<ColorIndicator colorValue={ theme.settings.buttonBackgroundColor } title={ strings.button_background } />
					<ColorIndicator colorValue={ theme.settings.buttonTextColor } title={ strings.button_text } />
					<ColorIndicator colorValue={ theme.settings.labelColor } title={ strings.field_label } />
					<ColorIndicator colorValue={ theme.settings.labelSublabelColor } title={ strings.field_sublabel } />
					<ColorIndicator colorValue={ theme.settings.fieldBorderColor } title={ strings.field_border } />
				</Radio>
			);
		},

		/**
		 * Set block theme.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props     Block properties.
		 * @param {string} themeSlug The theme slug.
		 *
		 * @return {boolean} True on success.
		 */
		setBlockTheme( props, themeSlug ) {
			if ( app.maybeDisplayUpgradeModal( themeSlug ) ) {
				return false;
			}

			const theme = app.getTheme( themeSlug );

			if ( ! theme?.settings ) {
				return false;
			}

			const attributes = Object.keys( theme.settings );
			const block = formSelectorCommon.getBlockContainer( props );
			const container = block.querySelector( `#wpforms-${ props.attributes.formId }` );

			// Overwrite block attributes with the new theme settings.
			// It is needed to rely on the theme settings only.
			const newProps = { ...props, attributes: { ...props.attributes, ...theme.settings } };

			// Update the preview with the new theme settings.
			for ( const key in attributes ) {
				const attr = attributes[ key ];

				theme.settings[ attr ] = theme.settings[ attr ] === '0' ? '0px' : theme.settings[ attr ];

				formSelectorCommon.updatePreviewCSSVarValue(
					attr,
					theme.settings[ attr ],
					container,
					newProps
				);
			}

			// Prepare the new attributes to be set.
			const setAttributes = {
				theme: themeSlug,
				themeName: theme.name,
				...theme.settings,
			};

			if ( props.setAttributes ) {
				// Update the block attributes with the new theme settings.
				props.setAttributes( setAttributes );
			}

			// Trigger event for developers.
			el.$window.trigger( 'wpformsFormSelectorSetTheme', [ block, themeSlug, props ] );

			return true;
		},

		/**
		 * Maybe display upgrades modal in Lite.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} themeSlug The theme slug.
		 *
		 * @return {boolean} True if modal was displayed.
		 */
		maybeDisplayUpgradeModal( themeSlug ) {
			if ( ! app.isDisabledTheme( themeSlug ) ) {
				return false;
			}

			if ( ! isPro ) {
				formSelectorCommon.education.showProModal( 'themes', strings.themes );

				return true;
			}

			if ( ! isLicenseActive ) {
				formSelectorCommon.education.showLicenseModal( 'themes', strings.themes, 'select-theme' );

				return true;
			}

			return false;
		},

		/**
		 * Get themes panel event handlers.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props Block properties.
		 *
		 * @type {Object}
		 */
		getEventHandlers( props ) { // eslint-disable-line max-lines-per-function
			const commonHandlers = formSelectorCommon.getSettingsFieldsHandlers( props );

			const handlers = {
				/**
				 * Select theme event handler.
				 *
				 * @since 1.8.8
				 *
				 * @param {string} value New attribute value.
				 */
				selectTheme( value ) {
					if ( ! app.setBlockTheme( props, value ) ) {
						return;
					}

					// Maybe open Stock Photo installation window.
					state?.stockPhotos?.onSelectTheme( value, props, app, commonHandlers );

					const block = formSelectorCommon.getBlockContainer( props );

					formSelectorCommon.setTriggerServerRender( false );
					commonHandlers.updateCopyPasteContent();

					// Trigger event for developers.
					el.$window.trigger( 'wpformsFormSelectorSelectTheme', [ block, props, value ] );
				},

				/**
				 * Change theme name event handler.
				 *
				 * @since 1.8.8
				 *
				 * @param {string} value New attribute value.
				 */
				changeThemeName( value ) {
					formSelectorCommon.setTriggerServerRender( false );
					props.setAttributes( { themeName: value } );

					app.updateCustomThemeAttribute( 'themeName', value, props );
				},

				/**
				 * Delete theme event handler.
				 *
				 * @since 1.8.8
				 */
				deleteTheme() {
					const deleteThemeSlug = props.attributes.theme;

					// Remove theme from the theme storage.
					delete themesData.custom[ deleteThemeSlug ];

					// Open the confirmation modal window.
					app.deleteThemeModal( props, deleteThemeSlug, handlers );
				},
			};

			return handlers;
		},

		/**
		 * Open the theme delete confirmation modal window.
		 *
		 * @since 1.8.8
		 *
		 * @param {Object} props           Block properties.
		 * @param {string} deleteThemeSlug Theme slug.
		 * @param {Object} handlers        Block event handlers.
		 */
		deleteThemeModal( props, deleteThemeSlug, handlers ) {
			const confirm = strings.theme_delete_confirm.replace( '%1$s', `<b>${ props.attributes.themeName }</b>` );
			const content = `<p class="wpforms-theme-delete-text">${ confirm } ${ strings.theme_delete_cant_undone }</p>`;

			$.confirm( {
				title: strings.theme_delete_title,
				content,
				icon: 'wpforms-exclamation-circle',
				type: 'red',
				buttons: {
					confirm: {
						text: strings.theme_delete_yes,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							// Switch to the default theme.
							handlers.selectTheme( 'default' );

							// Trigger event for developers.
							el.$window.trigger( 'wpformsFormSelectorDeleteTheme', [ deleteThemeSlug, props ] );
						},
					},
					cancel: {
						text: strings.cancel,
						keys: [ 'esc' ],
					},
				},
			} );
		},

		/**
		 * Determine if the user is on a Mac.
		 *
		 * @return {boolean} True if the user is on a Mac.
		 */
		isMac() {
			return navigator.userAgent.includes( 'Macintosh' );
		},
	};

	app.init();

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );
