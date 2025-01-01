import { memo } from '@wordpress/element';
import ExitConfirmationPopover from './exit-confirmation-popover';

const AIBuilderExitButton = ( { exitButtonClassName } ) => {
	const handleClosePopup = () => {
		window.location.href = `${ aiBuilderVars.adminUrl }`;
	};

	return (
		<ExitConfirmationPopover
			onExit={ handleClosePopup }
			exitButtonClassName={ exitButtonClassName }
		/>
	);
};

export default memo( AIBuilderExitButton );
