<?php

namespace WPForms\Admin\Builder\Settings;

/**
 * Themes panel.
 *
 * @since 1.8.8
 */
class Themes {

	/**
	 * Init class.
	 *
	 * @since 1.8.8
	 */
	public function init() {

		$this->hooks();
	}

	/**
	 * Register hooks.
	 *
	 * @since 1.8.8
	 */
	protected function hooks() {

		add_action( 'wpforms_form_settings_panel_content', [ $this, 'panel_content' ], 10, 0 );
	}

	/**
	 * Add a content for `Themes` panel.
	 *
	 * @since 1.8.8
	 */
	public function panel_content() {
		?>
		<div class="wpforms-panel-content-section wpforms-panel-content-section-themes">
			<div class="wpforms-panel-content-section-themes-inner">
				<div class="wpforms-panel-content-section-themes-top">
					<div class="wpforms-panel-content-section-title">
						<?php esc_html_e( 'Form Themes', 'wpforms-lite' ); ?>
					</div>

					<?php
						$this->get_top_alert();
						$this->get_main_content();
					?>

				</div> <!-- .wpforms-panel-content-section-themes-top -->
				<div class="wpforms-panel-content-section-themes-bottom">
					<?php $this->get_bottom_alert(); ?>
				</div> <!-- .wpforms-panel-content-section-themes-bottom -->
			</div> <!-- .wpforms-panel-content-section-themes-inner -->
		</div> <!-- .wpforms-panel-content-section-themes -->
		<?php
	}

	/**
	 * Get top alert.
	 *
	 * @since 1.8.8
	 */
	private function get_top_alert() {

		if ( $this->is_using_modern_markup() ) {
			return;
		}

		?>
			<div class="wpforms-alert wpforms-alert-warning">
				<div class="wpforms-aside-left">
					<p class="wpforms-alert-heading">
						<?php esc_html_e( 'Before You Can Use Form Themes', 'wpforms-lite' ); ?>
					</p>
					<p class="wpforms-alert-content">
						<?php esc_html_e( 'Upgrade your forms to use our modern markup and unlock form themes and style controls.', 'wpforms-lite' ); ?>
					</p>
				</div>
				<div class="wpforms-aside-right">
					<a class="wpforms-btn wpforms-btn-md wpforms-btn-light-grey"
						href="<?php echo esc_url( admin_url( 'admin.php?page=wpforms-settings' ) ); ?>">
						<?php esc_html_e( 'Enable Modern Markup', 'wpforms-lite' ); ?>
					</a>
				</div>
			</div>
		<?php
	}

	/**
	 * Get bottom alert.
	 *
	 * @since 1.8.8
	 */
	private function get_bottom_alert() {

		if ( ! $this->is_using_modern_markup() ) {
			return;
		}

		$url = wpforms_utm_link( 'https://wpforms.com/features/suggest/', 'Builder Themes', 'Theme Request Link' );
		?>
			<div class="wpforms-alert wpforms-alert-info wpforms-bottom">
				<div class="wpforms-aside-left">
					<p class="wpforms-alert-heading">
						<?php esc_html_e( 'Not Using the Block Editor? Let us know!', 'wpforms-lite' ); ?>
					</p>
					<p class="wpforms-alert-content">
						<?php esc_html_e( 'If we get enough requests for themes in the form builder we may add them.', 'wpforms-lite' ); ?>
					</p>
				</div>
				<div class="wpforms-aside-right">
					<a class="wpforms-btn wpforms-btn-md wpforms-btn-light-grey"
						rel="noopener noreferrer"
						href="<?php echo esc_url( $url ); ?>"
						target="_blank">
						<?php esc_html_e( 'Request Feature', 'wpforms-lite' ); ?>
					</a>
				</div>
			</div>
		<?php
	}

	/**
	 * Get main content.
	 *
	 * @since 1.8.8
	 *
	 * @noinspection HtmlUnknownTarget
	 */
	private function get_main_content() {

		$url   = wpforms_utm_link( 'https://wpforms.com/docs/styling-your-forms/', 'Builder Themes', 'Description Link' );
		$video = 'https://www.youtube.com/embed/Km5kV-2SMLg';
		?>
		<p>
			<?php
				echo wp_kses(
					sprintf(
						/* translators: %s - URL to the documentation. */
						__( 'Customize the look and feel of your form with premade themes or simple style settings that allow you to use your own colors to match your brand. Themes and style settings are in the Block Editor, where you can see a realtime preview. <br /><a href="%s" target="_blank">Learn more about styling your forms</a>', 'wpforms-lite' ),
						esc_url( $url )
					),
					[
						'a'  => [
							'href'   => [],
							'target' => [],
						],
						'br' => [],
					]
				);
			?>
		</p>

		<div class="wpforms-panel-content-section-video">
			<iframe
				src="<?php echo esc_url( $video ); ?>"
				title="<?php esc_attr_e( 'Form Themes', 'wpforms-lite' ); ?>"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				width="640"
				height="360"
				loading="lazy"
				allowfullscreen></iframe>
		</div>
		<?php
	}

	/**
	 * Check if the form is using modern markup.
	 *
	 * @since 1.8.8
	 *
	 * @return bool
	 */
	private function is_using_modern_markup(): bool {
		// phpcs:ignore WPForms.Formatting.EmptyLineAfterFunctionDeclaration.AddEmptyLineAfterFunctionDeclaration
		return wpforms_get_render_engine() === 'modern';
	}
}
