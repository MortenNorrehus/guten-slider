import { insertEditButton } from './components/insertEditButton';
import {
    useBlockProps,
    useInnerBlocksProps,
    BlockControls,
    MediaUpload,
    MediaPlaceholder,
    MediaUploadCheck,
    BlockIcon,
    InspectorControls
} from '@wordpress/block-editor';

import {
    ToolbarButton,
    ToolbarGroup,
    PanelBody,
    PanelRow,
    SelectControl,
    Dropdown,
    ColorPicker
} from "@wordpress/components";

import { addFilter } from '@wordpress/hooks';
import { useState } from '@wordpress/element';

addFilter(
    'editor.BlockEdit',
    'pixelhero/insert-edit-button',
    insertEditButton
);

export default function SlideEdit(props) {
    const [position, setPosition] = useState('middle-center');
    const [color, setColor] = useState(props.attributes.color);

    const blockProps = useBlockProps({
        className: `gutenberg_slider_slide ${props.attributes.contentPosition}`,
    });
    const innerBlocksProps = useInnerBlocksProps(blockProps,
        {
            template: [['core/paragraph', { placeholder: 'Slider Paragraph' }]],
            allowedBlocks: ['core/paragraph', 'core/heading', 'core/buttons']
        }
    );

    const hasMedia = props.attributes.media;

    const ColorButton = ({ action }) => {
        return (
            <button className="color-selector" onClick={action}>
                <div className="color-swatch component-color-indicator" style={{ background: color }}></div>
                Gradient Overlay
            </button>)
    }

    return (
        <>
            <div {...blockProps}>
                {!hasMedia &&
                    <MediaPlaceholder
                        icon={<BlockIcon icon="format-gallery" />}
                        labels={{
                            title: "Cover Slider",
                            instructions: "Create a cover slider.",
                        }}
                        onSelect={(newMedia) => {
                            props.setAttributes({
                                media: {
                                    mediaMime: newMedia.mime,
                                    mediaId: newMedia.id,
                                    mediaUrl: newMedia.url
                                }
                            }, console.log(newMedia))
                        }}
                    >
                        {/*  INSERT EXTRA CONTENT HERE - EX. VIMEO/YOUTUBE */}
                    </MediaPlaceholder>
                }
                {hasMedia &&
                    <>
                        <InspectorControls>
                            <PanelBody>
                                <SelectControl
                                    label="Content Position"
                                    value={props.attributes.contentPosition}
                                    options={[
                                        { label: 'Middle Left', value: 'middle-left' },
                                        { label: 'Middle Center', value: 'middle-center' },
                                        { label: 'Middle Right', value: 'middle-right' },
                                        { label: 'Middle Bottom', value: 'middle-bottom' },
                                        { label: 'Bottom Left', value: 'bottom-left' },
                                        { label: 'Bottom Right', value: 'bottom-right' },
                                    ]}
                                    onChange={(newPos) => props.setAttributes({ contentPosition: newPos })}
                                    __nextHasNoMarginBottom
                                />
                            </PanelBody>
                            <PanelBody>
                                <PanelRow>
                                    <Dropdown
                                        renderContent={() =>
                                            <ColorPicker
                                                color={color}
                                                onChange={(value) => { props.setAttributes({ color: value }), setColor(value) }}
                                                enableAlpha
                                                defaultValue="#000"
                                            />
                                        }
                                        renderToggle={({ isOpen, onToggle }) => (
                                            <ColorButton action={onToggle} />)}

                                    />
                                </PanelRow>
                            </PanelBody>
                        </InspectorControls>
                        <BlockControls>
                            <ToolbarGroup>
                                <MediaUploadCheck>
                                    <MediaUpload
                                        onSelect={(newMedia) =>
                                            props.setAttributes({
                                                media: {
                                                    mediaMime: newMedia.mime,
                                                    mediaId: newMedia.id,
                                                    mediaUrl: newMedia.url
                                                }
                                            })}
                                        allowedTypes={["image", "video"]}
                                        value={props.attributes.media.mediaId}
                                        render={({ open }) => (
                                            <ToolbarButton
                                                icon={<BlockIcon icon="format-gallery" />}
                                                label="Replace Image"
                                                onClick={open}>
                                            </ToolbarButton>)}
                                    />
                                </MediaUploadCheck>
                            </ToolbarGroup>
                        </BlockControls>

                        <div className={`slider_wrapper`}>
                            <div className='swiper-media'>
                                {props.attributes.media.mediaMime.includes('image') &&
                                    <img src={props.attributes.media.mediaUrl} />
                                }
                                {props.attributes.media.mediaMime.includes('video') &&
                                    <video width="100%" height="100%" autoPlay playsInline loop>
                                        <source src={props.attributes.media.mediaUrl} type={props.attributes.media.mime} />
                                        Your browser does not support the video tag.
                                    </video>
                                }
                            </div>
                            <div className='gradient' style={{ background: color }}></div>
                            <div {...innerBlocksProps} />
                        </div>
                    </>
                }
            </div >
        </>
    );
}
