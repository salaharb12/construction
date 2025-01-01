<?php

namespace WPForms\SmartTags\SmartTag;

/**
 * Class AuthorDisplay.
 *
 * @since 1.6.7
 */
class AuthorDisplay extends SmartTag {

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
	public function get_value( $form_data, $fields = [], $entry_id = '' ) {

		$author_display_name = $this->get_author_meta( $entry_id, 'display_name' );

		if ( ! empty( $author_display_name ) ) {
			return esc_html( wp_strip_all_tags( $author_display_name ) );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( ! empty( $_POST['page_id'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$author_id = get_post_field( 'post_author', absint( $_POST['page_id'] ) );

			if ( ! $author_id ) {
				return '';
			}

			$author_display_name = get_the_author_meta( 'display_name', $author_id );

			return esc_html( wp_strip_all_tags( $author_display_name ) );
		}

		return esc_html( wp_strip_all_tags( get_the_author_meta( 'display_name' ) ) );
	}
}
