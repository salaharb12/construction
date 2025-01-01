<?php
/**
 * Astra Theme Customizer
 *
 * @package     Astra
 * @link        https://wpastra.com/
 * @since       Astra 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Customizer Loader
 */
if ( ! class_exists( 'Astra_Customizer' ) ) {

	/**
	 * Customizer Loader
	 *
	 * @since 1.0.0
	 */
	class Astra_Customizer {

		/**
		 * Contexts.
		 *
		 * @var object
		 */
		private static $contexts;

		/**
		 * Dynamic options.
		 *
		 * @since 3.1.0
		 * @var object
		 */
		private static $dynamic_options = array();

		/**
		 * Tabful sections.
		 *
		 * @var array
		 */
		private static $tabbed_sections = array();

		/**
		 * Choices.
		 *
		 * @var object
		 */
		private static $choices;

		/**
		 * JS Configs.
		 *
		 * @var object
		 */
		private static $js_configs;

		/**
		 * Instance
		 *
		 * @var object
		 */
		private static $instance;

		/**
		 * Customizer Configurations.
		 *
		 * @since 1.4.3
		 * @var Array
		 */
		private static $configuration;

		/**
		 * All groups parent-child relation array data.
		 *
		 * @since 2.0.0
		 * @var Array
		 */
		public static $group_configs = array();

		/**
		 * All header configs array data.
		 *
		 * @since 4.5.2
		 * @var array
		 */
		public static $customizer_header_configs = array(
			'different-retina-logo',
			'ast-header-retina-logo',
			'different-mobile-logo',
			'mobile-header-logo',
			'header-color-site-tagline',
			'ast-header-responsive-logo-width',
			'display-site-title-responsive',
			'display-site-tagline-responsive',
			'logo-title-inline',
		);

		/**
		 * All footer configs array data.
		 *
		 * @since 4.5.2
		 * @var array
		 */
		public static $customizer_footer_configs = array();

		/**
		 * Initiator
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Check if the current customizer request belongs to Astra theme.
		 * 
		 * @return bool True if it is Astra customizer, false otherwise.
		 *
		 * @since 4.8.3
		 */
		public static function is_astra_customizer() {

			// Bail early if it is the Kadence WooCommerce Email Designer plugin customizer.
			if ( class_exists( 'Kadence_Woomail_Designer' ) ) {
				if ( Kadence_Woomail_Designer::is_own_customizer_request() || Kadence_Woomail_Designer::is_own_preview_request() ) {
					return false;
				}
			}

			return true;
		}
		/**
		 * Constructor
		 */
		public function __construct() {

			add_action( 'astra_style_guide_site_icon', array( $this, 'site_icon_update' ) );

			// Hooks that are necessary even if it is not Astra's customizer.
			if ( is_admin() || is_customize_preview() ) {
				add_action( 'customize_register', array( $this, 'include_configurations' ), 2 );
			}
			add_action( 'customize_register', array( $this, 'customize_register_panel' ), 2 );
			
			// Bail early if it is not astra customizer.
			if ( ! self::is_astra_customizer() ) {
				return;
			}

			/**
			 * Customizer
			 */
			add_action( 'customize_preview_init', array( $this, 'preview_init' ) );

			if ( is_admin() || is_customize_preview() ) {
				add_action( 'customize_register', array( $this, 'prepare_customizer_javascript_configs' ) );
				add_action( 'customize_register', array( $this, 'astra_pro_upgrade_configurations' ), 2 );
				add_action( 'customize_register', array( $this, 'prepare_group_configs' ), 9 );

				add_filter( 'customize_dynamic_setting_args', array( $this, 'filter_dynamic_setting_args' ), 10, 2 );
				add_filter( 'customize_dynamic_partial_args', array( $this, 'filter_dynamic_partial_args' ), 10, 2 );

			}

			// Disable block editor for widgets in the customizer.
			if ( defined( 'GUTENBERG_VERSION' ) && version_compare( GUTENBERG_VERSION, '10.6.2', '>' ) && is_customize_preview() ) {
				add_filter( 'gutenberg_use_widgets_block_editor', '__return_false' );
			}

			add_action( 'customize_controls_enqueue_scripts', array( $this, 'controls_scripts' ) );
			add_action( 'customize_controls_enqueue_scripts', array( $this, 'enqueue_customizer_scripts' ), 999 );

			add_action( 'customize_controls_print_footer_scripts', array( $this, 'print_footer_scripts' ) );

			add_action( 'customize_register', array( $this, 'customize_register' ) );
			add_action( 'customize_register', array( $this, 'customize_register_site_icon' ), 20 );
			add_action( 'customize_save_after', array( $this, 'customize_save' ) );
			add_action( 'customize_save_after', array( $this, 'delete_cached_partials' ) );
			add_action( 'wp_head', array( $this, 'preview_styles' ) );
			add_action( 'wp_ajax_astra_regenerate_fonts_folder', array( $this, 'regenerate_astra_fonts_folder' ) );

			add_action( 'wp_footer', array( $this, 'style_guide_template' ) );
		}

		/**
		 * Add site icon control in the site identity panel.
		 *
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 * @return void
		 *
		 * @since 3.6.9
		 */
		public function customize_register_site_icon( $wp_customize ) {

			/** @psalm-suppress RedundantConditionGivenDocblockType */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			if ( true !== Astra_Builder_Helper::$is_header_footer_builder_active ) {
				/** @psalm-suppress RedundantConditionGivenDocblockType */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
				return;
			}

			$panel_arr = array(
				'priority'       => 80,
				'capability'     => 'edit_theme_options',
				'theme_supports' => '',
				'title'          => __( 'Site Identity', 'astra' ),
				'description'    => '',
			);
			// Register panel.
			/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			$wp_customize->add_panel( 'astra-site-identity', $panel_arr );
			/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort

			$section_arr = array(
				'priority'       => 80,
				'capability'     => 'edit_theme_options',
				'theme_supports' => '',
				'title'          => __( 'Site Identity', 'astra' ),
				'description'    => '',
			);

			// Register Section.
			$wp_customize->add_section( 'astra-site-identity', $section_arr );

			/** @psalm-suppress PossiblyNullPropertyAssignment */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			$wp_customize->get_control( 'site_icon' )->section = 'astra-site-identity';
			/** @psalm-suppress PossiblyNullPropertyAssignment */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort

			/** @psalm-suppress PossiblyNullPropertyAssignment */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			$wp_customize->get_control( 'site_icon' )->description = __( 'Site Icons are what you see in browser tabs, bookmark bars, and within the WordPress mobile apps. Upload one here! Site Icons should be square and at least 512 × 512 pixels.', 'astra' );
			/** @psalm-suppress PossiblyNullPropertyAssignment */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
		}

		/**
		 * Reset font folder.
		 *
		 * @return void
		 *
		 * @since 3.6.0
		 */
		public function regenerate_astra_fonts_folder() {
			check_ajax_referer( 'astra_update_admin_setting', 'security' );

			if ( ! current_user_can( 'edit_theme_options' ) ) {
				wp_send_json_error( 'invalid_permissions' );
			}

			if ( Astra_API_Init::get_admin_settings_option( 'self_hosted_gfonts', false ) ) {
				$local_font_loader = astra_webfont_loader_instance( '' );
				$flushed           = $local_font_loader->astra_delete_fonts_folder();

				if ( ! $flushed ) {
					$response_data = array( 'message' => __( 'Failed to Flush, try again later.', 'astra' ) );
					wp_send_json_error( $response_data );
				}
				wp_send_json_success();
			}

			$response_data = array( 'message' => __( 'Local font files not present.', 'astra' ) );
			wp_send_json_error( $response_data );
		}

		/**
		 *  Delete the cached partial configs.
		 */
		public function delete_cached_partials() {
			delete_option( 'astra_partials_config_cache' );

			// Delete previously stored local fonts data, if exists.
			if ( Astra_API_Init::get_admin_settings_option( 'self_hosted_gfonts', false ) ) {
				$local_webfont_loader = astra_webfont_loader_instance( '' );
				$local_webfont_loader->astra_delete_fonts_folder();
			}
		}

		/**
		 * Add dynamic control partial refresh.
		 *
		 * @since 3.1.0
		 * @param array  $partial_args partial configs.
		 * @param string $partial_id partial id.
		 * @return array|mixed
		 */
		public function filter_dynamic_partial_args( $partial_args, $partial_id ) {

			if ( isset( self::$dynamic_options['partials'][ $partial_id ] ) ) {
				if ( false === $partial_args ) {
					$partial_args = array();
				}
				$partial_args = array_merge( $partial_args, self::$dynamic_options['partials'][ $partial_id ] );
			}

			return $partial_args;
		}

		/**
		 * Add dynamic control settings.
		 *
		 * @since 3.1.0
		 * @param array  $setting_args setting configs.
		 * @param string $setting_id setting id.
		 * @return mixed
		 */
		public function filter_dynamic_setting_args( $setting_args, $setting_id ) {

			if ( isset( self::$dynamic_options['settings'][ $setting_id ] ) ) {
				return self::$dynamic_options['settings'][ $setting_id ];
			}

			return $setting_args;
		}

			/**
			 * Prepare Contexts and choices.
			 *
			 * @since 3.0.0
			 */
		public function prepare_customizer_javascript_configs() {

			global $wp_customize;

			$cached_data = get_option( 'astra_partials_config_cache', false );

			if ( $wp_customize->selective_refresh->is_render_partials_request() && $cached_data ) {
				self::$dynamic_options = $cached_data;
				return;
			}

			$configurations = $this->get_customizer_configurations();

			$defaults = $this->get_astra_customizer_configuration_defaults();

			foreach ( $configurations as $key => $configuration ) {

				$config = wp_parse_args( $configuration, $defaults );

				if ( isset( $configuration['context'] ) ) {
					self::$contexts[ $configuration['name'] ] = $configuration['context'];
				} else {
					if ( isset( $configuration['type'] ) && ( ( 'control' === $configuration['type'] ) || ( 'sub-control' === $configuration['type'] ) ) ) {
						if ( ( isset( $configuration['control'] ) && 'ast-builder-header-control' !== $configuration['control'] ) && ( isset( $configuration['name'] ) && strpos( $configuration['name'], 'ast-callback-notice' ) === false ) ) {
							self::$contexts[ $configuration['name'] ] = Astra_Builder_Helper::$general_tab;
						}
					}
				}

				if ( isset( $configuration['choices'] ) ) {
					self::$choices[ $configuration['name'] ] = $configuration['choices'];
				}

				switch ( $config['type'] ) {

					case 'panel':
						$this->prepare_javascript_panel_configs( $config );
						break;
					case 'section':
						$this->prepare_javascript_section_configs( $config );
						break;

					case 'sub-control':
						$this->prepare_javascript_sub_control_configs( $config );
						break;
					case 'control':
						$this->prepare_javascript_control_configs( $config );
						break;
				}
			}

			update_option( 'astra_partials_config_cache', self::$dynamic_options, false );

		}

		/**
		 * Get control default.
		 *
		 * @param string $setting_key setting key.
		 * @param array  $default_values default value array.
		 * @return mixed|string
		 */
		private function get_default_value( $setting_key, $default_values ) {
			$return = '';
			preg_match( '#astra-settings\[(.*?)\]#', $setting_key, $match );
			if ( ! empty( $match ) && isset( $match[1] ) ) {
				$return = isset( $default_values[ $match[1] ] ) ? $default_values[ $match[1] ] : '';
			}
			return $return;
		}

		/**
		 * Prepare tabbed sections for dynamic controls to optimize frontend JS calls.
		 */
		private static function prepare_tabbed_sections() {

			if ( ! isset( self::$js_configs['controls'] ) ) {
				return;
			}

			foreach ( self::$js_configs['controls'] as $section_id => $controls ) {
				$tab_id        = $section_id . '-ast-context-tabs';
				$control_names = wp_list_pluck( $controls, 'name' );
				if ( in_array( $tab_id, $control_names, true ) ) {
					array_push( self::$tabbed_sections, $section_id );
				}
			}

		}

		/**
		 * Print Footer Scripts
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function print_footer_scripts() {
			$output  = '<script type="text/javascript">';
			$output .= '
	        	wp.customize.bind(\'ready\', function() {
	            	wp.customize.control.each(function(ctrl, i) {
	                	var desc = ctrl.container.find(".customize-control-description");
	                	if( desc.length) {
	                    	var title 		= ctrl.container.find(".customize-control-title");
	                    	var li_wrapper 	= desc.closest("li");
	                    	var tooltip = desc.text().replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
	                    			return \'&#\'+i.charCodeAt(0)+\';\';
								});
	                    	desc.remove();
	                    	li_wrapper.append(" <i class=\'ast-control-tooltip dashicons dashicons-editor-help\'data-title=\'" + tooltip +"\'></i><span class=\'ast-dashicons-custom-tooltip\'data-title=\'" + tooltip + "\'><span>");
	                	}
	            	});
	        	});';

			$output .= Astra_Fonts_Data::js();
			$output .= '</script>';

			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}

		/**
		 *  Set default context for WP default controls.
		 */
		private static function set_default_context() {

			if ( false === Astra_Builder_Helper::$is_header_footer_builder_active ) {
				return;
			}

			self::$contexts['blogname'] = array(
				Astra_Builder_Helper::$general_tab_config,

			);

			self::$contexts['blogdescription'] = array(
				Astra_Builder_Helper::$general_tab_config,

			);

		}

		/**
		 * Bypass JS configs for Controls.
		 *
		 * @param array $configuration configuration.
		 */
		public static function bypass_control_configs( $configuration ) {

			$val = '';

			if ( isset( $configuration['name'] ) ) {

				$data = explode( '[', rtrim( $configuration['name'], ']' ) );

				if ( isset( $data[1] ) ) {
					$val = astra_get_option( $data[1] );
				}
			}

			if ( isset( $val ) && ! empty( $val ) ) {

				$configuration['value'] = $val;
			}

			switch ( $configuration['type'] ) {

				case 'ast-builder':
					if ( is_array( $configuration['default'] ) && ! isset( $configuration['default']['popup'] ) ) {
						$configuration['default']['popup'] = array( 'popup_content' => array() );
					}
					break;
				case 'ast-responsive-spacing':
					if ( ! is_array( $val ) || is_numeric( $val ) ) {

						$configuration['value'] = array(
							'desktop'      => array(
								'top'    => $val,
								'right'  => '',
								'bottom' => $val,
								'left'   => '',
							),
							'tablet'       => array(
								'top'    => $val,
								'right'  => '',
								'bottom' => $val,
								'left'   => '',
							),
							'mobile'       => array(
								'top'    => $val,
								'right'  => '',
								'bottom' => $val,
								'left'   => '',
							),
							'desktop-unit' => 'px',
							'tablet-unit'  => 'px',
							'mobile-unit'  => 'px',
						);
					}

					break;
				case 'ast-radio-image':
					$configuration['value'] = $val;

					if ( isset( $configuration['choices'] ) && is_array( $configuration['choices'] ) ) {

						foreach ( $configuration['choices'] as $key => $value ) {
							$configuration['choices'][ $key ]         = $value['path'];
							$configuration['choices_titles'][ $key ]  = $value['label'];
							$configuration['choices_upgrade'][ $key ] = isset( $value['is_pro'] ) ? $value['is_pro'] : false;
						}
					}
					if ( isset( $configuration['inputAttrs'] ) ) {

						$configuration['inputAttrs'] = '';
						$configuration['labelStyle'] = '';
							/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
						foreach ( $configuration['input_attrs'] as $attr => $value ) {
							/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
							if ( 'style' !== $attr ) {
								$configuration['inputAttrs'] .= $attr . '="' . esc_attr( $value ) . '" ';
							} else {
								$configuration['labelStyle'] = 'style="' . esc_attr( $value ) . '" ';
							}
						}
					}
					break;
				case 'ast-border':
					$configuration['value'] = $val;
					break;
				case 'ast-section-toggle':
					$configuration['value'] = $val;
					break;
				case 'ast-responsive-slider':
					if ( ! is_array( $val ) || is_numeric( $val ) ) {

						$configuration['value'] = array(
							'desktop' => $val,
							'tablet'  => '',
							'mobile'  => '',
						);
					}
					break;
				case 'ast-responsive-background':
					$configuration['value'] = $val;

					break;
				case 'ast-link':
					$configuration['value'] = $val;

					break;
				case 'ast-hidden':
					$configuration['value'] = $val;

					break;
				case 'ast-settings-group':
					$config = array();

					if ( isset( self::$group_configs[ $configuration['name'] ]['tabs'] ) ) {
						$tab = array_keys( self::$group_configs[ $configuration['name'] ]['tabs'] );
						rsort( $tab );
						foreach ( $tab as $key => $value ) {

							$config['tabs'][ $value ] = wp_list_sort( self::$group_configs[ $configuration['name'] ]['tabs'][ $value ], 'priority' );
						}
					} else {
						if ( isset( self::$group_configs[ $configuration['name'] ] ) ) {
							$config = wp_list_sort( self::$group_configs[ $configuration['name'] ], 'priority' );
						}
					}
					$configuration['ast_fields'] = $config;
					break;
				case 'ast-font-weight':
					$configuration['ast_all_font_weight'] = array(
						'100'       => __( 'Thin 100', 'astra' ),
						'100italic' => __( '100 Italic', 'astra' ),
						'200'       => __( 'Extra-Light 200', 'astra' ),
						'200italic' => __( '200 Italic', 'astra' ),
						'300'       => __( 'Light 300', 'astra' ),
						'300italic' => __( '300 Italic', 'astra' ),
						'400'       => __( 'Normal 400', 'astra' ),
						'normal'    => __( 'Normal 400', 'astra' ),
						'italic'    => __( '400 Italic', 'astra' ),
						'500'       => __( 'Medium 500', 'astra' ),
						'500italic' => __( '500 Italic', 'astra' ),
						'600'       => __( 'Semi-Bold 600', 'astra' ),
						'600italic' => __( '600 Italic', 'astra' ),
						'700'       => __( 'Bold 700', 'astra' ),
						'700italic' => __( '700 Italic', 'astra' ),
						'800'       => __( 'Extra-Bold 800', 'astra' ),
						'800italic' => __( '800 Italic', 'astra' ),
						'900'       => __( 'Ultra-Bold 900', 'astra' ),
						'900italic' => __( '900 Italic', 'astra' ),
					);
					break;
				case 'ast-sortable':
					$configuration['value'] = $val;

					if ( isset( self::$group_configs[ $configuration['name'] ] ) ) {
						/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
						$config = wp_list_sort( self::$group_configs[ $configuration['name'] ], 'priority' );
						/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
						$configuration['ast_fields'] = $config;
					}

					break;
				case 'ast-font-variant':
					$configuration['value'] = $val;
					break;
				case 'ast-number':
					$configuration['value'] = $val;
					break;
				case 'ast-select-multi':
					$configuration['value'] = $val;
					break;
				case 'ast-logo-svg-icon':
					if ( ! isset( $val['type'] ) ) {
						$configuration['value'] = array(
							'type'  => '',
							'value' => '',
						);
					} else {
						$configuration['value'] = $val;
					}

					$configuration['ast_all_svg_icons'] = function_exists( 'astra_get_logo_svg_icons_array' ) ? astra_get_logo_svg_icons_array() : array();
					break;

			} // Switch End.

			if ( isset( $configuration['id'] ) ) {

				$configuration['link'] = self::get_control_link( $configuration['id'] );
			}
			$exclude_controls = array( 'ast-builder', 'ast-radio-image' );

			if ( isset( $configuration['type'] ) && ! in_array( $configuration['type'], $exclude_controls ) && isset( $configuration['input_attrs'] ) && is_array( $configuration['input_attrs'] ) ) {

				$configuration['inputAttrs'] = '';

				foreach ( $configuration['input_attrs'] as $attr => $value ) {

					if ( ! is_array( $value ) ) {

						$configuration['inputAttrs'] .= $attr . '="' . esc_attr( $value ) . '" ';
					}
				}
			}

			return $configuration;
		}

		/**
		 * Prepare Panel Configs for Javascript.
		 *
		 * @since 3.0.0
		 * @param array $config configs.
		 */
		public function prepare_javascript_panel_configs( $config ) {

			$panel_name = astra_get_prop( $config, 'name' );

			unset( $config['type'] );
			$config['type']                            = 'ast_panel';
			$config['active']                          = true;
			$config['id']                              = $panel_name;
			self::$js_configs['panels'][ $panel_name ] = $config;
		}

		/**
		 * Prepare Section Configs for Javascript.
		 *
		 * @since 3.0.0
		 * @param array $config configs.
		 */
		public function prepare_javascript_section_configs( $config ) {

			$section_name = astra_get_prop( $config, 'name' );

			unset( $config['type'] );
			$config['type']            = isset( $config['ast_type'] ) ? $config['ast_type'] : 'ast_section';
			$config['active']          = true;
			$config['id']              = $section_name;
			$config['customizeAction'] = sprintf( __( 'Customizing ▸ %s', 'astra' ), astra_get_prop( $config, 'title' ) );

			if ( isset( $config['clone_type'] ) && isset( $config['clone_index'] ) ) {

				if ( isset( Astra_Builder_Helper::$component_count_array[ $config['clone_type'] ] ) ) {
					/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
					if ( in_array( $section_name, Astra_Builder_Helper::$component_count_array['removed-items'], true ) || Astra_Builder_Helper::$component_count_array[ $config['clone_type'] ] < $config['clone_index'] ) {
						/** @psalm-suppress PossiblyUndefinedStringArrayOffset */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
						self::$js_configs['clone_sections'][ $section_name ] = $config;
					} else {
						self::$js_configs['sections'][ $section_name ] = $config;
					}
				}
			} else {
				self::$js_configs['sections'][ $section_name ] = $config;
			}
		}

		/**
		 * Prepare Sub Control Configs for Javascript.
		 *
		 * @since 3.0.0
		 * @param array $config configs.
		 */
		public function prepare_javascript_sub_control_configs( $config ) {

			unset( $config['type'] );

			$name             = astra_get_prop( $config, 'name' );
			$parent           = astra_get_prop( $config, 'parent' );
			$sub_control_name = ASTRA_THEME_SETTINGS . '[' . $name . ']';

			$ignore_controls = array( 'ast-settings-group', 'ast-sortable', 'ast-radio-image', 'ast-slider', 'ast-responsive-slider', 'ast-section-toggle' );

			$sanitize_callback = ( in_array( $config['control'], $ignore_controls, true ) ) ? false : astra_get_prop( $config, 'sanitize_callback', Astra_Customizer_Control_Base::get_sanitize_call( astra_get_prop( $config, 'control' ) ) );

			if ( ! $sanitize_callback ) {
				$config = $this->sanitize_control( $config );
			}

			$new_config = array(
				'name'              => $sub_control_name,
				'datastore_type'    => 'option',
				'transport'         => 'postMessage',
				'control'           => 'ast-hidden',
				'section'           => astra_get_prop( $config, 'section', 'title_tagline' ),
				'title'             => astra_get_prop( $config, 'title' ),
				'priority'          => astra_get_prop( $config, 'priority', '10' ),
				'default'           => astra_get_prop( $config, 'default' ),
				'sanitize_callback' => $sanitize_callback,
				'suffix'            => astra_get_prop( $config, 'suffix' ),
				'control_type'      => astra_get_prop( $config, 'control' ),
				'linked'            => astra_get_prop( $config, 'linked' ),
				'variant'           => astra_get_prop( $config, 'variant' ),
				'help'              => astra_get_prop( $config, 'help' ),
				'description'       => astra_get_prop( $config, 'description' ),
				'input_attrs'       => astra_get_prop( $config, 'input_attrs' ),
				'disable'           => astra_get_prop( $config, 'disable' ),
			);

			self::$dynamic_options['settings'][ astra_get_prop( $new_config, 'name' ) ] = array(
				'default'           => astra_get_prop( $new_config, 'default' ),
				'type'              => astra_get_prop( $new_config, 'datastore_type' ),
				'transport'         => astra_get_prop( $new_config, 'transport', 'refresh' ),
				'sanitize_callback' => astra_get_prop( $new_config, 'sanitize_callback', Astra_Customizer_Control_Base::get_sanitize_call( astra_get_prop( $new_config, 'control' ) ) ),
			);

			$new_config['type']                               = astra_get_prop( $new_config, 'control' );
			$new_config['id']                                 = astra_get_prop( $new_config, 'name' );
			$new_config['settings']                           = array( 'default' => astra_get_prop( $new_config, 'name' ) );
			$new_config                                       = self::bypass_control_configs( $new_config );
			self::$js_configs ['sub_controls'] [ $parent ] [] = $new_config;

			// Keep contextual sub controls aside to process initially in customizer.js.
			if ( isset( $config['contextual_sub_control'] ) ) {
				self::$js_configs ['contextual_sub_controls'] [ $name ] = $new_config;
			}
		}

		/**
		 * Get the Link for Control.
		 *
		 * @since 3.0.0
		 * @param array $id Control ID.
		 */
		public static function get_control_link( $id ) {
			if ( isset( $id ) ) {
				return 'data-customize-setting-link="' . $id . '"';
			} else {
				return 'data-customize-setting-key-link="default"';
			}
		}

		/**
		 * Prepare Control Configs for Javascript.
		 *
		 * @since 3.0.0
		 * @param array $config configs.
		 */
		public function prepare_javascript_control_configs( $config ) {

			// Remove type from configuration.
			unset( $config['type'] );
			$name = astra_get_prop( $config, 'name' );

			$ignore_controls = array( 'ast-settings-group', 'ast-sortable', 'ast-radio-image', 'ast-slider', 'ast-responsive-slider', 'ast-section-toggle' );

			if ( ! isset( $config['control'] ) ) {
				return;
			}

			$sanitize_callback = ( in_array( $config['control'], $ignore_controls, true ) ) ? false : astra_get_prop( $config, 'sanitize_callback', Astra_Customizer_Control_Base::get_sanitize_call( astra_get_prop( $config, 'control' ) ) );


			if ( ! $sanitize_callback ) {
				$config = $this->sanitize_control( $config );
			}

			$config['label'] = astra_get_prop( $config, 'title' );
			$config['type']  = astra_get_prop( $config, 'control' );
			/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			if ( false !== astra_get_prop( $config, 'font-type', false ) ) {
				/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
				$config['type'] = astra_get_prop( $config, 'font-type', false );
			}

			if ( 'image' === $config['type'] ) {
				$this->prepare_preload_controls( $config );
			}

			if ( isset( $config['active_callback'] ) ) {
				self::$js_configs ['skip_context'] [] = $name;
				$this->prepare_preload_controls( $config );
				return;
			}

			self::$dynamic_options['settings'][ $name ] = array(
				'default'           => astra_get_prop( $config, 'default' ),
				'type'              => astra_get_prop( $config, 'datastore_type' ),
				'transport'         => astra_get_prop( $config, 'transport', 'refresh' ),
				'sanitize_callback' => $sanitize_callback,
			);
			/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
			if ( astra_get_prop( $config, 'partial', false ) ) {
				self::$dynamic_options['partials'][ $name ] = array(
					'selector'           => astra_get_prop( $config['partial'], 'selector' ),
					'render_callback'    => astra_get_prop( $config['partial'], 'render_callback' ),
					'containerInclusive' => astra_get_prop( $config['partial'], 'container_inclusive' ),
					'fallbackRefresh'    => astra_get_prop( $config['partial'], 'fallback_refresh', true ),
				);
			}

			$config['id']       = $name;
			$config['settings'] = array( 'default' => $name );
			$config             = self::bypass_control_configs( $config );

			if ( isset( $config['section'] ) ) {
				self::$js_configs ['controls'] [ $config['section'] ] [] = $config;
			}

			// Keep contextual sub controls aside to process initially in customizer.js.
			if ( isset( $config['contextual_sub_control'] ) ) {
				self::$js_configs ['contextual_sub_controls'] [ $name ] = $config;
			}
		}

		/**
		 * Map and add sanitize callback to JS configs.
		 *
		 * @param array $config js config array.
		 * @return mixed
		 */
		public function sanitize_control( $config ) {

			$control_type = isset( $config['control'] ) ? $config['control'] : '';
			switch ( $control_type ) {
				case 'color':
					$config['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_hex_color' );
					break;
				case 'ast-border':
					$config['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_border' );
					break;
				case 'ast-html-editor':
					$config['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_html' );
					break;
				case 'ast-color':
					$config['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_alpha_color' );
					break;
				case 'ast-sortable':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_multi_choices' );
					break;
				case 'ast-radio-image':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_choices' );
					break;
				case 'ast-link':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_link' );
					break;
				case 'ast-customizer-link':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_customizer_links' );
					break;
				case 'ast-responsive-slider':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_responsive_slider' );
					break;
				case 'ast-logo-svg-icon':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_logo_svg_icon' );
					break;
				case 'ast-toggle-control':
				case 'ast-section-toggle':
					$config ['sanitize_callback'] = array( 'Astra_Customizer_Sanitizes', 'sanitize_toggle_control' );
					break;
				default:
					break;
			}

			return $config;

		}

		/**
		 * Add controls for which active_callback is added.
		 *
		 * @since 3.0.0
		 * @param array $config config.
		 */
		public function prepare_preload_controls( $config ) {

			global $wp_customize;

			$instance = Astra_Customizer_Control_Base::get_control_instance( astra_get_prop( $config, 'control' ) );

			// Forwarding to the DOM as default control.
			if ( 'title_tagline' !== $config['section'] ) {
				self::$js_configs ['wp_defaults'][ astra_get_prop( $config, 'name' ) ] = $config['section'];
				$config['section'] = 'title_tagline';
			}

			$wp_customize->add_setting(
				astra_get_prop( $config, 'name' ),
				array(
					'default'           => astra_get_prop( $config, 'default' ),
					'type'              => astra_get_prop( $config, 'datastore_type' ),
					'transport'         => astra_get_prop( $config, 'transport', 'refresh' ),
					'sanitize_callback' => astra_get_prop( $config, 'sanitize_callback', Astra_Customizer_Control_Base::get_sanitize_call( astra_get_prop( $config, 'control' ) ) ),
				)
			);

			if ( false !== $instance ) {
				$wp_customize->add_control(
					new $instance( $wp_customize, astra_get_prop( $config, 'name' ), $config )
				);
			} else {
				$wp_customize->add_control( astra_get_prop( $config, 'name' ), $config );
			}
		}

		/**
		 * Prepare Group configs to visible sub-controls.
		 *
		 * @since 3.0.0
		 * @param object $wp_customize customizer object.
		 */
		public function prepare_group_configs( $wp_customize ) {

			if ( $wp_customize->selective_refresh->is_render_partials_request() ) {
				return;
			}

			$configurations = $this->get_customizer_configurations();
			$defaults       = $this->get_astra_customizer_configuration_defaults();

			foreach ( $configurations as $key => $configuration ) {
				$config = wp_parse_args( $configuration, $defaults );
				if ( 'sub-control' === $config['type'] ) {
					unset( $config['type'] );
					$parent = astra_get_prop( $config, 'parent' );
					$tab    = astra_get_prop( $config, 'tab' );

					if ( empty( self::$group_configs[ $parent ] ) ) {
						self::$group_configs[ $parent ] = array();
					}

					if ( array_key_exists( 'tab', $config ) ) {
						self::$group_configs[ $parent ]['tabs'][ $tab ][] = $config;
					} else {
						self::$group_configs[ $parent ][] = $config;
					}
				}
			}
		}

		/**
		 * Prepare context.
		 *
		 * @return mixed|void
		 */
		public static function get_contexts() {

			self::set_default_context();
			// Return contexts.
			return apply_filters( 'astra_customizer_context', self::$contexts );
		}

		/**
		 * Prepare choices.
		 *
		 * @return mixed|void
		 */
		public static function get_choices() {
			// Return contexts.
			return apply_filters( 'astra_customizer_choices', self::$choices );
		}

		/**
		 * Prepare javascript configs.
		 *
		 * @return mixed|void
		 */
		public static function get_js_configs() {

			// Return contexts.
			return apply_filters( 'astra_javascript_configurations', self::$js_configs );
		}

		/**
		 * Prepare tabbed sections.
		 *
		 * @return mixed|void
		 */
		public static function get_tabbed_sections() {

			self::prepare_tabbed_sections();
			// Return contexts.
			return apply_filters( 'astra_customizer_tabbed_sections', self::$tabbed_sections );
		}

		/**
		 * Prepare default values for the control.
		 *
		 * @return array
		 */
		private function get_control_defaults() {

			$defaults         = array();
			$default_values   = Astra_Theme_Options::defaults();
			$default_controls = array_merge( self::$js_configs['controls'], self::$js_configs['sub_controls'] );

			foreach ( $default_controls as $section_controls ) {
				foreach ( $section_controls as $control ) {
					$control_id = astra_get_prop( $control, 'name' );
					if ( 'ast-responsive-spacing' === $control['control'] ) {
							$defaults[ $control_id ] = array(
								'desktop'      => array(
									'top'    => '',
									'right'  => '',
									'bottom' => '',
									'left'   => '',
								),
								'tablet'       => array(
									'top'    => '',
									'right'  => '',
									'bottom' => '',
									'left'   => '',
								),
								'mobile'       => array(
									'top'    => '',
									'right'  => '',
									'bottom' => '',
									'left'   => '',
								),
								'desktop-unit' => 'px',
								'tablet-unit'  => 'px',
								'mobile-unit'  => 'px',
							);
					} else {
							$defaults[ $control_id ] = $this->get_default_value( $control_id, $default_values );
					}
				}
			}

			return $defaults;

		}

		/**
		 * Add customizer script.
		 *
		 * @since 3.0.0
		 */
		public function enqueue_customizer_scripts() {
			// Localize variables for Dev mode > Customizer JS.
			wp_localize_script(
				'astra-custom-control-script',
				'AstraBuilderCustomizerData',
				array(
					'contexts'                => self::get_contexts(),
					'dynamic_setting_options' => self::$dynamic_options['settings'],
					'choices'                 => self::get_choices(),
					'js_configs'              => self::get_js_configs(),
					'tabbed_sections'         => self::get_tabbed_sections(),
					'component_limit'         => Astra_Builder_Helper::$component_limit,
					'is_site_rtl'             => is_rtl(),
					'defaults'                => $this->get_control_defaults(),
					'isWP_5_9'                => astra_wp_version_compare( '5.8.99', '>=' ),
					'googleFonts'             => Astra_Font_Families::get_google_fonts(),
					'variantLabels'           => Astra_Font_Families::font_variant_labels(),
					'upgradeUrl'              => array(
						'default'        => ASTRA_PRO_CUSTOMIZER_UPGRADE_URL,
						'global'         => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'global' ),
						'header-builder' => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'header-builder' ),
						'footer-builder' => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'footer-builder' ),
						'sidebar'        => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'sidebar' ),
						'woocommerce'    => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'woocommerce' ),
						'blog-single'    => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'blog-single' ),
						'blog-archive'   => astra_get_pro_url( 'https://wpastra.com/pricing/', 'customizer', 'free-theme', 'blog-archive' ),
						'hfb-pro-widget' => astra_get_pro_url( 'https://wpastra.com/pricing/', 'astra-header-footer', 'free-theme', 'unlock-pro-widget' ),
					),
					/** @psalm-suppress RedundantCondition */
					'is_woo_market_zip'       => ! ASTRA_THEME_ORG_VERSION,
					'pro_active'              => defined( 'ASTRA_EXT_VER' ),
					/** @psalm-suppress RedundantCondition */
				)
			);

			if ( is_rtl() ) {
				$builder_customizer_css_file = 'ast-builder-customizer-rtl';
				$font_icon_picker_css_file   = 'font-icon-picker-rtl';
			} else {
				$builder_customizer_css_file = 'ast-builder-customizer';
				$font_icon_picker_css_file   = 'font-icon-picker';
			}

			// Enqueue Builder CSS.
			wp_enqueue_style(
				'ahfb-customizer-style',
				ASTRA_THEME_URI . 'inc/assets/css/' . $builder_customizer_css_file . '.css',
				array( 'wp-components' ),
				ASTRA_THEME_VERSION
			);

			wp_enqueue_style(
				'ahfb-customizer-color-picker-style',
				ASTRA_THEME_URI . 'inc/assets/css/' . $font_icon_picker_css_file . '.css',
				array( 'wp-components' ),
				ASTRA_THEME_VERSION
			);
		}

		/**
		 * Check if string is start with a string provided.
		 *
		 * @param string $string main string.
		 * @param string $start_string string to search.
		 * @since 2.0.0
		 * @return bool.
		 */
		public function starts_with( $string, $start_string ) {
			$len = strlen( $start_string );
			return ( substr( $string, 0, $len ) === $start_string );
		}

		/**
		 * Filter and return Customizer Configurations.
		 *
		 * @since 1.4.3
		 * @return Array Customizer Configurations for registering Sections/Panels/Controls.
		 */
		private function get_customizer_configurations() {

			global  $wp_customize;

			if ( ! is_null( self::$configuration ) ) {
				return self::$configuration;
			}

			self::$configuration = apply_filters( 'astra_customizer_configurations', array(), $wp_customize );
			return self::$configuration;
		}

		/**
		 * Return default values for the Customize Configurations.
		 *
		 * @since 1.4.3
		 * @return Array default values for the Customizer Configurations.
		 */
		private function get_astra_customizer_configuration_defaults() {
			return apply_filters(
				'astra_customizer_configuration_defaults',
				array(
					'priority'             => null,
					'title'                => null,
					'label'                => null,
					'name'                 => null,
					'type'                 => null,
					'description'          => null,
					'capability'           => null,
					'datastore_type'       => 'option', // theme_mod or option. Default option.
					'settings'             => null,
					'active_callback'      => null,
					'sanitize_callback'    => null,
					'sanitize_js_callback' => null,
					'theme_supports'       => null,
					'transport'            => null,
					'default'              => null,
					'selector'             => null,
					'ast_fields'           => array(),
				)
			);
		}

		/**
		 * Include Customizer Configuration files.
		 *
		 * @since 1.4.3
		 * @return void
		 */
		public function include_configurations() {
			// @codingStandardsIgnoreStart WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/class-astra-customizer-config-base.php';

			/**
			 * Register Sections & Panels
			 */
			require ASTRA_THEME_DIR . 'inc/customizer/class-astra-customizer-register-sections-panels.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/buttons/class-astra-customizer-button-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-site-layout-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-site-identity-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-blog-layout-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-blog-single-layout-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-sidebar-layout-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-site-container-layout-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/colors-background/class-astra-body-colors-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/typography/class-astra-archive-typo-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/typography/class-astra-body-typo-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/block-editor/class-astra-block-editor-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/comments/class-astra-comments-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/typography/class-astra-headings-typo-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/typography/class-astra-single-typo-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/typography/class-astra-global-typo-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/global-misc/class-astra-global-misc-configs.php';
			require ASTRA_THEME_DIR . 'inc/customizer/configurations/accessibility/class-astra-accessibility-configs.php';

			if ( astra_existing_header_footer_configs() ) {
				require ASTRA_THEME_DIR . 'inc/customizer/configurations/buttons/class-astra-existing-button-configs.php';
				require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-header-layout-configs.php';
				require ASTRA_THEME_DIR . 'inc/customizer/configurations/layout/class-astra-footer-layout-configs.php';
				require ASTRA_THEME_DIR . 'inc/customizer/configurations/colors-background/class-astra-advanced-footer-colors-configs.php';
				require ASTRA_THEME_DIR . 'inc/customizer/configurations/colors-background/class-astra-footer-colors-configs.php';
			}
			// @codingStandardsIgnoreEnd WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
		}

		/**
		 * Register custom section and panel.
		 *
		 * @since 1.0.0
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public function customize_register_panel( $wp_customize ) {

			/**
			 * Register Extended Panel
			 */
			$wp_customize->register_panel_type( 'Astra_WP_Customize_Panel' );
			$wp_customize->register_section_type( 'Astra_WP_Customize_Section' );
			$wp_customize->register_section_type( 'Astra_WP_Customize_Separator' );

			$wp_customize->selective_refresh->add_partial(
				'site_icon',
				array(
					'selector'            => '.ast-sg-site-icon-wrap',
					'container_inclusive' => true,
					'render_callback'     => array( $this, 'site_icon_update' ),
				)
			);

			if ( ! defined( 'ASTRA_EXT_VER' ) ) {
				$wp_customize->register_section_type( 'Astra_Pro_Customizer' );
			}


			// @codingStandardsIgnoreStart WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			require ASTRA_THEME_DIR . 'inc/customizer/extend-customizer/class-astra-wp-customize-panel.php';
			require ASTRA_THEME_DIR . 'inc/customizer/extend-customizer/class-astra-wp-customize-section.php';
			require ASTRA_THEME_DIR . 'inc/customizer/extend-customizer/class-astra-wp-customize-separator.php';
			require ASTRA_THEME_DIR . 'inc/customizer/customizer-controls.php';
			// @codingStandardsIgnoreEnd WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound

			/**
			 * Add Controls
			 */

			Astra_Customizer_Control_Base::add_control(
				'image',
				array(
					'callback'          => 'WP_Customize_Image_Control',
					'sanitize_callback' => 'esc_url_raw',
				)
			);

			Astra_Customizer_Control_Base::add_control(
				'ast-font',
				array(
					'callback'          => 'Astra_Control_Typography',
					'sanitize_callback' => 'sanitize_text_field',
				)
			);

			Astra_Customizer_Control_Base::add_control(
				'ast-logo-svg-icon',
				array(
					'callback'          => 'Astra_Control_Logo_SVG_Icon',
					'sanitize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_logo_svg_icon' ),
				)
			);

			Astra_Customizer_Control_Base::add_control(
				'ast-description',
				array(
					'callback'          => 'Astra_Control_Description',
					'sanitize_callback' => '',
				)
			);

			Astra_Customizer_Control_Base::add_control(
				'ast-customizer-link',
				array(
					'callback'         => 'Astra_Control_Customizer_Link',
					'santize_callback' => array( 'Astra_Customizer_Sanitizes', 'sanitize_customizer_links' ),
				)
			);

			/**
			 * Helper files
			 */
			// @codingStandardsIgnoreStart WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			require ASTRA_THEME_DIR . 'inc/customizer/class-astra-customizer-partials.php';
			require ASTRA_THEME_DIR . 'inc/customizer/class-astra-customizer-callback.php';
			require ASTRA_THEME_DIR . 'inc/customizer/class-astra-customizer-sanitizes.php';
			// @codingStandardsIgnoreEnd WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
		}

		/**
		 * Render site icon.
		 *
		 * @since 4.8.0
		 */
		public function site_icon_update() {
			$uploaded_icon_url = get_site_icon_url( 32 );
			$site_icon_url     = empty( $uploaded_icon_url ) ? admin_url() . 'images/wordpress-logo.svg' : $uploaded_icon_url;
			?>
				<p class="ast-sg-site-icon-wrap">
					<span class="ast-sg-site-icon-aside-divider"></span>
					<span class="ast-sg-site-icon-inner-wrap">
						<img class="ast-sg-site-icon" alt="<?php esc_attr_e( 'Site Icon', 'astra' ); ?>" src="<?php echo esc_url( $site_icon_url ); ?>" />
						<span class="ast-sg-site-title"> <?php echo esc_html( get_bloginfo( 'name' ) ); ?> </span>
						<span class="ast-sg-site-blogdescription"> <?php echo esc_attr( ! empty( get_bloginfo( 'description' ) ) ? ' - ' . get_bloginfo( 'description' ) : '' ); ?> </span>
					</span>
					<span class="ast-sg-site-icon-aside-divider"></span>
				</p>
			<?php
		}

		/**
		 * Add postMessage support for site title and description for the Theme Customizer.
		 *
		 * @since 1.0.0
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public function customize_register( $wp_customize ) {

			/**
			 * Override Defaults
			 */
			require ASTRA_THEME_DIR . 'inc/customizer/override-defaults.php';// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
		}

		/**
		 * Add upgrade link configurations controls.
		 *
		 * @since 1.0.0
		 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
		 */
		public function astra_pro_upgrade_configurations( $wp_customize ) {

			if ( ! defined( 'ASTRA_EXT_VER' ) ) {
				require ASTRA_THEME_DIR . 'inc/customizer/astra-pro/class-astra-pro-customizer.php';// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
				require ASTRA_THEME_DIR . 'inc/customizer/astra-pro/class-astra-pro-upgrade-link-configs.php';// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			}
		}

		/**
		 * Customizer Controls
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function controls_scripts() {
			$js_prefix  = '.min.js';
			$css_prefix = '.min.css';
			$dir        = 'minified';
			if ( SCRIPT_DEBUG ) {
				$js_prefix = '.js';
				$dir       = 'unminified';
			}

			if ( is_rtl() ) {
				$css_prefix = '.min-rtl.css';
			}

			wp_enqueue_style( 'wp-components' );
			wp_enqueue_script( 'thickbox' );
			wp_enqueue_style( 'thickbox' );

			// Customizer Core.
			wp_enqueue_script( 'astra-customizer-controls-toggle-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/customizer-controls-toggle' . $js_prefix, array(), ASTRA_THEME_VERSION, true );

			wp_enqueue_script( 'astra-customizer-controls-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/customizer-controls' . $js_prefix, array( 'astra-customizer-controls-toggle-js' ), ASTRA_THEME_VERSION, true );
			// Extended Customizer Assets - Panel extended.
			wp_enqueue_style( 'astra-extend-customizer-css', ASTRA_THEME_URI . 'assets/css/minified/extend-customizer' . $css_prefix, null, ASTRA_THEME_VERSION );
			wp_enqueue_script( 'astra-extend-customizer-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/extend-customizer' . $js_prefix, array(), ASTRA_THEME_VERSION, true );

			// Customizer Controls.
			wp_enqueue_style( 'astra-customizer-controls-css', ASTRA_THEME_URI . 'assets/css/minified/customizer-controls' . $css_prefix, null, ASTRA_THEME_VERSION );

			wp_enqueue_script( 'astra-customizer-style-guide-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/customizer-style-guide' . $js_prefix, array( 'jquery', 'astra-customizer-controls-toggle-js' ), ASTRA_THEME_VERSION, true );
			wp_localize_script(
				'astra-customizer-style-guide-js',
				'astraStyleGuide',
				array(
					'title' => __( 'Style Guide', 'astra' ),
				)
			);

			$string = $this->generate_font_dropdown();

			$template = '<div class="ast-field-settings-modal">
					<ul class="ast-fields-wrap">
					</ul>
			</div>';

			$sortable_subcontrol_template = '<div class="ast-sortable-subfields-wrap">
					<ul class="ast-fields-wrap">
					</ul>
			</div>';

			wp_localize_script(
				'astra-customizer-controls-toggle-js',
				'astra',
				apply_filters(
					'astra_theme_customizer_js_localize',
					array(
						'customizer' => array(
							'settings'            => array(
								'sidebars'     => array(
									'single'  => array(
										'single-post-sidebar-layout',
										'single-page-sidebar-layout',
									),
									'archive' => array(
										'archive-post-sidebar-layout',
									),
								),
								'container'    => array(
									'single'  => array(
										'single-post-content-layout',
										'single-page-content-layout',
									),
									'archive' => array(
										'archive-post-content-layout',
									),
								),
								'google_fonts' => $string,
							),
							'group_modal_tmpl'    => $template,
							'sortable_modal_tmpl' => $sortable_subcontrol_template,
							'is_pro'              => defined( 'ASTRA_EXT_VER' ),
							'show_upgrade_notice' => ( astra_showcase_upgrade_notices() ) ? true : false,
							'upgrade_link'        => esc_url( astra_get_upgrade_url( 'pricing' ) ),
							'is_block_widget'     => astra_has_widgets_block_editor(),
						),
						'theme'      => array(
							'option' => ASTRA_THEME_SETTINGS,
						),
					)
				)
			);
		}

		/**
		 * Render customizer style guide shortcut pencil.
		 *
		 * @param string $type Section|Control.
		 * @param string $name Section name|Control name.
		 * @param string $context General|Design name.
		 * @param string $extras if any other parameter to pass.
		 *
		 * @return string Trigger for style guide shortcut.
		 * @since 4.8.0
		 */
		public function get_style_guide_shortcut_trigger( $type, $name, $context = 'general', $extras = '' ) {
			if ( 'control' === $type ) {
				$name = 'astra-color-palettes' === $name ? 'astra-color-palettes' : esc_attr( ASTRA_THEME_SETTINGS ) . $name;
			}
			return '<span class="ast-quick-tour-item" data-type="' . $type . '" data-name="' . $name . '" data-context="' . $context . '" ' . $extras . '> <span class="ast-sg-customizer-shortcut"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0.5 6C0.5 2.96243 2.96243 0.5 6 0.5H18C21.0376 0.5 23.5 2.96243 23.5 6V18C23.5 21.0376 21.0376 23.5 18 23.5H6C2.96243 23.5 0.5 21.0376 0.5 18V6Z" fill="white" fill-opacity="0.8"/> <path d="M0.5 6C0.5 2.96243 2.96243 0.5 6 0.5H18C21.0376 0.5 23.5 2.96243 23.5 6V18C23.5 21.0376 21.0376 23.5 18 23.5H6C2.96243 23.5 0.5 21.0376 0.5 18V6Z" stroke="#E2E8F0"/> <g clip-path="url(#clip0_8460_9362)"> <path d="M14.5 7.50081C14.6273 7.35032 14.7849 7.22784 14.9625 7.14115C15.1402 7.05446 15.334 7.00547 15.5318 6.99731C15.7296 6.98915 15.9269 7.022 16.1112 7.09375C16.2955 7.1655 16.4627 7.27459 16.6022 7.41407C16.7416 7.55354 16.8503 7.72034 16.9213 7.90383C16.9922 8.08732 17.0239 8.28347 17.0143 8.4798C17.0047 8.67612 16.954 8.8683 16.8654 9.04409C16.7769 9.21988 16.6524 9.37542 16.5 9.50081L9.75 16.2508L7 17.0008L7.75 14.2508L14.5 7.50081Z" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M13.5 8.5L15.5 10.5" stroke="#020617" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <clipPath id="clip0_8460_9362"> <rect width="12" height="12" fill="white" transform="translate(6 6)"/> </clipPath> </defs> </svg> </span> </span>';
		}

		/**
		 * Get formatted font settings for headings.
		 *
		 * @param string $tag HTML Tag.
		 * @return string formatted string with font, font-size, line-height.
		 *
		 * @since 4.8.0
		 */
		public function get_formatted_font_style( $tag ) {
			$dataset   = array();
			$dataset[] = '<span class="ast-sg-font-family">' . astra_get_option( 'font-family-' . $tag ) . '</span>';

			$font_size = astra_get_option( 'font-size-' . $tag );
			$desktop   = astra_get_css_value( $font_size['desktop'], $font_size['desktop-unit'] );
			$tablet    = astra_get_css_value( $font_size['tablet'], $font_size['tablet-unit'] );
			$mobile    = astra_get_css_value( $font_size['mobile'], $font_size['mobile-unit'] );

			$tablet = empty( $tablet ) ? $desktop : $tablet;
			$mobile = empty( $mobile ) ? $tablet : $mobile;

			$dataset[] = '<span class="ast-sg-font-size"> <span class="ast-sg-desktop">' . $desktop . '</span> <span class="ast-sg-tablet">' . $tablet . '</span> <span class="ast-sg-mobile">' . $mobile . '</span> </span>';

			$dataset[] = '<span class="ast-sg-line-height">' . astra_get_font_extras( astra_get_option( 'font-extras-' . $tag ), 'line-height', 'line-height-unit' ) . '</span>';

			$formatted_data = join( ' / ', $dataset );
			return '<p class="ast-sg-field-title ast-sg-typo-field" data-for="' . esc_attr( $tag ) . '"> ' . $formatted_data . ' </p>';
		}

		/**
		 * Customizer Easy Navigation Tour Markup.
		 *
		 * @return mixed HTML Markup.
		 * @since 4.8.0
		 */
		public function render_style_guide_markup() {
			$settings = apply_filters(
				'astra_quick_customizer_navigation_setup',
				array(
					'colors' => array(
						'color-0' => array(
							'title' => __( 'Brand', 'astra' ),
							'code'  => 'var(--ast-global-color-0)',
						),
						'color-1' => array(
							'title' => __( 'Alt Brand', 'astra' ),
							'code'  => 'var(--ast-global-color-1)',
						),
						'color-2' => array(
							'title' => __( 'Heading', 'astra' ),
							'code'  => 'var(--ast-global-color-2)',
						),
						'color-3' => array(
							'title' => __( 'Text', 'astra' ),
							'code'  => 'var(--ast-global-color-3)',
						),
						'color-4' => array(
							'title' => __( 'Primary', 'astra' ),
							'code'  => 'var(--ast-global-color-4)',
						),
						'color-5' => array(
							'title' => __( 'Secondary', 'astra' ),
							'code'  => 'var(--ast-global-color-5)',
						),
						'color-6' => array(
							'title' => __( 'Border', 'astra' ),
							'code'  => 'var(--ast-global-color-6)',
						),
						'color-7' => array(
							'title' => __( 'Subtle BG', 'astra' ),
							'code'  => 'var(--ast-global-color-7)',
						),
						'color-8' => array(
							'title' => __( 'Extra', 'astra' ),
							'code'  => 'var(--ast-global-color-8)',
						),
					),
				)
			);

			ob_start();
			?>
				<button class="ast-close-tour" type="button">
					<span class="screen-reader-text"><?php esc_html_e( 'Close', 'astra' ); ?></span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path></svg>
				</button>
				<div class="ast-tour-inner-wrap">
					<div class="ast-quick-tour-body">
						<div class="ast-sg-2-col-grid">
							<div class="ast-styler-card">
								<p class="ast-sg-card-title"> <?php esc_html_e( 'Site Title & Logo', 'astra' ); ?>
								<div class="ast-sg-element-wrap ast-sg-logo-section <?php echo esc_attr( astra_get_option( 'logo-title-inline' ) ? 'ast-logo-title-inline' : '' ); ?>">
									<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'section', 'title_tagline' ) ); ?>
									<?php do_action( 'astra_site_identity' ); ?>
								</div>
							</div>
							<div class="ast-sg-1-col-grid">
								<div class="ast-styler-card">
									<p class="ast-sg-card-title"> <?php esc_html_e( 'Site Icon', 'astra' ); ?>
									<div class="ast-sg-element-wrap">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'section', 'astra-site-identity' ) ); ?>
										<?php do_action( 'astra_style_guide_site_icon' ); ?>
									</div>
								</div>

								<div class="ast-styler-card">
									<p class="ast-sg-card-title"> <?php esc_html_e( 'Buttons', 'astra' ); ?>
									<div class="ast-sg-button-element-wrap">
										<div class="ast-sg-element-wrap">
											<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[button-preset-style]' ) ); ?>
											<button class="ast-button"> <?php esc_html_e( 'Primary', 'astra' ); ?> </button>
										</div>
										<div class="ast-sg-element-wrap">
											<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[secondary-button-preset-style]', 'design' ) ); ?>
											<button class="ast-outline-button"> <?php esc_html_e( 'Secondary', 'astra' ); ?> </button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="ast-sg-colors-section ast-styler-card">
							<p class="ast-sg-card-title"> <?php esc_html_e( 'Colors', 'astra' ); ?>
							<div class="ast-sg-colors-section-wrap">
								<?php
								foreach ( $settings['colors'] as $key => $data_attrs ) {
									?>
									<div class="ast-sg-color-item-wrap">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', 'astra-color-palettes', 'general', 'data-reference="ast-' . esc_attr( $key ) . '"' ) ); ?>
										<span class="ast-sg-color-picker" style="background:<?php echo esc_attr( $data_attrs['code'] ); ?>"> </span>
										<span class="ast-sg-field-title"> <?php echo esc_html( $data_attrs['title'] ); ?>
									</div>
									<?php
								}
								?>
									</div>
								</div>

						<div class="ast-sg-content-section-wrap ast-styler-card">
							<p class="ast-sg-card-title"> <?php esc_html_e( 'Typography', 'astra' ); ?>
							<div class="ast-sg-content-inner-wrap">
								<div class="ast-sg-heading-section">
									<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-headings-font-settings]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
									<h1> <?php esc_html_e( 'Headings', 'astra' ); ?> </h1>
									<h2 class="sub-heading"> A a B b C c D d E e F f G g H h I i J j K k L l M m N n O o P p Q q R r S s T t U u V v W w X x Y y Z z </h2>
								</div>
								<div class="ast-sg-content-section">
									<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-body-font-settings]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
									<p> <?php esc_html_e( 'Here\'s how the body text will look like on your website. You can customize the typography to match your brand personality. Whether you aim for a modern and sleek appearance or a more traditional and elegant feel, the right typography sets the tone for your content.', 'astra' ); ?> </p>
								</div>

								<div class="ast-sg-heading-more-section">
									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h1-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h1' ) ); ?>
										<h1 class="ast-sg-heading"> <?php esc_html_e( 'Heading 1', 'astra' ); ?> </h1>
									</div>

									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h2-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h2' ) ); ?>
										<h2 class="ast-sg-heading"> <?php esc_html_e( 'Heading 2', 'astra' ); ?> </h2>
									</div>

									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h3-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h3' ) ); ?>
										<h3 class="ast-sg-heading"> <?php esc_html_e( 'Heading 3', 'astra' ); ?> </h3>
									</div>

									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h4-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h4' ) ); ?>
										<h4 class="ast-sg-heading"> <?php esc_html_e( 'Heading 4', 'astra' ); ?> </h4>
									</div>

									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h5-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h5' ) ); ?>
										<h5 class="ast-sg-heading"> <?php esc_html_e( 'Heading 5', 'astra' ); ?> </h5>
									</div>

									<div class="ast-sg-heading-card">
										<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-heading-h6-typo]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
										<?php echo wp_kses_post( $this->get_formatted_font_style( 'h6' ) ); ?>
										<h6 class="ast-sg-heading"> <?php esc_html_e( 'Heading 6', 'astra' ); ?> </h6>
									</div>
								</div>

								<div class="ast-sg-content-section">
									<?php echo do_shortcode( $this->get_style_guide_shortcut_trigger( 'control', '[ast-body-font-settings]', 'general', 'data-reference="ast-toggle-desc-wrap"' ) ); ?>
									<p> <?php esc_html_e( 'Explore different font families, sizes, weights, and styles to find the perfect combination that encapsulates the essence of your brand. With each adjustment, see how your message transforms, becoming a powerful reflection of your identity and vision.', 'astra' ); ?> </p>

									<p class="ast-sg-card-title"> <?php esc_html_e( 'Quote', 'astra' ); ?>
									<blockquote>
										<p> <?php esc_html_e( 'The future will belongs to those who believe in the beauty of their dreams.', 'astra' ); ?> </p> <br/>
										<footer> Elanor Rosevelt </footer>
									</blockquote>

									<p class="ast-sg-content-divider"></p>

									<p class="ast-sg-card-title"> <?php esc_html_e( 'Unordered List', 'astra' ); ?>
									<ul>
										<li> <?php esc_html_e( 'List Item 1', 'astra' ); ?> </li>
										<li> <?php esc_html_e( 'List Item 2', 'astra' ); ?> </li>
										<li> <?php esc_html_e( 'List Item 3', 'astra' ); ?> </li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			<?php
			$navigation_markup = ob_get_clean();
			return $navigation_markup;
		}

		/**
		 * Easy navigation template.
		 *
		 * @since 4.8.0
		 * @return void
		 */
		public function style_guide_template() {
			if ( ! is_customize_preview() ) {
				return;
			}

			$js_prefix = '.min.js';
			$dir       = 'minified';
			if ( SCRIPT_DEBUG ) {
				$js_prefix = '.js';
				$dir       = 'unminified';
			}

			wp_enqueue_script( 'astra-style-guide-previewer-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/style-guide-previewer' . $js_prefix, array( 'jquery' ), ASTRA_THEME_VERSION, true );

			?>
				<div class="ast-style-guide-wrapper">
					<?php echo do_shortcode( $this->render_style_guide_markup() ); ?>
				</div>
			<?php
		}

		/**
		 * Generates HTML for font dropdown.
		 *
		 * @return string
		 */
		public function generate_font_dropdown() {

			ob_start();
			?>

			<option value="inherit"><?php esc_html_e( 'Default System Font', 'astra' ); ?></option>

			<optgroup label="<?php echo esc_attr_e( 'Other System Fonts', 'astra' ); ?>">
				<?php
				$system_fonts = Astra_Font_Families::get_system_fonts();
				$google_fonts = Astra_Font_Families::get_google_fonts();

				foreach ( $system_fonts as $name => $variants ) {
					?>
					<option value="<?php echo esc_attr( $name ); ?>" ><?php echo esc_html( $name ); ?></option>
					<?php
				}
				?>
			</optgroup>

			<?php
			/**
			 * Filter to add custom font list into customizer.
			 */
			do_action( 'astra_customizer_font_list', '' );
			?>

			<optgroup label="Google">
				<?php
				foreach ( $google_fonts as $name => $single_font ) {
					$variants = astra_get_prop( $single_font, '0' );
					$category = astra_get_prop( $single_font, '1' );

					?>
					<option value="<?php echo "'" . esc_attr( $name ) . "', " . esc_attr( $category ); ?>"><?php echo esc_html( $name ); ?></option>
					<?php
				}
				?>
			</optgroup>

			<?php
			return ob_get_clean();
		}

		/**
		 * Customizer Preview Init
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function preview_init() {

			// Update variables.
			Astra_Theme_Options::refresh();

			$js_prefix = '.min.js';
			$dir       = 'minified';
			if ( SCRIPT_DEBUG ) {
				$js_prefix = '.js';
				$dir       = 'unminified';
			}

			wp_enqueue_script( 'astra-customizer-preview-js', ASTRA_THEME_URI . 'assets/js/' . $dir . '/customizer-preview' . $js_prefix, array( 'customize-preview' ), ASTRA_THEME_VERSION, null );

			// Get current container layout.
			$content_layout   = astra_get_content_layout();
			$is_boxed         = astra_is_content_style_boxed();
			$is_sidebar_boxed = astra_is_sidebar_style_boxed();
			$content_layout   = astra_apply_boxed_layouts( $content_layout, $is_boxed, $is_sidebar_boxed );

			$localize_array = array(
				'headerBreakpoint'                     => astra_header_break_point(),
				'includeAnchorsInHeadindsCss'          => Astra_Dynamic_CSS::anchors_in_css_selectors_heading(),
				'googleFonts'                          => Astra_Font_Families::get_google_fonts(),
				'page_builder_button_style_css'        => Astra_Dynamic_CSS::page_builder_button_style_css(),
				'elementor_default_color_font_setting' => Astra_Dynamic_CSS::elementor_default_color_font_setting(),
				'dynamic_partial_options'              => self::$dynamic_options['partials'],
				'gb_outline_buttons_patterns_support'  => Astra_Dynamic_CSS::gutenberg_core_patterns_compat(),
				'font_weights_widget_title_support'    => Astra_Dynamic_CSS::support_font_css_to_widget_and_in_editor(),
				'is_content_bg_option_to_load'         => astra_has_gcp_typo_preset_compatibility(),
				'content_layout'                       => $content_layout,
				'site_layout'                          => astra_get_option( 'site-layout' ),
				'has_block_editor_support'             => Astra_Dynamic_CSS::is_block_editor_support_enabled(),
				'updated_gb_outline_button_patterns'   => astra_button_default_padding_updated(),
				'apply_content_bg_fullwidth_layouts'   => astra_get_option( 'apply-content-background-fullwidth-layouts', true ),
				'astra_woo_btn_global_compatibility'   => is_callable( 'Astra_Dynamic_CSS::astra_woo_support_global_settings' ) ? Astra_Dynamic_CSS::astra_woo_support_global_settings() : false,
				'v4_2_2_core_form_btns_styling'        => ( true === Astra_Dynamic_CSS::astra_core_form_btns_styling() ) ? ', #comments .submit, .search .search-submit' : '',
				'isLifterLMS'                          => class_exists( 'LifterLMS' ),
				'improved_button_selector'             => Astra_Dynamic_CSS::astra_4_6_4_compatibility() ? ', .ast-single-post .entry-content .wp-block-button .wp-block-button__link, .ast-single-post .entry-content .wp-block-search .wp-block-search__button, body .entry-content .wp-block-file .wp-block-file__button' : '',
				'tablet_breakpoint'                    => astra_get_tablet_breakpoint(),
				'mobile_breakpoint'                    => astra_get_mobile_breakpoint(),
			);

			wp_localize_script( 'astra-customizer-preview-js', 'astraCustomizer', $localize_array );
		}

		/**
		 * Called by the customize_save_after action to refresh
		 * the cached CSS when Customizer settings are saved.
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function customize_save() {

			// Update variables.
			Astra_Theme_Options::refresh();

			if ( apply_filters( 'astra_resize_logo', true ) ) {

				/* Generate Header Logo */
				$custom_logo_id = get_theme_mod( 'custom_logo' );

				add_filter( 'intermediate_image_sizes_advanced', 'Astra_Customizer::logo_image_sizes', 10, 2 );
				self::generate_logo_by_width( $custom_logo_id );
				remove_filter( 'intermediate_image_sizes_advanced', 'Astra_Customizer::logo_image_sizes', 10 );

			} else {
				// Regenerate the logo without custom image sizes.
				$custom_logo_id = get_theme_mod( 'custom_logo' );
				self::generate_logo_by_width( $custom_logo_id );
			}

			do_action( 'astra_customizer_save' );

		}

		/**
		 * Add logo image sizes in filter.
		 *
		 * @since 1.0.0
		 * @param array $sizes Sizes.
		 * @param array $metadata attachment data.
		 *
		 * @return array
		 */
		public static function logo_image_sizes( $sizes, $metadata ) {

			$logo_width = astra_get_option( 'ast-header-responsive-logo-width' );

			if ( is_array( $sizes ) && '' != $logo_width['desktop'] ) {
				$max_value              = max( $logo_width );
				$sizes['ast-logo-size'] = array(
					'width'  => (int) $max_value,
					'height' => 0,
					'crop'   => false,
				);
			}

			return $sizes;
		}

		/**
		 * Generate logo image by its width.
		 *
		 * @since 1.0.0
		 * @param int $custom_logo_id Logo id.
		 */
		public static function generate_logo_by_width( $custom_logo_id ) {
			if ( $custom_logo_id ) {

				$image = get_post( $custom_logo_id );

				if ( $image ) {
					$fullsizepath = get_attached_file( $image->ID );
					/** @psalm-suppress InvalidArgument */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
					if ( false !== $fullsizepath || file_exists( $fullsizepath ) ) {

						if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
							require_once ABSPATH . 'wp-admin/includes/image.php';// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
						}

						$metadata = wp_generate_attachment_metadata( $image->ID, $fullsizepath );

						/** @psalm-suppress RedundantConditionGivenDocblockType */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
						if ( ! is_wp_error( $metadata ) && ! empty( $metadata ) ) {
							/** @psalm-suppress RedundantConditionGivenDocblockType */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
							wp_update_attachment_metadata( $image->ID, $metadata );
						}
					}
				}
			}
		}

		/**
		 * Customizer Preview icon CSS
		 *
		 * @since 1.0.0
		 * @return void
		 */
		public function preview_styles() {
			if ( is_customize_preview() ) {
				/** @psalm-suppress RedundantCondition */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
				$is_script_debug = SCRIPT_DEBUG ? true : false;
				/** @psalm-suppress RedundantCondition */ // phpcs:ignore Generic.Commenting.DocComment.MissingShort
				$js_prefix = '.min.js';
				if ( $is_script_debug ) {
					$js_prefix = '.js';
				}

				$rtl = ( is_rtl() ) ? '-rtl' : '';

				wp_enqueue_style( 'astra-style-guide-css', ASTRA_THEME_URI . 'assets/css/minified/style-guide' . $rtl . '.min.css', array(), ASTRA_THEME_VERSION );

				wp_enqueue_style( 'astra-style-guide-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500&display=swap', array(), ASTRA_THEME_VERSION ); // Styles.

				echo '<style class="astra-custom-shortcut-edit-icons">
					.customize-partial-edit-shortcut-astra-settings-footer-adv {
						position: relative;
					    top: -1em;
					    left: -1.8em;
					}
					.customize-partial-edit-shortcut-astra-settings-breadcrumb-position .customize-partial-edit-shortcut-button{
						display: none;
					}
					.ast-small-footer-section-1 .ast-footer-widget-1-area .customize-partial-edit-shortcut,
					.ast-small-footer-section-2 .ast-footer-widget-2-area .customize-partial-edit-shortcut {
						position: absolute;
					    left: 47%;
					}
					.ast-small-footer-section-1.ast-small-footer-section-equally .ast-footer-widget-1-area .customize-partial-edit-shortcut,
					.ast-small-footer-section-2.ast-small-footer-section-equally .ast-footer-widget-2-area .customize-partial-edit-shortcut {
						position: absolute;
					    left: 42%;
					}
					.ast-small-footer-section-1.ast-small-footer-section-equally .ast-footer-widget-1-area .ast-no-widget-row .customize-partial-edit-shortcut-astra-settings-footer-sml-section-1 {
						position: absolute;
					    left: 1em;
					}
					.ast-small-footer-section-2.ast-small-footer-section-equally .ast-footer-widget-2-area .ast-no-widget-row .customize-partial-edit-shortcut-astra-settings-footer-sml-section-2 {
						left: 83.5%;
					}
					.ast-small-footer-section-1.ast-small-footer-section-equally .nav-menu .customize-partial-edit-shortcut-astra-settings-footer-sml-section-1 {
						position: absolute;
					    left: 1em;
					}
					.ast-small-footer-section-2.ast-small-footer-section-equally .nav-menu .customize-partial-edit-shortcut-astra-settings-footer-sml-section-2 {
						position: absolute;
					    left: 44.5%;
					}
					.ast-small-footer .ast-container .ast-small-footer-section-1 .footer-primary-navigation > .customize-partial-edit-shortcut,
					.ast-small-footer .ast-container .ast-small-footer-section-2 .footer-primary-navigation > .customize-partial-edit-shortcut{
						display: none;
					}
					.ast-small-footer .customize-partial-edit-shortcut-astra-settings-footer-sml-layout {
						    position: absolute;
						    top: 3%;
						    left: 10%;
					}
					.customize-partial-edit-shortcut button:hover {
						border-color: #fff;
					}
					.ast-main-header-bar-alignment .main-header-bar-navigation .customize-partial-edit-shortcut-button {
						display: none;
					}
				</style>';
				echo '<style class="astra-theme-custom-shortcut-edit-icons">
					.ast-replace-site-logo-transparent.ast-theme-transparent-header .customize-partial-edit-shortcut-astra-settings-transparent-header-logo,
					.ast-replace-site-logo-transparent.ast-theme-transparent-header .customize-partial-edit-shortcut-astra-settings-transparent-header-enable {
					    z-index: 6;
					}
				</style>';
			}
		}
	}
}

/**
 *  Kicking this off by calling 'get_instance()' method
 */
Astra_Customizer::get_instance();

/**
 * Customizer save configs.
 *
 * Usecase: Header presets.
 *
 * @param array $configs configs.
 *
 * @since 4.5.2
 * @return void
 */
function astra_save_header_customizer_configs( $configs ) {
	if ( ! empty( $configs['name'] ) ) {
		$key = str_replace( ASTRA_THEME_SETTINGS . '[', '', $configs['name'] );
		$key = str_replace( ']', '', $key );
		Astra_Customizer::$customizer_header_configs[] = $key;
	}
}

/**
 * Customizer save configs.
 *
 * Usecase: footer presets.
 *
 * @param array $configs configs.
 *
 * @since 4.5.2
 * @return void
 */
function astra_save_footer_customizer_configs( $configs ) {
	if ( ! empty( $configs['name'] ) ) {
		$key = str_replace( ASTRA_THEME_SETTINGS . '[', '', $configs['name'] );
		$key = str_replace( ']', '', $key );
		Astra_Customizer::$customizer_footer_configs[] = $key;
	}
}
