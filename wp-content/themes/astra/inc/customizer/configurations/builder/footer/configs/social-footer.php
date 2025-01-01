<?php
/**
 * Social footer Configuration.
 *
 * @package     Astra
 * @link        https://wpastra.com/
 * @since       4.5.2
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register social footer builder Customizer Configurations.
 *
 * @param array $configurations Astra Customizer Configurations.
 * @since 4.5.2
 * @return array Astra Customizer Configurations with updated configurations.
 */
function astra_social_footer_configuration( $configurations = array() ) {

	$_configs = Astra_Social_Icon_Component_Configs::register_configuration( $configurations, 'footer', 'section-fb-social-icons-' );

	if ( Astra_Builder_Customizer::astra_collect_customizer_builder_data() ) {
		array_map( 'astra_save_footer_customizer_configs', $_configs );
	}

	return $_configs;
}

if ( Astra_Builder_Customizer::astra_collect_customizer_builder_data() ) {
	add_action( 'init', 'astra_social_footer_configuration', 10, 0 );
}
