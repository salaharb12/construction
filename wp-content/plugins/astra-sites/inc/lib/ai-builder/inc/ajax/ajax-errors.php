<?php
/**
 * Ai Builder Ajax Errors.
 *
 * @package Ai Builder
 */

namespace AiBuilder\Inc\Ajax;

use AiBuilder\Inc\Traits\Instance;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class AjaxErrors
 */
class AjaxErrors {

	use Instance;

	/**
	 * Errors
	 *
	 * @access private
	 * @var array<string, string> Errors strings.
	 * @since 1.0.0
	 */
	private static $errors = array();

	/**
	 * Constructor
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		self::$errors = array(
			'permission' => __( 'Sorry, you are not allowed to do this operation.', 'astra-sites' ),
			'nonce'      => __( 'Nonce validation failed', 'astra-sites' ),
			'default'    => __( 'Sorry, something went wrong.', 'astra-sites' ),
		);
	}

	/**
	 * Get error message.
	 *
	 * @param string $type Message type.
	 * @return string
	 */
	public function get_error_msg( $type ) {

		if ( ! isset( self::$errors[ $type ] ) ) {
			$type = 'default';
		}

		return self::$errors[ $type ];
	}
}

AjaxErrors::Instance();
