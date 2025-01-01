import { Fragment } from '@wordpress/element';
import {
	ArrowTopRightOnSquareIcon,
	InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { __, sprintf } from '@wordpress/i18n';
import { Menu, Transition } from '@headlessui/react';
import { CheckIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import usePopper from '../hooks/use-popper';
import { Link } from '@tanstack/react-router';
import Tooltip from './tooltip';

const TemplateInfo = ( { template, position } ) => {
	const [ triggerPopper, container ] = usePopper( {
		placement: 'top-end',
		strategy: 'fixed',
		modifiers: [ { name: 'offset', options: { offset: [ 0, 6 ] } } ],
	} );
	const isEcommerceEnabled = template?.features?.ecommerce === 'yes';

	return (
		<div className="absolute bottom-0  w-full h-14 flex items-center justify-between bg-white px-5 shadow-template-info border-t border-b-0 border-x-0 border-solid border-border-tertiary">
			<div className="flex items-center justify-start gap-1.5 zw-base-semibold text-app-heading capitalize select-none">
				<span>
					{ position
						? sprintf(
								/* translators: %s: Option number */
								__( 'Option %s', 'ai-builder' ),
								position
						  )
						: '' }
				</span>
				{ /* Preview in new tab */ }
				<Tooltip
					content={ __( 'Open Design in New Tab', 'ai-builder' ) }
					arrow
				>
					<Link
						className="cursor-pointer text-zip-app-inactive-icon mt-0.5 mb-0.5 hover:text-zip-app-text outline-none focus:outline-none transition-colors"
						to="/design-preview"
						search={ {
							uuid: template?.uuid,
						} }
						target="_blank"
					>
						<ArrowTopRightOnSquareIcon
							className="w-4.5 h-4.5"
							strokeWidth="1.7"
						/>
					</Link>
				</Tooltip>
			</div>
			<div className="flex gap-2">
				{ isEcommerceEnabled && (
					<div className="flex font-medium items-center gap-1 border leading-[14px] border-ecommerce-border text-ecommerce-text bg-ecommerce-badge text-xs px-2 py-0.5 rounded-[6px]">
						<ShoppingCartIcon className="w-4 h-4" />
						<span>{ __( 'E-Commerce', 'ai-builder' ) }</span>
					</div>
				) }
				<Menu as="div" className="relative">
					{ ( { open, close } ) => (
						<>
							<Menu.Button ref={ triggerPopper } as={ Fragment }>
								<InformationCircleIcon
									ref={ triggerPopper }
									className="w-6 h-6 cursor-pointer text-app-active-icon"
								/>
							</Menu.Button>

							<div
								ref={ container }
								className="z-50 bg-tooltip text-zip-dark-theme-heading rounded-md"
							>
								<Transition
									show={ open }
									as={ Fragment }
									enter="transition ease-out duration-200"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<div
										className="z-50 w-[11.5rem] bg-app-tooltip rounded-md text-dark-app-heading p-3 zw-sm-medium text-zip-dark-theme-heading font-medium"
										onClick={ close }
									>
										{ template?.pages?.length ? (
											<div>
												<div>
													{ __(
														'Pages included:',
														'ai-builder'
													) }
												</div>
												<div className="flex flex-col gap-1 mt-1.5 font-normal">
													{ template.pages.map(
														( page ) => (
															<div
																key={
																	page.post_title
																}
																className="flex items-center gap-2"
															>
																<CheckIcon className="w-3 h-3 text-app-inactive-icon" />
																<div className="text-sm text-zip-dark-theme-heading">
																	{
																		page.post_title
																	}
																</div>
															</div>
														)
													) }
												</div>
											</div>
										) : (
											<div>
												{ sprintf(
													/* translators: %s: Page count */
													__(
														'Page count: %s',
														'ai-builder'
													),
													template.pagesCount
												) }
											</div>
										) }
									</div>
								</Transition>{ ' ' }
							</div>
						</>
					) }
				</Menu>
			</div>
		</div>
	);
};

export default TemplateInfo;
