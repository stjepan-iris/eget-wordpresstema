<?php
if (!class_exists('WC_VC_DK_DK_Privatehome')) {

    class WC_VC_DK_DK_Privatehome extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_dk_dk_privatehome';
        // Title shown in admin
        public $vc_aino_type = 'homeDeliveryFlex';
        // Title shown in admin
        protected $vc_aino_method_title = 'Til din adresse';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Denmark with delivery';

        public function get_options() {
            global $vc_aino_widget;

            $options = array(
                'carrierServiceCode' => '',
                'deliveryDetails' => array(
                    'default_checkout_name' => 'typeText',
                    'default_checkout_label' => 'Shipping selection',
                    'type' => array(
                        array(
                            'id' => 'flexDelivery',
                            'options_switch' => array(
	                            'label' => 'Disable Flex Delivery options'
                            ),
                            'settings_label' => 'Flex Delivery',
                            'name' => 'Flex levering',
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
                                    'id' => 'garage',
                                    'name' => $vc_aino_widget->_t('flexLocation.garage'),
                                ),
                                array(
                                    'id' => 'backDoor',
                                    'name' => $vc_aino_widget->_t('flexLocation.backDoor'),
                                ),
                                array(
                                    'id' => 'modttager',
                                    'name' => $vc_aino_widget->_t('flexLocation.modttager'),
                                ),
                                array(
                                    'id' => 'other',
                                    'name' => $vc_aino_widget->_t('flexLocation.other'),
                                    'creates' => array(
                                        array(
                                            'name' => 'info',
                                            'label' => 'Code',
                                            'type' => 'textarea'
                                        )
                                    )
                                ),
                            )
                        ),
                        array(
                            'id' => 'dayDelivery',
                            'settings_label' => 'Day Delivery',
                            'name' => "Dagtid innan kl 17",
                            'attributes' => array(
                                'data-type-id' => 'dayDelivery'
                            ),
                        ),
                    ),
                ),
                'sort_order' => 1,
                'type' => 'homeDeliveryFlex'
            );

            return $options;
        }

        public function accepts() {
            return array(
                'typeId' => array(
                    'hidden' => true,
                    'required' => true,
                ),
                'typeText' => array(
                    'label' => 'Shipping selection',
                    'required' => true,
                    'required_error' => 'Du skal vælge en leveringsmetode'
                ),
                'addressText' => array(
                    'label' => 'Flex Delivery option',
                ),
                'info' => array(
                    'label' => 'Code',
                ),
            );
        }
    }
}