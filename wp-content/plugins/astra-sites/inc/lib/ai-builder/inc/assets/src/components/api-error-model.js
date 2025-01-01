import { useSelect, useDispatch } from '@wordpress/data';
import { ExclamationTriangleColorfulIcon } from '../ui/icons';
import { STORE_KEY } from '../store';
import Modal from './modal';
import ModalTitle from './modal-title';
import Button from './button';
import { __, sprintf } from '@wordpress/i18n';

const ApiErrorModel = ( { onOpenChange } ) => {
	const { setApiErrorModal } = useDispatch( STORE_KEY );

	const { apiErrorModal } = useSelect( ( select ) => {
		const { getApiErrorModalInfo } = select( STORE_KEY );

		return {
			apiErrorModal: getApiErrorModalInfo(),
		};
	} );

	return (
		<Modal
			open={ apiErrorModal.open }
			setOpen={ ( toggle ) => {
				if ( typeof onOpenChange === 'function' ) {
					onOpenChange( toggle );
				}

				setApiErrorModal( {
					...apiErrorModal,
					open: toggle,
				} );
			} }
			width={ 550 }
			height="200"
			overflowHidden={ false }
		>
			<ModalTitle>
				<ExclamationTriangleColorfulIcon className="w-10 h-10" />
				<span>{ __( 'Something went wrong', 'ai-builder' ) }</span>
			</ModalTitle>
			<div className="space-y-8">
				<div className="text-app-text text-base leading-6 space-y-6">
					<span>
						{ __(
							'Site creation failed due to an unexpected error. Please try again or reach out for assistance if the issue persists.',
							'ai-builder'
						) }
					</span>
					<div className="text-app-text text-base !font-semibold leading-6">
						{ __(
							'Additional technical information:',
							'ai-builder'
						) }
					</div>
					<div>
						{ sprintf(
							/* translators: %s: message */
							__( 'Error Message: %1$s', 'ai-builder' ),
							apiErrorModal.message
						) }
					</div>

					<div className="p-4 border border-red-400 rounded-md bg-red-50 overflow-auto max-h-96">
						<pre className="p-2 whitespace-pre-wrap rounded-md  overflow-auto max-h-full">
							{ JSON.stringify( apiErrorModal.error, null, 2 ) }
						</pre>
					</div>
				</div>
				<div className="items-center gap-3 justify-center mt-4">
					<Button
						onClick={ () => {
							window.location.href = aiBuilderVars.dashboard_url;
						} }
						variant="primary"
						size="base"
						className="w-full"
					>
						<div className="flex items-center justify-center gap-2">
							{ __( 'Exit to Dashboard', 'ai-builder' ) }
						</div>
					</Button>
					<a
						href={ aiBuilderVars.filtered_data.contact_url }
						className="group flex items-center justify-center mt-6 text-base"
						target="_blank"
						rel="noopener noreferrer"
					>
						{ aiBuilderVars.filtered_data.contact_text }
					</a>
				</div>
			</div>
		</Modal>
	);
};

export default ApiErrorModel;
