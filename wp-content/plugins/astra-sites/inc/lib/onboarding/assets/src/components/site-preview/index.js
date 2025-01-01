import React, { memo, useEffect, useRef, useState } from 'react';
import { sendPostMessage, classNames } from '../../utils/functions';
import { useStateValue } from '../../store/store';
import { prependHTTPS } from '../../utils/prepend-https';
import { stripSlashes } from '../../utils/strip-slashes';
import { addTrailingSlash } from '../../utils/add-trailing-slash';
import SiteSkeleton from './site-skeleton';

const SitePreview = () => {
	const [ { templateResponse, showSidebar, siteLogo }, dispatch ] =
		useStateValue();
	const [ previewUrl, setPreviewUrl ] = useState( '' );
	const [ loading, setLoading ] = useState( true );

	const previewContainer = useRef( null );

	useEffect( () => {
		const url = templateResponse
			? templateResponse[ 'astra-site-url' ]
			: '';

		if ( url !== '' ) {
			setPreviewUrl(
				addTrailingSlash( prependHTTPS( stripSlashes( url ) ) )
			);
		}
	}, [ templateResponse ] );

	useEffect( () => {
		if ( loading !== false ) {
			return;
		}

		sendPostMessage( {
			param: 'cleanStorage',
			data: siteLogo,
		} );
	}, [ loading ] );

	const updateScaling = () => {
		const container = previewContainer.current;
		if ( ! container ) {
			return;
		}

		const iframe = container.children[ 1 ];
		const containerWidth = container.clientWidth;
		const containerHeight = container.clientHeight - 44;
		const iframeWidth = iframe.clientWidth;
		const scaleX = containerWidth / iframeWidth;
		const scaleValue = scaleX;

		// Set the scale for both width and height
		iframe.style.transform = `scale(${ scaleValue })`;
		iframe.style.transformOrigin = 'top left';
		iframe.style.height = `${ containerHeight / scaleValue }px`;
	};

	const handleIframeLoading = () => {
		updateScaling();
		setLoading( false );
	};

	useEffect( () => {
		const intervalId = setInterval( updateScaling, 125 );
		setTimeout( () => {
			clearInterval( intervalId );
		}, 500 );
		return () => {
			clearInterval( intervalId );
		};
	}, [ showSidebar ] );

	const handleResize = () => {
		// Collapse the sidebar when it's a mobile view.
		if ( showSidebar ) {
			if ( window.innerWidth < 1024 ) {
				dispatch( {
					type: 'set',
					showSidebar: false,
				} );
			} else {
				dispatch( {
					type: 'set',
					showSidebar: true,
				} );
			}
		}
		updateScaling();
	};

	// Update scaling on window resize.
	useEffect( () => {
		handleResize();
		window.addEventListener( 'resize', handleResize );
		return () => {
			window.removeEventListener( 'resize', handleResize );
		};
	}, [] );

	const renderBrowserFrame = () => (
		<div
			className={ classNames(
				'flex items-center justify-start py-3 px-4 bg-browser-bar shadow-sm rounded-t-lg mx-auto h-[44px] z-[1] relative',
				'w-full mx-0'
			) }
		>
			<div className="flex gap-2 py-[3px] w-20">
				<div className="w-[14px] h-[14px] border border-solid border-border-primary rounded-full" />
				<div className="w-[14px] h-[14px] border border-solid border-border-primary rounded-full" />
				<div className="w-[14px] h-[14px] border border-solid border-border-primary rounded-full" />
			</div>
		</div>
	);

	return (
		<>
			{ loading ? <SiteSkeleton /> : null }
			{ previewUrl !== '' && (
				<div className="w-full h-full p-8">
					<div
						ref={ previewContainer }
						className="h-full relative overflow-hidden shadow-template-preview w-full mx-auto"
					>
						{ renderBrowserFrame() }
						<div className="w-[1700px] h-full">
							<iframe
								id="astra-starter-templates-preview"
								className="w-[1700px] h-full"
								title="Website Preview"
								height="100%"
								width="100%"
								src={ previewUrl }
								onLoad={ handleIframeLoading }
							/>
						</div>
					</div>
				</div>
			) }
		</>
	);
};

export default memo( SitePreview );
