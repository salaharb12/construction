import { useForm } from 'react-hook-form';
import { __, sprintf } from '@wordpress/i18n';
import { renderToString, useEffect, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import SocialMediaAdd from '../components/social-media';
import Textarea from '../components/textarea';
import Input from '../components/input';
import { STORE_KEY } from '../store';
import Divider from '../components/divider';
import NavigationButtons from '../components/navigation-buttons';
import StyledText from '../components/styled-text';
import { useNavigateSteps } from '../router';
import { z as zod } from 'zod';
import Heading from '../components/heading';
import Container from '../components/container';
import AISitesNotice from '../components/ai-sites-notice';

const EMAIL_VALIDATION_REGEX =
	/^[a-z0-9!'#$%&*+\/=?^_`{|}~-]+(?:\.[a-z0-9!'#$%&*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-zA-Z]{2,}$/i;

const mapSocialUrl = ( list ) => {
	return list.map( ( item ) => {
		return {
			type: item.id,
			id: item.id,
			url: item.url,
		};
	} );
};

const BusinessContact = () => {
	const { nextStep, previousStep } = useNavigateSteps();

	const { businessContact } = useSelect( ( select ) => {
		const { getAIStepData } = select( STORE_KEY );
		return getAIStepData();
	} );
	const { setWebsiteContactAIStep } = useDispatch( STORE_KEY );
	const [ socialMediaList, setSocialMediaList ] = useState(
		mapSocialUrl( businessContact.socialMedia ?? [] )?.map( ( item ) => ( {
			...item,
			valid: true,
		} ) )
	);

	const handleOnChangeSocialMedia = ( list ) => {
		setSocialMediaList( list );
	};

	const { businessName } = useSelect( ( select ) => {
		const { getAIStepData } = select( STORE_KEY );
		return getAIStepData();
	} );

	const getValidationSchema = () =>
		zod.object( {
			email: zod
				.string()
				.refine(
					( value ) =>
						value === '' || EMAIL_VALIDATION_REGEX.test( value ),
					{
						message: __(
							'Please enter a valid email',
							'ai-builder'
						),
					}
				),
			address: zod.string().optional(),
		} );

	const {
		register,
		handleSubmit,
		formState: { errors },
		setFocus,
		watch,
	} = useForm( { defaultValues: { ...businessContact } } );

	const handleSubmitForm = ( data ) => {
		setWebsiteContactAIStep( {
			...data,
			socialMedia: mapSocialUrl( socialMediaList ),
		} );
		nextStep();
	};

	const getValidFormValues = ( formValue ) => {
		const schema = getValidationSchema();

		const validationResult = schema.safeParse( formValue );

		return validationResult?.success
			? validationResult.data
			: {
					...formValue,
					...validationResult.error.issues.reduce( ( acc, error ) => {
						acc[ error.path[ 0 ] ] = '';
						return acc;
					}, {} ),
			  };
	};

	// Save inputs before moving to the previous step.
	const handleClickPrevious = async () => {
		const formValue = watch();
		const validValues = getValidFormValues( formValue );

		setWebsiteContactAIStep( {
			...validValues,
			socialMedia: mapSocialUrl(
				getFilteredSocialMediaList( socialMediaList )
			),
		} );
		previousStep();
	};

	const getFilteredSocialMediaList = ( list ) => {
		return list.filter( ( item ) => item.valid );
	};

	useEffect( () => {
		setFocus( 'email' );
	}, [ setFocus ] );

	const hasInvalidSocialMediaUrl = socialMediaList.some(
		( item ) => ! item.valid
	);

	const getTitle = () => {
		return (
			<div
				dangerouslySetInnerHTML={ {
					__html: sprintf(
						// translators: %s: Business name.
						__(
							'How can people get in touch with %1$s?',
							'ai-builder'
						),
						renderToString( <StyledText text={ businessName } /> )
					),
				} }
			/>
		);
	};
	return (
		<Container
			as="form"
			action="#"
			onSubmit={ handleSubmit( handleSubmitForm ) }
		>
			<AISitesNotice />
			<Heading
				heading={ getTitle() }
				subHeading={ __(
					'Please provide the contact information below. These will be used on the website.',
					'ai-builder'
				) }
			/>

			<div className="space-y-5">
				<div className="flex justify-between gap-x-8 items-start w-full h-[76px]">
					<Input
						className="w-full h-[48px] text-zip-app-heading"
						type="email"
						name="email"
						id="email"
						label={ __( 'Email', 'ai-builder' ) }
						placeholder={ __( 'Your email', 'ai-builder' ) }
						register={ register }
						error={ errors.email }
						validations={ {
							pattern: {
								value: EMAIL_VALIDATION_REGEX,
								message: __(
									'Please enter a valid email',
									'ai-builder'
								),
							},
						} }
						height="[48px]"
					/>
					<Input
						className="w-full h-[48px] text-zip-app-heading"
						type="text"
						name="phone"
						id="phone"
						label={ __( 'Phone Number', 'ai-builder' ) }
						placeholder={ __( 'Your phone number', 'ai-builder' ) }
						register={ register }
						error={ errors.phone }
						height="[48px]"
					/>
				</div>
				<Textarea
					className="text-zip-app-heading !mt-8"
					rows={ 3 }
					name="address"
					id="address"
					label={ __( 'Address', 'ai-builder' ) }
					placeholder=""
					register={ register }
					error={ errors.address }
				/>

				<SocialMediaAdd
					list={ socialMediaList }
					onChange={ handleOnChangeSocialMedia }
				/>
			</div>
			<Divider />
			<NavigationButtons
				onClickPrevious={ handleClickPrevious }
				onClickSkip={ nextStep }
				disableContinue={ hasInvalidSocialMediaUrl }
			/>
		</Container>
	);
};

export default BusinessContact;
