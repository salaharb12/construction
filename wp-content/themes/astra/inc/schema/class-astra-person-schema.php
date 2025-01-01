<?php
/**
 * Schema markup.
 *
 * @package     Astra
 * @link        https://wpastra.com/
 * @since       Astra 2.1.3
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Astra CreativeWork Schema Markup.
 *
 * @since 2.1.3
 */
class Astra_Person_Schema extends Astra_Schema {

	/**
	 * Setup schema
	 *
	 * @since 2.1.3
	 */
	public function setup_schema() {

		if ( true !== $this->schema_enabled() ) {
			return false;
		}

		add_filter( 'astra_attr_post-meta-author', array( $this, 'person_Schema' ) );
		add_filter( 'astra_attr_comment-meta-author', array( $this, 'author_schema_class' ) );
		add_filter( 'astra_attr_archive-meta-author', array( $this, 'author_schema_class' ) );
		add_filter( 'astra_attr_author-name', array( $this, 'author_name_schema_itemprop' ) );
		add_filter( 'astra_attr_author-url', array( $this, 'author_url_schema_itemprop' ) );
		add_filter( 'astra_attr_author-name-info', array( $this, 'author_name_info_schema_itemprop' ) );
		add_filter( 'astra_attr_author-url-info', array( $this, 'author_info_url_schema_itemprop' ) );
		add_filter( 'astra_attr_author-item-info', array( $this, 'author_item_schema_itemprop' ) );
		add_filter( 'astra_attr_author-desc-info', array( $this, 'author_desc_schema_itemprop' ) );
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function person_Schema( $attr ) {
		$attr['itemtype']  = 'https://schema.org/Person';
		$attr['itemscope'] = 'itemscope';
		$attr['itemprop']  = 'author';
		$attr['class']     = 'posted-by vcard author';

		return $attr;
	}

	/**
	 * Update author schema markup class attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array Updated embed markup class attribute.
	 * 
	 * @since 4.8.2
	 */
	public function author_schema_class( $attr ) {
		$attr['class']  = isset( $attr['class'] ) ? $attr['class'] : '';
		$attr['class'] .= ' vcard';
		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_name_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'name';

		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_name_info_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'name';

		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_url_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'url';

		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_info_url_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'url';

		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_desc_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'description';

		return $attr;
	}

	/**
	 * Update Schema markup attribute.
	 *
	 * @param  array $attr An array of attributes.
	 *
	 * @return array       Updated embed markup.
	 */
	public function author_item_schema_itemprop( $attr ) {
		$attr['itemprop'] = 'author';

		return $attr;
	}

	/**
	 * Enabled schema
	 *
	 * @since 2.1.3
	 */
	protected function schema_enabled() {
		return apply_filters( 'astra_person_schema_enabled', parent::schema_enabled() );
	}

}

new Astra_Person_Schema();
