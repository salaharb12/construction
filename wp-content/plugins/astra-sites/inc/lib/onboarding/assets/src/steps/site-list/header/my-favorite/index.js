// External dependencies.
import React from 'react';

// Internal dependencies.
import Tooltip from '../../../../components/tooltip/tooltip';
import { __ } from '@wordpress/i18n';
import { useStateValue } from '../../../../store/store';
import ICONS from '../../../../../icons';
import './style.scss';
import { initialState } from '../../../../store/reducer';
import { getStepIndex } from '../../../../utils/functions';

const MyFavorite = ( { isDisabled } ) => {
	const [ stateValue, dispatch ] = useStateValue();
	const { onMyFavorite } = stateValue;

	if (
		getStepIndex( 'page-builder' ) === stateValue.currentIndex ||
		getStepIndex( 'classic-page-builder' ) === stateValue.currentIndex
	) {
		return null;
	}

	const handleClick = ( event ) => {
		event.stopPropagation();
		dispatch( {
			type: 'set',
			onMyFavorite: ! onMyFavorite,
			siteType: '',
			siteOrder: initialState.siteOrder,
			siteBusinessType: initialState.siteBusinessType,
			selectedMegaMenu: initialState.selectedMegaMenu,
			siteSearchTerm: '',
		} );
	};

	return (
		<div
			className={ `st-my-favorite relative ${
				onMyFavorite ? 'active' : ''
			}` }
			onClick={ ! isDisabled && handleClick }
		>
			<Tooltip
				content={ __( 'My Favorite', 'astra-sites' ) }
				offset={ [ 5, 20 ] }
			>
				{ ICONS.favorite }
			</Tooltip>
			{ isDisabled && (
				<div className="w-full absolute h-full top-0 bg-white/75 cursor-not-allowed"></div>
			) }
		</div>
	);
};

export default MyFavorite;
