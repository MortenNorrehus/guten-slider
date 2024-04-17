// counter/save.js
import { __ } from "@wordpress/i18n";
import { InnerBlocks, useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";

const SaveSlide = (props) => {
    const blockProps = useBlockProps.save();

    const mediaUrl = props.attributes.media != null ? {
        backgroundImage: `url(${props.attributes.media.mediaUrl}`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    } : '';

    return (

        <InnerBlocks.Content />

    )


};
export default SaveSlide;