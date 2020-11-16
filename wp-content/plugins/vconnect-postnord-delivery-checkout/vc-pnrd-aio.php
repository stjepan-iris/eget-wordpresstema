<?php

/*
  Plugin Name: PostNord Delivery Checkout
  Plugin URI: https://vconnect.dk/postnord-modul
  Description: PostNord Delivery checkout integration for WooCommerce
  Version: 2.9.5.0.0
  Author: vConnect
  Author URI: https://vconnect.dk
  Requires at least: 5.4.2
  Tested up to: 5.4.2
 *
  WC requires at least: 4.2.2
  WC tested up to: 4.2.2
 */

/**
 * Check if WooCommerce is active
 */
if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
    define('AINO_PLUGIN_VERSION', '2.9.5.0.0');

    define('AINO_PLUGIN_PATH', plugin_dir_path(__FILE__));
    define('AINO_PLUGIN_URL', plugin_dir_url(__FILE__));

    require_once 'core/vc-aio-core.php';
    require_once 'spec/vc-aino-shipping-methods.php';
}