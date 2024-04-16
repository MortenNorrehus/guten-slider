/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */

import './style.scss';
import './swiper.css';

/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */

import SlideEdit from './blocks/slide/slideEdit';
import SaveSlide from './blocks/slide/slideSave';

registerBlockType(metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	save: Save,
});

registerBlockType('pixelhero/slide-block', {
	apiVersion: 3,
	title: __('Slide', 'gutenslider'),
	//description: __('Single Slide for Slider.', 'gutenslider'),
	category: 'media',
	icon:
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M192 50H64a14 14 0 0 0-14 14v128a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V64a14 14 0 0 0-14-14m2 142a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V64a2 2 0 0 1 2-2h128a2 2 0 0 1 2 2Zm44-136v144a6 6 0 0 1-12 0V56a6 6 0 0 1 12 0M30 56v144a6 6 0 0 1-12 0V56a6 6 0 0 1 12 0" /></svg>,
	keywords: [
		__('Slide', 'gutenslider'),
		__('Swipe', 'gutenslider'),
		__('Carousel', 'gutenslider'),
	],
	supports: {
		html: false,
		inserter: false,
		defaultStylePicker: false,
	},
	attributes: {
		"media": {
			"type": "object",
			"default": null
		},
		"contentPosition": {
			"type": "string",
			"default": "middle-center"
		},
		"color": {
			"type": "string",
			"default": ''
		}
	},
	edit: SlideEdit,
	save: SaveSlide
});
