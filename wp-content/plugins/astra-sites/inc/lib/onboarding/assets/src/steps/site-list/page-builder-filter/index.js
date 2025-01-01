import React, { useState } from 'react';
import { ToggleDropdown } from '@brainstormforce/starter-templates-components';
import { __ } from '@wordpress/i18n';
import { useStateValue } from '../../../store/store';
import { initialState } from '../../../store/reducer';
const { imageDir, isElementorDisabled, isBeaverBuilderDisabled } =
	starterTemplates;

import Tippy from '@tippyjs/react/headless';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../../../components/index';
import { getStepIndex } from '../../../utils/functions';

import { AILogoIcon } from '../../ui/icons';

const zipPlans = astraSitesVars?.zip_plans;
const sitesRemaining = zipPlans?.plan_data?.remaining;
const aiSitesRemainingCount = sitesRemaining?.ai_sites_count;
const PageBuilder = ( { placement = 'bottom-end', isDisabled } ) => {
	const [
		{ builder, currentIndex, dismissAINotice, limitExceedModal },
		dispatch,
	] = useStateValue();
	const [ show, setShow ] = useState(
		dismissAINotice === 'true' ? false : true
	);

	const dismissAIPopup = () => {
		setShow( false );
		const content = new FormData();
		content.append( 'action', 'astra-sites-dismiss-ai-promotion' );
		content.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
		content.append( 'dismiss_ai_promotion', true );
		fetch( ajaxurl, {
			method: 'post',
			body: content,
		} );
		dispatch( {
			type: 'set',
			dismissAINotice: 'true',
		} );
	};

	const dismissAiPopup = () => {
		setShow( false );
	};

	if ( builder === 'fse' ) {
		return null;
	}

	const isLimitReached =
		typeof aiSitesRemainingCount === 'number' && aiSitesRemainingCount <= 0;

	const buildersList = [
		{
			id: 'gutenberg',
			title: __( 'Block Editor', 'astra-sites' ),
			image: `${ imageDir }block-editor.svg`,
			extraText: '',
		},
		{
			id: 'elementor',
			title: __( 'Elementor', 'astra-sites' ),
			image: `${ imageDir }elementor.svg`,
			extraText: '',
		},
		{
			id: 'beaver-builder',
			title: __( 'Beaver Builder', 'astra-sites' ),
			image: `${ imageDir }beaver-builder.svg`,
			extraText: '',
		},
		{
			id: 'ai-builder',
			title: __( 'AI Website Builder', 'astra-sites' ),
			image: `${ imageDir }ai-builder.svg`,
			extraText: __( 'Hot!', 'astra-sites' ),
		},
	];

	if ( isElementorDisabled === '1' ) {
		// Find the index of the Elementor builder in the array.
		const indexToRemove = buildersList.findIndex(
			( pageBuilder ) => pageBuilder.id === 'elementor'
		);

		// Remove the Elementor builder if it exists.
		if ( indexToRemove !== -1 ) {
			buildersList.splice( indexToRemove, 1 );
		}
	}

	if ( isBeaverBuilderDisabled === '1' ) {
		// Find the index of the Beaver builder in the array.
		const indexToRemove = buildersList.findIndex(
			( pageBuilder ) => pageBuilder.id === 'beaver-builder'
		);

		// Remove the Beaver builder if it exists.
		if ( indexToRemove !== -1 ) {
			buildersList.splice( indexToRemove, 1 );
		}
	}

	const handleBuildWithAIPress = () => {
		if (
			typeof aiSitesRemainingCount === 'number' &&
			aiSitesRemainingCount <= 0
		) {
			dispatch( {
				type: 'set',
				limitExceedModal: {
					...limitExceedModal,
					open: true,
				},
			} );
			return;
		}
		const content = new FormData();
		content.append( 'action', 'astra-sites-change-page-builder' );
		content.append( '_ajax_nonce', astraSitesVars?._ajax_nonce );
		content.append( 'page_builder', 'ai-builder' );
		fetch( ajaxurl, {
			method: 'post',
			body: content,
		} );
		if ( show ) {
			dismissAIPopup();
		}
		window.location.href =
			astraSitesVars?.adminURL + 'themes.php?page=ai-builder';
	};

	// dont show page builder selection on page builder screen (i.e. ci=1)
	if ( currentIndex === 1 ) {
		return;
	}

	return (
		<div className="relative">
			<Tippy
				visible={ show }
				arrow={ false }
				offset={ [ 60, 8 ] }
				render={ ( attrs ) =>
					currentIndex === getStepIndex( 'site-list' ) && (
						<motion.div
							className="flex flex-col items-start gap-5 min-w-[304px] bg-white rounded-lg shadow-lg p-4 border border-button-disabled"
							{ ...attrs }
						>
							<div
								className="flex-col flex bg-white text-left relative rounded-xl max-w-[356px]"
								tabIndex="0"
							>
								<AILogoIcon />
								<div className="mt-2 mb-1 text-heading-text flex gap-2">
									<span className="text-base font-semibold leading-1">
										{ __(
											'Build website 10x faster!',
											'astra-sites'
										) }
									</span>
								</div>
								<div className="zw-sm-normal text-body-text">
									{ ' ' }
									{ __(
										'Experience the future of website building.',
										'astra-sites'
									) }{ ' ' }
								</div>
								<div className="pt-4 mt-auto flex gap-5 items-center">
									<Button
										className="!p-2 !px-3"
										onClick={ handleBuildWithAIPress }
									>
										<span className="text-xs">
											{ __(
												'Try AI Builder',
												'astra-sites'
											) }
										</span>{ ' ' }
										<ArrowRightIcon className="size-4 ml-2" />
									</Button>
									<a
										className="!text-zip-app-inactive-icon !text-center !text-xs !font-semibold"
										rel="noreferrer"
										onClick={ dismissAIPopup }
									>
										{ __( 'Maybe Later', 'astra-sites' ) }
									</a>
								</div>
							</div>
						</motion.div>
					)
				}
				interactive={ true }
				interactiveBorder={ 20 }
				placement={ placement }
			>
				<div className="st-page-builder-filter">
					<ToggleDropdown
						value={ builder }
						options={ buildersList }
						className="st-page-builder-toggle"
						onClick={ ( event, option ) => {
							if ( 'ai-builder' === option.id ) {
								if ( isLimitReached ) {
									dispatch( {
										type: 'set',
										limitExceedModal: {
											...limitExceedModal,
											open: true,
										},
										currentIndex: 0,
									} );
									return;
								}
								return ( window.location = `${ astraSitesVars?.adminURL }themes.php?page=ai-builder` );
							}
							dispatch( {
								type: 'set',
								builder: option.id,
								siteSearchTerm: '',
								siteBusinessType: initialState.siteBusinessType,
								selectedMegaMenu: initialState.selectedMegaMenu,
								siteType: '',
								siteOrder: 'popular',
								onMyFavorite: false,
								currentIndex: 2,
							} );

							const pageBuilderOptionId =
								isLimitReached && 'ai-builder' === option.id
									? 'gutenberg'
									: option.id;
							const content = new FormData();
							content.append(
								'action',
								'astra-sites-change-page-builder'
							);
							content.append(
								'_ajax_nonce',
								astraSitesVars?._ajax_nonce
							);
							content.append(
								'page_builder',
								pageBuilderOptionId
							);

							fetch( ajaxurl, {
								method: 'post',
								body: content,
							} );
						} }
						dismissAiPopup={ dismissAiPopup }
					/>
				</div>
			</Tippy>
			{ isDisabled && (
				<div className="w-full absolute h-full top-0 bg-white/75 cursor-not-allowed"></div>
			) }
		</div>
	);
};

export default PageBuilder;
