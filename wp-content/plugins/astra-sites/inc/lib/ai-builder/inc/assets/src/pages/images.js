import {
	ArrowUpTrayIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	MagnifyingGlassIcon,
	SparklesIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';

import apiFetch from '@wordpress/api-fetch';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { uploadMedia } from '@wordpress/media-utils';

import { AnimatePresence } from 'framer-motion';
import { uniqBy } from 'lodash';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Masonry from 'react-layout-masonry';

import Dropdown from '../components/dropdown';
import Heading from '../components/heading';
import ImagePreview from '../components/image-preview';
import NavigationButtons from '../components/navigation-buttons';
import SuggestedKeywords from '../components/suggested-keywords';
import Tile from '../components/tile';
import UploadImage from '../components/upload-image';

import { classNames, toastBody } from '../helpers';
import { useDebounce, useDebounceWithCancel } from '../hooks/use-debounce';
import usePopper from '../hooks/use-popper';
import { useNavigateSteps } from '../router';
import { STORE_KEY } from '../store';
import { MB_IN_BYTE } from '../utils/constants';
import { clearSessionStorage, isValidImageURL } from '../utils/helpers';
import { USER_KEYWORD } from './select-template';

const ORIENTATIONS = {
	all: {
		value: 'all',
		label: __( 'All orientations', 'ai-builder' ),
	},
	landscape: {
		value: 'landscape',
		label: __( 'Landscape', 'ai-builder' ),
	},
	portrait: {
		value: 'portrait',
		label: __( 'Portrait', 'ai-builder' ),
	},
};

const TABS = [
	{
		label: __( 'Search Results', 'ai-builder' ),
		value: 'all',
	},
	{
		label: __( 'Upload Your Images', 'ai-builder' ),
		value: 'upload',
	},
	{
		label: __( 'Selected Images', 'ai-builder' ),
		value: 'selected',
	},
];

const IMAGES_PER_PAGE = 20;
const IMAGE_ENGINES = [ 'pexels' ];
const SKELETON_COUNT = 15;

const getImageSkeleton = ( count = SKELETON_COUNT ) => {
	const aspectRatioClassNames = [
		'aspect-[1/1]',
		'aspect-[1/2]',
		'aspect-[2/1]',
		'aspect-[2/2]',
		'aspect-[3/3]',
		'aspect-[4/3]',
		'aspect-[3/4]',
	];

	let aspectRatioIndex = 0;

	return Array.from( { length: count } ).map( ( _, index ) => {
		aspectRatioIndex =
			aspectRatioIndex === aspectRatioClassNames.length
				? 0
				: aspectRatioIndex;

		return (
			<Tile
				key={ `skeleton-${ index }` }
				className={ classNames(
					'relative overflow-hidden rounded-lg',
					'bg-slate-300 rounded-lg relative animate-pulse',
					aspectRatioClassNames[ aspectRatioIndex++ ]
				) }
			/>
		);
	} );
};

const Images = () => {
	const { nextStep, previousStep } = useNavigateSteps();
	const [ uploadingImagesCount, setUploadingImagesCount ] = useState( [ 0 ] );

	const { setWebsiteImagesAIStep, setWebsiteTemplateKeywords } =
		useDispatch( STORE_KEY );

	const [ uploadedImages, setUploadedImages ] = useState( [] );

	const uploadDroppedFiles = ( filesList ) => {
		setUploadedImages( [] );
		setUploadingImagesCount( filesList.length );
		filesList.forEach( async ( file ) => {
			try {
				await uploadMedia( {
					filesList: [ file ],
					onFileChange: ( files ) => {
						if ( ! files[ 0 ].id ) {
							return;
						}
						// if NOT a valid image name
						if ( ! isValidImageURL( files[ 0 ]?.url ) ) {
							toast.error(
								toastBody( {
									message: sprintf(
										/* translators: %s: file name */
										__(
											'Invalid file name! Please avoid special characters. (%s)',
											'ai-builder'
										),
										files[ 0 ].title
									),
								} )
							);
							setUploadingImagesCount( ( prev ) => prev - 1 );
							return;
						}
						setUploadedImages( ( prevState ) => [
							...prevState,
							...files,
						] );
						setUploadingImagesCount( ( prev ) => prev - 1 );
					},
				} );
			} catch ( error ) {
				console.error( error );
				toast.error(
					toastBody( {
						message: error.message.toString(),
					} )
				);
				setUploadingImagesCount( ( prevState ) => prevState - 1 );
			}
		} );
	};

	const onDropRejected = ( rejectedList ) => {
		if ( rejectedList.length > 20 ) {
			toast.error(
				toastBody( {
					message: __(
						`You can only upload 20 images at once`,
						'ai-builder'
					),
				} )
			);
			return;
		}
		rejectedList.forEach( ( { errors, file } ) => {
			toast.error(
				toastBody( {
					message: `${ errors[ 0 ].message } (${ file?.name })`,
				} )
			);
		} );
	};

	const { getRootProps, getInputProps } = useDropzone( {
		accept: {
			'image/png': [ '.png' ],
			'image/jpeg': [ '.jpeg', '.jpg' ],
		},
		noClick: true,
		noKeyboard: true,
		onDropAccepted: uploadDroppedFiles,
		maxFiles: 20,
		maxSize: 5 * MB_IN_BYTE,
		onDropRejected,
	} );

	const {
		stepsData: {
			businessName,
			selectedImages = [],
			keywords = [],
			businessType,
			businessDetails,
			businessContact,
			templateList,
			siteLanguage,
		},
		updateImages,
		loadingNextStep,
	} = useSelect( ( select ) => {
		const {
			getAIStepData,
			getAllPatternsCategories,
			getDynamicContent,
			getOnboardingAI,
			getLoadingNextStep,
		} = select( STORE_KEY );
		const onboardingAI = getOnboardingAI();
		return {
			stepsData: getAIStepData(),
			allPatternsCategories: getAllPatternsCategories(),
			dynamicContent: getDynamicContent(),
			isNewUser: onboardingAI?.isNewUser,
			updateImages: onboardingAI?.updateImages,
			loadingNextStep: getLoadingNextStep(),
		};
	} );

	useEffect( () => {
		setWebsiteImagesAIStep(
			uniqBy(
				[
					...selectedImages,
					...uploadedImages.map( ( image ) => ( {
						id: String( image.id ),
						url: image?.originalImageURL ?? image.url,
						optimized_url: image?.sizes?.large?.url ?? image.url,
						engine: '',
						description: '',
						orientation:
							image?.orientation ??
							( image?.width > image?.height
								? 'landscape'
								: 'portrait' ),
						author_name: image?.author_name ?? '',
						author_url: '',
					} ) ),
				],
				'id'
			)
		);
	}, [ uploadedImages.length ] );

	const [ orientation, setOrientation ] = useState( ORIENTATIONS.all );
	const [ keyword, setKeyword ] = useState(
		keywords?.length > 0 ? keywords[ 0 ] : ''
	);
	const [ images, setImages ] = useState( [] );
	const [ page, setPage ] = useState( 1 );
	const [ hasMore, setHasMore ] = useState( true );
	const [ isLoading, setIsLoading ] = useState( false );
	const [ backToTop, setBackToTop ] = useState( false );
	const [ activeTab, setActiveTab ] = useState( 'all' );

	const [ openSuggestedKeywords, setOpenSuggestedKeywords ] =
		useState( false );
	const [ referenceRef, popperRef ] = usePopper( {
		placement: 'bottom',
		modifiers: [ { name: 'offset', options: { offset: [ 0, 0 ] } } ],
	} );

	const mainWrapper = useRef( null );
	const scrollContainerRef = useRef( null );
	const imageRequestCompleted = useRef( false );
	const blackListedEngines = useRef( new Set() );
	const previouslySelected = useRef( selectedImages );
	const uploadImagesBtn = useRef( null );

	const { register, handleSubmit, setValue, reset, setFocus, watch } =
		useForm( { defaultValues: { keyword } } );
	const watchedKeyword = watch( 'keyword' );

	const [ debouncedImageKeywords, cancelDebouncedImageKeywords ] =
		useDebounceWithCancel( keyword, 500 );
	const debouncedOrientation = useDebounce( orientation, 500 );

	const handleOrientationChange = ( orientation_value ) => () => {
		setOrientation( orientation_value );
	};

	const handleSelectKeyword = ( keyword_value ) => {
		cancelDebouncedImageKeywords();
		setKeyword( keyword_value );
		setValue( 'keyword', keyword_value );
		setOpenSuggestedKeywords( false );
	};

	const getSuggestedKeywords = () => {
		return [ ...new Set( keywords ) ].filter( ( keywordItem ) => {
			if ( keyword.trim() === '' ) {
				return true;
			}
			return keywordItem?.toLowerCase() !== keyword?.toLowerCase();
		} );
	};

	const isSelected = ( image ) => {
		const imageIndx = selectedImages?.findIndex(
			( img ) => img.id === image.id
		);
		return imageIndx > -1;
	};

	// Function to merge new images with old images without duplicates
	const mergeUniqueImages = ( oldImages, newImages ) => {
		const uniqueImagesMap = new Map();

		[ ...oldImages, ...newImages ].forEach( ( image ) => {
			if ( ! uniqueImagesMap.has( image.id ) ) {
				// Add check to prevent overwrite
				uniqueImagesMap.set( image.id, image );
			}
		} );

		return Array.from( uniqueImagesMap.values() );
	};

	const handleImageSelection = useCallback(
		( image ) => {
			let newSelectedImages = [];

			if ( isSelected( image ) ) {
				image.id = String( image.id );
				newSelectedImages = selectedImages?.filter(
					( img ) => img.id !== image.id
				);
			} else {
				newSelectedImages = [ ...selectedImages, image ];
			}

			setWebsiteImagesAIStep( newSelectedImages );
		},
		[ selectedImages, setWebsiteImagesAIStep ] // eslint-disable-line
	);

	const handleClearImageSelection = useCallback(
		( event ) => {
			event.preventDefault();
			event.stopPropagation();

			setWebsiteImagesAIStep( [] );
		},
		[ setWebsiteImagesAIStep ]
	);

	const handleClickBackToTop = () => {
		if ( ! scrollContainerRef.current ) {
			return;
		}
		setBackToTop( false );
		scrollContainerRef.current.scrollTo( {
			top: 0,
			behavior: 'smooth',
		} );
		mainWrapper.current.scrollTo( {
			top: 0,
			behavior: 'smooth',
		} );
	};

	const handleShowBackToTop = ( event ) => {
		if ( ! event ) {
			return;
		}
		const { scrollTop } = event.target;
		const { scrollTop: mainScrollTop, scrollHeight: mainScrollHeight } =
			mainWrapper.current;
		const SCROLL_THRESHOLD = 50;
		if ( scrollTop > SCROLL_THRESHOLD && ! backToTop ) {
			setBackToTop( true );
			mainWrapper.current.scrollTo( {
				top: mainWrapper.current.scrollHeight,
				behavior: 'smooth',
			} );
		}
		if ( scrollTop <= SCROLL_THRESHOLD && backToTop ) {
			setBackToTop( false );
			mainWrapper.current.scrollTo( {
				top: 0,
				behavior: 'smooth',
			} );
		}
		if (
			scrollTop > SCROLL_THRESHOLD &&
			mainScrollTop < mainScrollHeight
		) {
			mainWrapper.current.scrollTo( {
				top: mainWrapper.current.scrollHeight,
				behavior: 'smooth',
			} );
		}
	};

	const handleScroll = ( event ) => {
		if ( ! event ) {
			return;
		}
		handleShowBackToTop( event );

		if ( activeTab === TABS[ 2 ].value ) {
			return;
		}

		if ( ! hasMore || isLoading ) {
			return;
		}

		const { scrollTop, scrollHeight, clientHeight } =
			scrollContainerRef.current;

		// Load more images when user is 200px away from the bottom
		if ( scrollTop + clientHeight >= scrollHeight - 100 ) {
			setPage( ( prev ) => prev + 1 );
		}
	};

	// Define a function to fetch all images
	const fetchAllImages = async ( engine ) => {
		// eslint-disable-line
		let searchKeywords = keyword;

		// If we the input filed is empty we are passing the keyword as businessName[category]
		if (
			typeof keyword === 'string' &&
			( ! keyword || keyword.trim() === '' )
		) {
			searchKeywords = businessName;
		}

		const payload = {
			keywords: searchKeywords,
			orientation: orientation.value,
			per_page: IMAGES_PER_PAGE?.toString(),
			page: page?.toString(),
		};
		try {
			const res = await apiFetch( {
				path: `zipwp/v1/images`,
				data: { ...payload, engine },
				method: 'POST',
				headers: {
					'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
				},
			} );
			const imageResponse = res.data?.data || [];
			if ( ! res?.success ) {
				throw new Error( res?.data?.data );
			}
			// If there are no images, blacklist the engine
			if ( imageResponse?.length === 0 ) {
				blackListedEngines.current.add( engine );
			}

			// Filter out images that are already selected
			const newImages =
				imageResponse?.length > 0
					? imageResponse.map( ( image ) => ( {
							...image,
							id: String( image.id ),
					  } ) )
					: [];

			// Combine with existing images
			setImages( ( prevImages ) =>
				mergeUniqueImages( prevImages, newImages )
			);

			// Return image response length
			return imageResponse?.length || 0;
		} catch ( error ) {
			if ( error.name === 'AbortError' ) {
				throw error;
			}
			toast.error( toastBody( error ) );
		}

		return 0;
	};

	const getTemplates = async () => {
		try {
			const response = await apiFetch( {
				path: 'zipwp/v1/template-keywords',
				method: 'POST',
				headers: {
					'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
				},
				data: {
					business_name: businessName,
					business_description: businessDetails,
					business_category: businessType,
					business_category_name: businessType,
				},
			} );

			if ( response.success ) {
				const templateKeywords = response?.data?.data ?? [];
				setWebsiteTemplateKeywords( [
					...new Set( templateKeywords ),
				] );
			} else {
				throw new Error( response?.data?.data );
			}
		} catch ( error ) {
			toast.error( toastBody( error ) );
		}
	};

	useEffect( () => {
		imageRequestCompleted.current = false;
		const fetchAllImagesFromAllEngines = async () => {
			if ( isLoading || ! hasMore ) {
				return;
			}
			try {
				setIsLoading( true );
				const responseLengths = [];
				for ( const engine of IMAGE_ENGINES ) {
					if ( ! blackListedEngines.current.has( engine ) ) {
						const response = await fetchAllImages( engine );
						responseLengths.push( response );
					}
				}

				if (
					Math.max( responseLengths.filter( Boolean ) ) <
					IMAGES_PER_PAGE
				) {
					setHasMore( false );
				} else {
					setHasMore( true );
				}
			} catch ( error ) {
				// Do nothing
				if ( error.name === 'AbortError' ) {
					return;
				}
			} finally {
				imageRequestCompleted.current = true;
				setIsLoading( false );
			}
		};

		fetchAllImagesFromAllEngines();
	}, [ debouncedImageKeywords, debouncedOrientation, page ] );

	useEffect( () => {
		imageRequestCompleted.current = false;
		blackListedEngines.current.clear();
		setPage( 1 );
		setImages( [] );
	}, [ keyword, orientation ] );

	// Trigger to load more images.
	useEffect( () => {
		mainWrapper.current = document.getElementById(
			'sp-onboarding-content-wrapper'
		);
		const mainWrapperElem = mainWrapper.current;
		if (
			!! mainWrapperElem &&
			! mainWrapperElem.classList.contains( 'hide-scrollbar' )
		) {
			mainWrapperElem.classList.add( 'hide-scrollbar' );
		}

		return () => {
			if (
				!! mainWrapperElem &&
				mainWrapperElem.classList.contains( 'hide-scrollbar' )
			) {
				mainWrapperElem.classList.remove( 'hide-scrollbar' );
			}
		};
	}, [] );

	useEffect( () => {
		if ( ! templateList?.length ) {
			getTemplates();
		}
	}, [ templateList ] );

	useEffect( () => {
		setFocus( 'keyword' );
	}, [] );

	const getUploadedImages = ( imagesArray = [] ) => {
		return imagesArray.filter( ( image ) =>
			IMAGE_ENGINES.some(
				( engine ) =>
					engine !== image.engine && image.engine !== 'placeholder'
			)
		);
	};

	const getSelectedImages = ( imagesArray = [] ) => {
		return imagesArray.filter( ( image ) =>
			IMAGE_ENGINES.some( ( engine ) => engine === image.engine )
		);
	};

	const getUploadingImageSkeleon = () => {
		if ( ! uploadingImagesCount ) {
			return [];
		}
		return getImageSkeleton( uploadingImagesCount, [ 'aspect-[1/1]' ] );
	};

	const getRenderItems = () => {
		switch ( activeTab ) {
			case TABS[ 0 ].value:
				return isLoading || ! imageRequestCompleted.current
					? [ ...images, ...getImageSkeleton() ]
					: images;
			case TABS[ 1 ].value:
				return [
					...getUploadedImages( selectedImages ),
					...getUploadingImageSkeleon(),
				];
			case TABS[ 2 ].value:
				return getSelectedImages( selectedImages );
			default:
				return isLoading
					? [ ...images, ...getImageSkeleton() ]
					: images;
		}
	};

	const renderImages = getRenderItems();

	const handleSaveDetails = async (
		selImages = selectedImages,
		skip = false
	) => {
		await apiFetch( {
			path: 'zipwp/v1/user-details',
			method: 'POST',
			headers: {
				'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
			},
			data: {
				business_description: businessDetails,
				business_name: businessName,
				business_category: businessType,
				site_language: siteLanguage,
				images: skip ? [] : selImages,
				keywords,
				business_address: businessContact?.address || '',
				business_phone: businessContact?.phone || '',
				business_email: businessContact?.email || '',
				social_profiles: businessContact?.socialMedia || [],
			},
		} )
			.then( () => {} )
			.catch( () => {
				// Do nothing
			} );
	};

	const handleClickNext =
		( skip = false ) =>
		async () => {
			await handleSaveDetails( selectedImages, skip );
			clearSessionStorage( USER_KEYWORD );
			nextStep();
			if ( skip ) {
				setWebsiteImagesAIStep( previouslySelected.current ?? [] );
			}
		};

	const handleImageSearch = ( data ) => {
		setKeyword( data.keyword );
	};

	const handleClearSearch = () => {
		if ( ! watchedKeyword ) {
			return;
		}
		setKeyword( '' );
		reset( { keyword: '' } );
		setTimeout( () => {
			setFocus( 'keyword' );
		}, 10 );
	};

	const handleClickOutside = ( event ) => {
		const businessTypesWrapper = document.getElementById(
			'search-images-wrapper'
		);
		if (
			businessTypesWrapper &&
			! businessTypesWrapper.contains( event.target )
		) {
			setOpenSuggestedKeywords( false );
		}
	};

	// handle outside click to close the suggestions.
	useEffect( () => {
		document.addEventListener( 'mousedown', handleClickOutside );
		return () =>
			document.removeEventListener( 'mousedown', handleClickOutside );
	}, [ handleClickOutside ] );

	const handleOpenSuggestedKeywords = ( event ) => {
		if ( openSuggestedKeywords ) {
			return;
		}

		// Check if the event type is on click
		if ( event?.type === 'click' || event?.type === 'keydown' ) {
			setOpenSuggestedKeywords( true );
		}
	};

	return (
		<div
			className="w-full flex flex-col flex-auto h-full overflow-y-auto"
			ref={ scrollContainerRef }
			onScroll={ handleScroll }
		>
			<div className="w-full space-y-6">
				<Heading
					heading={ __( 'Select the Images', 'ai-builder' ) }
					className="px-5 md:px-10 lg:px-14 xl:px-15 pt-5 md:pt-10 lg:pt-8 xl:pt-8 max-w-fit mx-auto"
				/>
				<form
					className="w-full overflow-visible min-h-[3.125rem]"
					onSubmit={ handleSubmit( handleImageSearch ) }
					data-disabled={ loadingNextStep }
				>
					<div
						id="search-images-wrapper"
						ref={ referenceRef }
						className={ classNames(
							'relative w-full max-w-[37.5rem] mx-auto pl-4 pr-12 py-3 border border-button-disabled rounded-md shadow bg-white z-[2]',
							{
								'pb-0 rounded-b-none border-b-0 shadow-md':
									openSuggestedKeywords,
								'focus-within:ring-1 focus-within:ring-accent-st focus-within:border-accent-st focus-within:outline-none':
									! openSuggestedKeywords,
							}
						) }
						onClick={ ( event ) => {
							// If event target is `search-images-wrapper` then focus input.
							if ( event.target.id !== 'search-images-wrapper' ) {
								return;
							}
							setFocus( 'keyword' );
							if ( openSuggestedKeywords ) {
								return;
							}
							setOpenSuggestedKeywords( true );
						} }
					>
						<div className="absolute top-[0.875rem] right-3 flex items-center">
							<button
								type="button"
								className="w-auto h-auto p-0 flex items-center justify-center cursor-pointer bg-transparent border-0 focus:outline-none"
								onClick={ handleClearSearch }
							>
								{ watchedKeyword ? (
									<XMarkIcon className="w-5 h-5 text-zip-app-inactive-icon" />
								) : (
									<MagnifyingGlassIcon className="w-5 h-5 text-zip-app-inactive-icon" />
								) }
							</button>
						</div>
						<input
							className="!text-sm p-0 border-0 w-full focus:outline-none focus:ring-0 focus-visible:outline-none"
							placeholder={ __(
								'Add more relevant keywords…',
								'ai-builder'
							) }
							autoComplete="off"
							onKeyDown={ handleOpenSuggestedKeywords }
							onClick={ handleOpenSuggestedKeywords }
							{ ...register( 'keyword' ) }
						/>
						<div
							ref={ popperRef }
							className={ classNames(
								'w-[calc(100%_+_2px)] px-3 pb-4 z-10 bg-white shadow-md border-x border-b border-t-0 border-solid border-border-tertiary rounded-b-md',
								{
									invisible: ! openSuggestedKeywords,
								}
							) }
						>
							{ openSuggestedKeywords && (
								<hr
									className="!mx-0 !my-3 border-t border-solid border-b-0 border-border-tertiary"
									tabIndex={ -1 }
								/>
							) }
							<h6 className="flex items-center justify-start gap-1.5 text-sm text-heading-text font-medium mb-4">
								<span>
									{ __( 'Suggested Keywords', 'ai-builder' ) }
								</span>
								<SparklesIcon className="inline-block size-4" />
							</h6>
							<SuggestedKeywords
								keywords={ getSuggestedKeywords() }
								onClick={ handleSelectKeyword }
								data-disabled={ loadingNextStep }
							/>
						</div>
					</div>
				</form>
			</div>
			<div className="sticky top-0 pt-4 space-y-6 z-[1] bg-container-background px-5 md:px-10 lg:px-14 xl:px-15">
				<div className=" rounded-t-lg py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1 text-sm font-normal leading-[21px]">
							{ /* Tabs */ }
							<div className="flex items-center justify-start gap-3">
								{ TABS.map( ( tab ) => (
									<button
										className={ classNames(
											'before:content-[attr(data-title)] before:block before:font-bold before:text-sm before:invisible before:h-0',
											'pb-3 px-0 pt-0 !border-x-0 !border-t-0 border-b-2 border-solid !border-b-accent-st bg-transparent text-sm font-semibold text-accent-st cursor-pointer focus-visible:outline-none focus:outline-none',
											tab.value !== activeTab &&
												'border-0 font-normal text-body-text'
										) }
										key={ tab.value }
										type="button"
										onClick={ () =>
											setActiveTab( tab.value )
										}
										data-title={ tab.label }
										disabled={ loadingNextStep }
									>
										{ tab.label }
										{ tab.value === TABS[ 2 ].value &&
											!! getSelectedImages(
												selectedImages
											)?.length &&
											` (${
												getSelectedImages(
													selectedImages
												)?.length
											})` }
										{ tab.value === TABS[ 1 ].value &&
											!! getUploadedImages(
												selectedImages
											)?.length &&
											` (${
												getUploadedImages(
													selectedImages
												)?.length
											})` }
									</button>
								) ) }
							</div>
						</div>
						{ activeTab === TABS[ 0 ].value && (
							<Dropdown
								placement="right"
								trigger={
									<div
										className="flex items-center gap-2 min-w-[100px] py-3 pl-4 pr-3 cursor-pointer border border-border-primary rounded-md"
										data-disabled={ loadingNextStep }
									>
										<span className="text-sm font-normal text-body-text leading-[150%]">
											{ orientation.label }
										</span>
										<ChevronDownIcon className="w-5 h-5 text-app-inactive-icon" />
									</div>
								}
								align="top"
								width="48"
								contentClassName="p-1 bg-white"
								disabled={ loadingNextStep }
							>
								{ Object.values( ORIENTATIONS ).map(
									( orientationItem, index ) => (
										<Dropdown.Item
											as="div"
											key={ index }
											className="only:!p-0"
										>
											<button
												type="button"
												className="w-full flex items-center justify-between gap-2 py-1.5 px-2 text-sm font-normal leading-5 text-body-text hover:bg-background-secondary transition duration-150 ease-in-out space-x-2 rounded bg-white border-none cursor-pointer"
												onClick={ handleOrientationChange(
													orientationItem
												) }
											>
												<span>
													{ orientationItem.label }
												</span>
												{ orientationItem.value ===
													orientation.value && (
													<CheckIcon className="w-4 h-4 text-heading-text" />
												) }
											</button>
										</Dropdown.Item>
									)
								) }
							</Dropdown>
						) }
						{ activeTab === TABS[ 2 ].value &&
							!! selectedImages?.length && (
								<button
									onClick={ handleClearImageSelection }
									className="px-1 py-px bg-transparent border border-solid border-border-primary rounded text-xs leading-4 text-body-text cursor-pointer"
									disabled={ loadingNextStep }
								>
									{ __( 'Clear', 'ai-builder' ) }
								</button>
							) }
						{ activeTab === TABS[ 1 ].value && (
							<UploadImage
								render={ ( { open } ) => (
									<button
										ref={ uploadImagesBtn }
										className="px-0 bg-transparent border-none rounded text-xs leading-5 font-semibold text-accent-st cursor-pointer inline-flex items-center justify-end gap-2"
										onClick={ open }
										disabled={ loadingNextStep }
									>
										<ArrowUpTrayIcon
											className="w-4 h-4 text-zip-app-inactive-icon"
											strokeWidth={ 2 }
										/>
										<span>
											{ __(
												'Upload Your Images',
												'ai-builder'
											) }
										</span>
									</button>
								) }
							/>
						) }
					</div>
				</div>
			</div>
			<div
				className="rounded-b-lg py-4 flex flex-col flex-auto relative px-5 md:px-10 lg:px-14 xl:px-15"
				data-disabled={ loadingNextStep }
			>
				{ activeTab === TABS[ 1 ].value && ! renderImages.length && (
					<div
						className={ classNames(
							'relative flex flex-col items-center justify-center gap-3 py-[3.125rem] px-4 bg-background-primary border border-dashed border-border-tertiary rounded cursor-pointer'
						) }
						data-disabled={ loadingNextStep }
						{ ...getRootProps() }
					>
						<input { ...getInputProps() } />
						<ArrowUpTrayIcon className="w-6 h-6 text-zip-app-inactive-icon" />
						<p className="text-zip-body-text text-base">
							<span className="text-accent-st min-w-fit break-keep text-nowrap whitespace-nowrap font-semibold mr-1">
								{ __( 'Upload images', 'ai-builder' ) }
							</span>
							{ __(
								'or drop your images here (Max 20)',
								'ai-builder'
							) }
						</p>
						<p className="text-zip-body-text text-base">
							{ __( 'PNG, JPG, JPEG', 'ai-builder' ) }
						</p>
						<p className="text-zip-body-text text-base">
							{ __( 'Max size: 5 MB per file', 'ai-builder' ) }
						</p>
						<div
							className="absolute inset-0"
							onClick={ () => {
								if ( ! uploadImagesBtn?.current ) {
									return;
								}
								uploadImagesBtn?.current.click();
							} }
						/>
					</div>
				) }

				<AnimatePresence>
					{ renderImages?.length > 0 && (
						<Masonry
							className="gap-6 [&>div]:gap-6"
							columns={ {
								default: 1,
								220: 1,
								767: 3,
								1024: 3,
								1280: 5,
								1441: 6,
								1920: 6,
							} }
						>
							{ renderImages.map( ( image ) =>
								image?.optimized_url ? (
									<ImagePreview
										key={ image.id }
										image={ image }
										isSelected={ isSelected( image ) }
										onClick={ handleImageSelection }
										variant={
											activeTab === TABS[ 2 ].value ||
											activeTab === TABS[ 1 ].value
												? 'selection'
												: 'default'
										}
									/>
								) : (
									image
								)
							) }
						</Masonry>
					) }
				</AnimatePresence>

				{ activeTab === TABS[ 2 ].value && ! renderImages.length && (
					<div className="flex flex-col items-center justify-center h-full">
						<p className="text-secondary-text text-center px-10 py-5 border-2 border-dashed border-border-primary rounded-md">
							{ __(
								'You have not selected any images yet.',
								'ai-builder'
							) }
						</p>
					</div>
				) }

				{ activeTab === TABS[ 0 ].value &&
					! isLoading &&
					! images.length &&
					imageRequestCompleted.current && (
						<div className="flex flex-col items-center justify-center h-full">
							<p className="text-secondary-text text-center px-10 py-5 border-2 border-dashed border-border-primary rounded-md">
								{ ! keyword.length ? (
									<>
										{ __(
											'Find the perfect images for your website by entering a keyword or selecting from the suggested options.',
											'ai-builder'
										) }
									</>
								) : (
									<>
										{ __(
											"We couldn't find anything with your keyword.",
											'ai-builder'
										) }
										<br />
										{ __(
											'Try to refine your search.',
											'ai-builder'
										) }
									</>
								) }
							</p>
						</div>
					) }
				{ activeTab === TABS[ 0 ].value &&
					! isLoading &&
					! hasMore &&
					!! images.length && (
						<div className="pb-5 pt-10 flex flex-col items-center justify-center h-full">
							<p className="text-secondary-text text-sm leading-5 text-center after:mx-2.5 after:content-[''] after:inline-block after:w-5 sm:after:w-12 after:h-px after:bg-app-border after:relative after:-top-[5px] before:mx-2.5 before:content-[''] before:inline-block before:w-5 sm:before:w-12 before:h-px before:bg-app-border before:relative before:-top-[5px]">
								{ __(
									'End of the search results',
									'ai-builder'
								) }
							</p>
						</div>
					) }
			</div>
			{ /* Back to the top */ }
			{ backToTop && (
				<div className="absolute right-20 bottom-28 ml-auto">
					<button
						type="button"
						className="absolute bottom-0 right-0 z-10 w-8 h-8 rounded-full bg-accent-st border-0 border-solid text-white flex items-center justify-center shadow-sm cursor-pointer"
						onClick={ handleClickBackToTop }
						disabled={ loadingNextStep }
					>
						<ChevronUpIcon className="w-5 h-5" />
					</button>
				</div>
			) }
			<div className="sticky bottom-0 bg-container-background py-4.75 px-5 md:px-10 lg:px-14 xl:px-15">
				<NavigationButtons
					{ ...( updateImages
						? {
								continueButtonText: __(
									'Save & Exit',
									'ai-builder'
								),
								onClickContinue: handleSaveDetails,
						  }
						: {
								onClickContinue: handleClickNext(),
								onClickSkip: handleClickNext( true ),
								onClickPrevious: previousStep,
						  } ) }
				/>
			</div>
		</div>
	);
};

export default Images;
