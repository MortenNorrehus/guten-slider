import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import {
	Button,
} from '@wordpress/components';
import { useDispatch, select, useSelect } from "@wordpress/data";
import './editor.scss';

import { InspectorControl } from './utils/InspectorControls.js';
import { InsertEditButton } from './utils/InsertEditButton.js';
import { InsertButtonBlock } from './utils/InsertButtonBlock.js';
import { useAfterSave } from './hooks/useAfterSave.js';

addFilter(
	'editor.BlockEdit',
	'gavflab/insert-edit-button',
	InsertEditButton
);

export default function Edit(props) {

	const isAfterSave = useAfterSave();

	const slider = useRef(null);

	const navigateSlider = (direction) => {
		if (direction == 'next') {
			const scrolledLeft = slider.current.scrollLeft;
			const sliderWidth = slider.current.offsetWidth;
			slider.current.scroll(scrolledLeft + sliderWidth, 0)
		}

		if (direction == 'prev') {
			const scrolledLeft = slider.current.scrollLeft;
			const sliderWidth = slider.current.offsetWidth;
			slider.current.scroll(scrolledLeft - sliderWidth, 0)
		}
	}

	const [cards, setCards] = useState([]);

	const { clientId } = props;

	const { blockCount } = useSelect(select => ({
		blockCount: select('core/block-editor').getBlockCount(props.clientId)
	}))

	const sliderBlocks = select("core/block-editor").getBlocksByClientId(clientId)[0].innerBlocks;
	const { getBlockRootClientId } = useSelect('core/block-editor');
	const { moveBlockToPosition } = useDispatch('core/block-editor');

	useEffect(() => {
		const moveBlock = () => {
			cards.map((card, index) => {
				const cardClientId = card.clientId;
				const sourceClientId = cardClientId;
				const fromRootClientId = getBlockRootClientId(sourceClientId);
				const toRootClientId = getBlockRootClientId(cardClientId);
				const targetIndex = index;

				moveBlockToPosition(sourceClientId, fromRootClientId, toRootClientId, targetIndex);
			})
		}
		moveBlock();
	}, [cards])

	useEffect(() => {
		if (isAfterSave) {
			loadCards();
		}
	}, [isAfterSave]);


	const loadCards = () => {
		setCards([]);

		const loadMedia = (attributes) => {

			if (attributes) {
				if (attributes.mediaMime.includes('image')) {
					return `" style="background-image: url(${attributes.mediaUrl}); background-repeat: no-repeat; background-size: cover; height:100%;">`;
				}

				/* A bit hacky solution to impelement a video placeholder background image */
				if (attributes.mediaMime.includes('video')) {
					return `video-placeholder">`;
				}
			}
		}

		if (sliderBlocks.length > 0) {
			sliderBlocks.map((slide, index) => {
				const sliderInnerBlocks = slide.innerBlocks;
				let innerContent = '';
				innerContent += `<div class="flex ${slide.attributes.contentPosition} ${loadMedia(slide.attributes.media)}`;
				sliderInnerBlocks.map(inner => {
					if (inner.name == 'core/buttons') {
						const align = inner.attributes.layout != undefined ? 'is-content-justification-' + inner.attributes.layout.justifyContent : '';
						innerContent += '<div class="wp-block-buttons' + ' ' + align + '">';
						inner.innerBlocks.forEach(inner => {
							innerContent += inner.originalContent ? inner.originalContent : 'Refresh to see content';
						})
						innerContent += '</div>';
					} else {
						innerContent += inner.originalContent ? inner.originalContent : 'Refrest to see content';
					}
				})
				innerContent += '</div>';

				//const slideContent = slide.originalContent.split('</div>')[0] + innerContent + slide.originalContent.slice(-6);
				const slideContent = innerContent;

				if (slide.innerBlocks.length > 0) {
					setCards(cards => [...cards, { id: index, text: slideContent, clientId: slide.clientId, identifier: slide.innerBlocks[0].originalContent }]);
				}
			})

		};

	}

	useEffect(() => {
		loadCards();
	}, [])

	props.setAttributes({ slides: cards })

	const blockProps = useBlockProps({
		style: {
			height: props.attributes.height
		}
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: `swiper-wrapper slides-1-${props.attributes.slidesPerView}`
		},
		{
			allowedBlocks: ['pixelhero/slide-block']
		}
	);
	return (
		<>
			<section className="gutenberg-slider" {...blockProps}>
				{blockCount == 0 &&
					<div className="slider_empty">
						<span>Slider is empty</span>
						<Button
							className="gutenberg-slider-add__slide is-primary"
							onClick={() => InsertButtonBlock(props)}
							help={'Add new slide'}>Add New Slide</Button>
					</div>}
				<div className="wrapper">
					<div {...innerBlocksProps} ref={slider} />
					<div className="slider-actions">
						<button onClick={() => navigateSlider('prev')}>Prev</button>
						<button onClick={() => navigateSlider('next')}>Next</button>
					</div>
				</div>
			</section>
			<InspectorControl cards={cards} setCards={setCards} props={props} />
		</>
	);
}