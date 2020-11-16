<?php

class Vc_Aino_Order {

    private $helpers = null;

    /** Refers to a single instance of this class. */
    private static $instance = null;

    /**
     * Creates or returns an instance of this class.
     *
     * @return  Foo A single instance of this class.
     */
    public static function get_instance() {

        if (null == self::$instance) {
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

        add_action('woocommerce_admin_order_data_after_shipping_address', array($this, 'admin_order_data_after_shipping_address'), '');
        add_action('woocommerce_checkout_update_order_meta', array($this, 'checkout_update_order_meta'), 10, 1);
        add_action('woocommerce_checkout_process', array($this, 'validate_information'));
        add_filter('woocommerce_email_customer_details_fields', array($this, 'add_email_information'), 10, 3);
        add_filter('wpo_wcpdf_billing_phone', array($this, 'add_pdf_information'), 10, 3);
    }
    
    /**
     * Show the AIO additional options data after the order shipping address
     *
     * @access public
     * @param object(WC_Order) $order
     * @return string
     */
    public function admin_order_data_after_shipping_address( $order ) {

        $vc_aio_meta = get_post_meta( $order->get_id(), '_vc_aio_options', true );
        $mailbox_type_meta = get_post_meta( $order->get_id(), '_mailbox_delivery_type', true );
        $content = '';
        $content .= '<h4>Shipping Options</h4>';

        if (!empty($vc_aio_meta) && $mailbox_type_meta != "door" ) {
            $content .= '<p>';

            $content .= get_post_meta( $order->get_id(), '_mailbox_delivery_option', true );

            foreach ($vc_aio_meta as $vc_aio_option) {
                if (!empty($vc_aio_option['value']) && $vc_aio_option['value'] != '') {
                    if (empty($vc_aio_option['hidden'])) {
                        $content .= '<strong>' . $vc_aio_option['label'] . '</strong><br />' . $vc_aio_option['value'] . '<br /><br />';
                    }
                } else {
                    $content .= '<h4>' . $vc_aio_option['label'] . ':</h4><br />';
                }
            }
            $content .= '</p>';
        
        } elseif ( $mailbox_type_meta == "door" ) {

            $content .= get_post_meta( $order->get_id(), '_mailbox_delivery_option', true );

        }

        echo $content;
    }

    /**
     * Adds the AIO additional options data to the order meta
     *
     * @access public
     * @param string $order_id
     * @return void
     */
    public function checkout_update_order_meta($order_id) {
        if (!empty($this->helpers->get_chosen_method_instance()->is_vc_aino)) {
            $accepts = $this->helpers->get_chosen_method_instance()->accepts();
            $data = $this->helpers->get_aio_delivery_data();
            if (empty($data)) {
                $vc_aio_options = filter_input(INPUT_POST, 'vc_aio_options');
                $data = !empty($vc_aio_options) ? $vc_aio_options : null;
            }

            $meta = array();
            foreach ($accepts as $key => $option) {
                if (empty($option['separator'])) {
                    if (!empty($key) && !empty($data[$key]) && $data[$key] !== '') {
                        if (!empty($option['hidden'])) {
                            $meta[$key] = array(
                                'hidden' => true,
                                'value' => $this->sanitize_option($data[$key], $option)
                            );
                        } else {
                            $meta[$key] = array(
                                'label' => $option['label'],
                                'value' => $this->sanitize_option($data[$key], $option)
                            );
                        }
                    }
                } else {
                    $meta[$key] = array(
                        'label' => $option['label'],
                        'value' => ''
                    );
                }
            }

            update_post_meta( $order_id, '_vc_aio_options', $meta );

            $vc_aio_meta            = get_post_meta($order_id, '_vc_aio_options', true);
            $order_by_id            = wc_get_order( $order_id );
            $title                  = $order_by_id->get_shipping_method();
            $days                   = $vc_aio_meta['typeText']['value'];
            $order_currency         = $order_by_id->get_currency();
            $order_shipping_total   = $order_by_id->get_shipping_total();

            if( isset( $_POST["mailbox_delivery_type"] ) && $_POST["mailbox_delivery_type"] == "door" ) {
                
                $result = "<p>PostNord - $title: $days [86+60]: delivery to door $order_currency $order_shipping_total</p>";

                update_post_meta( $order_id, '_mailbox_delivery_option', $result );

            } elseif ( isset( $_POST["mailbox_delivery_type"] ) && $_POST["mailbox_delivery_type"] == "point" ) {

                $point_title = $vc_aio_meta['name']['value'];

                $result = "<p>PostNord - $title: $days / $point_title [80] $order_currency $order_shipping_total</p>";

                update_post_meta( $order_id, '_mailbox_delivery_option', $result );

            } elseif ( !isset( $_POST["mailbox_delivery_type"] ) ) {
                
                $point_title = $vc_aio_meta['name']['value'];

                $result = "<p>PostNord - $title: $days / $point_title [80] $order_currency $order_shipping_total</p>";

                update_post_meta( $order_id, '_mailbox_delivery_option', $result );
            }
            
            update_post_meta( $order_id, '_mailbox_delivery_type', $_POST["mailbox_delivery_type"] );

        }

        unset($_COOKIE['aio_data']);
    }

    /**
     * Run validation against the options that the AIO method accepts
     *
     * @access public
     * @return void
     */
    public function validate_information() {
        if (!empty($this->helpers->get_chosen_method_instance()->is_vc_aino)) {
            $accepts = $this->helpers->get_chosen_method_instance()->accepts();
            $data = $this->helpers->get_aio_delivery_data();
            if (empty($data)) {
                $vc_aio_options = filter_input(INPUT_POST, 'vc_aio_options');
                $data = !empty($vc_aio_options) ? $vc_aio_options : null;
            }

            foreach ($accepts as $key => $option) {
                if (!empty($option['required']) && (empty($data[$key]) || $data[$key] == '')) {
                    wc_add_notice($option['required_error'], 'error');
                }
            }
        }
    }

    /**
     * Sanitizes numeric value
     *
     * @access private
     * @param string $val
     * @param int $length
     * @return mixed
     */
    private function sanitize_numeric($val, $length = 10) {
        $safe_val = intval($val);
        if (!$safe_val) {
            $safe_val = '';
        }

        if (strlen($safe_val) > $length) {
            $safe_val = substr($safe_val, 0, $length);
        }

        return $safe_val;
    }

    /**
     * Sanitizes text value
     *
     * @access private
     * @param string $value
     * @param array $option
     * @return string
     */
    private function sanitize_option($value, $option) {
        if (!empty($option['sanitize'])) {
            if ($option['sanitize'] == 'text') {
                $value = sanitize_text_field($value);
            } else if ($option['sanitize'] == 'text') {
                $value = $this->sanitize_numeric($value);
            }
        }

        return $value;
    }

    // !!! Not tested yet, has to check if needed for pickup methods only
    function add_email_information($fields, $sent_to_admin, $order) {
        $order_meta = get_post_meta($order->get_id());

        if (!empty($order_meta['_vc_aio_options'])) {
            foreach (unserialize($order_meta['_vc_aio_options'][0]) as $key => $vc_aio_option) {
                if (empty($vc_aio_option['hidden'])) {
                    $fields[$key] = array(
                        'label' => $vc_aio_option['label'],
                        'value' => $vc_aio_option['value']
                    );
                }
            }
        }

        return $fields;
    }

    // !!! Not tested yet, has to check if needed for pickup methods only
    function add_pdf_information($address) {
        global $wpo_wcpdf;

        $order_meta = get_post_meta($wpo_wcpdf->export->order->get_id());

        if ($order_meta['_vc_aio_options']) {

            foreach (unserialize($order_meta['_vc_aio_options'][0]) as $key => $vc_aio_option) {
                if(empty($vc_aio_option['hidden'])) {
                    $address .= $vc_aio_option['label'] . ': ' . $vc_aio_option['value'] . '<br />';
                }
            }
        }

        return $address;
    }

}

$vc_aino_order = Vc_Aino_Order::get_instance();
