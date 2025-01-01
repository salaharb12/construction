// Import all steps.
import SiteList from './site-list';
import SiteListHeader from './site-list/header';
import CustomizeSite from './customize-site';
import ImportSite from './import-site';
import Survey from './survey';
import SiteType from './site-type';
import FeaturesStep from './features';
import PageBuilder from './page-builder';

export const STEPS = [
	{
		name: 'page-builder',
		header: <SiteListHeader />,
		content: <SiteType />,
		class: 'step-page-builder',
	},
	{
		name: 'classic-page-builder',
		header: <SiteListHeader />,
		content: <PageBuilder />,
		class: 'step-page-builder',
	},
	{
		name: 'site-list',
		header: <SiteListHeader />,
		content: <SiteList />,
		class: 'step-site-list',
	},
	{
		name: 'customizer',
		content: <CustomizeSite />,
		class: 'step-customizer',
	},
	{
		name: 'features',
		content: <FeaturesStep />,
		class: 'step-feature',
	},
	{
		name: 'survey',
		content: <Survey />,
		class: 'step-survey',
	},
	{
		name: 'import-site',
		title: 'We are buiding your website...',
		content: <ImportSite />,
		class: 'step-import-site',
	},
];
