import { Radio, RadioGroup } from '@headlessui/react';
import { __ } from '@wordpress/i18n';

import React, { useEffect, useState } from 'react';

import {
	checkFileSystemPermissions,
	checkRequiredPlugins,
	getDemo,
} from '../../steps/import-site/import-utils';
import { useStateValue } from '../../store/store';
import { classNames } from '../../utils/functions';

import './style.scss';

const { imageDir } = starterTemplates;

const ChooseEcommerce = () => {
	const storedState = useStateValue();
	const [
		{ selectedTemplateID, allSitesData, currentCustomizeIndex },
		dispatch,
	] = useStateValue();
	const [ checkedTemplateID, setCheckedTemplateID ] =
		useState( selectedTemplateID );

	const selectedTemplate = allSitesData[ `id-${ selectedTemplateID }` ];
	const relatedTemplateID =
		selectedTemplate?.related_ecommerce_template || '';

	const changeEcommerceTemplate = async ( event ) => {
		const templateValue = parseInt( event?.value );

		// Update selected template ID in the state and UI
		dispatch( {
			type: 'set',
			templateId: event?.id,
		} );
		setCheckedTemplateID( templateValue );
		// Update stored state for selected plugin and trigger further checks
		storedState[ 0 ].selectedEcommercePlugin = event?.id;
		await getDemo( templateValue, storedState );
		await checkRequiredPlugins( storedState );
		checkFileSystemPermissions( storedState );
	};

	useEffect( () => {
		setCheckedTemplateID( selectedTemplateID );
	}, [ selectedTemplateID, relatedTemplateID ] );

	useEffect( () => {
		if ( ! relatedTemplateID ) {
			dispatch( {
				type: 'set',
				currentCustomizeIndex: currentCustomizeIndex + 1, // Skip 1 step.
			} );
		}
	}, [ relatedTemplateID, currentCustomizeIndex, dispatch ] );

	const platforms = [
		{
			name: __( 'SureCart', 'astra-sites' ),
			value: selectedTemplateID,
			id: 'surecart',
			icon: `${ imageDir }surecart-icon.svg`,
			description: __(
				'Seamless all-in-one ecommerce platform for selling physical, digital, or subscription, products.',
				'astra-sites'
			),
			recommended: true,
		},
		{
			name: __( 'WooCommerce', 'astra-sites' ),
			value: relatedTemplateID,
			id: 'woocommerce',
			icon: `${ imageDir }woocommerce-icon.svg`,
			description: __(
				'Open source e-commerce plugin for WordPress.',
				'astra-sites'
			),
			recommended: false,
		},
	];

	return (
		<>
			<div className="w-full mt-2.5">
				<RadioGroup
					by="value"
					value={ platforms.find(
						( p ) => p.value === checkedTemplateID
					) }
					onChange={ changeEcommerceTemplate }
					aria-label={ __(
						'Choose E-commerce template',
						'astra-sites'
					) }
					className="space-y-2 flex flex-col gap-4"
				>
					{ platforms?.map( ( platform ) => (
						<Radio key={ platform.name } value={ platform }>
							{ ( { checked } ) => (
								<div
									className={ classNames(
										'w-full p-3 border border-button-disabled !border-solid rounded-lg bg-white cursor-pointer',
										checked &&
											'shadow-lg border-accent-st-secondary'
									) }
								>
									<div className="flex items-center justify-between p-1">
										<div className="flex items-center">
											<img
												className="size-6"
												alt={ platform?.name }
												src={ platform?.icon }
											/>
											<span className="ml-2 text-base font-semibold">
												{ platform?.name }
											</span>
										</div>
										<div className="flex gap-2 items-center">
											{ platform?.recommended && (
												<span className="border-solid border-[0.5px] border-[#BBF7D0] bg-alert-success-bg text-[#15803D] text-xs font-medium rounded-full px-2 py-0.5">
													{ __(
														'Recommended',
														'astra-sites'
													) }
												</span>
											) }
											<span
												className={ classNames(
													'flex size-4 border-2 border-button-disabled items-center justify-center border-solid rounded-full',
													checked &&
														'border-accent-st-secondary border-[5px]'
												) }
											></span>
										</div>
									</div>
									<div className="mt-1 p-1 pr-5 text-sm font-normal">
										<p>{ platform?.description }</p>
									</div>
								</div>
							) }
						</Radio>
					) ) }
				</RadioGroup>
			</div>
		</>
	);
};

export default ChooseEcommerce;
