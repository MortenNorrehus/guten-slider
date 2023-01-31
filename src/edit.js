
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;

const { createHigherOrderComponent } = wp.compose;
const { ToggleControl } = wp.components;

import { __ } from '@wordpress/i18n';
import { useDrag } from 'react-dnd'
import update from 'immutability-helper'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { useState, useCallback, useEffect } from '@wordpress/element';

import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, Button, __experimentalNumberControl as NumberControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { createBlock } from "@wordpress/blocks";
import { useDispatch, dispatch, select, useSelect, subscribe } from "@wordpress/data";



import './editor.scss';

import { Card } from './components/Card.js';
//import { SliderContainer } from './components/SliderContainer.js'




const withAdvancedControls = createHigherOrderComponent((BlockEdit) => {
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


		if (parentAttributes.length > 0 && parentAttributes[0].name === 'gavflab/gutenberg-slider') {
			return (
				<Fragment>
					{isSelected &&
						<InspectorControls>
							<PanelBody>
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
		} else {
			return (
				<BlockEdit {...props} />
			)
		}
	};

}, 'withAdvancedControls');

addFilter(
	'editor.BlockEdit',
	'editorskit/custom-advanced-control',
	withAdvancedControls
);






export default function Edit(props) {



	const [cards, setCards] = useState([]);
	const [size, setSize] = useState(props.attributes.size);
	const [height, setHeight] = useState(props.attributes.height);

	const { clientId } = props;

	const { blockCount } = useSelect(select => ({
		blockCount: select('core/block-editor').getBlockCount(props.clientId)
	}))

	const ALLOWED_BLOCKS = ["core/cover"];

	function insertButtonBlock() {
		const innerCount = select("core/block-editor").getBlocksByClientId(clientId)[0]
			.innerBlocks.length;
		let block = createBlock("core/cover");
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
					let innerContent = '<div class="editor-styles-wrapper">';
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

					const slideContent = slide.originalContent.slice(0, -12) + innerContent + slide.originalContent.slice(-12);

					setCards(cards => [...cards, { id: index, text: slideContent, clientId: slide.clientId, identifier: slide.innerBlocks[0].originalContent }]);
				})
			};

		}
		loadCards();
	}, [])

	props.setAttributes({ slides: cards })

	console.log(sliderBlocks);



	const styling = {
		height: '200px'
	}

	const blockProps = useBlockProps({
		style: {
			height: props.attributes.height
		}
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "swiper-wrapper"
		},
		{
			allowedBlocks: ['core/cover']
		}
	);



	return (
		<>
			<section className="gutenberg-slider" {...blockProps}>

				<div {...innerBlocksProps} />

			</section>
			<InspectorControls>
				<PanelBody>
					<DndProvider backend={HTML5Backend}>
						<SliderContainer {...props} />
					</DndProvider>
					<Button
						className="gutenberg-slider-add__slide is-primary"
						onClick={insertButtonBlock}>Add New Slide</Button>

				</PanelBody>
				<PanelBody
					className="height_unit_control">

					<UnitControl
						label='Min. Slider Height'
						min='0'
						onChange={(newHeight) => { props.setAttributes({ height: newHeight }), setHeight(newHeight) }}
						onUnitChange={(newSize) => { props.setAttributes({ size: newSize }), setSize(newSize) }}
						value={[props.attributes.height]}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
