<?php
if (!class_exists('WC_VC_SE_EU_Mailbox')) {

    class WC_VC_SE_EU_Mailbox extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_se_eu_mailbox';
        // Title shown in admin
        public $vc_aino_type = 'mailboxDelivery';
        // Title shown in admin
        protected $vc_aino_method_title = 'Europeisk Varubrev';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'In mailbox / Maxi Letter - EU';

        public function get_options() {
            global $vc_aino_widget;

            $options = array(
                'carrierServiceCode' => '',
                'deliveryDetails' => array(
                    'default_checkout_name' => 'typeText',
                    'default_checkout_label' => 'Leveransval',
                    'type' => array(
                        array(
                            'id' => 'standardDelivery',
                            'addedPrice' => "100",
                            'name' => "2-3 dagar",
                            'attributes' => array(
                                'data-type-id' => 'standardDelivery'
                            ),
                        ),
                        array(
                            'id' => 'oneDayDelivery',
                            'addedPrice' => "20",
                            'name' => "1 dag",
                            'attributes' => array(
                                'data-type-id' => 'oneDayDelivery'
                            ),
                        )
                    ),
                ),
                'sort_order' => 1,
                'type' => 'yourMailbox'
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
                    'required_error' => 'Du måste välja frakt'
                ),
                'nearest_point_label' => array(
                    'separator' => true,
                    'label' => 'Om paketet inte får plats i postlådan kommer det att levereras till'
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
            );
        }
    }
}