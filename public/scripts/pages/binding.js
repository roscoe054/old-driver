Zepto(function($) {
    getBindState(function(resData){
        if(resData.state){
            $('.bind-succeed').removeClass('hidden')
        } else{
            $('.form').removeClass('hidden')
        }
    })

    $(".btn-submit").click(function(e) {
        e.preventDefault()
        submitBind({
            name: $('.form-name').val(),
            phone: $('.form-phone').val()
        }, function(resData){
            if(resData.state){
                $('.form').addClass('hidden')
                $('.bind-succeed').removeClass('hidden')
            }
        })
    })

    function submitBind(formData, callback) {
        ajax('POST', '/api/binding/bind', formData, callback)
    }

    function getBindState(callback) {
        ajax('GET', '/api/binding/state', {openid: 'hehehehe'}, callback)
    }

    function ajax(method, url, data, callback) {
        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function(res) {
                if(res.ret && res.data){
                    callback(res.data)
                } else{
                    alert('服务器出了点小问题...')
                }
            }
        })
    }
})
