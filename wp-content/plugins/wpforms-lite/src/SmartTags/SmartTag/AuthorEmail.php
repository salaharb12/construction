<?php

namespace WPForms\SmartTags\SmartTag;

/**
 * Class AuthorEmail.
 *
 * @since 1.6.7
 */
class AuthorEmail extends SmartTag {

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

		$author_email = $this->get_author_meta( $entry_id, 'user_email' );

		if ( ! empty( $author_email ) ) {
			return sanitize_email( $author_email );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( ! empty( $_POST['page_id'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$author_id = get_post_field( 'post_author', absint( $_POST['page_id'] ) );

			if ( ! $author_id ) {
				return '';
			}

			$author_email = get_the_author_meta( 'user_email', $author_id );

			return sanitize_email( $author_email );
		}

		return sanitize_email( get_the_author_meta( 'user_email' ) );
	}
}
