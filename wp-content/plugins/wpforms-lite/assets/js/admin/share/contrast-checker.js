/* global define */

/* eslint-disable */
/**
 * This file contains a reusable, and dependency-free JavaScript class,
 * providing a contrast checker. This class allows you to assess the readability
 * of the given background and text colors against the WCAG 2.0 AA standard.
 *
 * Example Usage:
 *
 * // Create an instance of the plugin with custom settings.
 * const contrastChecker = new WPFormsColorContrastChecker({
 * 	textColor: '#de8e8e', // Replace with your actual text color.
 * 	bgColor: '#ffffff', // Replace with your actual background color.
 * 	message: {
 * 		contrastPass: '',
 * 		contrastFail: 'Insufficient contrast. Please choose a darker text color or a lighter background color.',
 * 	},
 * });
 *
 * // Perform the contrast check.
 * const contrastFailed = contrastChecker.checkContrast();
 *
 * // Display the result or handle the error, if any.
 * if (contrastFailed) {
 * 	console.error(contrastFailed);
 * }
 */
/* eslint-enable */

( function( root, factory ) {
	const pluginName = 'WPFormsColorContrastChecker';

	if ( typeof define === 'function' && define.amd ) {
		define( [], factory( pluginName ) );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory( pluginName );
	} else {
		root[ pluginName ] = factory( pluginName );
	}
// eslint-disable-next-line max-lines-per-function
}( this, function( pluginName ) {
	// eslint-disable-next-line strict
	'use strict';

	/**
	 * Plugin Error Object.
	 *
	 * @since 1.8.6
	 *
	 * @class PluginError
	 *
	 * @augments Error
	 */
	class PluginError extends Error {
		/**
		 * Constructor.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} message The error message.
		 */
		constructor( message ) {
			super( message );

			this.name = pluginName;
		}
	}

	/**
	 * Log the error message.
	 * This function can be replaced with a custom error logging logic.
	 *
	 * @since 1.8.6
	 *
	 * @param {string} error The error message.
	 */
	function logError( error ) {
		// Custom error logging logic.
		// Display the error message in a specific format or send it to a logging service
		// eslint-disable-next-line no-console
		console.error( error );
	}

	/**
	 * Plugin Object.
	 *
	 * @since 1.8.6
	 *
	 * @class Plugin
	 */
	class Plugin {
		// Default settings.
		static defaults = {
			textColor: '',
			bgColor: '',
			contrastThreshold: 4.5, // W3C recommended minimum contrast ratio for normal text
			message: {
				contrastPass: 'The contrast ratio between the text and background color is sufficient.',
				contrastFail: 'The contrast ratio between the text and background color is insufficient. Please choose a darker text color or a lighter background color.',
			},
		};

		/**
		 * Constructor.
		 *
		 * @since 1.8.6
		 *
		 * @param {Object} args The argument object.
		 */
		constructor( args ) {
			// Merge the default settings with the provided settings.
			this.args = Object.assign( {}, Plugin.defaults, args );
		}

		/**
		 * Convert hex color code to an RGB array.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} hexColor The hex color code.
		 *
		 * @return {number[]|null} The RGB array or null if the conversion failed.
		 */
		hexToRgb( hexColor ) {
			const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hexColor );

			if ( shorthandRegex.test( hexColor ) ) {
				return result ? [
					parseInt( result[ 1 ], 16 ) * 17,
					parseInt( result[ 2 ], 16 ) * 17,
					parseInt( result[ 3 ], 16 ) * 17,
				] : null;
			}

			return result ? [
				parseInt( result[ 1 ], 16 ),
				parseInt( result[ 2 ], 16 ),
				parseInt( result[ 3 ], 16 ),
			] : null;
		}

		/**
		 * Calculate relative luminance for a color.
		 *
		 * The calculated relative luminance is a value between 0 and 1,
		 * where 0 represents black and 1 represents white.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} rgb The RGB color code.
		 *
		 * @return {number} The relative luminance.
		 */
		calculateRelativeLuminance( rgb ) {
			for ( let i = 0; i < rgb.length; i++ ) {
				rgb[ i ] /= 255;
				rgb[ i ] = rgb[ i ] <= 0.03928 ? rgb[ i ] / 12.92 : Math.pow( ( rgb[ i ] + 0.055 ) / 1.055, 2.4 );
			}

			// As Stated in WCAG the relative luminance of a color is defined as:
			// L = 0.2126 * R + 0.7152 * G + 0.0722 * B
			// where R, G and B are the color values normalized to the range [0, 1].
			// @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
			// eslint-disable-next-line no-mixed-operators
			return 0.2126 * rgb[ 0 ] + 0.7152 * rgb[ 1 ] + 0.0722 * rgb[ 2 ];
		}

		/**
		 * Get the contrast ratio between two colors.
		 *
		 * @since 1.8.6
		 *
		 * @return {number|null} The contrast ratio or an error if the calculation failed.
		 */
		getContrastRatio() {
			try {
				const rgbText = this.hexToRgb( this.args.textColor );
				const rgbBg = this.hexToRgb( this.args.bgColor );

				// Check for invalid color format
				if ( ! rgbText || ! rgbBg ) {
					throw new PluginError( 'Invalid color format. Provide valid hex color codes.' );
				}

				const [ l1, l2 ] = [ this.calculateRelativeLuminance( rgbText ), this.calculateRelativeLuminance( rgbBg ) ];

				// The purpose of adding 0.05 to both the maximum and minimum relative luminance
				// is to ensure that even if one of the luminance values is zero (which would cause division by zero),
				// the result won't be infinite. This kind of adjustment is common in contrast ratio calculations
				// to handle extreme cases and avoid mathematical errors.
				return ( Math.max( l1, l2 ) + 0.05 ) / ( Math.min( l1, l2 ) + 0.05 );
			} catch ( error ) {
				logError( error.message );
				return null;
			}
		}

		/**
		 * Check the contrast and provide a warning if it's below the threshold.
		 *
		 * @since 1.8.6
		 *
		 * @return {string|null} The contrast check result or boolean false if the check failed.
		 */
		checkContrast() {
			try {
				const contrastRatio = this.getContrastRatio();

				// Return early if invalid color format
				if ( contrastRatio === null ) {
					throw new PluginError( 'Invalid contrast ratio. Provide valid contrast ratio between two colors.' );
				}

				// Warn if the contrast is below the threshold.
				if ( contrastRatio < this.args.contrastThreshold ) {
					return this.args.message.contrastFail;
				}

				return this.args.message.contrastPass;
			} catch ( error ) {
				logError( error.message );
				return null;
			}
		}
	}

	return Plugin;
} ) );
