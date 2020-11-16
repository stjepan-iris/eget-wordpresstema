<?php

class Vc_Aino_Checkout {

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

        add_action('woocommerce_after_shipping_rate', array($this, 'after_method'), 2, 1);
    }

    /**
     * Outputs options after the AIO shipping method
     *
     * @access public
     * @param object(WC_Shipping_Rate) $method
     * @return void
     */
    public function after_method($method) {

        $shipping_method = $this->helpers->get_shipping_method($method->id);
        $aio_data = $this->helpers->get_aio_data();

        if (is_checkout() && !empty($shipping_method->is_vc_aino) && $this->helpers->get_chosen_method() == $method->id) {

            $design_theme = get_option('vc_aino_design_theme');

            $options = $shipping_method->get_options();
            $accepts = $shipping_method->accepts();

            if($design_theme=='default'){
                if (!empty($shipping_method->is_pickup)) {
                    $button_value = isset($_COOKIE['aio_options']) ? get_option('vc_aino_button_label_active') : get_option('vc_aino_button_label_active');
                    echo '<div><input class="fancy-button" type="button" value="' . $button_value . '" id="OpenDialog" /></div><div id="widgetContainer" >';
                }

                if (!empty($accepts) && !empty($shipping_method->is_pickup)) {
                    echo $this->getMethodPickupTable($accepts, $aio_data, $method);
                }
                if (!empty($options)) {
                    echo $this->getMethodContent($options, $aio_data, $method);
                }
            }
        }
    }

    /**
     * Returns the options according to the AIO method options
     *
     * @access public
     * @param array $options
     * @param array $aio_data
     * @param object(WC_Shipping_Rate) $method
     * @return string
     */
    private function getMethodContent($options, $aio_data, $method) {
        $result = '<div class="vc-aio-chekout-options">';
        $result .= '<table>';

        $value = !empty($aio_data['deliveryDetails'][$options['deliveryDetails']['default_checkout_name']]) ? $aio_data['deliveryDetails'][$options['deliveryDetails']['default_checkout_name']] : '';

        $active_types = array();
        foreach ($options['deliveryDetails']['type'] as $type) {
            $method_arr = explode(':', $method->id);
            if ($this->helpers->get_cost_for_type($type['id'], $method_arr[0], $method_arr[1])) {
                $active_types[] = $type;
            }
        }

        if (count($active_types) > 1) {
            $result .= $this->createStandartSelectSet($options['deliveryDetails']['default_checkout_label'], $options['deliveryDetails']['default_checkout_name'], $active_types, $value);
        } else {
            if ($value == '') {
                $value = $options['deliveryDetails']['type'][0]['name'];
            }

            $result .= $this->createStandartLabelSet($options['deliveryDetails']['default_checkout_label'], $options['deliveryDetails']['default_checkout_name'], $value);
        }

        $active_type = $options['deliveryDetails']['type'][0];

        foreach ($options['deliveryDetails']['type'] as $type) {
            if ($type['name'] == $value) {
                $active_type = $type;
            }
        }

        if (!empty($active_type['location'])) {
            $value = !empty($aio_data['deliveryDetails'][$active_type['default_checkout_location_name']]) ? $aio_data['deliveryDetails'][$active_type['default_checkout_location_name']] : '';

            $result .= $this->createStandartSelectSet($active_type['default_checkout_location_label'], $active_type['default_checkout_location_name'], $active_type['location'], $value);

            $active_location = $active_type['location'][0];

            foreach ($active_type['location'] as $location) {
                if ($location['name'] == $value) {
                    $active_location = $location;
                }
            }

            if (!empty($active_location['creates'])) {
                foreach ($active_location['creates'] as $additional) {
                    $result .= $this->createStandartTextareaSet($additional['label'], $additional['name']);
                }
            }
        }

        $result .= '</table>';
        $result .= '</div>';

        return $result;
    }

    /**
     * Returns table with the pickup point information
     *
     * @access private
     * @param array $accepts
     * @param array $aio_data
     * @param object(WC_Shipping_Rate) $method
     * @return string
     */
    private function getMethodPickupTable($accepts, $aio_data, $method) {

        $result = '<div class="vc-aio-chekout-options">';

        if (!empty($accepts) && !empty($aio_data['vc_aio_id']) && $method->method_id == $aio_data['vc_aio_id']) {
            $result .= '<table>';
            foreach ($accepts as $key => $option) {
                $result .= $this->createPickupInfoRow($option['label'], $aio_data, $key);
            }
            $result .= '</table>';
        }
        $result .= '</div>';

        return $result;
    }

    /**
     * Returns table row containing the select box with the method options
     *
     * @access private
     * @param string $label
     * @param string $name
     * @param array $options
     * @param string $value
     * @return string
     */
    private function createStandartSelectSet($label, $name, $options, $value) {
        $html = '<tr>';
        $html .= '<td>';
        $html .= '<label>' . $label . ': </label>';
        $html .= '</td>';
        $html .= '<td>';
        $html .= '<select class="vc-aio-op-select" name="vc_aio_options[' . $name . ']" data-cname="' . $name . '">' . $label . '</label>';
        foreach ($options as $option) {
            $attributes = !empty($option['attributes']) ? $option['attributes'] : false;
            $html .= $this->createSelectOption($option['name'], $option['name'] == $value, $attributes);
        }
        $html .= '</select>';
        $html .= '</td>';
        $html .= '</tr>';

        return $html;
    }

    /**
     * Returns select box option based on the passed data
     *
     * @access private
     * @param string $name
     * @param bool $is_selected
     * @param array|bool $attributes
     * @return string
     */
    private function createSelectOption($name, $is_selected, $attributes = false) {
        $selected = $is_selected ? ' selected="selected"' : '';
        $attributes_arr = array();
        if ($attributes) {
            foreach ($attributes as $key => $attribute) {
                $attributes_arr[] = $key . '="' . $attribute . '"';
            }
        }
        return '<option value="' . $name . '"' . $selected . ' ' . implode(' ', $attributes_arr) . '>' . $name . '</option>';
    }

    /**
     * Returns table row containing a hidden input and a label with the single method option
     *
     * @access private
     * @param string $label
     * @param string $name
     * @param string $value
     * @return string
     */
    private function createStandartLabelSet($label, $name, $value) {
        $html = '<tr>';
        $html .= '<td>';
        $html .= '<label>' . $label . ': </label>';
        $html .= '</td>';
        $html .= '<td>';
        $html .= '<input type="hidden" class="vc-aio-st-hidden" name="vc_aio_options[' . $name . ']" data-cname="' . $name . '" value="' . $value . '">';
        $html .= '<span class="vc-aio-option-span">' . $value . '</span>';
        $html .= '</td>';
        $html .= '</tr>';
        return $html;
    }

    /**
     * Returns table row containing a textarea based on the passed data
     *
     * @access private
     * @param string $label
     * @param string $name
     * @return string
     */
    private function createStandartTextareaSet($label, $name) {
        $html = '<tr class="vc-aio-op-row">';
        $html .= '<td>';
        $html .= '<label>' . $label . ': </label>';
        $html .= '</td>';
        $html .= '<td>';
        $html .= '<textarea class="vc-aio-st-textarea" name="vc_aio_options[' . $name . ']" data-cname="' . $name . '"></textarea>';
        $html .= '</td>';
        $html .= '</tr>';
        return $html;
    }

    /**
     * Returns table row containing data about the selected pickup point
     *
     * @access private
     * @param string $label
     * @param array $data
     * @param string $key
     * @return string
     */
    private function createPickupInfoRow($label, $data, $key) {
        $html = '<tr>';
        $html .= '<td>';
        $html .= '<label>' . $label . ': </label>';
        $html .= '</td>';
        $html .= '<td>';
        $html .= '<span class="vc-aio-info-row-val" data-name="' . $key . '">' . $data['deliveryDetails'][$key] . '</span>';
        $html .= '<input type="hidden" name="vc_aio_options[' . $key . ']" value="' . $data['deliveryDetails'][$key] . '" />';
        $html .= '</td>';
        $html .= '</tr>';
        return $html;
    }

}

$vc_aino_checkout = VC_Aino_Checkout::get_instance();
