import apiUrl from '../Global.js'
Vue.use(apiUrl);
var $ = layui.$;
var webLoadTest = new Vue({
    el: '#webLoadTest',
    data:{
        url:'',
        urlFormat:'',
        urlFormatInfo:[],
        vuser:'',
        impTime:'',
        loginMsg:'',
        webData:'',
        codeErrorResponseList:'',
        failResponseList:'',
        slowReponseList:'',

    },
    created(){
        //自动加载indexs方法
        //this.userInfo();
    },mounted(){
        this.$nextTick(function () {
            //自动加载indexs方法
            this.webLoadInfo();

        })
    },
    methods: {
        webLoadInfo:async function () {
            this.urlFormatInfo=apiUrl.urlFormatInfo
            var $ = layui.$;
            var that=this;

            let loading
            this.$nextTick(function () {

                window.layui.use(['upload','element','form','laydate',], function(){

                    var upload = layui.upload;
                    //第一个实例
                    var laydate = layui.laydate;
                    var form=layui.form;
                    form.render();
                    form.on('select(selectCompetition1)', function(data){
                        //console.log(data.value); //得到被选中的值
                        that.classify1=data.value
                        form.render();
                    });
                    laydate.render({
                        elem: '#times', //指定元素
                        type: 'time',
                        value: '00:00:00' //必须遵循format参数设定的格式
                    });
                    var element = layui.element;

                });
            });

        },
        webLoadTestInfo:function(){
            let loading
            var table = layui.table;
            if(this.url!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/webLoad/webLoadTest',
                    {
                        url:this.url,
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        this.webData= response.data.data.firstScreenPerformance
                        this.codeErrorResponseList=response.data.data.firstScreenPerformance.pageErrorsDTO.codeErrorResponseList
                        this.failResponseList=response.data.data.firstScreenPerformance.pageErrorsDTO.failResponseList
                        this.slowReponseList=response.data.data.firstScreenPerformance.pageErrorsDTO.slowReponseList
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            /*yes: function(index, layero) {
                                location.reload();
                                layer.close(index);
                            },*/
                        });
                        console.log(this.webData);
                        console.log(this.slowReponseList.length);
                    })
                    .catch(error => {
                        console.log(error)
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
            }else{
                layer.open({
                    title: '提示',
                    content:'未填完信息'

                });
            }
        },


    }

});


window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();

});

