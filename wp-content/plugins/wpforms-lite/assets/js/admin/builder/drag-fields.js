/* global wpforms_builder, WPFormsBuilder, WPFormsUtils */

/**
 * @param wpforms_builder.field_cannot_be_reordered
 */

// noinspection ES6ConvertVarToLetConst
/**
 * Form Builder Fields Drag-n-Drop module.
 *
 * @since 1.7.7
 */

var WPForms = window.WPForms || {}; // eslint-disable-line no-var

WPForms.Admin = WPForms.Admin || {};
WPForms.Admin.Builder = WPForms.Admin.Builder || {};

WPForms.Admin.Builder.DragFields = WPForms.Admin.Builder.DragFields || ( function( document, window, $ ) {
	/**
	 * Elements holder.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	let el = {};

	/**
	 * Runtime variables.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	const vars = {};

	/**
	 * Layout field functions wrapper.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	let fieldLayout; // eslint-disable-line prefer-const

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
		},

		/**
		 * DOM is fully loaded.
		 *
		 * @since 1.7.7
		 */
		ready() {
			app.setup();
			app.initSortableFields();

			app.events();
		},

		/**
		 * Setup. Prepare some variables.
		 *
		 * @since 1.7.7
		 */
		setup() {
			// Cache DOM elements.
			el = {
				$builder:            $( '#wpforms-builder' ),
				$sortableFieldsWrap: $( '#wpforms-panel-fields .wpforms-field-wrap' ),
				$addFieldsButtons:   $( '.wpforms-add-fields-button' ).not( '.not-draggable' ).not( '.warning-modal' ).not( '.education-modal' ),
			};
		},

		/**
		 * Bind events.
		 *
		 * @since 1.7.7
		 */
		events() {
			el.$builder
				.on( 'wpformsFieldDragToggle', app.fieldDragToggleEvent );
		},

		/**
		 * Disable drag & drop.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Moved from admin-builder.js.
		 */
		disableDragAndDrop() {
			el.$addFieldsButtons.filter( '.ui-draggable' ).draggable( 'disable' );
			el.$sortableFieldsWrap.sortable( 'disable' );
			el.$sortableFieldsWrap.find( '.wpforms-layout-column.ui-sortable' ).sortable( 'disable' );
		},

		/**
		 * Enable drag & drop.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Moved from admin-builder.js.
		 */
		enableDragAndDrop() {
			el.$addFieldsButtons.filter( '.ui-draggable' ).draggable( 'enable' );
			el.$sortableFieldsWrap.sortable( 'enable' );
			el.$sortableFieldsWrap.find( '.wpforms-layout-column.ui-sortable' ).sortable( 'enable' );
		},

		/**
		 * Show popup in case if field is not draggable, and cancel moving.
		 *
		 * @since 1.7.5
		 * @since 1.7.7 Moved from admin-builder.js.
		 *
		 * @param {jQuery}  $field    A field or list of fields.
		 * @param {boolean} showPopUp Whether the pop-up should be displayed on dragging attempt.
		 */
		fieldDragDisable( $field, showPopUp = true ) {
			if ( $field.hasClass( 'ui-draggable-disabled' ) ) {
				// noinspection JSUnresolvedReference
				$field.draggable( 'enable' );

				return;
			}

			let startTopPosition;

			// noinspection JSUnresolvedReference
			$field.draggable( {
				revert: true,
				axis: 'y',
				delay: 100,
				opacity: 1,
				cursor: 'move',
				start( event, ui ) {
					startTopPosition = ui.position.top;
				},
				drag( event, ui ) {
					if ( Math.abs( ui.position.top ) - Math.abs( startTopPosition ) > 15 ) {
						if ( showPopUp ) {
							app.youCantReorderFieldPopup();
						}

						return false;
					}
				},
			} );
		},

		/**
		 * Allow field dragging.
		 *
		 * @since 1.7.5
		 * @since 1.7.7 Moved from admin-builder.js.
		 *
		 * @param {jQuery} $field A field or list of fields.
		 */
		fieldDragEnable( $field ) {
			if ( $field.hasClass( 'ui-draggable' ) ) {
				return;
			}

			// noinspection JSUnresolvedReference
			$field.draggable( 'disable' );
		},

		/**
		 * Show the error message in the popup that you cannot reorder the field.
		 *
		 * @since 1.7.1
		 * @since 1.7.7 Moved from admin-builder.js.
		 */
		youCantReorderFieldPopup() {
			$.confirm( {
				title: wpforms_builder.heads_up,
				content: wpforms_builder.field_cannot_be_reordered,
				icon: 'fa fa-exclamation-circle',
				type: 'red',
				buttons: {
					confirm: {
						text: wpforms_builder.ok,
						btnClass: 'btn-confirm',
						keys: [ 'enter' ],
					},
				},
			} );
		},

		/**
		 * Event handler for `wpformsFieldDragToggle` event.
		 *
		 * @since 1.7.7
		 *
		 * @param {Object}        e  Event object.
		 * @param {number|string} id Field ID.
		 */
		fieldDragToggleEvent( e, id ) {
			const $field = $( `#wpforms-field-${ id }` );

			if (
				$field.hasClass( 'wpforms-field-not-draggable' ) ||
				$field.hasClass( 'wpforms-field-stick' )
			) {
				app.fieldDragDisable( $field );

				return;
			}

			app.fieldDragEnable( $field );
		},

		/**
		 * Initialize sortable fields in the builder form preview area.
		 *
		 * @since 1.7.7
		 */
		initSortableFields() {
			app.initSortableContainer( el.$sortableFieldsWrap );

			el.$builder.find( '.wpforms-layout-column' ).each( function() {
				app.initSortableContainer( $( this ) );
			} );

			app.fieldDragDisable( $( '.wpforms-field-not-draggable, .wpforms-field-stick' ) );
			app.initDraggableFields();
		},

		/**
		 * Initialize sortable container with fields.
		 *
		 * @since 1.7.7
		 *
		 * @param {jQuery} $sortable Container to make sortable.
		 */
		initSortableContainer( $sortable ) { // eslint-disable-line max-lines-per-function
			const $fieldOptions = $( '#wpforms-field-options' );
			const $scrollContainer = $( '#wpforms-panel-fields .wpforms-panel-content-wrap' );

			let fieldId,
				fieldType,
				isNewField,
				$fieldOption,
				$prevFieldOption,
				prevFieldId,
				currentlyScrolling = false;

			// noinspection JSUnresolvedReference
			$sortable.sortable( {
				items: '> .wpforms-field:not(.wpforms-field-stick):not(.no-fields-preview)',
				connectWith: '.wpforms-field-wrap, .wpforms-layout-column',
				delay: 100,
				opacity: 1,
				cursor: 'move',
				cancel: '.wpforms-field-not-draggable',
				placeholder: 'wpforms-field-drag-placeholder',
				appendTo: '#wpforms-panel-fields',
				zindex: 10000,
				tolerance: 'pointer',
				distance: 1,
				start( e, ui ) {
					fieldId = ui.item.data( 'field-id' );
					fieldType = ui.item.data( 'field-type' );
					isNewField = typeof fieldId === 'undefined';
					$fieldOption = $( '#wpforms-field-option-' + fieldId );

					vars.fieldReceived = false;
					vars.fieldRejected = false;
					vars.$sortableStart = $sortable;
					vars.startPosition = ui.item.first().index();

					el.$builder.trigger( 'wpformsFieldDragStart', [ fieldId ] );
				},
				beforeStop( e, ui ) {
					if ( ! vars.glitchChange ) {
						return;
					}

					// Before processing in the `stop` method, we need to perform the last check.
					if ( ! fieldLayout.isFieldAllowedInColum( fieldType, ui.item.first().parent() ) ) {
						vars.fieldRejected = true;
					}
				},
				stop( e, ui ) { // eslint-disable-line complexity
					const $field = ui.item.first();

					ui.placeholder.removeClass( 'wpforms-field-drag-not-allowed' );
					$field.removeClass( 'wpforms-field-drag-not-allowed' );

					// Reject not allowed fields.
					if ( vars.fieldRejected ) {
						const $targetColumn = isNewField ? $sortable : $field.parent();

						app.revertMoveFieldToColumn( $field );
						el.$builder.trigger( 'wpformsFieldMoveRejected', [ $field, ui, $targetColumn ] );

						return;
					}

					prevFieldId = $field.prev( '.wpforms-field, .wpforms-alert' ).data( 'field-id' );
					$prevFieldOption = $( `#wpforms-field-option-${ prevFieldId }` );

					if ( $prevFieldOption.length > 0 ) {
						$prevFieldOption.after( $fieldOption );
					} else {
						$fieldOptions.prepend( $fieldOption );
					}

					// In the case of changing fields' order inside the same column,
					// we just need to change the position of the field.
					if ( ! isNewField && $field.closest( '.wpforms-layout-column' ).is( $sortable ) ) {
						fieldLayout.positionFieldInColumn(
							fieldId,
							$field.index() - 1,
							$sortable
						);
					}

					const $layoutField = $field.closest( '.wpforms-field-layout, .wpforms-field-repeater' );

					fieldLayout.fieldOptionsUpdate( null, fieldId );
					fieldLayout.reorderLayoutFieldsOptions( $layoutField );

					if ( ! isNewField ) {
						$field
							.removeClass( 'wpforms-field-dragging' )
							.removeClass( 'wpforms-field-drag-over' );
					}

					$field.attr( 'style', '' );

					el.$builder.trigger( 'wpformsFieldMove', ui );

					vars.fieldReceived = false;
				},
				over( e, ui ) { // eslint-disable-line complexity
					const $field = ui.item.first(),
						$target = $( e.target ),
						$placeholder = $target.find( '.wpforms-field-drag-placeholder' ),
						isColumn = $target.hasClass( 'wpforms-layout-column' ),
						helper = {
							width: $target.outerWidth(),
							height: $field.outerHeight(),
						};

					let targetClass = isColumn ? ' wpforms-field-drag-to-column' : '';

					if ( isColumn ) {
						const columnSize = $target.attr( 'class' ).match( /wpforms-layout-column-(\d+)/ )[ 1 ];

						targetClass += ` wpforms-field-drag-to-column-${ columnSize }`;
					}

					fieldId = $field.data( 'field-id' );
					fieldType = $field.data( 'field-type' ) || vars.fieldType;
					isNewField = typeof fieldId === 'undefined';

					// Adjust helper size according to the placeholder size.
					$field
						.addClass( 'wpforms-field-dragging' + targetClass );

					if ( ! isColumn || ! fieldLayout.isLayoutBasedField( fieldType ) ) {
						$field
							.css( {
								width: isColumn ? helper.width - 5 : helper.width,
								height: 'auto',
							} );
					}

					const placeholderHeight = isColumn ? 90 : helper.height;

					// Adjust placeholder height according to the height of the helper.
					$placeholder
						.removeClass( 'wpforms-field-drag-not-allowed' )
						.css( {
							height: isNewField ? placeholderHeight + 18 : helper.height,
						} );

					// Drop to this place is not allowed.
					if ( isColumn && ! fieldLayout.isFieldAllowedInColum( fieldType, $target ) ) {
						$placeholder.addClass( 'wpforms-field-drag-not-allowed' );
						$field.addClass( 'wpforms-field-drag-not-allowed' );
					}

					el.$builder.trigger( 'wpformsFieldDragOver', [ fieldId, $target ] );

					// Skip if it is the existing field.
					if ( ! isNewField ) {
						return;
					}

					$field
						.addClass( 'wpforms-field-drag-over' )
						.removeClass( 'wpforms-field-drag-out' );
				},
				out( e, ui ) {
					const $field = ui.item.first(),
						// eslint-disable-next-line no-shadow
						fieldId = $field.data( 'field-id' ),
						// eslint-disable-next-line no-shadow
						isNewField = typeof fieldId === 'undefined';

					$field
						.removeClass( 'wpforms-field-drag-not-allowed' )
						.removeClass( function( index, className ) {
							// Remove all classes starting with `wpforms-field-drag-to-column`.
							return ( className.match( /wpforms-field-drag-to-column(-\d+|)/g ) || [] ).join( ' ' );
						} );

					if ( vars.fieldReceived ) {
						$field.attr( 'style', '' );

						return;
					}

					// Skip if it is the existing field.
					if ( ! isNewField ) {
						// Remove extra class from the parent layout field.
						// Fixes disappearing of duplicate/delete field icons
						// after moving the field outside the layout field.
						$( ui.sender )
							.closest( '.wpforms-field-layout, .wpforms-field-repeater' )
							.removeClass( 'wpforms-field-child-hovered' );

						return;
					}

					$field
						.addClass( 'wpforms-field-drag-out' )
						.removeClass( 'wpforms-field-drag-over' );
				},
				receive( e, ui ) { // eslint-disable-line complexity
					const $field = $( ui.helper || ui.item );

					fieldId = $field.data( 'field-id' );
					fieldType = $field.data( 'field-type' ) || vars.fieldType;

					// eslint-disable-next-line no-shadow
					const isNewField = typeof fieldId === 'undefined',
						isColumn = $sortable.hasClass( 'wpforms-layout-column' );

					// Drop to this place is not allowed.
					if (
						isColumn &&
						! fieldLayout.isFieldAllowedInColum( fieldType, $sortable )
					) {
						vars.fieldRejected = true;

						return;
					}

					vars.fieldReceived = true;

					$field.removeClass( 'wpforms-field-drag-over' );

					// Move existing field.
					if ( ! isNewField ) {
						fieldLayout.receiveFieldToColumn(
							fieldId,
							ui.item.index() - 1,
							$field.parent()
						);

						return;
					}

					// Add new field.
					const position = $sortable.data( 'ui-sortable' ).currentItem.index();

					$field
						.addClass( 'wpforms-field-drag-over wpforms-field-drag-pending' )
						.removeClass( 'wpforms-field-drag-out' )
						.append( WPFormsBuilder.settings.spinnerInline )
						.css( 'width', '100%' );

					el.$builder.find( '.no-fields-preview' ).remove();

					WPFormsBuilder.fieldAdd(
						vars.fieldType,
						{
							position: isColumn ? position - 1 : position,
							placeholder: $field,
							$sortable,
						}
					);

					vars.fieldType = undefined;
				},
				change( e, ui ) {
					const $placeholderSortable = ui.placeholder.parent();
					const $targetSortable = $( e.target );

					vars.glitchChange = false;

					// In some cases sortable widget display placeholder in wrong sortable instance.
					// It's happens when you drag the field over/out the last column of the last Layout field.
					if (
						! $sortable.is( $placeholderSortable ) &&
						$sortable.hasClass( 'wpforms-field-wrap' ) &&
						$placeholderSortable.hasClass( 'wpforms-layout-column' )
					) {
						vars.glitchChange = true;
					}

					el.$builder.trigger( 'wpformsFieldDragChange', [ fieldId, $targetSortable ] );
				},
				sort( e ) {
					if ( currentlyScrolling ) {
						return;
					}

					const scrollAreaHeight = 50,
						mouseYPosition = e.clientY,
						containerOffset = $scrollContainer.offset(),
						containerHeight = $scrollContainer.height(),
						containerBottom = containerOffset.top + containerHeight;

					let operator;

					if (
						mouseYPosition > containerOffset.top &&
						mouseYPosition < ( containerOffset.top + scrollAreaHeight )
					) {
						operator = '-=';
					} else if (
						mouseYPosition > ( containerBottom - scrollAreaHeight ) &&
						mouseYPosition < containerBottom
					) {
						operator = '+=';
					} else {
						return;
					}

					currentlyScrolling = true;

					$scrollContainer.animate(
						{
							scrollTop: operator + ( containerHeight / 3 ) + 'px',
						},
						800,
						function() {
							currentlyScrolling = false;
						}
					);
				},
			} );
		},

		/**
		 * Initialize draggable fields buttons.
		 *
		 * @since 1.7.7
		 */
		initDraggableFields() {
			el.$addFieldsButtons.draggable( {
				connectToSortable: '.wpforms-field-wrap, .wpforms-layout-column',
				delay: 200,
				cancel: false,
				scroll: false,
				opacity: 1,
				appendTo: '#wpforms-panel-fields',
				zindex: 10000,

				helper() {
					const $this = $( this );
					const $el = $( '<div class="wpforms-field-drag-out wpforms-field-drag">' );

					vars.fieldType = $this.data( 'field-type' );

					return $el.html( $this.html() );
				},

				start( e, ui ) {
					const event = WPFormsUtils.triggerEvent(
						el.$builder,
						'wpformsFieldAddDragStart',
						[ vars.fieldType, ui ]
					);

					// Allow callbacks on `wpformsFieldAddDragStart` to cancel dragging the field
					// by triggering `event.preventDefault()`.
					if ( event.isDefaultPrevented() ) {
						return false;
					}
				},

				stop( e, ui ) {
					const event = WPFormsUtils.triggerEvent(
						el.$builder,
						'wpformsFieldAddDragStop',
						[ vars.fieldType, ui ]
					);

					// Allow callbacks on `wpformsFieldAddDragStop` to cancel dragging the field
					// by triggering `event.preventDefault()`.
					if ( event.isDefaultPrevented() ) {
						return false;
					}
				},
			} );
		},

		/**
		 * Revert moving the field to the column.
		 *
		 * @since 1.7.7
		 *
		 * @param {jQuery} $field Field object.
		 */
		revertMoveFieldToColumn( $field ) {
			const isNewField = $field.data( 'field-id' ) === undefined;

			if ( isNewField ) {
				// Remove the field.
				$field.remove();

				return;
			}

			// Restore existing field on the previous position.
			$field = $field.detach();

			const $fieldInStartPosition = vars.$sortableStart
				.find( '> .wpforms-field' )
				.eq( vars.startPosition );

			$field
				.removeClass( 'wpforms-field-dragging' )
				.removeClass( 'wpforms-field-drag-over' )
				.attr( 'style', '' );

			if ( $fieldInStartPosition.length ) {
				$fieldInStartPosition.before( $field );

				return;
			}

			vars.$sortableStart.append( $field );
		},
	};

	/**
	 * Layout field functions holder.
	 *
	 * @since 1.7.7
	 *
	 * @type {Object}
	 */
	fieldLayout = {

		/**
		 * Position field in the column inside the Layout Field.
		 *
		 * @since 1.7.7
		 *
		 * @param {number} fieldId   Field ID.
		 * @param {number} position  The new position of the field inside the column.
		 * @param {jQuery} $sortable Sortable column container.
		 */
		positionFieldInColumn( fieldId, position, $sortable ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return;
			}

			WPForms.Admin.Builder.FieldLayout.positionFieldInColumn( fieldId, position, $sortable );
		},

		/**
		 * Receive field to column inside the Layout Field.
		 *
		 * @since 1.7.7
		 *
		 * @param {number} fieldId   Field ID.
		 * @param {number} position  Field position inside the column.
		 * @param {jQuery} $sortable Sortable column container.
		 */
		receiveFieldToColumn( fieldId, position, $sortable ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return;
			}

			WPForms.Admin.Builder.FieldLayout.receiveFieldToColumn( fieldId, position, $sortable );
		},

		/**
		 * Update field options according to the position of the field.
		 * Event `wpformsFieldOptionTabToggle` handler.
		 *
		 * @since 1.7.7
		 *
		 * @param {Event}  e       Event.
		 * @param {number} fieldId Field id.
		 */
		fieldOptionsUpdate( e, fieldId ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return;
			}

			WPForms.Admin.Builder.FieldLayout.fieldOptionsUpdate( e, fieldId );
		},

		/**
		 * Reorder fields options of the fields in columns.
		 * It is not critical, but it's better to keep some order in the `fields` data array.
		 *
		 * @since 1.7.7
		 *
		 * @param {jQuery} $layoutField Layout field object.
		 */
		reorderLayoutFieldsOptions( $layoutField ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return;
			}

			WPForms.Admin.Builder.FieldLayout.reorderLayoutFieldsOptions( $layoutField );
		},

		/**
		 * Whether the field type is allowed to be in column.
		 *
		 * @since 1.7.7
		 *
		 * @param {string} fieldType     Field type to check.
		 * @param {jQuery} $targetColumn Target column element.
		 *
		 * @return {boolean} True if allowed.
		 */
		isFieldAllowedInColum( fieldType, $targetColumn ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return true;
			}

			const isAllowed = WPForms.Admin.Builder.FieldLayout.isFieldAllowedInColum( fieldType, $targetColumn );

			/**
			 * Allows developers to determine whether the field is allowed to be dragged in column.
			 *
			 * @since 1.8.9
			 *
			 * @param {boolean} isAllowed     Whether the field is allowed to be placed in the column.
			 * @param {string}  fieldType     Field type.
			 * @param {jQuery}  $targetColumn Target column element.
			 *
			 * @return {boolean} True if allowed.
			 */
			return wp.hooks.applyFilters( 'wpforms.LayoutField.isFieldAllowedDragInColumn', isAllowed, fieldType, $targetColumn );
		},

		/**
		 * Determine whether the field type is a layout-based field.
		 *
		 * @since 1.8.9
		 *
		 * @param {string} fieldType Field type to check.
		 *
		 * @return {boolean} True if it is the Layout-based field.
		 */
		isLayoutBasedField( fieldType ) {
			if ( ! WPForms.Admin.Builder.FieldLayout ) {
				return false;
			}

			return WPForms.Admin.Builder.FieldLayout.isLayoutBasedField( fieldType );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPForms.Admin.Builder.DragFields.init();
