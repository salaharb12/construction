<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load the field types.
 *
 * @since 1.0.0
 */
class WPForms_Fields {

	/**
	 * Primary class constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {

		$this->init();
	}

	/**
	 * Initialize hooks.
	 *
	 * @since 1.2.8
	 * @since 1.8.2 Moved base class loading to \WPForms\WPForms::includes.
	 */
	public function init() {

		$this->hooks();
	}

	/**
	 * Hooks.
	 *
	 * @since 1.7.7
	 */
	private function hooks() {

		// Load default fields on WP init.
		add_action( 'init', [ $this, 'load' ] );
	}

	/**
	 * Load default field types.
	 *
	 * @since 1.0.0
	 */
	public function load() {

		$fields = [
			'text',
			'textarea',
			'select',
			'radio',
			'checkbox',
			'divider',
			'entry-preview',
			'email',
			'url',
			'hidden',
			'html',
			'content',
			'name',
			'password',
			'address',
			'phone',
			'date-time',
			'number',
			'page-break',
			'rating',
			'file-upload',
			'payment-credit-card',
			'number-slider',
			'richtext',
			'internal-information',
		];

		// Include GDPR Checkbox field if GDPR enhancements are enabled.
		if ( wpforms_setting( 'gdpr', false ) ) {
			$fields[] = 'gdpr-checkbox';
		}

		/**
		 * Filters array of fields to be loaded.
		 *
		 * @since 1.0.0
		 *
		 * @param array $fields Field types.
		 */
		$fields = (array) apply_filters( // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName
			'wpforms_load_fields',
			$fields
		);

		foreach ( $fields as $field ) {

			$file = WPFORMS_PLUGIN_DIR . 'includes/fields/class-' . $field . '.php';

			if ( file_exists( $file ) ) {
				require_once $file;
				continue;
			}

			$pro_file = WPFORMS_PLUGIN_DIR . 'pro/includes/fields/class-' . $field . '.php';

			if ( wpforms()->is_pro() && file_exists( $pro_file ) ) {
				require_once $pro_file;
			}
		}

		// We have to put it here due to tests for restricted emails.
		new WPForms_Field_Email();
	}
}

new WPForms_Fields();
