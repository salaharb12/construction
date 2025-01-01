/* global wpforms_ai_chat_element, WPFormsAIModal, wpforms_builder, wpf */

/**
 * @param this.modeStrings.learnMore
 * @param wpforms_ai_chat_element.dislike
 * @param wpforms_ai_chat_element.refresh
 * @param wpforms_ai_chat_element.confirm.refreshTitle
 * @param wpforms_ai_chat_element.confirm.refreshMessage
 * @param this.modeStrings.samplePrompts
 * @param this.modeStrings.errors.rate_limit
 * @param this.modeStrings.reasons.rate_limit
 * @param this.modeStrings.descrEndDot
 */

/**
 * The `WPFormsAIChatHTMLElement` element loader.
 *
 * @since 1.9.2
 */
( function() {
	const min = wpforms_ai_chat_element.min;

	// Dynamic modules import.
	Promise.all( [
		import( `./modules/api${ min }.js` ),
		import( `./modules/helpers-text${ min }.js` ),
		import( `./modules/helpers-choices${ min }.js` ),
		wpforms_builder.pro ? import( `../../../pro/js/integrations/ai/form-generator/modules/chat-helpers-forms${ min }.js` ) : null,
	] )
		.then( ( [ apiModule, helpersText, helpersChoices, helpersForms ] ) => {
			window.WPFormsAi = {
				api: apiModule.default(),
				helpers: {
					text: helpersText.default,
					choices: helpersChoices.default,
					forms: helpersForms?.default,
				},
			};

			// Register the custom HTML element.
			customElements.define( 'wpforms-ai-chat', WPFormsAIChatHTMLElement ); // eslint-disable-line no-use-before-define
		} );
}() );

/**
 * The WPForms AI chat.
 *
 * Custom HTML element class.
 *
 * @since 1.9.1
 */
class WPFormsAIChatHTMLElement extends HTMLElement {
	/**
	 * Element constructor.
	 *
	 * @since 1.9.1
	 */
	constructor() { // eslint-disable-line no-useless-constructor
		// Always call super first in constructor.
		super();
	}

	/**
	 * Element connected to the DOM.
	 *
	 * @since 1.9.1
	 */
	connectedCallback() { // eslint-disable-line complexity
		// Init chat properties.
		this.chatMode = this.getAttribute( 'mode' ) ?? 'text';
		this.fieldId = this.getAttribute( 'field-id' ) ?? '';
		this.modeStrings = wpforms_ai_chat_element[ this.chatMode ] ?? {};
		this.loadingState = false;

		// Init chat helpers according to the chat mode.
		this.modeHelpers = this.getHelpers( this );

		// Bail if chat mode helpers not found.
		if ( ! this.modeHelpers ) {
			console.error( `WPFormsAI error: chat mode "${ this.chatMode }" helpers not found` ); // eslint-disable-line no-console

			return;
		}

		// Render chat HTML.
		if ( ! this.innerHTML.trim() ) {
			this.innerHTML = this.getInnerHTML();
		}

		// Get chat elements.
		this.wrapper = this.querySelector( '.wpforms-ai-chat' );
		this.input = this.querySelector( '.wpforms-ai-chat-message-input input, .wpforms-ai-chat-message-input textarea' );
		this.welcomeScreenSamplePrompts = this.querySelector( '.wpforms-ai-chat-welcome-screen-sample-prompts' );
		this.sendButton = this.querySelector( '.wpforms-ai-chat-send' );
		this.stopButton = this.querySelector( '.wpforms-ai-chat-stop' );
		this.messageList = this.querySelector( '.wpforms-ai-chat-message-list' );

		// Flags.
		this.isTextarea = this.input.tagName === 'TEXTAREA';
		this.preventResizeInput = false;

		// Compact scrollbar for non-Mac devices.
		if ( ! navigator.userAgent.includes( 'Macintosh' ) ) {
			this.messageList.classList.add( 'wpforms-scrollbar-compact' );
		}

		// Bind events.
		this.events();

		// Init answers.
		this.initAnswers();

		// Init mode.
		if ( typeof this.modeHelpers.init === 'function' ) {
			this.modeHelpers.init();
		}
	}

	/**
	 * Get initial innerHTML markup.
	 *
	 * @since 1.9.1
	 *
	 * @return {string} The inner HTML markup.
	 */
	getInnerHTML() {
		if ( this.modeStrings.chatHtml ) {
			return this.decodeHTMLEntities( this.modeStrings.chatHtml );
		}

		return `
			<div class="wpforms-ai-chat">
				<div class="wpforms-ai-chat-message-list">
					${ this.getWelcomeScreen() }
				</div>
				<div class="wpforms-ai-chat-message-input">
					${ this.getMessageInputField() }
					<button type="button" class="wpforms-ai-chat-send"></button>
					<button type="button" class="wpforms-ai-chat-stop wpforms-hidden"></button>
				</div>
			</div>
		`;
	}

	/**
	 * Get the message input field HTML.
	 *
	 * @since 1.9.2
	 *
	 * @return {string} The message input field markup.
	 */
	getMessageInputField() {
		if ( typeof this.modeHelpers.getMessageInputField === 'function' ) {
			return this.modeHelpers.getMessageInputField();
		}

		return `<input type="text" placeholder="${ this.modeStrings.placeholder }">`;
	}

	/**
	 * Get the Welcome screen HTML markup.
	 *
	 * @since 1.9.1
	 *
	 * @return {string} The Welcome screen markup.
	 */
	getWelcomeScreen() {
		const samplePrompts = this.modeStrings.samplePrompts;
		const li = [];
		let content;

		if ( this.modeHelpers.isWelcomeScreen() ) {
			// Render sample prompts.
			for ( const i in samplePrompts ) {
				li.push( `
					<li>
						<i class="${ samplePrompts[ i ].icon }"></i>
						<a href="#">${ samplePrompts[ i ].title }</a>
					</li>
				` );
			}

			content = `
				<ul class="wpforms-ai-chat-welcome-screen-sample-prompts">
					${ li.join( '' ) }
				</ul>
			`;
		} else {
			this.messagePreAdded = true;
			content = this.modeHelpers.getWarningMessage();
		}

		return `
			<div class="wpforms-ai-chat-message-item item-primary">
				<div class="wpforms-ai-chat-welcome-screen">
					<div class="wpforms-ai-chat-header">
						<h3 class="wpforms-ai-chat-header-title">${ this.modeStrings.title }</h3>
						<span class="wpforms-ai-chat-header-description">${ this.modeStrings.description }
							<a href="${ this.modeStrings.learnMoreUrl }" target="_blank" rel="noopener noreferrer">${ this.modeStrings.learnMore }</a>${ this.modeStrings.descrEndDot }
						</span>
					</div>
					${ content }
				</div>
			</div>
		`;
	}

	/**
	 * Get the spinner SVG image.
	 *
	 * @since 1.9.1
	 *
	 * @return {string} The spinner SVG markup.
	 */
	getSpinnerSvg() {
		return `<svg class="wpforms-ai-chat-spinner-dots" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_S1WN{animation:spinner_MGfb .8s linear infinite;animation-delay:-.8s; fill: currentColor;}.spinner_Km9P{animation-delay:-.65s}.spinner_JApP{animation-delay:-.5s}@keyframes spinner_MGfb{93.75%,100%{opacity:.2}}</style><circle class="spinner_S1WN" cx="4" cy="12" r="3"/><circle class="spinner_S1WN spinner_Km9P" cx="12" cy="12" r="3"/><circle class="spinner_S1WN spinner_JApP" cx="20" cy="12" r="3"/></svg>`;
	}

	/**
	 * Add event listeners.
	 *
	 * @since 1.9.1
	 */
	events() {
		this.sendButton.addEventListener( 'click', this.sendMessage.bind( this ) );
		this.stopButton.addEventListener( 'click', this.stopLoading.bind( this ) );
		this.input.addEventListener( 'keyup', this.keyUp.bind( this ) );
		this.bindWelcomeScreenEvents();
	}

	/**
	 * Bind welcome screen events.
	 *
	 * @since 1.9.1
	 */
	bindWelcomeScreenEvents() {
		if ( this.welcomeScreenSamplePrompts === null ) {
			return;
		}

		// Click on the default item in the welcome screen.
		this.welcomeScreenSamplePrompts.querySelectorAll( 'li' ).forEach( ( li ) => {
			li.addEventListener( 'click', this.clickDefaultItem.bind( this ) );

			li.addEventListener( 'keydown', ( e ) => {
				if ( e.code === 'Enter' ) {
					e.preventDefault();
					this.clickDefaultItem( e );
				}
			} );
		} );
	}

	/**
	 * Init all answers.
	 *
	 * @since 1.9.2
	 */
	initAnswers() {
		if ( ! this.modeStrings.chatHtml ) {
			return;
		}

		this.wpformsAiApi = this.getAiApi();

		this.messageList.querySelectorAll( '.wpforms-chat-item-answer' ).forEach( ( answer ) => {
			this.initAnswer( answer );
		} );
	}

	/**
	 * Keyboard `keyUp` event handler.
	 *
	 * @since 1.9.1
	 *
	 * @param {KeyboardEvent} e The keyboard event.
	 */
	keyUp( e ) { // eslint-disable-line complexity
		switch ( e.code ) {
			case 'Enter':
				// Send a message on `Enter` key press.
				// In the case of textarea, `Shift + Enter` adds a new line.
				if ( ! this.isTextarea || ( this.isTextarea && ! e.shiftKey ) ) {
					e.preventDefault();
					this.sendMessage();
				}

				break;

			case 'ArrowUp':
				// Navigate through the chat history.
				// In the case of textarea, `Ctrl + Up` is used.
				if ( ! this.isTextarea || ( this.isTextarea && e.ctrlKey ) ) {
					e.preventDefault();
					this.arrowUp();
				}
				break;

			case 'ArrowDown':
				// Navigate through the chat history.
				// In the case of textarea, `Ctrl + Down` is used.
				if ( ! this.isTextarea || ( this.isTextarea && e.ctrlKey ) ) {
					e.preventDefault();
					this.arrowDown();
				}
				break;

			default:
				// Update the chat history.
				this.history.update( { question: this.input.value } );
		}
	}

	/**
	 * Send a question message to the chat.
	 *
	 * @since 1.9.1
	 */
	sendMessage() {
		const message = this.input.value;

		if ( ! message ) {
			return;
		}

		// Fire event before sending the message.
		this.triggerEvent( 'wpformsAIChatBeforeSendMessage', { fieldId: this.fieldId } );

		this.addFirstMessagePre();
		this.welcomeScreenSamplePrompts?.remove();

		this.resetInput();
		this.addMessage( message, true );
		this.startLoading();

		if ( message.trim() === '' ) {
			this.addEmptyResultsError();

			return;
		}

		this.getAiApi()
			.prompt( message, this.sessionId )
			.then( this.addAnswer.bind( this ) )
			.catch( this.apiResponseError.bind( this ) );
	}

	/**
	 * AI API error handler.
	 *
	 * @since 1.9.2
	 *
	 * @param {Object|string} error The error object or string.
	 */
	apiResponseError( error ) { // eslint-disable-line complexity
		const cause	= error?.cause ?? null;

		// Handle the rate limit error.
		if ( cause === 429 ) {
			this.addError(
				this.modeStrings.errors.rate_limit || wpforms_ai_chat_element.errors.rate_limit,
				this.modeStrings.reasons.rate_limit || wpforms_ai_chat_element.reasons.rate_limit
			);

			return;
		}

		// Handle the Internal Server Error.
		if ( cause === 500 ) {
			this.addEmptyResultsError();

			return;
		}

		this.addError(
			error.message || this.modeStrings.errors.default || wpforms_ai_chat_element.errors.default,
			this.modeStrings.reasons.default || wpforms_ai_chat_element.reasons.default
		);

		wpf.debug( 'WPFormsAI error: ', error );
	}

	/**
	 * Before the first message.
	 *
	 * @since 1.9.1
	 */
	addFirstMessagePre() {
		if ( this.sessionId || this.messagePreAdded ) {
			return;
		}

		this.messagePreAdded = true;

		const divider = document.createElement( 'div' );

		divider.classList.add( 'wpforms-ai-chat-divider' );
		this.messageList.appendChild( divider );
	}

	/**
	 * Click on the default item in the welcome screen.
	 *
	 * @since 1.9.1
	 *
	 * @param {Event} e The event object.
	 */
	clickDefaultItem( e ) {
		const li = e.target.nodeName === 'LI' ? e.target : e.target.closest( 'li' );
		const message = li.querySelector( 'a' )?.textContent;

		e.preventDefault();

		if ( ! message ) {
			return;
		}

		this.input.value = message;

		// Update the chat history.
		this.history.push( { question: message } );

		this.sendMessage();
	}

	/**
	 * Click on the dislike button.
	 *
	 * @since 1.9.1
	 *
	 * @param {Event} e The event object.
	 */
	clickDislikeButton( e ) {
		const button = e.target;
		const answer = button?.closest( '.wpforms-chat-item-answer' );

		if ( ! answer ) {
			return;
		}

		button.classList.add( 'clicked' );
		button.setAttribute( 'disabled', true );

		const responseId = answer.getAttribute( 'data-response-id' );

		this.wpformsAiApi.rate( false, responseId );
	}

	/**
	 * Click on the refresh button.
	 *
	 * @since 1.9.1
	 */
	async clickRefreshButton() {
		const refreshConfirm = () => {
			// Restore the welcome screen.
			this.messageList.innerHTML = this.getWelcomeScreen();
			this.welcomeScreenSamplePrompts = this.querySelector( '.wpforms-ai-chat-welcome-screen-sample-prompts' );
			this.bindWelcomeScreenEvents();
			this.scrollMessagesTo( 'top' );

			// Clear the session ID.
			this.wpformsAiApi = null;
			this.sessionId = null;
			this.messagePreAdded = null;
			this.wrapper.removeAttribute( 'data-session-id' );

			// Clear the chat history.
			this.history.clear();

			// Fire the event after refreshing the chat.
			this.triggerEvent( 'wpformsAIChatAfterRefresh', { fieldId: this.fieldId } );
		};

		const refreshCancel = () => {
			// Fire the event when refresh is canceled.
			this.triggerEvent( 'wpformsAIChatCancelRefresh', { fieldId: this.fieldId } );
		};

		// Fire the event before refresh confirmation is opened.
		this.triggerEvent( 'wpformsAIChatBeforeRefreshConfirm', { fieldId: this.fieldId } );

		// Open a confirmation modal.
		WPFormsAIModal.confirmModal( {
			title: wpforms_ai_chat_element.confirm.refreshTitle,
			content: wpforms_ai_chat_element.confirm.refreshMessage,
			onConfirm: refreshConfirm,
			onCancel: refreshCancel,
		} );
	}

	/**
	 * Start loading.
	 *
	 * @since 1.9.1
	 */
	startLoading() {
		this.loadingState = true;
		this.sendButton.classList.add( 'wpforms-hidden' );
		this.stopButton.classList.remove( 'wpforms-hidden' );
		this.input.setAttribute( 'disabled', true );
		this.input.setAttribute( 'placeholder', this.modeStrings.waiting );
	}

	/**
	 * Stop loading.
	 *
	 * @since 1.9.1
	 */
	stopLoading() {
		this.loadingState = false;
		this.messageList.querySelector( '.wpforms-chat-item-answer-waiting' )?.remove();
		this.sendButton.classList.remove( 'wpforms-hidden' );
		this.stopButton.classList.add( 'wpforms-hidden' );
		this.input.removeAttribute( 'disabled' );
		this.input.setAttribute( 'placeholder', this.modeStrings.placeholder );
		this.input.focus();
	}

	/**
	 * Keyboard `ArrowUp` key event handler.
	 *
	 * @since 1.9.1
	 */
	arrowUp() {
		const prev = this.history.prev()?.question;

		if ( typeof prev !== 'undefined' ) {
			this.input.value = prev;
		}
	}

	/**
	 * Keyboard `ArrowDown` key event handler.
	 *
	 * @since 1.9.1
	 */
	arrowDown() {
		const next = this.history.next()?.question;

		if ( typeof next !== 'undefined' ) {
			this.input.value = next;
		}
	}

	/**
	 * Get AI API object instance.
	 *
	 * @since 1.9.1
	 *
	 * @return {Object} The AI API object.
	 */
	getAiApi() {
		if ( this.wpformsAiApi ) {
			return this.wpformsAiApi;
		}

		// Attempt to get the session ID from the element attribute OR the data attribute.
		// It is necessary to restore the session ID after restoring the chat element.
		this.sessionId = this.wrapper.getAttribute( 'data-session-id' ) || null;

		// Create a new AI API object instance.
		this.wpformsAiApi = window.WPFormsAi.api( this.chatMode, this.sessionId );

		return this.wpformsAiApi;
	}

	/**
	 * Scroll message list to given edge.
	 *
	 * @since 1.9.1
	 *
	 * @param {string} edge The edge to scroll to; `top` or `bottom`.
	 */
	scrollMessagesTo( edge = 'bottom' ) {
		if ( edge === 'top' ) {
			this.messageList.scrollTop = 0;

			return;
		}

		if ( this.messageList.scrollHeight - this.messageList.scrollTop < 22 ) {
			return;
		}

		this.messageList.scrollTop = this.messageList.scrollHeight;
	}

	/**
	 * Add a message to the chat.
	 *
	 * @since 1.9.1
	 *
	 * @param {string}  message    The message to add.
	 * @param {boolean} isQuestion Whether it is a question.
	 * @param {Object}  response   The response data, optional.
	 *
	 * @return {HTMLElement} The message element.
	 */
	addMessage( message, isQuestion, response = null ) {
		const { messageList } = this;
		const element = document.createElement( 'div' );

		element.classList.add( 'wpforms-chat-item' );
		messageList.appendChild( element );

		if ( isQuestion ) {
			// Add a question.
			element.innerText = message;
			element.classList.add( 'wpforms-chat-item-question' );

			// Add a waiting spinner.
			const spinnerWrapper = document.createElement( 'div' ),
				spinner = document.createElement( 'div' );

			spinnerWrapper.classList.add( 'wpforms-chat-item-answer-waiting' );
			spinner.classList.add( 'wpforms-chat-item-spinner' );
			spinner.innerHTML = this.getSpinnerSvg();
			spinnerWrapper.appendChild( spinner );
			messageList.appendChild( spinnerWrapper );

			// Add an empty chat history item.
			this.history.push( {} );
		} else {
			// Add an answer.
			const itemContent = document.createElement( 'div' );

			itemContent.classList.add( 'wpforms-chat-item-content' );
			element.appendChild( itemContent );

			// Remove the waiting spinner.
			messageList.querySelector( '.wpforms-chat-item-answer-waiting' )?.remove();

			// Remove the active class from the previous answer.
			this.messageList.querySelector( '.wpforms-chat-item-answer.active' )?.classList.remove( 'active' );

			// Update element classes and attributes.
			element.classList.add( 'wpforms-chat-item-answer' );
			element.classList.add( 'active' );
			element.classList.add( 'wpforms-chat-item-typing' );
			element.classList.add( 'wpforms-chat-item-' + this.chatMode );
			element.setAttribute( 'data-response-id', response?.responseId ?? '' );

			// Update the answer in the chat history.
			this.history.update( { answer: message } );

			// Type the message with the typewriter effect.
			this.typeText( itemContent, message, this.addedAnswer.bind( this ) );
		}

		this.scrollMessagesTo( 'bottom' );

		return element;
	}

	/**
	 * Add an error to the chat.
	 *
	 * @since 1.9.1
	 *
	 * @param {string} errorTitle  The error title.
	 * @param {string} errorReason The error title.
	 */
	addError( errorTitle, errorReason ) {
		this.addNotice( errorTitle, errorReason );
	}

	/**
	 * Add a warning to the chat.
	 *
	 * @since 1.9.2
	 *
	 * @param {string} warningTitle  The warning title.
	 * @param {string} warningReason The warning reason.
	 */
	addWarning( warningTitle, warningReason ) {
		this.addNotice( warningTitle, warningReason, 'warning' );
	}

	/**
	 * Add a notice to the chat.
	 *
	 * @since 1.9.2
	 *
	 * @param {string} title  The notice title.
	 * @param {string} reason The notice reason.
	 * @param {string} type   The notice type.
	 */
	addNotice( title, reason, type = 'error' ) {
		let content = ``;

		// Bail if loading was stopped.
		if ( ! this.loadingState ) {
			return;
		}

		if ( title ) {
			content += `<h4>${ title }</h4>`;
		}

		if ( reason ) {
			content += `<span>${ reason }</span>`;
		}

		const chatItem = document.createElement( 'div' );
		const itemContent = document.createElement( 'div' );

		chatItem.classList.add( 'wpforms-chat-item' );
		chatItem.classList.add( 'wpforms-chat-item-' + type );
		itemContent.classList.add( 'wpforms-chat-item-content' );
		chatItem.appendChild( itemContent );

		this.messageList.querySelector( '.wpforms-chat-item-answer-waiting' )?.remove();
		this.messageList.appendChild( chatItem );

		// Add the error to the chat.
		// Type the message with the typewriter effect.
		this.typeText( itemContent, content, () => {
			this.stopLoading();
		} );
	}

	/**
	 * Add an empty results error to the chat.
	 *
	 * @since 1.9.1
	 */
	addEmptyResultsError() {
		this.addError(
			this.modeStrings.errors.empty || wpforms_ai_chat_element.errors.empty,
			this.modeStrings.reasons.empty || wpforms_ai_chat_element.reasons.empty
		);
	}

	/**
	 * Add a prohibited code warning to the chat.
	 *
	 * @since 1.9.2
	 */
	addProhibitedCodeWarning() {
		this.addWarning(
			this.modeStrings.warnings.prohibited_code || wpforms_ai_chat_element.warnings.prohibited_code,
			this.modeStrings.reasons.prohibited_code || wpforms_ai_chat_element.reasons.prohibited_code
		);
	}

	/**
	 * Add an answer to the chat.
	 *
	 * @since 1.9.1
	 *
	 * @param {Object} response The response data to add.
	 */
	addAnswer( response ) {
		// Bail if loading was stopped.
		if ( ! this.loadingState || ! response ) {
			return;
		}

		// Output processing time to console if available.
		if ( response.processingData ) {
			wpf.debug( 'WPFormsAI processing data:', response.processingData );
		}

		// Sanitize response.
		const sanitizedResponse = this.sanitizeResponse( { ...response } );

		if ( this.hasProhibitedCode( response, sanitizedResponse ) ) {
			this.addProhibitedCodeWarning();

			return;
		}

		const answerHTML = this.modeHelpers.getAnswer( sanitizedResponse );

		if ( ! answerHTML ) {
			this.addEmptyResultsError();

			return;
		}

		// Store the session ID from response.
		this.sessionId = response.sessionId;

		// Set the session ID to the chat wrapper data attribute.
		this.wrapper.setAttribute( 'data-session-id', this.sessionId );

		// Fire the event before adding the answer to the chat.
		this.triggerEvent( 'wpformsAIChatBeforeAddAnswer', { chat: this, response: sanitizedResponse } );

		// Add the answer to the chat.
		this.addMessage( answerHTML, false, sanitizedResponse );
	}

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
		if ( typeof this.modeHelpers.hasProhibitedCode === 'function' ) {
			return this.modeHelpers.hasProhibitedCode( response, sanitizedResponse );
		}

		return false;
	}

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
		if ( typeof this.modeHelpers.sanitizeResponse === 'function' ) {
			return this.modeHelpers.sanitizeResponse( response );
		}

		return response;
	}

	/**
	 * The added answer callback.
	 *
	 * @since 1.9.1
	 *
	 * @param {HTMLElement} element The answer element.
	 */
	addedAnswer( element ) {
		// Add answer buttons when typing is finished.
		element.innerHTML += this.getAnswerButtons();
		element.parentElement.classList.remove( 'wpforms-chat-item-typing' );

		this.stopLoading();
		this.initAnswer( element );

		// Added answer callback.
		this.modeHelpers.addedAnswer( element );

		// Fire the event when the answer added to the chat.
		this.triggerEvent( 'wpformsAIChatAddedAnswer', { chat: this, element } );
	}

	/**
	 * Init answer.
	 *
	 * @since 1.9.2
	 *
	 * @param {HTMLElement} element The answer element.
	 */
	initAnswer( element ) {
		if ( ! element ) {
			return;
		}

		// Prepare answer buttons and init the tooltips.
		element.querySelectorAll( '.wpforms-help-tooltip' ).forEach( ( icon ) => {
			let title = icon.getAttribute( 'title' );

			if ( ! title ) {
				title =	icon.classList.contains( 'dislike' ) ? wpforms_ai_chat_element.dislike : '';
				title = icon.classList.contains( 'refresh' ) ? wpforms_ai_chat_element.refresh : title;

				icon.setAttribute( 'title', title );
			}

			icon.classList.remove( 'tooltipstered' );
		} );

		wpf.initTooltips( element );

		// Add event listeners.
		element.addEventListener( 'click', this.setActiveAnswer.bind( this ) );

		element.querySelector( '.wpforms-ai-chat-answer-button.dislike' )
			?.addEventListener( 'click', this.clickDislikeButton.bind( this ) );

		element.querySelector( '.wpforms-ai-chat-answer-button.refresh' )
			?.addEventListener( 'click', this.clickRefreshButton.bind( this ) );
	}

	/**
	 * Set active answer.
	 *
	 * @since 1.9.2
	 *
	 * @param {Event} e The event object.
	 */
	setActiveAnswer( e ) {
		let answer = e.target.closest( '.wpforms-chat-item-answer' );

		answer = answer || e.target;

		if ( answer.classList.contains( 'active' ) ) {
			return;
		}

		this.messageList.querySelector( '.wpforms-chat-item-answer.active' )?.classList.remove( 'active' );
		answer.classList.add( 'active' );

		const responseId = answer.getAttribute( 'data-response-id' );

		if ( this.modeHelpers.setActiveAnswer ) {
			this.modeHelpers.setActiveAnswer( answer );
		}

		// Trigger the event.
		this.triggerEvent( 'wpformsAIChatSetActiveAnswer', { chat: this, responseId } );
	}

	/**
	 * Get the answer buttons HTML markup.
	 *
	 * @since 1.9.1
	 *
	 * @return {string} The answer buttons HTML markup.
	 */
	getAnswerButtons() {
		return `
			<div class="wpforms-ai-chat-answer-buttons">
				${ this.modeHelpers.getAnswerButtonsPre() }
				<div class="wpforms-ai-chat-answer-buttons-response">
					<button type="button" class="wpforms-ai-chat-answer-button dislike wpforms-help-tooltip" data-tooltip-position="top" title="${ wpforms_ai_chat_element.dislike }"></button>
					<button type="button" class="wpforms-ai-chat-answer-button refresh wpforms-help-tooltip" data-tooltip-position="top" title="${ wpforms_ai_chat_element.refresh }">
						<i class="fa fa-trash-o"></i>
					</button>
				</div>
			</div>
		`;
	}

	/**
	 * Type text into an element with the typewriter effect.
	 *
	 * @since 1.9.1
	 *
	 * @param {HTMLElement} element          The element to type into.
	 * @param {string}      text             The text to type.
	 * @param {Function}    finishedCallback The callback function to call when typing is finished.
	 */
	typeText( element, text, finishedCallback ) {
		const chunkSize = 5;
		const chat = this;
		let index = 0;
		let content = '';

		/**
		 * Type single character.
		 *
		 * @since 1.9.1
		 */
		function type() {
			const chunk = text.substring( index, index + chunkSize );

			content += chunk;
			// Remove broken HTML tag from the end of the string.
			element.innerHTML = content.replace( /<[^>]*$/g, '' );
			index += chunkSize;

			if ( index < text.length && chat.loadingState ) {
				// Recursive call to output the next chunk.
				setTimeout( type, 20 );
			} else if ( typeof finishedCallback === 'function' ) {
				// Call the callback function when typing is finished.
				finishedCallback( element );
			}

			chat.scrollMessagesTo( 'bottom' );
		}

		type();
	}

	/**
	 * Get the `helpers` object according to the chat mode.
	 *
	 * @since 1.9.1
	 *
	 * @param {WPFormsAIChatHTMLElement} chat Chat element.
	 *
	 * @return {Object} Choices helpers object.
	 */
	getHelpers( chat ) {
		const helpers = window.WPFormsAi.helpers;

		return helpers[ chat.chatMode ]( chat ) ?? null;
	}

	/**
	 * Reset the message input field.
	 *
	 * @since 1.9.2
	 */
	resetInput() {
		this.input.value = '';

		if ( this.modeHelpers.resetInput ) {
			this.modeHelpers.resetInput();
		}
	}

	/**
	 * Escape HTML special characters.
	 *
	 * @since 1.9.1
	 *
	 * @param {string} html HTML string.
	 *
	 * @return {string} Escaped HTML string.
	 */
	htmlSpecialChars( html ) {
		return html.replace( /[<>]/g, ( x ) => '&#0' + x.charCodeAt( 0 ) + ';' );
	}

	/**
	 * Decode HTML entities.
	 *
	 * @since 1.9.2
	 *
	 * @param {string} html Encoded HTML string.
	 *
	 * @return {string} Decoded HTML string.
	 */
	decodeHTMLEntities( html ) {
		const txt = document.createElement( 'textarea' );

		txt.innerHTML = html;

		return txt.value;
	}

	/**
	 * Wrapper to trigger a custom event and return the event object.
	 *
	 * @since 1.9.1
	 *
	 * @param {string} eventName Event name to trigger (custom or native).
	 * @param {Object} args      Trigger arguments.
	 *
	 * @return {Event} Event object.
	 */
	triggerEvent( eventName, args = {} ) {
		const event = new CustomEvent( eventName, { detail: args } );

		document.dispatchEvent( event );

		return event;
	}

	/**
	 * Chat history object.
	 *
	 * @since 1.9.1
	 */
	history = {
		/**
		 * Chat history data.
		 *
		 * @since 1.9.1
		 *
		 * @type {Array}
		 */
		data: [],

		/**
		 * Chat history pointer.
		 *
		 * @since 1.9.1
		 *
		 * @type {number}
		 */
		pointer: 0,

		/**
		 * Default item.
		 *
		 * @since 1.9.1
		 *
		 * @type {Object}
		 */
		defaultItem: {
			question: '',
			answer: null,
		},

		/**
		 * Get history data by pointer.
		 *
		 * @since 1.9.1
		 *
		 * @param {number|null} pointer The history pointer.
		 *
		 * @return {Object} The history item.
		 */
		get( pointer = null ) {
			if ( pointer ) {
				this.pointer = pointer;
			}

			if ( this.pointer < 1 ) {
				this.pointer = 0;
			} else if ( this.pointer >= this.data.length ) {
				this.pointer = this.data.length - 1;
			}

			return this.data[ this.pointer ] ?? {};
		},

		/**
		 * Get history data by pointer.
		 *
		 * @since 1.9.1
		 *
		 * @return {Object} The history item.
		 */
		prev() {
			this.pointer -= 1;

			return this.get();
		},

		/**
		 * Get history data by pointer.
		 *
		 * @since 1.9.1
		 *
		 * @return {Object} The history item.
		 */
		next() {
			this.pointer += 1;

			return this.get();
		},

		/**
		 * Push an item to the chat history.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} item The item to push.
		 *
		 * @return {void}
		 */
		push( item ) {
			if ( item.answer ) {
				this.data[ this.data.length - 1 ].answer = item.answer;

				return;
			}

			this.data.push( { ...this.defaultItem, ...item } );
			this.pointer = this.data.length - 1;
		},

		/**
		 * Update the last history item.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} item The updated history item.
		 *
		 * @return {void}
		 */
		update( item ) {
			const lastKey = this.data.length > 0 ? this.data.length - 1 : 0;
			const lastItem = this.data[ lastKey ] ?? this.defaultItem;

			this.pointer = lastKey;
			this.data[ lastKey ] = { ...lastItem, ...item };
		},

		/**
		 * Clear the chat history.
		 *
		 * @since 1.9.1
		 */
		clear() {
			this.data = [];
			this.pointer = 0;
		},
	};
}
