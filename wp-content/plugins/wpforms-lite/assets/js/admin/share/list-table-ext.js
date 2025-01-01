/* global wpforms_admin */

/**
 * WPForms admin. Extend list tables functionality.
 *
 * @param  wpforms_admin.column_selector_title
 * @param  wpforms_admin.save_changes
 * @param  wpforms_admin.uh_oh
 * @param  wpforms_admin.unknown_error
 * @param  wpforms_admin.column_selector_no_fields
 * @param  wpforms_admin.column_selector_no_meta
 *
 * @since 1.8.6
 */
const WPFormsAdminListTableExt = window.WPFormsAdminListTableExt || ( function( document, window, $ ) {
	/**
	 * Supported pages' CSS selectors.
	 * It is the ids of the `.wpforms-admin-wrap` container, which reflects `page` + `view` URL attributes.
	 *
	 * @since 1.8.6
	 *
	 * @type {Array}
	 */
	const supportedPages = [
		'#wpforms-overview',
		'#wpforms-entries-list',
	];

	/**
	 * Element selectors shared between functions.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const selectors = {
		cogIcon: '#wpforms-list-table-ext-edit-columns-cog',
		submitButton: '#wpforms-list-table-ext-edit-columns-select-submit',
	};

	/**
	 * Elements.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const el = {};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.8.6
	 *
	 * @type {Object}
	 */
	const app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.8.6
		 */
		init() {
			app.initElements();

			el.$doc.on( 'wpformsReady', app.initMultiSelect );

			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.8.6
		 */
		ready() {
			app.prepareTableFootColumns();
			app.initTableScrollColumns();
			app.initTableSortableColumns();
			app.events();
			app.windowResize();
		},

		/**
		 * Events.
		 *
		 * @since 1.8.6
		 */
		events() {
			el.$doc
				.on( 'click', selectors.cogIcon, app.onClickCog )
				.on( 'wpforms_multiselect_checkbox_list_toggle', app.onMenuToggle )
				.on( 'click', selectors.submitButton, app.onSaveChanges );

			el.$tableScroll?.on( 'scroll', app.tableScroll );

			// noinspection TypeScriptUMDGlobal
			$( window ).on( 'resize', _.debounce( app.windowResize, 100 ) );

			el.$searchInput?.on( 'input', _.debounce( app.maybeShowNoResults, 310 ) ); // On 300 ms the multiselect lib is updating the list of items so we need to wait a bit more.
		},

		/**
		 * Init elements.
		 *
		 * @since 1.8.6
		 */
		initElements() {
			el.$doc = $( document );
			el.$header = $( '#wpforms-header' );
			el.$page = $( supportedPages.join( ',' ) );
			el.$table = el.$page.find( '.wp-list-table' );
			el.$tableContainer = el.$table.parent();
			el.$menu = $( '#wpforms-list-table-ext-edit-columns-select-container' );
			el.$cog = app.initCogIcon();
			el.$wpcontent = $( '#wpcontent' );

			// The Forms Overview page has no table container, wrap the table.
			if ( ! el.$tableContainer.hasClass( 'wpforms-table-container' ) ) {
				el.$table.wrap( '<div class="wpforms-table-container"></div>' );
				el.$tableContainer = el.$table.parent();
			}

			// Add specific classes to the page container.
			el.$page.addClass( 'wpforms-list-table-ext-page' );
		},

		/**
		 * Prepare table footer columns. Their IDs should match the IDs of the header columns.
		 *
		 * @since 1.8.6
		 */
		prepareTableFootColumns() {
			el.$table.find( 'thead tr .manage-column' ).each( function() {
				const columnId = $( this ).attr( 'id' );

				el.$table.find( 'tfoot tr .column-' + columnId ).attr( 'id', columnId + '-foot' );
			} );

			// Disable sorting of the cog column.
			el.$table.find( '.manage-column.column-cog' )
				.addClass( 'wpforms-table-cell-sticky' );
		},

		/**
		 * Initialize table columns sortable container.
		 *
		 * @since 1.8.6
		 */
		initTableSortableColumns() { // eslint-disable-line max-lines-per-function
			let $columnCells,
				columnId;

			el.$table.find( 'thead tr, tfoot tr' ).each( function() { // eslint-disable-line max-lines-per-function
				const $sortable = $( this );

				$sortable.sortable( {
					items: '> th:not(:first-child):not(.wpforms-table-cell-sticky)',
					connectWith: '',
					delay: 100,
					opacity: 0.75,
					cursor: 'move',
					cancel: '.wpforms-table-column-not-draggable',
					placeholder: 'wpforms-table-column-drag-placeholder',
					appendTo: el.$page,
					zindex: 10000,
					tolerance: 'intersect',
					distance: 1,
					helper( e, origin ) {
						const $el = $( origin ),
							$helper = $el.clone(),
							width = $el.outerWidth();

						return $helper.css( 'width', width + 'px' );
					},
					start( e, ui ) {
						ui.helper.addClass( 'wpforms-table-column-drag-helper' ); // Add a specific class to the helper container.
						ui.item.addClass( 'wpforms-table-column-dragged-out' ).css( 'display', '' );

						// Disable global scrolling.
						el.$wpcontent.addClass( 'wpforms-no-scroll' );

						columnId = ui.item.attr( 'id' ).replace( '-foot', '' );
					},
					stop( e, ui ) {
						// Remove specific classes from the helper.
						ui.item
							.removeClass( 'wpforms-table-column-drag-helper' )
							.removeClass( 'wpforms-table-column-dragged-out' );

						// Remove previously added vertical placeholder class from all columns.
						el.$table.find( 'thead tr > *, tfoot tr > *' ).removeClass( 'wpforms-table-column-drag-placeholder-prev' );

						// Enable global scrolling.
						el.$wpcontent.removeClass( 'wpforms-no-scroll' );

						const prevColumnId = ui.item.prev().attr( 'id' ).replace( '-foot', '' ),
							$rows = el.$table.find( 'tbody tr:not(.wpforms-hidden)' ),
							prevSelector = prevColumnId !== 'cb' ? '.column-' + prevColumnId : '.check-column';

						// Move column cells.
						$columnCells = $rows.find( 'td.column-' + columnId ).detach();

						for ( let i = 0; i < $columnCells.length; i++ ) {
							$rows.eq( i ).find( prevSelector ).after( $columnCells.eq( i ) );
						}

						// Move opposite column header.
						const oppositeColumnsSelector = ui.item.closest( 'thead' ).length > 0 ? 'tfoot' : 'thead',
							$oppositeColumn = el.$table.find( oppositeColumnsSelector + ' tr .column-' + columnId ).detach();

						el.$table.find( oppositeColumnsSelector + ' tr ' + prevSelector ).after( $oppositeColumn );

						app.updateMenuColumnsOrder();
					},
					change( e, ui ) {
						// Remove previously added vertical placeholder class from all columns.
						el.$table.find( 'thead tr > *, tfoot tr > *' ).removeClass( 'wpforms-table-column-drag-placeholder-prev' );

						// Add the vertical placeholder class to the previous column.
						ui.placeholder.prev().addClass( 'wpforms-table-column-drag-placeholder-prev' );
					},
					update() {
						app.saveColumnsOrder();
					},
				} );
			} );
		},

		/**
		 * Initialize table scroll sticky columns.
		 *
		 * @since 1.8.6
		 */
		initTableScrollColumns() {
			// Init table horizontal scrolling only on the Entries page.
			if ( ! el.$page.is( '#wpforms-entries-list' ) ) {
				return;
			}

			el.$tableScroll = el.$tableContainer;

			// The Entries page has own table container, add the class.
			el.$tableScroll.addClass( 'wpforms-table-scroll' );

			// Detect the Windows OS platform.
			el.$tableScroll.toggleClass( 'wpforms-scrollbar', app.isCustomScrollbarNeeded() );

			// Add specific class to the sticky columns.
			el.$table.find( '.check-column, .column-indicators' )
				.addClass( 'wpforms-table-cell-sticky' )
				.addClass( 'left' );

			el.$table.find( '.column-actions' )
				.addClass( 'wpforms-table-cell-sticky' )
				.addClass( 'right' );
		},

		/**
		 * Table scroll event.
		 *
		 * @since 1.8.6
		 */
		tableScroll() {
			if ( ! el.$tableScroll?.length ) {
				return;
			}

			const width = el.$tableScroll.outerWidth(),
				scrollLeft = Math.abs( el.$tableScroll.get( 0 ).scrollLeft ),
				scrollWidth = el.$tableScroll.get( 0 ).scrollWidth;

			// Conditionally Add shadow to the sticky columns.
			el.$tableScroll
				.find( '.wpforms-table-cell-sticky.left' )
				.toggleClass( 'shadow', scrollLeft > 1 ); // 1px is fix for the RTL mode.

			el.$tableScroll
				.find( '.wpforms-table-cell-sticky.right' )
				.toggleClass( 'shadow', scrollWidth - width >= scrollLeft );
		},

		/**
		 * Window resize event.
		 *
		 * @since 1.8.6
		 */
		windowResize() {
			// Disable dragging on mobiles.
			el.$table.find( 'thead th, tfoot th' ).toggleClass( 'wpforms-table-column-not-draggable', window.innerWidth <= 782 );

			app.closeMenu();
			app.windowResizeToggleColumns();
			app.tableScroll();
		},

		/**
		 * Toggle columns visibility for certain window sizes.
		 *
		 * @since 1.8.6
		 */
		windowResizeToggleColumns() {
			// Proceed only on the Forms Overview page.
			if ( ! el.$page.is( '#wpforms-overview' ) ) {
				return;
			}

			const $visibleColumns = el.$table.find( 'thead tr th:visible' );
			const $columnTags = el.$table.find( '.column-tags' );

			// For browser window with the width between 960px and 1280px.
			if ( window.innerWidth > 960 && window.innerWidth <= 1280 ) {
				$columnTags.toggleClass( 'wpforms-hidden', $visibleColumns.length > 4 );
			} else {
				$columnTags.removeClass( 'wpforms-hidden' );
			}

			// Synchronize menu items visibility.
			el.$menu.find( 'label' ).removeClass( 'wpforms-hidden' );
			el.$table.find( 'thead tr th:not(:visible)' ).each( function() {
				const $column = $( this );

				el.$menu
					.find( `input[value="${ $column.attr( 'id' ) }"]` )
					.closest( 'label' )
					.addClass( 'wpforms-hidden' );
			} );
		},

		/**
		 * Show or hide no results text.
		 *
		 * @since 1.8.6
		 */
		maybeShowNoResults() {
			[ 'fields', 'meta' ].forEach( ( section ) => {
				const labels = el.$menu.find( '.wpforms-multiselect-checkbox-optgroup-' + section )
					.nextUntil( '.wpforms-multiselect-checkbox-optgroup' )
					.filter( 'label' );

				const hiddenLabels = labels.filter( function() {
					return $( this ).is( ':hidden' );
				} );

				el.$menu.find( '.wpforms-multiselect-checkbox-no-results-' + section )
					.toggleClass( 'wpforms-hidden', labels.length !== hiddenLabels.length );
			} );
		},

		/**
		 * Close the columns' selector menu.
		 *
		 * @since 1.8.6
		 */
		closeMenu() {
			if ( ! el.$cog.hasClass( 'active' ) ) {
				return;
			}

			el.$cog.removeClass( 'active' );
			el.$menu.find( '.wpforms-multiselect-checkbox-list' ).removeClass( 'open' );

			// Flush the search input.
			el.$searchInput.val( '' );
			el.$searchInput[ 0 ]?.dispatchEvent( new Event( 'input' ) );
		},

		/**
		 * Get columns order.
		 *
		 * @since 1.8.6
		 *
		 * @return {Array} Columns order.
		 */
		getColumnsOrder() {
			const $row = el.$table.find( 'thead tr' );
			const columns = [];

			$row.find( 'th' ).each( function() {
				columns.push( $( this ).attr( 'id' ) );
			} );

			return columns;
		},

		/**
		 * Get menu columns order.
		 *
		 * @since 1.8.6
		 *
		 * @return {Array} Columns order.
		 */
		getMenuColumnsOrder() {
			let columnsOrder = app.getColumnsOrder();
			const columnsChecked = [];
			const columns = [];

			el.$menu.find( `input:checked` ).each( function() {
				columnsChecked.push( $( this ).val() );
			} );

			// Convert DOM element IDs to column IDs.
			columnsOrder = columnsOrder.map( function( column ) {
				return app.convertColumnId( column );
			} );

			// Add checked columns in the same order as in the table.
			for ( let i = 0; i < columnsOrder.length; i++ ) {
				const column = columnsOrder[ i ];

				if ( columnsChecked.includes( column ) ) {
					columns.push( column );
					columnsChecked.splice( columnsChecked.indexOf( column ), 1 );
				}
			}

			// Add the rest of the checked columns.
			return columns.concat( columnsChecked );
		},

		/**
		 * Save columns order.
		 *
		 * @since 1.8.6
		 */
		saveColumnsOrder() {
			const data = {
				nonce: wpforms_admin.nonce,
				action: el.$menu.find( '[name="action"]' ).val(),
				form_id: el.$menu.find( '[name="form_id"]' ).val(), // eslint-disable-line camelcase
				columns: app.getColumnsOrder(),
			};

			// AJAX request to save the columns order.
			$.post( wpforms_admin.ajax_url, data )
				.done( function( response ) {
					if ( ! response.success ) {
						app.displayErrorModal( response.data || wpforms_admin.unknown_error );
					}
				} )
				.fail( function() {
					app.displayErrorModal( wpforms_admin.server_error );
				} );
		},

		/**
		 * Display modal window with an error message.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} content Modal content.
		 */
		displayErrorModal( content ) {
			$.alert( {
				title  : wpforms_admin.uh_oh,
				content,
				icon   : 'fa fa-exclamation-circle',
				type   : 'red',
				buttons: {
					cancel: {
						text    : wpforms_admin.close,
						btnClass: 'btn-confirm',
						keys    : [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Update menu columns order.
		 *
		 * @since 1.8.6
		 */
		updateMenuColumnsOrder() { // eslint-disable-line complexity
			let columnsOrder = app.getColumnsOrder();
			const $groups = el.$menu.find( '.wpforms-multiselect-checkbox-optgroup' );
			const $itemsCont = el.$menu.find( '.wpforms-multiselect-checkbox-items' );
			const $items = $itemsCont.find( 'label' );
			const itemsByGroup = [ 0 ];

			// If there are no groups, add the items to the first group.
			itemsByGroup[ 0 ] = $items;

			// If there are groups, split the items by groups.
			if ( $groups.length ) {
				$groups.each( function( i ) {
					itemsByGroup[ i ] = $( this ).nextUntil( '.wpforms-multiselect-checkbox-optgroup' );
				} );
			}

			// Convert DOM element IDs to column IDs.
			columnsOrder = columnsOrder.map( function( column ) {
				return app.convertColumnId( column );
			} );

			// Rebuild the menu items order.
			for ( let g = 0; g < itemsByGroup.length; g++ ) {
				itemsByGroup[ g ] = itemsByGroup[ g ].filter( function() {
					return $( this ).find( 'input:checked' ).length > 0;
				} );

				itemsByGroup[ g ].detach();

				const $group = $groups.eq( g );

				// Add the items in the same order as in the table.
				// It is necessary to process it in reverse mode to reproduce the columns order.
				for ( let i = columnsOrder.length - 1; i >= 0; i-- ) {
					const column = columnsOrder[ i ];
					const $item = itemsByGroup[ g ].filter( function() {
						return $( this ).find( `[value="${ column }"]` ).length > 0;
					} );

					if ( ! $item.length ) {
						continue;
					}

					if ( $group.length ) {
						$group.after( $item );
					} else {
						$itemsCont.prepend( $item );
					}
				}
			}
		},

		/**
		 * Convert column Id.
		 *
		 * @since 1.8.6
		 *
		 * @param {string|number} columnId Column ID.
		 *
		 * @return {string} Converted column ID.
		 */
		convertColumnId( columnId ) {
			let id = columnId.replace( 'wpforms_field_', '' );

			id = id.replace( '-foot', '' );
			id = id === 'entry_id' ? '-1' : id;
			id = id === 'notes_count' ? '-2' : id;

			return id;
		},

		/**
		 * Initialize wpforms-multiselect-js on select elements.
		 *
		 * @since 1.8.6
		 */
		initMultiSelect() {
			if ( ! el.$cog.length ) {
				return;
			}

			el.$menu.find( '.wpforms-list-table-ext-edit-columns-select' ).each( function() {
				const isLongList = $( this ).find( 'option' ).length > 10;
				const isEntriesPage = el.$page.is( '#wpforms-entries-list' );
				const showSearch = isEntriesPage && isLongList;
				const multiSelectColumns = new window.WPFormsMultiSelectCheckbox(
					this,
					{
						showMask: true,
						showSearch,
						customOpener: el.$cog.get( 0 ),
					}
				);

				multiSelectColumns.init();

				const $wrapper = $( this ).next( '.wpforms-multiselect-checkbox-wrapper' );
				const $list = $wrapper.find( '.wpforms-multiselect-checkbox-list' );

				app.appendNoResultsText( $list );

				if ( ! showSearch ) {
					$wrapper.find( '.wpforms-multiselect-checkbox-items' ).addClass( 'wpforms-multiselect-checkbox-items-no-search' );
				}

				$list.append( '<button type="button" class="button button-secondary" id="wpforms-list-table-ext-edit-columns-select-submit" data-value="save-table-columns">' + wpforms_admin.save_changes + '</button>' );

				app.updateMenuColumnsOrder();
			} );

			el.$searchInput = $( '#wpforms-list-table-ext-edit-columns-select-container .wpforms-multiselect-checkbox-search' );

			el.$menu.removeClass( 'wpforms-hidden' );
		},

		/**
		 * Append no results text to the multiselect list.
		 *
		 * @since 1.8.6
		 *
		 * @param {jQuery} $list Multiselect list.
		 */
		appendNoResultsText( $list ) {
			$list.find( '.wpforms-multiselect-checkbox-optgroup' ).each( function( i ) {
				const appendix = i === 0 ? 'fields' : 'meta';
				const noResultsText = i === 0 ? wpforms_admin.column_selector_no_fields : wpforms_admin.column_selector_no_meta;

				$( this )
					.addClass( 'wpforms-multiselect-checkbox-optgroup-' + appendix )
					.after( `<span class="wpforms-multiselect-checkbox-no-results wpforms-multiselect-checkbox-no-results-${ appendix } wpforms-hidden">${ noResultsText }</span>` );
			} );
		},

		/**
		 * Add cog icon to the table header.
		 *
		 * @since 1.8.6
		 *
		 * @return {jQuery} Cog icon object.
		 */
		initCogIcon() {
			if ( el.$cog ) {
				return el.$cog;
			}

			const $lastColumnHeader = el.$table.find( 'thead th:not(.hidden):last' );

			if ( ! $lastColumnHeader.length ) {
				return $();
			}

			const cogId = selectors.cogIcon.replace( '#', '' );
			const $cog = $( `<a href="#" title="${ wpforms_admin.column_selector_title }" id="${ cogId }"><i class="fa fa-cog" aria-hidden="true"></i></a>` );

			$lastColumnHeader.append( $cog );

			return $cog;
		},

		/*
		 * Click on the cog icon.
		 *
		 * @since 1.8.6
		 *
		 * @param {object} event Event object.
		 */
		onClickCog( event ) {
			event.preventDefault();
		},

		/*
		 * Save changes.
		 *
		 * @since 1.8.6
		 *
		 * @param {object} event Event object.
		 */
		onSaveChanges( event ) {
			event.preventDefault();

			const data = {
				nonce: wpforms_admin.nonce,
				action: el.$menu.find( 'input[name="action"]' ).val(),
				form_id: el.$menu.find( 'input[name="form_id"]' ).val(), // eslint-disable-line camelcase
				columns: app.getMenuColumnsOrder(),
			};

			app.closeMenu();

			$.post( wpforms_admin.ajax_url, data )
				.done( function( response ) {
					if ( ! response.success ) {
						app.displayErrorModal( response.data || wpforms_admin.unknown_error );

						return;
					}

					window.location.reload();
				} )
				.fail( function() {
					app.displayErrorModal( wpforms_admin.server_error );
				} );
		},

		/**
		 * Toggle multiselect columns menu.
		 *
		 * @since 1.8.6
		 *
		 * @param {Object} event Event object.
		 */
		onMenuToggle( event ) {
			$( selectors.cogIcon ).toggleClass( 'active', event.detail.isOpen );

			// Hide no results messages.
			el.$menu.find( '.wpforms-multiselect-checkbox-no-results' ).addClass( 'wpforms-hidden' );

			app.positionMultiselectColumnsMenu();
		},

		/**
		 * Position the multiselect columns menu just under the cog icon.
		 *
		 * @since 1.8.6
		 */
		positionMultiselectColumnsMenu() {
			if ( ! el.$cog.length ) {
				return;
			}

			el.$menu.css( {
				top: el.$cog.offset().top - $( '#wpbody-content' ).offset().top + el.$cog.outerHeight() + 6,
			} );
		},

		/**
		 * Detect if the custom styled scrollbar is needed.
		 *
		 * @since 1.8.6
		 *
		 * @return {boolean} True when needed.
		 */
		isCustomScrollbarNeeded() {
			const ua = navigator.userAgent;

			return ( ua.includes( 'Windows' ) || ua.includes( 'Linux' ) ) &&
				( ua.includes( 'Chrome' ) || ua.includes( 'Firefox' ) );
		},
	};

	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsAdminListTableExt.init();
