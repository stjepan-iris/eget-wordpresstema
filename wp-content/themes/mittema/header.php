<!DOCTYPE html>
<html lang="en">
<head>
<!-- link rel="stylesheet" href="<?php /*bloginfo('stylesheet_url'); */ ?>" -->

<?php wp_head(); ?>
</head>

<body>
<div class="header">
    <h1><?php echo get_bloginfo('name') ." - ". get_bloginfo('description'); ?></h1>


    <?php wp_nav_menu(array('theme_location' => 'header-menu')); ?> 

    

</div>