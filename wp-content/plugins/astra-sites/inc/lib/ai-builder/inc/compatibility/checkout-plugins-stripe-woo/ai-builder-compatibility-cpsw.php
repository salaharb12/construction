<?php
/**
 * Astra Sites Compatibility for 'Checkout Plugins – Stripe for WooCommerce'
 *
 * @see  https://wordpress.org/plugins/checkout-plugins-stripe-woo/
 *
 * @package Astra Sites
 * @since 3.0.23
 */

namespace AiBuilder\Inc\Compatibility\Cpsw;

defined( 'ABSPATH' ) || exit;

/**
 * Checkout Plugins - Stripe compatibility for Starter Templates.
 */
class Ai_Builder_Compatibility_Cpsw {
	/**
	 * Instance
	 *
	 * @access private
	 * @var object Class object.
	 * @since 3.0.23
	 */
	private static $instance = null;

	/**
	 * Initiator
	 *
	 * @since 3.0.23
	 * @return object initialized object of class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'astra_sites_after_plugin_activation', array( $this, 'checkout_plugins' ), 10, 2 );
	}

	/**
	 * Disable redirec after installing and activating Checkout Plugins - Stripe.
	 *
	 * @param string               $plugin_init Plugin init file used for activation.
	 * @param array<string, mixed> $data data.
	 * @return void
	 */
	public function checkout_plugins( $plugin_init, $data = array() ) {
		if ( 'checkout-plugins-stripe-woo/checkout-plugins-stripe-woo.php' === $plugin_init ) {
			delete_option( 'cpsw_start_onboarding' );
		}
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
Ai_Builder_Compatibility_Cpsw::get_instance();
