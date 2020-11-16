<?php

/*
 * vConnect PostNord All in One Core Main File
 */

/**
 * Check if WooCommerce is active
 */
if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    define('AINO_CORE_VERSION', '2.9.5.0.0');

    // Load the helper functions class
    require_once AINO_PLUGIN_PATH . "/core/inc/helpers/vc-aino-helpers.php";

    // Include and instantiate all services
    foreach (glob(AINO_PLUGIN_PATH . "/core/inc/services/*.php") as $filename) {
        require_once $filename;
    }

    // Instantiate the AINO ajax class
    function init_vc_aino_ajax() {
        require_once 'inc/extends/vc-aino-ajax.php';
    }
    add_action('plugins_loaded', 'init_vc_aino_ajax');
}