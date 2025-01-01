import { CheckIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import ARImg from '../../images/build-with-ai/ar.svg';
import Button from './button';
import { useEffect, useState } from 'react';
import { classNames } from '../helpers';
import {
	getPlanPromoDissmissTime,
	getTimeDiff,
	showAISitesNotice,
} from '../utils/helpers';
import { WEEKS_IN_SECONDS } from '../utils/constants';

const {
	zip_plans: { active_plan, plan_data },
	show_zip_plan,
} = aiBuilderVars;

const PlanUpgradePromoModal = () => {
	const [ features, setFeatures ] = useState( [] );
	const [ suggestedPlan, setSuggestedPlan ] = useState( '' );
	const [ showUpgradeModal, setShowUpgradeModal ] = useState( false );

	useEffect( async () => {
		// handle not logged in case.
		if (
			typeof aiBuilderVars?.zip_plans !== 'object' ||
			show_zip_plan !== '1'
		) {
			return;
		}

		const promoDismissTimeinMS = ( await getPlanPromoDissmissTime() )
			.dismiss_time;

		// if 2 weeks have not been passed
		if ( getTimeDiff( promoDismissTimeinMS ) < 2 * WEEKS_IN_SECONDS ) {
			return;
		}

		if ( showAISitesNotice() && active_plan?.slug !== 'business' ) {
			setShowUpgradeModal( true );
		}
	}, [] );

	const handleDissmiss = async () => {
		setShowUpgradeModal( false );
		await apiFetch( {
			path: 'zipwp/v1/set-plan-promo-dismiss-time',
			method: 'GET',
			headers: {
				'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
				'content-type': 'application/json',
			},
		} )
			.then( console.info )
			.catch( console.error );
	};

	useEffect( () => {
		switch ( active_plan?.slug ) {
			case 'free':
				setFeatures( [
					__( '5 AI sites per day', 'ai-builder' ),
					__( '20,000 AI Credits', 'ai-builder' ),
					__( 'Premium designs', 'ai-builder' ),
					__( '5 Blueprint Sites', 'ai-builder' ),
				] );
				setSuggestedPlan( 'Pro' );
				break;
			case 'hobby':
				setFeatures( [
					__( '5 AI sites per day', 'ai-builder' ),
					__( '20,000 AI Credits', 'ai-builder' ),
					__( 'Premium designs', 'ai-builder' ),
					__( '5 Blueprint Sites', 'ai-builder' ),
				] );
				setSuggestedPlan( 'Pro' );
				break;
			case 'pro':
				setFeatures( [
					__( '10 AI sites per day', 'ai-builder' ),
					__( '100,000 AI Credits', 'ai-builder' ),
					__( 'Premium designs', 'ai-builder' ),
					__( '10 Blueprint Sites', 'ai-builder' ),
				] );
				setSuggestedPlan( 'Business' );
				break;
			default:
				break;
		}
	}, [ active_plan?.slug ] );

	return (
		<div
			className={ classNames(
				'absolute sm:w-[480px] h-60 sm:right-0 sm:h-[268px] justify-center sm:justify-end flex bg-transparent bottom-5 w-full z-[999999] p-4',
				showUpgradeModal ? '' : 'hidden'
			) }
		>
			<div className="relative text-background-primary rounded-lg flex flex-col-reverse bg-nav-active w-[370px] sm:w-[443px] p-4 sm:p-5">
				<div className="">
					<div className="flex gap-6 align-baseline">
						<div className="w-52 sm:w-64">
							<p className="text-background-primary text-sm sm:text-lg sm:leading-7 leading-6 font-semibold">
								{ __(
									'Great Start! Congratulations..',
									'ai-builder'
								) }
							</p>
							<p className="text-background-primary text-xs sm:text-sm font-normal mt-1">
								{ sprintf(
									// translators: %1$s: Number of AI sites used, %2$s: Current plan name, %3$s: Suggested Plan
									__(
										"You've successfully generated %1$s AI sites with your %2$s account. Do much more with the %3$s Plan:",
										'ai-builder'
									),
									plan_data?.usage?.ai_sites_count,
									active_plan?.name,
									suggestedPlan
								) }
							</p>
						</div>
						<div className="self-end relative w-[106px] sm:w-32">
							<img
								src={ ARImg }
								className=""
								alt=""
								aria-hidden="true"
							/>
						</div>
					</div>
					<div className="flex flex-wrap py-2">
						{ features.map( ( x, i ) => {
							return (
								<div
									className="flex w-40 items-center gap-1.5"
									key={ i }
								>
									<CheckIcon className="size-3 text-support-success-inverse" />
									<span className="text-xs sm:text-sm">
										{ x }
									</span>
								</div>
							);
						} ) }
					</div>
					<div className="pt-2">
						<a
							href="https://app.zipwp.com/pricing"
							target="_blank"
							rel="noreferrer"
						>
							<Button className="text-heading-text bg-background-primary text-xs sm:text-sm w-full">
								{ __( 'Upgrade Now', 'ai-builder' ) }
							</Button>
						</a>
						{ /* <Button className="text-xs p-2 px-3">
		    				{ __( 'Learn More', 'ai-builder' ) }
                            </Button> */ }
					</div>
				</div>

				<div className="items-center relative">
					<XMarkIcon
						className="absolute right-0 size-4 text-st-background-secondary cursor-pointer"
						onClick={ handleDissmiss }
					/>
				</div>
			</div>
		</div>
	);
};

export default PlanUpgradePromoModal;
