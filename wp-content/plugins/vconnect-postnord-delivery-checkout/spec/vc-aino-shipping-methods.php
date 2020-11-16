<?php

class Vc_Aino_Shipping_Methods {

    function __construct(){
        add_action('woocommerce_shipping_init', array($this, 'aio_shipping_methods_init'));
        add_filter('woocommerce_shipping_methods', array($this, 'add_aio_shipping_methods'));
    }

    function aio_shipping_methods_init() {
        // Require all shipping classes located in the classes/methods folder

        require_once AINO_PLUGIN_PATH . 'core/inc/abstract/vc_aino_shipping_method.php';

        foreach (glob(AINO_PLUGIN_PATH . '/spec/methods/*/*.php') as $filename){
            require_once $filename;
        }
    }

    /*
     * Add the shipping methods to WooCommerce
     */
    function add_aio_shipping_methods( $methods ) {

	    global $vc_aino_heplers;

		$shop_origin = $vc_aino_heplers->get_shop_origin();
		
	    if ( $country_methods = $this->getMethodsForLocation( $shop_origin) ) {
			    foreach ( $country_methods as $id => $class ) {
				    $methods[ $id ] = $class;
			    }
	    }

        return $methods;
    }

    function getMethodsForLocation($country_code) {
    	$methods = array(
    		'DK' => array(
				'vconnect_postnord_dk_dk_privatehome'   => 'WC_VC_DK_DK_Privatehome',   // Til din adresse
				'vconnect_postnord_dk_dk_commercial'    => 'WC_VC_DK_DK_Commercial',    // Til erhvev
			    'vconnect_postnord_dk_dk_pickup'        => 'WC_VC_DK_DK_Pickup',        // Til udleveringssted DK
			    'vconnect_postnord_dk_cz_pickup'        => 'WC_VC_DK_CZ_Pickup',        // Til udleveringssted CZ
			    'vconnect_postnord_dk_pt_pickup'        => 'WC_VC_DK_PT_Pickup',        // Til udleveringssted PT
			    'vconnect_postnord_dk_se_pickup'        => 'WC_VC_DK_SE_Pickup',        // Til udleveringssted SE
			    'vconnect_postnord_dk_no_pickup'        => 'WC_VC_DK_NO_Pickup',        // Til udleveringssted NO
				'vconnect_postnord_dk_fi_pickup'        => 'WC_VC_DK_FI_Pickup',        // Til udleveringssted FI
				'vconnect_postnord_dk_de_pickup'        => 'WC_VC_DK_DE_Pickup',        // Til udleveringssted DE
				'vconnect_postnord_dk_be_pickup'        => 'WC_VC_DK_BE_Pickup',        // Til udleveringssted BE
				'vconnect_postnord_dk_nl_pickup'        => 'WC_VC_DK_NL_Pickup',        // Til udleveringssted NL
				'vconnect_postnord_dk_lu_pickup'        => 'WC_VC_DK_LU_Pickup',        // Til udleveringssted LU
				'vconnect_postnord_dk_ee_pickup'        => 'WC_VC_DK_EE_Pickup',        // Til udleveringssted EE
				'vconnect_postnord_dk_lv_pickup'        => 'WC_VC_DK_LV_Pickup',        // Til udleveringssted LV
				'vconnect_postnord_dk_lt_pickup'        => 'WC_VC_DK_LT_Pickup',        // Til udleveringssted LT
				'vconnect_postnord_dk_at_pickup'        => 'WC_VC_DK_AT_Pickup',        // Til udleveringssted AT
				'vconnect_postnord_dk_fr_pickup'        => 'WC_VC_DK_FR_Pickup',        // Til udleveringssted FR
				'vconnect_postnord_dk_gb_pickup'        => 'WC_VC_DK_GB_Pickup',        // Til udleveringssted GB
				'vconnect_postnord_dk_es_pickup'        => 'WC_VC_DK_ES_Pickup',        // Til udleveringssted ES
			    'vconnect_postnord_dk_eu_dpd'           => 'WC_VC_DK_EU_Dpd',           // Europæisk levering
			    'vconnect_postnord_dk_int_dpd'          => 'WC_VC_DK_Int_Dpd',          // International levering
		    ),
		    'SE' => array(
			    'vconnect_postnord_se_se_mailbox'       => 'WC_VC_SE_SE_Mailbox',       // Till postlådan
			    'vconnect_postnord_se_se_privatehome'   => 'WC_VC_SE_SE_Privatehome',   // Till dörren
				'vconnect_postnord_se_se_commercial'    => 'WC_VC_SE_SE_Commercial',    // Till företag
				'vconnect_postnord_se_dk_mailbox'       => 'WC_VC_SE_DK_Mailbox',       // Varubrev DK
				'vconnect_postnord_se_no_mailbox'       => 'WC_VC_SE_NO_Mailbox',       // Varubrev NO
				'vconnect_postnord_se_se_pickup'        => 'WC_VC_SE_SE_Pickup',        // Till utlämningsställe
				'vconnect_postnord_se_cz_pickup'        => 'WC_VC_SE_CZ_Pickup',        // Till utlämningsställe CZ
				'vconnect_postnord_se_pt_pickup'        => 'WC_VC_SE_PT_Pickup',        // Till utlämningsställe PT
			    'vconnect_postnord_se_dk_pickup'        => 'WC_VC_SE_DK_Pickup',        // Till utlämningsställe DK
			    'vconnect_postnord_se_no_pickup'        => 'WC_VC_SE_NO_Pickup',        // Till utlämningsställe NO
				'vconnect_postnord_se_fi_pickup'        => 'WC_VC_SE_FI_Pickup',        // Till utlämningsställe FI
				'vconnect_postnord_se_de_pickup'        => 'WC_VC_SE_DE_Pickup',        // Till utlämningsställe DE
				'vconnect_postnord_se_be_pickup'        => 'WC_VC_SE_BE_Pickup',        // Till utlämningsställe BE
				'vconnect_postnord_se_nl_pickup'        => 'WC_VC_SE_NL_Pickup',        // Till utlämningsställe NL
				'vconnect_postnord_se_lu_pickup'        => 'WC_VC_SE_LU_Pickup',        // Till utlämningsställe LU
				'vconnect_postnord_se_ee_pickup'        => 'WC_VC_SE_EE_Pickup',        // Till utlämningsställe EE
				'vconnect_postnord_se_lv_pickup'        => 'WC_VC_SE_LV_Pickup',        // Till utlämningsställe LV
				'vconnect_postnord_se_lt_pickup'        => 'WC_VC_SE_LT_Pickup',        // Till utlämningsställe LT
				'vconnect_postnord_se_at_pickup'        => 'WC_VC_SE_AT_Pickup',        // Till utlämningsställe AT
				'vconnect_postnord_se_fr_pickup'        => 'WC_VC_SE_FR_Pickup',        // Till utlämningsställe FR
				'vconnect_postnord_se_gb_pickup'        => 'WC_VC_SE_GB_Pickup',        // Till utlämningsställe GB
				'vconnect_postnord_se_es_pickup'        => 'WC_VC_SE_ES_Pickup',        // Till utlämningsställe ES
			    'vconnect_postnord_se_eu_mailbox'       => 'WC_VC_SE_EU_Mailbox',       // Europeisk Varubrev
			    'vconnect_postnord_se_eu_dpd'           => 'WC_VC_SE_EU_Dpd',           // Europeisk leverans
			    'vconnect_postnord_se_int_mailbox'      => 'WC_VC_SE_Int_Mailbox',      // Internationell Varubrev
			    'vconnect_postnord_se_int_dpd'          => 'WC_VC_SE_Int_Dpd',          // Internationell leverans
		    ),
		    'NO' => array(
			    'vconnect_postnord_no_no_mailbox'       => 'WC_VC_NO_NO_Mailbox',       // Til postkassen
			    'vconnect_postnord_no_no_privatehome'   => 'WC_VC_NO_NO_Privatehome',   // Til døren
			    'vconnect_postnord_no_no_pickup'        => 'WC_VC_NO_NO_Pickup',        // Til udleveringssted
			    'vconnect_postnord_no_cz_pickup'        => 'WC_VC_NO_CZ_Pickup',        // Til udleveringssted CZ
			    'vconnect_postnord_no_pt_pickup'        => 'WC_VC_NO_PT_Pickup',        // Til udleveringssted PT
			    'vconnect_postnord_no_dk_pickup'        => 'WC_VC_NO_DK_Pickup',        // Til udleveringssted DK
			    'vconnect_postnord_no_se_pickup'        => 'WC_VC_NO_SE_Pickup',        // Til udleveringssted SE
				'vconnect_postnord_no_fi_pickup'        => 'WC_VC_NO_FI_Pickup',        // Til udleveringssted FI
				'vconnect_postnord_no_de_pickup'        => 'WC_VC_NO_DE_Pickup',        // Til udleveringssted DE
				'vconnect_postnord_no_be_pickup'        => 'WC_VC_NO_BE_Pickup',        // Til udleveringssted BE
				'vconnect_postnord_no_nl_pickup'        => 'WC_VC_NO_NL_Pickup',        // Til udleveringssted NL
				'vconnect_postnord_no_lu_pickup'        => 'WC_VC_NO_LU_Pickup',        // Til udleveringssted LU
				'vconnect_postnord_no_ee_pickup'        => 'WC_VC_NO_EE_Pickup',        // Til udleveringssted EE
				'vconnect_postnord_no_lv_pickup'        => 'WC_VC_NO_LV_Pickup',        // Til udleveringssted LV
				'vconnect_postnord_no_lt_pickup'        => 'WC_VC_NO_LT_Pickup',        // Til udleveringssted LT
				'vconnect_postnord_no_at_pickup'        => 'WC_VC_NO_AT_Pickup',        // Til udleveringssted AT
				'vconnect_postnord_no_fr_pickup'        => 'WC_VC_NO_FR_Pickup',        // Til udleveringssted FR
				'vconnect_postnord_no_gb_pickup'        => 'WC_VC_NO_GB_Pickup',        // Til udleveringssted GB
				'vconnect_postnord_no_es_pickup'        => 'WC_VC_NO_ES_Pickup',        // Til udleveringssted ES
			    'vconnect_postnord_no_eu_mailbox'       => 'WC_VC_NO_EU_Mailbox',       // Europæisk Varubrev
			    'vconnect_postnord_no_eu_dpd'           => 'WC_VC_NO_EU_Dpd',           // Europæisk levering
			    'vconnect_postnord_no_int_mailbox'      => 'WC_VC_NO_Int_Mailbox',      // International Varubrev
			    'vconnect_postnord_no_int_dpd'          => 'WC_VC_NO_Int_Dpd',          // International levering
		    ),
		    'FI' => array(
			    'vconnect_postnord_fi_fi_privatehome'   => 'WC_VC_FI_FI_Privatehome',   // Toimitus kotiin
			    'vconnect_postnord_fi_fi_pickup'        => 'WC_VC_FI_FI_Pickup',        // Toimitus noutopisteeseen
			    'vconnect_postnord_fi_fi_commercial'    => 'WC_VC_FI_FI_Commercial',    // Toimitus työpaikalle
			    'vconnect_postnord_fi_dk_pickup'        => 'WC_VC_FI_DK_Pickup',        // Til udleveringssted DK
			    'vconnect_postnord_fi_cz_pickup'        => 'WC_VC_FI_CZ_Pickup',        // Til udleveringssted CZ
			    'vconnect_postnord_fi_pt_pickup'        => 'WC_VC_FI_PT_Pickup',        // Til udleveringssted PT
			    'vconnect_postnord_fi_se_pickup'        => 'WC_VC_FI_SE_Pickup',        // Til udleveringssted SE
				'vconnect_postnord_fi_no_pickup'        => 'WC_VC_FI_NO_Pickup',        // Til udleveringssted NO
				'vconnect_postnord_fi_de_pickup'        => 'WC_VC_FI_DE_Pickup',        // Til udleveringssted DE
			    'vconnect_postnord_fi_be_pickup'        => 'WC_VC_FI_BE_Pickup',        // Til udleveringssted BE
			    'vconnect_postnord_fi_nl_pickup'        => 'WC_VC_FI_NL_Pickup',        // Til udleveringssted NL
			    'vconnect_postnord_fi_lu_pickup'        => 'WC_VC_FI_LU_Pickup',        // Til udleveringssted LU
			    'vconnect_postnord_fi_ee_pickup'        => 'WC_VC_FI_EE_Pickup',        // Til udleveringssted EE
			    'vconnect_postnord_fi_lv_pickup'        => 'WC_VC_FI_LV_Pickup',        // Til udleveringssted LV
			    'vconnect_postnord_fi_lt_pickup'        => 'WC_VC_FI_LT_Pickup',        // Til udleveringssted LT
			    'vconnect_postnord_fi_at_pickup'        => 'WC_VC_FI_AT_Pickup',        // Til udleveringssted AT
			    'vconnect_postnord_fi_fr_pickup'        => 'WC_VC_FI_FR_Pickup',        // Til udleveringssted FR
			    'vconnect_postnord_fi_gb_pickup'        => 'WC_VC_FI_GB_Pickup',        // Til udleveringssted GB
			    'vconnect_postnord_fi_es_pickup'        => 'WC_VC_FI_ES_Pickup',        // Til udleveringssted ES
			    'vconnect_postnord_fi_eu_dpd'           => 'WC_VC_FI_EU_Dpd',           // Europæisk levering
			    'vconnect_postnord_fi_int_dpd'          => 'WC_VC_FI_Int_Dpd',          // International levering

            )
	    );

    	return !empty($methods[$country_code]) ? $methods[$country_code] : false;
    }

    function getZoneCountries($locations){
    	$country_codes = array();

    	foreach($locations as $location){
    		$location_arr = explode(':', $location->code);
		    $country_codes[] = $location_arr[0];
	    }

	    return $country_codes;
    }

    function check_location($location){

    }
}

new Vc_Aino_Shipping_Methods();