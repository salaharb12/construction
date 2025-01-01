<?php
/**
 * Misc batch import tasks.
 *
 * @package Astra Sites
 * @since 1.1.6
 */

namespace STImporter\Importer\Batch;

if ( ! class_exists( 'ST_Batch_CE_Process_Images' ) ) :

	/**
	 * ST_Batch_CE_Process_Images
	 *
	 * @since 4.0.11
	 */
	class ST_Batch_CE_Process_Images {

		/**
		 * Instance
		 *
		 * @since 1.1.6
		 * @access private
		 * @var object Class object.
		 */
		private static $instance = null;

		/**
		 * Initiator
		 *
		 * @since 1.1.6
		 * @return object initialized object of class.
		 */
		public static function get_instance() {

			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Offset
		 *
		 * @var int
		 */
		private static $offset = 0;

		/**
		 * Chunk Size
		 *
		 * @var int
		 */
		private static $chunk_size = 10;

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
				\WP_CLI::line( 'Processing "Images" Batch Import' );
			}

			self::$offset = get_option( 'st_attachments_offset', self::$chunk_size );

			self::image_processing();
		}

		/**
		 * Process Images with the metadata.
		 *
		 * @since 4.0.11
		 * @throws \Exception If there is an error.
		 * @return void
		 */
		public static function image_processing() {
			$all_attachments = get_option( 'st_attachments', array() );

			if ( empty( $all_attachments ) ) {
				return;
			}

			$window = array_slice( $all_attachments, self::$offset, self::$chunk_size );

			foreach ( $window as $attachment_id ) {
				$file = get_attached_file( $attachment_id );
				if ( false !== $file ) {
					try {
						wp_generate_attachment_metadata( $attachment_id, $file );
					} catch ( \Exception $e ) {
						throw new \Exception( $e->getMessage() );
					}
				}
			}
			update_option( 'st_attachments_offset', self::$offset + self::$chunk_size );
		}
	}


	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	ST_Batch_CE_Process_Images::get_instance();

endif;
