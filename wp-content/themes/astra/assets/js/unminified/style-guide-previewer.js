/**
 * Astra Theme Style Guide Preview Updater.
 *
 * @package Astra
 * @since  x.x.x
 */

(function($) {
    /**
     * Quick easy navigation.
     */
	jQuery(document).ready(function($) {
		document.addEventListener('AstraStyleGuideElementUpdated', function (e) {
			let element = $(document.body).find( e.detail.selector );
			let value   = e.detail.value;

			// Check if value is an object or else set the value.
			if ( typeof value === 'object' ) {
				let desktopValue = value.desktop;
				let tabletValue  = value.tablet;
				let mobileValue  = value.mobile;

				element.find( '.ast-sg-desktop' ).html( desktopValue );
				element.find( '.ast-sg-tablet' ).html( tabletValue );
				element.find( '.ast-sg-mobile' ).html( mobileValue );
			} else {
				element.html( value );
			}
		});

		let closeTrigger = $('.ast-close-tour');
		closeTrigger.on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			$( document.body ).removeClass('ast-sg-loaded');
		});
	});
})(jQuery);
