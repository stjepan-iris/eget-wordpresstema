<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Flat Rate Shipping Method.
 *
 * @class 		WC_Shipping_Flat_Rate
 * @version		2.6.0
 * @package		WooCommerce/Classes/Shipping
 * @author 		WooThemes
 */
class Vc_Aino_Shipping_Method extends WC_Shipping_Method {

    // Id for your shipping method. Should be unique.
    public $is_vc_aino = true;
    // Id for your shipping method. Should be unique.
    public $vc_aino_type = '';
    // Id for your shipping method. Should be unique.
    protected $vc_aino_id = '';
    // Title shown in admin
    protected $vc_aino_method_title = '';
    // Description shown in admin
    protected $vc_aino_method_description = '';
    // This can be added as an setting but for this example its forced.
    protected $vc_aino_title = '';
    // Define the Universe popup this shipping method uses
    public $vc_aino_popup = 'post-office';
    // Define the Universe popup this shipping method uses
    public $transit_time = '';
    // Define the Universe popup this shipping method uses
    public $option_label = '';
    // Define the Universe popup this shipping method uses
    protected $vc_rates;
    // Define the Universe popup this shipping method uses
    protected $vc_option_labels;
    // Define the Universe popup this shipping method uses
    public $vc_aino_options;
    // Define the Universe popup this shipping method uses
    public $is_pickup = false;

    /** @var string cost passed to [fee] shortcode */
    protected $fee_cost = '';

    /**
     * Constructor.
     */
    public function __construct($instance_id = 0) {
        $this->id = $this->vc_aino_id;
        $this->instance_id = absint($instance_id);
        $this->method_title = $this->vc_aino_method_title;
        $this->method_description = $this->vc_aino_method_description;
        $this->supports = array(
            'shipping-zones',
            'instance-settings',
            'instance-settings-modal',
        );

        $this->init();

        add_action('woocommerce_update_options_shipping_' . $this->id, array($this, 'process_admin_options'));
    }

    /**
     * init user set variables.
     */
    public function init() {
        $this->instance_form_fields = include( 'includes/settings-aino-shipping-method.php' );
        $this->title = $this->get_option('title');
        $this->transit_time = $this->get_option('transit_time');
        $this->option_label = $this->get_option('option_label');
        $this->tax_status = $this->get_option('tax_status');

        if (isset($this->vc_fee_label) && isset($this->vc_additional_fee) && isset($this->vc_option_text)) {
            $this->instance_form_fields = include( 'includes/settings-aino-shipping-method_fees_option.php' );
            $this->vc_additional_fee = $this->get_option('vc_additional_fee');
            $this->vc_fee_label = $this->get_option('vc_additional_fee_label');
            $this->vc_fee_amount = $this->get_option('vc_additional_fee_amount');
            $this->vc_option_text = $this->get_option('vc_option_text');
        } else if (isset($this->vc_fee_label)) {
            $this->instance_form_fields = include( 'includes/settings-aino-shipping-method_fees.php' );
            $this->vc_fee_label = $this->get_option('vc_additional_fee_label');
            $this->vc_fee_amount = $this->get_option('vc_additional_fee_amount');
        } else if (isset($this->vc_option_text)) {
            $this->instance_form_fields = include( 'includes/settings-aino-shipping-method_option.php' );
            $this->vc_option_text = $this->get_option('vc_option_text');
        }

        if (isset($this->nearest_pickup_point)) {
            $this->nearest_pickup_point = $this->get_nearest_pickup_point();
        }

        if (isset($this->evening_delivery)) {

            $this->evening_delivery = $this->evening_delivery_available();
        }

        $this->vc_rates = get_option($this->id . '_rates[' . $this->get_instance_id() . ']');
        $this->vc_option_labels = get_option($this->id . '_option_labels[' . $this->get_instance_id() . ']');
        $this->vc_aino_options = $this->get_options();
	    $this->type = $this->get_option( 'type', 'class' );
    }

    /**
     * Evaluate a cost from a sum/string.
     * @param  string $sum
     * @param  array  $args
     * @return string
     */
    public function evaluate_cost($sum, $args = array()) {
        include_once( WC()->plugin_path() . '/includes/libraries/class-wc-eval-math.php' );

        // Allow 3rd parties to process shipping cost arguments
        $args = apply_filters('woocommerce_evaluate_shipping_cost_args', $args, $sum, $this);
        $locale = localeconv();
        $decimals = array(wc_get_price_decimal_separator(), $locale['decimal_point'], $locale['mon_decimal_point']);
        $this->fee_cost = $args['cost'];

        // Expand shortcodes
        add_shortcode('fee', array($this, 'fee'));

        $sum = do_shortcode(str_replace(
                        array(
            '[qty]',
            '[cost]'
                        ), array(
            $args['qty'],
            $args['cost']
                        ), $sum
        ));

        remove_shortcode('fee', array($this, 'fee'));

        // Remove whitespace from string
        $sum = preg_replace('/\s+/', '', $sum);

        // Remove locale from string
        $sum = str_replace($decimals, '.', $sum);

        // Trim invalid start/end characters
        $sum = rtrim(ltrim($sum, "\t\n\r\0\x0B+*/"), "\t\n\r\0\x0B+-*/");

        // Do the math
        return $sum ? WC_Eval_Math::evaluate($sum) : 0;
    }

    /**
     * Work out fee (shortcode).
     * @param  array $atts
     * @return string
     */
    public function fee($atts) {
        $atts = shortcode_atts(array(
            'percent' => '',
            'min_fee' => '',
            'max_fee' => '',
                ), $atts);

        $calculated_fee = 0;

        if ($atts['percent']) {
            $calculated_fee = $this->fee_cost * ( floatval($atts['percent']) / 100 );
        }

        if ($atts['min_fee'] && $calculated_fee < $atts['min_fee']) {
            $calculated_fee = $atts['min_fee'];
        }

        if ($atts['max_fee'] && $calculated_fee > $atts['max_fee']) {
            $calculated_fee = $atts['max_fee'];
        }

        return $calculated_fee;
    }

    /**
     * calculate_shipping function.
     *
     * @param array $package (default: array())
     */
    public function calculate_shipping($package = array()) {
        $rate = array(
            'id' => $this->get_rate_id(),
            'label' => $this->title,
            'cost' => $this->get_cost($package),
            'package' => $package,
        );

        // Calculate the costs
        $has_costs = false; // True when a cost is set. False if all costs are blank strings.
        $cost = $this->get_cost($package);

        if ($cost !== '') {

            $has_costs = true;
            $rate['cost'] = $this->evaluate_cost($cost, array(
                'qty' => $this->get_package_item_qty($package),
                'cost' => $package['contents_cost'],
            ));
        }



        // Add the rate
        if ($has_costs) {
            $this->add_rate($rate);
        }

        do_action('woocommerce_' . $this->id . '_shipping_add_rate', $this, $rate);
    }

    /**
     * Get items in package.
     * @param  array $package
     * @return int
     */
    public function get_package_item_qty($package) {
        $total_quantity = 0;
        foreach ($package['contents'] as $item_id => $values) {
            if ($values['quantity'] > 0 && $values['data']->needs_shipping()) {
                $total_quantity += $values['quantity'];
            }
        }
        return $total_quantity;
    }

    /**
     * Finds and returns shipping classes and the products with said class.
     * @param mixed $package
     * @return array
     */
    public function find_shipping_classes($package) {

        $found_shipping_classes = array();

        if( is_array($package) && !empty($package) ) {
            foreach ($package['contents'] as $item_id => $values) {
                if ($values['data']->needs_shipping()) {
                    $found_class = $values['data']->get_shipping_class();
    
                    if (!isset($found_shipping_classes[$found_class])) {
                        $found_shipping_classes[$found_class] = array();
                    }
    
                    $found_shipping_classes[$found_class][$item_id] = $values;
                }
            }
        }
        
        return $found_shipping_classes;
    }

    public function generate_WC_VC_Table_rates_table_html() {
        global $woocommerce;
        ob_start();
        ?>
        <tr valign="top">
            <th scope="row" class="titledesc rate-title"><?php _e('Costs', 'vc-allinone'); ?>:</th>
            <td class="forminp" id="<?php echo $this->id; ?>_rates">
                <table class="shippingrows widefat" cellspacing="0">
                    <thead>
                        <tr>
                            <th class="check-column vc-check-column"><input type="checkbox"></th>
                            <th><?php _e('Minimum Weight', 'vc-allinone'); ?></th>
                            <th><?php _e('Maximum Weight', 'vc-allinone'); ?></th>
                            <th><?php _e('Total from', 'vc-allinone'); ?></th>
                            <th><?php _e('Total to', 'vc-allinone'); ?></th>
                            <th><?php _e('Shipping Price', 'vc-allinone'); ?></th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th colspan="6">
                                <a href="#" class="vc-add-rate button" data-id="<?php echo $this->id; ?>">
                                    <?php _e('+ Add row', 'vc-allinone'); ?>
                                </a>
                                <a href="#" class="vc-remove-rate button" data-id="<?php echo $this->id; ?>">
                                    <?php _e('Delete selected rows', 'vc-allinone'); ?>
                                </a>
                            </th>
                        </tr>
                    </tfoot>
                    <tbody class="<?php echo $this->id; ?>_rates_tbody">
                        <?php
                        $i = -1;
                        if ($this->vc_rates) {
                            foreach ($this->vc_rates as $rate) {
                                $i++;
                                ?>
                                <tr class="vc_rate">
                                    <th class="check-column vc-check-column"><input type="checkbox" name="select" /></th>
                                    <td><input type="number" class="vc-rate-weight-min" step="any" min="0" value="<?php echo esc_attr($rate['weight_min']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $i . '][weight_min]'); ?>" placeholder="' . __('0.00', 'vc-allinone') . '" size="4" /></td>
                                    <td><input type="number" class="vc-rate-weight-max" step="any" min="0" value="<?php echo esc_attr($rate['weight_max']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $i . '][weight_max]'); ?>" placeholder="' . __('0.00', 'vc-allinone') . '" size="4" /></td>
                                    <td><input type="number" class="vc-rate-total-from" step="any" min="0" value="<?php echo esc_attr($rate['total_from']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $i . '][total_from]'); ?>" placeholder="' . __('0.00', 'vc-allinone') . '" size="4" /></td>
                                    <td><input type="number" class="vc-rate-total-to" step="any" min="0" value="<?php echo esc_attr($rate['total_to']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $i . '][total_to]'); ?>" placeholder="' . __('0.00', 'vc-allinone') . '" size="4" /></td>
                                    <td><input type="text" value="<?php echo esc_attr($rate['cost']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $i . '][cost]'); ?>" placeholder="' . __('0.00', 'vc-allinone') . '" size="4" /></td>
                                </tr>
                                <?php
                            }
                        }
                        ?>
                    </tbody>
                </table>
            </td>
        </tr>
        <?php
        return ob_get_clean();
    }

    public function generate_WC_VC_Table_rates_table_complex_html() {
        $options = $this->get_options();
        ob_start();

        foreach ($options['deliveryDetails']['type'] as $delivery_type) {
            $this->generate_WC_VC_Table_complex_row($delivery_type['id'], $delivery_type);
        }

        return ob_get_clean();
    }

    public function generate_WC_VC_Table_complex_row($type, $type_options) {
        global $woocommerce;
        ?>
        <tr valign="top">
            <th scope="row" class="titledesc rate-title"><?php echo $type ?>:</th>
            <td class="forminp" id="<?php echo $this->id; ?>_rates_<?php echo $type; ?>">
                <table class="shippingrows widefat" cellspacing="0">
                    <thead>
                        <tr valign="top" class="vc_rate">
                            <th >
                                <label for="woocommerce_vconnect_postnord_se_privatehome_description2">Option Label</label>
                            </th>
                            <td class="forminp">
                                <input class="input-text regular-input " type="text" name="woocommerce_<?php echo esc_attr($this->id . '_rates][option_labels][' . $type . ']'); ?>" id="woocommerce_vconnect_postnord_se_privatehome_description2" style="" value="<?php echo!empty($this->vc_rates['option_labels'][$type]) ? $this->vc_rates['option_labels'][$type] : ''; ?>" placeholder="">
                            </td>
                        </tr>
                        <?php if (!empty($type_options['options_switch'])) { ?>
                            <tr valign="top" class="vc_rate">
                                <th>
                                    <label for="woocommerce_vconnect_postnord_se_privatehome_description2"><?php echo $type_options['options_switch']['label']; ?></label>
                                </th>
                                <td>
                                    <input type="checkbox" name="woocommerce_<?php echo esc_attr($this->id . '_rates][disable_options][' . $type . ']'); ?>" value="1" <?php echo!empty($this->vc_rates['disable_options'][$type]) ? 'checked="checked"' : ''; ?>>
                                </td>
                            </tr>
                        <?php } ?>
                    </thead>
                </table>
                <table class="shippingrows widefat" cellspacing="0">
                    <thead>

                        <tr class="vc_rate">
                            <th class="check-column vc-check-column"><input type="checkbox"></th>
                            <th><?php _e('Minimum Weight', 'vc-allinone'); ?></th>
                            <th><?php _e('Maximum Weight', 'vc-allinone'); ?></th>
                            <th><?php _e('Total from', 'vc-allinone'); ?></th>
                            <th><?php _e('Total to', 'vc-allinone'); ?></th>
                            <th><?php _e('Shipping Price', 'vc-allinone'); ?></th>
                        </tr>
                    </thead>
                    <tfoot>
                        <tr>
                            <th colspan="6">
                                <a href="#" class="add-type-rate button" data-id="<?php echo $this->id; ?>" data-type="<?php echo $type; ?>">
                                    <?php _e('+ Add row', 'vc-allinone'); ?>
                                </a>
                                <a href="#" class="remove-type-rate button" data-id="<?php echo $this->id; ?>">
                                    <?php _e('Delete selected rows', 'vc-allinone'); ?>
                                </a>
                            </th>
                        </tr>
                    </tfoot>
                    <tbody class="<?php echo $this->id; ?>_rates_tbody">
                    <?php
                    $i = -1;
                    if (!empty($this->vc_rates[$type])) {
                        foreach ($this->vc_rates[$type] as $rate) {
                            $i++;
                            ?>
                                <tr class="vc_rate">
                                    <th class="check-column"><input type="checkbox" name="select" /></th>
                                    <td><input type="number" class="vc-rate-weight-min" step="any" min="0" value="<?php echo esc_attr($rate['weight_min']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $type . '][' . $i . '][weight_min]'); ?>" placeholder="0.00" size="4" /></td>
                                    <td><input type="number" class="vc-rate-weight-max" step="any" min="0" value="<?php echo esc_attr($rate['weight_max']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $type . '][' . $i . '][weight_max]'); ?>" placeholder="0.00" size="4" /></td>
                                    <td><input type="number" class="vc-rate-total-from" step="any" min="0" value="<?php echo esc_attr($rate['total_from']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $type . '][' . $i . '][total_from]'); ?>" placeholder="0.00" size="4" /></td>
                                    <td><input type="number" class="vc-rate-total-to" step="any" min="0" value="<?php echo esc_attr($rate['total_to']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $type . '][' . $i . '][total_to]'); ?>" placeholder="0.00" size="4" /></td>
                                    <td><input type="text" value="<?php echo esc_attr($rate['cost']); ?>" name="woocommerce_<?php echo esc_attr($this->id . '_rates][' . $type . '][' . $i . '][cost]'); ?>" placeholder="0.00" size="4" /></td>
                                </tr>
                            <?php
                        }
                    }
                    ?>
                    </tbody>
                </table>

            </td>
        </tr>
        <?php
    }

    /**
     * Processes and saves options.
     * If there is an error thrown, will continue to save and validate fields, but will leave the erroring field out.
     * @since 2.6.0
     * @return bool was anything saved?
     */
    public function process_admin_options() {
        if ($this->instance_id) {
            $this->init_instance_settings();

            $post_data = $this->get_post_data();

            foreach ($this->get_instance_form_fields() as $key => $field) {
                if ('title' !== $this->get_field_type($field)
                    && 'WC_VC_Table_rates_table' !== $this->get_field_type($field)
                    && 'WC_VC_Table_rates_table_complex' !== $this->get_field_type($field)
                ) {
                    try {
                        $this->instance_settings[$key] = $this->get_field_value($key, $field, $post_data);
                    } catch (Exception $e) {
                        $this->add_error($e->getMessage());
                    }
                }

                if ($key == 'rates') {
                    if (!empty($post_data['woocommerce_' . $this->id . '_' . $key]['option_labels']) && count($post_data['woocommerce_' . $this->id . '_' . $key]['option_labels'])>0) {
                        foreach ($post_data['woocommerce_' . $this->id . '_' . $key]['option_labels'] as $option_label_key => $option_label) {
                            if($option_label=='' && !empty($post_data['woocommerce_' . $this->id . '_rates'][$option_label_key])) {
                                $this->add_error('The Option Label field label must not be empty');
                                return false;
                            }
                        }
                    }
                }
            }

            update_option($this->id . '_rates[' . $this->get_instance_id() . ']', $post_data['woocommerce_' . $this->id . '_rates']);

            return update_option($this->get_instance_option_key(), apply_filters('woocommerce_shipping_' . $this->id . '_instance_settings_values', $this->instance_settings, $this));
        } else {
            return parent::process_admin_options();
        }
    }

    /**
     * get_cost function.
     *
     * @access public
     * @param mixed $package
     * @return void
     */
    public function get_cost($package = array()) {
        global $woocommerce;

        $types = get_option($this->id . '_rates[' . $this->get_instance_id() . ']');

        if (isset($woocommerce->cart->cart_contents_total)) {
            $weight = $woocommerce->cart->get_cart_contents_weight();
            $total = $woocommerce->cart->subtotal;

            if (!empty($types)) {

                if (!empty($this->get_options()['deliveryDetails']['type'])) {
                    foreach ($types as $type => $rates) {
                        if ($type == 'option_labels' || $type == 'enableWeather' || $type == 'disable_options') {
                            continue;
                        }
                        foreach ($rates as $rate) {
                            if ($weight >= $rate['weight_min'] && $weight < $rate['weight_max'] && $total >= $rate['total_from'] && $total < $rate['total_to']) {
	                            $cost = $rate['cost'];

	                            // Add shipping class costs.
	                            $shipping_classes = WC()->shipping->get_shipping_classes();

	                            if ( ! empty( $shipping_classes ) ) {
		                            $found_shipping_classes = $this->find_shipping_classes( $package );
		                            $highest_class_cost     = 0;

		                            foreach ( $found_shipping_classes as $shipping_class => $products ) {
			                            // Also handles BW compatibility when slugs were used instead of ids.
			                            $shipping_class_term = get_term_by( 'slug', $shipping_class, 'product_shipping_class' );
			                            $class_cost_string   = $shipping_class_term && $shipping_class_term->term_id ? $this->get_option( 'class_cost_' . $shipping_class_term->term_id, $this->get_option( 'class_cost_' . $shipping_class, '' ) ) : $this->get_option( 'no_class_cost', '' );

			                            if ( '' === $class_cost_string ) {
				                            continue;
			                            }

			                            $has_costs  = true;
			                            $class_cost = $this->evaluate_cost(
				                            $class_cost_string, array(
					                            'qty'  => array_sum( wp_list_pluck( $products, 'quantity' ) ),
					                            'cost' => array_sum( wp_list_pluck( $products, 'line_total' ) ),
				                            )
			                            );

			                            if ( 'class' === $this->type ) {
				                            $cost += $class_cost;
			                            } else {
				                            $highest_class_cost = $class_cost > $highest_class_cost ? $class_cost : $highest_class_cost;
			                            }
		                            }

		                            if ( 'order' === $this->type && $highest_class_cost ) {
			                            $cost += $highest_class_cost;
		                            }
	                            }


	                            return $cost;
                            }
                        }
                    }
                } else {
                    $rates = $types;
                    if (!empty($rates)) {
                        foreach ($rates as $rate) {
                            if ($weight >= $rate['weight_min'] && $weight < $rate['weight_max'] && $total >= $rate['total_from'] && $total < $rate['total_to']) {
                                $cost = $rate['cost'];

	                            // Add shipping class costs.
	                            $shipping_classes = WC()->shipping->get_shipping_classes();
	                            if ( ! empty( $shipping_classes ) ) {
		                            $found_shipping_classes = $this->find_shipping_classes( $package );
		                            $highest_class_cost     = 0;

		                            foreach ( $found_shipping_classes as $shipping_class => $products ) {
			                            // Also handles BW compatibility when slugs were used instead of ids.
			                            $shipping_class_term = get_term_by( 'slug', $shipping_class, 'product_shipping_class' );
			                            $class_cost_string   = $shipping_class_term && $shipping_class_term->term_id ? $this->get_option( 'class_cost_' . $shipping_class_term->term_id, $this->get_option( 'class_cost_' . $shipping_class, '' ) ) : $this->get_option( 'no_class_cost', '' );

			                            if ( '' === $class_cost_string ) {
				                            continue;
			                            }

			                            $has_costs  = true;
			                            $class_cost = $this->evaluate_cost(
				                            $class_cost_string, array(
					                            'qty'  => array_sum( wp_list_pluck( $products, 'quantity' ) ),
					                            'cost' => array_sum( wp_list_pluck( $products, 'line_total' ) ),
				                            )
			                            );

			                            if ( 'class' === $this->type ) {
				                            $cost += $class_cost;
			                            } else {
				                            $highest_class_cost = $class_cost > $highest_class_cost ? $class_cost : $highest_class_cost;
			                            }
		                            }

		                            if ( 'order' === $this->type && $highest_class_cost ) {
			                            $cost += $highest_class_cost;
		                            }
	                            }


                                return $cost;
                            }
                        }
                    }
                }
            }


        }

        return null;
    }

    public function get_options() {
        return false;
    }

    public function accepts() {
        return array();
    }

}
