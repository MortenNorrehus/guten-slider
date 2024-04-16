
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;

const { createHigherOrderComponent } = wp.compose;


import { __ } from '@wordpress/i18n';
import { useDrag } from 'react-dnd'
import update from 'immutability-helper'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useState, useCallback, useEffect, useRef } from '@wordpress/element';

import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	Button,
	__experimentalUnitControl as UnitControl,
	__experimentalNumberControl as NumberControl,
	ToggleControl
} from '@wordpress/components';
import { createBlock } from "@wordpress/blocks";
import { useDispatch, dispatch, select, useSelect, subscribe } from "@wordpress/data";



import './editor.scss';

import { Card } from './components/Card.js';
//import { SliderContainer } from './components/SliderContainer.js'





const insertEditButton = createHigherOrderComponent((BlockEdit) => {
	return (props) => {

		const { clientId } = props;

		const {
			attributes,
			setAttributes,
			isSelected,
		} = props;


		const handleSliderEdit = (clientId) => {
			const parentBlocks = wp.data.select('core/block-editor').getBlockParents(props.clientId);
			const parentAttributes = wp.data.select('core/block-editor').getBlocksByClientId(parentBlocks);

			parentAttributes.forEach(parent => {
				if (parent.name == 'gavflab/gutenberg-slider') {
					wp.data.dispatch('core/block-editor').selectBlock(parent.clientId)
				}
			})
		}

		const parentBlocks = wp.data.select('core/block-editor').getBlockParents(props.clientId);
		const parentAttributes = wp.data.select('core/block-editor').getBlocksByClientId(parentBlocks);


		if (parentAttributes.length > 0 && parentAttributes[0].name === 'gavflab/gutenberg-slider' && props.name === 'pixelhero/slide-block') {
			return (
				<Fragment>
					{isSelected &&
						<InspectorControls>
							<PanelBody>
								<p>Click "Edit Slider" to edit the slider</p>
								<Button
									className="is-primary edit_main-slider"
									onClick={(e) => { handleSliderEdit(props.clientId) }}>
									Edit Slider
								</Button>
							</PanelBody>
						</InspectorControls>
					}
					<BlockEdit {...props} />

				</Fragment>
			);
		}
		else {
			return (
				<BlockEdit {...props} />
			)
		}
	};

}, 'insertEditButton');

addFilter(
	'editor.BlockEdit',
	'gavflab/insert-edit-button',
	insertEditButton
);



export default function Edit(props) {

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
	const [autoplay, setAutoplay] = useState(props.attributes.autoplay)
	const [autoplayDelay, setAutoplayDelay] = useState(props.attributes.autoplayDelay)
	const [slidesPerView, setSlidesPerView] = useState(props.attributes.slidesPerView)
	const [navigation, setNavigation] = useState(props.attributes.navigation)
	const [pagination, setPagination] = useState(props.attributes.pagination)
	const [speed, setSpeed] = useState(props.attributes.speed)
	const [_size, setSize] = useState(props.attributes.size);
	const [_height, setHeight] = useState(props.attributes.height);

	const { clientId } = props;

	const { blockCount } = useSelect(select => ({
		blockCount: select('core/block-editor').getBlockCount(props.clientId)
	}))

	function insertButtonBlock() {
		const innerCount = select("core/block-editor").getBlocksByClientId(clientId)[0]
			.innerBlocks.length;
		let block = createBlock("pixelhero/slide-block");
		dispatch("core/block-editor").insertBlock(block, innerCount, clientId);

		setTimeout(() => {
			document.getElementById('block-' + block.clientId).scrollIntoView()
		}, 500);

	}

	const SliderContainer = () => {
		{
			const moveCard = useCallback((dragIndex, hoverIndex) => {
				setCards((prevCards) =>
					update(prevCards, {
						$splice: [
							[dragIndex, 1],
							[hoverIndex, 0, prevCards[dragIndex]],
						],
					}),
				)
			}, [])
			const renderCard = useCallback((card, index) => {
				return (
					<>
						<Card
							key={card.id}
							index={index}
							id={card.id}
							text={card.text}
							moveCard={moveCard}
							clientId={card.clientId}
						/>
					</>
				)
			}, [])
			return (
				<>
					<div>{cards.map((card, i) => renderCard(card, i))}</div>
				</>
			)

		}

	}

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

		const loadCards = () => {
			setCards([]);

			if (sliderBlocks.length > 0) {

				sliderBlocks.map((slide, index) => {

					const sliderInnerBlocks = slide.innerBlocks;
					let innerContent = '';
					innerContent += `<div class="flex ${slide.attributes.contentPosition}" style="background-image: url(${slide.attributes.media.mediaUrl}); background-repeat: no-repeat; background-size: cover; height:100%;">`;
					sliderInnerBlocks.map(inner => {

						if (inner.name == 'core/buttons') {
							const align = inner.attributes.layout != undefined ? 'is-content-justification-' + inner.attributes.layout.justifyContent : '';
							innerContent += '<div class="wp-block-buttons' + ' ' + align + '">';
							inner.innerBlocks.forEach(inner => {
								innerContent += inner.originalContent
							})
							innerContent += '</div>';
						} else {
							innerContent += inner.originalContent;
						}
					})
					innerContent += '</div>';

					const slideContent = slide.originalContent.split('</div>')[0] + innerContent + slide.originalContent.slice(-6);

					if (slide.innerBlocks.length > 0) {
						setCards(cards => [...cards, { id: index, text: slideContent, clientId: slide.clientId, identifier: slide.innerBlocks[0].originalContent }]);
					}
				})

			};

		}
		loadCards();
	}, [])

	props.setAttributes({ slides: cards })

	console.log(wp.data.select('core/block-editor').getBlockAttributes(props.clientId))
	console.log(props.clientId)
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
							onClick={insertButtonBlock}
							help={'fghj'}>Add New Slide</Button>
					</div>}
				<div className="wrapper">
					<div {...innerBlocksProps} ref={slider} />
					<div className="slider-actions">
						<button onClick={() => navigateSlider('prev')}>Prev</button>
						<button onClick={() => navigateSlider('next')}>Next</button>
					</div>
				</div>
			</section>
			<InspectorControls>
				<PanelBody>
					<DndProvider backend={HTML5Backend}>
						<p>Drag and drop slides to change order.</p>
						<p>Click 'Edit' to edit the slide</p>
						<SliderContainer cards={cards} {...props}

						/>
					</DndProvider>
					<Button
						className="gutenberg-slider-add__slide is-primary"
						onClick={insertButtonBlock}
						help={'fghj'}>Add New Slide</Button>

				</PanelBody>
				<PanelBody>
					<PanelRow>
						<UnitControl
							label='Min. Slider Height'
							min='0'
							onChange={(newHeight) => { props.setAttributes({ height: newHeight }), setHeight(newHeight) }}
							onUnitChange={(newSize) => { props.setAttributes({ size: newSize }), setSize(newSize) }}
							value={[props.attributes.height]}
							help='Set Min. height'
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="Slides Per View"
							isShiftStepEnabled={true}
							onChange={(value) => { props.setAttributes({ slidesPerView: parseInt(value) }), setSlidesPerView(value), console.log(value) }}
							shiftStep={10}
							max={6}
							value={slidesPerView}
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="Slider Speed"
							isShiftStepEnabled={true}
							onChange={(value) => { props.setAttributes({ speed: parseInt(value) }), setSpeed(value) }}
							shiftStep={10}
							value={speed}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Toggle Autoplay"
							checked={autoplay}
							onChange={(value) => { props.setAttributes({ autoplay: value }), setAutoplay(value) }}>
						</ToggleControl>
					</PanelRow>
					{autoplay &&
						<PanelRow>
							<NumberControl
								label="Autplay Speed in ms"
								isShiftStepEnabled={true}
								onChange={(value) => { props.setAttributes({ autoplayDelay: parseInt(value) }), setAutoplayDelay(value) }}
								shiftStep={10}
								value={autoplayDelay}
							/>
						</PanelRow>
					}
					<PanelRow>
						<ToggleControl
							label="Toggle Navigation"
							checked={navigation}
							onChange={(value) => { props.setAttributes({ navigation: value }), setNavigation(value) }}>
						</ToggleControl>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="Toggle Pagination"
							checked={pagination}
							onChange={(value) => { props.setAttributes({ pagination: value }), setPagination(value) }}>
						</ToggleControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
		</>
	);
}