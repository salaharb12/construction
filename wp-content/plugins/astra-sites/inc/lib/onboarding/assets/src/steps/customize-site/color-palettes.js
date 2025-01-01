import { memo, useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import {
	LIGHT_PALETTES,
	DARK_PALETTES,
} from '../customize-site/customize-steps/site-colors-typography/colors';
import { useStateValue } from '../../store/store';
import {
	sendPostMessage as dispatchPostMessage,
	getDefaultColorPalette,
	getColorScheme,
	classNames,
} from '../../utils/functions';
import { TilesIcon } from '../ui/icons';
import { __ } from '@wordpress/i18n';

const ColorPalettes = () => {
	const [ { activePalette: selectedPalette, templateResponse }, dispatch ] =
		useStateValue();
	const [ colorScheme, setColorScheme ] = useState( LIGHT_PALETTES );

	const sendPostMessage = ( data ) => {
		dispatchPostMessage( data, 'astra-starter-templates-preview' );
	};

	const handleChange = ( palette ) => () => {
		sendPostMessage( {
			param: 'colorPalette',
			data: palette,
		} );
		dispatch( {
			type: 'set',
			activePalette: palette,
		} );
	};

	useEffect( () => {
		const defaultPaletteValues = getDefaultColorPalette( templateResponse );
		let scheme =
			'light' === getColorScheme( templateResponse )
				? LIGHT_PALETTES
				: DARK_PALETTES;

		const customColors =
			templateResponse?.[ 'astra-custom-palettes' ] || [];
		if ( customColors.length && customColors.length % 2 === 0 ) {
			let colors = customColors;

			const customColorsSet = [];
			colors.map( ( value ) => {
				const obj = {
					slug: value.slug,
					title: value.slug,
				};
				const sampleColors = [ ...scheme[ 0 ].colors ];
				sampleColors[ 0 ] = value.colors[ 0 ];
				sampleColors[ 1 ] = value.colors[ 1 ];
				obj.colors = sampleColors;
				customColorsSet.push( obj );
				return customColorsSet;
			} );
			colors = [ ...customColorsSet, ...scheme ];
			colors.map( ( value, i ) => {
				colors[ i ].title = 'Style' + ( i + 1 );
				colors[ i ].slug = 'style-' + ( i + 1 );
				return colors;
			} );

			scheme = colors;
		}
		setColorScheme( [ ...defaultPaletteValues, ...scheme ] );
		dispatch( {
			type: 'set',
			activePalette: defaultPaletteValues[ 0 ],
		} );
	}, [ templateResponse ] );

	const handleReset = () => {
		const defaultPalette = colorScheme[ 0 ];
		sendPostMessage( {
			param: 'colorPalette',
			data: defaultPalette,
		} );
		dispatch( {
			type: 'set',
			activePalette: defaultPalette,
		} );
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-zip-app-heading text-sm">
					<span className="font-semibold">
						{ __( 'Color Palette', 'astra-sites' ) }:{ ' ' }
					</span>
					<span>{ selectedPalette?.title }</span>
				</p>
				<button
					key="reset-to-default-colors"
					className={ classNames(
						'inline-flex p-px items-center justify-center text-button-disabled border-0 bg-transparent focus:outline-none transition-colors duration-200 ease-in-out',
						selectedPalette?.slug !== 'default' &&
							'text-zip-app-inactive-icon cursor-pointer'
					) }
					{ ...( selectedPalette?.slug !== 'default' && {
						onClick: handleReset,
					} ) }
				>
					<ArrowPathIcon
						className="w-[0.875rem] h-[0.875rem]"
						strokeWidth={ 2 }
					/>
				</button>
			</div>
			<div className="grid grid-cols-5 gap-3 auto-rows-[36px]">
				{ colorScheme.map( ( colorPalette ) => (
					<div
						key={ colorPalette.slug }
						className={ classNames(
							'flex justify-center items-center gap-3 text-body-text rounded-md border border-solid border-button-disabled h-9 w-full cursor-pointer',
							selectedPalette?.slug === colorPalette.slug &&
								'outline-1 outline outline-offset-2 outline-accent-st-secondary'
						) }
						onClick={ handleChange( colorPalette ) }
					>
						{ !! colorPalette?.colors?.length && (
							<div
								className="w-full h-full flex items-center justify-center gap-1 rounded-md"
								style={ {
									background: colorPalette?.colors?.[ 5 ],
								} }
							>
								<span
									className="inline-block w-[14px] h-[14px] rounded-full shrink-0"
									style={ {
										background: colorPalette?.colors?.[ 0 ],
									} }
								/>
								<span
									className="inline-block w-[14px] h-[14px] rounded-full shrink-0"
									style={ {
										background: colorPalette?.colors?.[ 1 ],
									} }
								/>
							</div>
						) }
						{ ! colorPalette?.colors?.length && (
							<TilesIcon className="!shrink-0 w-full h-full rounded-md" />
						) }
					</div>
				) ) }
			</div>
		</div>
	);
};

export default memo( ColorPalettes );
