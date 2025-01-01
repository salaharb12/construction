<?php

namespace WPForms\Integrations\Elementor;

use Elementor\Plugin as ElementorPlugin;
use WPForms\Frontend\CSSVars;
use WPForms\Integrations\IntegrationInterface;

/**
 * Improve Elementor Compatibility.
 *
 * @since 1.6.0
 */
class Elementor implements IntegrationInterface {

	/**
	 * Indicates if current integration is allowed to load.
	 *
	 * @since 1.6.0
	 *
	 * @return bool
	 */
	public function allow_load() {

		return (bool) did_action( 'elementor/loaded' );
	}

	/**
	 * Load an integration.
	 *
	 * @since 1.6.0
	 */
	public function load() {

		$this->hooks();
	}

	/**
	 * Integration hooks.
	 *
	 * @since 1.6.0
	 */
	protected function hooks() {

		// Skip if Elementor is not available.
		if ( ! class_exists( '\Elementor\Plugin' ) ) {
			return;
		}

		add_action( 'elementor/preview/init', [ $this, 'init' ] );
		add_action( 'elementor/frontend/after_enqueue_scripts', [ $this, 'preview_assets' ] );
		add_action( 'elementor/frontend/after_enqueue_scripts', [ $this, 'frontend_assets' ] );
		add_action( 'elementor/editor/after_enqueue_styles', [ $this, 'editor_assets' ] );

		version_compare( ELEMENTOR_VERSION, '3.5.0', '>=' ) ?
			add_action( 'elementor/widgets/register', [ $this, 'register_widget' ] ) :
			add_action( 'elementor/widgets/widgets_registered', [ $this, 'register_widget' ] );

		add_action( 'wp_ajax_wpforms_admin_get_form_selector_options', [ $this, 'ajax_get_form_selector_options' ] );
		add_filter( 'wpforms_integrations_gutenberg_form_selector_allow_render', [ $this, 'disable_gutenberg_block_render' ] );
		add_filter( 'wpforms_forms_anti_spam_v3_is_honeypot_enabled', [ $this, 'filter_is_honeypot_enabled' ] );
	}

	/**
	 * Init the main logic.
	 *
	 * @since 1.6.0
	 */
	public function init() { // phpcs:ignore WPForms.PHP.HooksMethod.InvalidPlaceForAddingHooks

		/**
		 * Allow developers to determine whether the compatibility layer should be applied.
		 * We do this check here because we want this filter to be available for theme developers too.
		 *
		 * @since 1.6.0
		 *
		 * @param bool $use_compat Use compatibility.
		 */
		$use_compat = (bool) apply_filters( 'wpforms_apply_elementor_preview_compat', true ); // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName

		if ( $use_compat !== true ) {
			return;
		}

		// Load WPForms assets globally on Elementor Preview panel only.
		add_filter( 'wpforms_global_assets', '__return_true' );

		// Hide CAPTCHA badge on Elementor Preview panel.
		add_filter( 'wpforms_frontend_recaptcha_disable', '__return_true' );
	}

	/**
	 * Load assets in the preview panel.
	 *
	 * @since 1.6.2
	 */
	public function preview_assets() {

		if ( ! ElementorPlugin::$instance->preview->is_preview_mode() ) {
			return;
		}

		$min = wpforms_get_min_suffix();

		wp_enqueue_style(
			'wpforms-integrations',
			WPFORMS_PLUGIN_URL . "assets/css/admin-integrations{$min}.css",
			null,
			WPFORMS_VERSION
		);

		wp_enqueue_script(
			'wpforms-elementor',
			WPFORMS_PLUGIN_URL . "assets/js/integrations/elementor/editor{$min}.js",
			[ 'elementor-frontend', 'jquery', 'wp-util', 'wpforms' ],
			WPFORMS_VERSION,
			true
		);

		if ( $this->is_modern_widget() ) {
			wp_enqueue_script(
				'wpforms-elementor-modern',
				WPFORMS_PLUGIN_URL . "assets/js/integrations/elementor/editor-modern{$min}.js",
				[ 'wpforms-elementor' ],
				WPFORMS_VERSION,
				true
			);
		}

		// Define strings for JS.
		$strings = [
			'heads_up'                    => esc_html__( 'Heads up!', 'wpforms-lite' ),
			'cancel'                      => esc_html__( 'Cancel', 'wpforms-lite' ),
			'confirm'                     => esc_html__( 'Confirm', 'wpforms-lite' ),
			'reset_style_settings'        => esc_html__( 'Reset Style Settings', 'wpforms-lite' ),
			'reset_settings_confirm_text' => esc_html__( 'Are you sure you want to reset the style settings for this form? All your current styling will be removed and canʼt be recovered.', 'wpforms-lite' ),
			'copy_paste_error'            => esc_html__( 'There was an error parsing your JSON code. Please check your code and try again.', 'wpforms-lite' ),
		];

		wp_localize_script(
			'wpforms-elementor',
			'wpformsElementorVars',
			[
				'ajax_url'      => admin_url( 'admin-ajax.php' ),
				'nonce'         => wp_create_nonce( 'wpforms-elementor-integration' ),
				'edit_form_url' => admin_url( 'admin.php?page=wpforms-builder&view=fields&form_id=' ),
				'add_form_url'  => admin_url( 'admin.php?page=wpforms-builder&view=setup' ),
				'css_url'       => WPFORMS_PLUGIN_URL . "assets/css/admin-integrations{$min}.css",
				'debug'         => wpforms_debug(),
				'strings'       => $strings,
				'sizes'         => [
					'field-size'  => CSSVars::FIELD_SIZE,
					'label-size'  => CSSVars::LABEL_SIZE,
					'button-size' => CSSVars::BUTTON_SIZE,
				],
			]
		);
	}

	/**
	 * Load an integration assets on the frontend.
	 *
	 * @since 1.6.2
	 */
	public function frontend_assets() {

		if ( ElementorPlugin::$instance->preview->is_preview_mode() ) {
			return;
		}

		$min = wpforms_get_min_suffix();

		wp_register_script(
			'wpforms-elementor',
			WPFORMS_PLUGIN_URL . "assets/js/integrations/elementor/frontend{$min}.js",
			[ 'elementor-frontend', 'jquery', 'wp-util', 'wpforms' ],
			WPFORMS_VERSION,
			true
		);

		wp_localize_script(
			'wpforms-elementor',
			'wpformsElementorVars',
			[
				'captcha_provider' => wpforms_setting( 'captcha-provider', 'recaptcha' ),
				'recaptcha_type'   => wpforms_setting( 'recaptcha-type', 'v2' ),
			]
		);
	}

	/**
	 * Load assets in the elementor document.
	 *
	 * @since 1.6.2
	 */
	public function editor_assets() {

		if ( empty( $_GET['action'] ) || $_GET['action'] !== 'elementor' ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$min = wpforms_get_min_suffix();

		wp_enqueue_style(
			'wpforms-integrations',
			WPFORMS_PLUGIN_URL . "assets/css/admin-integrations{$min}.css",
			null,
			WPFORMS_VERSION
		);

		// Choices.js.
		wp_enqueue_script(
			'choicesjs',
			WPFORMS_PLUGIN_URL . 'assets/lib/choices.min.js',
			[],
			'10.2.0',
			false
		);
	}

	/**
	 * Register WPForms Widget.
	 *
	 * @since 1.6.2
	 * @since 1.7.6 Added support for new registration method since 3.5.0.
	 * @since 1.8.3 Added a condition for selecting the required widget instance.
	 */
	public function register_widget() {

		$widget_instance = $this->is_modern_widget() ? new WidgetModern() : new Widget();

		version_compare( ELEMENTOR_VERSION, '3.5.0', '>=' ) ?
			ElementorPlugin::instance()->widgets_manager->register( $widget_instance ) :
			ElementorPlugin::instance()->widgets_manager->register_widget_type( $widget_instance );
	}

	/**
	 * Get form selector options.
	 *
	 * @since 1.6.2
	 */
	public function ajax_get_form_selector_options() {

		check_ajax_referer( 'wpforms-elementor-integration', 'nonce' );

		wp_send_json_success( ( new Widget() )->get_form_selector_options() );
	}

	/**
	 * Detect modern Widget.
	 *
	 * @since 1.8.3
	 */
	protected function is_modern_widget() {

		return wpforms_get_render_engine() === 'modern' && (int) wpforms_setting( 'disable-css', '1' ) === 1;
	}

	/**
	 * Disable the block render for pages built in Elementor.
	 *
	 * @since 1.8.8
	 *
	 * @param bool $allow_render Whether to allow the block render.
	 *
	 * @return bool Whether to disable the block render.
	 */
	public function disable_gutenberg_block_render( $allow_render ): bool {

		$document = ElementorPlugin::$instance->documents->get( get_the_ID() );

		if ( $document && $document->is_built_with_elementor() ) {
			return false;
		}

		return $allow_render;
	}

	/**
	 * Disable honeypot on the preview panel.
	 *
	 * @since 1.9.0
	 *
	 * @param bool|mixed $is_enabled True if the honeypot is enabled, false otherwise.
	 *
	 * @return bool Whether to disable the honeypot.
	 * @noinspection PhpUndefinedFieldInspection
	 */
	public function filter_is_honeypot_enabled( $is_enabled ): bool {

		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$action = sanitize_key( $_REQUEST['action'] ?? '' );

		if (
			in_array( $action, [ 'elementor', 'elementor_ajax' ], true ) ||
			ElementorPlugin::$instance->preview->is_preview_mode()
		) {
			return false;
		}

		return (bool) $is_enabled;
	}
}
