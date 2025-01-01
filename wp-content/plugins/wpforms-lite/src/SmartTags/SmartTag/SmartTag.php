<?php

namespace WPForms\SmartTags\SmartTag;

use WP_User;

/**
 * Class SmartTag.
 *
 * @since 1.6.7
 */
abstract class SmartTag {

	/**
	 * Full smart tag.
	 * For example: {smart_tag attr="1" attr2="true"}.
	 *
	 * @since 1.6.7
	 *
	 * @var string
	 */
	protected $smart_tag;

	/**
	 * Context usage.
	 *
	 * @since 1.8.7
	 *
	 * @var string
	 */
	protected $context;

	/**
	 * List of attributes.
	 *
	 * @since 1.6.7
	 *
	 * @var array
	 */
	protected $attributes = [];

	/**
	 * SmartTag constructor.
	 *
	 * @since 1.6.7
	 * @since 1.8.7 Added $context parameter.
	 *
	 * @param string $smart_tag Full smart tag.
	 * @param string $context   Context usage.
	 */
	public function __construct( $smart_tag, $context = '' ) {

		$this->smart_tag = $smart_tag;
		$this->context   = $context;
	}

	/**
	 * Get smart tag value.
	 *
	 * @since 1.6.7
	 *
	 * @param array  $form_data Form data.
	 * @param array  $fields    List of fields.
	 * @param string $entry_id  Entry ID.
	 *
	 * @return string
	 */
	abstract public function get_value( $form_data, $fields = [], $entry_id = '' );

	/**
	 * Get list of smart tag attributes.
	 *
	 * @since 1.6.7
	 *
	 * @return array
	 */
	public function get_attributes() {

		if ( ! empty( $this->attributes ) ) {
			return $this->attributes;
		}

		/**
		 * (\w+) an attribute name and also the first capturing group. Lowercase or uppercase letters, digits, underscore.
		 * = the equal sign.
		 * (["\']) single or double quote, the second capturing group.
		 * (.+?) an attribute value within the quotes, and also the third capturing group. Any number of any characters except new line. Lazy mode - match as few characters as possible to allow multiple attributes on one line.
		 * \2 - repeat the second capturing group.
		 */
		preg_match_all( '/(\w+)=(["\'])(.+?)\2/', $this->smart_tag, $attributes );
		$this->attributes = array_combine( $attributes[1], $attributes[3] );

		return $this->attributes;
	}

	/**
	 * Get current user.
	 *
	 * @since 1.8.7
	 *
	 * @param string|int $entry_id Entry ID.
	 *
	 * @return WP_User|string
	 */
	public function get_user( $entry_id ) {

		$user = $this->get_entry_user( $entry_id );

		if ( ! empty( $user ) ) {
			return $user;
		}

		return is_user_logged_in() ? wp_get_current_user() : '';
	}

	/**
	 * Get user from the entry.
	 *
	 * @since 1.8.8
	 *
	 * @param string|int $entry_id Entry ID.
	 *
	 * @return WP_User|string
	 */
	private function get_entry_user( $entry_id ) {

		if ( empty( $entry_id ) ) {
			return '';
		}

		$entry = wpforms()->obj( 'entry' );

		if ( empty( $entry ) ) {
			return '';
		}

		$user          = null;
		$entry_data    = $entry->get( $entry_id );
		$entry_user_id = $entry_data->user_id ?? 0;

		if ( ! empty( $entry_user_id ) ) {
			$user = get_user_by( 'id', $entry_user_id );
		}

		if ( ! $user instanceof WP_User ) {
			return '';
		}

		return $user;
	}

	/**
	 * Get author.
	 *
	 * @since 1.8.7
	 *
	 * @param int $post_id Submitted post ID.
	 *
	 * @return WP_User|false WP_User object on success, false on failure.
	 */
	public function get_author( $post_id ) {

		$author_id = get_post_field( 'post_author', $post_id );

		return get_user_by( 'id', $author_id );
	}

	/**
	 * Get author property.
	 *
	 * @since 1.8.8
	 *
	 * @param int|string $entry_id Entry ID.
	 * @param string     $meta_key User property.
	 *
	 * @return string
	 */
	protected function get_author_meta( $entry_id, string $meta_key ): string {

		if ( empty( $entry_id ) ) {
			return '';
		}

		$page_id = $this->get_meta( $entry_id, 'page_id' );

		if ( empty( $page_id ) ) {
			return '';
		}

		$author = $this->get_author( $page_id );

		if ( ! $author ) {
			return '';
		}

		return $author->{$meta_key} ?? '';
	}

	/**
	 * Get entry meta.
	 *
	 * @since 1.8.7
	 *
	 * @param string|int $entry_id Entry ID.
	 * @param string     $meta_key Meta key.
	 *
	 * @return string Meta value.
	 */
	public function get_meta( $entry_id, string $meta_key ) {

		if ( empty( $entry_id ) ) {
			return '';
		}

		$entry_meta = wpforms()->obj( 'entry_meta' );

		if ( empty( $entry_meta ) ) {
			return '';
		}

		$meta = $entry_meta->get_meta(
			[
				'entry_id' => $entry_id,
				'type'     => $meta_key,
				'number'   => 1,
			]
		);

		return $meta[0]->data ?? '';
	}

	/**
	 * Get formatted field value.
	 *
	 * @since 1.8.9
	 *
	 * @param int    $field_id  Field ID.
	 * @param array  $fields    List of fields.
	 * @param string $field_key Field key to get value from.
	 *
	 * @return mixed|string
	 */
	protected function get_formatted_field_value( int $field_id, array $fields, string $field_key ) {

		$value = $fields[ $field_id ][ $field_key ] ?? '';

		/**
		 * Allow modifying the formatted field value.
		 *
		 * @since 1.9.0
		 *
		 * @param string $value     Field value.
		 * @param int    $field_id  Field ID.
		 * @param array  $fields    List of fields.
		 * @param string $field_key Field key to get value from.
		 *
		 * @return string
		 */
		$value = (string) apply_filters( 'wpforms_smart_tags_formatted_field_value', $value, $field_id, $fields, $field_key ); //phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName

		if ( ! wpforms_is_repeated_field( $field_id, $fields ) ) {
			return $value;
		}

		return $this->get_repeated_field_value( $value, $field_id, $fields, $field_key );
	}

	/**
	 * Get repeated fields value.
	 *
	 * @since 1.8.9
	 *
	 * @param string $value     Field value.
	 * @param int    $field_id  Field ID.
	 * @param array  $fields    List of fields.
	 * @param string $field_key Field key to get value from.
	 *
	 * @return string
	 */
	private function get_repeated_field_value( string $value, int $field_id, array $fields, string $field_key ): string {

		$comma_separated_contexts = [ 'notification-send-to-email', 'notification-carboncopy' ];
		$prefix                   = $field_id . '_';
		$separator                = in_array( $this->context, $comma_separated_contexts, true ) ? ',' : "\n";

		foreach ( $fields as $key => $field ) {
			if ( strpos( $key, $prefix ) !== 0 ) {
				continue;
			}

			if ( ! isset( $field[ $field_key ] ) ) {
				continue;
			}

			$value .= $separator . $field[ $field_key ];
		}

		return $value;
	}
}
