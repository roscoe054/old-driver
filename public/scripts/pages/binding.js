Zepto(function($) {
    var openId = location.search.split('?')[1].split('=')[1]

    getBindState(function(resData){
        if(resData.success){
            $('.bind-succeed').removeClass('hidden')
        } else{
            $('.form').removeClass('hidden')
        }
    })

    $(".btn-submit").click(function(e) {
        e.preventDefault()
        submitBind({
            name: $('.form-name').val(),
            telephone: $('.form-phone').val(),
            openId: openId
        }, function(resData){
            if(resData.success){
                $('.form').addClass('hidden')
                $('.bind-succeed').removeClass('hidden')
            } else {
                alert('未绑定成功，请稍后再试...')
            }
        })
    })

    function submitBind(formData, callback) {
        ajax('POST', '/api/binding/bind', formData, callback)
    }

    function getBindState(callback) {
        ajax('GET', '/api/binding/state', {openId: openId}, callback)
    }

    function ajax(method, url, data, callback) {
        $.ajax({
            type: method,
            url: url,
            data: method === 'POST' ? JSON.stringify(data) : data,
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
