import { useEffect } from 'react';
import { debounce } from '@astra-utils/helpers';

/**
 * A hook that wraps a callback function with a debounce effect.
 *
 * This hook is designed to delay the execution of a function until after a specified delay.
 * It's particularly useful for handling events that occur rapidly, such as typing in a text input.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The delay in milliseconds before the function is executed.
 * @param {Array} dependencies - An array of dependencies that trigger the effect.
 */
function useDebounceEffect( callback, delay, dependencies ) {
	useEffect( () => {
		const debouncedCallback = debounce( callback, delay );

		debouncedCallback();

		// Cleanup on unmount or when dependencies change.
		return () => debouncedCallback.cancel && debouncedCallback.cancel();
	}, [ callback, delay, ...dependencies ] );
}

export default useDebounceEffect;
