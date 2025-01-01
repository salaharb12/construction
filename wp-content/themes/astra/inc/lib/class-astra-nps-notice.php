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

if ( ! class_exists( 'Astra_Nps_Notice' ) ) {

	/**
	 * Admin
	 */
	class Astra_Nps_Notice {
		/**
		 * Instance
		 *
		 * @since 1.0.0
		 * @var (Object) Astra_Nps_Notice
		 */
		private static $instance = null;

		/**
		 * Constructor.
		 *
		 * @since 1.0.0
		 */
		private function __construct() {

			// Allow users to disable NPS survey via a filter && return early if the user does not have admin access.
			if ( ! current_user_can( 'manage_options' ) || apply_filters( 'astra_nps_survey_disable', false ) ) {
				return;
			}

			// Added filter to allow overriding the URL externally.
			add_filter( 'nps_survey_build_url', static function( $url ) {
				return get_template_directory_uri() . '/inc/lib/nps-survey/dist/';
			} );

			// Bail early if soft while labeling is enabled.
			if (
				defined( 'ASTRA_EXT_VER' ) &&
				is_callable( 'Astra_Ext_White_Label_Markup::get_whitelabel_string' ) &&
				'astra' !== strtolower( Astra_Ext_White_Label_Markup::get_whitelabel_string( 'astra', 'name', 'astra' ) )
			) {
				return;
			}

			// Return if white labelled is enabled.
			if ( astra_is_white_labelled() ) {
				return;
			}

			add_action( 'admin_footer', array( $this, 'render_astra_nps_survey' ), 999 );

		}

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
		 * Render NPS Survey
		 *
		 * @return void
		 */
		public function render_astra_nps_survey(): void {

			$current_screen = get_current_screen();
		
			// Defining the astra allowed screens.
			$allowed_screens = [
				'toplevel_page_astra',
				'astra_page_theme-builder-free',
				'astra_page_theme-builder',
			];
		
			// Checking if we're on one of the specified screens
			if ( ! in_array( $current_screen->id, $allowed_screens ) ) {
				return;
			}
		
			Nps_Survey::show_nps_notice(
				'nps-survey-astra',
				array(
					'show_if' => defined( 'ASTRA_THEME_VERSION' ),
					'dismiss_timespan' => 2 * WEEK_IN_SECONDS,
					'display_after' => get_option('astra_nps_show') ? 0 : 2 * WEEK_IN_SECONDS,
					'plugin_slug' => 'astra',
					'show_on_screens' => $allowed_screens,
					'message' => array(
						// Step 1 i.e rating input.
						'logo' => esc_url( ASTRA_THEME_URI . 'inc/assets/images/astra-logo.svg'),
						'plugin_name' => __( 'Astra', 'astra' ),
						'nps_rating_message' => __( 'How likely are you to recommend #pluginname to your friends or colleagues?', 'astra' ),

						// Step 2A i.e. positive.
						'feedback_title' => __( 'Thanks a lot for your feedback! 😍', 'astra' ),
						'feedback_content' => __( 'Could you please do us a favor and give us a 5-star rating on WordPress? It would help others choose Astra with confidence. Thank you!', 'astra' ),
						'plugin_rating_link' => esc_url( 'https://wordpress.org/support/theme/astra/reviews/#new-post' ),
						'plugin_rating_button_string' => __( 'Rate the Theme', 'astra' ),

						// Step 2B i.e. negative.
						'plugin_rating_title' => __( 'Thank you for your feedback', 'astra' ),
						'plugin_rating_content' => __( 'We value your input. How can we improve your experience?', 'astra' ),
					),
				)
			);
		}

	}

	/**
	 * Kicking this off by calling 'get_instance()' method
	 */
	Astra_Nps_Notice::get_instance();

}
