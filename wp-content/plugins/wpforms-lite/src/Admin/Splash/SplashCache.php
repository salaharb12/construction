<?php

namespace WPForms\Admin\Splash;

use WPForms\Helpers\CacheBase;

/**
 * Splash cache handler.
 *
 * @since 1.8.7
 */
class SplashCache extends CacheBase {

	use SplashTrait;

	/**
	 * Remote source URL.
	 *
	 * @since 1.8.7
	 *
	 * @var string
	 */
	const REMOTE_SOURCE = 'https://plugin.wpforms.com/wp-content/splash.json';

	/**
	 * Determine if the class is allowed to load.
	 *
	 * @since 1.8.7
	 *
	 * @return bool
	 */
	protected function allow_load(): bool {

		return is_admin() || wp_doing_cron() || wpforms_doing_wp_cli();
	}

	/**
	 * Provide settings.
	 *
	 * @since 1.8.7
	 *
	 * @return array Settings array.
	 */
	protected function setup(): array {

		return [

			// Remote source URL.
			'remote_source' => $this->get_remote_source(),

			// Splash cache file name.
			'cache_file'    => 'splash.json',

			/**
			 * Time-to-live of the splash cache file in seconds.
			 *
			 * This applies to `uploads/wpforms/cache/splash.json` file.
			 *
			 * @since 1.8.7
			 *
			 * @param integer $cache_ttl Cache time-to-live, in seconds.
			 *                           Default value: WEEK_IN_SECONDS.
			 */
			'cache_ttl'     => (int) apply_filters( 'wpforms_admin_splash_cache_ttl', WEEK_IN_SECONDS ),
		];
	}

	/**
	 * Get remote source URL.
	 *
	 * @since 1.8.7
	 *
	 * @return string
	 */
	protected function get_remote_source(): string {

		return defined( 'WPFORMS_SPLASH_REMOTE_SOURCE' ) ? WPFORMS_SPLASH_REMOTE_SOURCE : self::REMOTE_SOURCE;
	}

	/**
	 * Prepare splash modal data.
	 *
	 * @since 1.8.7
	 *
	 * @param array $data Splash modal data.
	 */
	protected function prepare_cache_data( $data ): array {

		if ( empty( $data ) || ! is_array( $data ) ) {
			return [];
		}

		$blocks = $this->prepare_blocks( $data );

		if ( empty( $blocks ) ) {
			return [];
		}

		$prepared_data['blocks'] = $blocks;

		return $prepared_data;
	}

	/**
	 * Prepare blocks.
	 *
	 * @since 1.8.7
	 *
	 * @param array $data Splash modal data.
	 *
	 * @return array Prepared blocks.
	 */
	private function prepare_blocks( array $data ): array { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		$version = $this->get_splash_data_version();
		$version = $this->get_major_version( $version );

		$latest_version = $this->get_latest_splash_version();

		// If the latest version is empty - set the latest version to the previous WPForms version.
		// This is needed for the first update from the version without the "What's New?" feature.
		$latest_version = empty( $latest_version ) ? $this->get_previous_plugin_version() : $latest_version;

		// If the latest version is bigger than the current - set latest version to current.
		$latest_version = version_compare( $latest_version, $version, '>' ) ? $version : $latest_version;
		$latest_version = $this->get_major_version( $latest_version );

		// Filter data by plugin version.
		$blocks = array_filter(
			$data,
			static function ( $block ) use ( $version, $latest_version ) {

				$block_version = $block['version'] ?? '';

				// If the version is latest - return only blocks with the current version.
				if ( $version === $latest_version ) {
					return version_compare( $block_version, $version, '=' );
				}

				// If the version is not latest - return only blocks between latest and current versions.
				return version_compare( $block_version, $latest_version, '>' ) && version_compare( $block_version, $version, '<=' );
			}
		);

		// Reset indexes.
		$blocks = array_values( $blocks );

		return array_map(
			function ( $block, $index ) { //phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed

				// Prepare buttons URLs.
				$block['buttons'] = $this->prepare_buttons( $block['btns'] ?? [] );

				// Set layout based on image type.
				$block['layout'] = $this->get_block_layout( $block['img'] );

				unset( $block['btns'] );

				return $block;
			},
			$blocks,
			array_keys( $blocks )
		) ?? [];
	}
}
