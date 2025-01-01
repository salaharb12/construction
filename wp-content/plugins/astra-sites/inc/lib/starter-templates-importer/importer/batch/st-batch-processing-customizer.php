<?php
/**
 * Customizer batch import tasks.
 *
 * @package Astra Sites
 * @since 1.1.5
 */

namespace STImporter\Importer\Batch;

use STImporter\Importer\Helpers\ST_Image_Importer;
/**
 * ST_Batch_Processing_Customizer
 *
 * @since 1.1.5
 */
class ST_Batch_Processing_Customizer {

	/**
	 * Instance
	 *
	 * @since 1.1.5
	 * @access private
	 * @var object Class object.
	 */
	private static $instance;

	/**
	 * Initiator
	 *
	 * @since 1.1.5
	 * @return object initialized object of class.
	 */
	public static function get_instance() {

		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 *
	 * @since 1.1.5
	 */
	public function __construct() {}

	/**
	 * Import
	 *
	 * @since 1.1.5
	 * @return void
	 */
	public function import() {

		if ( defined( 'WP_CLI' ) ) {
			\WP_CLI::line( 'Processing "Customizer" Batch Import' );
		}
		self::images_download();
	}

	/**
	 * Downloads images from customizer.
	 *
	 * @return void
	 */
	public static function images_download() {
		$options = get_option( 'astra-settings', array() );
		array_walk_recursive(
			$options,
			function ( &$value ) {
				if ( ! is_array( $value ) && function_exists( 'astra_sites_is_valid_image' ) && astra_sites_is_valid_image( $value ) && method_exists( ST_Image_Importer::get_instance(), 'import' ) ) {
					$downloaded_image = ST_Image_Importer::get_instance()->import(
						array(
							'url' => $value,
							'id'  => 0,
						)
					);
					$value            = $downloaded_image['url'];
				}
			}
		);

		// Updated settings.
		update_option( 'astra-settings', $options );
	}
}

/**
 * Kicking this off by calling 'get_instance()' method
 */
ST_Batch_Processing_Customizer::get_instance();
