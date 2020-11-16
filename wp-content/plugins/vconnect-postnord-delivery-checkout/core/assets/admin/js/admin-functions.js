(function ($) {

    $(document).on('click', 'a.vc-add-rate', function () {
        var id = $(this).attr('data-id');
        var size = $('#' + id + '_rates tbody .vc_rate').length;
        $(vcGetShippingRowContent(id, size)).appendTo('#' + id + '_rates table tbody');

        return false;
    });

    // Remove row
    $(document).on('click', 'a.vc-remove-rate', function () {
        var id = $(this).attr('data-id');
        var answer = confirm('Delete the selected rates?')
        if (answer) {
            $('#' + id + '_rates table tbody tr th.check-column input:checked').each(function (i, el) {
                $(el).closest('tr').remove();
            });
        }
        return false;
    });

    $(document).on('change', '#vc_aino_use_maps', function () {
        if($(this).is(":checked")) {
            $('#vc_aino_gmaps_key').attr('disabled', false);
        } else {
            $('#vc_aino_gmaps_key').attr('disabled', true);
        }
    });

    /**
     * Comment
     */
    function vcGetShippingRowContent(id, size) {
        var html = '<tr class="vc_rate">\
            <th class="check-column vc-check-column"><input type="checkbox" name="select" /></th>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + size + '][weight_min]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + size + '][weight_max]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + size + '][total_from]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + size + '][total_to]" placeholder="0.00" size="4" /></td>\
            <td><input type="text" name="woocommerce_' + id + '_rates][' + size + '][cost]" placeholder="0.00" size="4" /></td>\
        </tr>';

        return html;
    }

    $(document).on('click', 'a.add-type-rate', function () {
        var id = $(this).attr('data-id');
        var size = guid();
        var type = $(this).attr('data-type');
        console.log(id);
        $(vcGetShippingTypeRowContent(id, size, type)).appendTo($(this).closest('table').find('tbody'));

        return false;
    });

    // Remove type row
    $(document).on('click', 'a.remove-type-rate', function () {
        var answer = confirm('Delete the selected rates?')
        if (answer) {
            $(this).closest('table').find('tbody').find('th.check-column input:checked').each(function (i, el) {
                $(el).closest('tr').remove();
            });
        }
        return false;
    });



    /**
     * Comment
     */
    function vcGetShippingTypeRowContent(id, size, type) {
        var html = '<tr class="vc_rate">\
            <th class="check-column vc-check-column"><input type="checkbox" name="select" /></th>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + type + '][' + size + '][weight_min]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + type + '][' + size + '][weight_max]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + type + '][' + size + '][total_from]" placeholder="0.00" size="4" /></td>\
            <td><input type="number" step="any" min="0" name="woocommerce_' + id + '_rates][' + type + '][' + size + '][total_to]" placeholder="0.00" size="4" /></td>\
            <td><input type="text" name="woocommerce_' + id + '_rates][' + type + '][' + size + '][cost]" placeholder="0.00" size="4" /></td>\
            </tr>';

        return html;
    }


    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
    }

})(jQuery);