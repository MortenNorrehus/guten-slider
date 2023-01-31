// counter/save.js
import { __ } from "@wordpress/i18n";
import { InnerBlocks, useInnerBlocksProps, useBlockProps } from "@wordpress/block-editor";

const Save = (props) => {
    const blockProps = useBlockProps.save();
    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    )


};
export default Save;