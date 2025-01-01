import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';

/**
 * Returns the class names.
 *
 * @param {...string} classes The class names.
 *
 * @return {string} Returns the class names.
 */
const classNames = (...classes) => classes.filter(Boolean).join(" ");

/**
 * Creates a debounced function that delays its execution until after the specified delay.
 *
 * The debounce() function can also be used from lodash.debounce package in future.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds before the function is executed.
 *
 * @returns {Function} A debounced function.
 */
const debounce = ( func, delay ) => {
	let timer;
	function debounced( ...args ) {
		clearTimeout( timer );
		timer = setTimeout( () => func( ...args ), delay );
	};

	// Attach a `cancel` method to clear the timeout.
	debounced.cancel = () => {
		clearTimeout( timer );
	};

	return debounced;
};

/**
 * Returns the Astra Pro title.
 *
 * @return {string} Returns the Astra Pro title.
 */
const getAstraProTitle = () => {
	return astra_admin.pro_installed_status
		? __("Activate Now", "astra")
		: __("Upgrade Now", "astra");
};

/**
 * Returns the spinner SVG text.
 *
 * @return {string} Returns the spinner SVG text..
 */
const getSpinner = () => {
	return `
		<svg class="animate-spin installer-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
		</svg>
	`;
};

/**
 * A function to save astra admin settings.
 *
 * @function
 *
 * @param {string}   key                - Settings key.
 * @param {string}   value              - The data to send.
 * @param {Function} dispatch           - The dispatch function.
 * @param {Object}   abortControllerRef - The ref object with to hold abort controller.
 *
 * @return {Promise} Returns a promise representing the processed request.
 */
const saveSetting = debounce(
	(key, value, dispatch, abortControllerRef = { current: {} }) => {
		// Abort any previous request.
		if (abortControllerRef.current[key]) {
			abortControllerRef.current[key]?.abort();
		}

		// Create a new AbortController.
		const abortController = new AbortController();
		abortControllerRef.current[key] = abortController;

		const formData = new window.FormData();

		formData.append("action", "astra_update_admin_setting");
		formData.append("security", astra_admin.update_nonce);
		formData.append("key", key);
		formData.append("value", value);

		return apiFetch({
			url: astra_admin.ajax_url,
			method: "POST",
			body: formData,
			signal: abortControllerRef.current[key]?.signal, // Pass the signal to the fetch request.
		})
			.then(() => {
				dispatch({
					type: "UPDATE_SETTINGS_SAVED_NOTIFICATION",
					payload: __("Successfully saved!", "astra"),
				});
			})
			.catch((error) => {
				// Ignore if it is intentionally aborted.
				if (error.name === "AbortError") {
					return;
				}
				console.error("Error during API request:", error);
				dispatch({
					type: "UPDATE_SETTINGS_SAVED_NOTIFICATION",
					payload: __("An error occurred while saving.", "astra"),
				});
			});
	},
	300
);

export { classNames, debounce, getAstraProTitle, getSpinner, saveSetting };
