import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { useStateValue } from '../../store/store';
const { imageDir } = starterTemplates;
import {
	FunnelIcon,
	HeartIcon,
	PlayCircleIcon,
	SquaresPlusIcon,
	CheckIcon,
	ChatBubbleLeftEllipsisIcon,
	WrenchIcon,
	PaintBrushIcon,
	Squares2X2Icon,
	QueueListIcon,
	ShoppingCartIcon,
	ArrowLongRightIcon,
	ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '../../utils/functions';
import { checkRequiredPlugins } from '../import-site/import-utils';
import Container from './container';
import Button from './button';
import Dropdown from './dropdown';

const ICON_SET = {
	heart: HeartIcon,
	'squares-plus': SquaresPlusIcon,
	funnel: FunnelIcon,
	'play-circle': PlayCircleIcon,
	'live-chat': ChatBubbleLeftEllipsisIcon,
	'page-builder': PaintBrushIcon,
	'contact-form': QueueListIcon,
	blog: Squares2X2Icon,
	ecommerce: ShoppingCartIcon,
};

const getPluginProps = ( id ) => {
	switch ( id ) {
		case 'surecart':
			return {
				icon: (
					<img
						src={ `${ imageDir }surecart-icon.svg` }
						alt="SureCart"
						className="w-5 h-5"
					/>
				),
				title: 'SureCart',
			};
		case 'woocommerce':
			return {
				icon: (
					<img
						src={ `${ imageDir }woocommerce-icon.svg` }
						alt="WooCommerce"
						className="w-5 h-5"
					/>
				),
				title: 'WooCommerce',
			};
		default:
			return {
				icon: <ShoppingCartIcon className="w-5 h-5" />,
				title: 'Ecommerce',
			};
	}
};
const EcommerceOptions = ( {
	ecomSupported,
	selectedEcom,
	onChange,
	disabled,
	dispatch,
} ) => {
	const [ open, setOpen ] = useState( false );

	const handleDropdownClick = ( event ) => {
		if ( disabled ) {
			return;
		}
		event.stopPropagation();
		setOpen( ! open );
	};

	const handleOptionClick = ( id, event ) => {
		if ( disabled ) {
			return;
		}
		event.stopPropagation();
		onChange( id );
		dispatch( {
			type: 'set',
			selectedEcommercePlugin: id,
		} );
		setOpen( false );
	};

	return (
		<div className="bg-[#F6FAFE] z-50 py-1 px-2 shadow-sm rounded-md items-center justify-center w-fit">
			<Dropdown
				width="w-36"
				trigger={
					<div
						className="flex items-center cursor-pointer gap-1.5"
						onClick={ handleDropdownClick }
					>
						<div className="flex items-center">
							{ getPluginProps( selectedEcom ).icon }
							<div className="ml-2">
								<p className="!text-xs leading-3 text-app-text">
									{ getPluginProps( selectedEcom ).title }
								</p>
							</div>
						</div>
						{ ! disabled && (
							<ChevronUpIcon
								className={ classNames(
									'w-3 h-3 text-app-active-icon',
									open ? 'transform rotate-180' : ''
								) }
							/>
						) }
					</div>
				}
				onOpenChange={ setOpen }
				disabled={ disabled }
			>
				{ ! disabled && (
					<div className="py-0.5 px-2 mx-auto bg-white rounded-md">
						{ ecomSupported.map( ( id, index ) => {
							const { icon, title } = getPluginProps( id );
							return (
								<Dropdown.Item
									key={ index }
									onClick={ ( event ) =>
										handleOptionClick( id, event )
									}
									className={ classNames(
										'flex items-center px-2 py-1 rounded-md cursor-pointer',
										'hover:bg-container-background hover:bg-opacity-100'
									) }
								>
									<div className="flex items-center">
										{ icon }
										<div className="ml-2">
											<p className="!text-xs leading-5 text-app-text">
												{ title }
											</p>
										</div>
									</div>
								</Dropdown.Item>
							);
						} ) }
					</div>
				) }
			</Dropdown>
		</div>
	);
};

const ClassicFeatures = () => {
	const [
		{
			requiredPlugins,
			siteFeatures,
			currentIndex,
			selectedTemplateID,
			isEcommerce,
			selectedEcommercePlugin,
		},
		dispatch,
	] = useStateValue();
	const storedState = useStateValue();
	const [ selectedEcom, setSelectedEcom ] = useState();
	const [ ecomSupported, setEcomSupported ] = useState( [
		'surecart',
		'woocommerce',
	] );

	useEffect( () => {
		if ( isEcommerce ) {
			const allSlugs = [
				...( requiredPlugins?.required_plugins?.active?.map(
					( plugin ) => plugin.slug
				) || [] ),
				...( requiredPlugins?.required_plugins?.inactive?.map(
					( plugin ) => plugin.slug
				) || [] ),
				...( requiredPlugins?.required_plugins?.notinstalled?.map(
					( plugin ) => plugin.slug
				) || [] ),
			];

			setEcomSupported( [ 'surecart', 'woocommerce' ] );

			if ( ! selectedEcom || selectedEcom !== selectedEcommercePlugin ) {
				if ( allSlugs?.includes( 'surecart' ) ) {
					setSelectedEcom( 'surecart' );
				} else {
					setSelectedEcom( 'woocommerce' ); // Default to WooCommerce if surecart is not found
				}
			}

			const updatedFeatures = siteFeatures.map( ( feature ) => {
				if ( feature.id === 'ecommerce' ) {
					return { ...feature, compulsory: true, enabled: true };
				}
				return feature;
			} );
			dispatch( {
				type: 'set',
				siteFeatures: updatedFeatures,
			} );
		} else {
			setEcomSupported( [ 'surecart', 'woocommerce' ] );
			setSelectedEcom( selectedEcom || 'surecart' ); // Default to 'surecart'

			// Ensure the ecommerce feature is not compulsory when no plugin is selected
			const updatedFeatures = siteFeatures.map( ( feature ) => {
				if ( feature.id === 'ecommerce' ) {
					return { ...feature, compulsory: false };
				}
				return feature;
			} );
			dispatch( {
				type: 'set',
				siteFeatures: updatedFeatures,
			} );
		}
	}, [ selectedTemplateID, isEcommerce, selectedEcommercePlugin ] );

	const handleToggleFeature = ( featureId ) => () => {
		const updatedFeatures = siteFeatures.map( ( feature ) => {
			if ( feature.compulsory ) {
				return feature;
			}
			if ( feature.id === featureId ) {
				return { ...feature, enabled: ! feature.enabled };
			}
			return feature;
		} );

		dispatch( {
			type: 'set',
			siteFeatures: updatedFeatures,
		} );
	};

	const setNextStep = async () => {
		dispatch( {
			type: 'set',
			currentIndex: currentIndex + 1,
		} );

		const enabledFeatureIds = siteFeatures
			.filter( ( component ) => component.enabled )
			.map( ( component ) => component.id );

		dispatch( {
			type: 'set',
			enabledFeatureIds,
		} );

		storedState[ 0 ].enabledFeatureIds = enabledFeatureIds;
		storedState[ 0 ].selectedEcommercePlugin = selectedEcom;

		await checkRequiredPlugins( storedState );
	};
	const skipStep = () => {
		dispatch( {
			type: 'set',
			currentIndex: currentIndex + 1,
		} );
	};
	return (
		<Container className="grid grid-cols-1 gap-8 auto-rows-auto !max-w-[55rem] w-full mx-auto">
			<div className="space-y-4 text-left">
				<div className="space-y-3">
					<div className="text-heading-text !text-[1.75rem] font-semibold leading-9">
						{ __( 'Select features', 'astra-sites' ) }
					</div>
					<p className="text-body-text !text-base font-normal leading-6">
						{ __(
							'Select the features you want on this website',
							'astra-sites'
						) }
					</p>
				</div>
			</div>
			{ /* Feature Cards */ }
			<div className="grid grid-cols-1 lg:grid-cols-2 auto-rows-auto gap-x-8 gap-y-5 w-full">
				{ siteFeatures.map( ( feature ) => {
					const isEcommerceFeature = feature.id === 'ecommerce';

					const FeatureIcon = ICON_SET?.[ feature?.icon ];
					return (
						<div
							key={ feature?.id }
							className={ classNames(
								'relative py-4 pl-4 pr-5 rounded-md shadow-sm border border-solid bg-white border-button-disabled transition-colors duration-150 ease-in-out',
								feature?.enabled && 'border-classic-button',
								'cursor-pointer'
							) }
						>
							<div className="flex items-start justify-start gap-3">
								<div className="p-0.5 shrink-0">
									{ FeatureIcon && (
										<FeatureIcon className="text-zip-body-text w-7 h-7" />
									) }
									{ ! FeatureIcon && (
										<WrenchIcon className="text-zip-body-text w-7 h-7" />
									) }
								</div>
								<div className="space-y-1 mr-0 w-full">
									<p className="p-0 m-0 !text-base !font-semibold !text-zip-app-heading !text-left">
										{ feature?.title }
									</p>
									<div className="flex justify-between items-start w-full">
										<p className="p-0 m-0 !text-sm !font-normal !text-zip-body-text">
											{ feature?.description }
										</p>
										<div
											className="relative z-10"
											onClick={ ( e ) => {
												e.stopPropagation();
												e.preventDefault();
											} }
										>
											{ isEcommerceFeature && (
												<EcommerceOptions
													ecomSupported={
														ecomSupported
													}
													selectedEcom={
														selectedEcom
													}
													onChange={ setSelectedEcom }
													disabled={ isEcommerce }
													dispatch={ dispatch }
												/>
											) }
										</div>
									</div>
								</div>
							</div>
							{ /* Check mark */ }

							<span
								className={ classNames(
									'inline-flex absolute top-4 right-4 p-[0.1875rem] border border-solid border-zip-app-inactive-icon rounded',
									feature?.enabled &&
										'border-classic-button bg-classic-button',
									feature?.compulsory &&
										'border-button-disabled bg-button-disabled'
								) }
							>
								<CheckIcon
									className="w-2.5 h-2.5 text-white"
									strokeWidth={ 4 }
								/>
							</span>
							{ ! feature?.compulsory && (
								<div
									className="absolute inset-0 cursor-pointer"
									onClick={ handleToggleFeature(
										feature?.id
									) }
								/>
							) }
						</div>
					);
				} ) }
			</div>
			<div className="flex justify-between items-center mt-2">
				<div className="flex gap-4">
					<Button
						variant="primary"
						className="!bg-classic-button border border-solid border-classic-button flex gap-2 items-center h-11 text-[15px] leading-[15px]"
						onClick={ setNextStep }
					>
						<span>{ __( 'Continue', 'astra-sites' ) }</span>
						<ArrowLongRightIcon className="w-4 h-4 !fill-none" />
					</Button>

					<Button
						variant="blank"
						className="!bg-transparent !text-classic-button border border-solid border-classic-button px-4 py-2 rounded inline-flex items-center justify-center h-11 text-[15px] leading-[15px]"
						onClick={ () =>
							dispatch( {
								type: 'set',
								currentIndex: currentIndex - 1,
							} )
						}
					>
						{ __( 'Back', 'astra-sites' ) }
					</Button>
				</div>
				<a
					className="text-zip-body-text no-underline text-base font-normal cursor-pointer"
					onClick={ skipStep }
				>
					{ __( 'Skip this step', 'astra-sites' ) }
				</a>
			</div>
		</Container>
	);
};
export default ClassicFeatures;
