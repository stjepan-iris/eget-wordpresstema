<?php

class Vc_Aino_Pickup_Points {

    private $helpers = null;
    private $api_url = "https://api2.postnord.com/rest/businesslocation/v1/servicepoint/findNearestByAddress.json?";
    private $backup_api_url = "http://deliverycheckout.postnord.com/rest/businesslocation/v1/servicepoint/findNearestByAddress.json?";

    /** Refers to a single instance of this class. */
    private static $instance = null;

    /**
     * Creates or returns an instance of this class.
     *
     * @return  Foo A single instance of this class.
     */
    public static function get_instance() {

        if (null == self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }

    /**
     * Constructor
     *
     * @access private
     * @return void
     */
    private function __construct() {
        global $vc_aino_heplers;
        $this->helpers = $vc_aino_heplers;

        add_action('wp_ajax_get_points', array($this, 'get_points'));
        add_action('wp_ajax_nopriv_get_points', array($this, 'get_points'));
    }

    public function api_call($consumer_id, $postcode, $country_code) {

        $url = $this->api_url
                . "apikey=$consumer_id"
                . "&countryCode=$country_code"
                . "&postalCode=$postcode"
                . "&numberOfServicePoints=10"
                . "&locale=en";

        $json_decoded = $this->curl_call( $url );

        if (!empty($json_decoded->servicePointInformationResponse->compositeFault) || empty($json_decoded->servicePointInformationResponse->servicePoints)) {

            $backup_api_url = $this->backup_api_url
                . "apikey=$consumer_id"
                . "&countryCode=$country_code"
                . "&postalCode=$postcode"
                . "&numberOfServicePoints=10"
                . "&locale=en";

            $json_decoded =  $this->curl_call( $backup_api_url );
        }

        return !empty($json_decoded->servicePointInformationResponse->servicePoints) ? $json_decoded->servicePointInformationResponse->servicePoints : array();
    }

    private function build_response($postcode, $data, $country_code) {
        $points = $data;

        $processed_points = array();

        if (!empty($points)) {
            foreach ($points as $key => $point) {
                if (!empty($point->visitingAddress->streetName)) {
                    $processed_point = new \stdClass();
                    $processed_point->servicePointId = isset($point->servicePointId) ? trim($point->servicePointId) : '';
                    $processed_point->name = isset($point->name) ? trim($point->name) : '';
                    $processed_point->visitingAddress = $this->get_delivery_address($point);

                    if( isset( $point->backupApiUrl ) && $point->backupApiUrl === true ) {
                        $processed_point->openingHours = $point->openingHours;
                    } else {
                        $processed_point->openingHours = $this->get_working_time($point);
                    }

                    $processed_point->coordinate = $this->get_coordinates($point);
                    $processed_point->forwarderName = 'PostNord';

                    $processed_points[] = $processed_point;
                }
            }
        }

        return $processed_points;
    }

    public function vc_geocode($address, $postcode, $country_code) {
        $url = "https://maps.googleapis.com/maps/api/geocode/json?"
                . "address=" . urlencode($address) . "," . $postcode
                . "," . $country_code;

        $response = $this->curl_call($url);

        if (!empty($response->results)) {
            $origin = array(
                'type' => $response->results[0]->geometry->location_type,
                'postcode' => $postcode,
                'lat' => $response->results[0]->geometry->location->lat,
                'lng' => $response->results[0]->geometry->location->lng,
                'partial_match' => !empty($response->results[0]->partial_match) ? 1 : 0,
            );
        } else {
            $origin = array(
                'type' => null,
                'postcode' => null,
                'lat' => null,
                'lng' => null,
                'partial_match' => 0,
            );
        }

        return $origin;
    }

    public function get_points() {
        global $woocommerce;

        $country_code_get = filter_input(INPUT_GET, 'country_code');
        $country_code = !empty($country_code_get) ?
               $country_code_get : $woocommerce->customer->shipping_country;

        $postnumber_get = filter_input(INPUT_GET, 'postcode');
        $postnumber = !empty($postnumber_get) ?
               $postnumber_get : $woocommerce->customer->shipping_postcode;

        $service_points = $this->get_service_points($postnumber, $country_code);

        return $service_points;
    }

    private function get_service_points($postcode, $country_code = 'DK') {

        $consumer_id = get_option('vc_aino_consumer_id');

        $data = $this->api_call($consumer_id, $postcode, $country_code);

        $post_addresses = $this->build_response($postcode, $data, $country_code);

        return $post_addresses;
    }

    private function get_delivery_address($point) {

        $visitingAddress = new stdClass();
        $visitingAddress->countryCode = isset($point->visitingAddress->countryCode) ? trim($point->visitingAddress->countryCode) : '';
        $visitingAddress->city = isset($point->visitingAddress->city) ? trim($point->visitingAddress->city) : '';
        $visitingAddress->streetName = isset($point->visitingAddress->streetName) ? trim($point->visitingAddress->streetName) : '';
        $visitingAddress->streetNumber = isset($point->visitingAddress->streetNumber) ? trim($point->visitingAddress->streetNumber) : '';
        $visitingAddress->postalCode = isset($point->visitingAddress->postalCode) ? trim($point->visitingAddress->postalCode) : '';

        return $visitingAddress;
    }

    private function get_working_time($point) {
        global $vc_aino_widget;

        $weekdays_opening = isset($point->openingHours[0]->from1) ? substr_replace(trim($point->openingHours[0]->from1), ':', 2, 0) : '';
        $weekdays_closing = isset($point->openingHours[0]->to1) ? substr_replace(trim($point->openingHours[0]->to1), ':', 2, 0) : '';
        $weekends_opening = isset($point->openingHours[5]->from1) ? substr_replace(trim($point->openingHours[5]->from1), ':', 2, 0) : '';
        $weekends_closing = isset($point->openingHours[5]->to1) ? substr_replace(trim($point->openingHours[5]->to1), ':', 2, 0) : '';


        $openingHours = array(
            $vc_aino_widget->_t('days.mon') . '-' . $vc_aino_widget->_t('days.fri') . ': ' . $weekdays_opening . '-' . $weekdays_closing,
            $vc_aino_widget->_t('days.sat') . ': ' . $weekends_opening . '-' . $weekends_closing
        );

        return $openingHours;
    }

    private function get_coordinates($point) {
        $coordinates = new \stdClass();
        $coordinates->northing = $point->coordinate->northing;
        $coordinates->easting = $point->coordinate->easting;
        $coordinates->srId = $point->coordinate->srId;

        return $coordinates;
    }

    private function default_postcodes($country_code) {
        if ($country_code == 'NO') {
            $postnumber = '0180';
        } else if ($country_code == "SE") {
            $postnumber = '11152';
        } else if ($country_code == "FI") {
            $postnumber = '00002';
        } else {
            $postnumber = '2630';
        }

        return $postnumber;
    }

    function curl_call($url) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HEADER, 0);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $jsonFile = curl_exec($curl);
        curl_close($curl);

        return json_decode($jsonFile);
    }

}

$vc_aino_pickup_points = Vc_Aino_Pickup_Points::get_instance();
