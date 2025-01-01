<?php

namespace WPForms;

/**
 * WPForms Class Loader.
 *
 * @since 1.5.8
 */
class Loader {

	/**
	 * Classes to register.
	 *
	 * @since 1.5.8
	 *
	 * @var array
	 */
	private $classes = [];

	/**
	 * Loader init.
	 *
	 * @since 1.5.8
	 */
	public function init() {

		$this->populate_classes();

		wpforms()->register_bulk( $this->classes );
	}

	/**
	 * Populate the classes to register.
	 *
	 * @since 1.5.8
	 */
	protected function populate_classes() {

		$this->populate_common();
		$this->populate_frontend();
		$this->populate_admin();
		$this->populate_caches();
		$this->populate_fields();
		$this->populate_forms_overview();
		$this->populate_entries();
		$this->populate_builder();
		$this->populate_db();
		$this->populate_migrations();
		$this->populate_capabilities();
		$this->populate_tasks();
		$this->populate_forms();
		$this->populate_smart_tags();
		$this->populate_logger();
		$this->populate_education();
		$this->populate_robots();
		$this->populate_anti_spam();
	}

	/**
	 * Populate common classes.
	 *
	 * @since 1.8.6
	 */
	private function populate_common() {

		$this->classes[] = [
			'name' => 'API',
			'id'   => 'api',
		];

		$this->classes[] = [
			'name' => 'Emails\Summaries',
		];
	}

	/**
	 * Populate the Forms related classes.
	 *
	 * @since 1.6.2
	 */
	private function populate_forms() {

		$this->classes[] = [
			'name' => 'Forms\Preview',
			'id'   => 'preview',
		];

		$this->classes[] = [
			'name' => 'Forms\Token',
			'id'   => 'token',
		];

		$this->classes[] = [
			'name' => 'Forms\Honeypot',
			'id'   => 'honeypot',
		];

		$this->classes[] = [
			'name' => 'Forms\Akismet',
			'id'   => 'akismet',
		];

		$this->classes[] = [
			'name' => 'Forms\Submission',
			'id'   => 'submission',
			'hook' => false,
			'run'  => false,
		];

		$this->classes[] = [
			'name' => 'Forms\Locator',
			'id'   => 'locator',
		];

		$this->classes[] = [
			'name' => 'Forms\IconChoices',
			'id'   => 'icon_choices',
		];

		$this->classes[] = [
			'name' => 'Forms\AntiSpam',
			'id'   => 'anti_spam',
		];
	}

	/**
	 * Populate Frontend related classes.
	 *
	 * @since 1.8.1
	 */
	private function populate_frontend() {

		$this->classes[] = [
			'name' => 'Frontend\Amp',
			'id'   => 'amp',
		];

		$this->classes[] = [
			'name' => 'Frontend\Captcha',
			'id'   => 'captcha',
		];

		$this->classes[] = [
			'name' => 'Frontend\CSSVars',
			'id'   => 'css_vars',
		];

		$this->classes[] = [
			'name' => 'Frontend\Classic',
			'id'   => 'frontend_classic',
		];

		$this->classes[] = [
			'name' => 'Frontend\Modern',
			'id'   => 'frontend_modern',
		];

		$this->classes[] = [
			'name' => 'Frontend\Frontend',
			'id'   => 'frontend',
		];
	}

	/**
	 * Populate Admin related classes.
	 *
	 * @since 1.6.0
	 */
	private function populate_admin() {

		array_push(
			$this->classes,
			[
				'name' => 'Admin\Notice',
				'id'   => 'notice',
			],
			[
				'name' => 'Admin\Revisions',
				'id'   => 'revisions',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Addons\AddonsCache',
				'id'   => 'addons_cache',
			],
			[
				'name' => 'Admin\CoreInfoCache',
				'id'   => 'core_info_cache',
			],
			[
				'name' => 'Admin\Addons\Addons',
				'id'   => 'addons',
			],
			[
				'name' => 'Admin\AdminBarMenu',
				'hook' => 'init',
			],
			[
				'name' => 'Admin\Notifications\Notifications',
				'id'   => 'notifications',
			],
			[
				'name' => 'Admin\Entries\Handler',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Pages\Templates',
				'id'   => 'templates_page',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Forms\UserTemplates',
				'id'   => 'user_templates',
			],
			[
				'name' => 'Admin\Forms\Page',
				'id'   => 'forms_overview',
			],
			[
				'name' => 'Admin\Challenge',
				'id'   => 'challenge',
			],
			[
				'name' => 'Admin\FormEmbedWizard',
				'hook' => 'admin_init',
				'id'   => 'form_embed_wizard',
			],
			[
				'name' => 'Admin\SiteHealth',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Settings\ModernMarkup',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Settings\Email',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Settings\Captcha\Page',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Settings\Payments',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Tools\Tools',
				'hook' => 'current_screen',
			],
			[
				'name' => 'Admin\Payments\Payments',
				'hook' => 'init',
			],
			[
				'name'      => 'Admin\Payments\Views\Overview\Ajax',
				'hook'      => 'admin_init',
				'run'       => 'hooks',
				'condition' => wpforms_is_admin_ajax(),
			],
			[
				'name'      => 'Admin\Tools\Importers',
				'hook'      => 'admin_init',
				'run'       => 'load',
				'condition' => wp_doing_ajax(),
			],
			[
				'name' => 'Admin\Pages\Addons',
				'id'   => 'addons_page',
			],
			[
				'name' => 'Admin\Pages\ConstantContact',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Forms\Fields\Richtext\EntryViewContent',
			],
			[
				'name' => 'Admin\DashboardWidget',
				'hook' => wpforms()->is_pro() ? 'admin_init' : 'init',
			],
			[
				'name' => 'Emails\Preview',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Addons\GoogleSheets',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\PluginList',
				'id'   => 'plugin_list',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Splash\SplashScreen',
				'id'   => 'splash_screen',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Splash\SplashCache',
				'id'   => 'splash_cache',
				'hook' => 'plugins_loaded',
			],
			[
				'name' => 'Admin\Splash\SplashUpgrader',
				'id'   => 'splash_upgrader',
				'hook' => 'plugins_loaded',
			]
		);
	}

	/**
	 * Populate Caches related classes.
	 *
	 * @since 1.8.7
	 */
	private function populate_caches() {

		array_push(
			$this->classes,
			[
				'name' => 'LicenseApi\PluginUpdateCache',
				'id'   => 'license_api_plugin_update_cache',
			],
			[
				'name' => 'LicenseApi\PluginInfoCache',
				'id'   => 'license_api_plugin_info_cache',
			],
			[
				'name' => 'LicenseApi\ValidateKeyCache',
				'id'   => 'license_api_validate_key_cache',
			]
		);
	}

	/**
	 * Populate Fields related classes.
	 *
	 * @since 1.8.2
	 */
	private function populate_fields() {

		$this->classes[] = [
			'name' => 'Forms\Fields\PaymentCheckbox\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\PaymentMultiple\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\PaymentSelect\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\PaymentSingle\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\PaymentTotal\Field',
			'hook' => 'init',
		];

		// Load custom captcha field class.
		$this->classes[] = [
			'name' => 'Forms\Fields\CustomCaptcha\Field',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Layout\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Layout\Process',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Layout\Notifications',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Repeater\Field',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Repeater\Process',
			'id'   => 'repeater_process',
			'hook' => 'init',
		];

		$this->classes[] = [
			'name' => 'Forms\Fields\Repeater\Notifications',
			'hook' => 'init',
		];
	}

	/**
	 * Populate Forms Overview admin page related classes.
	 *
	 * @since 1.7.5
	 */
	private function populate_forms_overview() {

		if ( ! wpforms_is_admin_page( 'overview' ) && ! wpforms_is_admin_ajax() ) {
			return;
		}

		array_push(
			$this->classes,
			[
				'name' => 'Admin\Forms\Ajax\Columns',
				'id'   => 'forms_columns_ajax',
			],
			[
				'name' => 'Admin\Forms\Ajax\Tags',
				'id'   => 'forms_tags_ajax',
			],
			[
				'name' => 'Admin\Forms\Search',
				'id'   => 'forms_search',
			],
			[
				'name' => 'Admin\Forms\Views',
				'id'   => 'forms_views',
			],
			[
				'name' => 'Admin\Forms\BulkActions',
				'id'   => 'forms_bulk_actions',
			],
			[
				'name' => 'Admin\Forms\Tags',
				'id'   => 'forms_tags',
			]
		);
	}

	/**
	 * Populate Entries related classes.
	 *
	 * @since 1.8.6
	 */
	private function populate_entries() {

		array_push(
			$this->classes,
			[
				'name' => 'Admin\Entries\PageOptions',
				'id'   => 'entries_page_options',
			],
			[
				'name' => 'Admin\Entries\Page',
				'id'   => 'entries_list_page',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Entries\Overview\Page',
				'id'   => 'entries_overview',
			],
			[
				'name'      => 'Admin\Entries\Overview\Ajax',
				'hook'      => 'admin_init',
				'run'       => 'hooks',
				'condition' => wpforms_is_admin_ajax(),
			],
			[
				'name' => 'Admin\Entries\Ajax\Columns',
				'id'   => 'entries_columns_ajax',
			],
			[
				'name' => 'Admin\Entries\Edit',
				'id'   => 'entries_edit',
				'hook' => 'admin_init',
			],
			[
				'name' => 'Admin\Entries\Export\Export',
			],
			[
				'name' => 'Admin\Entries\DefaultScreen',
				'hook' => 'admin_init',
			]
		);
	}

	/**
	 * Populate Form Builder related classes.
	 *
	 * @since 1.6.8
	 */
	private function populate_builder() {

		array_push(
			$this->classes,
			[
				'name' => 'Admin\Builder\HelpCache',
				'id'   => 'builder_help_cache',
			],
			[
				'name' => 'Admin\Builder\Help',
				'id'   => 'builder_help',
			],
			[
				'name' => 'Admin\Builder\Shortcuts',
			],
			[
				'name' => 'Admin\Builder\TemplatesCache',
				'id'   => 'builder_templates_cache',
			],
			[
				'name' => 'Admin\Builder\TemplateSingleCache',
				'id'   => 'builder_template_single',
			],
			[
				'name' => 'Admin\Builder\Templates',
				'id'   => 'builder_templates',
			],
			[
				'name' => 'Admin\Builder\AntiSpam',
				'hook' => 'wpforms_builder_init',
			],
			[
				'name' => 'Admin\Builder\Settings\Themes',
				'hook' => 'wpforms_builder_init',
			],
			[
				'name' => 'Admin\Builder\Notifications\Advanced\EmailTemplate',
				'hook' => 'wpforms_builder_init',
			],
			[
				'name' => 'Admin\Builder\ContextMenu',
				'hook' => 'wpforms_builder_init',
				'id'   => 'context_menu',
			],
			[
				'name' => 'Admin\Builder\Notifications\Advanced\Settings',
			],
			[
				'name' => 'Admin\Builder\Notifications\Advanced\FileUploadAttachment',
			],
			[
				'name' => 'Admin\Builder\Notifications\Advanced\EntryCsvAttachment',
			],
			[
				'name' => 'Admin\Builder\Ajax\PanelLoader',
			],
			[
				'name' => 'Admin\Builder\Addons',
			]
		);
	}

	/**
	 * Populate database classes.
	 *
	 * @since 1.8.2
	 */
	private function populate_db() {

		$this->classes[] = [
			'name' => 'Db\Payments\Payment',
			'id'   => 'payment',
			'hook' => false,
			'run'  => false,
		];

		$this->classes[] = [
			'name' => 'Db\Payments\Meta',
			'id'   => 'payment_meta',
			'hook' => false,
			'run'  => false,
		];

		$this->classes[] = [
			'name' => 'Db\Payments\Queries',
			'id'   => 'payment_queries',
			'hook' => false,
			'run'  => false,
		];
	}

	/**
	 * Populate migration classes.
	 *
	 * @since 1.5.9
	 */
	private function populate_migrations() {

		$this->classes[] = [
			'name' => 'Migrations\Migrations',
			'hook' => 'plugins_loaded',
		];
	}

	/**
	 * Populate access management (capabilities) classes.
	 *
	 * @since 1.5.8
	 */
	private function populate_capabilities() {

		array_push(
			$this->classes,
			[
				'name' => 'Access\Capabilities',
				'id'   => 'access',
				'hook' => 'plugins_loaded',
			],
			[
				'name' => 'Access\Integrations',
			],
			[
				'name'      => 'Admin\Settings\Access',
				'condition' => is_admin(),
			]
		);
	}

	/**
	 * Populate tasks related classes.
	 *
	 * @since 1.5.9
	 */
	private function populate_tasks() {

		array_push(
			$this->classes,
			[
				'name' => 'Tasks\Tasks',
				'id'   => 'tasks',
				'hook' => 'init',
			],
			[
				'name' => 'Tasks\Meta',
				'id'   => 'tasks_meta',
				'hook' => false,
				'run'  => false,
			]
		);
	}

	/**
	 * Populate smart tags loaded classes.
	 *
	 * @since 1.6.7
	 */
	private function populate_smart_tags() {

		$this->classes[] = [
			'name' => 'SmartTags\SmartTags',
			'id'   => 'smart_tags',
			'run'  => 'hooks',
		];
	}

	/**
	 * Populate logger loaded classes.
	 *
	 * @since 1.6.3
	 */
	private function populate_logger() {

		$this->classes[] = [
			'name' => 'Logger\Log',
			'id'   => 'log',
			'hook' => false,
			'run'  => 'hooks',
		];
	}

	/**
	 * Populate education related classes.
	 *
	 * @since 1.6.6
	 */
	private function populate_education() {

		// Kill switch.

		/**
		 * Filters admin education status.
		 *
		 * @since 1.6.6
		 *
		 * @param bool $status Current admin education status.
		 *
		 * @return bool
		 */
		if ( ! apply_filters( 'wpforms_admin_education', true ) ) { // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName
			return;
		}

		// Education core classes.
		array_push(
			$this->classes,
			[
				'name' => 'Admin\Education\Core',
				'id'   => 'education',
			],
			[
				'name' => 'Admin\Education\Fields',
				'id'   => 'education_fields',
			],
			[
				'name' => 'Admin\Education\Admin\Settings\SMTP',
				'id'   => 'education_smtp_notice',
			],
			[
				'name' => 'Admin\Education\Admin\EditPost',
				'hook' => 'load-edit.php',
			],
			[
				'name' => 'Admin\Education\Admin\EditPost',
				'hook' => 'load-post-new.php',
			],
			[
				'name' => 'Admin\Education\Admin\EditPost',
				'hook' => 'load-post.php',
			],
			[
				'name'     => 'Admin\Education\Pointers\Payment',
				'hook'     => 'admin_init',
				'priority' => 20,
			]
		);

		// Education features classes.
		$features = [
			'LiteConnect',
			'Builder\Calculations',
			'Builder\Captcha',
			'Builder\Fields',
			'Builder\Settings',
			'Builder\Providers',
			'Builder\Payments',
			'Builder\DidYouKnow',
			'Builder\Geolocation',
			'Builder\Confirmations',
			'Builder\Notifications',
			'Admin\DidYouKnow',
			'Admin\Settings\Integrations',
			'Admin\Settings\Geolocation',
			'Admin\NoticeBar',
			'Admin\Entries\Geolocation',
			'Admin\Entries\UserJourney',
		];

		foreach ( $features as $feature ) {
			$this->classes[] = [
				'name' => 'Admin\Education\\' . $feature,
			];
		}
	}

	/**
	 * Populate robots loaded class.
	 *
	 * @since 1.7.0
	 */
	private function populate_robots() {

		$this->classes[] = [
			'name' => 'Robots',
			'run'  => 'hooks',
		];
	}

	/**
	 * Populate AntiSpam loaded classes.
	 *
	 * @since 1.7.8
	 */
	private function populate_anti_spam() {

		array_push(
			$this->classes,
			[
				'name' => 'AntiSpam\CountryFilter',
				'id'   => 'antispam_country_filter',
				'hook' => 'init',
			],
			[
				'name' => 'AntiSpam\KeywordFilter',
				'id'   => 'antispam_keyword_filter',
				'hook' => 'init',
			],
			[
				'name' => 'AntiSpam\SpamEntry',
				'id'   => 'spam_entry',
				'hook' => 'init',
			]
		);
	}
}
