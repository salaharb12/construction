<?php

use WPForms\Admin\Education\Helpers;

/**
 * Output fields to be used on panels (settings etc.).
 *
 * @since        1.0.0
 *
 * @param string $option    Field type.
 * @param string $panel     Panel name.
 * @param string $field     Field name.
 * @param array  $form_data Form data.
 * @param string $label     Label.
 * @param array  $args      Arguments.
 * @param bool   $do_echo   Output the result.
 *
 * @return string|null
 * @noinspection HtmlWrongAttributeValue
 * @noinspection HtmlUnknownAttribute
 */
function wpforms_panel_field( $option, $panel, $field, $form_data, $label, $args = [], $do_echo = true ) { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded, Generic.Metrics.NestingLevel.MaxExceeded

	// Required params.
	if ( empty( $option ) || empty( $panel ) || empty( $field ) ) {
		return '';
	}

	// Setup basic vars.
	$panel            = esc_attr( $panel );
	$field            = esc_attr( $field );
	$panel_id         = sanitize_html_class( $panel );
	$parent           = ! empty( $args['parent'] ) ? esc_attr( $args['parent'] ) : '';
	$subsection       = ! empty( $args['subsection'] ) ? esc_attr( $args['subsection'] ) : '';
	$index            = isset( $args['index'] ) ? esc_attr( $args['index'] ) : '';
	$index            = is_numeric( $index ) ? absint( $index ) : $index;
	$label            = ! empty( $label ) ? wp_kses( $label, [ 'span' => [ 'class' => [] ] ] ) : '';
	$class            = ! empty( $args['class'] ) ? wpforms_sanitize_classes( $args['class'] ) : '';
	$input_class      = ! empty( $args['input_class'] ) ? wpforms_sanitize_classes( $args['input_class'] ) : '';
	$default          = $args['default'] ?? '';
	$placeholder      = ! empty( $args['placeholder'] ) ? esc_attr( $args['placeholder'] ) : '';
	$data_attr        = '';
	$output           = '';
	$smarttags_toggle = '';
	$input_id         = sprintf( 'wpforms-panel-field-%s-%s', sanitize_html_class( $panel_id ), sanitize_html_class( $field ) );

	if ( ! empty( $args['input_id'] ) ) {
		$input_id = esc_attr( $args['input_id'] );
	}

	// Sanitize the subsection only if it doesn't contain a connection ID tag.
	if ( strpos( $subsection, '%connection_id%' ) === false ) {
		$subsection = sanitize_html_class( $subsection );
	}

	if ( ! empty( $args['smarttags'] ) ) {
		$type                = ! empty( $args['smarttags']['type'] ) ? esc_attr( $args['smarttags']['type'] ) : 'fields';
		$fields              = ! empty( $args['smarttags']['fields'] ) ? esc_attr( $args['smarttags']['fields'] ) : '';
		$is_repeater_allowed = ! empty( $args['smarttags']['allow-repeated-fields'] ) ? esc_attr( $args['smarttags']['allow-repeated-fields'] ) : '';

		$smarttags_toggle = sprintf(
			'<a href="#" class="toggle-smart-tag-display toggle-unfoldable-cont" data-type="%1$s" data-fields="%2$s" data-allow-repeated-fields="%3$s">
				<i class="fa fa-tags"></i><span>%4$s</span>
			</a>',
			esc_attr( $type ),
			esc_attr( $fields ),
			esc_attr( $is_repeater_allowed ),
			esc_html__( 'Show Smart Tags', 'wpforms-lite' )
		);
	}

	if ( ! empty( $args['pro_badge'] ) ) {
		$label .= Helpers::get_badge( 'Pro', 'sm', 'inline', 'silver' );
	}

	// Check if we should store values in a parent array.
	if ( ! empty( $parent ) ) {
		if ( $subsection && ! wpforms_is_empty_string( $index ) ) {
			$field_name = sprintf( '%s[%s][%s][%s][%s]', $parent, $panel, $subsection, $index, $field );
			$value      = $form_data[ $parent ][ $panel ][ $subsection ][ $index ][ $field ] ?? $default;
			$input_id   = sprintf( 'wpforms-panel-field-%s-%s-%s-%s', sanitize_html_class( $panel_id ), $subsection, sanitize_html_class( $index ), sanitize_html_class( $field ) );
		} elseif ( ! empty( $subsection ) ) {
			$field_name = sprintf( '%s[%s][%s][%s]', $parent, $panel, $subsection, $field );
			$value      = $form_data[ $parent ][ $panel ][ $subsection ][ $field ] ?? $default;
			$input_id   = sprintf( 'wpforms-panel-field-%s-%s-%s', sanitize_html_class( $panel_id ), $subsection, sanitize_html_class( $field ) );
		} else {
			$field_name = sprintf( '%s[%s][%s]', $parent, $panel, $field );
			$value      = $form_data[ $parent ][ $panel ][ $field ] ?? $default;
		}
	} else {
		$field_name = sprintf( '%s[%s]', $panel, $field );
		$value      = $form_data[ $panel ][ $field ] ?? $default;
	}

	if ( isset( $args['field_name'] ) ) {
		$field_name = $args['field_name'];
	}

	if ( isset( $args['value'] ) ) {
		$value = $args['value'];
	}

	// Check for data attributes.
	if ( ! empty( $args['data'] ) ) {
		foreach ( $args['data'] as $key => $val ) {
			if ( is_array( $val ) ) {
				$val = wp_json_encode( $val );
			}
			$data_attr .= ' data-' . $key . '=\'' . $val . '\'';
		}
	}

	// Check for readonly inputs.
	if ( ! empty( $args['readonly'] ) ) {
		$data_attr .= 'readonly';
	}

	// Determine what field type to output.
	switch ( $option ) {
		// Text input.
		case 'text':
			// Handle min and max attributes for number fields.
			if ( ! empty( $args['type'] ) && $args['type'] === 'number' ) {
				if ( isset( $args['min'] ) && is_int( $args['min'] ) ) {
					$data_attr .= sprintf( ' min="%1$d" oninput="validity.valid||(value=\'%1$d\');" ', esc_attr( $args['min'] ) );
				}

				if ( isset( $args['max'] ) && is_int( $args['max'] ) ) {
					$data_attr .= sprintf( ' max="%1$d" oninput="validity.valid||(value=\'%1$d\');" ', esc_attr( $args['max'] ) );
				}
			}

			$output = sprintf(
				'<input type="%s" id="%s" name="%s" value="%s" placeholder="%s" class="%s" %s>',
				! empty( $args['type'] ) ? esc_attr( $args['type'] ) : 'text',
				$input_id,
				$field_name,
				esc_attr( $value ),
				$placeholder,
				$input_class,
				$data_attr
			);
			break;

		// Textarea.
		case 'textarea':
			$output = sprintf(
				'<textarea id="%s" name="%s" rows="%d" placeholder="%s" class="%s" %s>%s</textarea>',
				$input_id,
				$field_name,
				! empty( $args['rows'] ) ? (int) $args['rows'] : '3',
				$placeholder,
				$input_class,
				$data_attr,
				esc_textarea( $value )
			);
			break;

		// TinyMCE.
		case 'tinymce':
			$id                               = str_replace( '-', '_', $input_id );
			$args['tinymce']['textarea_name'] = $field_name;
			$args['tinymce']['teeny']         = true;
			$args['tinymce']                  = wp_parse_args(
				$args['tinymce'],
				[
					'media_buttons' => false,
					'teeny'         => true,
				]
			);

			ob_start();
			wp_editor( $value, $id, $args['tinymce'] );

			$output = ob_get_clean();
			break;

		// Checkbox.
		case 'checkbox':
			$output  = sprintf(
				'<input type="checkbox" id="%s" name="%s" value="1" class="%s" %s %s>',
				$input_id,
				$field_name,
				$input_class,
				checked( '1', $value, false ),
				$data_attr
			);
			$output .= sprintf(
				'<label for="%s" class="inline">%s',
				$input_id,
				$label
			);

			if ( ! empty( $args['before_tooltip'] ) ) {
				$output .= $args['before_tooltip'];
			}

			if ( ! empty( $args['tooltip'] ) ) {
				$output .= sprintf( '<i class="fa fa-question-circle-o wpforms-help-tooltip" title="%s"></i>', esc_attr( $args['tooltip'] ) );
			}
			$output .= '</label>';
			break;

		// Toggle.
		case 'toggle':
			$toggle_args                = $args;
			$toggle_args['input-class'] = $input_class;
			$output                     = wpforms_panel_field_toggle_control( $toggle_args, $input_id, $field_name, $label, $value, $data_attr );
			break;

		// Radio.
		case 'radio':
			$options       = $args['options'];
			$radio_counter = 1;

			foreach ( $options as $key => $item ) {
				if ( empty( $item['label'] ) ) {
					continue;
				}

				$item_value = ! empty( $item['value'] ) ? $item['value'] : $key;

				$output .= '<span class="row">';

				if ( ! empty( $item['pre_label'] ) ) {
					$output .= '<label>' . $item['pre_label'];
				}

				$output .= sprintf(
					'<input type="radio" id="%s-%d" name="%s" value="%s" class="%s" %s %s>',
					$input_id,
					$radio_counter,
					$field_name,
					$item_value,
					$input_class,
					checked( $item_value, $value, false ),
					$data_attr
				);

				if ( empty( $item['pre_label'] ) ) {
					$output .= sprintf(
						'<label for="%s-%d" class="inline">%s',
						$input_id,
						$radio_counter,
						$item['label']
					);
				} else {
					$output .= '<span class="wpforms-panel-field-radio-label">' . $item['label'] . '</span>';
				}

				if ( ! empty( $item['tooltip'] ) ) {
					$output .= sprintf( '<i class="fa fa-question-circle-o wpforms-help-tooltip" title="%s"></i>', esc_attr( $item['tooltip'] ) );
				}

				$output .= '</label></span>';

				++$radio_counter;
			}

			if ( ! empty( $output ) ) {
				$output = '<div class="wpforms-panel-field-radio-container">' . $output . '</div>';
			}
			break;

		// Select.
		case 'select':
			if ( empty( $args['options'] ) && empty( $args['field_map'] ) && empty( $args['multiple'] ) ) {
				return '';
			}

			if ( ! empty( $args['field_map'] ) ) {
				$options          = [];
				$available_fields = wpforms_get_form_fields( $form_data, $args['field_map'] );

				if ( ! empty( $available_fields ) ) {
					foreach ( $available_fields as $id => $available_field ) {
						$options[ $id ] = ! empty( $available_field['label'] )
							? esc_attr( $available_field['label'] )
							: sprintf( /* translators: %d - field ID. */
								esc_html__( 'Field #%d', 'wpforms-lite' ),
								absint( $id )
							);
					}
				}
				$input_class .= ' wpforms-field-map-select';
				$data_attr   .= ' data-field-map-allowed="' . implode( ' ', $args['field_map'] ) . '"';

				if ( ! empty( $placeholder ) ) {
					$data_attr .= ' data-field-map-placeholder="' . esc_attr( $placeholder ) . '"';
				}
			} else {
				$options = $args['options'];
			}

			if ( array_key_exists( 'choicesjs', $args ) && is_array( $args['choicesjs'] ) ) {
				$input_class .= ' choicesjs-select';
				$data_attr   .= ! empty( $args['choicesjs']['use_ajax'] ) ? ' data-choicesjs-use-ajax=1' : '';
				$data_attr   .= ! empty( $args['choicesjs']['callback_fn'] ) ? ' data-choicesjs-callback-fn="' . esc_attr( $args['choicesjs']['callback_fn'] ) . '"' : '';
			}

			if ( ! empty( $args['multiple'] ) ) {
				$data_attr .= ' multiple';
			}

			$output = sprintf(
				'<select id="%s" name="%s" class="%s" %s>',
				$input_id,
				$field_name,
				esc_attr( $input_class ),
				$data_attr
			);

			if ( ! empty( $placeholder ) ) {
				$output .= '<option value="">' . $placeholder . '</option>';
			}

			// This argument is used to disable some options, it takes an array of option values.
			// For instance, if you want to disable options with value '1' and '2', you should pass array( '1', '2' ).
			$disabled_options = ! empty( $args['disabled_options'] ) ? (array) $args['disabled_options'] : [];

			foreach ( $options as $key => $item ) {

				// If the option is disabled, we add the disabled attribute.
				$disabled = in_array( $key, $disabled_options, true ) ? 'disabled' : '';

				// Disabled options cannot be selected, so we bail early.
				if ( ! empty( $disabled ) ) {
					$output .= sprintf(
						'<option value="%s" %s>%s</option>',
						esc_attr( $key ),
						$disabled,
						$item
					);

					continue;
				}

				if ( is_array( $value ) ) {
					$selected = in_array( $key, $value, true ) ? 'selected' : '';
				} else {
					$selected = selected( $key, $value, false );
				}

				$output .= sprintf(
					'<option value="%s" %s>%s</option>',
					esc_attr( $key ),
					$selected,
					$item
				);
			}

			$output .= '</select>';
			break;

		case 'color':
			$class       .= ' wpforms-panel-field-colorpicker';
			$input_class .= ' wpforms-color-picker';

			$output = sprintf(
				'<input type="text" id="%s" name="%s" value="%s" class="%s" %s>',
				$input_id,
				$field_name,
				esc_attr( $value ),
				wpforms_sanitize_classes( $input_class ),
				$data_attr
			);
			break;
	}

	// Put the pieces together.
	$field_open  = sprintf(
		'<div id="%s-wrap" class="wpforms-panel-field %s %s">',
		$input_id,
		$class,
		'wpforms-panel-field-' . sanitize_html_class( $option )
	);
	$field_open .= ! empty( $args['before'] ) ? $args['before'] : '';

	if ( $option !== 'toggle' && $option !== 'checkbox' && ! empty( $label ) ) {
		$field_label = sprintf(
			'<label for="%s">%s',
			$input_id,
			$label
		);

		if ( ! empty( $args['tooltip'] ) ) {
			$field_label .= sprintf( '<i class="fa fa-question-circle-o wpforms-help-tooltip" title="%s"></i>', esc_attr( $args['tooltip'] ) );
		}
		if ( ! empty( $args['after_tooltip'] ) ) {
			$field_label .= $args['after_tooltip'];
		}
		if ( $smarttags_toggle && ! ( $option === 'textarea' && ! empty( $args['tinymce'] ) ) ) {
			$field_label .= $smarttags_toggle;
		}
		$field_label .= '</label>';

		if ( ! empty( $args['after_label'] ) ) {
			$field_label .= $args['after_label'];
		}
	} else {
		$field_label = '';
	}

	$field_close = '';

	if ( $smarttags_toggle && $option === 'textarea' && ! empty( $args['tinymce'] ) ) {
		$field_close .= $smarttags_toggle;
	}

	$field_close .= ! empty( $args['after'] ) ? $args['after'] : '';
	$field_close .= '</div>';
	$output       = $field_open . $field_label . $output . $field_close;

	// Wash our hands.
	if ( $do_echo ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo $output;

		return null;
	}

	return $output;
}

/**
 * Create toggle control.
 *
 * It's like a regular checkbox but with a modern visual appearance.
 *
 * @since 1.6.8
 *
 * @param array  $args       Arguments array.
 *
 *    @type bool   $status        If `true`, control will display the current status next to the toggle.
 *    @type string $status_on     Status `On` text. By default, `On`.
 *    @type string $status_off    Status `Off` text. By default, `Off`.
 *    @type bool   $label_hide    If `true` then the label will not display.
 *    @type string $tooltip       Tooltip text.
 *    @type string $input_class   CSS class for the hidden `<input type=checkbox>`.
 *    @type string $control_class CSS class for the wrapper `<span>`.
 *
 * @param string $input_id   Input ID.
 * @param string $field_name Field name.
 * @param string $label      Label text. Can contain HTML to display additional badges.
 * @param mixed  $value      Value.
 * @param string $data_attr  Attributes.
 *
 * @return string
 * @noinspection HtmlUnknownAttribute
 */
function wpforms_panel_field_toggle_control( $args, $input_id, $field_name, $label, $value, $data_attr ): string { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded

	$checked = checked( true, (bool) $value, false );
	$status  = '';

	if ( ! empty( $args['status'] ) ) {
		$status_on  = ! empty( $args['status-on'] ) ? $args['status-on'] : esc_html__( 'On', 'wpforms-lite' );
		$status_off = ! empty( $args['status-off'] ) ? $args['status-off'] : esc_html__( 'Off', 'wpforms-lite' );
		$status     = sprintf(
			'<label
				for="%s"
				class="wpforms-toggle-control-status"
				data-on="%s"
				data-off="%s">
				%s
			</label>',
			esc_attr( $input_id ),
			esc_attr( $status_on ),
			esc_attr( $status_off ),
			esc_html( $value ? $status_on : $status_off )
		);
	}

	$label_html  = empty( $args['label-hide'] ) && ! empty( $label ) ?
		sprintf(
			'<label for="%s" class="wpforms-toggle-control-label">%s</label>',
			esc_attr( $input_id ),
			$label
		) : '';
	$label_html .= isset( $args['tooltip'] ) ?
		sprintf(
			'<i class="fa fa-question-circle-o wpforms-help-tooltip" title="%s"></i>',
			esc_attr( $args['tooltip'] )
		) : '';

	$label_left    = ! empty( $args['label-left'] ) ? $label_html . $status : '';
	$label_right   = empty( $args['label-left'] ) ? $status . $label_html : '';
	$title         = isset( $args['title'] ) ? ' title="' . esc_attr( $args['title'] ) . '"' : '';
	$control_class = ! empty( $args['control-class'] ) ? $args['control-class'] : '';
	$input_class   = ! empty( $args['input-class'] ) ? $args['input-class'] : '';

	return sprintf(
		'<span class="wpforms-toggle-control %8$s" %9$s>
			%1$s
			<input type="checkbox" id="%2$s" name="%3$s" class="%7$s" value="1" %4$s %5$s %10$s>
			<label class="wpforms-toggle-control-icon" for="%2$s"></label>
			%6$s
		</span>',
		$label_left,
		esc_attr( $input_id ),
		esc_attr( $field_name ),
		$checked,
		$data_attr,
		$label_right,
		wpforms_sanitize_classes( $input_class ),
		wpforms_sanitize_classes( $control_class ),
		$title,
		! empty( $args['disabled'] ) ? 'disabled' : ''
	);
}

/**
 * Get settings block state, whether it's opened or closed.
 *
 * @since 1.4.8
 *
 * @param int    $form_id    Form ID.
 * @param int    $block_id   Block ID.
 * @param string $block_type Block type.
 *
 * @return string
 */
function wpforms_builder_settings_block_get_state( $form_id, $block_id, $block_type ): string {

	$form_id    = absint( $form_id );
	$block_id   = absint( $block_id );
	$block_type = sanitize_key( $block_type );
	$state      = 'opened';

	$all_states = get_user_meta( get_current_user_id(), 'wpforms_builder_settings_collapsable_block_states', true );

	if ( empty( $all_states ) ) {
		return $state;
	}

	if (
		is_array( $all_states ) &&
		! empty( $all_states[ $form_id ][ $block_type ][ $block_id ] ) &&
		$all_states[ $form_id ][ $block_type ][ $block_id ] === 'closed'
	) {
		$state = 'closed';
	}

	// Backward compatibility for notifications.
	if ( $block_type === 'notification' && $state !== 'closed' ) {
		$notification_states = get_user_meta( get_current_user_id(), 'wpforms_builder_notification_states', true );
	}

	if (
		! empty( $notification_states[ $form_id ][ $block_id ] ) &&
		$notification_states[ $form_id ][ $block_id ] === 'closed'
	) {
		$state = 'closed';
	}

	if ( $block_type === 'notification' ) {
		// Backward compatibility for notifications.

		/**
		 * Filters notification get state.
		 *
		 * @since 1.4.8
		 *
		 * @param string $state    Notification get state.
		 * @param int    $form_id  Form ID.
		 * @param int    $block_id Block ID.
		 *
		 * @return string
		 */
		return (string) apply_filters( 'wpforms_builder_notification_get_state', $state, $form_id, $block_id ); // phpcs:ignore WPForms.Formatting.EmptyLineBeforeReturn.RemoveEmptyLineBeforeReturnStatement
	}

	/**
	 * Filters settings block state.
	 *
	 * @since 1.4.8
	 *
	 * @param string $state      Settings block state.
	 * @param int    $form_id    Form ID.
	 * @param int    $block_id   Block ID.
	 * @param string $block_type Block type.
	 *
	 * @return string
	 */
	return apply_filters( 'wpforms_builder_settings_block_get_state', $state, $form_id, $block_id, $block_type );
}

/**
 * Get the list of allowed tags, used in a pair with wp_kses() function.
 * This allows getting rid of all potentially harmful HTML tags and attributes.
 *
 * @since 1.5.9
 *
 * @return array Allowed Tags.
 */
function wpforms_builder_preview_get_allowed_tags(): array {

	static $allowed_tags;

	if ( ! empty( $allowed_tags ) ) {
		return $allowed_tags;
	}

	$atts = [ 'align', 'class', 'type', 'id', 'for', 'style', 'src', 'rel', 'href', 'target', 'value', 'width', 'height' ];
	$tags = [ 'label', 'iframe', 'style', 'button', 'strong', 'small', 'table', 'span', 'abbr', 'code', 'pre', 'div', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ol', 'ul', 'li', 'em', 'hr', 'br', 'th', 'tr', 'td', 'p', 'a', 'b', 'i' ];

	$allowed_atts = array_fill_keys( $atts, [] );
	$allowed_tags = array_fill_keys( $tags, $allowed_atts );

	return $allowed_tags;
}

/**
 * Output builder panel fields group wrapper.
 *
 * @since 1.6.6
 *
 * @param string $inner   Inner HTML to wrap.
 * @param array  $args    Array of arguments.
 * @param bool   $do_echo Flag to display.
 *
 * @return string|null
 * @noinspection HtmlUnknownAttribute
 */
function wpforms_panel_fields_group( $inner, $args = [], $do_echo = true ) { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded

	$group      = ! empty( $args['group'] ) ? $args['group'] : '';
	$unfoldable = ! empty( $args['unfoldable'] );
	$default    = ( ! empty( $args['default'] ) && $args['default'] === 'opened' ) ? ' opened' : '';
	$opened     = ! empty( $_COOKIE[ 'wpforms_fields_group_' . $group ] ) && $_COOKIE[ 'wpforms_fields_group_' . $group ] === 'true' ? ' opened' : $default;
	$class      = ! empty( $args['class'] ) ? wpforms_sanitize_classes( $args['class'] ) : '';

	$output = sprintf(
		'<div class="wpforms-panel-fields-group %1$s%2$s" %3$s>',
		$class,
		$unfoldable ? ' unfoldable' . $opened : '',
		$unfoldable ? ' data-group="' . $group . '"' : ''
	);

	if ( ! empty( $args['borders'] ) && in_array( 'top', $args['borders'], true ) ) {
		$output .= '<div class="wpforms-panel-fields-group-border-top"></div>';
	}

	if ( ! empty( $args['title'] ) ) {
		$chevron = $unfoldable ? '<i class="fa fa-chevron-circle-right"></i>' : '';
		$output .= '<div class="wpforms-panel-fields-group-title">' . esc_html( $args['title'] ) . $chevron . '</div>';
	}

	if ( ! empty( $args['description'] ) ) {
		$output .= '<div class="wpforms-panel-fields-group-description">' . wp_kses_post( $args['description'] ) . '</div>';
	}

	$output .= sprintf(
		'<div class="wpforms-panel-fields-group-inner" %s>%s</div>',
		empty( $opened ) && $unfoldable ? ' style="display: none;"' : '',
		$inner
	);

	if ( ! empty( $args['borders'] ) && in_array( 'bottom', $args['borders'], true ) ) {
		$output .= '<div class="wpforms-panel-fields-group-border-bottom"></div>';
	}

	$output .= '</div>';

	if ( ! $do_echo ) {
		return $output;
	}

	echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped

	return null;
}

/**
 * Get the pages for the "Show Page" dropdown selection in Confirmations Settings in Builder.
 *
 * @since 1.7.9
 *
 * @param array $form_data       Form data.
 * @param int   $confirmation_id Confirmation ID.
 *
 * @return array
 */
function wpforms_builder_form_settings_confirmation_get_pages( $form_data, $confirmation_id ): array {

	$pre_selected_page_id = empty( $form_data['settings']['confirmations'][ $confirmation_id ]['page'] ) ? 0 : absint( $form_data['settings']['confirmations'][ $confirmation_id ]['page'] );
	$pages                = wp_list_pluck( wpforms_search_posts(), 'post_title', 'ID' );

	if ( empty( $pre_selected_page_id ) || isset( $pages[ $pre_selected_page_id ] ) ) {
		return $pages;
	}

	// If the pre-selected page isn't in `$pages`, we manually fetch it include it in `$pages`.
	$pre_selected_page = get_post( $pre_selected_page_id );

	if ( empty( $pre_selected_page ) ) {
		return $pages;
	}

	$pages[ $pre_selected_page->ID ] = wpforms_get_post_title( $pre_selected_page );

	return $pages;
}
