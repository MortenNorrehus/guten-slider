<section <?php echo get_block_wrapper_attributes(); ?>>
    <?php
	echo '<div class="swiper-wrapper">';
	foreach ($block->inner_blocks as $inner_block) {
		echo '<div class="swiper-slide">';
		echo $inner_block->render();
		echo '</div>';
	}
	echo '</div>'; ?>
</section>