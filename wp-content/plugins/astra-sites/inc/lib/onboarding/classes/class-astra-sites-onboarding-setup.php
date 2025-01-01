<?php
/**
 * Ai site setup
 *
 * @since 3.0.0-beta.1
 * @package Astra Sites
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use STImporter\Importer\ST_Importer;

if ( ! class_exists( 'Astra_Sites_Onboarding_Setup' ) ) :

	/**
	 * AI Site Setup
	 */
	class Astra_Sites_Onboarding_Setup {

		/**
		 * Instance
		 *
		 * @since 4.0.0
		 * @access private
		 * @var object Class object.
		 */
		private static $instance;

		 /**
		 * Initiator
		 *
		 * @since 4.0.0
		 * @return mixed 
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
		 * @since 3.0.0-beta.1
		 */
		public function __construct() {
			add_action( 'st_before_sending_error_report', array( $this, 'delete_transient_for_import_process' ) );
			add_action( 'st_before_sending_error_report', array( $this, 'temporary_cache_errors' ), 10, 1 );
			add_action( 'wp_ajax_astra-sites-import_prepare_xml', array( $this, 'import_prepare_xml' ) );
		}

	/**
	 * Prepare XML Data.
	 *
	 * @since 1.1.0
	 * @return void
	 */
	public function import_prepare_xml() {

		// Verify Nonce.
		check_ajax_referer( 'astra-sites', '_ajax_nonce' );

		if ( ! current_user_can( 'customize' ) ) {
			wp_send_json_error( __( 'You are not allowed to perform this action', 'astra-sites' ) );
		}

		if ( ! class_exists( 'XMLReader' ) ) {
			wp_send_json_error( __( 'The XMLReader library is not available. This library is required to import the content for the website.', 'astra-sites' ) );
		}

		$wxr_url = astra_get_site_data( 'astra-site-wxr-path' );

		$result = array(
			'status' => false,
		);

		if( class_exists( 'STImporter\Importer\ST_Importer' ) ) {
			$result = ST_Importer::prepare_xml_data( $wxr_url );
		}
		
		if ( false === $result['status'] ) {
			wp_send_json_error(
				$result['error']
			);
		} else {
			wp_send_json_success(
				$result['data']
			);
		}
	}

		/**
		 * Delete transient for import process.
		 *
		 * @param array<string|int, mixed> $posted_data
		 * @since 3.1.4
		 * @return void
		 */
		public function temporary_cache_errors( $posted_data ) {
			update_option( 'astra_sites_cached_import_error', $posted_data, false );
		}

		/**
		 * Delete transient for import process.
		 *
		 * @since 3.1.4
		 * @return void
		 */
		public function delete_transient_for_import_process() {
			delete_transient( 'astra_sites_import_started' );
		}
	}

	Astra_Sites_Onboarding_Setup::get_instance();

endif;
