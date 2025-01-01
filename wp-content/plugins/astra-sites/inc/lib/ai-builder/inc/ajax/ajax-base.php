<?php
/**
 * AiBuilder Ajax Base.
 *
 * @package AiBuilder
 */

namespace AiBuilder\Inc\Ajax;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use AiBuilder\Inc\Ajax\AjaxErrors;

/**
 * Class Admin_Menu.
 */
abstract class AjaxBase {

	/**
	 * Ajax action prefix.
	 *
	 * @var string
	 */
	private $prefix = 'astra-sites';

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
	}

	/**
	 * Register ajax events.
	 *
	 * @param array<int, string> $ajax_events Ajax events.
	 *
	 * @return void
	 */
	public function init_ajax_events( $ajax_events ) {

		if ( ! empty( $ajax_events ) ) {

			foreach ( $ajax_events as $ajax_event ) {
				add_action( 'wp_ajax_' . $this->prefix . '-' . $ajax_event, array( $this, $ajax_event ) ); // @phpstan-ignore-line
			}
		}
	}

	/**
	 * Get ajax error message.
	 *
	 * @param string $type Message type.
	 * @return string
	 */
	public function get_error_msg( $type ) {

		if ( class_exists( 'AiBuilder\Inc\Ajax\AjaxErrors' ) && method_exists( AjaxErrors::Instance(), 'get_error_msg' ) ) {
			return AjaxErrors::Instance()->get_error_msg( $type );
		}

		return '';
	}
}
