/* global WPFormsAIChatHTMLElement */

/**
 * The WPForms AI chat element.
 *
 * Choices helpers module.
 *
 * @since 1.9.1
 *
 * @param {WPFormsAIChatHTMLElement} chat The chat element.
 *
 * @return {Function} The app cloning function.
 */
export default function( chat ) { // eslint-disable-line no-unused-vars
	/**
	 * The default `text` mode helpers object.
	 *
	 * @since 1.9.1
	 */
	return {
		/**
		 * Get the `text` answer based on AI response data.
		 *
		 * @since 1.9.1
		 *
		 * @param {Object} response The AI response data.
		 *
		 * @return {string} HTML markup.
		 */
		getAnswer( response ) {
			return `
				<h4>${ response?.heading ?? '' }</h4>
				<p>${ response?.text ?? '' }</p>
				<span>${ response?.footer ?? '' }</span>
			`;
		},

		/**
		 * Get the answer pre-buttons HTML markup.
		 *
		 * @since 1.9.1
		 *
		 * @return {string} The answer pre-buttons HTML markup.
		 */
		getAnswerButtonsPre() {
			return '';
		},

		/**
		 * Added answer callback.
		 *
		 * @since 1.9.1
		 */
		addedAnswer() {},

		/**
		 * Determine whether the Welcome Screen should be displayed.
		 *
		 * @since 1.9.2
		 *
		 * @return {boolean} Display the Welcome Screen or not.
		 */
		isWelcomeScreen() {
			return true;
		},
	};
}
