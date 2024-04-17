import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
    PanelBody,
    Button,
} from '@wordpress/components';

import { Fragment } from '@wordpress/element';

export const InsertEditButton = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const {
            isSelected,
        } = props;

        const handleSliderEdit = () => {
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