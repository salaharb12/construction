import { useEffect, useState } from 'react';
import { classNames } from '../helpers';
import { Line } from 'rc-progress';

const ImageLoader = ( { className, delayOfProgress, ...rest } ) => {
	const [ progress, setProgress ] = useState( 10 );

	useEffect( () => {
		const timeoutId = setInterval( () => {
			setProgress( ( prev ) => prev + 10 );
		}, 300 * delayOfProgress );

		return () => {
			clearTimeout( timeoutId );
		};
	}, [] );

	return (
		<div
			className={ classNames(
				className,
				'border border-border-primary py-[93px] px-[60px]'
			) }
			{ ...rest }
		>
			<Line
				percent={ progress }
				strokeColor="#3D4592"
				trailColor="#E5E7EB"
				className="w-36 h-[6px] rounded"
			/>
		</div>
	);
};

export default ImageLoader;
