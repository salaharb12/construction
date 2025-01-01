<?php
/**
 * WPForms What's New modal template.
 *
 * @since 1.8.7
 *
 * @var array $header Header data.
 * @var array $footer Footer data.
 * @var array $blocks Blocks data.
 * @var array $license License type.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<script type="text/html" id="tmpl-wpforms-splash-modal-content">
	<div id="wpforms-splash-modal">
		<?php
		//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo wpforms_render( 'admin/splash/header', $header, true );
		?>
		<main>
			<?php
				foreach ( $blocks as $section ) {
					//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo wpforms_render( 'admin/splash/section', $section, true );
				}
			?>
		</main>
		<?php
			if ( $license === 'lite' ) {
				//phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo wpforms_render( 'admin/splash/footer', $footer, true );
			}
		?>
	</div>
</script>
