/* global WPFormsAIChatHTMLElement, WPFormsBuilder, wpf, wpforms_builder */

/**
 * The WPForms AI chat element.
 *
 * Choices helpers module.
 *
 * @since 1.9.1
 *
 * @param {WPFormsAIChatHTMLElement} chat The chat element.
 *
 * @return {Object} The choices' helpers object.
 */
export default function( chat ) { // eslint-disable-line max-lines-per-function
	/**
	 * The `choices` mode helpers object.
	 *
	 * @since 1.9.1
	 */
	return {
		/**
		 * Get the `choices` answer based on AI response data.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} response The response data.
		 *
		 * @return {string} Answer HTML markup.
		 */
		getAnswer( response ) {
			if ( response.choices?.length < 1 ) {
				return '';
			}

			const li = [];

			for ( const i in response.choices ) {
				li.push( `
					<li class="wpforms-ai-chat-choices-item">
						${ chat.htmlSpecialChars( response.choices[ i ] ) }
					</li>
				` );
			}

			let answerHtml = `
				<h4>${ chat.htmlSpecialChars( response.heading ?? '' ) }</h4>
				<ol>
					${ li.join( '' ) }
				</ol>
			`;

			// Add footer to the first answer only.
			if ( ! chat.sessionId ) {
				answerHtml += `<span>${ chat.modeStrings.footer }</span>`;
			}

			return answerHtml;
		},

		/**
		 * Get the answer pre-buttons HTML markup.
		 *
		 * @since 1.9.1
		 *
		 * @return {string} The answer pre-buttons HTML markup.
		 */
		getAnswerButtonsPre() {
			return `
				<button type="button" class="wpforms-ai-chat-choices-insert wpforms-ai-chat-answer-action wpforms-btn-sm wpforms-btn-orange" >
					<span>${ chat.modeStrings.insert }</span>
				</button>
			`;
		},

		/**
		 * Get the warning message HTML markup.
		 *
		 * @since 1.9.1
		 *
		 * @return {string} The warning message HTML markup.
		 */
		getWarningMessage() {
			// Trigger event before warning message insert.
			chat.triggerEvent( 'wpformsAIModalBeforeWarningMessageInsert', { fieldId: chat.fieldId } );

			return `<div class="wpforms-ai-chat-divider"></div>
					<div class="wpforms-chat-item-notice">
						<div class="wpforms-chat-item-notice-content">
							<span>${ chat.modeStrings.warning }</span>
						</div>
					</div>`;
		},

		/**
		 * If the field has default choices, the welcome screen is active.
		 *
		 * @since 1.9.1
		 *
		 * @return {boolean} True if the field has default choices, false otherwise.
		 */
		isWelcomeScreen() {
			const items = document.getElementById( `wpforms-field-option-row-${ chat.fieldId }-choices` )
				.querySelectorAll( 'li input.label' );

			if ( items.length === 1 && ! items[ 0 ].value.trim() ) {
				return true;
			}

			if ( items.length > 3 ) {
				return false;
			}

			const defaults = Object.values( chat.modeStrings.defaults );

			for ( let i = 0; i < items.length; i++ ) {
				if ( ! defaults.includes( items[ i ].value ) ) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Add the `choices` answer.
		 *
		 * @since 1.9.1
		 *
		 * @param {HTMLElement} element The answer element.
		 */
		addedAnswer( element ) {
			const button = element.querySelector( '.wpforms-ai-chat-choices-insert' );

			// Listen to the button click event.
			button?.addEventListener( 'click', this.insertButtonClick.bind( this ) );
		},

		/**
		 * Sanitize response.
		 *
		 * @since 1.9.2
		 *
		 * @param {Object} response The response data to sanitize.
		 *
		 * @return {Object} The sanitized response.
		 */
		sanitizeResponse( response ) {
			if ( ! Array.isArray( response?.choices ) ) {
				return response;
			}

			let choices = response.choices;

			// Sanitize choices.
			choices = choices.map( ( choice ) => {
				return wpf.sanitizeHTML( choice, wpforms_builder.allowed_label_html_tags );
			} );

			// Remove empty choices.
			response.choices = choices.filter( ( choice ) => {
				return choice.trim() !== '';
			} );

			return response;
		},

		/**
		 * Check if the response has a prohibited code.
		 *
		 * @since 1.9.2
		 *
		 * @param {Object} response          The response data.
		 * @param {Array}  sanitizedResponse The sanitized response data.
		 *
		 * @return {boolean} Whether the answer has a prohibited code.
		 */
		hasProhibitedCode( response, sanitizedResponse ) {
			// If the number of choices has changed after sanitization, it means that the answer contains prohibited code.
			return sanitizedResponse?.choices?.length !== response?.choices?.length;
		},

		/**
		 * Click on the Use Choices button.
		 *
		 * @since 1.9.1
		 *
		 * @param {Event} e The event object.
		 */
		insertButtonClick( e ) {
			const button = e.target;
			const answer = button.closest( '.wpforms-chat-item.wpforms-chat-item-choices' );
			const responseId = answer?.getAttribute( 'data-response-id' );
			const choicesList = answer?.querySelector( 'ol' );
			const items = choicesList.querySelectorAll( '.wpforms-ai-chat-choices-item' );
			const choiceItems = [];

			// Get choices data.
			for ( const i in items ) {
				if ( ! items.hasOwnProperty( i ) || ! items[ i ].textContent ) {
					continue;
				}

				choiceItems.push( items[ i ].textContent.trim() );
			}

			// Rate the response.
			chat.wpformsAiApi.rate( true, responseId );

			// Replace field choices.
			this.replaceChoices( choiceItems );
		},

		/**
		 * Replace field choices.
		 *
		 * @since 1.9.1
		 *
		 * @param {Array} choices Choices array.
		 */
		replaceChoices( choices ) {
			const choicesOptionRow = document.getElementById( `wpforms-field-option-row-${ chat.fieldId }-choices` );
			const choicesList = choicesOptionRow.querySelector( 'ul.choices-list' );
			const choiceRow = choicesList.querySelector( 'li:first-child' ).cloneNode( true );

			choiceRow.innerHTML = choiceRow.innerHTML.replace( /\[choices\]\[\d+\]/g, `[choices][{{key}}]` );

			// Clear existing choices.
			choicesList.innerHTML = '';

			// Add new choices.
			for ( const i in choices ) {
				const key = ( Number( i ) + 1 ).toString();
				const choice = choices[ i ];

				// Clone choice item element.
				let li = choiceRow.cloneNode( true );

				// Get updated single choice item.
				li = this.getUpdatedSingleChoiceItem( li, key, choice );

				// Add new choice item.
				choicesList.appendChild( li );
			}

			// Update data-next-id attribute for choices list.
			choicesList.setAttribute( 'data-next-id', choices.length + 1 );

			// Update field preview.
			const fieldOptions = document.getElementById( `wpforms-field-option-${ chat.fieldId }` );
			const fieldType = fieldOptions.querySelector( 'input.wpforms-field-option-hidden-type' )?.value;

			WPFormsBuilder.fieldChoiceUpdate( fieldType, chat.fieldId, choices.length );
			WPFormsBuilder.triggerBuilderEvent( 'wpformsFieldChoiceAdd' );

			// Trigger event after choices insert.
			chat.triggerEvent( 'wpformsAIModalAfterChoicesInsert', { fieldId: chat.fieldId } );
		},

		/**
		 * Get updated single choice item.
		 *
		 * @since 1.9.1
		 *
		 * @param {HTMLElement} li     Choice item element.
		 * @param {string}      key    Choice key.
		 * @param {string}      choice Choice value.
		 *
		 * @return {HTMLElement} The updated choice item.
		 */
		getUpdatedSingleChoiceItem( li, key, choice ) {
			li.setAttribute( 'data-key', key.toString() );

			// Update choice item inputs name attributes.
			li.innerHTML = li.innerHTML.replaceAll( '{{key}}', key );

			// Sanitize choice before set.
			choice = wpf.sanitizeHTML( choice );

			const inputDefault = li.querySelector( 'input.default' );

			inputDefault.removeAttribute( 'checked' );

			// Set label
			const inputLabel = li.querySelector( 'input.label' );

			inputLabel.value = choice;
			inputLabel.setAttribute( 'value', choice );

			// Set value.
			const inputValue = li.querySelector( 'input.value' );

			inputValue.value = choice;
			inputValue.setAttribute( 'value', choice );

			// Reset image upload.
			const imageUpload = li.querySelector( '.wpforms-image-upload' );
			const inputImage = imageUpload.querySelector( 'input.source' );

			inputImage.value = '';
			inputImage.setAttribute( 'value', '' );
			imageUpload.querySelector( '.preview' ).innerHTML = '';
			imageUpload.querySelector( '.wpforms-image-upload-add' ).style.display = 'block';

			// Reset icon choice.
			const iconSelect = li.querySelector( '.wpforms-icon-select' );

			iconSelect.querySelector( '.ic-fa-preview' ).setAttribute( 'class', 'ic-fa-preview ic-fa-regular ic-fa-face-smile' );
			iconSelect.querySelector( 'input.source-icon' ).value = 'face-smile';
			iconSelect.querySelector( 'input.source-icon-style' ).value = 'regular';

			return li;
		},
	};
}
