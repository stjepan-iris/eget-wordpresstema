<?php //
if (!class_exists('WC_VC_NO_EE_Pickup')) {

    class WC_VC_NO_EE_Pickup extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_no_ee_pickup';
        // Type of the widget section for method
        public $vc_aino_type = 'postOfficeDelivery';
        // Title shown in admin
        protected $vc_aino_method_title = 'Til udleveringssted EE';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'Shipping Scandinavia - EE';
        // Define the Universe popup this shipping method uses
        public $is_pickup = true;

        public function accepts(){
            return array(
                'typeId' => array(
                    'hidden' => true,
                    'required' => true,
                ),
                'addressId' => array(
                    'label' => 'ID nummer',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted ID'
                ),
                'name' => array(
                    'label' => 'Posthus/Pakkeboks navn',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted navn'
                ),
                'addressText' => array(
                    'label' => 'Adresse',
                    'required_error' => 'Du skal vælge udleveringssted adresse'
                ),
                'city' => array(
                    'label' => 'By',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted by'
                ),
                'postcode' => array(
                    'label' => 'Postnummer',
                    'required' => true,
                    'required_error' => 'Du skal vælge udleveringssted postnummer'
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