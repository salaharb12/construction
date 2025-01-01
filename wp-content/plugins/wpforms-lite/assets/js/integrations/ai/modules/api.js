/* global wpforms_ai_chat_element */

/**
 * @param wpforms_ai_chat_element.ajaxurl
 * @param wpforms_ai_chat_element.errors.network
 * @param wpforms_ai_chat_element.errors.default
 */

/**
 * The WPForms AI API wrapper.
 *
 * @since 1.9.1
 *
 * @return {Function} The app cloning function.
 */
export default function() { // eslint-disable-line no-unused-vars, max-lines-per-function
	/**
	 * Public functions and properties.
	 *
	 * @since 1.9.1
	 *
	 * @type {Object}
	 */
	const app = {
		/**
		 * AI chat mode.
		 *
		 * @since 1.9.1
		 *
		 * @type {string}
		 */
		mode: '',

		/**
		 * AI AJAX actions.
		 *
		 * @since 1.9.1
		 *
		 * @type {Object}
		 */
		actions: {
			rate: 'wpforms_rate_ai_response',
			choices: 'wpforms_get_ai_choices',
			forms: 'wpforms_get_ai_form',
		},

		/**
		 * AJAX request.
		 *
		 * @param {Object} data Data to send.
		 *
		 * @return {Promise} The fetch result data promise.
		 */
		// eslint-disable-next-line complexity
		async ajax( data ) {
			if ( ! data.nonce ) {
				data.nonce = wpforms_ai_chat_element.nonce;
			}

			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams( data ).toString(),
			};

			const response = await fetch( wpforms_ai_chat_element.ajaxurl, options )
				.catch( ( error ) => {
					if ( error.message === 'Failed to fetch' ) {
						throw new Error( wpforms_ai_chat_element.errors.network );
					} else {
						throw new Error( error.message );
					}
				} );

			if ( ! response.ok ) {
				throw new Error( wpforms_ai_chat_element.errors.network );
			}

			const result = await response.json();

			if ( ! result.success || result.data?.error ) {
				throw new Error(
					result.data?.error ?? wpforms_ai_chat_element.errors.default,
					{
						cause: result.data?.code ?? 400,
					} );
			}

			return result.data;
		},

		/**
		 * Prompt.
		 *
		 * @param {string} prompt    The question to ask.
		 * @param {string} sessionId Session ID.
		 *
		 * @return {Promise} The response data in promise.
		 */
		async prompt( prompt, sessionId ) {
			const data = {
				action: app.actions[ this.mode ] ?? app.actions.choices,
				prompt,
			};

			if ( sessionId ) {
				data.session_id = sessionId; // eslint-disable-line camelcase
			}

			return app.ajax( data );
		},

		/**
		 * Rate.
		 *
		 * @param {boolean} helpful    Whether the response was helpful or not.
		 * @param {string}  responseId Response ID.
		 *
		 * @return {Promise} The response data in promise.
		 */
		async rate( helpful, responseId ) {
			const data = {
				action: app.actions.rate,
				helpful,
				response_id: responseId, // eslint-disable-line camelcase
			};

			return app.ajax( data );
		},

		/**
		 * Set the AI chat mode.
		 *
		 * @since 1.9.1
		 *
		 * @param {string} mode The mode to set.
		 *
		 * @return {Object} The app object.
		 */
		setMode( mode ) {
			this.mode = mode;

			return this;
		},
	};

	/**
	 * Return a clone of an app object.
	 *
	 * @since 1.9.1
	 *
	 * @param {string} mode The AI prompt mode.
	 *
	 * @return {Object} Cloned app object.
	 */
	return function( mode ) {
		const obj = { ...app };

		return obj.setMode( mode );
	};
}
