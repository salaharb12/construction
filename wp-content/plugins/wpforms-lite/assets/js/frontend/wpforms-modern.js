/* global wpforms_settings, WPFormsUtils */

/**
 * @param wpforms_settings.css_vars
 * @param wpforms_settings.formErrorMessagePrefix
 * @param wpforms_settings.indicatorStepsPattern
 * @param wpforms_settings.submitBtnDisabled
 */

// noinspection ES6ConvertVarToLetConst
/**
 * Modern Frontend.
 *
 * @since 1.8.1
 */
// eslint-disable-next-line no-var
var WPForms = window.WPForms || {};

WPForms.FrontendModern = WPForms.FrontendModern || ( function( document, window, $ ) {
	// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.1
		 */
		init() {
			// Document ready.
			$( app.ready );
			app.bindOptinMonster();
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.1
		 */
		ready() {
			app.updateGBBlockAccentColors();
			app.initPageBreakButtons();
			app.initButtonStyle();
			app.events();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.1
		 */
		events() {
			$( document )
				.on( 'wpforms_elementor_form_fields_initialized', app.initPageBreakButtons );

			$( 'form.wpforms-form' )
				.on( 'wpformsCombinedUploadsSizeError', app.combinedUploadsSizeError )
				.on( 'wpformsFormSubmitButtonDisable', app.formSubmitButtonDisable )
				.on( 'wpformsFormSubmitButtonRestore', app.formSubmitButtonRestore )
				.on( 'wpformsPageChange', app.pageChange );

			$( 'form.wpforms-form .wpforms-submit' )
				.on( 'keydown click', app.disabledButtonPress );

			// Add styling to timepicker dropdown.
			$( document )
				.on( 'focus', '.wpforms-render-modern .wpforms-timepicker', app.updateTimepickerDropdown );

			// Reset timepicker dropdown styles.
			$( document )
				.on( 'focusout', '.wpforms-render-modern .wpforms-timepicker', app.resetTimepickerDropdown );
		},

		/**
		 * OptinMonster compatibility.
		 *
		 * Re-initialize after OptinMonster loads to accommodate changes that
		 * have occurred to the DOM.
		 *
		 * @since 1.9.0
		 */
		bindOptinMonster() {
			// OM v5.
			document.addEventListener( 'om.Campaign.load', function() {
				app.ready();
			} );

			// OM Legacy.
			$( document ).on( 'OptinMonsterOnShow', function() {
				app.ready();
			} );
		},

		/**
		 * Add styling to timepicker dropdown.
		 *
		 * @since 1.8.8
		 */
		updateTimepickerDropdown() {
			const cssVars = app.getCssVars( $( this ) );

			setTimeout(
				function() {
					const $list = $( '.ui-timepicker-wrapper .ui-timepicker-list' );

					$list.css( 'background', cssVars[ 'field-menu-color' ] );
					$list.find( 'li' ).css( 'color', cssVars[ 'field-text-color' ] );
					$list.find( '.ui-timepicker-selected' )
						.css( 'background', cssVars[ 'button-background-color' ] )
						.css( 'color', cssVars[ 'button-text-color' ] );
				},
				0
			);
		},

		/**
		 * Reset timepicker dropdown styles.
		 *
		 * @since 1.8.9.5
		 */
		resetTimepickerDropdown() {
			setTimeout(
				function() {
					const $list = $( '.ui-timepicker-wrapper .ui-timepicker-list' );

					$list.find( ':not(.ui-timepicker-selected)' ).attr( 'style', '' );
				},
				0
			);
		},

		/**
		 * Update accent colors of some fields in GB block in Modern Markup mode.
		 *
		 * @since 1.8.8
		 */
		initButtonStyle() {
			// Loop through all the GB blocks on the page.
			$( '.wpforms-block.wpforms-container-full, .elementor-widget-wpforms .wpforms-container-full' ).each( function() {
				const $form = $( this );
				const contStyle = getComputedStyle( $form.get( 0 ) );
				const btnBgColor = app.getCssVar( contStyle, '--wpforms-button-background-color-alt' );

				if ( app.isTransparentColor( btnBgColor ) ) {
					$form.find( 'button.wpforms-submit' ).addClass( 'wpforms-opacity-hover' );
				}
			} );
		},

		/**
		 * Checks if the provided color has transparency.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} color The color to check.
		 *
		 * @return {boolean} Returns true if the color is transparent.
		 */
		isTransparentColor( color ) {
			const rgba = app.getColorAsRGBArray( color );

			// The max opacity value of the color that is considered as transparent.
			const opacityThreshold = 0.33;
			const opacity = Number( rgba?.[ 3 ] );

			// Compare the opacity value with the threshold.
			return opacity <= opacityThreshold;
		},

		/**
		 * Update accent colors of some fields in GB block in Modern Markup mode.
		 *
		 * @since 1.8.1
		 */
		updateGBBlockAccentColors() {
			// Loop through all the GB blocks on the page.
			$( '.wpforms-block.wpforms-container-full, .elementor-widget-wpforms .wpforms-container-full' ).each( function() {
				const $form = $( this );

				app.updateGBBlockPageIndicatorColor( $form );
				app.updateGBBlockIconChoicesColor( $form );
				app.updateGBBlockRatingColor( $form );
			} );
		},

		/**
		 * Update accent color of Page Indicator.
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} $form Form container.
		 */
		updateGBBlockPageIndicatorColor( $form ) {
			const $indicator = $form.find( '.wpforms-page-indicator' ),
				$indicatorPage = $indicator.find( '.wpforms-page-indicator-page-progress, .wpforms-page-indicator-page.active .wpforms-page-indicator-page-number' ),
				$indicatorTriangle = $indicatorPage.find( '.wpforms-page-indicator-page-triangle' );

			$indicator.data( 'indicator-color', 'var( --wpforms-page-break-color )' );
			$indicatorPage.css( 'background-color', 'var( --wpforms-page-break-color )' );
			$indicatorTriangle.css( 'border-top-color', 'var( --wpforms-page-break-color )' );
		},
		/**
		 * Update accent color of Icon Choices.
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} $form Form container.
		 */
		updateGBBlockIconChoicesColor( $form ) {
			$form
				.find( '.wpforms-icon-choices' )
				.css( '--wpforms-icon-choices-color', 'var( --wpforms-button-background-color )' );
		},

		/**
		 * Update accent color of Rating field.
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} $form Form container.
		 */
		updateGBBlockRatingColor( $form ) {
			$form
				.find( '.wpforms-field-rating-item svg' )
				.css( 'color', 'var( --wpforms-page-break-color, var( --wpforms-button-background-color ) )' );
		},

		/**
		 * Init Page Break fields.
		 *
		 * @since 1.8.1
		 */
		initPageBreakButtons() {
			$( '.wpforms-page-button' )
				.removeClass( 'wpforms-disabled' )
				.attr( 'aria-disabled', 'false' )
				.attr( 'aria-describedby', '' );
		},

		/**
		 * Handler for `wpformsCombinedUploadsSizeError` event.
		 * Accessibility enhancements to error container and submit button.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e         Event object.
		 * @param {jQuery} $form     Form object.
		 * @param {jQuery} $errorCnt Error container object.
		 */
		combinedUploadsSizeError( e, $form, $errorCnt ) {
			const formId = $form.data( 'formid' ),
				errormessage = $form.attr( 'aria-errormessage' ) || '',
				errorCntId = `wpforms-${ formId }-footer-error`,
				$submitBtn = $form.find( '.wpforms-submit' );

			$form.attr( {
				'aria-invalid': 'true',
				'aria-errormessage': `${ errormessage } ${ errorCntId }`,
			} );

			$errorCnt.attr( {
				role: 'alert',
				id: errorCntId,
			} );

			// Add error message prefix.
			$errorCnt.find( '> .wpforms-hidden:first-child' ).remove();
			$errorCnt.prepend( `<span class="wpforms-hidden">${ wpforms_settings.formErrorMessagePrefix }</span>` );

			// Instead of set the `disabled` property,
			// we must use `aria-disabled` and `aria-describedby` attributes in conduction with `wpforms-disabled` class.
			$submitBtn.attr( 'aria-describedby', errorCntId );
		},

		/**
		 * Handler for `wpformsCombinedUploadsSizeOk` event.
		 *
		 * @since 1.8.1
		 * @deprecated 1.8.3
		 *
		 * @param {Object} e         Event object.
		 * @param {jQuery} $form     Form object.
		 * @param {jQuery} $errorCnt Error container object.
		 */
		// eslint-disable-next-line no-unused-vars
		combinedUploadsSizeOk( e, $form, $errorCnt ) {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! Function "WPForms.FrontendModern( e, $form, $errorCnt )" has been deprecated, please use the new "formSubmitButtonDisable: function( e, $form, $submitBtn )" function instead!' );

			const $submitBtn = $form.find( '.wpforms-submit' );

			// Revert aria-* attributes to the normal state.
			$submitBtn
				.removeClass( 'wpforms-disabled' )
				.attr( 'aria-disabled', 'false' )
				.attr( 'aria-describedby', '' );
		},

		/**
		 * Handler for `wpformsFormSubmitButtonDisable` event.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e          Event object.
		 * @param {jQuery} $form      Form object.
		 * @param {jQuery} $submitBtn Submit a button object.
		 */
		formSubmitButtonDisable( e, $form, $submitBtn ) {
			const disabledBtnDescId = $form.attr( 'id' ) + '-submit-btn-disabled';

			$submitBtn.before( `<div class="wpforms-hidden" id="${ disabledBtnDescId }">${ wpforms_settings.submitBtnDisabled }</div>` );

			$submitBtn
				.prop( 'disabled', false )
				.addClass( 'wpforms-disabled' )
				.attr( 'aria-disabled', 'true' )
				.attr( 'aria-describedby', disabledBtnDescId );
		},

		/**
		 * Handler for `wpformsFormSubmitButtonRestore` event.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e          Event object.
		 * @param {jQuery} $form      Form object.
		 * @param {jQuery} $submitBtn Submit a button object.
		 */
		formSubmitButtonRestore( e, $form, $submitBtn ) {
			const disabledBtnDescId = $form.attr( 'id' ) + '-submit-btn-disabled';

			$form.find( '#' + disabledBtnDescId ).remove();

			$submitBtn
				.removeClass( 'wpforms-disabled' )
				.attr( 'aria-disabled', 'false' )
				.attr( 'aria-describedby', '' );
		},

		/**
		 * Disabled button click/keydown event handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e Event object.
		 */
		disabledButtonPress( e ) {
			const $submitBtn = $( this );

			if ( ! $submitBtn.hasClass( 'wpforms-disabled' ) ) {
				return;
			}

			if ( e.key === 'Enter' || e.type === 'click' ) {
				e.preventDefault();
				e.stopPropagation();
			}
		},

		/**
		 * Page change event handler.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} e        Event object.
		 * @param {number} nextPage The next page number.
		 * @param {jQuery} $form    Current form.
		 */
		pageChange( e, nextPage, $form ) {
			const $pageIndicator = $form.find( '.wpforms-page-indicator' );

			if ( ! wpforms_settings.indicatorStepsPattern || ! $pageIndicator.length ) {
				return;
			}

			const totalPages = $form.find( '.wpforms-page' ).length;
			let msg = wpforms_settings.indicatorStepsPattern;
			let pageTitle;

			msg = msg.replace( '{current}', nextPage ).replace( '{total}', totalPages );

			if ( $pageIndicator.hasClass( 'progress' ) ) {
				pageTitle = $pageIndicator.find( '.wpforms-page-indicator-page-title' ).data( `page-${ nextPage }-title` );
			} else {
				pageTitle = $pageIndicator.find( `.wpforms-page-indicator-page-${ nextPage } .wpforms-page-indicator-page-title` ).text();
			}

			msg = pageTitle ? pageTitle + '. ' + msg : msg;

			$pageIndicator.attr( 'aria-valuenow', nextPage );
			app.screenReaderAnnounce( msg, 'polite' );
		},

		/**
		 * Allows the screen reader to talk directly through the use of JS.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} text     The message to be vocalised
		 * @param {string} priority Aria-live priority. "polite" (by default) or "assertive".
		 */
		screenReaderAnnounce( text, priority ) {
			const el = document.createElement( 'div' );
			const id = 'wpforms-screen-reader-announce-' + Date.now();

			el.setAttribute( 'id', id );
			el.setAttribute( 'aria-live', priority || 'polite' );
			el.classList.add( 'wpforms-screen-reader-announce' );

			const node = document.body.appendChild( el );

			setTimeout( function() {
				node.innerHTML = text;
			}, 100 );

			setTimeout( function() {
				document.body.removeChild( node );
			}, 1000 );
		},

		/**
		 * Add opacity to color string.
		 * Supports formats: RGB, RGBA, HEX, HEXA.
		 *
		 * If the given color has an alpha channel, the new alpha channel will be calculated according to the given opacity.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} color   Color.
		 * @param {string} opacity Opacity.
		 *
		 * @return {string} Color in RGBA format with an added alpha channel according to given opacity.
		 */
		getColorWithOpacity( color, opacity ) {
			// Moved to ../share/utils.js
			return WPFormsUtils.cssColorsUtils.getColorWithOpacity( color, opacity );
		},

		/**
		 * Remove opacity from the color value.
		 * Supports formats: RGB, RGBA, HEX, HEXA.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} color Color.
		 *
		 * @return {string} Color in RGB format.
		 */
		getSolidColor( color ) {
			color = color.trim();

			const rgbArray = app.getColorAsRGBArray( color );

			if ( ! rgbArray ) {
				return color;
			}

			// Combine and return the RGB color.
			return `rgb(${ rgbArray[ 0 ] },${ rgbArray[ 1 ] },${ rgbArray[ 2 ] })`;
		},

		/**
		 * Check if the given color is a valid CSS color.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} color Color.
		 *
		 * @return {boolean} True if the given color is a valid CSS color.
		 */
		isValidColor( color ) {
			// Moved to ../share/utils.js
			return WPFormsUtils.cssColorsUtils.isValidColor( color );
		},

		/**
		 * Get color as an array of RGB(A) values.
		 *
		 * @since 1.8.1
		 *
		 * @param {string} color Color.
		 *
		 * @return {Array|boolean} Color as an array of RGBA values. False on error.
		 */
		getColorAsRGBArray( color ) {
			// Moved to ../share/utils.js
			return WPFormsUtils.cssColorsUtils.getColorAsRGBArray( color );
		},

		/**
		 * Get CSS variable value.
		 *
		 * @since 1.8.1
		 *
		 * @param {Object} style   Computed style object.
		 * @param {string} varName Style custom property name.
		 *
		 * @return {string|null} CSS variable value;
		 */
		getCssVar( style, varName ) {
			if ( ! style || typeof style.getPropertyValue !== 'function' ) {
				return null;
			}

			let value = style.getPropertyValue( varName ).trim();

			if ( varName.includes( 'color' ) ) {
				value = value.replace( /\s/g, '' );
			}

			return value;
		},

		/**
		 * Get all CSS variables.
		 *
		 * @since 1.8.1
		 *
		 * @param {jQuery} $form Form OR any element inside the form.
		 *
		 * @return {Object} CSS variables;
		 */
		getCssVars( $form ) {
			if ( ! $form || ! $form.length ) {
				return null;
			}

			const $cont = $form.hasClass( 'wpforms-container' ) ? $form : $form.closest( '.wpforms-container' );
			const contStyle = getComputedStyle( $cont.get( 0 ) );
			const cssVars = wpforms_settings.css_vars;
			const vars = {};

			for ( let i = 0; i < cssVars.length; i++ ) {
				vars[ cssVars[ i ] ] = app.getCssVar( contStyle, '--wpforms-' + cssVars[ i ] );
			}

			return vars;
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.FrontendModern.init();
