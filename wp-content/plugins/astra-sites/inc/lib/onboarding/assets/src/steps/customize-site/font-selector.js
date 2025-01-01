import { memo, useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { FONTS } from './customize-steps/site-colors-typography/other-fonts';
import { getFontName } from '../customize-site/customize-steps/site-colors-typography/font-selector';
import { useStateValue } from '../../store/store';
import {
	getDefaultTypography,
	getHeadingFonts,
	sendPostMessage as dispatchPostMessage,
	classNames,
} from '../../utils/functions';

const FontSelector = () => {
	const [ { typography: activeTypography, templateResponse }, dispatch ] =
		useStateValue();
	const [ fonts, setFonts ] = useState(
		FONTS.map( ( font, index ) => ( { ...font, id: index } ) )
	);
	const headingFonts = getHeadingFonts( templateResponse );

	/**
	 * Add selected demo typography as default typography
	 */
	useEffect( () => {
		const googleFontsURL = document.getElementById( 'google-fonts-url' );

		if ( templateResponse ) {
			const defaultFonts = [];
			const defaultTypography = getDefaultTypography( templateResponse );
			defaultFonts.push( {
				id: 'default-font',
				...defaultTypography,
			} );

			if ( ! document.getElementById( 'google-fonts-domain' ) ) {
				const node = document.createElement( 'link' );
				node.id = 'google-fonts-domain';
				node.setAttribute( 'rel', 'preconnect' );
				node.setAttribute( 'href', 'https://fonts.gstatic.com' );
				document.head.appendChild( node );
			}

			// Removes existing Google fonts URL.
			if ( !! googleFontsURL ) {
				googleFontsURL.remove();
			}

			const node = document.createElement( 'link' );
			node.id = 'google-fonts-url';
			node.setAttribute( 'rel', 'stylesheet' );

			const fontsName = [];

			let bodyFont = defaultTypography[ 'body-font-family' ] || '';
			let bodyFontWeight =
				parseInt( defaultTypography[ 'body-font-weight' ] ) || '';
			if ( bodyFontWeight ) {
				bodyFontWeight = `:wght@${ bodyFontWeight }`;
			}

			if ( bodyFont ) {
				bodyFont = getFontName( bodyFont );
				bodyFont =
					undefined !== bodyFont
						? bodyFont.replace( ' ', '+' )
						: bodyFont;
				fontsName.push( `family=${ bodyFont }${ bodyFontWeight }` );
			}

			let headingFont = defaultTypography[ 'headings-font-family' ] || '';
			let headingFontWeight =
				parseInt( defaultTypography[ 'headings-font-weight' ] ) || '';

			if ( headingFontWeight ) {
				headingFontWeight = `:wght@${ headingFontWeight }`;
			}

			if ( headingFont ) {
				headingFont = getFontName( headingFont, bodyFont );
				headingFont =
					undefined !== headingFont
						? headingFont.replace( ' ', '+' )
						: headingFont;
				fontsName.push(
					`family=${ headingFont }${ headingFontWeight }`
				);
			}

			let otherFontsString = '';
			if ( !! fonts ) {
				for ( const font of fonts ) {
					const fontHeading = getFontName(
						font[ 'headings-font-family' ]
					).replaceAll( ' ', '+' );
					const fontHeadingWeight = font[ 'headings-font-weight' ];

					const fontBody = getFontName(
						font[ 'body-font-family' ]
					).replaceAll( ' ', '+' );
					const fontBodyWeight = font[ 'body-font-weight' ];

					otherFontsString += `&family=${ fontHeading }:wght@${ fontHeadingWeight }&family=${ fontBody }:wght@${ fontBodyWeight }`;
				}
				otherFontsString = otherFontsString.replace( /[&]{1}$/i, '' );
			}

			// Add Google fonts URL.
			if ( fontsName ) {
				const fontUrl = `https://fonts.googleapis.com/css2?${ fontsName.join(
					'&'
				) }${ otherFontsString }&display=swap`;

				node.setAttribute( 'href', fontUrl );
				document.head.insertAdjacentElement( 'afterbegin', node );
			}
			// Add default font.
			const allFonts = defaultFonts.concat( fonts );
			// if ( Object.keys( typography ).length === 0 ) {
			dispatch( {
				type: 'set',
				typography: allFonts[ 0 ],
			} );
			// }

			setFonts( allFonts );
		}
	}, [ templateResponse ] );

	const sendPostMessage = ( data ) => {
		dispatchPostMessage( data, 'astra-starter-templates-preview' );
	};

	const handleChange = ( selectedTypography ) => () => {
		const newTypography = headingFonts
			? { ...selectedTypography, ...headingFonts }
			: selectedTypography;

		sendPostMessage( {
			param: 'siteTypography',
			data: JSON.parse( JSON.stringify( newTypography ) ),
		} );

		dispatch( {
			type: 'set',
			typography: selectedTypography,
		} );
	};

	const handleReset = () => {
		const defaultTypography = fonts[ 0 ];
		sendPostMessage( {
			param: 'siteTypography',
			data: JSON.parse( JSON.stringify( defaultTypography ) ),
		} );
		dispatch( {
			type: 'set',
			typography: defaultTypography,
		} );
	};

	const selectedHeadingFont =
			getFontName( activeTypography?.[ 'headings-font-family' ] ) || '',
		selectedBodyFont =
			getFontName( activeTypography?.[ 'body-font-family' ] ) || '';
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-zip-app-heading text-sm w-full truncate">
					<span className="font-semibold">
						{ __( 'Font Pair', 'astra-sites' ) }:
					</span>
					<span className="font-normal">
						{ ' ' }
						{ selectedHeadingFont } & { selectedBodyFont }{ ' ' }
					</span>
				</p>
				<button
					key="reset-to-default-fonts"
					className={ classNames(
						'inline-flex p-px items-center justify-center text-button-disabled border-0 bg-transparent focus:outline-none transition-colors duration-200 ease-in-out cursor-default',
						! activeTypography?.default &&
							'text-zip-app-inactive-icon cursor-pointer'
					) }
					{ ...( ! activeTypography?.default && {
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
				{ fonts.map( ( font ) => {
					const bodyFont =
						getFontName( font[ 'body-font-family' ] ) || '';
					const headingFont =
						getFontName(
							font[ 'headings-font-family' ],
							bodyFont
						) || '';
					return (
						<div
							key={ font.id }
							className={ classNames(
								'flex justify-center items-center text-body-text font-normal px-2 py-1 border border-solid border-button-disabled rounded-md bg-st-background-secondary hover:bg-white transition duration-150 ease-in-out cursor-pointer w-full h-9',
								activeTypography?.id === font.id &&
									'outline-1 outline outline-offset-2 outline-accent-st-secondary bg-white'
							) }
							onClick={ handleChange( font ) }
						>
							<span
								className="truncate text-xl font-normal"
								style={ {
									fontFamily: headingFont,
								} }
							>
								A
							</span>
							<span
								className="truncate text-sm font-normal"
								style={ {
									fontFamily: bodyFont,
								} }
							>
								g
							</span>
						</div>
					);
				} ) }
			</div>
		</div>
	);
};

export default memo( FontSelector );
