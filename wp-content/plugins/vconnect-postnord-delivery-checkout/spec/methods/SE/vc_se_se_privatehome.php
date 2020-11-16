<?php
if (!class_exists('WC_VC_SE_SE_Privatehome')) {

    class WC_VC_SE_SE_Privatehome extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_se_se_privatehome';
        // Title shown in admin
        public $vc_aino_type = 'homeDeliveryFlex';
        // Title shown in admin
        protected $vc_aino_method_title = 'Till dörren';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'With delivery';

        public function get_options() {
            global $vc_aino_widget;

            $options = array(
                'carrierServiceCode' => '',
                'deliveryDetails' => array(
                    'default_checkout_name' => 'typeText',
                    'default_checkout_label' => 'Leveransval',
                    'type' => array(
                        array(
                            'id' => 'flexDelivery',
                            'options_switch' => array(
                                'label' => 'Disable Flex Delivery options'
                            ),
                            'name' => 'Flex leverans',
                            'default_checkout_location_name' => 'addressText',
                            'default_checkout_location_label' => 'Flex Delivery option',
                            'enabled' => true,
                            'attributes' => array(
                                'data-type-id' => 'flexDelivery'
                            ),
                            'location' => array(
                                array(
                                    'id' => 'pkgOutsideDoor',
                                    'name' => $vc_aino_widget->_t('flexLocation.pkgOutsideDoor'),
                                ),
                                array(
                                    'id' => 'outside',
                                    'name' => $vc_aino_widget->_t('flexLocation.outside'),
                                ),
                                array(
                                    'id' => 'garage',
                                    'name' => $vc_aino_widget->_t('flexLocation.garage'),
                                ),
                                array(
                                    'id' => 'backDoor',
                                    'name' => $vc_aino_widget->_t('flexLocation.backDoor'),
                                ),
                            )
                        ),
                        array(
                            'id' => 'dayDelivery',
                            'name' => "Dagtid innan kl 17",
                            'attributes' => array(
                                'data-type-id' => 'dayDelivery'
                            ),
                        ),
                        array(
                            'id' => 'eveningDelivery',
                            'addedPrice' => "50",
                            'name' => "Kvällstid efter kl 17",
                            'attributes' => array(
                                'data-type-id' => 'eveningDelivery'
                            ),
                        )
                    ),
                ),
                'sort_order' => 1,
                'type' => 'yourAddress'
            );

            return $options;
        }

        public function accepts(){
            return array(
                'typeId' => array(
                    'hidden' => true,
                    'required' => true,
                ),
                'typeText' => array(
                    'label' => 'Leveransval',
                    'required' => true,
                    'required_error' => 'You need to select shipping'
                ),
                'addressText' => array(
                    'label' => 'Flex leverans',
                ),
                'info' => array(
                    'label' => 'Code',
                ),
            );
        }
    }
}