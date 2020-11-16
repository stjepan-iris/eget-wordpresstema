<?php 
add_theme_support( 'post-thumbnails' );

function wp_head_hook() {


    wp_enqueue_style('style', get_stylesheet_uri());

    wp_enqueue_script('script', get_template_directory_uri().'/js/main.js');

    
}
add_action ( 'wp_head', 'wp_head_hook' );



function wpb_custom_new_menu() {
    register_nav_menu('header-menu',__( 'Header menu' ));

  }

function mysaidbar_widgets_init(){
  add_action( 'init', 'wpb_custom_new_menu' );

  register_sidebar(  array(
	'name'          => sprintf( __( 'Sidebar ' ), 'saidbar' ),
	'id'            => "sidebar-1",
	'description'   => '',
	'class'         => '',
	'before_widget' => '<div id="%1$s" class="widget %2$s">',
	'after_widget'  => '</div>',
	'before_title'  => '<h4 class="widgettitle">',
	'after_title'   => '</h4>',
) );
};
add_action('widgets_init', 'mysaidbar_widgets_init');





?>