import { useDispatch, useSelect } from '@wordpress/data';
import Modal from './modal';
import ModalTitle from './modal-title';
import { STORE_KEY } from '../store';
import { __, sprintf } from '@wordpress/i18n';
import { PlanMetric } from './plan-metric';
import { ChartColorfulIcon } from '../ui/icons';
import Divider from './divider';
import Button from './button';
import { useMemo } from 'react';
// import { handleClickBillingSite } from '../utils/helpers';

const PlanInformationModal = ( { onOpenChange } ) => {
	const { setPlanInformationModal } = useDispatch( STORE_KEY );

	const { planInformationModal } = useSelect( ( select ) => {
		const { getPlanInfoModalInfo } = select( STORE_KEY );
		return {
			planInformationModal: getPlanInfoModalInfo(),
		};
	} );

	const { active_plan, plan_data } = aiBuilderVars?.zip_plans;

	if ( typeof plan_data !== 'object' ) {
		return null;
	}

	const {
		limit: {
			all_sites_count,
			ai_sites_count,
			blueprint_sites_count,
			disk_space_size,
			team_members_count,
		},
		usage: {
			all_sites_count: all_sites_count_used,
			ai_sites_count: ai_sites_count_used,
			blueprint_sites_count: blueprint_sites_count_used,
			disk_space_size: disk_space_size_used,
			team_members_count: team_members_count_used,
		},
		features: { can_ai_credits_reset, can_ai_site_reset },
	} = plan_data;

	const handleManageUpgrade = () => {
		if ( active_plan.name === 'Free' ) {
			window.open(
				`https://app.zipwp.com/pricing?source=${ wpApiSettings?.zipwp_auth?.source }`,
				'_blank'
			);
		} else {
			window.open(
				`https://billing.zipwp.com/customer-dashboard/?source=${ wpApiSettings?.zipwp_auth?.source }`,
				'_blank'
			);
			// TODO: add api call later when available
			// handleClickBillingSite( 'dashboard' );
		}
	};
	// eslint-disable-next-line
	const usageTooltipText = useMemo( () => {
		const getTooltipText = ( resetType ) => {
			switch ( resetType ) {
				case 'lifetime':
					return __( 'This is the total usage quota', 'ai-builder' );
				case 'monthly':
					return __(
						'This usage quota will reset monthly',
						'ai-builder'
					);
				case 'daily':
					return __(
						'This usage quota will reset daily',
						'ai-builder'
					);
				default:
					return sprintf(
						// translators: Reset Type
						__( 'This usage quota will reset %s', 'ai-builder' ),
						resetType
					);
			}
		};

		return {
			aiCreditsTooltipText: getTooltipText( can_ai_credits_reset ),
			aiSiteTooltipText: getTooltipText( can_ai_site_reset ),
		};
	}, [ can_ai_credits_reset, can_ai_site_reset ] );

	const { aiSiteTooltipText } = usageTooltipText;

	return (
		<Modal
			setOpen={ ( toggle ) => {
				if ( typeof onOpenChange === 'function' ) {
					onOpenChange( toggle );
				}
				setPlanInformationModal( {
					...planInformationModal,
					open: toggle,
				} );
			} }
			className="!max-w-[400px] !p-6"
			open={ planInformationModal.open }
		>
			<ModalTitle>
				<ChartColorfulIcon />
				<span className="text-lg">
					{ __( 'Plan Usage & Limit', 'ai-builder' ) }
				</span>
			</ModalTitle>
			<div className="space-y-5 !mt-5">
				<p className="text-app-text zw-sm-normal">
					{ __(
						'Keep track and monitor how you allocate and use resources in your existing plan.',
						'ai-builder'
					) }
				</p>
				<div className="my-5 p-5 border rounded border-app-border ">
					<div className="flex justify-between items-center">
						<div className="text-app-heading zw-base-semibold capitalize">
							{ `${ active_plan.name } ${ __(
								'Plan',
								'ai-builder'
							) }` }
						</div>
						<Button
							variant="white"
							size="xs"
							className="text-xs text-[#0F172A] font-semibold border-border-tertiary px-2 py-1"
							onClick={ handleManageUpgrade }
						>
							{ __( 'Manage Plan', 'ai-builder' ) }
						</Button>
					</div>
					<Divider className="mt-3 mb-5" />
					<div className="flex flex-col gap-y-5">
						<PlanMetric
							title={ __( 'Staging Sites', 'ai-builder' ) }
							value={ all_sites_count_used }
							limit={ all_sites_count }
						/>
						<PlanMetric
							title={ __(
								'AI Website Generations',
								'ai-builder'
							) }
							value={ ai_sites_count_used }
							limit={ ai_sites_count }
							tooltipText={ aiSiteTooltipText }
						/>
						<PlanMetric
							title={ __( 'Blueprint Sites', 'ai-builder' ) }
							value={ blueprint_sites_count_used }
							limit={ blueprint_sites_count }
						/>
						<PlanMetric
							title={ __( 'Disk Space Utilized', 'ai-builder' ) }
							value={
								disk_space_size_used === 0
									? 0
									: disk_space_size_used.toFixed( 2 ) || 0
							}
							limit={ disk_space_size?.disk_space_size }
							percent={
								( disk_space_size_used / disk_space_size ) * 100
							}
							unit="GB"
						/>
						<PlanMetric
							title={
								<div className="flex gap-1 items-center">
									<span>
										{ __( 'Team members', 'ai-builder' ) }
									</span>
								</div>
							}
							value={ team_members_count_used }
							limit={ team_members_count }
						/>
					</div>
				</div>
				<Button
					variant="primary"
					size="base"
					className="w-full"
					onClick={ handleManageUpgrade }
				>
					{ __( 'Upgrade Now', 'ai-builder' ) }
				</Button>
			</div>
		</Modal>
	);
};

export default PlanInformationModal;
