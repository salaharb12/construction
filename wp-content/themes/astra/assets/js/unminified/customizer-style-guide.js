/**
 * Astra Theme Customizer Style Guide
 *
 * @package Astra
 * @since  x.x.x
 */

(function($, api) {
	 /**
     * Style Guide navigation.
     */
	 jQuery(document).ready(function($) {

		let headerContainer = jQuery('#customize-header-actions'),
			button = jQuery('<button name="astra-tour" id="astra-tour" class="button-secondary button"> <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.79688 8.92573L12.8494 2.88073C13.0467 2.67706 13.2825 2.51469 13.5432 2.40306C13.8038 2.29144 14.0841 2.23279 14.3677 2.23054C14.6512 2.22828 14.9324 2.28247 15.1948 2.38994C15.4572 2.49741 15.6956 2.65602 15.8961 2.85653C16.0966 3.05703 16.2552 3.29543 16.3627 3.55783C16.4701 3.82024 16.5243 4.1014 16.5221 4.38495C16.5198 4.6685 16.4612 4.94876 16.3495 5.20943C16.2379 5.47009 16.0755 5.70593 15.8719 5.90323L9.82688 11.9632" stroke="#3B4349" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M5.30349 11.2031C4.05849 11.2031 3.05349 12.2156 3.05349 13.4681C3.05349 14.4656 1.17849 14.6081 1.55349 14.9831C2.36349 15.8081 3.42099 16.4981 4.55349 16.4981C6.20349 16.4981 7.55349 15.1481 7.55349 13.4681C7.55448 13.1717 7.49706 12.8779 7.38452 12.6036C7.27198 12.3294 7.10653 12.08 6.89759 11.8696C6.68866 11.6593 6.44035 11.4922 6.16683 11.3778C5.89332 11.2635 5.59995 11.2041 5.30349 11.2031Z" stroke="#3B4349" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg><div class="ast-style-guide-tooltip">Style Guide</div></button>');
	
		let indicatorDot = $('<span class="indicator-dot"></span>');
	
		headerContainer.append(indicatorDot);
		headerContainer.append(button);
	
		// Added function to check visit count and show/hide the red dot.
		function checkVisitCount() {
			let visitCount = localStorage.getItem('customizerVisitCount');
			visitCount = visitCount ? parseInt(visitCount, 10) : 0;
	
			if (visitCount < 5) {
				indicatorDot.show();
				visitCount++;
				localStorage.setItem('customizerVisitCount', visitCount);
			} else {
				indicatorDot.hide();
			}
		}
	
		checkVisitCount();
	
		button.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			// Access the iframe's content
			var iframeBody = $('#customize-preview').find('iframe').contents().find('body');

			// Apply the custom class to the iframe's body
			iframeBody.toggleClass('ast-sg-loaded');

			// Creating new state for restricting the preview refresh.
			api.state.create('astra-style-guide-status');
			api.state('astra-style-guide-status').set('loaded');
		});

	});

	// development code.
	$('#customize-preview iframe').on('load', function() {
		// Access the iframe's content
		var iframeBody = $('#customize-preview').find('iframe').contents().find('body');

		// Apply the custom class to the iframe's body
		iframeBody.addClass('ast-sg-loaded');
	});
	
})(jQuery, wp.customize);
