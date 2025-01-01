<?php

namespace WPForms\Admin\Splash;

use WPForms\Migrations\Base as MigrationsBase;

/**
 * Splash upgrader.
 *
 * @since 1.8.7
 */
class SplashUpgrader {

	use SplashTrait;

	/**
	 * Available plugins.
	 *
	 * @since 1.8.7
	 *
	 * @var array
	 */
	const AVAILABLE_PLUGINS = [
		'wpforms-lite',
		'wpforms',
	];

	/**
	 * Initialize class.
	 *
	 * @since 1.8.7
	 */
	public function init() {

		$this->hooks();
	}

	/**
	 * Hooks.
	 *
	 * @since 1.8.7
	 */
	private function hooks() {

		// Update splash data after plugin update.
		add_action( 'wpforms_migrations_base_core_upgraded', [ $this, 'update_splash_data_on_migration' ], 10, 2 );
	}

	/**
	 * Update splash modal data.
	 *
	 * @since 1.8.7
	 * @deprecated 1.8.8
	 *
	 * @param object $upgrader Upgrader object.
	 */
	public function update_splash_data( $upgrader ) {

		_deprecated_function( __METHOD__, '1.8.8 of the WPForms plugin', '\WPForms\Admin\Splash\SplashUpgrader::update_splash_data_on_migration()' );

		$result = $upgrader->result ?? null;

		// Check if plugin was updated successfully.
		if ( ! $result ) {
			return;
		}

		// Check if WPForms plugin was updated.
		$wpforms_updated = $this->is_wpforms_updated( $upgrader );

		if ( ! $wpforms_updated ) {
			return;
		}

		// Retrieve plugin version after update.
		$version = $this->get_plugin_updated_version( $upgrader );

		if ( empty( $version ) ) {
			return;
		}

		// Skip if plugin wasn't updated.
		// Continue if plugin was upgraded to the PRO version.
		if ( version_compare( $version, WPFORMS_VERSION, '<' ) ) {
			return;
		}

		$version = $this->get_major_version( $version );

		// Store updated plugin major version.
		$this->update_splash_data_version( $version );

		// Force update splash data cache.
		wpforms()->obj( 'splash_cache' )->update( true );

		// Reset hide_welcome_block widget meta for all users.
		$this->remove_hide_welcome_block_widget_meta();
	}

	/**
	 * Update splash modal data on migration.
	 *
	 * @since 1.8.8
	 *
	 * @param string|mixed   $previous_version Previous plugin version.
	 * @param MigrationsBase $migrations_obj   Migrations object.
	 */
	public function update_splash_data_on_migration( $previous_version, MigrationsBase $migrations_obj ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

		$plugin_version   = $this->get_major_version( WPFORMS_VERSION );
		$data_version     = $this->get_major_version( $this->get_splash_data_version() );
		$previous_version = $this->get_major_version( $previous_version );

		// Skip if when the splash data is already updated.
		// It is possible when the plugin was downgraded.
		if (
			version_compare( $previous_version, '1.8.7', '>' ) &&
			version_compare( $plugin_version, $data_version, '<' )
		) {
			return;
		}

		// Force update splash data cache.
		wpforms()->obj( 'splash_cache' )->update( true );

		// Reset hide_welcome_block widget meta for all users.
		$this->remove_hide_welcome_block_widget_meta();

		// Store updated plugin major version.
		$this->update_splash_data_version( $plugin_version );
	}

	/**
	 * Check if WPForms plugin was updated.
	 *
	 * @since 1.8.7
	 *
	 * @param object $upgrader Upgrader object.
	 *
	 * @return bool True if WPForms plugin was updated, false otherwise.
	 */
	private function is_wpforms_updated( $upgrader ): bool {

		// Check if updated plugin is WPForms.
		if ( ! in_array( $upgrader->result['destination_name'] ?? '', self::AVAILABLE_PLUGINS, true ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Get plugin updated version.
	 *
	 * @since 1.8.7
	 *
	 * @param object $upgrader Upgrader object.
	 *
	 * @return string Plugin updated version.
	 */
	private function get_plugin_updated_version( $upgrader ): string { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		// Get plugin data after update.
		$new_plugin_data = $upgrader->new_plugin_data ?? null;

		if ( ! $new_plugin_data ) {
			return '';
		}

		return $new_plugin_data['Version'] ?? '';
	}
}
