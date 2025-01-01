import Tippy from '@tippyjs/react';
import { classNames } from '../helpers';

const Tooltip = ( {
	children,
	content,
	offset,
	placement = 'top',
	className,
	arrow = false,
} ) => {
	return content ? (
		<Tippy
			arrow={ arrow }
			content={ content }
			className={ classNames(
				'zw-tooltip zw-xs-normal bg-app-tooltip px-0.5 py-1.5 flex items-center justify-left text-justify',
				className
			) }
			offset={ offset } // [x,y]
			placement={ placement }
		>
			{ children }
		</Tippy>
	) : (
		<div>{ children }</div>
	);
};

export default Tooltip;
