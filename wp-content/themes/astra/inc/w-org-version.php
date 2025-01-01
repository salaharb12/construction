<?php
/**
 * This file ensures that it is w.org Astra theme.
 *
 * @package Astra
 * @since Astra 4.8.4
 */

/**
 * Function to filter input of Custom Layout's code editor.
 *
 * @param  string $output Output.
 * @param  string $key Key.
 * @return string
 * @since 4.8.4
 */
function astra_default_filter_input( $output, $key ) {
	return filter_input( INPUT_POST, $key, FILTER_DEFAULT ); // phpcs:ignore WordPressVIPMinimum.Security.PHPFilterFunctions.RestrictedFilter -- Default filter after all other cases, Keeping this filter for backward compatibility.
}

add_filter( 'astra_php_default_filter_input', 'astra_default_filter_input', 10, 2 );
