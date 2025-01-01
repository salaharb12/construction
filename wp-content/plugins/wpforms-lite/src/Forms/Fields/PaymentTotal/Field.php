<?php

namespace WPForms\Forms\Fields\PaymentTotal;

use WPForms\Forms\Fields\Helpers\RequirementsAlerts;

/**
 * Total payment field.
 *
 * @since 1.8.2
 */
class Field extends \WPForms_Field {

	/**
	 * Primary class constructor.
	 *
	 * @since 1.8.2
	 */
	public function init() {

		// Define field type information.
		$this->name     = esc_html__( 'Total', 'wpforms-lite' );
		$this->keywords = esc_html__( 'store, ecommerce, pay, payment, sum', 'wpforms-lite' );
		$this->type     = 'payment-total';
		$this->icon     = 'fa-money';
		$this->order    = 110;
		$this->group    = 'payment';

		$this->hooks();
	}

	/**
	 * Hooks.
	 *
	 * @since 1.8.2
	 */
	private function hooks() {

		// Define additional field properties.
		add_filter( "wpforms_field_properties_{$this->type}", [ $this, 'field_properties' ], 5, 3 );

		// Recalculate total for a form.
		add_filter( 'wpforms_process_filter', [ $this, 'calculate_total' ], 10, 3 );

		// Add classes to the builder field preview.
		add_filter( 'wpforms_field_preview_class', [ $this, 'preview_field_class' ], 10, 2 );

		// Add new option on the confirmation page.
		add_action( 'wpforms_form_settings_confirmations_single_after', [ $this, 'add_confirmation_setting' ], 10, 2 );
		add_action( 'wpforms_lite_form_settings_confirmations_single_after', [ $this, 'add_confirmation_setting' ], 10, 2 );
		add_action( 'wpforms_frontend_confirmation_message_after', [ $this, 'order_summary_confirmation' ], 10, 4 );
	}

	/**
	 * Define additional field properties.
	 *
	 * @since 1.8.2
	 *
	 * @param array $properties Field properties.
	 * @param array $field      Field data and settings.
	 * @param array $form_data  Form data and settings.
	 *
	 * @return array
	 */
	public function field_properties( $properties, $field, $form_data ) {

		// Input Primary: initial total is always zero.
		$properties['inputs']['primary']['attr']['value'] = '0';

		// Input Primary: add class for targeting calculations.
		$properties['inputs']['primary']['class'][] = 'wpforms-payment-total';

		// Input Primary: add data attribute if total is required.
		if ( ! empty( $field['required'] ) ) {
			$properties['inputs']['primary']['data']['rule-required-payment'] = true;
		}

		// Check size.
		if ( ! empty( $field['size'] ) ) {
			$properties['container']['class'][] = 'wpforms-field-' . esc_attr( $field['size'] );
		}

		// Input Primary: add class for targeting summary.
		if ( $this->is_summary_enabled( $field ) ) {
			$properties['container']['class'][] = 'wpforms-summary-enabled';
		}

		// Unset for attribute for label.
		unset( $properties['label']['attr']['for'] );

		return $properties;
	}

	/**
	 * Whether current field can be populated dynamically.
	 *
	 * @since 1.8.2
	 *
	 * @param array $properties Field properties.
	 * @param array $field      Current field specific data.
	 *
	 * @return bool
	 */
	public function is_dynamic_population_allowed( $properties, $field ) {

		return false;
	}

	/**
	 * Whether current field can be populated dynamically.
	 *
	 * @since 1.8.2
	 *
	 * @param array $properties Field properties.
	 * @param array $field      Current field specific data.
	 *
	 * @return bool
	 */
	public function is_fallback_population_allowed( $properties, $field ) {

		return false;
	}

	/**
	 * Do not trust the posted total since that relies on javascript.
	 *
	 * Instead we re-calculate server side.
	 *
	 * @since 1.8.2
	 *
	 * @param array $fields    List of fields with their data.
	 * @param array $entry     Submitted form data.
	 * @param array $form_data Form data and settings.
	 *
	 * @return array
	 */
	public function calculate_total( $fields, $entry, $form_data ) {

		return self::calculate_total_static( $fields, $entry, $form_data );
	}

	/**
	 * Static version of calculate_total().
	 *
	 * @since 1.8.4
	 *
	 * @param array $fields    List of fields with their data.
	 * @param array $entry     Submitted form data.
	 * @param array $form_data Form data and settings.
	 *
	 * @return array
	 */
	public static function calculate_total_static( $fields, $entry, $form_data ) {

		if ( ! is_array( $fields ) ) {
			return $fields;
		}

		// At this point we have passed processing and validation, so we know
		// the amounts in $fields are safe to use.
		$total  = wpforms_get_total_payment( $fields );
		$amount = wpforms_sanitize_amount( $total );

		foreach ( $fields as $id => $field ) {
			if ( ! empty( $field['type'] ) && $field['type'] === 'payment-total' ) {
				$fields[ $id ]['value']      = wpforms_format_amount( $amount, true );
				$fields[ $id ]['amount']     = wpforms_format_amount( $amount );
				$fields[ $id ]['amount_raw'] = $amount;
			}
		}

		return $fields;
	}

	/**
	 * Field options panel inside the builder.
	 *
	 * @since 1.8.2
	 *
	 * @param array $field Field data and settings.
	 */
	public function field_options( $field ) {
		/*
		 * Basic field options.
		 */

		// Options open markup.
		$args = [
			'markup' => 'open',
		];

		$this->field_option( 'basic-options', $field, $args );

		// Label.
		$this->field_option( 'label', $field );

		// Description.
		$this->field_option( 'description', $field );

		// Enable Summary.
		$this->summary_option( $field );

		// Summary Notice.
		$this->summary_option_notice( $field );

		// Required toggle.
		$this->field_option( 'required', $field );

		// Options close markup.
		$args = [
			'markup' => 'close',
		];

		$this->field_option( 'basic-options', $field, $args );

		/*
		 * Advanced field options.
		 */

		// Options open markup.
		$args = [
			'markup' => 'open',
		];

		$this->field_option( 'advanced-options', $field, $args );

		// Size.
		$this->field_option(
			'size',
			$field,
			[
				'exclude' => [ 'small' ], // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude
			]
		);

		// Custom CSS classes.
		$this->field_option( 'css', $field );

		// Hide label.
		$this->field_option( 'label_hide', $field );

		// Options close markup.
		$args = [
			'markup' => 'close',
		];

		$this->field_option( 'advanced-options', $field, $args );
	}

	/**
	 * Field preview inside the builder.
	 *
	 * @since 1.8.2
	 *
	 * @param array $field Field data and settings.
	 */
	public function field_preview( $field ) {

		// Label.
		$this->field_preview_option( 'label', $field );

		list( $items, $foot, $total_width ) = $this->prepare_builder_preview_data();

		// Summary preview.
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wpforms_render(
			'fields/total/summary-preview',
			[
				'items'       => $items,
				'foot'        => $foot,
				'total_width' => $total_width,
			],
			true
		);

		// Primary field.
		echo '<div class="wpforms-total-amount">' . esc_html( wpforms_format_amount( 0, true ) ) . '</div>';

		// Description.
		$this->field_preview_option( 'description', $field );
	}

	/**
	 * Field display on the form front-end.
	 *
	 * @since 1.8.2
	 *
	 * @param array $field      Field data and settings.
	 * @param array $deprecated Deprecated, not used parameter.
	 * @param array $form_data  Form data and settings.
	 */
	public function field_display( $field, $deprecated, $form_data ) {

		$primary = $field['properties']['inputs']['primary'];
		$type    = ! empty( $field['required'] ) ? 'text' : 'hidden';
		$attrs   = $primary['attr'];

		if ( ! empty( $field['required'] ) ) {
			$attrs['style']    = 'position:absolute!important;clip:rect(0,0,0,0)!important;height:1px!important;width:1px!important;border:0!important;overflow:hidden!important;padding:0!important;margin:0!important;';
			$attrs['readonly'] = 'readonly';
		}

		// aria-errormessage attribute is not allowed for hidden inputs.
		unset( $attrs['aria-errormessage'] );

		$is_summary_enabled = $this->is_summary_enabled( $field );

		if ( $is_summary_enabled ) {

			list( $items, $foot, $total_width ) = $this->prepare_payment_fields_data( $form_data );

			// Summary preview.
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo wpforms_render(
				'fields/total/summary-preview',
				[
					'items'       => $items,
					'foot'        => $foot,
					'total_width' => $total_width,
				],
				true
			);
		}

		// Always print total to cover a case when field is embedded into Layout column with 25% width.
		$hidden_style = $is_summary_enabled ? 'display:none' : '';

		// This displays the total the user sees.
		printf(
			'<div class="wpforms-payment-total" style="%1$s">%2$s</div>',
			esc_attr( $hidden_style ),
			esc_html( wpforms_format_amount( 0, true ) )
		);

		// Hidden input for processing.
		printf(
			'<input type="%s" %s>',
			esc_attr( $type ),
			wpforms_html_attributes( $primary['id'], $primary['class'], $primary['data'], $attrs ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		);
	}

	/**
	 * Validate field on form submit.
	 *
	 * @since 1.8.2
	 *
	 * @param int    $field_id     Field ID.
	 * @param string $field_submit Submitted field value (raw data).
	 * @param array  $form_data    Form data and settings.
	 */
	public function validate( $field_id, $field_submit, $form_data ) {

		// Basic required check - If field is marked as required, check for entry data.
		if ( ! empty( $form_data['fields'][ $field_id ]['required'] ) && ( empty( $field_submit ) || wpforms_sanitize_amount( $field_submit ) <= 0 ) ) {
			wpforms()->obj( 'process' )->errors[ $form_data['id'] ][ $field_id ] = esc_html__( 'Payment is required.', 'wpforms-lite' );
		}
	}

	/**
	 * Format and sanitize field.
	 *
	 * @since 1.8.2
	 *
	 * @param int    $field_id     Field ID.
	 * @param string $field_submit Field value submitted by a user.
	 * @param array  $form_data    Form data and settings.
	 */
	public function format( $field_id, $field_submit, $form_data ) {

		// Define data.
		$name   = ! empty( $form_data['fields'][ $field_id ]['label'] ) ? $form_data['fields'][ $field_id ]['label'] : '';
		$amount = wpforms_sanitize_amount( $field_submit );

		// Set final field details.
		wpforms()->obj( 'process' )->fields[ $field_id ] = [
			'name'       => sanitize_text_field( $name ),
			'value'      => wpforms_format_amount( $amount, true ),
			'amount'     => wpforms_format_amount( $amount ),
			'amount_raw' => $amount,
			'id'         => absint( $field_id ),
			'type'       => sanitize_key( $this->type ),
		];
	}

	/**
	 * Summary option.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field data and settings.
	 */
	private function summary_option( array $field ) {

		$is_allowed = RequirementsAlerts::is_order_summary_allowed();

		$toggle_data = [
			'slug'    => 'summary',
			'value'   => $this->is_summary_enabled( $field ),
			'desc'    => esc_html__( 'Enable Summary', 'wpforms-lite' ),
			'tooltip' => esc_html__( 'Enable order summary for this field.', 'wpforms-lite' ),
		];

		if ( ! $is_allowed ) {
			$toggle_data['attrs']         = [ 'disabled' => 'disabled' ];
			$toggle_data['control-class'] = 'wpforms-toggle-control-disabled';
		}

		$output = $this->field_element(
			'toggle',
			$field,
			$toggle_data,
			false
		);

		$this->field_element(
			'row',
			$field,
			[
				'slug'    => 'summary',
				'content' => $output,
			]
		);

		if ( ! $is_allowed ) {

			$this->field_element(
				'row',
				$field,
				[
					'slug'    => 'summary_alert',
					'content' => RequirementsAlerts::get_order_summary_alert(),
				]
			);
		}
	}

	/**
	 * Summary notice on the options tab.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field data and settings.
	 */
	private function summary_option_notice( array $field ) {

		$notice           = __( 'Example data is shown in the form editor. Actual products and totals will be displayed when you preview or embed your form.', 'wpforms-lite' );
		$is_notice_hidden = ! $this->is_summary_enabled( $field ) ? 'wpforms-hidden' : '';

		printf(
			'<div class="wpforms-alert-info wpforms-alert wpforms-total-summary-alert %1$s">
				<p>%2$s</p>
			</div>',
			esc_attr( $is_notice_hidden ),
			esc_html( $notice )
		);
	}

	/**
	 * Determine if summary option is enabled.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field data and settings.
	 */
	private function is_summary_enabled( array $field ) {

		return ! empty( $field['summary'] );
	}

	/**
	 * Prepare fake fields data for builder preview.
	 *
	 * @since 1.8.7
	 *
	 * @return array
	 */
	private function prepare_builder_preview_data(): array {

		$items = [
			[
				'label'     => __( 'Example Product 1', 'wpforms-lite' ),
				'quantity'  => 3,
				'amount'    => wpforms_format_amount( 30, true ),
				'is_hidden' => false,
			],
			[
				'label'     => __( 'Example Product 2', 'wpforms-lite' ),
				'quantity'  => 2,
				'amount'    => wpforms_format_amount( 20, true ),
				'is_hidden' => false,
			],
			[
				'label'     => __( 'Example Product 3', 'wpforms-lite' ),
				'quantity'  => 1,
				'amount'    => wpforms_format_amount( 10, true ),
				'is_hidden' => false,
			],
		];

		$total = 60;

		/**
		 * Allow to filter items in the footer on the order summary table (builder screen).
		 *
		 * @since 1.8.7
		 *
		 * @param array $fields Order summary footer.
		 * @param int   $total  Fields total.
		 */
		$foot = (array) apply_filters( 'wpforms_forms_fields_payment_total_field_builder_order_summary_preview_foot', [], $total );

		/**
		 * Allow to filter builder order summary fields total.
		 *
		 * @since 1.8.7
		 *
		 * @param string $total Fields total.
		 */
		$total = apply_filters( 'wpforms_forms_fields_payment_total_field_builder_order_summary_preview_total', $total );

		$total = wpforms_format_amount( $total, true );

		$foot[] = [
			'label'    => __( 'Total', 'wpforms-lite' ),
			'quantity' => '',
			'amount'   => $total,
			'class'    => 'wpforms-order-summary-preview-total',
		];

		$total_width = strlen( html_entity_decode( $total, ENT_COMPAT, 'UTF-8' ) ) + 4;

		/**
		 * Allow to filter builder order summary total column width.
		 *
		 * @since 1.8.7
		 *
		 * @param int $total_width Total column width.
		 */
		$total_width = (int) apply_filters( 'wpforms_forms_fields_payment_total_field_builder_order_summary_preview_total_width', $total_width );

		return [ $items, $foot, $total_width ];
	}

	/**
	 * Prepare payment fields data for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array $form_data Form data.
	 *
	 * @return array
	 */
	private function prepare_payment_fields_data( array $form_data ): array {

		$payment_fields = wpforms_payment_fields();
		$fields         = [];
		$foot           = [];
		$total          = 0;

		foreach ( $form_data['fields'] as $field ) {

			if (
				( ! isset( $field['price'] ) && empty( $field['choices'] ) ) ||
				! in_array( $field['type'], $payment_fields, true )
			) {
				continue;
			}

			$this->prepare_payment_field_choices( $field, $fields, $total );
			$this->prepare_payment_field_single( $field, $fields, $total );
		}

		/**
		 * Allow to filter items in the order summary footer.
		 *
		 * @since 1.8.7
		 *
		 * @param array $fields Fields.
		 */
		$foot = (array) apply_filters( 'wpforms_forms_fields_payment_total_field_order_summary_preview_foot', $foot );

		$total = wpforms_format_amount( $total, true );

		$foot[] = [
			'label'    => __( 'Total', 'wpforms-lite' ),
			'quantity' => '',
			'amount'   => $total,
			'class'    => 'wpforms-order-summary-preview-total',
		];

		return [ $fields, $foot, strlen( html_entity_decode( $total, ENT_COMPAT, 'UTF-8' ) ) + 3 ];
	}

	/**
	 * Prepare payment single data for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field  Field data.
	 * @param array $fields Fields data.
	 * @param float $total  Fields total.
	 */
	private function prepare_payment_field_single( array $field, array &$fields, float &$total ) {

		if ( ! empty( $field['choices'] ) ) {
			return;
		}

		$quantity     = $this->get_payment_field_min_quantity( $field );
		$field_amount = ! empty( $field['price'] ) ? wpforms_sanitize_amount( $field['price'] ) * $quantity : 0;

		$fields[] = [
			'label'     => ! empty( $field['label_hide'] ) ? '' : $field['label'],
			'quantity'  => $this->get_payment_field_min_quantity( $field ),
			'amount'    => wpforms_format_amount( $field_amount, true ),
			'is_hidden' => ! $quantity,
			'class'     => 'wpforms-order-summary-field',
			'data'      => [
				'field' => $field['id'],
			],
		];

		$total += $field_amount;
	}

	/**
	 * Prepare payment field choices data for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field  Field data.
	 * @param array $fields Fields data.
	 * @param float $total  Fields total.
	 */
	private function prepare_payment_field_choices( array $field, array &$fields, float &$total ) {

		if ( empty( $field['choices'] ) ) {
			return;
		}

		$quantity           = $this->get_payment_field_min_quantity( $field );
		$default_choice_key = $this->get_classic_dropdown_default_choice_key( $field );

		foreach ( $field['choices'] as $key => $choice ) {

			$choice_amount = ! empty( $choice['value'] ) ? wpforms_sanitize_amount( $choice['value'] ) * $quantity : 0;
			$is_default    = ! empty( $choice['default'] ) || ( isset( $default_choice_key ) && (int) $key === $default_choice_key );

			$fields[] = [
				'label'     => ! empty( $field['label_hide'] ) ? $choice['label'] : $field['label'] . ' - ' . $choice['label'],
				'quantity'  => $quantity,
				'amount'    => wpforms_format_amount( $choice_amount, true ),
				'is_hidden' => ! $is_default || ! $quantity,
				'class'     => 'wpforms-order-summary-field',
				'data'      => [
					'field'  => $field['id'],
					'choice' => $key,
				],
			];

			if ( $is_default ) {
				$total += $choice_amount;
			}
		}
	}

	/**
	 * Get classic dropdown default choice key.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field Settings.
	 *
	 * @return int|null
	 */
	private function get_classic_dropdown_default_choice_key( array $field ) {

		if ( $field['type'] !== 'payment-select' || $field['style'] !== 'classic' || ! empty( $field['placeholder'] ) ) {
			return null;
		}

		foreach ( $field['choices'] as $key => $choice ) {
			if ( ! isset( $choice['default'] ) ) {
				continue;
			}

			return (int) $key;
		}

		return array_key_first( $field['choices'] );
	}

	/**
	 * Get payment field minimum quantity.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field data.
	 *
	 * @return int
	 */
	private function get_payment_field_min_quantity( array $field ): int {

		if ( ! wpforms_payment_has_quantity( $field, $this->form_data ) || ! isset( $field['min_quantity'] ) ) {
			return 1;
		}

		return (int) $field['min_quantity'];
	}

	/**
	 * Add class to the builder field preview.
	 *
	 * @since 1.8.7
	 *
	 * @param string $css   Class names.
	 * @param array  $field Field properties.
	 *
	 * @return string
	 */
	public function preview_field_class( $css, $field ) {

		if ( $field['type'] !== $this->type ) {
			return $css;
		}

		if ( $this->is_summary_enabled( $field ) ) {
			$css .= ' wpforms-summary-enabled';
		}

		return $css;
	}

	/**
	 * Add order summary to the confirmation settings.
	 *
	 * @since 1.8.7
	 *
	 * @param WPForms_Builder_Panel_Settings $settings Settings.
	 * @param int                            $field_id Field ID.
	 */
	public function add_confirmation_setting( $settings, int $field_id ) {

		wpforms_panel_field(
			'toggle',
			'confirmations',
			'message_order_summary',
			$settings->form_data,
			esc_html__( 'Show order summary after confirmation message', 'wpforms-lite' ),
			[
				'input_id'    => 'wpforms-panel-field-confirmations-message_order_summary-' . $field_id,
				'input_class' => 'wpforms-panel-field-confirmations-message_order_summary',
				'parent'      => 'settings',
				'subsection'  => $field_id,
			]
		);
	}

	/**
	 * Show order summary on the confirmation page.
	 *
	 * @since 1.8.7
	 *
	 * @param array $confirmation Current confirmation data.
	 * @param array $form_data    Form data and settings.
	 * @param array $fields       Sanitized field data.
	 * @param int   $entry_id     Entry id.
	 */
	public function order_summary_confirmation( array $confirmation, array $form_data, array $fields, int $entry_id ) {

		if ( empty( $confirmation['message_order_summary'] ) ) {
			return;
		}

		$total_exists = false;

		foreach ( $fields as $field ) {
			if ( $field['type'] !== $this->type ) {
				continue;
			}

			$total_exists = true;

			break;
		}

		// Check if total field exists on the form.
		if ( ! $total_exists ) {
			return;
		}

		echo '<div class="wpforms-confirmation-container-order-summary">';
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wpforms_process_smart_tags( '{order_summary}', $form_data, $fields, $entry_id );
		echo '</div>';
	}
}
