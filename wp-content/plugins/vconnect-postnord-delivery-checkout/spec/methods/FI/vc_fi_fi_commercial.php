<?php

if (!class_exists('WC_VC_FI_FI_Commercial')) {

    class WC_VC_FI_FI_Commercial extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be unique.
        public $vc_aino_id = 'vconnect_postnord_fi_fi_commercial';
        // Title shown in admin
        public $vc_aino_type = 'businessDeliveryTabs';
        // Title shown in admin
        protected $vc_aino_method_title = 'Toimitus työpaikalle';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Finland Commercial';

        public function get_options() {
            global $vc_aino_widget;

            $options = array(
                'carrierServiceCode' => '',
                'deliveryDetails' => array(
                    'default_checkout_name' => 'typeText',
                    'default_checkout_label' => 'Shipping selection',
                    'type' => array(
                        array(
                            'id' => 'dayDelivery',
                            'name' => 'Day Delivery',
                            'default_checkout_location_name' => 'addressText',
                            'default_checkout_location_label' => 'Day Delivery option',
                            'attributes' => array(
                                'data-type-id' => 'dayDelivery'
                            ),
                            'location' => array(
                                array(
                                    'id' => 'withArrangement',
                                    'name' => '',
                                ),
                            )
                        ),
                    ),
                ),
                'sort_order' => 1,
                'type' => 'homeDeliveryTabs'
            );

            return $options;
        }

    }

}