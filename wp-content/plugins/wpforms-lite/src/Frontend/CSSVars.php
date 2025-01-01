<?php

namespace WPForms\Frontend;

/**
 * CSS variables class.
 *
 * @since 1.8.1
 */
class CSSVars {

	/**
	 * White color.
	 *
	 * @since 1.8.8
	 *
	 * @var string
	 */
	const WHITE = '#ffffff';

	/**
	 * Root vars and values.
	 *
	 * @since 1.8.1
	 *
	 * @var array
	 */
	const ROOT_VARS = [
		'field-border-radius'     => '3px',
		'field-border-style'      => 'solid',
		'field-border-size'       => '1px',
		'field-background-color'  => self::WHITE,
		'field-border-color'      => 'rgba( 0, 0, 0, 0.25 )',
		'field-text-color'        => 'rgba( 0, 0, 0, 0.7 )',
		'field-menu-color'        => self::WHITE,

		'label-color'             => 'rgba( 0, 0, 0, 0.85 )',
		'label-sublabel-color'    => 'rgba( 0, 0, 0, 0.55 )',
		'label-error-color'       => '#d63637',

		'button-border-radius'    => '3px',
		'button-border-style'     => 'none',
		'button-border-size'      => '1px',
		'button-background-color' => '#066aab',
		'button-border-color'     => '#066aab',
		'button-text-color'       => self::WHITE,

		'page-break-color'        => '#066aab',

		'background-image'        => 'none',
		'background-position'     => 'center center',
		'background-repeat'       => 'no-repeat',
		'background-size'         => 'cover',
		'background-width'        => '100px',
		'background-height'       => '100px',
		'background-color'        => 'rgba( 0, 0, 0, 0 )',
		'background-url'          => 'url()',

		'container-padding'       => '0px',
		'container-border-style'  => 'none',
		'container-border-width'  => '1px',
		'container-border-color'  => '#000000',
		'container-border-radius' => '3px',
	];

	/**
	 * Container shadow vars and values.
	 *
	 * @since 1.8.8
	 *
	 * @var array
	 */
	const CONTAINER_SHADOW_SIZE = [
		'none'   => [
			'box-shadow' => 'none',
		],
		'small'  => [
			'box-shadow' => '0px 3px 5px 0px rgba(0, 0, 0, 0.1)',
		],
		'medium' => [
			'box-shadow' => '0px 10px 20px 0px rgba(0, 0, 0, 0.1)',
		],
		'large'  => [
			'box-shadow' => '0px 30px 50px -10px rgba(0, 0, 0, 0.15)',
		],
	];

	/**
	 * Field Size vars and values.
	 *
	 * @since 1.8.1
	 *
	 * @var array
	 */
	const FIELD_SIZE = [
		'small'  => [
			'input-height'     => '31px',
			'input-spacing'    => '10px',
			'font-size'        => '14px',
			'line-height'      => '17px',
			'padding-h'        => '9px',
			'checkbox-size'    => '14px',
			'sublabel-spacing' => '5px',
			'icon-size'        => '0.75',
		],
		'medium' => [
			'input-height'     => '43px',
			'input-spacing'    => '15px',
			'font-size'        => '16px',
			'line-height'      => '19px',
			'padding-h'        => '14px',
			'checkbox-size'    => '16px',
			'sublabel-spacing' => '5px',
			'icon-size'        => '1',
		],
		'large'  => [
			'input-height'     => '50px',
			'input-spacing'    => '20px',
			'font-size'        => '18px',
			'line-height'      => '21px',
			'padding-h'        => '14px',
			'checkbox-size'    => '18px',
			'sublabel-spacing' => '10px',
			'icon-size'        => '1.25',
		],
	];

	/**
	 * Label Size vars and values.
	 *
	 * @since 1.8.1
	 *
	 * @var array
	 */
	const LABEL_SIZE = [
		'small'  => [
			'font-size'            => '14px',
			'line-height'          => '17px',
			'sublabel-font-size'   => '13px',
			'sublabel-line-height' => '16px',
		],
		'medium' => [
			'font-size'            => '16px',
			'line-height'          => '19px',
			'sublabel-font-size'   => '14px',
			'sublabel-line-height' => '17px',
		],
		'large'  => [
			'font-size'            => '18px',
			'line-height'          => '21px',
			'sublabel-font-size'   => '16px',
			'sublabel-line-height' => '19px',
		],
	];

	/**
	 * Button Size vars and values.
	 *
	 * @since 1.8.1
	 *
	 * @var array
	 */
	const BUTTON_SIZE = [
		'small'  => [
			'font-size'  => '14px',
			'height'     => '37px',
			'padding-h'  => '15px',
			'margin-top' => '5px',
		],
		'medium' => [
			'font-size'  => '17px',
			'height'     => '41px',
			'padding-h'  => '15px',
			'margin-top' => '10px',
		],
		'large'  => [
			'font-size'  => '20px',
			'height'     => '48px',
			'padding-h'  => '20px',
			'margin-top' => '15px',
		],
	];

	/**
	 * Spare variables.
	 *
	 * @since 1.8.8
	 *
	 * @var array
	 */
	const SPARE_VARS = [ 'field-border-color' ];

	/**
	 * Render engine.
	 *
	 * @since 1.8.1
	 *
	 * @var string
	 */
	private $render_engine;

	/**
	 * CSS variables.
	 *
	 * @since 1.8.1
	 *
	 * @var array
	 */
	private $css_vars;

	/**
	 * Flag to check if root CSS vars were output.
	 *
	 * @since 1.8.1
	 *
	 * @var bool
	 */
	private $is_root_vars_displayed;

	/**
	 * Initialize class.
	 *
	 * @since 1.8.1
	 */
	public function init() {

		$this->init_vars();
		$this->hooks();
	}

	/**
	 * Register hooks.
	 *
	 * @since 1.8.1
	 */
	private function hooks() {

		add_action( 'wp_head', [ $this, 'output_root' ], PHP_INT_MAX );
	}

	/**
	 * CSS variables data.
	 *
	 * @since 1.8.1
	 */
	private function init_vars() {

		$vars = [];

		$vars[':root'] = array_merge(
			self::ROOT_VARS,
			$this->get_complex_vars( 'field-size', self::FIELD_SIZE['medium'] ),
			$this->get_complex_vars( 'label-size', self::LABEL_SIZE['medium'] ),
			$this->get_complex_vars( 'button-size', self::BUTTON_SIZE['medium'] ),
			$this->get_complex_vars( 'container-shadow-size', self::CONTAINER_SHADOW_SIZE['none'] )
		);

		/**
		 * Allows developers to modify default CSS variables which output on the frontend.
		 *
		 * @since 1.8.1
		 *
		 * @param array $vars CSS variables two-dimensional array.
		 *                    First level keys is the CSS selector.
		 *                    Second level keys is the variable name without the `--wpforms-` prefix.
		 */
		$this->css_vars = apply_filters( 'wpforms_frontend_css_vars_init_vars', $vars );
	}

	/**
	 * Get complex CSS variables data.
	 *
	 * @since 1.8.1
	 *
	 * @param string $prefix CSS variable prefix.
	 * @param array  $values Values.
	 */
	public function get_complex_vars( $prefix, $values ): array {

		$vars = [];

		foreach ( $values as $key => $value ) {
			$vars[ "{$prefix}-{$key}" ] = $value;
		}

		return $vars;
	}

	/**
	 * Get CSS variables data by selector.
	 *
	 * @since 1.8.1
	 *
	 * @param string $selector Selector.
	 *
	 * @return array
	 */
	public function get_vars( $selector ): array {

		if ( empty( $selector ) ) {
			$selector = ':root';
		}

		if ( empty( $this->css_vars[ $selector ] ) ) {
			return [];
		}

		return $this->css_vars[ $selector ];
	}

	/**
	 * Output root CSS variables.
	 *
	 * @since 1.8.1
	 * @since 1.8.1.2 Added $force argument.
	 *
	 * @param bool $force Force output root variables.
	 */
	public function output_root( $force = false ) {

		if ( ! empty( $this->is_root_vars_displayed ) && empty( $force ) ) {
			return;
		}

		$this->output_selector_vars( ':root', $this->css_vars[':root'] );

		$this->is_root_vars_displayed = true;
	}

	/**
	 * Output selector's CSS variables.
	 *
	 * @since 1.8.1
	 *
	 * @param string     $selector Selector.
	 * @param array      $vars     Variables data.
	 * @param string     $style_id Style tag ID attribute. Optional. Default is empty string.
	 * @param string|int $form_id  Form ID. Optional. Default is empty string.
	 */
	public function output_selector_vars( $selector, $vars, $style_id = '', $form_id = '' ) {

		if ( empty( $this->render_engine ) ) {
			$this->render_engine = wpforms_get_render_engine();
		}

		if ( $this->render_engine === 'classic' ) {
			return;
		}

		$style_id = empty( $style_id ) ? 'wpforms-css-vars-' . $selector : $style_id;

		printf(
			'<style id="%1$s">
				%2$s {
					%3$s
				}
			</style>',
			sanitize_key( $style_id ),
			$selector, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
 			esc_html( $this->get_vars_css( $vars, $form_id ) )
		);
	}

	/**
	 * Pre print vars filter.
	 *
	 * @since 1.8.8
	 *
	 * @param array      $vars    Variables data.
	 * @param string|int $form_id Form ID. Optional. Default is empty string.
	 *
	 * @return array
	 */
	private function get_pre_print_vars( array $vars, $form_id = '' ): array {

		// Normalize the `background-url` variable.
		if ( isset( $vars['background-url'] ) ) {
			$vars['background-url'] = $vars['background-url'] === 'url()' ? 'none' : $vars['background-url'];
		}

		/**
		 * Filter CSS variables right before printing the CSS.
		 *
		 * @since 1.8.8
		 *
		 * @param array $vars    CSS variables.
		 * @param int   $form_id Form ID. Optional. Default is empty string.
		 */
		return (array) apply_filters( 'wpforms_frontend_css_vars_pre_print_filter', $vars, $form_id );
	}

	/**
	 * Generate CSS code from given vars data.
	 *
	 * @since 1.8.1
	 *
	 * @param array      $vars    Variables data.
	 * @param string|int $form_id Form ID. Optional. Default is empty string.
	 */
	private function get_vars_css( $vars, $form_id = '' ): string {

		$vars   = $this->get_pre_print_vars( (array) $vars, $form_id );
		$result = '';

		foreach ( $vars as $name => $value ) {
			if ( $value === '0' ) {
				$value = '0px';
			}

			$result .= "--wpforms-{$name}: {$value};\n";

			if ( in_array( $name, self::SPARE_VARS, true ) ) {
				$result .= "--wpforms-{$name}-spare: {$value};\n";
			}
		}

		return $result;
	}

	/**
	 * Get customized CSS vars.
	 *
	 * @since 1.8.3
	 *
	 * @param array $attr Attributes passed by integration.
	 *
	 * @return array
	 */
	public function get_customized_css_vars( $attr ): array { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded

		$root_css_vars = $this->get_vars( ':root' );
		$css_vars      = [];

		foreach ( $attr as $key => $value ) {

			$var_name = strtolower( preg_replace( '/[A-Z]/', '-$0', $key ) );

			// Skip attribute that is not the CSS var or has the default value.
			if ( empty( $root_css_vars[ $var_name ] ) || $root_css_vars[ $var_name ] === $value ) {
				continue;
			}

			$css_vars[ $var_name ] = $value;
		}

		// Reset border size in case of border style is `none`.
		if ( isset( $css_vars['field-border-style'] ) && $css_vars['field-border-style'] === 'none' ) {
			$css_vars['field-border-size'] = '0px';
		}

		if ( isset( $css_vars['button-border-style'] ) && $css_vars['button-border-style'] === 'none' ) {
			$css_vars['button-border-size'] = '0px';
		}

		// Set the button alternative background color and use border color for accent in case of transparent color.
		$button_bg_color = $css_vars['button-background-color'] ?? $root_css_vars['button-background-color'];

		if ( $this->is_transparent_color( $button_bg_color ) ) {
			$css_vars['button-background-color-alt'] = $button_bg_color;

			$border_color = $css_vars['button-border-color'] ?? $root_css_vars['button-border-color'];

			$css_vars['button-background-color'] = $this->is_transparent_color( $border_color ) ? $root_css_vars['button-background-color'] : $border_color;
			$button_bg_color                     = $css_vars['button-background-color'];
		}

		$button_bg_color = strtolower( $button_bg_color );

		// Set the button alternative text color in case if the background and text color are identical.
		$button_text_color = strtolower( $css_vars['button-text-color'] ?? $root_css_vars['button-text-color'] );

		if ( $button_bg_color === $button_text_color || $this->is_transparent_color( $button_text_color ) ) {
			$css_vars['button-text-color-alt'] = $this->get_contrast_color( $button_bg_color );
		}

		$size_css_vars = $this->get_size_css_vars( $attr );

		return array_merge( $css_vars, $size_css_vars );
	}

	/**
	 * Checks if the provided color has transparency.
	 *
	 * @since 1.8.8
	 *
	 * @param string $color The color to check.
	 *
	 * @return bool
	 */
	private function is_transparent_color( $color ): bool {

		$rgba = $this->get_color_as_rgb_array( $color );

		$opacity_threshold = 0.33;
		$opacity           = $rgba[3] ?? 1;

		return $opacity < $opacity_threshold;
	}

	/**
	 * Get contrast color relative to given color.
	 *
	 * @since 1.8.8
	 *
	 * @param string|array $color The color.
	 *
	 * @return string
	 */
	private function get_contrast_color( $color ): string {

		$rgba = is_array( $color ) ? $color : $this->get_color_as_rgb_array( $color );
		$avg  = (int) ( ( ( array_sum( $rgba ) ) / 3 ) * ( $rgba[3] ?? 1 ) );

		return $avg < 128 ? '#ffffff' : '#000000';
	}

	/**
	 * Get size CSS vars.
	 *
	 * @since 1.8.3
	 * @since 1.8.8 Removed $css_vars argument.
	 *
	 * @param array $attr Attributes passed by integration.
	 *
	 * @return array
	 */
	private function get_size_css_vars( array $attr ): array {

		$size_items    = [ 'field', 'label', 'button', 'container-shadow' ];
		$size_css_vars = [];

		foreach ( $size_items as $item ) {

			$item_attr = preg_replace_callback(
				'/-(\w)/',
				static function ( $matches ) {

					return strtoupper( $matches[1] );
				},
				$item
			);

			$item_attr .= 'Size';

			$item_key      = $item . '-size';
			$item_constant = 'self::' . str_replace( '-', '_', strtoupper( $item ) ) . '_SIZE';

			if ( empty( $attr[ $item_attr ] ) ) {
				continue;
			}

			$size_css_vars[] = $this->get_complex_vars( $item_key, constant( $item_constant )[ $attr[ $item_attr ] ] );
		}

		return empty( $size_css_vars ) ? [] : array_merge( ...$size_css_vars );
	}

	/**
	 * Get color as an array of RGB(A) values.
	 *
	 * @since 1.8.8
	 *
	 * @param string $color Color.
	 *
	 * @return array|bool Color as an array of RGBA values. False on error.
	 */
	private function get_color_as_rgb_array( $color ) {

		// Remove # from the beginning of the string and remove whitespaces.
		$color = preg_replace( '/^#/', '', strtolower( trim( $color ) ) );
		$color = str_replace( ' ', '', $color );

		if ( $color === 'transparent' ) {
			$color = 'rgba(0,0,0,0)';
		}

		$rgba      = $color;
		$rgb_array = [];

		// Check if color is in HEX(A) format.
		$is_hex = preg_match( '/[0-9a-f]{6,8}$/', $rgba );

		if ( $is_hex ) {
			// Search and split HEX(A) color into an array of couples of chars.
			preg_match_all( '/\w\w/', $rgba, $rgb_array );

			$rgb_array    = array_map(
				static function ( $value ) {

					return hexdec( '0x' . $value );
				},
				$rgb_array[0] ?? []
			);
			$rgb_array[3] = ( $rgb_array[3] ?? 255 ) / 255;
		} else {
			$rgba      = preg_replace( '/[^\d,.]/', '', $rgba );
			$rgb_array = explode( ',', $rgba );
		}

		return $rgb_array;
	}
}
