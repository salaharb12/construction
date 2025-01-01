<?php

namespace WPForms\SmartTags\SmartTag;

/**
 * Class UrlReferer.
 *
 * @since 1.6.7
 */
class UrlReferer extends SmartTag {

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

		$referer = $this->get_meta( $entry_id, 'referer' );

		if ( ! empty( $referer ) ) {
			return esc_url( $referer );
		}

		return esc_url( (string) wp_get_referer() );
	}
}
