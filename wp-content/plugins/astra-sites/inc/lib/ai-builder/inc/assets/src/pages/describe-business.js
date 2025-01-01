import { useForm } from 'react-hook-form';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import apiFetch from '@wordpress/api-fetch';
import {
	useEffect,
	useState,
	useRef,
	useLayoutEffect,
} from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { WandIcon } from '../ui/icons';
import Textarea from '../components/textarea';
import LoadingSpinner from '../components/loading-spinner';
import NavigationButtons from '../components/navigation-buttons';
import Heading from '../components/heading';
import Divider from '../components/divider';
import { STORE_KEY } from '../store';
import { adjustTextAreaHeight } from '../utils/helpers';
import StyledText from '../components/styled-text';
import { __, sprintf } from '@wordpress/i18n';
import { useNavigateSteps } from '../router';
import Container from '../components/container';
import AISitesNotice from '../components/ai-sites-notice';
import { classNames, toastBody } from '../helpers';
import toast from 'react-hot-toast';
import improveUsingAiModal from '../components/improve-using-ai-modal';

const generateContentOptions = async ( {
	businessName,
	formBusinessDetails,
	businessType,
	siteLanguage,
} ) => {
	try {
		const response = await apiFetch( {
			path: `zipwp/v1/description`,
			method: 'POST',
			headers: {
				'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
			},
			data: {
				business_name: businessName,
				business_description: formBusinessDetails,
				category: businessType,
				language: siteLanguage,
			},
		} );

		if ( response?.success ) {
			return response?.data?.data;
		}
		console.error( response?.data?.data );
	} catch ( error ) {
		toast.error( toastBody( error ) );
	}
};

const DescribeBusiness = () => {
	const { nextStep, previousStep } = useNavigateSteps();

	const {
			businessDetails,
			businessType,
			businessName,
			siteLanguage,
			descriptionListStore,
		} = useSelect( ( select ) => {
			const { getAIStepData } = select( STORE_KEY );
			return getAIStepData();
		} ),
		categoryKey = ( businessType ?? '' )
			?.trim()
			?.replaceAll( ' ', '-' )
			?.toLowerCase();

	const aiOnboardingDetails = useSelect( ( select ) => {
			const { getOnboardingAI } = select( STORE_KEY );
			return getOnboardingAI();
		} ),
		{ loadingNextStep } = aiOnboardingDetails;

	const {
		setWebsiteDetailsAIStep,
		setWebsiteKeywordsAIStep,
		resetKeywordsImagesAIStep,
		setOnboardingAIDetails,
	} = useDispatch( STORE_KEY );

	const [ isLoading, setIsLoading ] = useState( false );
	const [ isFetchingKeywords, setIsFetchingKeywords ] = useState( false );
	const prevBusinessDetails = useRef( businessDetails );
	const textareaRef = useRef( null );

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		setFocus,
	} = useForm( { defaultValues: { businessDetails } } );
	const formBusinessDetails = watch( 'businessDetails' );

	const handleFetchSuggestion = async () => {
		try {
			const improvedDescription = generateContentOptions( {
				businessName,
				businessType,
				formBusinessDetails,
				siteLanguage,
			} );
			return improvedDescription;
		} catch ( error ) {
			console.log( error );
		}
	};

	const handleFormSubmit = async ( data ) => {
		let { businessDetails: description } = data;
		// if description too short, show modal
		if ( description.length < 200 ) {
			setFocus( 'businessDetails' );
			description = await improveUsingAiModal.show( {
				handleFetchSuggestion,
			} );

			if ( ! description ) {
				return;
			}

			setValue( 'businessDetails', description, {
				shouldValidate: true,
			} );

			return;
		}

		setWebsiteDetailsAIStep( data.businessDetails );
		if ( prevBusinessDetails.current !== data.businessDetails ) {
			// Reset images and keywords if description changes.
			resetKeywordsImagesAIStep();
		}
		await fetchImageKeywords( data.businessDetails );
		nextStep();
	};

	const handleGenerateContent = async () => {
		if ( isLoading ) {
			return;
		}

		setIsLoading( true );

		const newDescList = [ formBusinessDetails ];
		const description = await generateContentOptions( {
			businessName,
			businessType,
			formBusinessDetails,
			siteLanguage,
		} );

		if ( description ) {
			if ( description !== undefined ) {
				newDescList.push( description );

				addDescriptionToList( newDescList );

				setValue( 'businessDetails', description, {
					shouldValidate: true,
				} );

				setIsLoading( false );
			}
		} else {
			throw new Error();
		}
	};

	const fetchImageKeywords = async ( details ) => {
		if ( isFetchingKeywords ) {
			return;
		}
		// If description is same as previous, do not fetch keywords.
		if ( prevBusinessDetails.current === details ) {
			return;
		}
		setIsFetchingKeywords( true );
		try {
			const response = await apiFetch( {
				path: `zipwp/v1/keywords`,
				method: 'POST',
				headers: {
					'X-WP-Nonce': aiBuilderVars.rest_api_nonce,
				},
				data: {
					business_name: businessName,
					business_description: details,
					category: businessType,
				},
			} );
			if ( response.success ) {
				const keywordsData = response.data?.data;
				setWebsiteKeywordsAIStep(
					Array.isArray( keywordsData )
						? keywordsData
						: Object.values( keywordsData )
				);
			}
		} catch ( error ) {
			// DO Nothing.
		} finally {
			setIsFetchingKeywords( false );
		}
	};
	const STYLED_TEXT_PLACEHOLDER = '{{STYLED_TEXT}}';
	const getTitle = () => {
		const format =
			CATEGORY_DATA[ categoryKey ]?.questionFormat ||
			CATEGORY_DATA.unknown.questionFormat;
		const translatedText = sprintf( format, STYLED_TEXT_PLACEHOLDER );
		const parts = translatedText.split( STYLED_TEXT_PLACEHOLDER );

		return (
			<>
				{ parts[ 0 ] }
				<StyledText text={ businessName } />
				{ parts[ 1 ] }
			</>
		);
	};

	const CATEGORY_DATA = {
		business: {
			questionFormat:
				/* translators: %s: business name */
				__( 'What is %s? Please describe the business.', 'ai-builder' ),
			description: __(
				'Please be as descriptive as you can. Share details such as services, products, goals, etc.',
				'ai-builder'
			),
		},
		'personal-website': {
			questionFormat:
				/* translators: %s: person name */
				__( 'Who is %s? Tell us more about the person.', 'ai-builder' ),
			description: __(
				'Please be as descriptive as you can. Share details such as what they do, their expertise, offerings, etc.',
				'ai-builder'
			),
		},
		organisation: {
			questionFormat:
				/* translators: %s: organisation name */
				__(
					'What is %s? Please describe the organisation.',
					'ai-builder'
				),
			description: __(
				'Please be as descriptive as you can. Share details such as services, programs, mission, vision, etc.',
				'ai-builder'
			),
		},
		restaurant: {
			questionFormat:
				/* translators: %s: restaurant name */
				__(
					'What is %s? Tell us more about the restaurant.',
					'ai-builder'
				),
			description: __(
				'Please be as descriptive as you can. Share details such as a brief about the restaurant, specialty, menu, etc.',
				'ai-builder'
			),
		},
		product: {
			questionFormat:
				/* translators: %s: product name */
				__(
					'What is %s? Share more details about the product.',
					'ai-builder'
				),
			description: __(
				'Please be as descriptive as you can. Share details such as a brief about the product, features, some USPs, etc.',
				'ai-builder'
			),
		},
		event: {
			questionFormat:
				/* translators: %s: event name */
				__( 'Tell us more about %s.', 'ai-builder' ),
			description: __(
				'Please be as descriptive as you can. Share details such as Event information date, venue, some highlights, etc.',
				'ai-builder'
			),
		},
		'landing-page': {
			questionFormat:
				/* translators: %s: landing page name */
				__( 'Share more details about %s.', 'ai-builder' ),
			description: __(
				'Please be as descriptive as you can. Share details such as a brief about the product, features, some USPs, etc.',
				'ai-builder'
			),
		},
		medical: {
			questionFormat:
				/* translators: %s: medical facility name */
				__( 'Tell us more about the %s.', 'ai-builder' ),
			description: __(
				'Please be as descriptive as you can. Share details such as treatments, procedures, facilities, etc.',
				'ai-builder'
			),
		},
		unknown: {
			questionFormat:
				/* translators: %s: entity name */
				__( 'Please describe %s in a few words.', 'ai-builder' ),
			description: __(
				'The best way to describe anything is by answering a few WH questions. Who, What, Where, Why, When, etc.',
				'ai-builder'
			),
		},
	};

	useEffect( () => {
		setFocus( 'businessDetails' );
	}, [ setFocus ] );

	useLayoutEffect( () => {
		const textarea = textareaRef.current;
		if ( textarea ) {
			adjustTextAreaHeight( textarea );
		}
	}, [ formBusinessDetails ] );

	const { list: descriptionList, currentPage: descriptionPage } =
		descriptionListStore || {};

	const navigateDescription = ( showNext ) => {
		const newPageNumber = showNext
			? descriptionPage + 1
			: descriptionPage - 1;

		const currentPageIndex = descriptionPage - 1;

		const newList = [ ...descriptionList ];

		// check if user has made changes to current description and save that change in new slot
		if ( descriptionList[ currentPageIndex ] !== formBusinessDetails ) {
			newList[ currentPageIndex ] = formBusinessDetails;
		}

		setValue( 'businessDetails', newList[ newPageNumber - 1 ] );
		setOnboardingAIDetails( {
			...aiOnboardingDetails,
			stepData: {
				...aiOnboardingDetails.stepData,
				descriptionListStore: {
					...descriptionListStore,
					list: newList,
					currentPage: newPageNumber,
				},
			},
		} );
	};

	const addDescriptionToList = ( descList ) => {
		if ( ! Array.isArray( descList ) ) {
			return;
		}

		const filteredList = descList.filter(
			( desc ) =>
				desc?.trim()?.length !== 0 &&
				! descriptionList?.includes( desc )
		);

		const newDescList = [ ...descriptionList, ...filteredList ];

		setOnboardingAIDetails( {
			...aiOnboardingDetails,
			stepData: {
				...aiOnboardingDetails.stepData,
				descriptionListStore: {
					list: newDescList,
					currentPage: newDescList.length,
				},
				businessDetails: formBusinessDetails,
				templateList: [],
			},
		} );
	};

	const setBusinessDesc = ( descriptionValue, isOnSubmit ) => {
		if ( descriptionValue?.trim() === businessDetails?.trim() ) {
			return;
		}

		setOnboardingAIDetails( {
			...aiOnboardingDetails,
			stepData: {
				...aiOnboardingDetails.stepData,
				businessDetails: formBusinessDetails,
				...( ! isOnSubmit && {
					keywords: [],
					selectedImages: [],
					imagesPreSelected: false,
				} ),
				templateList: [],
			},
		} );
	};

	useEffect( () => {
		setBusinessDesc( formBusinessDetails );
		adjustTextAreaHeight( textareaRef.current );
	}, [ formBusinessDetails ] );

	return (
		<Container
			as="form"
			action="#"
			onSubmit={ handleSubmit( handleFormSubmit ) }
		>
			<AISitesNotice />
			<Heading
				heading={ getTitle( categoryKey ) || getTitle( 'unknown' ) }
				subHeading={
					CATEGORY_DATA[ categoryKey ]?.description ||
					CATEGORY_DATA.unknown.description
				}
			/>
			<div>
				<div
					className={ classNames(
						'ml-0 w-full text-right text-sm font-medium leading-5 text-app-text mb-2 -mt-2'
					) }
				>
					{ __( 'Characters: ', 'ai-builder' ) }
					<span>{ formBusinessDetails.length }</span> / 1000
				</div>
				<Textarea
					ref={ textareaRef }
					rows={ 6 }
					className="w-full"
					placeholder={ __(
						'E.g. Mantra Minds is a yoga studio located in Chino Hills, California. The studio offers a variety of classes such as Hatha yoga, Vinyasa flow, and Restorative yoga. The studio is led by Jane, an experienced and certified yoga instructor with over 10 years of teaching expertise. The welcoming atmosphere and personalized Jane make it a favorite among yoga enthusiasts in the area.',
						'ai-builder'
					) }
					name="businessDetails"
					maxLength={ 1000 }
					register={ register }
					validations={ {
						required: 'Details are required',
						maxLength: 1000,
					} }
					error={ errors.businessDetails }
					disabled={ isLoading || loadingNextStep }
				/>

				{ /* Wand Button */ }
				<div className="h-7 mt-3 flex items-center gap-2 text-app-secondary hover:text-app-accent-hover">
					{ isLoading && (
						<LoadingSpinner className="text-accent-st cursor-progress" />
					) }
					{ ! isLoading && (
						<div className="flex justify-between w-full">
							<div
								className="flex gap-2 cursor-pointer"
								onClick={ handleGenerateContent }
								data-disabled={ loadingNextStep }
							>
								<WandIcon className="w-5 h-5 transition duration-150 ease-in-out text-accent-st" />
								<span className="font-semibold text-sm transition duration-150 ease-in-out text-accent-st">
									{ formBusinessDetails?.trim() === ''
										? __( 'Write Using AI', 'ai-builder' )
										: __(
												'Improve Using AI',
												'ai-builder'
										  ) }
								</span>
							</div>

							<div className="flex gap-2 items-center justify-end w-[100px] cursor-default text-zip-body-text">
								<div className="w-5">
									{ descriptionPage > 1 ? (
										<ChevronLeftIcon
											className="w-5 cursor-pointer text-zip-body-text"
											onClick={ () =>
												navigateDescription( false )
											}
											data-disabled={ loadingNextStep }
										/>
									) : (
										<ChevronLeftIcon
											className="w-5 border-tertiary flex justify-center cursor-not-allowed"
											data-disabled="true"
										/>
									) }
								</div>
								<div className="zw-sm-semibold cursor-default">
									{ descriptionPage || 1 } /{ ' ' }
									{ descriptionList?.length || 1 }
								</div>
								<div className="w-5">
									{ descriptionPage !==
									descriptionList?.length ? (
										<ChevronRightIcon
											className="w-5 cursor-pointer text-zip-body-text"
											onClick={ () =>
												navigateDescription( true )
											}
											data-disabled={ loadingNextStep }
										/>
									) : (
										<ChevronRightIcon
											className="w-5 border-tertiary flex justify-center"
											data-disabled="true"
										/>
									) }
								</div>
							</div>
						</div>
					) }
				</div>
			</div>
			<Divider />
			<NavigationButtons
				onClickPrevious={ previousStep }
				loading={ isFetchingKeywords }
			/>
		</Container>
	);
};

export default DescribeBusiness;
