<?php
/**
 * INitialize API.
 *
 * @package {{package}}
 * @since 0.0.1
 */

namespace AiBuilder\Inc\Api;

use AiBuilder\Inc\Traits\Instance;

/**
 * Api_Base
 *
 * @since 0.0.1
 */
class ApiInit {

	use Instance;

	/**
	 * Controller object.
	 *
	 * @var object class.
	 */
	public $controller = null;

	/**
	 * Constructor
	 *
	 * @since 0.0.1
	 */
	public function __construct() {
	}
}
