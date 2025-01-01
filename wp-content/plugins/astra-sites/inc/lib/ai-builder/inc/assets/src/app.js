import NiceModal from '@ebay/nice-modal-react';
import Router from './router';
// Global Stylesheet
import './style.scss';

// Main App component
const App = () => (
	<NiceModal.Provider>
		<Router />;
	</NiceModal.Provider>
);

export default App;
