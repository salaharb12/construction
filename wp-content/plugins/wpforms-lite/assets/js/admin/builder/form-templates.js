/* global List, wpforms_form_templates, wpforms_addons, wpf, WPFormsUtils */

/**
 * @param wpforms_form_templates.admin_nonce
 * @param wpforms_form_templates.delete_template
 * @param wpforms_form_templates.delete_template_content
 * @param wpforms_form_templates.delete_template_title
 * @param wpforms_form_templates.template_addon_activate
 * @param wpforms_form_templates.template_addon_prompt
 * @param wpforms_form_templates.template_addons_error
 * @param wpforms_form_templates.template_addons_prompt
 * @param wpforms_form_templates.use_template
 */

// noinspection ES6ConvertVarToLetConst
/**
 * Form Templates function.
 *
 * @since 1.7.7
 */

// eslint-disable-next-line no-var
var WPFormsFormTemplates = window.WPFormsFormTemplates || ( function( document, window, $ ) {
	/**
	 * Runtime variables.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	const vars = {};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.7.7
		 */
		init() {
			$( app.ready );
			$( window ).on( 'load', function() {
				// in the case of jQuery 3.+ we need to wait for the `ready` event first.
				if ( typeof $.ready.then === 'function' ) {
					$.ready.then( app.load );
				} else {
					app.load();
				}
			} );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.7.7
		 */
		ready() {
			app.events();
		},

		/**
		 * Window load.
		 *
		 * @since 1.7.7
		 */
		load() {
			app.showUpgradeBanner();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.7.7
		 */
		setup() {
			// Trigger event before initializing the template list.
			WPFormsUtils.triggerEvent( $( document ), 'wpformsSetupPanelBeforeInitTemplatesList' );

			// Template list object.
			vars.templateList = new List( 'wpforms-setup-templates-list', {
				valueNames: [
					'wpforms-template-name',
					'wpforms-template-desc',
					{
						name: 'fields',
						attr: 'data-fields',
					},
					{
						name: 'slug',
						attr: 'data-slug',
					},
					{
						name: 'categories',
						attr: 'data-categories',
					},
					{
						name: 'subcategories',
						attr: 'data-subcategories',
					},
					{
						name: 'has-access',
						attr: 'data-has-access',
					},
					{
						name: 'favorite',
						attr: 'data-favorite',
					},
				],
			} );
		},

		/**
		 * Bind events.
		 *
		 * @since 1.7.7
		 */
		events() {
			$( document )
				.on( 'click', '#wpforms-setup-templates-list .wpforms-template-favorite i', app.selectFavorite )
				.on( 'click', '#wpforms-setup-templates-list .wpforms-template-remove i', app.removeTemplate );
		},

		/**
		 * Select Favorite Templates.
		 *
		 * @since 1.7.7
		 */
		// eslint-disable-next-line max-lines-per-function
		selectFavorite() {
			const $heartIcon = $( this ),
				favorite = $heartIcon.hasClass( 'fa-heart-o' ),
				$favorite = $heartIcon.closest( '.wpforms-template-favorite' ),
				$template = $heartIcon.closest( '.wpforms-template' ),
				$templateName = $template.find( '.wpforms-template-name' ),
				templateSlug = $template.find( '.wpforms-template-select' ).data( 'slug' ),
				$favoritesCategory = $( '.wpforms-setup-templates-categories' ).find( '[data-category=\'favorites\']' ),
				$favoritesCount = $favoritesCategory.find( 'span' ),
				data = {
					action: 'wpforms_templates_favorite',
					slug: templateSlug,
					favorite,
					nonce: wpforms_form_templates.nonce,
				};

			let favoritesCount = parseInt( $favoritesCount.html(), 10 );

			const item = vars.templateList.get( 'slug', templateSlug )[ 0 ],
				values = item.values();

			const toggleHeartIcon = function() {
				$favorite.find( '.fa-heart-o' ).toggleClass( 'wpforms-hidden', values.favorite );
				$favorite.find( '.fa-heart' ).toggleClass( 'wpforms-hidden', ! values.favorite );
			};

			const unMarkFavorite = function() {
				values.favorite = false;
				favoritesCount = favoritesCount - 1;

				item.values( values );

				toggleHeartIcon();
				$templateName.data( 'data-favorite', 0 );
				$favoritesCount.html( favoritesCount );

				app.maybeHideFavoritesCategory();
			};

			const markFavorite = function() {
				values.favorite = true;
				favoritesCount = favoritesCount + 1;

				item.values( values );

				toggleHeartIcon();
				$templateName.data( 'data-favorite', 1 );
				$favoritesCount.html( favoritesCount );

				app.maybeHideFavoritesCategory();
			};

			$.post( wpforms_form_templates.ajaxurl, data, function( res ) {
				if ( ! res.success ) {
					if ( favorite ) {
						unMarkFavorite();

						return;
					}

					markFavorite();
				}
			} );

			if ( favorite ) {
				markFavorite();

				return;
			}

			unMarkFavorite();
		},

		/**
		 * Remove Template.
		 *
		 * @since 1.8.8
		 */
		removeTemplate() {
			const $trashIcon = $( this ),
				$template = $trashIcon.closest( '.wpforms-template-remove' ),
				$templateId = $template.data( 'template' );

			$.alert( {
				title: wpforms_form_templates.delete_template_title,
				content: wpforms_form_templates.delete_template_content,
				icon: 'fa fa-exclamation-circle',
				type: 'red',
				buttons: {
					confirm: {
						text: wpforms_form_templates.delete_template,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							app.removeUserTemplate( $templateId );
						},
					},
					cancel: {
						text: wpforms_form_templates.cancel,
					},
				},
			} );
		},

		/**
		 * Remove User Template.
		 *
		 * @since 1.8.8
		 *
		 * @param {number} templateId Template ID.
		 */
		removeUserTemplate( templateId ) {
			vars.templateList.remove( 'slug', 'wpforms-user-template-' + templateId );

			$.post( wpforms_form_templates.ajaxurl, {
				action: 'wpforms_user_template_remove',
				template: templateId,
				nonce: wpforms_form_templates.nonce,
			}, function( res ) {
				if ( res.success ) {
					$( '#wpforms-template-wpforms-user-template-' + templateId ).remove();

					app.updateCategoryCount( 'all' );
					app.updateCategoryCount( 'user' );
				}
			} );
		},

		/**
		 * Update category count.
		 *
		 * @since 1.8.8
		 *
		 * @param {string} category Category name.
		 */
		updateCategoryCount( category ) {
			const categoriesList = $( '.wpforms-setup-templates-categories' ),
				$category = categoriesList.find( `[data-category='${ category }']` ),
				$count = $category.find( 'span' ),
				count = parseInt( $count.html(), 10 );

			$count.html( count - 1 );
			$category.data( 'count', count - 1 );

			if ( count - 1 === 0 && category === 'user' && $category.hasClass( 'active' ) ) {
				$( '.wpforms-user-templates-empty-state' ).removeClass( 'wpforms-hidden' );
			}
		},

		/**
		 * Maybe hide favorites category if there are no templates.
		 *
		 * @since 1.7.7
		 */
		maybeHideFavoritesCategory() {
			const $categoriesList = $( '.wpforms-setup-templates-categories' ),
				$favoritesCategory = $categoriesList.find( '[data-category=\'favorites\']' ),
				favoritesCount = parseInt( $favoritesCategory.find( 'span' ).html(), 10 );

			$favoritesCategory.toggleClass( 'wpforms-hidden', ! favoritesCount );

			if ( $favoritesCategory.hasClass( 'active' ) ) {
				if ( ! favoritesCount ) {
					$categoriesList.find( '[data-category=\'all\']' ).trigger( 'click' );

					return;
				}

				$favoritesCategory.trigger( 'click' );
			}
		},

		/**
		 * Search template callback.
		 *
		 * @since 1.7.7
		 */
		searchTemplate() {
			app.performSearch( $( this ).val() );
			app.showUpgradeBanner();
		},

		/**
		 * Perform search value.
		 *
		 * @since 1.7.7.2
		 *
		 * @param {string} query Value to search.
		 */
		performSearch( query ) {
			const searchResult = vars.templateList.search( query, [ 'name' ], function( searchString ) {
				for ( let index = 0, length = vars.templateList.items.length; index < length; index++ ) {
					const values = vars.templateList.items[ index ].values();
					const templateName = values[ 'wpforms-template-name' ].toLowerCase();
					const templateDesc = values[ 'wpforms-template-desc' ].toLowerCase();
					const fields = values.fields.toLowerCase();
					const searchRegex = new RegExp( searchString );

					vars.templateList.items[ index ].found = searchRegex.test( templateName ) || searchRegex.test( templateDesc ) || searchRegex.test( fields );
				}
			} );

			$( '.wpforms-templates-no-results' ).toggle( ! searchResult.length );
		},

		/**
		 * Select subcategory.
		 *
		 * @since 1.8.4
		 *
		 * @param {Object} e Event object.
		 */
		selectSubCategory( e ) {
			e.preventDefault();

			const $item = $( this );
			const $activeCategory = $item.parent( 'ul' ).parent( 'li' ).parent( 'ul' ).children( 'li.active' );
			const $activeSubcategory = $( '.wpforms-setup-templates-subcategories li.active' );
			const subcategory = $item.data( 'subcategory' );
			const category = $item.parents( 'li' ).data( 'category' );
			const searchQuery = $( '#wpforms-setup-template-search' ).val();

			// Clear active class from the parent category and current subcategory.
			$activeSubcategory.removeClass( 'active' );
			$activeCategory.removeClass( 'active' );

			// Add active class to the parent category and current subcategory.
			$item.parents( 'li' ).addClass( 'active' );
			$item.addClass( 'active' );

			vars.templateList.filter( function( item ) {
				return category === 'all' || ( item.values().categories.split( ',' ).indexOf( category ) > -1 && item.values().subcategories.split( ',' ).indexOf( subcategory ) > -1 );
			} );

			if ( searchQuery !== '' ) {
				app.performSearch( searchQuery );
			}

			app.showUpgradeBanner();
		},

		/**
		 * Select category.
		 *
		 * @since 1.7.7
		 *
		 * @param {Object} e Event object.
		 */
		selectCategory( e ) {
			e.preventDefault();

			const $item = $( this ).parent(),
				$active = $item.closest( 'ul' ).find( '.active' ),
				category = $item.data( 'category' ),
				count = $item.data( 'count' ),
				searchQuery = $( '#wpforms-setup-template-search' ).val();

			$active.removeClass( 'active' );
			$item.addClass( 'active opened' );

			vars.templateList.filter( function( item ) {
				if ( category === 'available' ) {
					return item.values()[ 'has-access' ];
				}

				if ( category === 'favorites' ) {
					return item.values().favorite;
				}

				return category === 'all' || item.values().categories.split( ',' ).indexOf( category ) > -1;
			} );

			// Display/hide User Templates empty state message.
			$( '.wpforms-user-templates-empty-state' ).toggleClass( 'wpforms-hidden', category !== 'user' || count !== 0 );

			if ( searchQuery !== '' ) {
				app.performSearch( searchQuery );
			}

			app.showUpgradeBanner();
		},

		/**
		 * Show/hide the subcategory list by clicking on the chevron icon.
		 *
		 * @since 1.8.7
		 *
		 * @param {Object} e Event object.
		 */
		toggleSubcategoriesList( e ) {
			e.stopPropagation();

			const $item = $( this ).parent().parent();

			$item.toggleClass( 'opened' );
		},

		/**
		 * Cancel button click routine.
		 *
		 * @since 1.7.7
		 */
		selectTemplateCancel( ) {
			const $template = $( '#wpforms-setup-templates-list' ).find( '.wpforms-template.active' ),
				$button = $template.find( '.wpforms-template-select' );

			$template.removeClass( 'active' );
			$button.html( $button.data( 'labelOriginal' ) );
		},

		/**
		 * Show upgrade banner if a license type is less than Pro.
		 *
		 * @since 1.7.7
		 */
		showUpgradeBanner() {
			if ( ! $( '#tmpl-wpforms-templates-upgrade-banner' ).length ) {
				return;
			}

			const template = wp.template( 'wpforms-templates-upgrade-banner' );

			if ( ! template ) {
				return;
			}

			const $templates = $( '#wpforms-setup-templates-list .wpforms-template' );

			if ( $templates.length > 5 ) {
				$templates.eq( 5 ).after( template() );

				return;
			}

			$templates.last().after( template() );
		},

		/**
		 * Select template.
		 *
		 * @since 1.8.2
		 *
		 * @param {string}   formName Name of the form.
		 * @param {string}   template Template slug.
		 * @param {jQuery}   $button  Use a template button object.
		 * @param {Function} callback The function to set the template.
		 */
		selectTemplateProcess( formName, template, $button, callback ) {
			if ( $button.data( 'addons' ) ) {
				app.addonsModal( formName, template, $button, callback );

				return;
			}

			callback( formName, template );
		},

		/**
		 * Open required addons alert.
		 *
		 * @since 1.8.2
		 *
		 * @param {string}   formName Name of the form.
		 * @param {string}   template Template slug.
		 * @param {jQuery}   $button  Use a template button object.
		 * @param {Function} callback The function to set the template.
		 */
		addonsModal( formName, template, $button, callback ) {
			const templateName = $button.data( 'template-name-raw' );
			const addonsNames = $button.data( 'addons-names' );
			const addonsSlugs = $button.data( 'addons' );
			const installedSlugs = $button.data( 'installed' );
			const addons = addonsSlugs.split( ',' );

			let prompt;

			switch ( app.action( addons, installedSlugs ) ) {
				case 'multiple':
					prompt = wpforms_form_templates.template_addons_prompt;
					break;
				case 'activate':
					prompt = wpforms_form_templates.template_addon_activate;
					break;
				case 'install':
					prompt = wpforms_form_templates.template_addon_prompt;
					break;
				default:
					prompt = wpforms_form_templates.template_addons_prompt;
					break;
			}

			prompt = prompt.replace( /%template%/g, templateName ).replace( /%addons%/g, addonsNames );

			if ( ! addons.length ) {
				return;
			}

			if ( ! wpforms_form_templates.can_install_addons ) {
				app.userCannotInstallAddonsModal( prompt );

				return;
			}

			app.userCanInstallAddonsModal( formName, template, addons, prompt, callback, installedSlugs );
		},

		/**
		 * Open the template addon alert for admins.
		 *
		 * @since 1.8.2
		 *
		 * @param {string}   formName       Name of the form.
		 * @param {string}   template       Template slug.
		 * @param {Array}    addons         Array of addon slugs.
		 * @param {string}   prompt         Modal content.
		 * @param {Function} callback       The function to set the template.
		 * @param {string}   installedSlugs Installed slug.
		 */
		userCanInstallAddonsModal( formName, template, addons, prompt, callback, installedSlugs = '' ) {
			const spinner = '<i class="wpforms-loading-spinner wpforms-loading-white wpforms-loading-inline"></i>';

			let confirm;

			switch ( app.action( addons, installedSlugs ) ) {
				case 'multiple':
				case 'install':
					confirm = wpforms_form_templates.install_confirm;
					break;
				case 'activate':
					confirm = wpforms_form_templates.activate_confirm;
					break;
				default:
					confirm = wpforms_form_templates.install_confirm;
					break;
			}

			$.confirm( {
				title: wpforms_form_templates.heads_up,
				content: prompt,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: confirm,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							this.$$confirm
								.prop( 'disabled', true )
								.html( spinner + wpforms_form_templates.activating );

							this.$$cancel
								.prop( 'disabled', true );

							app.installActivateAddons( addons, this, formName, template, callback );

							return false;
						},
					},
					cancel: {
						text: wpforms_form_templates.cancel,
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
						},
					},
				},
			} );
		},

		/**
		 * Get the action for the addons.
		 *
		 * @since 1.9.0
		 *
		 * @param {Array}  addons    Addons slugs.
		 * @param {string} installed Installed addon slug.
		 *
		 * @return {string} Action.
		 */
		action( addons, installed = '' ) {
			if ( addons.length > 1 ) {
				return 'multiple';
			}

			if ( installed.split( ',' ).indexOf( addons[ 0 ] ) > -1 ) {
				return 'activate';
			}

			return 'install';
		},

		/**
		 * Open the template addon alert for non-admins.
		 *
		 * @since 1.8.2
		 *
		 * @param {string} prompt Modal content.
		 */
		userCannotInstallAddonsModal( prompt ) {
			$.alert( {
				title: wpforms_form_templates.heads_up,
				content: prompt,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					ok: {
						text: wpforms_form_templates.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							WPFormsFormTemplates.selectTemplateCancel();
						},
					},
				},
			} );
		},

		/**
		 * Install & Activate addons via AJAX.
		 *
		 * @since 1.8.2
		 *
		 * @param {Array}    addons        Addons slugs.
		 * @param {Object}   previousModal Previous modal instance.
		 * @param {string}   formName      Name of the form.
		 * @param {string}   template      Template slug.
		 * @param {Function} callback      The function to set the template.
		 */
		installActivateAddons( addons, previousModal, formName, template, callback ) {
			const ajaxResults = [];
			const ajaxErrors = [];
			let promiseChain = false;

			// Put each of the ajax call promises to the chain.
			addons.forEach( function( addon ) {
				if ( typeof promiseChain.done !== 'function' ) {
					promiseChain = app.installActivateAddonAjax( addon );

					return;
				}

				promiseChain = promiseChain
					.done( function( value ) {
						ajaxResults.push( value );

						return app.installActivateAddonAjax( addon );
					} )
					.fail( function( error ) {
						ajaxErrors.push( error );
					} );
			} );

			promiseChain

				// Latest promise result and error.
				.done( function( value ) {
					ajaxResults.push( value );
				} )
				.fail( function( error ) {
					ajaxErrors.push( error );
				} )

				// Finally, resolve all the promises.
				.always( function() {
					previousModal.close();

					if (
						ajaxResults.length > 0 &&
						wpf.listPluck( ajaxResults, 'success' ).every( Boolean ) && // Check if every `success` is true.
						ajaxErrors.length === 0
					) {
						callback( formName, template );

						return;
					}

					app.installActivateAddonsError( formName, template, callback );
				} );
		},

		/**
		 * Install & Activate addons error modal.
		 *
		 * @since 1.8.2
		 *
		 * @param {string}   formName Name of the form.
		 * @param {string}   template Template slug.
		 * @param {Function} callback The function to set the template.
		 */
		installActivateAddonsError( formName, template, callback ) {
			$.confirm( {
				title: wpforms_form_templates.heads_up,
				content: wpforms_form_templates.template_addons_error,
				icon: 'fa fa-exclamation-circle',
				type: 'orange',
				buttons: {
					confirm: {
						text: wpforms_form_templates.use_template,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
						action() {
							callback( formName, template );
						},
					},
					cancel: {
						text: wpforms_form_templates.cancel,
						action() {
							app.selectTemplateCancel();
						},
					},
				},
			} );
		},

		/**
		 * Install & Activate single addon via AJAX.
		 *
		 * @since 1.8.2
		 *
		 * @param {string} addon Addon slug.
		 *
		 * @return {Promise} jQuery ajax call promise.
		 */
		installActivateAddonAjax( addon ) {
			const addonData = wpforms_addons[ addon ];
			const deferred = new $.Deferred();

			if (
				! addonData ||
				[ 'activate', 'install' ].indexOf( addonData.action ) < 0
			) {
				deferred.resolve( false );

				return deferred.promise();
			}

			return $.post(
				wpforms_form_templates.ajaxurl,
				{
					action: 'wpforms_' + addonData.action + '_addon',
					nonce: wpforms_form_templates.admin_nonce,
					plugin: addonData.action === 'activate' ? addon + '/' + addon + '.php' : addonData.url,
				}
			);
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsFormTemplates.init();
