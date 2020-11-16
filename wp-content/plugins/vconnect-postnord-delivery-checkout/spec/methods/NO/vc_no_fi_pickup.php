<?php //
if (!class_exists('WC_VC_NO_FI_Pickup')) {

    class WC_VC_NO_FI_Pickup extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_no_fi_pickup';
        // Type of the widget section for method
        public $vc_aino_type = 'postOffice';
        // Title shown in admin
        protected $vc_aino_method_title = 'Til udleveringssted FI';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Shipping Scandinavia - FI';
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
                'country' => array(
                    'label' => 'Land',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted land'
                ),
            );
        }
    }

}