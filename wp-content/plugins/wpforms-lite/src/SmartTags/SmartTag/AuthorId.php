<?php

namespace WPForms\SmartTags\SmartTag;

/**
 * Class AuthorId.
 *
 * @since 1.6.7
 */
class AuthorId extends SmartTag {

	/**
	 * Get smart tag value.
	 *
	 * @since 1.6.7
	 *
	 * @param array  $form_data Form data.
	 * @param array  $fields    List of fields.
	 * @param string $entry_id  Entry ID.
	 *
	 * @return int
	 */
	public function get_value( $form_data, $fields = [], $entry_id = '' ) {

		$author_id = $this->get_author_meta( $entry_id, 'ID' );

		if ( ! empty( $author_id ) ) {
			return absint( $author_id );
		}

		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		if ( ! empty( $_POST['page_id'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Missing
			$author_id = get_post_field( 'post_author', absint( $_POST['page_id'] ) );

			return $author_id ? absint( $author_id ) : '';
		}

		$author_id = get_the_author_meta( 'ID' );

		return $author_id ? absint( $author_id ) : '';
	}
}
