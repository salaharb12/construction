import { __ } from '@wordpress/i18n';
import { LightningIcon } from '../ui/icons';
import { classNames } from '../helpers';
import { showAISitesNotice } from '../utils/helpers';

const AISitesNotice = ( { className, ...props } ) => {
	// handle not logged in case.

	if (
		typeof aiBuilderVars?.zip_plans !== 'object' ||
		aiBuilderVars?.show_zip_plan !== '1'
	) {
		return;
	}

	return (
		<>
			{ showAISitesNotice() && (
				<div
					className={ classNames(
						'p-2.5 gap-1 border border-alert-error/30 bg-alert-error-bg rounded-md flex',
						className
					) }
					{ ...props }
				>
					<span className="self-center">
						<LightningIcon />
					</span>
					<div className="w-full flex gap-1 justify-between">
						<p className="text-body-text text-sm">
							<span className="font-semibold pr-1">
								{ __(
									"You've almost reached AI site-building limit.",
									'ai-builder'
								) }
							</span>
							{ __(
								'Upgrade with add-ons to unlock more.',
								'ai-builder'
							) }
						</p>
						<a
							href={ `https://app.zipwp.com/sites-pricing?source=${ wpApiSettings?.zipwp_auth?.source }` }
							target="_blank"
							rel="noreferrer"
							className="no-underline"
						>
							<div className="p-0 font-semibold  text-sm text-blue-crayola min-w-fit">
								{ __( 'Buy Add-ons', 'ai-builder' ) }
							</div>
						</a>
					</div>
				</div>
			) }
		</>
	);
};

export default AISitesNotice;
