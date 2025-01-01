<?php
/**
 * Minimum and maximum input template for Number field.
 *
 * @since 1.5.7
 *
 * @var int    $field_id  Field ID.
 * @var string $input_min Minimum input.
 * @var string $input_max Maximum input.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<div class="wpforms-input-row">
	<div class="minimum">
		<?php echo $input_min; // phpcs:ignore ?>
		<label for="wpforms-field-option-<?php echo (int) $field_id; ?>-min" class="sub-label"><?php esc_html_e( 'Minimum', 'wpforms-lite' ); ?></label>
	</div>
	<div class="maximum">
		<?php echo $input_max; // phpcs:ignore ?>
		<label for="wpforms-field-option-<?php echo (int) $field_id; ?>-max" class="sub-label"><?php esc_html_e( 'Maximum', 'wpforms-lite' ); ?></label>
	</div>
</div>
