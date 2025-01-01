<?php
/**
 * Helpers functions for the Education pages.
 *
 * @since 1.8.2.2
 */

/**
 * Get the button.
 *
 * @since 1.8.2.2
 *
 * @param string $action       Action to perform.
 * @param bool   $plugin_allow Is plugin allowed.
 * @param string $path         Plugin file.
 * @param string $url          URL for download plugin.
 * @param array  $utm          UTM parameters.
 */
function wpforms_edu_get_button( $action, $plugin_allow, $path, $url, $utm ) {

	// If the user is not allowed to use the plugin, show the upgrade button.
	if ( ! $plugin_allow ) {
		wpforms_edu_get_upgrade_button( $utm );

		return;
	}

	$status      = 'inactive';
	$data_plugin = $path;
	$title       = esc_html__( 'Activate', 'wpforms-lite' );
	$can_install = wpforms_can_install( 'addon' );

	if ( $action === 'install' ) {
		$status      = 'download';
		$data_plugin = $url;
		$title       = esc_html__( 'Install & Activate', 'wpforms-lite' );
	}

	?>

	<?php if ( $action === 'install' && ! $can_install ) : ?>
		<div class="wpforms-notice wpforms-error">
			<p><?php esc_html_e( 'Plugin installation is disabled for this site.', 'wpforms-lite' ); ?></p>
		</div>
	<?php else : ?>
		<button
			class="status-<?php echo esc_attr( $status ); ?> wpforms-btn wpforms-btn-lg wpforms-btn-blue wpforms-education-toggle-plugin-btn"
			data-type="addon"
			data-action="<?php echo esc_attr( $action ); ?>"
			data-plugin="<?php echo esc_attr( $data_plugin ); ?>">
			<i></i><?php echo esc_html( $title ); ?>
	<?php endif; ?>
	<?php
}

/**
 * Get the upgrade button.
 *
 * @since 1.8.2.2
 *
 * @param array $utm     UTM parameters.
 * @param array $classes Classes.
 */
function wpforms_edu_get_upgrade_button( $utm, $classes = [] ) {

	$utm_medium  = isset( $utm['medium'] ) ? $utm['medium'] : '';
	$utm_content = isset( $utm['content'] ) ? $utm['content'] : '';

	$default_classes   = [ 'wpforms-btn', 'wpforms-btn-lg', 'wpforms-btn-orange' ];
	$default_classes[] = ! wpforms()->is_pro() ? 'wpforms-upgrade-modal' : '';

	$btn_classes = array_merge( $default_classes, (array) $classes );
	?>
	<a
		href="<?php echo esc_url( wpforms_admin_upgrade_link( $utm_medium, $utm_content ) ); ?>"
		target="_blank"
		rel="noopener noreferrer"
		class="<?php echo esc_attr( implode( ' ', array_filter( $btn_classes ) ) ); ?>">
		<?php esc_html_e( 'Upgrade to WPForms Pro', 'wpforms-lite' ); ?>
	</a>
	<?php
}
