(function ($) {
    $.vcAinoWp = function (el, target, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.$el.data("vcAinoWp", base);
        base.transitTime;

        base.init = function () {
            if (typeof (target) === "undefined" || target === null)
                target = ".shop_table";

            base.target = target;
            base.options = $.extend({}, $.vcAinoWp.defaultOptions, options);
            base.inited = false;

            $(document).on('change', '.vc-aio-op-select', function () {
                var data = base.getStandartData();
                data.deliveryDetails[$(this).attr('data-cname')] = $(this).val();
                Cookies.set('aio_data', JSON.stringify(data));

                var option = $('option:selected', this).attr('data-type-id');

                if(typeof(option)!=='undefined'){
                    data.deliveryDetails['typeId'] = option;

                    var shipping_checkbox = base.getShippingId(data.shippingId);

                   base.changeCost(data, shipping_checkbox);
                }

                $('body').trigger('update_checkout');
            });

            $(document).on('keyup', '.vc-aio-st-textarea', function () {
                var data = base.getStandartData();
                data.deliveryDetails[$(this).attr('data-cname')] = $(this).val();
                Cookies.set('aio_data', JSON.stringify(data));
            });

            $(document).on('click', '[data-trn-key="postOffice.changeDeliveryType"]', function (e) {
                e.preventDefault();
            });

            $(document).on('click', 'button.aino-dropdown-trigger', function (e) {
                e.preventDefault();
            });

            $(document).on('click', '#OpenDialog', function () {
                base.openAinoWidget('#widgetContainer');
            });

            $(document).ajaxSuccess(function (event, xhr, settings, data) {
                if (typeof settings.url !== 'undefined') {
                    var url_arr = settings.url.split('wc-ajax=');

                    if (url_arr.length > 1) {
                        var element = url_arr[1];
                        if (element === 'update_order_review') {
                            base.inited = false;
                            var shipping_checkbox = base.getShippingId(base.getStandartData().shippingId);
                            if(typeof(shipping_checkbox)!=='undefined'){
                                base.cleanStandartCookies();
                                Cookies.set('aio_data', JSON.stringify(base.getStandartData()));
                            }

                            if (!base.inited && ($('[value*="vconnect_postnord"]:checked').length > 0
                                    || $('[value*="vconnect_postnord"]').attr('type') === 'hidden')) {
                                $('#order_review table tr.shipping').after('<tr><td colspan="2"><div id="widgetContainer"></div></td></tr>');
                                base.openAinoWidget('#widgetContainer');
                            } else {
                                base.inited = false;
                            }
                        }
                    }
                }
            });
        };

        base.openAinoWidget = function (container) {
            base.inited = true;
            var defaults = base.getWidgetDefaults();
            var postcode = base.getPostcode(defaults);
            var countryCode = base.getCountryCode(defaults);
            var address = base.getStreetAddress(defaults);

            $(container).allInOne({
                weatherDataApiKey: '3c2e9f3ba04844da52d31ce5fc16928b',
                userPostcode: postcode,
                userCountryCode: countryCode,
                userStreet: address,
                dataAPIUrl: aino_params.wc_ajax,
                postOfficeAPIUrl: aino_params.wc_points,
                weatherDataAPIUrl: "//api.openweathermap.org/data/2.5/forecast/daily",
                themeFolder: aino_params.aio_url + '/core/widget/themes',
                langUrl: aino_params.aio_url + '/core/widget/data/aio.lang.json?ver=' + vcAinoWidgetVersion,
                showLoader: true,
                enablePostcodeCheck: aino_params.enable_postal_code_popup == 'yes' ? true : false,
                defaults: defaults,
                loadCompletedCallback: $.proxy(function (success) {
                    if (success) {
                        $('#showDataButton').show();
                    } else {
                        console.log('Unable to load widget!');
                    }
                }, this),
                submitCallback: base.getData,
                optionChangedCallback: base.getDataInline
            });
        };

        base.changeCost = function (data, shipping_checkbox) {
            var params = {
                data: data,
                cost: data.price,
                shipping_checkbox: shipping_checkbox,
                co: base.getCountryCode()
            };

            $.post(aino_params.wc_change_rate, params, function (response) {
                
                var response = JSON.parse(response);

                if(response.order_total){
                    $('.order-total strong .woocommerce-Price-amount').replaceWith(response.order_total);
                    $('.order-total small .woocommerce-Price-amount').replaceWith(response.order_tax);
                }
            });
        };

        base.getData = function () {
            var data = $('#widgetContainer').allInOne("GetData");
            base.displayData(data);
        };

        base.getDataInline = function () {
            var data = $('#widgetContainer').allInOne("GetData");
            var shipping_checkbox = base.getShippingId(data.shippingId);

            base.changeCost(data, shipping_checkbox);

            base.displayDataInline(data);
        };

        base.getStandartData = function () {
            var data = typeof (Cookies.get('aio_data')) !== 'undefined' && base.isJson(Cookies.get('aio_data')) ?
                                                    JSON.parse(Cookies.get('aio_data')) : {deliveryDetails: {type: {}}};

            $('.vc-aio-op-select, .vc-aio-st-textarea, .vc-aio-st-hidden').each(function (i, el) {
                var select = $(el);
                data.deliveryDetails[select.attr('data-cname')] = select.val();
            });

            return data;
        };

        base.cleanStandartCookies = function () {
            var data = {deliveryDetails: {type: {}}};

            $('.vc-aio-op-select, .vc-aio-st-textarea, .vc-aio-st-hidden').each(function (i, el) {
                var select = $(el);
                data.deliveryDetails[select.attr('data-cname')] = select.val();
            });

            Cookies.set('aio_data', JSON.stringify(data));
        };

        base.getPostcode = function (defaults) {
            if (typeof (defaults.deliveryDetails) !== 'undefined' && typeof (defaults.deliveryDetails.postcode) !== 'undefined'
                    && defaults.deliveryDetails.postcode !== '') {
                return defaults.deliveryDetails.postcode;
            } else {
                return $('[name="ship_to_different_address"]').is(':checked') && $('#shipping_postcode').val() !== '' ?
                        $('#shipping_postcode').val() :
                        $('#billing_postcode').val();
            }
        };

        base.getCountryCode = function (defaults) {
            if (typeof (defaults) !== 'undefined' && typeof (defaults.deliveryDetails) !== 'undefined' && typeof (defaults.deliveryDetails.country) !== 'undefined'
                    && defaults.deliveryDetails.country !== '') {
                return defaults.deliveryDetails.country;
            } else {
                return $('[name="ship_to_different_address"]').is(':checked') && $('#shipping_country').val() !== '' ?
                        $('#shipping_country').val() :
                        $('#billing_country').val();
            }
        };

        base.getStreetAddress = function (defaults) {
            if (typeof (defaults.deliveryDetails) !== 'undefined' && typeof (defaults.deliveryDetails.country) !== 'undefined'
                    && defaults.deliveryDetails.country !== '') {
                return defaults.deliveryDetails.country;
            } else {
                return $('[name="ship_to_different_address"]').is(':checked') && $('#shipping_address_1').val() !== '' ?
                        $('#shipping_address_1').val() :
                        $('#billing_address_1').val();
            }
        };

        base.displayData = function (data) {
            var shipping_checkbox = base.getShippingId(data.shippingId);
            data['vc_aio_id'] = shipping_checkbox;
            Cookies.set('aio_data', JSON.stringify(data));

            $('[value*="' + shipping_checkbox + '"]').prop('checked', true);
            $('body').trigger('update_checkout');
        };

        base.displayDataInline = function (data) {
            Cookies.set('aio_data', JSON.stringify(data));

            $('.vc-aio-chekout-options').remove();
            var options_html = '<div class="vc-aio-chekout-options">';
            for (var i in data['deliveryDetails']) {
                if (data[i] !== '') {
                    options_html += '<input type="hidden" name="vc_aio_options[' + i + ']" value="' + data['deliveryDetails'][i] + '" />';
                }
            }
            if( data["shippingId"] == "mailboxDelivery" ) {
                options_html += '<input id="mailbox_delivery_type" type="hidden" name="mailbox_delivery_type" value=""/>';
            }
            options_html += '</div>';

            var shipping_checkbox = base.getShippingId(data.shippingId);
            $('[value*="' + shipping_checkbox + '"]').prop('checked', true).after(options_html);

            var defaultDeliveryTypeChecked = $('.mailbox-delivery-type')[0];
            base.getMailboxDeliveryType();
            $(defaultDeliveryTypeChecked).trigger('click');
        };

        base.getMailboxDeliveryType = function() {
            var mailboxDeliveryTypeBox = $('.mailbox-delivery-type'),
                mailboxDeliveryTypeHiddenInput = $('#mailbox_delivery_type');

            mailboxDeliveryTypeBox.click(function(target) {
                var targetBoxValue = target.currentTarget.value;
                mailboxDeliveryTypeHiddenInput.attr('value', targetBoxValue);
            });
        };

        base.getShippingId = function (widgetTab) {
            for (var i in aino_params.methods_map) {
                if ($('[value*="' + i + '"]').length > 0
                        && aino_params.methods_map[i] === widgetTab) {
                    return i;
                }
            }
        };

        base.getShippingInstanceNumber = function (widgetTab) {
            for (var i in aino_params.methods_map) {
                if ($('[value*="' + i + '"]').length > 0
                        && aino_params.methods_map[i] === widgetTab) {
                    return $('[value*="' + i + '"]').split(':')[1];
                }
            }
        };

        base.getWidgetDefaults = function () {

            var data = typeof (Cookies.get('aio_data')) !== 'undefined' && base.isJson(Cookies.get('aio_data')) ?
                            JSON.parse(Cookies.get('aio_data')) : {};

            if ($('[value*="vconnect_postnord"]:checked').length > 0) {
                var selectedMethod = $('ul#shipping_method li .shipping_method:checked').attr('value').split(':');
            } else if ($('[value*="vconnect_postnord"]').attr('type') === 'hidden') {
                var selectedMethod = $('[value*="vconnect_postnord"]').attr('value').split(':');
            }

            data.shippingId = aino_params.methods_map[selectedMethod[0]];

            return data;
        };

        base.isJson = function (item) {
            item = typeof item !== "string"
                    ? JSON.stringify(item)
                    : item;

            try {
                item = JSON.parse(item);
            } catch (e) {
                return false;
            }

            if (typeof item === "object" && item !== null) {
                return true;
            }

            return false;
        };

        base.init();
    };

    $.vcAinoWp.defaultOptions = {
        target: ".shop_table"
    };

    $.fn.vcAinoWp = function (target, options) {
        return this.each(function () {
            (new $.vcAinoWp(this, target, options));
        });
    };

    $(document).ready(function () {
        $('body').vcAinoWp();

    });
})(jQuery);

