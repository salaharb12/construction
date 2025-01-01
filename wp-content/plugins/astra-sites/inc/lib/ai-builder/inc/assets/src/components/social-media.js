import { PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from '@wordpress/element';
import {
	FacebookIcon,
	InstagramIcon,
	LinkedInIcon,
	TwitterIcon,
	YouTubeIcon,
	GoogleIcon,
	YelpIcon,
} from '../ui/icons';
import Dropdown from './dropdown';
import Input from './input';
import { __, sprintf } from '@wordpress/i18n';
import Tooltip from './tooltip';

const getPlaceholder = ( socialMedia ) => {
	switch ( socialMedia ) {
		case 'Facebook':
		case 'Twitter':
		case 'Instagram':
		case 'LinkedIn':
		case 'YouTube':
			return sprintf(
				/* translators: %s: social media name */
				__( `Enter your %s account URL`, 'ai-builder' ),
				socialMedia
			);
		case 'Google Business':
			return __( 'Enter your Google Business URL', 'ai-builder' );
		case 'Yelp':
			return __( 'Enter your Yelp business URL', 'ai-builder' );
		default:
			return __( 'Enter your account URL', 'ai-builder' );
	}
};

const SocialMediaItem = ( { socialMedia, onRemove, onEdit } ) => {
	const [ isEditing, setIsEditing ] = useState( false );
	const [ editedURL, setEditedURL ] = useState( socialMedia.url );

	const handleDoubleClick = () => {
		setIsEditing( true );
	};

	const handleUpdateURL = ( url = '' ) => {
		if ( url === '' ) {
			setIsEditing( false );
			return;
		}
		onEdit( url.trim() );
		setIsEditing( false );
	};

	const handleBlur = () => {
		handleUpdateURL( editedURL );
	};

	const handleKeyDown = ( event ) => {
		if ( event.key === 'Enter' ) {
			event.preventDefault();
			handleUpdateURL( editedURL );
		} else if ( event.key === 'Escape' ) {
			handleUpdateURL();
		}
	};

	const placeholder = getPlaceholder( socialMedia.name );

	return (
		<div
			key={ socialMedia.id }
			className="relative max-w-[500px] h-[50px] pl-[23px] pr-[25px] rounded-[25px] bg-white flex items-center gap-3 shadow-sm border border-zip-light-border-primary"
			onDoubleClick={ handleDoubleClick }
		>
			{ ! isEditing && (
				<div
					role="button"
					className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer bg-nav-inactive"
					onClick={ onRemove }
					tabIndex={ 0 }
					onKeyDown={ onRemove }
				>
					<XMarkIcon className="w-4 h-4 text-white" />
				</div>
			) }
			<socialMedia.icon className="shrink-0 text-nav-active inline-block" />
			{ isEditing ? (
				<Input
					ref={ ( node ) => {
						if ( node ) {
							node.focus();
						}
					} }
					name="socialMediaURL"
					inputClassName="!border-0 !bg-transparent !shadow-none focus:!ring-0 px-0 min-w-fit placeholder:!text-[0.9rem] rounded-none"
					value={ editedURL }
					onChange={ ( e ) => {
						setEditedURL( e.target.value );
					} }
					className="w-full"
					placeholder={ placeholder }
					noBorder
					onBlur={ handleBlur }
					onKeyDown={ handleKeyDown }
				/>
			) : (
				<div className="w-full overflow-x-auto scrollbar-hide">
					<p className="text-base font-medium text-body-text whitespace-nowrap">
						{ socialMedia.url }
					</p>
				</div>
			) }
		</div>
	);
};

const SocialMediaAdd = ( { list, onChange } ) => {
	const socialMediaList = [
		{
			name: __( 'Facebook', 'ai-builder' ),
			id: 'facebook',
			icon: FacebookIcon,
		},
		{
			name: __( 'Twitter', 'ai-builder' ),
			id: 'twitter',
			icon: TwitterIcon,
		},
		{
			name: __( 'Instagram', 'ai-builder' ),
			id: 'instagram',
			icon: InstagramIcon,
		},
		{
			name: __( 'LinkedIn', 'ai-builder' ),
			id: 'linkedin',
			icon: LinkedInIcon,
		},
		{
			name: __( 'YouTube', 'ai-builder' ),
			id: 'youtube',
			icon: YouTubeIcon,
		},
		{
			name: __( 'Google My Business', 'ai-builder' ),
			id: 'google',
			icon: GoogleIcon,
		},
		{
			name: __( 'Yelp', 'ai-builder' ),
			id: 'yelp',
			icon: YelpIcon,
		},
	];

	const [ selectedSocialMedia, setSelectedSocialMedia ] = useState( null );
	const [ socialMediaURL, setSocialMediaURL ] = useState( '' );

	const validateSocialMediaURL = ( url ) => {
		if ( url === '' ) {
			return true;
		}
		const startsWithHttp = url.startsWith( 'https://' );
		try {
			const domain = new URL( url ).hostname;
			return startsWithHttp && !! domain;
		} catch ( error ) {
			return false;
		}
	};

	const filterList = ( socialMediaItemList ) => {
		if ( list.length === 0 ) {
			return socialMediaItemList;
		}
		const addedSocialMediaIds = list.map( ( sm ) => sm.id );
		return socialMediaItemList.filter(
			( sm ) => ! addedSocialMediaIds.includes( sm.id )
		);
	};

	const handleEnterLink = ( type ) => {
		if (
			! (
				typeof socialMediaURL === 'string' && !! socialMediaURL?.trim()
			)
		) {
			return;
		}
		const link = socialMediaURL.trim();
		const newList = [
			...list,
			{
				...selectedSocialMedia,
				url: link,
				valid: validateSocialMediaURL( link, type ),
			},
		];
		onChange( newList );
		setSelectedSocialMedia( null );
		setSocialMediaURL( '' );
	};

	const handleEditLink = ( id, value ) => {
		const newList = list.map( ( sm ) => {
			if ( sm.id === id ) {
				const url = value.trim();
				return {
					...sm,
					url,
					valid: validateSocialMediaURL( url, id ),
				};
			}
			return sm;
		} );
		onChange( newList );
	};

	const updatedList = useMemo( () => {
		return list.map( ( sm ) => {
			const url = sm.url;
			const valid = validateSocialMediaURL( url, sm.id );
			return {
				...sm,
				url,
				valid,
				icon: socialMediaList.find( ( item ) => item.id === sm.id )
					?.icon,
			};
		} );
	}, [ list ] );

	const socialMediaRender = () => {
		if ( selectedSocialMedia ) {
			const placeholderText = selectedSocialMedia
				? getPlaceholder( selectedSocialMedia.name )
				: __( 'Enter your account URL', 'ai-builder' );
			return (
				<div className="h-[50px] w-[520px] rounded-[25px] bg-white flex items-center border border-zip-light-border-primary">
					<Input
						name="socialMediaURL"
						value={ socialMediaURL }
						onChange={ ( e ) => {
							setSocialMediaURL( e.target.value );
						} }
						ref={ ( node ) => {
							if ( node ) {
								node.focus();
							}
						} }
						inputClassName="!pr-10 !pl-11 !border-0 !bg-transparent !shadow-none focus:!ring-0"
						className="w-full"
						placeholder={ placeholderText }
						noBorder
						prefixIcon={
							<div className="absolute left-4 flex items-center">
								<selectedSocialMedia.icon className="text-nav-active inline-block" />
							</div>
						}
						onBlur={ ( event ) => {
							event.preventDefault();
							handleEnterLink( selectedSocialMedia.id );
						} }
						onKeyDown={ ( event ) => {
							if ( event.key === 'Enter' ) {
								event.preventDefault();
								handleEnterLink( selectedSocialMedia.id );
							} else if ( event.key === 'Escape' ) {
								setSelectedSocialMedia( null );
								setSocialMediaURL( '' );
							}
						} }
					/>
				</div>
			);
		}
		if ( filterList( socialMediaList ).length ) {
			return (
				<Dropdown
					width="60"
					contentClassName="p-4 bg-white [&>:first-child]:pb-2.5 [&>:last-child]:pt-2.5 [&>:not(:first-child,:last-child)]:py-2.5 !divide-y !divide-border-primary divide-solid divide-x-0"
					trigger={
						<div className="p-3 rounded-full flex items-center justify-center bg-white cursor-pointer border border-border-primary border-solid shadow-small">
							<PlusIcon className="w-6 h-6 text-accent-st" />
						</div>
					}
					placement="top-start"
				>
					{ filterList( socialMediaList ).map( ( item, index ) => (
						<Dropdown.Item
							as="div"
							role="none"
							key={ index }
							className="only:!py-0"
							onClick={ () => setSelectedSocialMedia( item ) }
						>
							<button
								onClick={ () => null }
								type="button"
								className="w-full flex items-center text-sm font-normal text-left py-2 px-2 leading-5 hover:bg-background-secondary focus:outline-none transition duration-150 ease-in-out space-x-2 rounded bg-transparent border-0 cursor-pointer"
							>
								<item.icon className="text-nav-inactive inline-block" />
								<span className="text-body-text">
									{ item.name }
								</span>
							</button>
						</Dropdown.Item>
					) ) }
				</Dropdown>
			);
		}
		return '';
	};

	return (
		<div>
			<h5 className="text-sm font-medium mb-5 flex gap-1 items-center">
				{ __( 'Social Media', 'ai-builder' ) }
				<Tooltip
					className={ 'text-left zw-tooltip__classic' }
					arrow={ true }
					content={
						<>
							{ __(
								'Please enter a full URL. Eg. https://twitter.com/abcd, https://instagram.com/abcd, https://facebook.com/abcd',
								'ai-builder'
							) }
						</>
					}
				>
					<ExclamationCircleIcon className="w-4 h-4" />
				</Tooltip>
			</h5>

			<div className="flex items-start gap-4 flex-wrap">
				{ updatedList?.length > 0 && (
					<div className="flex items-start gap-4 flex-wrap">
						{ updatedList.map( ( sm ) => {
							return (
								<div key={ sm.id }>
									<SocialMediaItem
										socialMedia={ sm }
										onRemove={ () => {
											onChange(
												updatedList.filter(
													( item ) =>
														item.id !== sm.id
												)
											);
										} }
										onEdit={ ( url ) =>
											handleEditLink( sm.id, url )
										}
									/>
									{ ! sm.valid && (
										<div className="p-3">
											<p className="!m-0 !p-0 !text-alert-error !text-sm ">
												{ __(
													'This might not be a valid URL.',
													'ai-builder'
												) }
											</p>
										</div>
									) }
								</div>
							);
						} ) }
					</div>
				) }

				{ socialMediaRender() }
			</div>
		</div>
	);
};

export default SocialMediaAdd;
