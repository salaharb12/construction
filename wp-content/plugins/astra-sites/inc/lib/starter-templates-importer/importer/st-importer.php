<?php
/**
 * Starter Templates Importer - Module.
 *
 * This file is used to register and manage the Zip AI Modules.
 *
 * @package Starter Templates Importer
 */

namespace STImporter\Importer;

use STImporter\Importer\WXR_Importer\ST_WXR_Importer;
use STImporter\Importer\ST_Importer_Helper;
use STImporter\Importer\ST_Widget_Importer;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * The Module Class.
 */
class ST_Importer {

	/**
	 * Instance of this class.
	 *
	 * @since 1.0.0
	 * @var self Class object.
	 */
	private static $instance = null;

	/**
	 * Initiator of this class.
	 *
	 * @since 1.0.0
	 * @return self initialized object of this class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initiate import process flog.
	 *
	 * @since 1.0.0
	 * @param string $template_type template type.
	 * @param string $uuid uuid.
	 * @return array<string, mixed>
	 */
	public static function set_import_process_start_flag( $template_type, $uuid = '' ) {

		if ( empty( $uuid ) && 'ai' === $template_type ) {
			return array(
				'status' => false,
				'error'  => __( 'uuid is empty.', 'astra-sites' ),
			);
		}

		if ( ! empty( $uuid ) ) {
			update_option( 'astra_sites_ai_import_started', 'yes', 'no' );
		}
		do_action( 'st_before_start_import_process' );
		update_option( 'astra_sites_import_started', 'yes' );

		return array(
			'status' => true,
			'error'  => __( 'Import process start flof set successfully.', 'astra-sites' ),
		);
	}

	/**
	 * Import Spectra Settings
	 *
	 * @since 1.0.0
	 * @param array<string, mixed> $settings spectra settings.
	 *
	 * @return array<string, mixed>
	 */
	public static function import_spectra_settings( $settings = array() ) {

		if ( ! is_callable( 'UAGB_Admin_Helper::get_instance' ) ) {
			return array(
				'status' => false,
				'error'  => __( 'Can\'t import Spectra Settings. Spectra Plugin is not activated.', 'astra-sites' ),
			);
		}

		if ( empty( $settings ) ) {
			return array(
				'status' => false,
				'error'  => __( 'Spectra settings are empty.', 'astra-sites' ),
			);
		}

		\UAGB_Admin_Helper::get_instance()->update_admin_settings_shareable_data( $settings ); // @phpstan-ignore-line

		return array(
			'status'  => true,
			'message' => __( 'Spectra settings imported successfully.', 'astra-sites' ),
		);

	}

	/**
	 * Import Surecart Settings
	 *
	 * @since 1.0.0
	 *
	 * @param int $id id.
	 * @return array<string, mixed>
	 */
	public static function import_surecart_settings( $id = 0 ) {

		if ( ! is_callable( 'SureCart\Models\ProvisionalAccount::create' ) ) {
			return array(
				'status' => false,
				'error'  => __( 'SureCart\Models\ProvisionalAccount::create function is not callable.', 'astra-sites' ),
			);
		}

		// Create Account if surecart selected as a feature.
		$create_account = isset( $_POST['create_account'] ) && 'true' === $_POST['create_account'] ? true : false; // phpcs:ignore WordPress.Security.NonceVerification.Missing
		$email          = ST_Importer_Helper::get_business_details( 'business_email' );
		$currency       = isset( $_POST['source_currency'] ) ? sanitize_text_field( $_POST['source_currency'] ) : 'usd'; // phpcs:ignore WordPress.Security.NonceVerification.Missing

		$data = array(
			'email'            => $email, // optional.
			'seed'             => true,
			'account_currency' => $currency,
		);

		if ( ! $create_account ) {
			$id = ! empty( $id ) ? base64_decode( sanitize_text_field( (string) $id ) ) : ''; // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode

			if ( empty( $id ) ) {
				return array(
					'status' => false,
					'error'  => __( 'Id is empty.', 'astra-sites' ),
				);
			}

			$data['source_account_id'] = $id;
		}

		$token = \SureCart\Models\ApiToken::get(); // @phpstan-ignore-line

		if ( ! empty( $token ) ) {
			return array(
				'status' => true,
				'msg'    => __( 'Account is already created.', 'astra-sites' ),
			);
		}

		return \SureCart\Models\ProvisionalAccount::create(  // @phpstan-ignore-line
			$data
		);

	}

	/**
	 * Import Customizer Settings.
	 *
	 * @since 1.0.0
	 *
	 * @param  array<string, mixed> $customizer_data Customizer Data.
	 * @return array<string, mixed>
	 */
	public static function import_customizer_settings( $customizer_data = array() ) {

		if ( empty( $customizer_data ) ) {
			return array(
				'status' => false,
				'error'  => __( 'Customizer data is empty.', 'astra-sites' ),
			);
		}

		update_option( '_astra_sites_old_customizer_data', $customizer_data, 'no' );

		// Update Astra Theme customizer settings.
		if ( isset( $customizer_data['astra-settings'] ) ) {
			update_option( 'astra-settings', $customizer_data['astra-settings'] );
		}

		// Add Custom CSS.
		if ( isset( $customizer_data['custom-css'] ) ) {
			wp_update_custom_css_post( $customizer_data['custom-css'] );
		}

		return array(
			'status'  => true,
			'message' => __( 'Customizer data imported successfully.', 'astra-sites' ),
		);

	}

	/**
	 * Prepare XML Data.
	 *
	 * @since 1.0.0
	 *
	 * @param string $wxr_url url.
	 * @return array<string, mixed>
	 */
	public static function prepare_xml_data( $wxr_url ) {

		if ( ! ST_WXR_Importer::is_valid_wxr_url( $wxr_url ) ) {
			return array(
				'status' => false,
				/* Translators: %s is WXR URL. */
				'error'  => sprintf( __( 'Invalid WXR Request URL - %s', 'astra-sites' ), $wxr_url ),
			);
		}

		$overrides = array(
			'wp_handle_sideload' => 'upload',
		);

		// Download XML file.
		$xml_path = ST_WXR_Importer::download_file( $wxr_url, $overrides );

		if ( $xml_path['success'] ) {

			$post = array(
				'post_title'     => basename( $wxr_url ),
				'guid'           => $xml_path['data']['url'],
				'post_mime_type' => $xml_path['data']['type'],
			);

			// As per wp-admin/includes/upload.php.
			$post_id = wp_insert_attachment( $post, $xml_path['data']['file'] );

			if ( ! is_int( $post_id ) ) {
				return array(
					'status' => false,
					'error'  => __( 'There was an error downloading the XML file.', 'astra-sites' ),
				);
			} else {
				update_option( 'astra_sites_imported_wxr_id', $post_id, 'no' );
				$attachment_metadata = wp_generate_attachment_metadata( $post_id, $xml_path['data']['file'] );
				wp_update_attachment_metadata( $post_id, $attachment_metadata );
				$data        = ST_WXR_Importer::get_xml_data( $xml_path['data']['file'], $post_id );
				$data['xml'] = $xml_path['data'];
				return array(
					'status' => true,
					'data'   => $data,
				);
			}
		} else {
			return array(
				'status' => false,
				'error'  => $xml_path['data'],
			);
		}
	}

	/**
	 * Import site options.
	 *
	 * @since  1.0.0
	 *
	 * @param array<string, mixed> $options Array of options to be imported from the demo.
	 *
	 * @return array<string, mixed>
	 */
	public static function import_options( $options = array() ) {

		if ( empty( $options ) ) {
			return array(
				'status' => false,
				'error'  => __( 'Site options are empty!', 'astra-sites' ),
			);
		}

			// Set meta for tracking the post.
		if ( is_array( $options ) ) {
			update_option( '_astra_sites_old_site_options', $options, 'no' );
		}

		try {
			foreach ( $options as $option_name => $option_value ) {

				// Is option exist in defined array site_options()?
				if ( null !== $option_value ) {
					switch ( $option_name ) {
						case 'page_for_posts':
						case 'page_on_front':
								ST_Option_Importer::update_page_id_by_option_value( $option_name, $option_value );
							break;

						// nav menu locations.
						case 'nav_menu_locations':
								ST_Option_Importer::set_nav_menu_locations( $option_value );
							break;

						// insert logo.
						case 'custom_logo':
								ST_Option_Importer::insert_logo( $option_value );
							break;

						case 'site_title':
							update_option( 'blogname', $option_value );
							break;

						default:
							update_option( $option_name, $option_value );
							break;
					}
				}
			}

			do_action( 'st_importer_import_site_options', $options );

			return array(
				'status'  => true,
				'message' => __( 'Options imported successfully.', 'astra-sites' ),
			);
		} catch ( \Exception $e ) {
			return array(
				'status' => false,
				'error'  => $e,
			);
		}

	}

	/**
	 * Import Widgets.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $widgets_data Widgets Data.
	 * @param  string $data Widgets Data.
	 * @return array<string, mixed>
	 */
	public static function import_widgets( $widgets_data, $data = '' ) {

		if ( is_object( $data ) ) { // @phpstan-ignore-line
			// $data is set and is an object.
			$widgets_data = $data;
		} elseif ( is_string( $data ) ) {
			// $data is set but is not an object.
			$widgets_data = (object) json_decode( $data );
		}

		if ( ! is_object( $widgets_data ) ) {
			return array(
				'status' => false,
				'error'  => __( 'Widget data is empty!', 'astra-sites' ),
			);
		}

		ST_Widget_Importer::import_widgets_data( $widgets_data );
		$sidebars_widgets = get_option( 'sidebars_widgets', array() );
		update_option( '_astra_sites_old_widgets_data', $sidebars_widgets, 'no' );
		return array(
			'status'  => true,
			'message' => __( 'Widgets imported successfully.', 'astra-sites' ),
		);

	}
}
