(function (global, $) {
    $('#vc_aino_custom_styles').before('<div id="editor"></div>');
    
    var vc_aio_saving = false;
    
    if($('#editor').length>0){
        var editor = ace.edit("editor");
        editor.$blockScrolling = 'Infinity';
        editor.getSession().setMode("ace/mode/css");
        editor.setOptions({
            enableBasicAutocompletion: true
        });

        var textarea = $('#vc_aino_custom_styles');
        editor.getSession().setValue(textarea.val());
        editor.getSession().on('change', function () {
            textarea.val(editor.getSession().getValue());
            unsaved = true;
        });
    }
    
    $(window).bind('keydown', function (event) {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
                case 's':
                    event.preventDefault();
                    if(!vc_aio_saving){
                        saveAndStay();
                    }
                    break;
            }
        }
    });

    /**
     * save and stay
     */
    function saveAndStay(parameters) {
        var $form = $('#mainform');
        var button_val = $('.woocommerce-save-button').val();
        $('.woocommerce-save-button').val('Please wait...').attr('disabled', 'disabled');
        vc_aio_saving = true;
        $.post($form.attr('action'), $form.serialize(), function (data) {
            $('.form-table').before('<div class="vc-save-popup"><strong>Your settings has been saved.</strong></div>');
            $('.woocommerce-save-button').val(button_val).removeAttr('disabled');
            vc_aio_saving = false;
            
            $('.vc-save-popup').fadeIn(400).delay(1500).fadeOut(400, function () {
                $('.vc-save-popup').remove();
                
//                $('.ngm-save-and-stay').removeAttr('disabled');
            });

        });
        return false;
    }
    
    $('#mainform').submit(function (e) { // <--- event object 'e'
//        e.preventDefault();

        
    });
    
    
})(this, jQuery);