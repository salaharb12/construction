<?php
/**
 * Init
 *
 * @since 1.0.0
 * @package ZipWP Images
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Sites_Zipwp_Images' ) ) :

	/**
	 * Admin
	 */
	class Astra_Sites_Zipwp_Images {

		/**
		 * Instance
		 *
		 * @since 1.0.0
		 * @var (Object) Astra_Sites_Zipwp_Images
		 */
		private static $instance = null;

		/**
		 * Get Instance
		 *
		 * @since 1.0.0
		 *
		 * @return object Class object.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		private function __construct() {
			$this->version_check();
			add_action( 'init', array( $this, 'load' ) );
		}

		/**
		 * Version Check
		 *
		 * @return void
		 */
		public function version_check() {

			$file = realpath( dirname( __FILE__ ) . '/zipwp-images/version.json' );

			// Is file exist?
			if ( is_file( $file ) ) {
				// @codingStandardsIgnoreStart
				$file_data = json_decode( file_get_contents( $file ), true );
				// @codingStandardsIgnoreEnd
				global $zipwp_images_version, $zipwp_images_init;
				$path    = realpath( dirname( __FILE__ ) . '/zipwp-images/zipwp-images.php' );
				$version = isset( $file_data['zipwp-images'] ) ? $file_data['zipwp-images'] : 0;

				if ( null === $zipwp_images_version ) {
					$zipwp_images_version = '1.0.0';
				}

				// Compare versions.
				if ( version_compare( $version, $zipwp_images_version, '>=' ) ) {
					$zipwp_images_version = $version;
					$zipwp_images_init    = $path;
				}
			}
		}

		/**
		 * Load latest plugin
		 *
		 * @return void
		 */
		public function load() {
			global $zipwp_images_version, $zipwp_images_init;
			if ( is_file( realpath( $zipwp_images_init ) ) ) {
				include_once realpath( $zipwp_images_init );
			}
		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	Astra_Sites_Zipwp_Images::get_instance();

endif;
