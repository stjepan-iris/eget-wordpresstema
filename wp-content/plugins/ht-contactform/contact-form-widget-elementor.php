<?php
/**
 * Plugin Name: Contact Form Widget Elementor
 * Description: The Contact Form Widget Elementor is a elementor addons for WordPress.
 * Plugin URI:  https://htplugins.com/
 * Author:      HT Plugins
 * Author URI:  https://profiles.wordpress.org/htplugins/#content-plugins
 * Version:     1.0.2
 * License:     GPL2
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ht-contactform
 * Domain Path: /languages
*/

if( ! defined( 'ABSPATH' ) ) exit(); // Exit if accessed directly

if ( ! function_exists('is_plugin_active')) { include_once( ABSPATH . 'wp-admin/includes/plugin.php' ); }

define( 'HTCONTACTFORM_VERSION', '1.0.2' );
define( 'HTCONTACTFORM_PL_URL', plugins_url( '/', __FILE__ ) );
define( 'HTCONTACTFORM_PL_PATH', plugin_dir_path( __FILE__ ) );

if( is_plugin_active( 'contact-form-7/wp-contact-form-7.php' ) ){
    
    // Elementor Widgets File Call
    function htcontactform_elementor_widgets(){
        include( HTCONTACTFORM_PL_PATH.'include/elementor_widgets.php' );
    }
    add_action('elementor/widgets/widgets_registered','htcontactform_elementor_widgets');

}

// Check Plugins is Installed or not
if( !function_exists( 'htcontactform_is_plugins_active' ) ){
    function htcontactform_is_plugins_active( $pl_file_path = NULL ){
        $installed_plugins_list = get_plugins();
        return isset( $installed_plugins_list[$pl_file_path] );
    }
}

// Load Plugins
function htcontactform_load_plugin() {
    load_plugin_textdomain( 'ht-contactform' );
    if ( ! did_action( 'elementor/loaded' ) ) {
        add_action( 'admin_notices', 'htcontactform_check_elementor_status' );
        return;
    }

    if( !is_plugin_active( 'contact-form-7/wp-contact-form-7.php' ) ){
        add_action( 'admin_notices', 'htcontactform_check_contactform_status' );
        return;
    }
}
add_action( 'plugins_loaded', 'htcontactform_load_plugin' );

// Check Elementor install or not.
function htcontactform_check_elementor_status(){
    $elementor = 'elementor/elementor.php';
    if( htcontactform_is_plugins_active( $elementor ) ) {
        if( ! current_user_can( 'activate_plugins' ) ) {
            return;
        }
        $activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $elementor . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $elementor );

        $message = '<p>' . __( 'HT Contact Form Addons not working because you need to activate the Elementor plugin.', 'ht-contactform' ) . '</p>';
        $message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $activation_url, __( 'Activate Elementor Now', 'ht-contactform' ) ) . '</p>';
    } else {
        if ( ! current_user_can( 'install_plugins' ) ) {
            return;
        }
        $install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=elementor' ), 'install-plugin_elementor' );
        $message = '<p>' . __( 'HT Contact Form Addons not working because you need to install the Elementor plugin', 'ht-contactform' ) . '</p>';
        $message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $install_url, __( 'Install Elementor Now', 'ht-contactform' ) ) . '</p>';
    }
    echo '<div class="error"><p>' . $message . '</p></div>';
}

// Check Elementor install or not.
function htcontactform_check_contactform_status(){
    $contactform = 'contact-form-7/wp-contact-form-7.php';
    if( htcontactform_is_plugins_active( $contactform ) ) {
        if( ! current_user_can( 'activate_plugins' ) ) {
            return;
        }
        $activation_url = wp_nonce_url( 'plugins.php?action=activate&amp;plugin=' . $contactform . '&amp;plugin_status=all&amp;paged=1&amp;s', 'activate-plugin_' . $contactform );

        $message = '<p>' . __( 'HT Contact Form Addons not working because you need to activate the Contact Form 7 plugin.', 'ht-contactform' ) . '</p>';
        $message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $activation_url, __( 'Activate Now', 'ht-contactform' ) ) . '</p>';
    } else {
        if ( ! current_user_can( 'install_plugins' ) ) {
            return;
        }
        $install_url = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=contact-form-7' ), 'install-plugin_contact-form-7' );
        $message = '<p>' . __( 'HT Contact Form Addons not working because you need to install the Contact Form 7 plugin', 'ht-contactform' ) . '</p>';
        $message .= '<p>' . sprintf( '<a href="%s" class="button-primary">%s</a>', $install_url, __( 'Install Now', 'ht-contactform' ) ) . '</p>';
    }
    echo '<div class="error"><p>' . $message . '</p></div>';
}



?>