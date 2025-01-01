/* global define */

/* eslint-disable */
/**
 * XOR, or exclusive or, is a logical bitwise operation that stands for "exclusive or."
 * In the context of binary numbers, XOR compares corresponding bits of two operands and
 * produces a new result. The XOR operation returns true (or 1) for bits where the operands differ.
 *
 * Note: This class is a simple obfuscation technique and should not be used for securing sensitive data.
 *
 * Here's the truth table for XOR:
 *
 * A | B | A XOR B
 * -----------------
 * 0 | 0 | 0
 * 0 | 1 | 1
 * 1 | 0 | 1
 * 1 | 1 | 0
 *
 * In binary, XOR is often denoted by the symbol ^.
 * Here's an example of XOR operation on binary numbers:
 *
 *   1101 (13 in decimal)
 * ^ 1010 (10 in decimal)
 * ------------------------
 *   0111 (7 in decimal)
 *
 * Example Usage:
 *
 * // Instantiate the plugin with a custom encryption key.
 * const xorInstance = new WPFormsXOR({
 *   key: 55, // Use any number as the encryption key.
 * });
 *
 * // Example object to encrypt.
 * const dataToEncrypt = {
 *   age: 30,
 *   name: 'Sullie',
 *   city: 'Texas',
 * };
 *
 * // Encrypt the object.
 * const encryptedValue = xorInstance.encrypt(dataToEncrypt);
 * console.log('Encrypted:', encryptedValue);
 *
 * // Decrypt the string.
 * const decryptedObject = xorInstance.decrypt(encryptedValue);
 * console.log('Decrypted:', decryptedObject);
 */
/* eslint-enable */

( function( root, factory ) {
	const pluginName = 'WPFormsXOR';

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
	 * Plugin Object.
	 *
	 * @since 1.8.6
	 *
	 * @class Plugin
	 */
	class Plugin {
		// Default settings.
		static defaults = {
			// The encryption key is a crucial component in encryption algorithms,
			// including the XOR encryption used in the provided code.
			// The key is a value used to control the transformation
			// of the data during encryption and decryption.
			key: 42, // You can use any number.
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
		 * Encrypt an object using XOR encryption.
		 *
		 * @since 1.8.6
		 *
		 * @param {Object} obj The object to encrypt.
		 *
		 * @return {string} The encrypted object as a string.
		 */
		encrypt( obj ) {
			// Bail if the input is not an object.
			if ( typeof obj !== 'object' ) {
				throw new PluginError( 'Invalid input. Expected an object for encryption.' );
			}

			// Initialize an empty string to store the encrypted result.
			let result = '';

			try {
				// Convert the object to a JSON string.
				const jsonString = JSON.stringify( obj );

				// Iterate through each character of the JSON string.
				for ( let i = 0; i < jsonString.length; i++ ) {
					// XOR each character with the encryption key and append to the result.
					// eslint-disable-next-line no-bitwise
					result += String.fromCharCode( jsonString.charCodeAt( i ) ^ this.args.key );
				}
			} catch ( error ) {
				// Throw a PluginError if there's an issue during JSON stringification.
				throw new PluginError( 'Error during encryption. Unable to stringify the object.' );
			}

			return result;
		}

		/**
		 * Decrypt a string using XOR encryption.
		 *
		 * @since 1.8.6
		 *
		 * @param {string} encryptedString The encrypted string.
		 *
		 * @return {Object} The decrypted object.
		 */
		decrypt( encryptedString = '' ) {
			// Bail if the input is not a string.
			if ( typeof encryptedString !== 'string' ) {
				throw new PluginError( 'Invalid input. Expected a string for decryption.' );
			}

			// Bail if there is no encrypted string.
			if ( ! encryptedString ) {
				return {}; // Return an empty object.
			}

			let result = '';

			try {
				// Iterate through each character of the encrypted string.
				for ( let i = 0; i < encryptedString.length; i++ ) {
					// XOR each character with the decryption key and append to the result.
					// eslint-disable-next-line no-bitwise
					result += String.fromCharCode( encryptedString.charCodeAt( i ) ^ this.args.key );
				}

				// Parse the decrypted result as JSON or return an empty object if parsing fails.
				return JSON.parse( result || '{}' );
			} catch ( error ) {
				// Throw an error if there's an issue during decryption or parsing.
				throw new PluginError( 'Error during decryption. Unable to parse decrypted data.' );
			}
		}
	}

	return Plugin;
} ) );
