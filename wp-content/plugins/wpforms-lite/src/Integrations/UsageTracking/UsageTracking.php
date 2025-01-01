<?php

namespace WPForms\Integrations\UsageTracking;

use WPForms\Admin\Builder\Templates;
use WPForms\Integrations\AI\Helpers as AIHelpers;
use WPForms\Integrations\IntegrationInterface;
use WPForms\Integrations\LiteConnect\Integration;

/**
 * Usage Tracker functionality to understand what's going on client's sites.
 *
 * @since 1.6.1
 */
class UsageTracking implements IntegrationInterface {

	/**
	 * The slug that will be used to save the option of Usage Tracker.
	 *
	 * @since 1.6.1
	 */
	const SETTINGS_SLUG = 'usage-tracking-enabled';

	/**
	 * Indicate if current integration is allowed to load.
	 *
	 * @since 1.6.1
	 *
	 * @return bool
	 */
	public function allow_load(): bool {

		/**
		 * Whether the Usage Tracking code is allowed to be loaded.
		 *
		 * @since 1.6.1
		 *
		 * @param bool $var Boolean value.
		 */
		return (bool) apply_filters( 'wpforms_usagetracking_is_allowed', true ); // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName
	}

	/**
	 * Whether Usage Tracking is enabled.
	 *
	 * @since 1.6.1
	 *
	 * @return bool
	 */
	public function is_enabled(): bool {

		/**
		 * Whether the Usage Tracking is enabled.
		 *
		 * @since 1.6.1
		 *
		 * @param bool $var Boolean value taken from the DB.
		 */
		return (bool) apply_filters( 'wpforms_integrations_usagetracking_is_enabled', wpforms_setting( self::SETTINGS_SLUG ) );  // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName
	}

	/**
	 * Load an integration.
	 *
	 * @since 1.6.1
	 */
	public function load() { // phpcs:ignore WPForms.PHP.HooksMethod.InvalidPlaceForAddingHooks

		add_filter( 'wpforms_settings_defaults', [ $this, 'settings_misc_option' ], 4 );

		// Deregister the action if option is disabled.
		add_action(
			'wpforms_settings_updated',
			function () {

				if ( ! $this->is_enabled() ) {
					( new SendUsageTask() )->cancel();
				}
			}
		);

		// Register the action handler only if enabled.
		if ( $this->is_enabled() ) {
			add_filter(
				'wpforms_tasks_get_tasks',
				static function ( $tasks ) {

					$tasks[] = SendUsageTask::class;

					return $tasks;
				}
			);
		}
	}

	/**
	 * Add "Allow Usage Tracking" to WPForms settings.
	 *
	 * @since 1.6.1
	 *
	 * @param array $settings WPForms settings.
	 *
	 * @return array
	 */
	public function settings_misc_option( $settings ) {

		$settings['misc'][ self::SETTINGS_SLUG ] = [
			'id'     => self::SETTINGS_SLUG,
			'name'   => esc_html__( 'Allow Usage Tracking', 'wpforms-lite' ),
			'desc'   => esc_html__( 'By allowing us to track usage data, we can better help you, as we will know which WordPress configurations, themes, and plugins we should test.', 'wpforms-lite' ),
			'type'   => 'toggle',
			'status' => true,
		];

		return $settings;
	}

	/**
	 * Get the User Agent string that will be sent to the API.
	 *
	 * @since 1.6.1
	 *
	 * @return string
	 */
	public function get_user_agent(): string {

		return 'WPForms/' . WPFORMS_VERSION . '; ' . get_bloginfo( 'url' );
	}

	/**
	 * Get data for sending to the server.
	 *
	 * @since 1.6.1
	 *
	 * @return array
	 * @noinspection PhpUndefinedConstantInspection
	 * @noinspection PhpUndefinedFunctionInspection
	 */
	public function get_data(): array {

		global $wpdb;

		$theme_data           = wp_get_theme();
		$activated_dates      = get_option( 'wpforms_activated', [] );
		$first_form_date      = get_option( 'wpforms_forms_first_created' );
		$forms                = $this->get_all_forms();
		$forms_total          = count( $forms );
		$form_templates_total = count( $this->get_all_forms( 'wpforms-template' ) );
		$entries_total        = $this->get_entries_total();
		$form_fields_count    = $this->get_form_fields_count( $forms );

		$data = [
			// Generic data (environment).
			'url'                            => home_url(),
			'php_version'                    => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
			'wp_version'                     => get_bloginfo( 'version' ),
			'mysql_version'                  => $wpdb->db_version(),
			'server_version'                 => isset( $_SERVER['SERVER_SOFTWARE'] ) ? sanitize_text_field( wp_unslash( $_SERVER['SERVER_SOFTWARE'] ) ) : '',
			'is_ssl'                         => is_ssl(),
			'is_multisite'                   => is_multisite(),
			'is_network_activated'           => $this->is_active_for_network(),
			'is_wpcom'                       => defined( 'IS_WPCOM' ) && IS_WPCOM,
			'is_wpcom_vip'                   => ( defined( 'WPCOM_IS_VIP_ENV' ) && WPCOM_IS_VIP_ENV ) || ( function_exists( 'wpcom_is_vip' ) && wpcom_is_vip() ),
			'is_wp_cache'                    => defined( 'WP_CACHE' ) && WP_CACHE,
			'is_wp_rest_api_enabled'         => $this->is_rest_api_enabled(),
			'is_user_logged_in'              => is_user_logged_in(),
			'sites_count'                    => $this->get_sites_total(),
			'active_plugins'                 => $this->get_active_plugins(),
			'theme_name'                     => $theme_data->get( 'Name' ),
			'theme_version'                  => $theme_data->get( 'Version' ),
			'locale'                         => get_locale(),
			'timezone_offset'                => wp_timezone_string(),
			// WPForms-specific data.
			'wpforms_version'                => WPFORMS_VERSION,
			'wpforms_license_key'            => wpforms_get_license_key(),
			'wpforms_license_type'           => $this->get_license_type(),
			'wpforms_license_status'         => $this->get_license_status(),
			'wpforms_is_pro'                 => wpforms()->is_pro(),
			'wpforms_entries_avg'            => $this->get_entries_avg( $forms_total, $entries_total ),
			'wpforms_entries_total'          => $entries_total,
			'wpforms_entries_last_7days'     => $this->get_entries_total( '7days' ),
			'wpforms_entries_last_30days'    => $this->get_entries_total( '30days' ),
			'wpforms_forms_total'            => $forms_total,
			'wpforms_form_fields_count'      => $form_fields_count,
			'wpforms_form_templates_total'   => $form_templates_total,
			'wpforms_form_antispam_stat'     => $this->get_form_antispam_stat( $forms ),
			'wpforms_challenge_stats'        => get_option( 'wpforms_challenge', [] ),
			'wpforms_lite_installed_date'    => $this->get_installed( $activated_dates, 'lite' ),
			'wpforms_pro_installed_date'     => $this->get_installed( $activated_dates, 'pro' ),
			'wpforms_builder_opened_date'    => (int) get_option( 'wpforms_builder_opened_date', 0 ),
			'wpforms_settings'               => $this->get_settings(),
			'wpforms_integration_active'     => $this->get_forms_integrations( $forms ),
			'wpforms_payments_active'        => $this->get_payments_active( $forms ),
			'wpforms_product_quantities'     => [
				'payment-single' => $this->count_fields_with_setting( $forms, 'payment-single', 'enable_quantity' ),
				'payment-select' => $this->count_fields_with_setting( $forms, 'payment-select', 'enable_quantity' ),
			],
			'wpforms_order_summaries'        => $this->count_fields_with_setting( $forms, 'payment-total', 'summary' ),
			'wpforms_multiple_confirmations' => count( $this->get_forms_with_multiple_confirmations( $forms ) ),
			'wpforms_multiple_notifications' => count( $this->get_forms_with_multiple_notifications( $forms ) ),
			'wpforms_ajax_form_submissions'  => count( $this->get_ajax_form_submissions( $forms ) ),
			'wpforms_notification_count'     => wpforms()->obj( 'notifications' )->get_count(),
			'wpforms_stats'                  => $this->get_additional_stats(),
			'wpforms_ai'                     => AIHelpers::is_used(),
			'wpforms_ai_killswitch'          => AIHelpers::is_disabled(),
		];

		if ( ! empty( $first_form_date ) ) {
			$data['wpforms_forms_first_created'] = $first_form_date;
		}

		if ( $data['is_multisite'] ) {
			$data['url_primary'] = network_site_url();
		}

		return $data;
	}

	/**
	 * Get the license type.
	 *
	 * @since 1.6.1
	 * @since 1.7.2 Clarified the license type.
	 * @since 1.7.9 Return only the license type, not the status.
	 *
	 * @return string
	 */
	private function get_license_type(): string {

		return wpforms()->is_pro() ? wpforms_get_license_type() : 'lite';
	}

	/**
	 * Get the license status.
	 *
	 * @since 1.7.9
	 *
	 * @return string
	 */
	private function get_license_status(): string { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		if ( ! wpforms()->is_pro() ) {
			return 'lite';
		}

		$license_type = wpforms_get_license_type();
		$license_key  = wpforms_get_license_key();

		if ( ! $license_type ) {
			return empty( $license_key ) ? 'no license' : 'not verified';
		}

		if ( wpforms_setting( 'is_expired', false, 'wpforms_license' ) ) {
			return 'expired';
		}

		if ( wpforms_setting( 'is_disabled', false, 'wpforms_license' ) ) {
			return 'disabled';
		}

		if ( wpforms_setting( 'is_invalid', false, 'wpforms_license' ) ) {
			return 'invalid';
		}

		// The correct type is returned in get_license_type(), so we "collapse" them here to a single value.
		if ( in_array( $license_type, [ 'basic', 'plus', 'pro', 'elite', 'ultimate', 'agency' ], true ) ) {
			$license_type = 'correct';
		}

		return $license_type;
	}

	/**
	 * Get all settings, except those with sensitive data.
	 *
	 * @since 1.6.1
	 *
	 * @return array
	 */
	private function get_settings(): array {

		// Remove keys with exact names that we don't need.
		$settings = array_diff_key(
			get_option( 'wpforms_settings', [] ),
			array_flip(
				[
					'stripe-test-secret-key',
					'stripe-test-publishable-key',
					'stripe-live-secret-key',
					'stripe-live-publishable-key',
					'stripe-webhooks-secret-test',
					'stripe-webhooks-secret-live',
					'stripe-webhooks-id-test',
					'stripe-webhooks-id-live',
					'authorize_net-test-api-login-id',
					'authorize_net-test-transaction-key',
					'authorize_net-live-api-login-id',
					'authorize_net-live-transaction-key',
					'square-location-id-sandbox',
					'square-location-id-production',
					'geolocation-google-places-api-key',
					'geolocation-algolia-places-application-id',
					'geolocation-algolia-places-search-only-api-key',
					'geolocation-mapbox-search-access-token',
					'recaptcha-site-key',
					'recaptcha-secret-key',
					'recaptcha-fail-msg',
					'hcaptcha-site-key',
					'hcaptcha-secret-key',
					'hcaptcha-fail-msg',
					'turnstile-site-key',
					'turnstile-secret-key',
					'turnstile-fail-msg',
					'pdf-ninja-api_key',
				]
			)
		);

		$data = [];

		// Remove keys with a vague names that we don't need.
		foreach ( $settings as $key => $value ) {
			if ( strpos( $key, 'validation-' ) !== false ) {
				continue;
			}

			$data[ $key ] = $value;
		}

		$lite_connect_data = get_option( Integration::get_option_name() );

		// If lite connect has been restored, set lite connect data.
		if (
			isset( $lite_connect_data['import']['status'] ) &&
			$lite_connect_data['import']['status'] === 'done'
		) {
			$data['lite_connect'] = [
				'restore_date'         => $lite_connect_data['import']['ended_at'],
				'restored_entry_count' => Integration::get_entries_count(),
			];
		}

		// Add favorite templates to the settings array.
		return array_merge( $data, $this->get_favorite_templates() );
	}

	/**
	 * Get the list of active plugins.
	 *
	 * @since 1.6.1
	 *
	 * @return array
	 */
	private function get_active_plugins(): array {

		if ( ! function_exists( 'get_plugins' ) ) {
			include ABSPATH . '/wp-admin/includes/plugin.php';
		}
		$active  = is_multisite() ?
			array_merge( get_option( 'active_plugins', [] ), array_flip( get_site_option( 'active_sitewide_plugins', [] ) ) ) :
			get_option( 'active_plugins', [] );
		$plugins = array_intersect_key( get_plugins(), array_flip( $active ) );

		return array_map(
			static function ( $plugin ) {

				if ( isset( $plugin['Version'] ) ) {
					return $plugin['Version'];
				}

				return 'Not Set';
			},
			$plugins
		);
	}

	/**
	 * Installed date.
	 *
	 * @since 1.6.1
	 *
	 * @param array  $activated_dates Input array with dates.
	 * @param string $key             Input key what you want to get.
	 *
	 * @return mixed
	 */
	private function get_installed( array $activated_dates, string $key ) {

		if ( ! empty( $activated_dates[ $key ] ) ) {
			return $activated_dates[ $key ];
		}

		return false;
	}

	/**
	 * Number of forms with some integrations active.
	 *
	 * @since 1.6.1
	 *
	 * @param array $forms List of forms.
	 *
	 * @return array List of forms with active integrations count.
	 */
	private function get_forms_integrations( array $forms ): array {

		$integrations = array_map(
			static function ( $form ) {

				if ( empty( $form->post_content['providers'] ) ) {
					return false;
				}

				$active_integrations = [];

				foreach ( $form->post_content['providers'] as $provider_slug => $connections ) {
					if ( ! empty( $connections ) ) {
						$active_integrations[] = $provider_slug;
					}
				}

				return $active_integrations;
			},
			$forms
		);

		$integrations = array_filter( $integrations );

		if ( count( $integrations ) > 0 ) {
			$integrations = call_user_func_array( 'array_merge', array_values( $integrations ) );
		}

		return array_count_values( $integrations );
	}

	/**
	 * Number of forms with active payments.
	 *
	 * @since 1.6.1
	 *
	 * @param array $forms Input forms list.
	 *
	 * @return array List of forms with active payments count.
	 */
	private function get_payments_active( array $forms ): array {

		$payments = array_map(
			static function ( $form ) {

				if ( empty( $form->post_content['payments'] ) ) {
					return false;
				}

				$enabled = [];

				foreach ( $form->post_content['payments'] as $key => $value ) {
					if ( ! empty( $value['enable'] ) ) {
						$enabled[] = $key;
					}
				}

				return empty( $enabled ) ? false : $enabled;
			},
			$forms
		);

		$payments = array_filter( $payments );

		if ( count( $payments ) > 0 ) {
			$payments = call_user_func_array( 'array_merge', array_values( $payments ) );
		}

		return array_count_values( $payments );
	}

	/**
	 * Forms with multiple notifications.
	 *
	 * @since 1.6.1
	 *
	 * @param array $forms List of forms to check.
	 *
	 * @return array List of forms with multiple notifications.
	 */
	private function get_forms_with_multiple_notifications( array $forms ): array {

		return array_filter(
			$forms,
			static function ( $form ) {

				return ! empty( $form->post_content['settings']['notifications'] ) && count( $form->post_content['settings']['notifications'] ) > 1;
			}
		);
	}

	/**
	 * Forms with multiple confirmations.
	 *
	 * @since 1.6.1
	 *
	 * @param array $forms List of forms to check.
	 *
	 * @return array List of forms with multiple confirmations.
	 */
	private function get_forms_with_multiple_confirmations( array $forms ): array {

		return array_filter(
			$forms,
			static function ( $form ) {

				return ! empty( $form->post_content['settings']['confirmations'] ) && count( $form->post_content['settings']['confirmations'] ) > 1;
			}
		);
	}

	/**
	 * Forms with ajax submission option enabled.
	 *
	 * @since 1.6.1
	 *
	 * @param array $forms All forms.
	 *
	 * @return array
	 */
	private function get_ajax_form_submissions( array $forms ): array {

		return array_filter(
			$forms,
			static function ( $form ) {

				return ! empty( $form->post_content['settings']['ajax_submit'] );
			}
		);
	}

	/**
	 * Total number of sites.
	 *
	 * @since 1.6.1
	 *
	 * @return int
	 */
	private function get_sites_total(): int {

		return function_exists( 'get_blog_count' ) ? (int) get_blog_count() : 1;
	}

	/**
	 * Total number of entries.
	 *
	 * @since 1.6.1
	 *
	 * @param string $period Which period should be counted? Possible values: 7days, 30days.
	 *                       Everything else will mean "all" entries.
	 *
	 * @return int
	 */
	private function get_entries_total( string $period = 'all' ): int {

		if ( ! wpforms()->is_pro() ) {
			return $this->get_entries_total_lite( $period );
		}

		$args = [];

		// Limit results to only forms, excluding form templates.
		$form_ids = wp_list_pluck( $this->get_all_forms(), 'ID' );

		if ( ! empty( $form_ids ) ) {
			$args['form_id'] = $form_ids;
		}

		switch ( $period ) {
			case '7days':
				$args = [
					'date' => [
						gmdate( 'Y-m-d', strtotime( '-7 days' ) ),
						gmdate( 'Y-m-d' ),
					],
				];
				break;

			case '30days':
				$args = [
					'date' => [
						gmdate( 'Y-m-d', strtotime( '-30 days' ) ),
						gmdate( 'Y-m-d' ),
					],
				];
				break;
		}

		$entry_obj = wpforms()->obj( 'entry' );

		return $entry_obj ? $entry_obj->get_entries( $args, true ) : 0;
	}

	/**
	 * Total number of entries in Lite.
	 *
	 * @since 1.9.0
	 *
	 * @param string $period Which period should be counted? Possible values: 7days, 30days.
	 *                       Everything else will mean "all" entries.
	 *
	 * @return int
	 */
	private function get_entries_total_lite( string $period = 'all' ): int {

		if ( $period === '7days' || $period === '30days' ) {
			return 0;
		}

		global $wpdb;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$count = $wpdb->get_var(
			"SELECT SUM(meta_value)
				FROM $wpdb->postmeta
				WHERE meta_key = 'wpforms_entries_count';"
		);

		return (int) $count;
	}

	/**
	 * Forms field occurrences.
	 *
	 * @since 1.7.9
	 *
	 * @param array $forms List of forms.
	 *
	 * @return array List of field occurrences in all forms created.
	 */
	private function get_form_fields_count( array $forms ): array {

		// Bail early, in case there are no forms created yet!
		if ( empty( $forms ) ) {
			return [];
		}

		$fields = array_map(
			static function ( $form ) {

				return $form->post_content['fields'] ?? [];
			},
			$forms
		);

		$fields_flatten = array_merge( [], ...$fields );
		$field_types    = array_column( $fields_flatten, 'type' );

		return array_count_values( $field_types );
	}

	/**
	 * Determines whether the plugin is active for the entire network.
	 *
	 * This is a copy of the WP core is_plugin_active_for_network() function.
	 *
	 * @since 1.8.2
	 *
	 * @return bool
	 */
	private function is_active_for_network(): bool {

		// Bail early, in case we are not in multisite.
		if ( ! is_multisite() ) {
			return false;
		}

		// Get all active plugins.
		$plugins = get_site_option( 'active_sitewide_plugins' );

		// Bail early, in case the plugin is active for the entire network.
		if ( isset( $plugins[ plugin_basename( WPFORMS_PLUGIN_FILE ) ] ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Average entries count.
	 *
	 * @since 1.6.1
	 *
	 * @param int $forms   Total forms count.
	 * @param int $entries Total entries count.
	 *
	 * @return int
	 */
	private function get_entries_avg( int $forms, int $entries ): int {

		return $forms ? round( $entries / $forms ) : 0;
	}

	/**
	 * Get all forms.
	 *
	 * @since 1.6.1
	 * @since 1.8.9 Added post_type parameter.
	 *
	 * @param string|string[] $post_type Allow to sort result by post_type. By default, it's 'wpforms'.
	 *
	 * @return array
	 */
	private function get_all_forms( $post_type = 'wpforms' ): array {

		$forms = wpforms()->obj( 'form' )->get( '', [ 'post_type' => $post_type ] );

		if ( ! is_array( $forms ) ) {
			return [];
		}

		return array_map(
			static function ( $form ) {

				$form->post_content = wpforms_decode( $form->post_content );

				return $form;
			},
			$forms
		);
	}

	/**
	 * Get the favorite templates.
	 *
	 * @since 1.7.7
	 *
	 * @return array
	 */
	private function get_favorite_templates(): array {

		$settings  = [];
		$templates = (array) get_option( Templates::FAVORITE_TEMPLATES_OPTION, [] );

		foreach ( $templates as $user_templates ) {
			foreach ( $user_templates as $template => $v ) {
				$name              = 'fav_templates_' . str_replace( '-', '_', $template );
				$settings[ $name ] = empty( $settings[ $name ] ) ? 1 : ++$settings[ $name ];
			}
		}

		return $settings;
	}

	/**
	 * Test if the REST API is accessible.
	 *
	 * The REST API might be inaccessible due to various security measures,
	 * or it might be completely disabled by a plugin.
	 *
	 * @since 1.8.2.2
	 *
	 * @return bool
	 */
	private function is_rest_api_enabled(): bool {

		// phpcs:disable WPForms.PHP.ValidateHooks.InvalidHookName
		/** This filter is documented in wp-includes/class-wp-http-streams.php */
		$sslverify = apply_filters( 'https_local_ssl_verify', false );
		// phpcs:enable WPForms.PHP.ValidateHooks.InvalidHookName

		$url      = rest_url( 'wp/v2/types/post' );
		$response = wp_remote_get(
			$url,
			[
				'timeout'   => 10,
				'cookies'   => is_user_logged_in() ? wp_unslash( $_COOKIE ) : [],
				'sslverify' => $sslverify,
				'headers'   => [
					'Cache-Control' => 'no-cache',
					'X-WP-Nonce'    => wp_create_nonce( 'wp_rest' ),
				],
			]
		);

		// When testing the REST API, an error was encountered, leave early.
		if ( is_wp_error( $response ) ) {
			return false;
		}

		// When testing the REST API, an unexpected result was returned, leave early.
		if ( wp_remote_retrieve_response_code( $response ) !== 200 ) {
			return false;
		}

		// The REST API did not behave correctly, leave early.
		if ( ! wpforms_is_json( wp_remote_retrieve_body( $response ) ) ) {
			return false;
		}

		// We are all set. Confirm the connection.
		return true;
	}

	/**
	 * Retrieves additional statistics.
	 *
	 * @since 1.8.8
	 *
	 * @return array
	 */
	private function get_additional_stats(): array {

		// Initialize an empty array to store the statistics.
		$stats = [];

		return $this->get_admin_pointer_stats( $stats );
	}

	/**
	 * Retrieves statistics for admin pointers.
	 * This function retrieves statistics for admin pointers based on their engagement or dismissal status.
	 *
	 * Note: Pointers can only be engaged (interacted with) or dismissed.
	 *
	 * - If the value is 1 or true, it means the pointer is shown and interacted with (engaged).
	 * - If the value is 0 or false, it means the pointer is dismissed.
	 * - If there is no pointer ID in the stats, it means the user hasn't seen the pointer yet.
	 *
	 * @since 1.8.8
	 *
	 * @param array $stats An array containing existing statistics.
	 *
	 * @return array
	 */
	private function get_admin_pointer_stats( array $stats ): array {

		$pointers = get_option( 'wpforms_pointers', [] );

		// If there are no pointers, return empty statistics.
		if ( empty( $pointers ) ) {
			return $stats;
		}

		// Pointers can only be interacted with or dismissed.

		// If there are engagement pointers, process them.
		if ( isset( $pointers['engagement'] ) ) {
			foreach ( $pointers['engagement'] as $pointer ) {
				$stats[ sanitize_key( $pointer ) ] = true;
			}
		}

		// If there are dismiss pointers, process them.
		if ( isset( $pointers['dismiss'] ) ) {
			foreach ( $pointers['dismiss'] as $pointer ) {
				$stats[ sanitize_key( $pointer ) ] = false;
			}
		}

		return $stats;
	}

	/**
	 * Retrieves form anti-spam settings statistic.
	 *
	 * @since 1.9.0
	 *
	 * @param array $forms List of forms and their settings.
	 *
	 * @return array
	 */
	private function get_form_antispam_stat( array $forms ): array { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded

		$stat = [
			'antispam'           => 0,
			'antispam_v3'        => 0,
			'akismet'            => 0,
			'store_spam_entries' => 0,
			'time_limit'         => 0,
			'country_filter'     => 0,
			'keyword_filter'     => 0,
			'captcha'            => 0,
		];

		foreach ( $forms as $form ) {
			$settings = $form->post_content['settings'] ?? [];

			// Skip forms with disabled anti-spam settings.
			if ( empty( $settings['antispam'] ) && empty( $settings['antispam_v3'] ) ) {
				continue;
			}

			// Increment the counters for each form with enabled anti-spam settings.
			$stat['antispam']    += ! empty( $settings['antispam'] ) ? 1 : 0; // Classic anti-spam enabled.
			$stat['antispam_v3'] += ! empty( $settings['antispam_v3'] ) ? 1 : 0; // Modern anti-spam enabled.

			$anti_spam = $settings['anti_spam'] ?? [];

			// Increment the counter for each enabled anti-spam feature.
			$stat['akismet']            += ! empty( $anti_spam['akismet'] ) ? 1 : 0;
			$stat['store_spam_entries'] += ! empty( $settings['store_spam_entries'] ) ? 1 : 0;
			$stat['time_limit']         += ! empty( $anti_spam['time_limit']['enable'] ) ? 1 : 0;
			$stat['country_filter']     += ! empty( $anti_spam['country_filter']['enable'] ) ? 1 : 0;
			$stat['keyword_filter']     += ! empty( $anti_spam['keyword_filter']['enable'] ) ? 1 : 0;
			$stat['captcha']            += ! empty( $settings['recaptcha'] ) ? 1 : 0;
		}

		// Count the list of keywords for the keyword filter.
		$keyword_filter   = wpforms()->obj( 'antispam_keyword_filter' );
		$keywords         = method_exists( $keyword_filter, 'get_keywords' ) ? $keyword_filter->get_keywords() : [];
		$stat['keywords'] = count( $keywords );

		return $stat;
	}

	/**
	 * Count how many field have a specific setting enabled.
	 *
	 * @since 1.9.0.3
	 *
	 * @param array  $forms         Published forms.
	 * @param string $field_type    Field type.
	 * @param string $field_setting Field setting.
	 *
	 * @return int
	 */
	private function count_fields_with_setting( array $forms, string $field_type, string $field_setting ): int { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		$counter = 0;

		// Bail early, in case there are no forms.
		if ( empty( $forms ) ) {
			return $counter;
		}

		// Go through all forms.
		foreach ( $forms as $form ) {

			$fields = $form->post_content['fields'] ?? [];

			if ( empty( $fields ) ) {
				continue;
			}

			// Go through all fields on the form.
			foreach ( $fields as $field ) {

				if ( ! empty( $field['type'] ) && $field['type'] === $field_type && ! empty( $field[ $field_setting ] ) ) {
					++$counter;
				}
			}
		}

		return $counter;
	}
}
