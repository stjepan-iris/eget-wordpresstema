<?php

class Vc_Aino_Ajax extends WC_AJAX {

    /**
      - Hook in ajax handlers.
     */
    public static function init() {
        add_action('init', array(__CLASS__, 'define_ajax'), 0);
        add_action('template_redirect', array(__CLASS__, 'do_wc_ajax'), 0);
        self::add_ajax_events();
    }

    /**
      - Get WC Ajax Endpoint.
      - @param  string $request Optional
      - @return string
     */
    public static function get_endpoint($request = '') {
        return esc_url_raw(add_query_arg('wc-ajax', $request, remove_query_arg(array('remove_item', 'add-to-cart', 'added-to-cart'))));
    }

    /**
      - Set WC AJAX constant and headers.
     */
    public static function define_ajax() {
        if (!empty($_GET['wc-ajax'])) {
            if (!defined('DOING_AJAX')) {
                define('DOING_AJAX', true);
            }
            if (!defined('WC_DOING_AJAX')) {
                define('WC_DOING_AJAX', true);
            }
            // Turn off display_errors during AJAX events to prevent malformed JSON
            if (!WP_DEBUG || ( WP_DEBUG && !WP_DEBUG_DISPLAY )) {
                @ini_set('display_errors', 0);
            }
            $GLOBALS['wpdb']->hide_errors();
        }
    }

    /**
      - Send headers for WC Ajax Requests
      - @since 2.5.0
     */
    private static function wc_ajax_headers() {
        send_origin_headers();
        @header('Content-Type: text/html; charset=' . get_option('blog_charset'));
        @header('X-Robots-Tag: noindex');
        send_nosniff_header();
        nocache_headers();
        status_header(200);
    }

    /**
      - Check for WC Ajax request and fire action.
     */
    public static function do_wc_ajax() {
        global $wp_query;
        if (!empty($_GET['wc-ajax'])) {
            $wp_query->set('wc-ajax', sanitize_text_field($_GET['wc-ajax']));
        }
        if ($action = $wp_query->get('wc-ajax')) {
            self::wc_ajax_headers();
            do_action('wc_ajax_' . sanitize_text_field($action));
            die();
        }
    }

    /**
      - Add custom ajax events here
     */
    public static function add_ajax_events() {
        // woocommerce_EVENT => nopriv
        $ajax_events = array(
            'aino_get_widget' => true,
            'aino_get_points' => true,
            'aino_change_rate' => true,
        );
        foreach ($ajax_events as $ajax_event => $nopriv) {
            add_action('wp_ajax_woocommerce_' . $ajax_event, array(__CLASS__, $ajax_event));
            if ($nopriv) {
                add_action('wp_ajax_nopriv_woocommerce_' . $ajax_event, array(__CLASS__, $ajax_event));
                // WC AJAX can be used for frontend ajax requests
                add_action('wc_ajax_' . $ajax_event, array(__CLASS__, $ajax_event));
            }
        }
    }

    /**
      - Removes item from the cart then returns a new fragment
     */
    public static function aino_get_widget() {
        global $vc_aino_widget;

        die(json_encode($vc_aino_widget->get_widget()));
    }

    /**
      - Removes item from the cart then returns a new fragment
     */
    public static function aino_change_rate() {
        global $vc_aino_heplers;

        $session = WC()->session->get('shipping_for_package_' . 0);

        $id = false;

        foreach ($session['rates'] as $rate) {
            if ($rate->method_id == filter_input(INPUT_POST, 'shipping_checkbox')) {
                $method_arr = explode(':', $rate->id);

                $post = filter_input_array(INPUT_POST, array(
                    'data' => array( 'filter' => FILTER_SANITIZE_ENCODED, 'flags'  => FILTER_REQUIRE_ARRAY)));
                $type = $post['data']['deliveryDetails']['typeId'];

                $cost = $vc_aino_heplers->get_cost_for_type($type, $rate->method_id, $method_arr[1]);

                WC()->session->set('chosen_shipping_methods', array($rate->id));

                $id = $rate->id;
            }
        }

        if ($id) {
            WC()->shipping->shipping_total = $cost;
            $session['rates'][$id]->cost = $cost;

            WC()->session->set('shipping_for_package_' . 0, $session);

            // Set checkout to true, so calculate totals doesn't return 0
            if (!defined('WOOCOMMERCE_CHECKOUT')) {
                define('WOOCOMMERCE_CHECKOUT', true);
            }
            WC()->cart->calculate_totals();
        }

        $return_data = array(
            'order_total' => WC()->cart->get_total(),
            'order_tax' => WC()->cart->get_cart_tax()
        );

        die(json_encode($return_data));
    }

    /**
      - Removes item from the cart then returns a new fragment
     */
    public static function aino_get_points() {
        global $vc_aino_pickup_points;

        die(json_encode($vc_aino_pickup_points->get_points()));
    }

}

$custom_wc_ajax = new Vc_Aino_Ajax();
$custom_wc_ajax->init();


