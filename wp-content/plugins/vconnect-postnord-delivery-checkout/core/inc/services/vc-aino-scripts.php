<?php

class Vc_Aino_Scripts {

    private $specifics;

    private $helpers = null;

    /** Refers to a single instance of this class. */
    private static $instance = null;

    /**
     * Creates or returns an instance of this class.
     *
     * @return  Foo A single instance of this class.
     */
    public static function get_instance() {

        if ( null == self::$instance ) {
            self::$instance = new self;
        }

        return self::$instance;

    }

    /**
     * Constructor
     *
     * @access private
     * @return void
     */
    private function __construct() {
        global $vc_aino_heplers;
        $this->helpers = $vc_aino_heplers;

        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));

        add_action('woocommerce_review_order_after_order_total', array($this, 'hide_methods'));
        add_action('woocommerce_after_shipping_rate', array($this, 'hide_methods'));

        add_action('wp_head', array($this, 'display_custom_css'), 1000, 1);
    }

    /**
     * Adds plugin scripts to Wodpress Admin area
     *
     * @access public
     * @param string @hook
     * @return void
     */
    public function enqueue_admin_scripts($hook) {
        if ('woocommerce_page_wc-settings' != $hook) {
            return;
        }

        wp_register_style('vc_aino_admin_css', AINO_PLUGIN_URL . 'core/assets/admin/css/styles.css', false, AINO_PLUGIN_VERSION);
        wp_enqueue_style('vc_aino_admin_css');

        wp_enqueue_script('vc_aio_ace', AINO_PLUGIN_URL . 'core/assets/admin/lib/ace/ace.js', '', '2.0.0', true);
        wp_enqueue_script('vc_ace_mode_js', AINO_PLUGIN_URL . 'core/assets/admin/lib/ace/mode-css.js', array('vc_aio_ace'), AINO_PLUGIN_VERSION, true);
        wp_enqueue_script('vc_ace_lang_tools', AINO_PLUGIN_URL . 'core/assets/admin/lib/ace/ext-language_tools.js', array('vc_ace_mode_js'), AINO_PLUGIN_VERSION, true);
        wp_enqueue_script('vc_custom_css_js', AINO_PLUGIN_URL . 'core/assets/admin/js/custom-css.js', array('jquery', 'vc_ace_lang_tools'), AINO_PLUGIN_VERSION, true);
        wp_enqueue_script('vc_admin_functions', AINO_PLUGIN_URL . 'core/assets/admin/js/admin-functions.js', array('jquery', 'vc_custom_css_js'), AINO_PLUGIN_VERSION, true);
    }

    /**
     * Adds plugin scripts to WooCommerce Checkout
     *
     * @access public
     * @return void
     */
    public function enqueue_scripts() {
        if (is_checkout()) {
            wp_enqueue_style('aino_universe_general', AINO_PLUGIN_URL . 'core/assets/frontend/css/general.css', false, AINO_PLUGIN_VERSION);
            wp_enqueue_script('aino_js_cookie', AINO_PLUGIN_URL . 'core/assets/frontend/lib/js.cookie.js', array('jquery-ui-widget'), AINO_PLUGIN_VERSION);
            wp_enqueue_script('vc_aino_gmaps', '//maps.googleapis.com/maps/api/js?key=' . get_option('vc_aino_gmaps_key'), array('aino_js_cookie'), AINO_PLUGIN_VERSION);
            wp_enqueue_script('vc_aino_widget', AINO_PLUGIN_URL . 'core/widget/scripts/vconnect.widget.js', array('vc_aino_gmaps'), AINO_PLUGIN_VERSION);
            wp_enqueue_script('aino_wp_functions', AINO_PLUGIN_URL . 'core/assets/frontend/js/aino-wp.js', array('vc_aino_widget'), AINO_PLUGIN_VERSION);
            wp_localize_script('aino_wp_functions', 'aino_params', $this->get_js_params());
        }

        if (is_wc_endpoint_url('order-received')) {
            wp_enqueue_script('aino_clean_cookies', AINO_PLUGIN_URL . '/core/assets/frontend/lib/clean_cookie.js', array('aino_js_cookie'), AINO_PLUGIN_VERSION);
        }
    }

    /**
     * Hides AIO shipping methods when widget is used on the checkout
     *
     * @access public
     * @return void
     */
    public function hide_methods() {
        if (is_checkout()) {
            echo '<script>';
            echo "if(jQuery('[id*=\"vconnect_postnord\"]:checked').length>0){";
            echo "  jQuery('[id*=\"vconnect_postnord\"]').parent().hide();";
            echo '} else {';
            echo "  jQuery('[id*=\"vconnect_postnord\"]:not(:first)').parent().hide();";
            echo '}';
            echo '</script>';
        }
    }

    /**
     * Collects plugin javascript parameters for the front end
     *
     * @access private
     * @return array
     */
    private function get_js_params() {
        $result = array(
            'aino_version' => AINO_PLUGIN_VERSION,
            'core_version' => AINO_CORE_VERSION,
            'wc_ajax' => get_site_url() . '?wc-ajax=aino_get_widget',
            'wc_points' => get_site_url() . '?wc-ajax=aino_get_points',
            'wc_change_rate' => get_site_url() . '?wc-ajax=aino_change_rate',
            'aio_url' => AINO_PLUGIN_URL,
            'methods_map' => $this->get_methods_map(),
            'gmaps_api_key' => get_option('vc_aino_gmaps_key'),
            'enable_postal_code_popup' => get_option('vc_aino_postal_code_popup'),
        );

        $chosen_methods = $this->helpers->get_chosen_methods();

        if($chosen_methods){
            $shipping_method = $this->helpers->get_shipping_method($this->helpers->get_chosen_method());
            if ($shipping_method && !empty($shipping_method->is_vc_aino)) {
                $result['standart_options'] = $shipping_method->vc_aino_options; // TO DO -> Fix this mess
            }
        }

        return $result;
    }

    /**
     * Builds map of the method ids with their widget tab type
     *
     * @access private
     * @return array
     */
    private function get_methods_map(){
        $shipping_methods = array();

        foreach (WC()->shipping->get_shipping_methods() as $method) {
            if (!empty($method->is_vc_aino) && $method->enabled=='yes') {
                $shipping_methods[$method->vc_aino_id] = $method->vc_aino_type;
            }
        }

        return $shipping_methods;
    }

    /**
     * Outputs the custom CSS styles saved in the plugin options editor
     *
     * @access public
     * @return void
     */
    public function display_custom_css() {
        $custom_css = get_option('vc_aino_custom_styles');
        if (!empty($custom_css)) {
            echo '<style type="text/css">';
            echo '/* VC AIO Custom CSS */' . "\n";
            echo $custom_css . "\n";
            echo '</style>';
        }
    }
}

$vc_aino_scripts = Vc_Aino_Scripts::get_instance();