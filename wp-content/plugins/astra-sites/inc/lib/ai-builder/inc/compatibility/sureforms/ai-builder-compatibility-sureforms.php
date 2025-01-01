<?php
/**
 * AI Builder Compatibility for 'SureForms'
 *
 * @see  https://wordpress.org/plugins/sureforms/
 *
 * @package AI Builder
 * @since 1.2.9
 */

namespace AiBuilder\Inc\Compatibility\SureCart;

if ( ! class_exists( 'Ai_Builder_Compatibility_SureForms' ) ) :

	/**
	 * SureCart Compatibility
	 *
	 * @since 1.2.9
	 */
	class Ai_Builder_Compatibility_SureForms {

		/**
		 * Instance
		 *
		 * @access private
		 * @var object Class object.
		 * @since 1.2.9
		 */
		private static $instance = null;

		/**
		 * Initiator
		 *
		 * @since 1.2.9
		 * @return object initialized object of class.
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Constructor
		 *
		 * @since 1.2.9
		 */
		public function __construct() {
			add_action( 'astra_sites_after_plugin_activation', array( $this, 'activation' ), 10 );
			add_filter( 'srfm_enable_redirect_activation', array( $this, 'redirect_compatibility' ), 10, 1 );
		}

		/**
		 * Stop the plugin activation redirection.
		 *
		 * @since 1.2.13
		 *
		 * @param bool $do_redirect is redirect.
		 * @return bool
		 */
		public function redirect_compatibility( $do_redirect ) {
			if ( astra_sites_has_import_started() ) {
				return false;
			}

			return $do_redirect;
		}

		/**
		 * Stop the plugin activation redirection.
		 *
		 * @since 1.0.15
		 * @return void
		 */
		public function activation() {
			update_option( '__srfm_do_redirect', false );
		}
	}

	/**
	 * Kicking this off by calling 'instance()' method
	 */
	Ai_Builder_Compatibility_SureForms::instance();

endif;
