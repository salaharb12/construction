<?php
/**
 * Helper functions to perform various plugins and addons related actions.
 *
 * @since 1.8.2.2
 */

use WPForms\Requirements\Requirements;

/**
 * Check if addon met requirements.
 *
 * @since 1.8.2.2
 *
 * @param array $requirements Addon requirements.
 *
 * @return bool
 */
function wpforms_requirements( array $requirements ): bool {

	return Requirements::get_instance()->validate( $requirements );
}

/**
 * Determine if an addon is active and passed all requirements.
 *
 * @since 1.9.2
 *
 * @param string $addon_slug Addon slug without `wpforms-` prefix.
 *
 * @return bool
 */
function wpforms_is_addon_initialized( string $addon_slug ): bool {

	$addon_function = 'wpforms_' . str_replace( '-', '_', $addon_slug );

	if ( ! function_exists( $addon_function ) ) {
		return false;
	}

	$basename = sprintf( 'wpforms-%1$s/wpforms-%1$s.php', $addon_slug );

	return Requirements::get_instance()->is_validated( $basename );
}

/**
 * Check addon requirements and activate addon or plugin.
 *
 * @since 1.8.4
 * @since 1.9.2 Keep addons active even if they don't meet requirements.
 *
 * @param string $plugin Path to the plugin file relative to the plugins' directory.
 *
 * @return null|WP_Error Null on success, WP_Error on invalid file.
 */
function wpforms_activate_plugin( string $plugin ) {

	$activate = activate_plugin( $plugin );

	if ( is_wp_error( $activate ) ) {
		return $activate;
	}

	$requirements = Requirements::get_instance();

	if ( $requirements->is_validated( $plugin ) ) {
		return null;
	}

	return new WP_Error( 'wpforms_addon_incompatible', $requirements->get_notice( $plugin ) );
}
