<?php
/**
 * Init
 *
 * @since 1.0.0
 * @package NPS Survey
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Sites_Nps_Notice' ) ) :

	/**
	 * Admin
	 */
	class Astra_Sites_Nps_Notice {
		/**
		 * Instance
		 *
		 * @since 1.0.0
		 * @var (Object) Astra_Sites_Nps_Notice
		 */
		private static $instance = null;

		/**
		 * Get Instance
		 *
		 * @since 1.0.0
		 *
		 * @return object Class object.
		 */
		public static function get_instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		private function __construct() {
			add_action( 'admin_footer', array( $this, 'render_nps_survey' ), 999 );
		}

		/** 
		 * Render NPS Survey
		 *
		 * @return void
		 */
		public function render_nps_survey() {

			if ( ! class_exists( 'Nps_Survey' ) ) {
				return;
			}

			if ( class_exists( 'Astra_Sites_White_Label' ) && is_callable( 'Astra_Sites_White_Label::get_instance' ) && Astra_Sites_White_Label::get_instance()->is_white_labeled() ) {
				return;
			}
			
			Nps_Survey::show_nps_notice(
				'nps-survey-astra-sites',
				array(
					'show_if' => get_option( 'astra_sites_import_complete', false ),
					'dismiss_timespan' => 2 * WEEK_IN_SECONDS,
					'display_after' => 0,
					'plugin_slug' => 'astra-sites',
					'message' => array(

						// Step 1 i.e rating input.
						'logo' => esc_url( INTELLIGENT_TEMPLATES_URI . 'assets/images/logo.svg' ),
						'plugin_name' => __( 'Starter Templates', 'astra-sites' ),
						'nps_rating_message' => __( 'How likely are you to recommend #pluginname to your friends or colleagues?', 'astra-sites' ),

						// Step 2A i.e. positive.
						'feedback_title' => __( 'Thanks a lot for your feedback! 😍', 'astra-sites' ),
						'feedback_content' => __( 'Could you please do us a favor and give us a 5-star rating on WordPress? It would help others choose Starter Templates with confidence. Thank you!', 'astra-sites' ),
						'plugin_rating_link' => esc_url( 'https://wordpress.org/support/plugin/astra-sites/reviews/#new-post' ),

						// Step 2B i.e. negative.
						'plugin_rating_title' => __( 'Thank you for your feedback', 'astra-sites' ),
						'plugin_rating_content' => __( 'We value your input. How can we improve your experience?', 'astra-sites' ),
					),
				)
			);
		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	Astra_Sites_Nps_Notice::get_instance();

endif;
