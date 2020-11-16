<?php
if (!class_exists('WC_VC_SE_BE_Pickup')) {

    class WC_VC_SE_BE_Pickup extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_se_be_pickup';
        // Type of the widget section for method
        public $vc_aino_type = 'postOfficeDelivery';
        // Title shown in admin
        protected $vc_aino_method_title = 'Till utlämningsställe BE';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Shipping Scandinavia - BE';
        // Define the Universe popup this shipping method uses
        public $is_pickup = true;

        public function accepts(){
            return array(
                'typeId' => array(
                    'hidden' => true,
                    'required' => true,
                ),
                'addressId' => array(
                    'label' => 'Service-ID',
                    'required' => true,
                    'required_error' => 'Du måste välja pickup-id'
                ),
                'name' => array(
                    'label' => 'Tjänstens namn',
                    'required' => true,
                    'required_error' => 'Du måste välja hämtningspunktsnamn'
                ),
                'addressText' => array(
                    'label' => 'Adress',
                    'required_error' => 'Du måste välja pickup-adress'
                ),
                'city' => array(
                    'label' => 'Stad',
                    'required' => true,
                    'required_error' => 'Du måste välja pickup-stad'
                ),
                'postcode' => array(
                    'label' => 'Postnummer',
                    'required' => true,
                    'required_error' => 'Du måste välja väljpunkts postnummer'
                ),
                'country' => array(
                    'label' => 'Land',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted land'
                ),
            );
        }
    }

}