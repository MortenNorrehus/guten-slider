import { dispatch, select } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";

export const InsertButtonBlock = (props) => {
    const innerCount = select("core/block-editor").getBlocksByClientId(props.clientId)[0]
        .innerBlocks.length;
    let block = createBlock("pixelhero/slide-block");
    dispatch("core/block-editor").insertBlock(block, innerCount, props.clientId);

    setTimeout(() => {
        document.getElementById('block-' + block.clientId).scrollIntoView()
    }, 500);
}