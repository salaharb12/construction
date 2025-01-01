<?php
/**
 * Cleanup batch import tasks.
 *
 * @package Astra Sites
 * @since 4.0.11
 */

namespace STImporter\Importer\Batch;

if ( ! class_exists( 'ST_Batch_Process_Cleanup' ) ) :

	/**
	 * ST_Batch_Process_Cleanup
	 *
	 * @since 4.0.11
	 */
	class ST_Batch_Process_Cleanup {

		/**
		 * Instance
		 *
		 * @since 1.0.14
		 * @var object Class object.
		 * @access private
		 */
		private static $instance = null;

		/**
		 * Initiator
		 *
		 * @since 1.0.14
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
		 * @since 4.0.11
		 */
		public function __construct() {}

		/**
		 * Import
		 *
		 * @since 4.0.11
		 * @return void
		 */
		public function import() {

			if ( defined( 'WP_CLI' ) ) {
				\WP_CLI::line( 'Processing "Cleanup" Batch Import' );
			}

			update_option( 'st_attachments', array(), 'no' );
			delete_option( 'st_attachments_offset' );
		}
	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	ST_Batch_Process_Cleanup::get_instance();

endif;
