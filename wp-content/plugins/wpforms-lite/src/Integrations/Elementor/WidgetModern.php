<?php

// phpcs:ignore Generic.Commenting.DocComment.MissingShort
/** @noinspection PhpUndefinedClassInspection */

namespace WPForms\Integrations\Elementor;

use Elementor\Plugin;
use Elementor\Controls_Manager;
use Exception;
use WPForms\Frontend\CSSVars;

/**
 * WPForms modern widget for Elementor page builder.
 *
 * @since 1.8.3
 */
class WidgetModern extends Widget {

	/**
	 * Size options for widget settings.
	 *
	 * @since 1.8.3
	 *
	 * @var array
	 */
	protected $size_options;

	/**
	 * Instance of CSSVars class.
	 *
	 * @since 1.8.3
	 *
	 * @var CSSVars
	 */
	protected $css_vars_obj;

	/**
	 * Widget constructor.
	 *
	 * @since 1.8.3
	 *
	 * @param array $data Widget data.
	 * @param array $args Widget arguments.
	 *
	 * @throws Exception If arguments are missing when initializing a full widget.
	 * @noinspection PhpUndefinedMethodInspection
	 */
	public function __construct( $data = [], $args = null ) {

		parent::__construct( $data, $args );

		$this->load();
	}

	/**
	 * Load widget.
	 *
	 * @since 1.8.3
	 */
	private function load() {

		$this->size_options = [
			'small'  => esc_html__( 'Small', 'wpforms-lite' ),
			'medium' => esc_html__( 'Medium', 'wpforms-lite' ),
			'large'  => esc_html__( 'Large', 'wpforms-lite' ),
		];
		$this->css_vars_obj = wpforms()->obj( 'css_vars' );
	}

	/**
	 * Register widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.8.3
	 */
	protected function register_controls() {

		$this->content_controls();
		$this->style_controls();
	}

	/**
	 * Register widget controls for Style section.
	 *
	 * Adds different input fields into the "Style" section to allow the user to change and customize the widget style settings.
	 *
	 * @since 1.8.3
	 */
	private function style_controls() {

		$this->add_field_style_controls();
		$this->add_label_style_controls();
		$this->add_button_style_controls();
		$this->add_advanced_style_controls();
	}

	/**
	 * Register widget controls for Field Style section.
	 *
	 * Adds controls to the "Field Styles" section of the Widget Style settings.
	 *
	 * @since 1.8.3
	 *
	 * @noinspection PhpUndefinedMethodInspection
	 */
	protected function add_field_style_controls() {

		$this->start_controls_section(
			'field_styles',
			[
				'label' => esc_html__( 'Field Styles', 'wpforms-lite' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'lead_forms_notice',
			[
				'show_label'      => false,
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => sprintf(
					'<strong>%s</strong>%s',
					esc_html__( 'Form Styles are disabled because Lead Form Mode is turned on.', 'wpforms-lite' ),
					esc_html__( 'To change the styling for this form, open it in the form builder and edit the options in the Lead Forms settings.', 'wpforms-lite' )
				),
				'classes'         => 'wpforms-elementor-lead-forms-notice',
				'content_classes' => 'elementor-panel-alert elementor-panel-alert-warning',
			]
		);

		$this->add_control(
			'fieldSize',
			[
				'label'   => esc_html__( 'Size', 'wpforms-lite' ),
				'type'    => Controls_Manager::SELECT,
				'options' => $this->size_options,
				'default' => 'medium',
			]
		);

		$this->add_control(
			'fieldBorderRadius',
			[
				'label'   => esc_html__( 'Border Radius (px)', 'wpforms-lite' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => '3',
			]
		);

		$this->add_control(
			'fieldBackgroundColor',
			[
				'label'   => esc_html__( 'Background', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'default' => CSSVars::ROOT_VARS['field-background-color'],
			]
		);

		$this->add_control(
			'fieldBorderColor',
			[
				'label'   => esc_html__( 'Border', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'alpha'   => true,
				'default' => CSSVars::ROOT_VARS['field-border-color'],
			]
		);

		$this->add_control(
			'fieldTextColor',
			[
				'label'   => esc_html__( 'Text', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'alpha'   => true,
				'default' => CSSVars::ROOT_VARS['field-text-color'],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register widget controls for Label Style section.
	 *
	 * Adds controls to the "Label Styles" section of the Widget Style settings.
	 *
	 * @since 1.8.3
	 *
	 * @noinspection PhpUndefinedMethodInspection
	 */
	private function add_label_style_controls() {

		$this->start_controls_section(
			'label_styles',
			[
				'label' => esc_html__( 'Label Styles', 'wpforms-lite' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'labelSize',
			[
				'label'   => esc_html__( 'Size', 'wpforms-lite' ),
				'type'    => Controls_Manager::SELECT,
				'options' => $this->size_options,
				'default' => 'medium',
			]
		);

		$this->add_control(
			'labelColor',
			[
				'label'   => esc_html__( 'Label', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'alpha'   => true,
				'default' => CSSVars::ROOT_VARS['label-color'],
			]
		);

		$this->add_control(
			'labelSublabelColor',
			[
				'label'   => esc_html__( 'Sublabel & Hint', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'alpha'   => true,
				'default' => CSSVars::ROOT_VARS['label-sublabel-color'],
			]
		);

		$this->add_control(
			'labelErrorColor',
			[
				'label'   => esc_html__( 'Error', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'default' => CSSVars::ROOT_VARS['label-error-color'],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register widget controls for "Button Style" section.
	 *
	 * Adds controls to the "Button Styles" section of the Widget Style settings.
	 *
	 * @since 1.8.3
	 *
	 * @noinspection PhpUndefinedMethodInspection
	 */
	private function add_button_style_controls() {

		$this->start_controls_section(
			'button_styles',
			[
				'label' => esc_html__( 'Button Styles', 'wpforms-lite' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'buttonSize',
			[
				'label'   => esc_html__( 'Size', 'wpforms-lite' ),
				'type'    => Controls_Manager::SELECT,
				'options' => $this->size_options,
				'default' => 'medium',
			]
		);

		$this->add_control(
			'buttonBorderRadius',
			[
				'label'   => esc_html__( 'Border Radius (px)', 'wpforms-lite' ),
				'type'    => Controls_Manager::NUMBER,
				'default' => '3',
			]
		);

		$this->add_control(
			'buttonBackgroundColor',
			[
				'label'   => esc_html__( 'Background', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'default' => CSSVars::ROOT_VARS['button-background-color'],
			]
		);

		$this->add_control(
			'buttonTextColor',
			[
				'label'   => esc_html__( 'Text', 'wpforms-lite' ),
				'type'    => Controls_Manager::COLOR,
				'default' => CSSVars::ROOT_VARS['button-text-color'],
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Register widget controls for "Button Style" section.
	 *
	 * Adds controls to the "Button Styles" section of the Widget Style settings.
	 *
	 * @since 1.8.3
	 *
	 * @noinspection PhpUndefinedMethodInspection
	 */
	private function add_advanced_style_controls() {

		$this->start_controls_section(
			'advanced',
			[
				'label' => esc_html__( 'Advanced', 'wpforms-lite' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			]
		);

		$this->add_control(
			'className',
			[
				'label'        => esc_html__( 'Additional Classes', 'wpforms-lite' ),
				'type'         => Controls_Manager::TEXT,
				'description'  => esc_html__( 'Separate multiple classes with spaces.', 'wpforms-lite' ),
				'ai'           => [
					'active' => false,
				],
				'prefix_class' => '', // Prevents re-rendering of the widget.
			]
		);

		$this->add_control(
			'ACDivider',
			[
				'type' => Controls_Manager::DIVIDER,
			]
		);

		$this->add_control(
			'copyPasteJsonValue',
			[
				'label'       => esc_html__( 'Copy / Paste Style Settings', 'wpforms-lite' ),
				'type'        => Controls_Manager::TEXTAREA,
				'description' => esc_html__( 'If you\'ve copied style settings from another form, you can paste them here to add the same styling to this form. Any current style settings will be overwritten.', 'wpforms-lite' ),
				'ai'          => [
					'active' => false,
				],
			]
		);

		$this->add_control(
			'CPDivider',
			[
				'type' => Controls_Manager::DIVIDER,
			]
		);

		$this->add_control(
			'resetStyleSettings',
			[
				'type'        => Controls_Manager::BUTTON,
				'button_type' => 'default',
				'show_label'  => false,
				'text'        => esc_html__( 'Reset Style Settings', 'wpforms-lite' ),
				'event'       => 'elementorWPFormsResetStyleSettings',
				'classes'     => 'wpforms-reset-style-settings',
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render widget output on the frontend.
	 *
	 * @since 1.8.3
	 *
	 * @noinspection PhpUndefinedMethodInspection
	 */
	protected function render_frontend() {

		if ( empty( $this->css_vars_obj ) ) {
			return;
		}

		static $is_root_vars_displayed = false;
		$widget_id                     = $this->get_id();

		// Do not output root CSS variables more than once or if it is a library template preview.
		if ( ! $is_root_vars_displayed && ! isset( $_GET['elementor_library'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			$this->css_vars_obj->output_root( true );
			$is_root_vars_displayed = true;
		}

		$attr           = $this->get_settings_for_display();
		$css_vars       = $this->css_vars_obj->get_customized_css_vars( $attr );
		$custom_classes = ! empty( $attr['className'] ) ? trim( $attr['className'] ) : '';

		if ( ! empty( $css_vars ) ) {

			$style_id = 'wpforms-css-vars-elementor-widget-' . $widget_id;

			/**
			 * Filter the CSS selector for output CSS variables for styling the form in Elementor widget.
			 *
			 * @since 1.8.3
			 *
			 * @param string $selector The CSS selector for output CSS variables for styling the Elementor Widget.
			 * @param array  $attr     Attributes passed by Elementor Widget.
			 * @param array  $css_vars CSS variables data.
			 */
			$vars_selector = apply_filters(
				'wpforms_integrations_elementor_widget_modern_output_css_vars_selector',
				".elementor-widget-wpforms.elementor-element-{$widget_id}",
				$attr,
				$css_vars
			);

			$this->css_vars_obj->output_selector_vars( $vars_selector, $css_vars, $style_id );
		}

		// Add custom classes.
		if ( $custom_classes ) {
			$this->add_render_attribute(
				'_wrapper',
				[
					'class' => [
						$custom_classes,
					],
				]
			);
		}

		// Render selected form.
		$this->render_form();
	}

	/**
	 * Get settings for display.
	 *
	 * @since 1.8.3
	 *
	 * @param string $setting_key Optional. The key of the requested setting. Default is null.
	 *
	 * @return mixed The settings.
	 * @noinspection PhpUndefinedMethodInspection
	 */
	public function get_settings_for_display( $setting_key = null ) {

		$settings = parent::get_settings_for_display( $setting_key );

		if ( ! empty( $setting_key ) ) {
			return $settings;
		}

		$settings['fieldBorderRadius']  = isset( $settings['fieldBorderRadius'] ) ? $settings['fieldBorderRadius'] . 'px' : CSSVars::ROOT_VARS['field-border-radius'];
		$settings['buttonBorderRadius'] = isset( $settings['buttonBorderRadius'] ) ? $settings['buttonBorderRadius'] . 'px' : CSSVars::ROOT_VARS['button-border-radius'];

		if ( isset( $settings['__globals__'] ) ) {
			$settings = $this->check_global_styles( $settings );
		}

		return $settings;
	}

	/**
	 * Check if global styles are used in colors controls and update its values with the real ones.
	 *
	 * @since 1.8.3
	 *
	 * @param array $settings Widget settings.
	 *
	 * @return array Updated settings.
	 * @noinspection PhpUndefinedFieldInspection
	 */
	private function check_global_styles( $settings ) {

		$global_settings = $settings['__globals__'];
		$kit             = Plugin::$instance->kits_manager->get_active_kit_for_frontend();
		$system_colors   = $kit->get_settings_for_display( 'system_colors' );
		$custom_colors   = $kit->get_settings_for_display( 'custom_colors' );
		$global_colors   = array_merge( $system_colors, $custom_colors );

		foreach ( $global_settings as $key => $value ) {
			if ( empty( $value ) ) {
				continue;
			}

			$color_id = str_replace( 'globals/colors?id=', '', $value );

			foreach ( $global_colors as $color ) {
				if ( $color['_id'] === $color_id ) {
					$settings[ $key ] = $color['color'];
				}
			}
		}

		return $settings;
	}
}
