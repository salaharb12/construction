<?php

namespace WPForms\SmartTags\SmartTag;

/**
 * Class Order Summary.
 *
 * @since 1.8.7
 */
class OrderSummary extends SmartTag {

	/**
	 * Get smart tag value.
	 *
	 * @since 1.8.7
	 *
	 * @param array  $form_data Form data.
	 * @param array  $fields    List of fields.
	 * @param string $entry_id  Entry ID.
	 *
	 * @return string
	 */
	public function get_value( $form_data, $fields = [], $entry_id = '' ): string {

		if ( empty( $fields ) && ! $entry_id ) {
			return '';
		}

		if ( empty( $fields ) ) {
			$entry  = wpforms()->obj( 'entry' )->get( $entry_id );
			$fields = isset( $entry->fields ) ? (array) wpforms_decode( $entry->fields ) : [];
		}

		$fields = $this->prepare_fields( $fields, $form_data );

		list( $items, $foot, $total_width ) = $this->prepare_payment_fields_data( $fields );

		return wpforms_render(
			'fields/total/summary-preview',
			[
				'items'       => $items,
				'foot'        => $foot,
				'total_width' => $total_width,
				'context'     => 'smart_tag',
			],
			true
		);
	}

	/**
	 * Prepare fields data for summary preview.
	 * Add label_hide property to fields if needed.
	 *
	 * @since 1.9.2
	 *
	 * @param array $fields    Fields data.
	 * @param array $form_data Form data and settings.
	 *
	 * @return array
	 */
	private function prepare_fields( array $fields, array $form_data ): array {

		return array_map(
			function ( $field ) use ( $form_data ) {
				$form_data_fields = $form_data['fields'] ?? [];

				if ( isset( $form_data_fields[ $field['id'] ] ) ) {
					$label_hide = isset( $form_data_fields[ $field['id'] ]['label_hide'] );

					if ( $label_hide ) {
						$field['label_hide'] = true;
					}
				}

				return $field;
			},
			$fields
		);
	}

	/**
	 * Prepare payment fields data for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array $fields Fields data.
	 *
	 * @return array
	 */
	private function prepare_payment_fields_data( array $fields ): array {

		$payment_fields = wpforms_payment_fields();
		$items          = [];
		$coupon         = [];
		$foot           = [];
		$total          = 0;
		$total_width    = 0;

		foreach ( $fields as $field ) {

			if (
				empty( $field['value'] ) ||
				! in_array( $field['type'], $payment_fields, true )
			) {
				continue;
			}

			if ( $field['type'] === 'payment-coupon' ) {
				$coupon = $field;

				continue;
			}

			$this->prepare_single_item( $field, $items, $total );
			$this->prepare_multiple_item( $field, $items, $total );
		}

		$this->prepare_coupon_item( $coupon, $foot, $total, $total_width );

		$total = wpforms_format_amount( $total, true );

		$foot[] = [
			'label'    => __( 'Total', 'wpforms-lite' ),
			'quantity' => '',
			'amount'   => $total,
			'class'    => 'wpforms-order-summary-preview-total',
		];

		// Adding 1 extra character to account for symbols that may occupy more than 1ch. For example: €.
		$total_width = max( $total_width, mb_strlen( html_entity_decode( $total, ENT_COMPAT, 'UTF-8' ) ) + 1 );

		return [ $items, $foot, $total_width ];
	}

	/**
	 * Prepare single item for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array  $field Field data.
	 * @param array  $items Summary items.
	 * @param string $total Form total.
	 */
	private function prepare_single_item( array $field, array &$items, string &$total ) {

		// Single value.
		if ( ! in_array( $field['type'], [ 'payment-single', 'payment-multiple', 'payment-select' ], true ) ) {
			return;
		}

		$quantity = $this->get_payment_field_quantity( $field );

		if ( ! $quantity ) {
			return;
		}

		$label  = ! empty( $field['value_choice'] ) ? $field['name'] . ' - ' . $field['value_choice'] : $field['name'];
		$amount = $field['amount_raw'] * $quantity;

		$items[] = [
			'label'    => ! empty( $field['label_hide'] ) ? '' : $label,
			'quantity' => $quantity,
			'amount'   => wpforms_format_amount( $amount, true ),
		];

		$total += $amount;
	}

	/**
	 * Prepare multiple item for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array  $field Field data.
	 * @param array  $items Summary items.
	 * @param string $total Form total.
	 */
	private function prepare_multiple_item( array $field, array &$items, string &$total ) {

		if ( $field['type'] !== 'payment-checkbox' ) {
			return;
		}

		$quantity = $this->get_payment_field_quantity( $field );

		if ( ! $quantity ) {
			return;
		}

		// Multiple values.
		$value_choices = explode( "\n", $field['value'] );

		foreach ( $value_choices as $value_choice ) {

			$choice_data = explode( ' - ', $value_choice );
			$labels      = array_slice( $choice_data, 0, -1 );

			$items[] = [
				'label'    => ! empty( $field['label_hide'] ) ? implode( ' - ', $labels ) : $field['name'] . ' - ' . implode( ' - ', $labels ),
				'quantity' => $quantity,
				'amount'   => end( $choice_data ),
			];
		}

		$total += $field['amount_raw'];
	}

	/**
	 * Prepare coupon item for summary preview.
	 *
	 * @since 1.8.7
	 *
	 * @param array  $coupon      Coupon data.
	 * @param array  $foot        Summary footer.
	 * @param string $total       Form total.
	 * @param string $total_width Total width.
	 */
	private function prepare_coupon_item( array $coupon, array &$foot, string &$total, string &$total_width ) {

		if ( empty( $coupon ) ) {
			return;
		}

		$foot[] = [
			'label'    => __( 'Subtotal', 'wpforms-lite' ),
			'quantity' => '',
			'amount'   => wpforms_format_amount( $total, true ),
			'class'    => 'wpforms-order-summary-preview-subtotal',
		];

		$coupon_label = sprintf( /* translators: %s - Coupon value. */
			__( 'Coupon (%s)', 'wpforms-lite' ),
			$coupon['value']
		);

		$coupon_amount = $this->get_coupon_amount( $coupon );

		$foot[] = [
			'label'    => $coupon_label,
			'quantity' => '',
			'amount'   => $coupon_amount,
			'class'    => 'wpforms-order-summary-preview-coupon-total',
		];

		// Coupon value saved as negative.
		$total += $coupon['amount_raw'];

		$total_width = strlen( html_entity_decode( $coupon_amount, ENT_COMPAT, 'UTF-8' ) );
	}

	/**
	 * Get coupon amount.
	 *
	 * @since 1.8.7
	 *
	 * @param array $coupon Coupon data.
	 *
	 * @return string Formatted coupon amount.
	 */
	private function get_coupon_amount( array $coupon ): string {
		// Coupon amount saved as negative, so we need to format it nicely.
		$coupon_amount = '- ' . wpforms_format_amount( abs( $coupon['amount_raw'] ), true );

		/**
		 * Allow to filter order summary coupon amount.
		 *
		 * @since 1.8.7
		 *
		 * @param string $coupon_amount Coupon amount.
		 * @param array  $coupon        Coupon data.
		 */
		return apply_filters( 'wpforms_smart_tags_smart_tag_order_summary_coupon_amount', $coupon_amount, $coupon );
	}

	/**
	 * Get payment field quantity.
	 *
	 * @since 1.8.7
	 *
	 * @param array $field Field data.
	 *
	 * @return int
	 */
	private function get_payment_field_quantity( array $field ): int {
		// phpcs:ignore WPForms.Formatting.EmptyLineBeforeReturn.RemoveEmptyLineBeforeReturnStatement
		return isset( $field['quantity'] ) ? (int) $field['quantity'] : 1;
	}
}
