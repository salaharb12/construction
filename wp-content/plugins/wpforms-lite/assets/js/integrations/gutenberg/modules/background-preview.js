/* global wpforms_gutenberg_form_selector */
/* jshint es3: false, esversion: 6 */

import PropTypes from 'prop-types';

/**
 * @param strings.remove_image
 */

/**
 * React component for the background preview.
 *
 * @since 1.8.8
 *
 * @param {Object}   props                    Component props.
 * @param {Object}   props.attributes         Block attributes.
 * @param {Function} props.onRemoveBackground Function to remove the background.
 * @param {Function} props.onPreviewClicked   Function to handle the preview click.
 *
 * @return {Object} React component.
 */
const BackgroundPreview = ( { attributes, onRemoveBackground, onPreviewClicked } ) => {
	const { Button } = wp.components;
	const { strings } = wpforms_gutenberg_form_selector;

	return (
		<div className="wpforms-gutenberg-form-selector-background-preview">
			<style>
				{ `
					.wpforms-gutenberg-form-selector-background-preview-image {
						--wpforms-background-url: ${ attributes.backgroundUrl };
					}
				` }
			</style>
			<input
				className="wpforms-gutenberg-form-selector-background-preview-image"
				onClick={ onPreviewClicked }
				tabIndex={ 0 }
				type="button"
				onKeyDown={
					( event ) => {
						if ( event.key === 'Enter' || event.key === ' ' ) {
							onPreviewClicked();
						}
					}
				}
			>
			</input>
			<Button
				isSecondary
				className="is-destructive"
				onClick={ onRemoveBackground }
			>
				{ strings.remove_image }
			</Button>
		</div>
	);
};

BackgroundPreview.propTypes = {
	attributes: PropTypes.object.isRequired,
	onRemoveBackground: PropTypes.func.isRequired,
	onPreviewClicked: PropTypes.func.isRequired,
};

export default BackgroundPreview;
