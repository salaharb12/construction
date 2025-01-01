/**
 * Astra Theme Customizer Tour
 *
 * @package Astra
 * @since  x.x.x
 */

(function($) {
    /**
     * Quick easy navigation.
     */
	jQuery(document).ready(function($) {

		let container = jQuery('#customize-header-actions'),
			button = jQuery('<button name="astra-tour" id="astra-tour" title="' + astraTour.title + '" class="button-secondary button"> <svg class="flex-shrink-0 mr-4 stroke-inherit" fill="none" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 3V1M9 3C7.89543 3 7 3.89543 7 5C7 6.10457 7.89543 7 9 7M9 3C10.1046 3 11 3.89543 11 5C11 6.10457 10.1046 7 9 7M3 15C4.10457 15 5 14.1046 5 13C5 11.8954 4.10457 11 3 11M3 15C1.89543 15 1 14.1046 1 13C1 11.8954 1.89543 11 3 11M3 15V17M3 11V1M9 7V17M15 15C16.1046 15 17 14.1046 17 13C17 11.8954 16.1046 11 15 11M15 15C13.8954 15 13 14.1046 13 13C13 11.8954 13.8954 11 15 11M15 15V17M15 11V1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg> </button>'),
			tourItem = jQuery('.ast-quick-setup-navigation .ast-quick-tour-item');

		container.append(button);

		button.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			document.body.style.overflow = 'hidden';
		});

		tourItem.on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();

			let type = jQuery(this).data('type'),
				link = jQuery(this).data('link');

			switch (type) {
				case 'section':
					var section = wp.customize.section(link);
					section.expand();
					break;

				case 'panel':
					var panel = wp.customize.panel(link);
					panel.expand();
					break;

				case 'control':
					wp.customize.control(link).focus();
						setTimeout(() => {
							wp.customize.control(link).focus();
						}, 500);
					break;

				default:
					break;
			}
		});
	});
})(jQuery);
