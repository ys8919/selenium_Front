import apiUrl from './Global.js'
Vue.use(apiUrl);
var vmAdminIndex = new Vue({
    el: '#adminIndex',
    data:{
        userName:'',
        userJurisdiction:'',

        query:'',
    },
    created(){
        this.userNameList();
    },mounted(){
        //this.VerifyLogin();//登录验证
        this.userNameList();
    },
    methods: {
        userNameList:function () {
            this.userName='admin';
            //this.userName= sessionStorage.getItem('username')
            //this.userJurisdiction=parseInt(sessionStorage.getItem('jction'))
            console.log(this.userJurisdiction===2)
            var $ = layui.$;
            var that=this;
            this.$nextTick(function () {
                window.layui.use(['table','element'], function(){
                    var table = layui.table;
                    var element = window.layui.element;
                    element.init();
                    element.on('nav(filter)', function(elem){
                        //that.VerifyLogin();//登录验证
                        $("#iframeMain").attr("src",elem.attr("href"));
                    });
                    element.on('nav(filter1)', function(elem){
                        if(elem.attr("href")!=="javascript:;"){
                            //that.VerifyLogin();//登录验证
                            $("#iframeMain").attr("src",elem.attr("href"));
                        }

                    });
                    //第一个实例


                });
            });

        },
        Logout:function () {
            layer.msg('暂未开放');
            /*axios.post(apiUrl.apiUrl+'/user/logout',
                {
                }, {
                    headers: {
                        token:sessionStorage.getItem('token') ||'',
                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                    },
                    'Content-Type':'application/json'
                });
            //sessionStorage.clear()
            //window.location.href='/product-promotion_Front/login.html';*/

        }


    }

});

window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();
    element.on('nav(bigData)',function (elem) {
        console.log(elem);
    });
});
