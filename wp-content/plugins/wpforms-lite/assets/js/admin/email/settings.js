/* global Choices, wpforms_admin_email_settings */
/**
 * Script for manipulating DOM events in the "Email" settings page.
 * This script will be accessible in the "WPForms" → "Settings" → "Email" page.
 *
 * @since 1.8.5
 */

const WPFormsEmailSettings = window.WPFormsEmailSettings || ( function( document, window, $, l10n ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.8.5
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const vars = {
		cache: {
			appearance: {
				light: '#email-appearance-light',
			},
			colors: {
				light: {
					background: [
						'#wpforms-setting-email-background-color',
						'#wpforms-setting-email-color-scheme-email_background_color',
					],
					text: '#wpforms-setting-email-color-scheme-email_text_color',
				},
				dark: {
					background: [
						'#wpforms-setting-email-background-color-dark',
						'#wpforms-setting-email-color-scheme-dark-email_background_color_dark',
					],
					text: '#wpforms-setting-email-color-scheme-dark-email_text_color_dark',
				},
			},
		},

		/**
		 * Generic CSS class names for applying visual changes.
		 *
		 * @since 1.8.6
		 */
		classNames: {
			hide: 'wpforms-hide',
			appearance: 'email-appearance-mode-toggle',
			legacyTemplate: 'legacy-template',
			hideForPlainText: 'hide-for-template-none',
			headerImage: 'wpforms-email-header-image',
			colorScheme: 'email-color-scheme',
			typography: 'email-typography',
			noticeWarning: 'notice-warning',
			noticeLegacy: 'wpforms-email-legacy-notice',
			settingsRow: 'wpforms-setting-row',
			settingField: 'wpforms-setting-field',
		},
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.5
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.5
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.5
		 */
		ready() {
			app.setup();
			app.bindEvents();
			app.relocateImageSize();
			app.handleOnContrastChange();
			app.handleOnChangeBackgroundColor();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.8.5
		 */
		setup() {
			// Cache DOM elements.
			el.$wrapper = $( '.wpforms-admin-settings-email' );
			el.$appearance = $( `.${ vars.classNames.appearance }` );
			el.$colorScheme = $( `.${ vars.classNames.colorScheme }` );
			el.$typography = $( `.${ vars.classNames.typography }` );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.8.5
		 */
		bindEvents() {
			el.$wrapper
				.on( 'change', '.wpforms-email-template input[type="radio"]', app.handleOnUpdateTemplate )
				.on( 'change', '.wpforms-email-header-image input', app.handleOnChangeHeaderImage )
				.on( 'click', '.wpforms-setting-remove-image', app.handleOnRemoveHeaderImage )
				.on( 'change', '.has-preview-changes :input', app.handleOnPreviewChanges )
				.on( 'change', '.email-appearance-mode-toggle input', app.handleOnAppearanceModeToggle )
				// Selectors for the following events are specified by matching the ID attribute by design to ensure both appearance modes are covered.
				.on( 'change', '[id*="email-background-color"], [id*="email_background_color"]', app.handleOnChangeBackgroundColor )
				.on( 'change', '[id*="email_body_color"], [id*="email_text_color"]', app.handleOnContrastChange );
		},

		/**
		 * Callback for template change.
		 *
		 * @since 1.8.5
		 *
		 * @param {Object} event An event which takes place in the DOM.
		 */
		handleOnUpdateTemplate( event ) {
			// Get the selected value from the event.
			const selected = $( event.currentTarget ).val();

			// Find relevant elements in the wrapper.
			const $hideForNone = el.$wrapper.find( `.${ vars.classNames.hideForPlainText }` );
			const $imageSizeChoices = el.$wrapper.find( `.${ vars.classNames.headerImage } .choices` );
			const $backgroundControl = el.$wrapper.find( '.email-background-color' );
			const $legacyNotice = el.$wrapper.find( `.${ vars.classNames.noticeLegacy }` );
			const $educationModal = el.$wrapper.find( '.education-modal' );

			// Check if it's a Pro template.
			const isPro = $educationModal.length === 0;

			// Check if the selected value is 'none' or 'default'.
			const isNone = selected === 'none';
			const isDefault = selected === 'default';

			// Toggle image size choices based on the selected value.
			$imageSizeChoices.each( ( i, elm ) => {
				const $this = $( elm );
				const hasImage = $this.closest( `.${ vars.classNames.settingField }` ).find( 'img' ).length;
				$this.toggle( ! isDefault && !! hasImage );
			} );

			// Toggle visibility for elements based on conditions.
			$hideForNone.toggle( ! isNone );
			$legacyNotice.toggle( isDefault );
			$backgroundControl.toggle( ( isDefault || ! isPro ) && ! isNone );

			// Toggle the light mode radio button based on the selected value.
			if ( isDefault ) {
				el.$appearance.find( vars.cache.appearance.light ).trigger( 'click' );
			}

			// Cache the class name for the legacy template.
			const { legacyTemplate: legacyTemplateClassName } = vars.classNames;

			// Toggle classes based on the selected value.
			el.$appearance.toggleClass( legacyTemplateClassName, isDefault );
			el.$colorScheme.toggleClass( legacyTemplateClassName, isDefault );
			el.$typography.toggleClass( legacyTemplateClassName, isDefault );

			// Update the background color.
			app.handleOnChangeBackgroundColor();
		},

		/**
		 * Callback for "Upload Image" button click.
		 *
		 * @since 1.8.6
		 */
		handleOnChangeHeaderImage() {
			// Update the background color.
			app.handleOnChangeBackgroundColor();

			// In case the current template is "Legacy" or image tag doesn't exist, return early.
			if ( app.isLegacyTemplate() || ! $( this ).prev( 'img' ).length ) {
				return;
			}

			// Show the image size dropdown menu.
			$( this ).parent().find( '.choices' ).show();
		},

		/**
		 * Callback for "Remove Image" button click.
		 *
		 * @since 1.8.5
		 */
		handleOnRemoveHeaderImage() {
			$( this ).closest( `.${ vars.classNames.settingsRow }` ).removeClass( 'has-external-image-url' );
		},

		/**
		 * Callback for the image size select input change.
		 *
		 * @since 1.8.5
		 */
		handleOnUpdateImageSize() {
			// Get the wrapper tag.
			const $wrapper = $( this ).closest( `.${ vars.classNames.settingsRow }` );
			// Get the selected value.
			const value = $( this ).val();

			// Remove the previous image size class.
			$wrapper.removeClass( ( index, className ) => ( className.match( /has-image-size-\w+/g ) || [] ).join( ' ' ) );
			// Add the new image size class.
			$wrapper.addClass( `has-image-size-${ value }` );
		},

		/**
		 * Callback for the background color picker input change.
		 *
		 * @since 1.8.6
		 */
		handleOnChangeBackgroundColor() {
			const [ lightBackgroundColor, darkBackgroundColor ] = app.getBackgroundColors();

			// Sync the background color value.
			app.syncBackgroundColors( lightBackgroundColor, darkBackgroundColor );
		},

		/**
		 * Callback for the body background and text color picker input changes.
		 *
		 * @since 1.8.6
		 */
		handleOnContrastChange() {
			// Bail if the color contrast checker is not available.
			if ( ! window.WPFormsColorContrastChecker ) {
				return;
			}

			// Define class names for elements.
			const { noticeWarning: noticeClassName, settingsRow: settingsRowClassName } = vars.classNames;

			// Define color arrays for different elements.
			const textColors = [
				vars.cache.colors.light.text,
				vars.cache.colors.dark.text,
			];

			textColors.forEach( ( textColor ) => {
				// Select color input elements.
				const $textColor = $( textColor );
				const $bodyColor = $textColor.parent().prev().prev().find( 'input' );

				// Create a color contrast checker instance.
				const contrastChecker = new window.WPFormsColorContrastChecker( {
					textColor: $textColor.val(),
					bgColor: $bodyColor.val(),
					message: {
						contrastPass: '',
						contrastFail: l10n?.contrast_fail || '',
					},
				} );

				// Check the color contrast.
				const contrastMessage = contrastChecker.checkContrast();

				// Bail if there's no contrast message and the notice is not present.
				if ( ! contrastMessage ) {
					const $settingsRow = $textColor.closest( `.${ settingsRowClassName }` );
					$settingsRow.find( `.${ noticeClassName }` ).remove();
					return;
				}

				// Bail if the notice is already present.
				const $settingsRow = $textColor.closest( `.${ settingsRowClassName }` );
				if ( $settingsRow.find( `.${ noticeClassName }` ).length ) {
					return;
				}

				// Append contrast notice.
				$settingsRow.append( `<div class="${ noticeClassName }"><p>${ window.wp.escapeHtml.escapeHTML( contrastMessage ) }</p></div>` );
			} );
		},

		/**
		 * Callback for input changes.
		 * This method is used to update the preview URL.
		 *
		 * @since 1.8.6
		 */
		handleOnPreviewChanges() {
			// Bail if the XOR encryption is not available.
			if ( ! window.WPFormsXOR ) {
				return;
			}

			// Get the current input.
			const $this = $( this );

			// Extract the 'name' attribute.
			const name = $this.attr( 'name' );

			// Extract the ID from the 'name' attribute using a regex.
			// Explanation:
			// - /\[([^[\]]+)]/i: Match square brackets and capture the content inside.
			// - ( || [] )[1]: Use the captured content, or an empty array if not found.
			// - || name: If still not found, fallback to the original 'name'.
			// - replace(/-/g, '_'): Replace dashes with underscores in the ID.
			const id = ( ( name.match( /\[([^[\]]+)]/i ) || [] )[ 1 ] || name ).replace( /-/g, '_' );

			// Get the current input value.
			const value = $this.val();

			// Destructure utility functions from the wp.url object.
			const { isURL, addQueryArgs, getQueryArg } = wp.url;

			// Query argument name.
			const queryArgName = 'wpforms_email_style_overrides';

			// Create an XOR instance.
			const xorInstance = new window.WPFormsXOR();

			// Filter and update the href attribute for elements with class 'wpforms-btn-preview'.
			$( '.wpforms-btn-preview' )
				.filter( ( index, elm ) => isURL( $( elm ).attr( 'href' ) ) )
				.attr( 'href', ( index, oldHref ) => {
					const existingOverrides = xorInstance.decrypt( getQueryArg( oldHref, queryArgName ) );
					const updatedOverrides = { ...existingOverrides, [ id ]: value };
					const updatedQueryString = xorInstance.encrypt( updatedOverrides );
					return addQueryArgs( oldHref, { [ queryArgName ]: updatedQueryString } );
				} );
		},

		/**
		 * Callback for the appearance mode toggle.
		 *
		 * @since 1.8.6
		 */
		handleOnAppearanceModeToggle() {
			// Reference to the clicked radio button.
			const $this = $( this );

			// Define class names for elements.
			const { hide: hideClassName, settingField: settingFieldClassName } = vars.classNames;

			// Get the value of the selected radio button.
			const selected = $this.val();

			// Find the closest setting field container.
			const $settingField = $this.closest( `.${ settingFieldClassName }` );

			// Find the unselected radio button within the same setting field.
			const $unselectedInput = $settingField.find( 'input:not(:checked)' );

			// Get the value of the unselected radio button.
			const unselected = $unselectedInput.val();

			$( `.email-${ selected }-mode` ).removeClass( hideClassName );
			$( `.email-${ unselected }-mode` ).addClass( hideClassName );
		},

		/**
		 * Relocate image size select input for styling purposes.
		 *
		 * @since 1.8.5
		 */
		relocateImageSize() {
			const $imgSize = $( '.wpforms-email-header-image-size' );

			// Bail if there is no "Remove Image" button.
			if ( $imgSize.length === 0 ) {
				return;
			}

			$imgSize.each( ( index, elm ) => {
				const $this = $( elm );
				const $select = $this.find( 'select' );

				// Bail if there is no select element.
				if ( $select.length === 0 ) {
					return;
				}

				// Get the header image element.
				const $headerImage = $this.prev();

				// Move the select element before the "Remove Image" button.
				$headerImage.find( '.wpforms-setting-remove-image' ).before( $select.get( 0 ).outerHTML );

				// Remove the original select element.
				$select.remove();

				try {
					// Cache the new select input.
					const $newSelect = $headerImage.find( 'select' );
					// Add the image size class. Note that the default value is 140.
					$headerImage.addClass( `has-image-size-${ $newSelect.val() || 'medium' }` );
					// Bind the change event, and update the image size class.
					$newSelect.on( 'change', app.handleOnUpdateImageSize );
					// Initialize Choices.
					new Choices( $newSelect.get( 0 ), {
						searchEnabled: false,
						shouldSort: false,
						itemSelectText: '',
					} );

					// Check if it's a legacy template and adjust settings accordingly.
					if ( app.isLegacyTemplate() ) {
						el.$wrapper.find( `.${ vars.classNames.noticeLegacy }` ).show();
						$headerImage.find( '.choices' ).hide();
					}
				} catch ( e ) {
					// Handle any potential errors, but continue execution.
					// eslint-disable-next-line no-console
					console.error( 'Error during relocation:', e );
				}
			} );
		},

		/**
		 * Determine whether the currently selected template is the "Legacy" template.
		 * Legacy template is the one that its value is 'default'.
		 *
		 * @since 1.8.6
		 *
		 * @return {boolean} True if the current template is legacy.
		 */
		isLegacyTemplate() {
			return el.$wrapper.find( '.wpforms-setting-row-email_template input:checked' ).val() === 'default';
		},

		/**
		 * Get background colors for light and dark modes.
		 *
		 * This function retrieves the visible background color or falls back to the default one
		 * for both light and dark modes.
		 *
		 * @since 1.8.6
		 *
		 * @return {Array} An array containing background colors for light and dark modes.
		 */
		getBackgroundColors() {
			// Get the visible background color or the default one.
			const getVisibleBackgroundColor = ( selector, fallbackSelector ) => {
				const visibleColor = el.$wrapper.find( `${ selector }:visible` ).val();
				return visibleColor || el.$wrapper.find( fallbackSelector ).val();
			};

			// Return an array of background colors for light and dark modes.
			return [
				getVisibleBackgroundColor( ...vars.cache.colors.light.background ),
				getVisibleBackgroundColor( ...vars.cache.colors.dark.background ),
			];
		},

		/**
		 * Sync the background color value.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} lightBackgroundColor The light background color in hex format.
		 * @param {string} darkBackgroundColor  The dark background color in hex format.
		 */
		syncBackgroundColors( lightBackgroundColor, darkBackgroundColor ) {
			// Bail if there is no light or dark background color.
			if ( ! lightBackgroundColor || ! darkBackgroundColor ) {
				return;
			}

			// Define color arrays for different elements.
			const backgrounds = [
				vars.cache.colors.light.background,
				vars.cache.colors.dark.background,
			];

			// Reflect the change in the color picker.
			for ( let i = 0; i < backgrounds.length; i++ ) {
				// Determine the color based on the loop index.
				const color = i === 0 ? lightBackgroundColor : darkBackgroundColor;

				// Select the corresponding image element based on the loop index.
				const $img = i === 0 ? $( '#wpforms-setting-row-email-header-image' ) : $( '#wpforms-setting-row-email-header-image-dark' );

				// Iterate over elements in the current color array.
				backgrounds[ i ].forEach( ( selector ) => {
					// Find the element using the selector.
					const $background = el.$wrapper.find( selector );

					// Set the color value for the element.
					$background.val( color );

					// Update the background color in the color picker swatch.
					$background.next().find( '.minicolors-swatch-color' ).css( 'backgroundColor', color );
				} );

				// Update the background color for the image element.
				$img.find( 'img' ).css( 'backgroundColor', color );
			}
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery, wpforms_admin_email_settings ) );

// Initialize.
WPFormsEmailSettings.init();
