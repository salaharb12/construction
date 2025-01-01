<?php

namespace WPForms\Admin\Education\Builder;

use WPForms\Admin\Education\AddonsItemBase;
use WPForms\Admin\Education\Helpers;

/**
 * Builder/Calculations Education feature for Lite and Pro.
 *
 * @since 1.8.4.1
 */
class Calculations extends AddonsItemBase {

	/**
	 * Support calculations in these field types.
	 *
	 * @since 1.8.4.1
	 *
	 * @var array
	 */
	const ALLOWED_FIELD_TYPES = [ 'text', 'textarea', 'number', 'hidden', 'payment-single' ];

	/**
	 * Field types that should display educational notice in the basic field options tab.
	 *
	 * @since 1.8.4.1
	 *
	 * @var array
	 */
	const BASIC_OPTIONS_NOTICE_FIELD_TYPES = [ 'number', 'payment-single' ];

	/**
	 * Indicate if current Education feature is allowed to load.
	 *
	 * @since 1.8.4.1
	 *
	 * @return bool
	 */
	public function allow_load() {

		return wpforms_is_admin_page( 'builder' ) || wpforms_is_admin_ajax();
	}

	/**
	 * Hooks.
	 *
	 * @since 1.8.4.1
	 */
	public function hooks() {

		add_action( 'wpforms_field_options_bottom_basic-options', [ $this, 'basic_options' ], 20, 2 );
		add_action( 'wpforms_field_options_bottom_advanced-options', [ $this, 'advanced_options' ], 20, 2 );
	}

	/**
	 * Display notice on basic options.
	 *
	 * @since        1.8.4.1
	 *
	 * @param array  $field    Field data.
	 * @param object $instance Builder instance.
	 *
	 * @noinspection HtmlUnknownTarget
	 * @noinspection PhpUnusedParameterInspection
	 */
	public function basic_options( $field, $instance ) {

		// Display notice in basic options only in numbers and payment-single fields.
		if ( ! in_array( $field['type'], self::BASIC_OPTIONS_NOTICE_FIELD_TYPES, true ) ) {
			return;
		}

		$dismissed       = get_user_meta( get_current_user_id(), 'wpforms_dismissed', true );
		$form_id         = $instance->form_id ?? 0;
		$dismiss_section = "builder-form-$form_id-field-options-calculations-notice";

		// Check whether it is dismissed.
		if ( ! empty( $dismissed[ 'edu-' . $dismiss_section ] ) ) {
			return;
		}

		// Display notice only if Calculations addon is released (available in `addons.json` file).
		$addon = $this->addons->get_addon( 'calculations' );

		if ( ! $addon ) {
			return;
		}

		$notice = sprintf(
			wp_kses( /* translators: %1$s - link to the WPForms.com doc article. */
				__( 'Easily perform calculations based on user input. Head over to the <a href="#advanced-tab">Advanced Tab</a> to get started or read <a href="%1$s" target="_blank" rel="noopener noreferrer">our documentation</a> to learn more.', 'wpforms-lite' ),
				[
					'a' => [
						'href'   => [],
						'rel'    => [],
						'target' => [],
					],
				]
			),
			esc_url( wpforms_utm_link( 'https://wpforms.com/docs/calculations-addon/', 'Calculations Education', 'Calculations Documentation' ) )
		);

		printf(
			'<div class="wpforms-alert-info wpforms-alert wpforms-educational-alert wpforms-calculations wpforms-dismiss-container">
				<button type="button" class="wpforms-dismiss-button" title="%1$s" data-section="%2$s"></button>
				<p>%3$s</p>
			</div>',
			esc_html__( 'Dismiss this notice.', 'wpforms-lite' ),
			esc_attr( $dismiss_section ),
			$notice // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Display advanced options.
	 *
	 * @since 1.8.4.1
	 *
	 * @param array  $field    Field data.
	 * @param object $instance Builder instance.
	 */
	public function advanced_options( $field, $instance ) {

		if ( ! in_array( $field['type'], self::ALLOWED_FIELD_TYPES, true ) ) {
			return;
		}

		$addon = $this->addons->get_addon( 'calculations' );

		if ( ! $this->is_edu_required_by_status( $addon ) ) {
			return;
		}

		$row_args            = $this->get_row_attributes( $addon );
		$row_args['content'] = $instance->field_element(
			'toggle',
			$field,
			$this->get_field_attributes( $field, $addon ),
			false
		);

		$instance->field_element( 'row', $field, $row_args );
	}

	/**
	 * Get row attributes.
	 *
	 * @since 1.8.4.1
	 *
	 * @param array $addon Addon data.
	 *
	 * @return array
	 */
	private function get_row_attributes( $addon ) {

		$default = [
			'slug' => 'calculation_is_enabled',
		];

		if ( $addon['plugin_allow'] && $addon['action'] === 'install' ) {
			return wp_parse_args(
				[
					'data'  => [
						'action'  => 'install',
						'name'    => $addon['modal_name'],
						'url'     => $addon['url'],
						'nonce'   => wp_create_nonce( 'wpforms-admin' ),
						'license' => $addon['license_level'],
					],
					'class' => 'education-modal',
				],
				$default
			);
		}

		if ( $addon['plugin_allow'] && $addon['action'] === 'activate' ) {
			return wp_parse_args(
				[
					'data'  => [
						'action' => 'activate',
						'name'   => sprintf( /* translators: %s - addon name. */
							esc_html__( '%s addon', 'wpforms-lite' ),
							$addon['name']
						),
						'path'   => $addon['path'],
						'nonce'  => wp_create_nonce( 'wpforms-admin' ),
					],
					'class' => 'education-modal',
				],
				$default
			);
		}

		return wp_parse_args(
			[
				'data'  => [
					'action'      => 'upgrade',
					'name'        => esc_html__( 'Calculations', 'wpforms-lite' ),
					'utm-content' => 'Enable Calculations',
					'license'     => $addon['license_level'],
				],
				'class' => 'education-modal',
			],
			$default
		);
	}

	/**
	 * Get attributes for address autocomplete field.
	 *
	 * @since 1.8.4.1
	 *
	 * @param array $field Field data.
	 * @param array $addon Addon data.
	 *
	 * @return array
	 * @noinspection PhpUnusedParameterInspection
	 */
	private function get_field_attributes( $field, $addon ) {

		$default = [
			'slug'  => 'calculation_is_enabled',
			'value' => '0',
			'desc'  => esc_html__( 'Enable Calculation', 'wpforms-lite' ),
		];

		if ( $addon['plugin_allow'] ) {
			return $default;
		}

		return wp_parse_args(
			[
				'desc'  => sprintf(
					'%1$s%2$s',
					esc_html__( 'Enable Calculation', 'wpforms-lite' ),
					Helpers::get_badge( $addon['license_level'], 'sm', 'inline', 'slate' )
				),
				'attrs' => [
					'disabled' => 'disabled',
				],
			],
			$default
		);
	}

	/**
	 * Determine if we require to display educational items according to the addon status.
	 *
	 * @since 1.8.4.1
	 *
	 * @param array $addon Addon data.
	 *
	 * @return bool
	 * @noinspection PhpUnusedParameterInspection
	 */
	private function is_edu_required_by_status( $addon ) {

		return ! (
			empty( $addon ) ||
			empty( $addon['action'] ) ||
			empty( $addon['status'] ) || (
				$addon['status'] === 'active' && $addon['action'] !== 'upgrade'
			)
		);
	}
}
