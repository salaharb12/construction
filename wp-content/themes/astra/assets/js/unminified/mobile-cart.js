/**
 *
 * Handle Mobile Cart events.
 *
 * @since 3.1.0
 * @package Astra
 */

(function () {

	var cart_flyout = document.getElementById('astra-mobile-cart-drawer'),
		main_header_masthead = document.getElementById('masthead'),
		responsive_cart_click = astra_cart.responsive_cart_click;
	
	// Return if masthead not exixts.
	if (!main_header_masthead) {
		return;
	}

	var woo_data = '',
		mobileHeader = main_header_masthead.querySelector("#ast-mobile-header"),
		edd_data = '';

	if (undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout) {
		woo_data = cart_flyout.querySelector('.widget_shopping_cart.woocommerce');
		edd_data = cart_flyout.querySelector('.widget_edd_cart_widget');
	}

	/**
	 * Opens the Cart Flyout.
	 */
	cartFlyoutOpen = function (event) {

		// Check if responsive_cart_click is "redirect" and body has class "ast-header-break-point"
		if ((responsive_cart_click === 'redirect' && document.body.classList.contains('ast-header-break-point')) ) {
			return;
		}

		event.preventDefault();
		var current_cart = event.currentTarget.cart_type;

		if ('woocommerce' === current_cart && document.body.classList.contains('woocommerce-cart')) {
			return;
		}
		cart_flyout.classList.remove('active');
		cart_flyout.classList.remove('woocommerce-active');
		cart_flyout.classList.remove('edd-active');
		if (undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout) {
			cart_flyout.classList.add('active');
			document.documentElement.classList.add('ast-mobile-cart-active');
			if (undefined !== edd_data && '' !== edd_data && null !== edd_data) {
				edd_data.style.display = 'block';
				if ('woocommerce' === current_cart) {
					edd_data.style.display = 'none';
					cart_flyout.classList.add('woocommerce-active');
				}
			}
			if (undefined !== woo_data && '' !== woo_data && null !== woo_data) {
				woo_data.style.display = 'block';
				if ('edd' === current_cart) {
					woo_data.style.display = 'none';
					cart_flyout.classList.add('edd-active');
				}
			}
		}

		document.dispatchEvent( new CustomEvent( "astra_on_slide_In_cart_open",  { "detail": {} }) );
	}

	/**
	 * Closes the Cart Flyout.
	 */
	cartFlyoutClose = function (event) {
		event.preventDefault();
		if (undefined !== cart_flyout && '' !== cart_flyout && null !== cart_flyout) {
			cart_flyout.classList.remove('active');
			document.documentElement.classList.remove('ast-mobile-cart-active');
		}
	}

	/**
	 * Main Init Function.
	 */
	function cartInit() {
		// Close Popup if esc is pressed.
		document.addEventListener('keyup', function (event) {
			// 27 is keymap for esc key.
			if (event.keyCode === 27) {
				event.preventDefault();
				cart_flyout.classList.remove('active');
				document.documentElement.classList.remove('ast-mobile-cart-active');
				updateTrigger();
			}
		});

		// Close Popup on outside click.
		document.addEventListener('click', function (event) {
			var target = event.target;
			var cart_modal = document.querySelector('.ast-mobile-cart-active .astra-mobile-cart-overlay');

			if (target === cart_modal) {
				cart_flyout.classList.remove('active');
				document.documentElement.classList.remove('ast-mobile-cart-active');
			}
		});

		if (undefined !== mobileHeader && '' !== mobileHeader && null !== mobileHeader) {

			// Mobile Header Cart Flyout.
			if( 'flyout' == astra_cart.desktop_layout ) {
				var woo_carts = document.querySelectorAll('.ast-mobile-header-wrap .ast-header-woo-cart, #ast-desktop-header .ast-desktop-cart-flyout');
			} else {
				var woo_carts = document.querySelectorAll('.ast-mobile-header-wrap .ast-header-woo-cart');
			}
			var edd_cart = document.querySelector('.ast-mobile-header-wrap .ast-header-edd-cart');
			var cart_close = document.querySelector('.astra-cart-drawer-close');

			if( 0 < woo_carts.length ){
				woo_carts.forEach(function callbackFn(woo_cart) {
					if (undefined !== woo_cart && '' !== woo_cart && null !== woo_cart && cart_flyout) {
						woo_cart.addEventListener("click", cartFlyoutOpen, false);
						woo_cart.cart_type = 'woocommerce';
					}
				})
			}
			if (undefined !== edd_cart && '' !== edd_cart && null !== edd_cart && cart_flyout) {
				edd_cart.addEventListener("click", cartFlyoutOpen, false);
				edd_cart.cart_type = 'edd';
			}
			if (undefined !== cart_close && '' !== cart_close && null !== cart_close) {
				cart_close.addEventListener("click", cartFlyoutClose, false);
			}
		}

	}

	// Slide in cart 'astra_woo_slide_in_cart' PRO shortcode compatibility.
	if(document.querySelector('.ast-slidein-cart')){
		document.querySelector('.ast-slidein-cart').addEventListener('click', (e)=> {
			document.querySelector('#astra-mobile-cart-drawer').classList.add('active');
			document.querySelector('html').classList.add('ast-mobile-cart-active');
			e.preventDefault();
		});		
	}
	
	// Get the screen inner width.
	var screenInnerWidth = window.innerWidth;

	window.addEventListener('resize', function () {
		// Close Cart
		var cart_close = document.querySelector('.astra-cart-drawer-close');
		if ( undefined !== cart_close && '' !== cart_close && null !== cart_close && 'INPUT' !== document.activeElement.tagName && cart_flyout.classList.contains( 'active' ) ) {
			// Get the modified screen inner width.
			var modifiedInnerWidth = window.innerWidth;
			if ( modifiedInnerWidth !== screenInnerWidth ) {
				screenInnerWidth = modifiedInnerWidth;
				cart_close.click();
			}
		}
	});

	window.addEventListener('load', function () {
		cartInit();
	});
	document.addEventListener('astLayoutWidthChanged', function () {
		cartInit();
	});

	document.addEventListener('astPartialContentRendered', function () {
		cartInit();
	});

	let initialWidth = window.innerWidth; // Store the initial device width.

	var layoutChangeDelay;
	window.addEventListener('resize', function () {
		let newWidth = window.innerWidth; // Get the device width after resize.

		clearTimeout(layoutChangeDelay);
		layoutChangeDelay = setTimeout(function () {
			cartInit();
			// Dispatch 'astLayoutWidthChanged' event only if the width has changed.
			// This prevents input elements from losing focus unnecessarily.
			if ( initialWidth !== newWidth ) {
				document.dispatchEvent(new CustomEvent("astLayoutWidthChanged", {"detail": {'response': ''}}));
			}

			// Update the initial width to the new width after resizing completes.
			initialWidth = newWidth;
		}, 50);
	});

	// Using jQuery here because WooCommerce and the variation swatches plugin rely on jQuery for AJAX handling and DOM updates.
	jQuery(document).ready(function ($) {
		// Listening for WooCommerce's default 'added_to_cart' and 'cfvsw_ajax_add_to_cart' both events.
		$(document.body).on('added_to_cart cfvsw_ajax_add_to_cart', function (event, fragments, cart_hash) {
			// Refreshing WooCommerce cart fragments.
			$.get(wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_refreshed_fragments'), function (data) {
				if (data && data.fragments) {
					$.each(data.fragments, function (key, value) {
						$(key).replaceWith(value);
					});
				}
			});
		});

		// Triggering the 'added_to_cart' event if needed elsewhere on page reload in the flow.
		$(document.body).trigger('added_to_cart');
	});

})();
