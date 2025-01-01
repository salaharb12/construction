/* global wpforms_dashboard_widget, moment, Chart, ajaxurl */
/**
 * WPForms Dashboard Widget function.
 *
 * @since 1.5.0
 */

const WPFormsDashboardWidget = window.WPFormsDashboardWidget || ( function( document, window, $ ) {
	/**
	 * Elements reference.
	 *
	 * @since 1.5.0
	 *
	 * @type {Object}
	 */
	const el = {
		$widget:                        $( '#wpforms_reports_widget_lite' ),
		$settingsBtn:                   $( '#wpforms-dash-widget-settings-button' ),
		$canvas:                        $( '#wpforms-dash-widget-chart' ),
		$chartDismissButton:            $( '.wpforms-dash-widget-dismiss-chart-upgrade' ),
		$dismissButton:                 $( '.wpforms-dash-widget-dismiss-icon' ),
		$recommendedBlockDismissButton: $( '#wpforms-dash-widget-dismiss-recommended-plugin-block' ),
	};

	/**
	 * Check if the site is RTL.
	 *
	 * @since 1.9.1
	 */
	const isRTL = $( 'body' ).hasClass( 'rtl' );

	/**
	 * Chart.js functions and properties.
	 *
	 * @since 1.5.0
	 *
	 * @type {Object}
	 */
	// eslint-disable-next-line no-var
	var chart = {

		/**
		 * Chart.js instance.
		 *
		 * @since 1.5.0
		 */
		instance: null,

		/**
		 * Chart.js settings.
		 *
		 * @since 1.5.0
		 */
		settings: {
			type   : 'line',
			data   : {
				labels  : [],
				datasets: [ {
					label               : wpforms_dashboard_widget.i18n.entries,
					data                : [],
					backgroundColor     : 'rgba(255, 129, 0, 0.135)',
					borderColor         : 'rgba(211, 126, 71, 1)',
					borderWidth         : 2,
					pointRadius         : 4,
					pointBorderWidth    : 1,
					pointBackgroundColor: 'rgba(255, 255, 255, 1)',
				} ],
			},
			options: {
				maintainAspectRatio: false,
				scales                     : {
					x:  {
						type        : 'timeseries',
						reverse: isRTL,
						ticks       : {
							source     : 'labels',
							padding    : 10,
							minRotation: 25,
							maxRotation: 25,
							callback( value, index, values ) {
								// Distribute the ticks equally starting from a right side of xAxis.
								const gap = Math.floor( values.length / 7 );

								if ( gap < 1 ) {
									return moment( value ).format( 'MMM D' );
								}
								if ( ( values.length - index - 1 ) % gap === 0 ) {
									return moment( value ).format( 'MMM D' );
								}
							},
						},
					},
					y: {
						beginAtZero  : true,
						ticks: {
							maxTicksLimit: 6,
							padding      : 20,
							callback( value ) {
								// Make sure the tick value has no decimals.
								if ( Math.floor( value ) === value ) {
									return value;
								}
							},
						},
					},
				},
				elements: {
					line: {
						tension: 0,
						fill: true,
					},
				},
				animation: false,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						displayColors: false,
						rtl: isRTL,
					},
				},
			},
		},

		/**
		 * Init Chart.js.
		 *
		 * @since 1.5.0
		 */
		init() {
			if ( ! el.$canvas.length ) {
				return;
			}

			const ctx = el.$canvas[ 0 ].getContext( '2d' );

			chart.instance = new Chart( ctx, chart.settings );

			chart.updateUI();
		},

		/**
		 * Update Chart.js canvas.
		 *
		 * @since 1.5.0
		 */
		updateUI() {
			chart.updateWithDummyData();

			chart.instance.data.labels = chart.settings.data.labels;
			chart.instance.data.datasets[ 0 ].data = chart.settings.data.datasets[ 0 ].data;

			chart.instance.update();
		},

		/**
		 * Update Chart.js settings with dummy data.
		 *
		 * @since 1.5.0
		 */
		updateWithDummyData() {
			const end = moment().endOf( 'day' );
			let date;

			const minY = 5;
			const maxY = 20;
			let i;

			for ( i = 1; i <= 7; i++ ) {
				date = end.clone().subtract( i, 'days' );

				chart.settings.data.labels.push( date );
				chart.settings.data.datasets[ 0 ].data.push( {
					x: date,
					y: Math.floor( Math.random() * ( maxY - minY + 1 ) ) + minY,
				} );
			}
		},
	};

	/**
	 * Public functions and properties.
	 *
	 * @since 1.5.0
	 *
	 * @type {Object}
	 */
	// eslint-disable-next-line no-var
	var app = {

		/**
		 * Start the engine.
		 *
		 * @since 1.5.0
		 */
		init() {
			$( app.ready );
		},

		/**
		 * Document ready.
		 *
		 * @since 1.5.0
		 */
		ready() {
			chart.init();
			app.events();
			app.graphSettings();
		},

		/**
		 * Graph settings related events.
		 *
		 * @since 1.7.4
		 */
		graphSettings() {
			el.$settingsBtn.on( 'click', function() {
				$( this ).siblings( '.wpforms-dash-widget-settings-menu' ).toggle();
			} );
		},

		/**
		 * Register JS events.
		 *
		 * @since 1.5.0
		 */
		events() {
			app.formsListEvents();
			app.handleChartClose();
			app.handleRecommendedPluginsClose();
			app.handleWidgetBlockClose();
		},

		/**
		 * Register forms list area JS events.
		 *
		 * @since 1.5.0
		 */
		formsListEvents() {
			el.$widget.on( 'click', '#wpforms-dash-widget-forms-more', function() {
				app.toggleCompleteFormsList();
			} );
		},

		/**
		 * Handle chart close.
		 *
		 * @since 1.7.4
		 */
		handleChartClose() {
			el.$chartDismissButton.on( 'click', function( event ) {
				event.preventDefault();
				app.saveWidgetMeta( 'hide_graph', 1 );
				$( '.wpforms-dash-widget.wpforms-lite' ).addClass( 'wpforms-dash-widget-no-graph' );
				$( this ).closest( '.wpforms-dash-widget-chart-block-container' ).remove();
			} );
		},

		/**
		 * Handle recommended plugins block close.
		 *
		 * @since 1.7.4
		 * @since 1.8.7 Deprecated.
		 *
		 * @deprecated Use WPFormsDashboardWidget.handleWidgetBlockClose() instead.
		 */
		handleRecommendedPluginsClose() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! WPFormsDashboardWidget.handleRecommendedPluginsClose() has been deprecated, please use WPFormsDashboardWidget.handleWidgetBlockClose() instead.' );

			el.$recommendedBlockDismissButton.on( 'click', function() {
				app.dismissRecommendedBlock();
			} );
		},

		/**
		 * Handle widget block close.
		 *
		 * @since 1.8.7
		 */
		handleWidgetBlockClose() {
			el.$dismissButton.on( 'click', function() {
				app.dismissWidgetBlock( $( this ) );
			} );
		},

		/**
		 * Save dashboard widget meta on a backend.
		 *
		 * @since 1.7.4
		 *
		 * @param {string} meta  Meta name to save.
		 * @param {number} value Value to save.
		 */
		saveWidgetMeta( meta, value ) {
			const data = {
				_wpnonce: wpforms_dashboard_widget.nonce,
				action  : 'wpforms_' + wpforms_dashboard_widget.slug + '_save_widget_meta',
				meta,
				value,
			};

			$.post( ajaxurl, data );
		},

		/**
		 * Toggle forms list hidden entries.
		 *
		 * @since 1.5.0.4
		 */
		toggleCompleteFormsList() {
			$( '#wpforms-dash-widget-forms-list-table .wpforms-dash-widget-forms-list-hidden-el' ).toggle();
			$( '#wpforms-dash-widget-forms-more' ).html( function( i, html ) {
				return html === wpforms_dashboard_widget.show_less_html ? wpforms_dashboard_widget.show_more_html : wpforms_dashboard_widget.show_less_html;
			} );
		},

		/**
		 * Dismiss widget block.
		 *
		 * @since 1.8.7
		 *
		 * @param {Object} $clickedButton jQuery object of the clicked button.
		 */
		dismissWidgetBlock( $clickedButton ) {
			$clickedButton.closest( '.wpforms-dash-widget-block' ).remove();
			app.saveWidgetMeta( $clickedButton.data( 'field' ), 1 );
		},

		/**
		 * Dismiss recommended plugin block.
		 *
		 * @since 1.7.4
		 * @since 1.8.7 Deprecated.
		 *
		 * @deprecated Use WPFormsDashboardWidget.dismissWidgetBlock() instead.
		 */
		dismissRecommendedBlock() {
			// eslint-disable-next-line no-console
			console.warn( 'WARNING! WPFormsDashboardWidget.dismissRecommendedBlock() has been deprecated, please use WPFormsDashboardWidget.dismissWidgetBlock() instead.' );

			$( '.wpforms-dash-widget-recommended-plugin-block' ).remove();
			app.saveWidgetMeta( 'hide_recommended_block', 1 );
		},
	};

	// Provide access to public functions/properties.
	return app;
}( document, window, jQuery ) );

// Initialize.
WPFormsDashboardWidget.init();
