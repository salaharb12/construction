<?php
/**
 * Dashboard widget welcome message block template.
 *
 * @since 1.8.8
 *
 * @var string $welcome_message Welcome message.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>
<div class="wpforms-dash-widget-block wpforms-dash-widget-welcome-block">
	<span class="wpforms-dash-widget-welcome">
		<?php
		echo wp_kses(
			$welcome_message,
			[
				'a'      => [
					'href'  => [],
					'class' => [],
				],
				'strong' => [],
			]
		);
		?>
	</span>
	<button type="button" class="wpforms-dash-widget-dismiss-icon" title="<?php esc_html_e( 'Dismiss', 'wpforms-lite' ); ?>" data-field="hide_welcome_block">
		<span class="dashicons dashicons-no-alt"></span>
	</button>
</div>
