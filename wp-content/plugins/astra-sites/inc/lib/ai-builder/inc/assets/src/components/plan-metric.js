import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ProgressBar } from './progress-bar';
import { Tooltip } from 'react-tooltip';

export const PlanMetric = ( {
	title,
	value,
	limit,
	unit = '',
	percent,
	titleColor = 'text-app-heading',
	valueColor = 'text-app-body-text',
	progressColor,
	tooltipText,
} ) => {
	const getPercent = ( num, den ) => {
		if ( typeof num !== 'number' || typeof den !== 'number' ) {
			return 0;
		}
		if ( den === 0 ) {
			return 0;
		}
		return ( num / den ) * 100;
	};
	return (
		<div>
			<div
				className={ `flex justify-between items-center zw-sm-normal  ${
					percent !== false ? 'mb-2' : ''
				}` }
			>
				<div className="flex gap-1 items-center">
					<div className={ titleColor }>{ title }</div>
					{ tooltipText && (
						<>
							<Tooltip id="my-tooltip" />
							<span
								data-tooltip-id="my-tooltip"
								data-tooltip-content={ tooltipText }
							>
								<InformationCircleIcon className="w-4 h-4" />
							</span>
						</>
					) }
				</div>
				<div className={ valueColor }>
					{ value } { limit || limit === 0 ? `/ ${ limit }` : '' }{ ' ' }
					{ unit }
				</div>
			</div>

			{ percent !== false ? (
				<ProgressBar
					value={ percent ? percent : getPercent( value, limit ) }
					color={ progressColor }
				/>
			) : (
				''
			) }
			<div />
		</div>
	);
};
