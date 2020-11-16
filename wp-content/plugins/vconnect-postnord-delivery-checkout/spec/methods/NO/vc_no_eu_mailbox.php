<?php
if (!class_exists('WC_VC_NO_EU_Mailbox')) {

    class WC_VC_NO_EU_Mailbox extends Vc_Aino_Shipping_Method {

        // Id for your shipping method. Should be uunique.
        public $vc_aino_id = 'vconnect_postnord_no_eu_mailbox';
        // Title shown in admin
        public $vc_aino_type = 'mailboxDelivery';
        // Title shown in admin
        protected $vc_aino_method_title = 'Europæisk Varubrev';
        // Description shown in admin
        protected $vc_aino_method_description = 'Description of your shipping method';
        // This can be added as an setting but for this example its forced.
        protected $vc_aino_title = 'In mailbox / Maxi Letter - EU';

        public function get_options() {
            global $vc_aino_widget;

            $options = array(
                'carrierServiceCode' => '',
                'return_zero_price' => true, // Suppresses doube price on mailbox delivery
                'deliveryDetails' => array(
                    'default_checkout_name' => 'typeText',
                    'default_checkout_label' => 'Shipping selection',
                    'type' => array(
                        array(
                            'id' => 'standardDelivery',
                            'name' => "2-3 dagar",
                            'attributes' => array(
                                'data-type-id' => 'dayDelivery'
                            ),
                        ),
                    ),
                ),
                'sort_order' => 1,
                'type' => 'mailboxDelivery'
            );

            return $options;
        }
    }

}