<?php
if (!class_exists('WC_VC_FI_FI_Privatehome')) {

    class WC_VC_FI_FI_Privatehome extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_fi_fi_privatehome';
        // Title shown in admin
        public $vc_aino_type = 'homeDeliveryTabs';
        // Title shown in admin
        protected $vc_aino_method_title = 'Toimitus kotiin';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Finland with delivery';

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