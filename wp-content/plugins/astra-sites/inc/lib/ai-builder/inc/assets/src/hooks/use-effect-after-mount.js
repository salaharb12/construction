import { useEffect, useRef } from 'react';

/**
 * A useEffect hook does that not run on mount, but only on subsequent updates.
 *
 * @param  effect
 * @param  deps
 *
 */
const useEffectAfterMount = ( effect, deps ) => {
	const isMounted = useRef( false );

	useEffect( () => {
		let cleanup;

		if ( isMounted.current ) {
			cleanup = effect();
		}

		isMounted.current = true;

		return cleanup;
	}, deps );
};

export default useEffectAfterMount;
