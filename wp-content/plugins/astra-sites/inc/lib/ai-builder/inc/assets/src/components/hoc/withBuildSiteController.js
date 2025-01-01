import { Fragment } from '@wordpress/element';
import useBuildSiteController from '../../hooks/useBuildSiteController';
import PreBuildConfirmModal from '../pre-build-confirm-modal';
import PremiumConfirmModal from '../premium-confirm-modal';
import InformPrevErrorModal from '../inform-prev-error-modal';

const withBuildSiteController = ( WrappedComponent ) => {
	const WithBuildSiteController = ( { ...props } ) => {
		const {
			preBuildModal,
			handleClosePreBuildModal,
			handleGenerateContent,
			premiumModal,
			setPremiumModal,
			prevErrorAlert,
			setPrevErrorAlertOpen,
			onConfirmErrorAlert,
			handleClickStartBuilding,
			isInProgress,
		} = useBuildSiteController();

		return (
			<Fragment>
				<WrappedComponent
					{ ...{ handleClickStartBuilding, isInProgress, ...props } }
				/>
				<PreBuildConfirmModal
					open={ preBuildModal.open }
					setOpen={ handleClosePreBuildModal }
					startBuilding={ handleGenerateContent(
						preBuildModal.skipFeature
					) }
				/>
				<PremiumConfirmModal
					open={ premiumModal }
					setOpen={ setPremiumModal }
				/>
				<InformPrevErrorModal
					open={ prevErrorAlert.open }
					setOpen={ setPrevErrorAlertOpen }
					onConfirm={ onConfirmErrorAlert }
					errorString={ JSON.stringify( prevErrorAlert.error ) }
				/>
			</Fragment>
		);
	};

	return WithBuildSiteController;
};

export default withBuildSiteController;
