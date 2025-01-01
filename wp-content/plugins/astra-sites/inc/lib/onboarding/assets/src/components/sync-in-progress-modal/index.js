import { __ } from '@wordpress/i18n';
import ICONS from '../../../icons';
import { classNames } from '../../utils/functions';

const SyncInProgressModal = ( { open = false } ) => {
	return (
		<div
			className={ classNames(
				'w-full absolute hidden h-screen top-0 left-0 bg-st-background-secondary/80',
				open && 'flex justify-center items-center'
			) }
		>
			<div className="bg-white w-[296px] rounded-lg shadow-2xl flex flex-col items-center justify-center -mt-36 p-5">
				<div className="flex items-center justify-center text-blue-500 mb-3 animate-spin">
					{ ICONS.reloadIcon }
				</div>
				<p className="!text-base !font-semibold text-nav-active">
					{ __( 'Syncing Templates Library…', 'astra-sites' ) }
				</p>
				<p className="text-sm text-[#4B5563] text-center !mt-1">
					{ __(
						'Updating the library to include all the latest templates.',
						'astra-sites'
					) }
				</p>
			</div>
		</div>
	);
};

export default SyncInProgressModal;
