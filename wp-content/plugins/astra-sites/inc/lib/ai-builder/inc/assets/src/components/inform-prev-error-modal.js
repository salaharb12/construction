import { memo, renderToString, useState } from '@wordpress/element';
import Modal from './modal';
import { useSelect, useDispatch } from '@wordpress/data';
import { ExclamationTriangleColorfulIcon } from '../ui/icons';
import ModalTitle from './modal-title';
import { __, sprintf } from '@wordpress/i18n';
import Button from './button';
import { STORE_KEY } from '../store';
import { RadioGroup } from '@headlessui/react';
import { useNavigateSteps } from '../router';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import apiFetch from '@wordpress/api-fetch';
import { setLocalStorageItem, toastBody } from '../helpers';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';

const supportLink = (
	<a
		href="https://wpastra.com/contact"
		target="_blank"
		className="text-accent-st"
		rel="noreferrer"
	>
		{ __( 'here', 'ai-builder' ) }
	</a>
);

const InformPreviousErrorModal = ( {
	open,
	setOpen,
	onConfirm,
	errorString,
} ) => {
	const { nextStep } = useNavigateSteps();
	const {
		setWebsiteInfoAIStep,
		updateImportAiSiteData,
		setWebsiteNameAIStep,
		setWebsiteImagesAIStep,
		setWebsiteLanguageAIStep,
		setWebsiteSelectedTemplateAIStep,
		setFullOnboardingState,
	} = useDispatch( STORE_KEY );

	// const handleBack = () => {
	// 	if ( typeof setOpen !== 'function' ) {
	// 		return;
	// 	}
	// 	setOpen( false );
	// };

	const handleConfirm = () => {
		if ( typeof onConfirm !== 'function' ) {
			return;
		}
		onConfirm();
	};
	const { failedSites } = useSelect( ( select ) => {
		const { getFailedSites } = select( STORE_KEY );

		return {
			failedSites: getFailedSites(),
		};
	}, [] );

	const [ selected, setSelected ] = useState(
		failedSites?.length > 0 ? failedSites[ 0 ] : ''
	);

	function classNames( ...classes ) {
		return classes.filter( Boolean ).join( ' ' );
	}

	const setStepData = async ( stepData ) => {
		try {
			const response = await apiFetch( {
				path: 'zipwp/v1/set-step-data',
				method: 'POST',
				headers: {
					'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
				},
				data: {
					business_details: JSON.stringify( stepData ),
				},
			} );
			console.log( response );
			if ( response.success ) {
				console.log( 'Data reset!' );
			} else {
				//  Handle error.
				throw new Error( response?.data?.data );
			}
		} catch ( error ) {
			toast.error( toastBody( error ) );
		}
	};

	const retryImport = async () => {
		const websiteData = selected;
		await setStepData( websiteData?.step_data );
		setLocalStorageItem(
			'ai-builder-onboarding-details',
			websiteData?.local_storage
		);

		setFullOnboardingState( {
			stepData: {
				...websiteData?.local_storage.stepData,
			},
		} );
		setWebsiteInfoAIStep( websiteData );
		setWebsiteNameAIStep( websiteData.businessName );
		setWebsiteLanguageAIStep( websiteData?.step_data?.language );
		setWebsiteImagesAIStep( websiteData?.step_data?.images );
		setWebsiteSelectedTemplateAIStep( websiteData?.step_data?.template );
		updateImportAiSiteData( {
			templateId: websiteData?.uuid,
			importErrorMessages: {},
			importErrorResponse: [],
			importError: false,
			reset: true,
		} );
		nextStep();
	};

	const convertToUTC = ( dateString ) => {
		const date = new Date( dateString );
		return date.toUTCString();
	};

	return (
		<Modal
			open={ open }
			setOpen={ setOpen }
			className="sm:w-full sm:max-w-2xl"
		>
			<ModalTitle>
				<ExclamationTriangleColorfulIcon className="w-6 h-6 text-alert-success" />
				<h5 className="text-lg text-zip-app-heading">
					{ __(
						'Problem Detected in Previous Site Creation!',
						'ai-builder'
					) }
				</h5>
			</ModalTitle>
			<p className="!mt-3 text-sm leading-5 font-normal text-zip-body-text">
				{ __(
					'We encountered the following errors while creating your previous site:',
					'ai-builder'
				) }
			</p>
			<div className="!my-4">
				<div className="mb-4 text-zip-body-text text-sm font-normal leading-6 p-3 border border-solid border-border-primary rounded-md">
					{ errorString ||
						__(
							'Not enough information to display.',
							'ai-builder'
						) }
				</div>

				{ failedSites?.length > 0 ? (
					<p
						className="!mb-4 text-sm leading-5 font-normal text-zip-body-text"
						dangerouslySetInnerHTML={ {
							__html: sprintf(
								// translators: %s: support link
								__(
									'If you want to retry the import, select a saved site below then click on the “Retry Import” button. Or contact our support %1$s.',
									'ai-builder'
								),
								renderToString( supportLink )
							),
						} }
					></p>
				) : (
					<p
						className="!mb-4 text-sm leading-5 font-normal text-zip-body-text"
						dangerouslySetInnerHTML={ {
							__html: sprintf(
								// translators: %s: support link
								__(
									'If you proceed without fixing these issues, you may encounter the same errors again, which could exhaust your AI site creation attempts. If you need help, feel free to contact us %1$s. Do you still want to continue?',
									'ai-builder'
								),
								renderToString( supportLink )
							),
						} }
					></p>
				) }
				<Tooltip
					id={ 'my-tooltip' }
					className="z-50 h-fit max-w-96 md:max-w-[544px] !text-[14px]"
				/>
				<div className="max-h-52 overflow-y-auto failed-site-container overflow-x-hidden w-auto">
					<fieldset
						aria-label="Privacy setting"
						className="flex flex-col"
					></fieldset>
					<RadioGroup
						value={ selected }
						onChange={ setSelected }
						className="overflow-visible"
						style={ { width: 'inherit' } }
					>
						{ failedSites?.map( ( failedSite, settingIdx ) => (
							<RadioGroup.Option
								key={ failedSite.businessName }
								value={ failedSite }
								className={ ( { checked } ) =>
									classNames(
										settingIdx === 0
											? 'rounded-tl-md rounded-tr-md'
											: '',
										settingIdx === failedSites.length - 1
											? 'rounded-bl-md rounded-br-md'
											: '',
										'group relative flex cursor-pointer border border-gray-200 px-3 py-[10px] focus:outline-none items-center',
										checked
											? 'bg-zip-app-highlight-bg border-border-tertiary z-10'
											: ''
									)
								}
							>
								{ ( { checked } ) => (
									<>
										<span
											className={ classNames(
												checked
													? 'bg-transparent border border-accent-hover-st/80'
													: 'bg-transparent border-border-tertiary',
												'flex size-5 cursor-pointer items-center justify-center rounded-full border p-[2px]'
											) }
										>
											<span
												className={ classNames(
													checked
														? 'size-3.5 rounded-full bg-accent-st'
														: 'size-3.5 bg-transparent'
												) }
											></span>
										</span>
										<span className="ml-3 flex flex-col">
											<RadioGroup.Label
												as="span"
												className={ classNames(
													'block text-sm font-semibold text-slate-900'
												) }
											>
												{ failedSite.businessName }
											</RadioGroup.Label>
											<RadioGroup.Description
												as="span"
												className={ classNames(
													'block text-sm relative group mt-0.5'
												) }
											>
												<span
													data-tooltip-id={
														'my-tooltip'
													}
													data-tooltip-content={
														failedSite.businessDesc
													}
													className="block text-sm text-body-text font-normal truncate max-w-96 md:max-w-[544px]"
												>
													{ failedSite.businessDesc }
												</span>
											</RadioGroup.Description>
											<p className="text-xs leading-5 font-normal text-secondary-text mt-0.5">
												{ __(
													'Created On: ',
													'ai-builder'
												) +
													convertToUTC(
														failedSite.created
													) }
											</p>
										</span>
									</>
								) }
							</RadioGroup.Option>
						) ) }
					</RadioGroup>
				</div>

				{ failedSites?.length > 0 && (
					<p className="!my-4 text-xs leading-5 font-normal text-secondary-text flex">
						<ExclamationCircleIcon className="w-5 h-5 mr-2" />
						{ __(
							'Importing saved sites won’t be exhausting your AI site generation count.',
							'ai-builder'
						) }
					</p>
				) }
				<div className="space-x-4 flex justify-between">
					{ failedSites?.length > 0 && (
						<Button
							className="w-full shadow-lg"
							variant="primary"
							onClick={ retryImport }
						>
							{ __( 'Retry Import', 'ai-builder' ) }
						</Button>
					) }
					<Button
						className="w-full shadow-lg"
						variant={ classNames(
							failedSites?.length > 0 ? 'white' : 'primary'
						) }
						onClick={ handleConfirm }
					>
						{ __( 'Start Building', 'ai-builder' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default memo( InformPreviousErrorModal );
