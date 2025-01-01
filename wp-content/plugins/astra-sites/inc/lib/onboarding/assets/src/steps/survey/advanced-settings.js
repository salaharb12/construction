import React from 'react';
import Tooltip from '../../components/tooltip/tooltip';
import { __ } from '@wordpress/i18n';
// import { decodeEntities } from '@wordpress/html-entities';
import { useStateValue } from '../../store/store';
import ICONS from '../../../icons';
import { whiteLabelEnabled } from '../../utils/functions';
const { themeStatus, firstImportStatus, analytics } = starterTemplates;
import ToggleSwitch from '../../components/toggle-switch';
import FilesAndFolderImg from '../../../images/files-folder.png';
import { Checkbox, Field, Label } from '@headlessui/react';
const AdvancedSettings = () => {
	const [
		{ reset, themeActivateFlag, analyticsFlag, allowResetSite },
		dispatch,
	] = useStateValue();

	const updateAnalyticsFlag = () => {
		dispatch( {
			type: 'set',
			analyticsFlag: ! analyticsFlag,
		} );
	};
	const updateThemeFlag = () => {
		dispatch( {
			type: 'set',
			themeActivateFlag: ! themeActivateFlag,
			customizerImportFlag: ! themeActivateFlag,
		} );
	};

	const updateResetValue = () => {
		dispatch( {
			type: 'set',
			reset: ! reset,
		} );
	};

	const updateAllowResetSite = () => {
		dispatch( {
			type: 'set',
			allowResetSite: ! allowResetSite,
		} );
	};

	const showAdvancedOption =
		( ! whiteLabelEnabled() && analytics !== 'yes' ) ||
		'installed-and-active' !== themeStatus;

	return (
		<div className="survey-form-advanced-wrapper show-section">
			<p className="label-text row-label !mb-2" role="presentation">
				{ __( 'Advanced Options', 'astra-sites' ) }
			</p>
			{ showAdvancedOption && (
				<div className="survey-advanced-section mb-6">
					<div className="border border-solid border-border-primary rounded-md grid grid-cols-1 !divide-y !divide-border-primary divide-solid divide-x-0">
						{ 'installed-and-active' !== themeStatus && (
							<div className="items-center py-3 px-4 grid grid-cols-[1fr_min-content] !gap-2">
								<div className="flex-1 flex items-center space-x-2">
									<h6 className="text-sm !leading-6 text-zip-app-heading">
										{ ' ' }
										{ __(
											'Install & Activate Astra Theme',
											'astra-sites'
										) }
									</h6>
									<Tooltip
										content={ __(
											'To import the site in the original format, you would need the Astra theme activated. You can import it with any other theme, but the site might lose some of the design settings and look a bit different.',
											'astra-sites'
										) }
									>
										{ ICONS.questionMarkNoFill }
									</Tooltip>
								</div>
								<div>
									<ToggleSwitch
										onChange={ updateThemeFlag }
										value={ themeActivateFlag }
										requiredClass={
											themeActivateFlag
												? 'bg-accent-st-secondary'
												: 'bg-border-tertiary'
										}
									/>
								</div>
							</div>
						) }
						{ ! whiteLabelEnabled() && analytics !== 'yes' && (
							<div className="items-center py-3 px-4 grid grid-cols-[1fr_min-content] gap-4">
								<div className="flex-1 flex items-center space-x-2">
									<h6 className="text-sm !leading-6 text-zip-app-heading">
										{ ' ' }
										{ __(
											'Share Non-Sensitive Data',
											'astra-sites'
										) }
									</h6>
									<Tooltip
										interactive={ true }
										content={
											<div>
												{ __(
													'Help our developers build better templates and products for you by sharing anonymous and non-sensitive data about your website.',
													'astra-sites'
												) }{ ' ' }
												<a
													href="https://store.brainstormforce.com/usage-tracking/?utm_source=wp_dashboard&utm_medium=general_settings&utm_campaign=usage_tracking"
													target="_blank"
													rel="noreferrer noopener"
												>
													{ __(
														'Learn More',
														'astra-sites'
													) }
												</a>
											</div>
										}
									>
										{ ICONS.questionMarkNoFill }
									</Tooltip>
								</div>
								<div>
									<ToggleSwitch
										onChange={ updateAnalyticsFlag }
										value={ analyticsFlag }
										requiredClass={
											analyticsFlag
												? 'bg-accent-st-secondary'
												: 'bg-border-tertiary'
										}
									/>
								</div>
							</div>
						) }
					</div>
				</div>
			) }
			{ 'yes' === firstImportStatus ? (
				<div className="flex items-center rounded-md p-4 border-solid border gap-6 border-[#FB7E0A1F] bg-[#FB7E0A0F]">
					<div className="mb-1">
						<p className="text-sm text-body-text !leading-6">
							{ __(
								'It looks like you already have a website created with Starter Templates. Check this box to keep your existing content and images.',
								'astra-sites'
							) }
						</p>
						<Field className="flex mt-2 gap-2">
							<Checkbox
								className="group flex justify-center items-center border-2 size-4 border-solid border-border-secondary rounded data-[checked]:bg-accent-st-secondary data-[checked]:border-accent-st-secondary"
								checked={ ! reset }
								onChange={ updateResetValue }
							>
								<svg
									width="10"
									height="8"
									viewBox="0 0 10 8"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="opacity-0 group-data-[checked]:opacity-100"
								>
									<path
										d="M9 1L3.5 6.5L1 4"
										stroke="white"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Checkbox>
							<Label className="text-sm leading-4 text-nav-active font-medium cursor-pointer">
								{ __( 'Keep existing data!', 'astra-sites' ) }
							</Label>
						</Field>
					</div>
					<div className="max-w-[104px] w-full">
						<img
							className="w-full"
							src={ FilesAndFolderImg }
							alt=""
						/>
					</div>
				</div>
			) : (
				<div className="flex items-center rounded-md p-4 border-solid border gap-6 border-[#FB7E0A1F] bg-[#FB7E0A0F]">
					<div className="mb-1">
						<p className="text-sm text-body-text !leading-6">
							{ __(
								'This will overwrite your site settings and add new content. You might want to backup your site before proceeding.',
								'astra-sites'
							) }
						</p>
						<Field className="flex mt-2 gap-2">
							<Checkbox
								className="group flex justify-center items-center border-2 size-4 border-solid border-border-secondary rounded data-[checked]:bg-accent-st-secondary data-[checked]:border-accent-st-secondary"
								checked={ allowResetSite }
								onChange={ updateAllowResetSite }
							>
								<svg
									width="10"
									height="8"
									viewBox="0 0 10 8"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="opacity-0 group-data-[checked]:opacity-100"
								>
									<path
										d="M9 1L3.5 6.5L1 4"
										stroke="white"
										strokeWidth="1.4"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Checkbox>
							<Label className="text-sm leading-4 text-nav-active font-medium cursor-pointer">
								{ __(
									"I understand, let's go!",
									'astra-sites'
								) }
							</Label>
						</Field>
					</div>
					<div className="max-w-[104px] w-full">
						<img
							className="w-full"
							src={ FilesAndFolderImg }
							alt=""
						/>
					</div>
				</div>
			) }
		</div>
	);
};

export default AdvancedSettings;
