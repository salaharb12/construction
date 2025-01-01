import {
	ArrowPathIcon,
	CheckIcon,
	ExclamationTriangleIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { memo } from 'react';
import { ToastBar, Toaster, toast } from 'react-hot-toast';

const ToasterContainer = () => {
	return (
		<Toaster
			position="top-right"
			reverseOrder={ false }
			toastOptions={ {
				duration: 4000,
				style: {
					backgroundColor: '#111827',
				},
				success: {
					icon: (
						<div className="h-10 w-10 bg-toast-success-icon flex items-center justify-center rounded-full">
							<CheckIcon className="w-4 h-4 [&>path]:stroke-[2px]" />
						</div>
					),
				},
				error: {
					icon: (
						<div className="h-10 w-10 bg-toast-error-icon flex items-center justify-center rounded-full">
							<ExclamationTriangleIcon className="w-4 h-4 [&>path]:stroke-[2px]" />
						</div>
					),
				},
				loading: {
					icon: (
						<div className="h-10 w-10 bg-toast-info-icon flex items-center justify-center rounded-full">
							<ArrowPathIcon className="w-4 h-4 [&>path]:stroke-[2px] animate-spin" />
						</div>
					),
				},
			} }
		>
			{ ( t ) => (
				<ToastBar toast={ t }>
					{ ( { icon, message } ) => (
						<>
							<div className="mb-auto mt-1">{ icon }</div>
							{ message }
							{ t.type !== 'loading' && (
								<button
									className="mb-auto mt-1 cursor-pointer text-white hover:text-app-active-icon transition-colors duration-150 ease-in-out"
									onClick={ () => toast.dismiss( t.id ) }
								>
									<XMarkIcon className="w-4 h-4 [&>path]:stroke-[2px]" />
								</button>
							) }
						</>
					) }
				</ToastBar>
			) }
		</Toaster>
	);
};

export default memo( ToasterContainer );
