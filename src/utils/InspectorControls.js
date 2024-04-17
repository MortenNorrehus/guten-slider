import { InspectorControls } from '@wordpress/block-editor';
import { SliderContainer } from '../components/SliderContainer.js'
import { useState } from '@wordpress/element';
import { InsertButtonBlock } from './InsertButtonBlock';

import {
    PanelBody,
    PanelRow,
    Button,
    __experimentalUnitControl as UnitControl,
    __experimentalNumberControl as NumberControl,
    ToggleControl
} from '@wordpress/components';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


export const InspectorControl = ({ cards, setCards, props }) => {

    const [autoplay, setAutoplay] = useState(props.attributes.autoplay)
    const [autoplayDelay, setAutoplayDelay] = useState(props.attributes.autoplayDelay)
    const [slidesPerView, setSlidesPerView] = useState(props.attributes.slidesPerView)
    const [navigation, setNavigation] = useState(props.attributes.navigation)
    const [pagination, setPagination] = useState(props.attributes.pagination)
    const [speed, setSpeed] = useState(props.attributes.speed)
    const [_size, setSize] = useState(props.attributes.size);
    const [_height, setHeight] = useState(props.attributes.height);

    return (<InspectorControls>
        <PanelBody>
            <DndProvider backend={HTML5Backend}>
                <p>Drag and drop slides to change order.</p>
                <p>Click 'Edit' to edit the slide</p>
                <SliderContainer cards={cards} setCards={setCards} {...props} />
            </DndProvider>
            <Button
                className="gutenberg-slider-add__slide is-primary"
                onClick={() => InsertButtonBlock(props)}
                help={'Adds new slide'}>Add New Slide</Button>
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
    </InspectorControls>)
}