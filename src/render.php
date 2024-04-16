<?php
if (!function_exists('init_assets')) {
	function init_assets()
	{
		// Styles
		wp_register_style('swiper', "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css", false, '', 'all');
		wp_enqueue_style('swiper');

		// Scripts
		wp_register_script('swiper', "https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js", '', '', false);
		wp_enqueue_script('swiper');
	}

	// Hook: Frontend assets.
	add_action('enqueue_block_assets', 'init_assets');
}


/* ATTRIBUTES */

/* Autoplay */
$autoplay = '';
if (($attributes['autoplay'] != '')) {
	$autoplay = 'autoplay=true autoplay-delay=' . $attributes['autoplayDelay'];
}

/* Navigation */
$navigation = '';
if (($attributes['navigation'] != '')) {
	$navigation = 'navigation=true';
}

/* Pagination */
$pagination = '';
if (($attributes['pagination'] != '')) {
	$pagination = 'pagination=true';
}

?>

<swiper-container <?php echo get_block_wrapper_attributes(); ?> <?= $autoplay ?> slides-per-view="<?= $attributes['slidesPerView'] ?>" speed="<?= $attributes['speed'] ?>" <?= $navigation ?> <?= $pagination ?> mousewheel="true">
	<?php foreach ($block->inner_blocks as $inner_block) {

		$contentPosition = 'middle-center';
		$mediaBackground;

		if (isset($inner_block->parsed_block['attrs']['contentPosition'])) {
			$contentPosition = $inner_block->parsed_block['attrs']['contentPosition'];
		}
		/* If media mime-type is image */
		if (str_contains($inner_block->parsed_block['attrs']['media']['mediaMime'], 'image')) {
			$mediaBackground = '<div class="swiper-media">' . wp_get_attachment_image($inner_block->parsed_block['attrs']['media']['mediaId'], 'full', false) . '</div>';
		}

		/* If media mime-type is video */
		if (str_contains($inner_block->parsed_block['attrs']['media']['mediaMime'], 'video')) {
			$mediaBackground =
				'<div class="swiper-media">
			<video width="100%" height="100%" autoplay loop playsinline muted>
			<source src="' . $inner_block->parsed_block['attrs']['media']['mediaUrl'] . '" type="' . $inner_block->parsed_block['attrs']['media']['mediaMime'] . '">
		  	Your browser does not support the video tag.
		  </video> </div>';
		}

		echo '<swiper-slide>';
		echo $mediaBackground;
		echo '<div class="swiper-content' . ' ' . $contentPosition . '">' . $inner_block->render() . '</div>';
		echo '</swiper-slide>';
	} ?>
</swiper-container>