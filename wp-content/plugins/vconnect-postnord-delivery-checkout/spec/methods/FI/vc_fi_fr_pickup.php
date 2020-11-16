<?php
if (!class_exists('WC_VC_FI_FR_Pickup')) {

    class WC_VC_FI_FR_Pickup extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_fi_fr_pickup';
        // Type of the widget section for method
        public $vc_aino_type = 'postOfficeDelivery';
        // Title shown in admin
        protected $vc_aino_method_title = 'Til udleveringssted FR';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Shipping Scandinavia - FR';
        // Define the Universe popup this shipping method uses
        public $is_pickup = true;

        public function accepts(){
            return array(
                'typeId' => array(
                    'hidden' => true,
                    'required' => true,
                ),
                'addressId' => array(
                    'label' => 'Service point ID',
                    'required' => true,
                    'required_error' => 'You need to select pickup id'
                ),
                'name' => array(
                    'label' => 'Service point Name',
                    'required' => true,
                    'required_error' => 'You need to select pickup name'
                ),
                'addressText' => array(
                    'label' => 'Address',
                    'required_error' => 'You need to select pickup address'
                ),
                'city' => array(
                    'label' => 'City',
                    'required' => true,
                    'required_error' => 'You need to select pickup city'
                ),
                'postcode' => array(
                    'label' => 'Postal Code',
                    'required' => true,
                    'required_error' => 'You need to select pickup postcode'
                ),
            );
        }
    }

}