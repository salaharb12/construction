/* global wpforms_settings */

( function() {
	/**
	 * Predefine hint text to display.
	 *
	 * @since 1.5.6
	 * @since 1.6.4 Added a new macros - {remaining}.
	 *
	 * @param {string} hintText Hint text.
	 * @param {number} count    Current count.
	 * @param {number} limit    Limit to.
	 *
	 * @return {string} Predefined hint text.
	 */
	function renderHint( hintText, count, limit ) {
		return hintText.replace( '{count}', count ).replace( '{limit}', limit ).replace( '{remaining}', limit - count );
	}

	/**
	 * Create HTMLElement hint element with text.
	 *
	 * @since 1.5.6
	 *
	 * @param {number|string} formId  Form id.
	 * @param {number|string} fieldId Form field id.
	 * @param {string}        text    Hint text.
	 *
	 * @return {Object} HTMLElement hint element with text.
	 */
	function createHint( formId, fieldId, text ) {
		const hint = document.createElement( 'div' );

		formId = typeof formId === 'object' ? '' : formId;
		fieldId = typeof fieldId === 'object' ? '' : fieldId;

		hint.classList.add( 'wpforms-field-limit-text' );
		hint.id = 'wpforms-field-limit-text-' + formId + '-' + fieldId;
		hint.setAttribute( 'aria-live', 'polite' );
		hint.textContent = text;

		return hint;
	}

	/**
	 * Keyup/Keydown event higher order function for characters limit.
	 *
	 * @since 1.5.6
	 *
	 * @param {Object} hint  HTMLElement hint element.
	 * @param {number} limit Max allowed number of characters.
	 *
	 * @return {Function} Handler function.
	 */
	function checkCharacters( hint, limit ) {
		// noinspection JSUnusedLocalSymbols
		return function( e ) { // eslint-disable-line no-unused-vars
			hint.textContent = renderHint(
				window.wpforms_settings.val_limit_characters,
				this.value.length,
				limit
			);
		};
	}

	/**
	 * Count words in the string.
	 *
	 * @since 1.6.2
	 *
	 * @param {string} string String value.
	 *
	 * @return {number} Words count.
	 */
	function countWords( string ) {
		if ( typeof string !== 'string' ) {
			return 0;
		}

		if ( ! string.length ) {
			return 0;
		}

		[
			/([A-Z]+),([A-Z]+)/gi,
			/([0-9]+),([A-Z]+)/gi,
			/([A-Z]+),([0-9]+)/gi,
		].forEach( function( pattern ) {
			string = string.replace( pattern, '$1, $2' );
		} );

		return string.split( /\s+/ ).length;
	}

	/**
	 * Keyup/Keydown event higher order function for words limit.
	 *
	 * @since 1.5.6
	 *
	 * @param {Object} hint  HTMLElement hint element.
	 * @param {number} limit Max allowed number of characters.
	 *
	 * @return {Function} Handler function.
	 */
	function checkWords( hint, limit ) {
		return function( e ) {
			const value = this.value.trim(),
				words = countWords( value );

			hint.textContent = renderHint(
				window.wpforms_settings.val_limit_words,
				words,
				limit
			);

			// We should prevent the keys: Enter, Space, Comma.
			if ( [ 13, 32, 188 ].indexOf( e.keyCode ) > -1 && words >= limit ) {
				e.preventDefault();
			}
		};
	}

	/**
	 * Get passed text from the clipboard.
	 *
	 * @since 1.5.6
	 *
	 * @param {ClipboardEvent} e Clipboard event.
	 *
	 * @return {string} Text from clipboard.
	 */
	function getPastedText( e ) {
		if ( window.clipboardData && window.clipboardData.getData ) { // IE
			return window.clipboardData.getData( 'Text' );
		} else if ( e.clipboardData && e.clipboardData.getData ) {
			return e.clipboardData.getData( 'text/plain' );
		}

		return '';
	}

	/**
	 * Paste event higher order function for character limit.
	 *
	 * @since 1.6.7.1
	 *
	 * @param {number} limit Max allowed number of characters.
	 *
	 * @return {Function} Event handler.
	 */
	function pasteText( limit ) {
		return function( e ) {
			e.preventDefault();

			const pastedText = getPastedText( e ),
				newPosition = this.selectionStart + pastedText.length,
				newText = this.value.substring( 0, this.selectionStart ) + pastedText + this.value.substring( this.selectionStart );

			this.value = newText.substring( 0, limit );
			this.setSelectionRange( newPosition, newPosition );
		};
	}

	/**
	 * Limit string length to a certain number of words, preserving line breaks.
	 *
	 * @since 1.6.8
	 *
	 * @param {string} text  Text.
	 * @param {number} limit Max allowed number of words.
	 *
	 * @return {string} Text with the limited number of words.
	 */
	function limitWords( text, limit ) {
		let result = '';

		// Regular expression pattern: match any space character.
		const regEx = /\s+/g;

		// Store separators for further join.
		const separators = text.trim().match( regEx ) || [];

		// Split the new text by regular expression.
		const newTextArray = text.split( regEx );

		// Limit the number of words.
		newTextArray.splice( limit, newTextArray.length );

		// Join the words together using stored separators.
		for ( let i = 0; i < newTextArray.length; i++ ) {
			result += newTextArray[ i ] + ( separators[ i ] || '' );
		}

		return result.trim();
	}

	/**
	 * Paste event higher order function for words limit.
	 *
	 * @since 1.5.6
	 *
	 * @param {number} limit Max allowed number of words.
	 *
	 * @return {Function} Event handler.
	 */
	function pasteWords( limit ) {
		return function( e ) {
			e.preventDefault();

			const pastedText = getPastedText( e ),
				newPosition = this.selectionStart + pastedText.length,
				newText = this.value.substring( 0, this.selectionStart ) + pastedText + this.value.substring( this.selectionStart );

			this.value = limitWords( newText, limit );
			this.setSelectionRange( newPosition, newPosition );
		};
	}

	/**
	 * Array.from polyfill.
	 *
	 * @since 1.5.6
	 *
	 * @param {Object} el Iterator.
	 *
	 * @return {Object} Array.
	 */
	function arrFrom( el ) {
		return [].slice.call( el );
	}

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.9
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * Init text limit hint.
		 *
		 * @since 1.8.9
		 *
		 * @param {string} context Context selector.
		 */
		initHint( context ) {
			arrFrom( document.querySelectorAll( context + ' .wpforms-limit-characters-enabled' ) )
				.map(
					function( e ) { // eslint-disable-line array-callback-return
						const limit = parseInt( e.dataset.textLimit, 10 ) || 0;

						e.value = e.value.slice( 0, limit );

						const hint = createHint(
							e.dataset.formId,
							e.dataset.fieldId,
							renderHint(
								wpforms_settings.val_limit_characters,
								e.value.length,
								limit
							)
						);

						const fn = checkCharacters( hint, limit );

						e.parentNode.appendChild( hint );
						e.addEventListener( 'keydown', fn );
						e.addEventListener( 'keyup', fn );
						e.addEventListener( 'paste', pasteText( limit ) );
					}
				);

			arrFrom( document.querySelectorAll( context + ' .wpforms-limit-words-enabled' ) )
				.map(
					function( e ) { // eslint-disable-line array-callback-return
						const limit = parseInt( e.dataset.textLimit, 10 ) || 0;

						e.value = limitWords( e.value, limit );

						const hint = createHint(
							e.dataset.formId,
							e.dataset.fieldId,
							renderHint(
								wpforms_settings.val_limit_words,
								countWords( e.value.trim() ),
								limit
							)
						);

						const fn = checkWords( hint, limit );

						e.parentNode.appendChild( hint );

						e.addEventListener( 'keydown', fn );
						e.addEventListener( 'keyup', fn );
						e.addEventListener( 'paste', pasteWords( limit ) );
					}
				);
		},
	};

	/**
	 * DOMContentLoaded handler.
	 *
	 * @since 1.5.6
	 */
	function ready() {
		// Expose to the world.
		window.WPFormsTextLimit = app;

		app.initHint( 'body' );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', ready );
	} else {
		ready();
	}
}() );
