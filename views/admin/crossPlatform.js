import apiUrl from '../Global.js'
Vue.use(apiUrl);
var $ = layui.$;
var crossPlatform = new Vue({
    el: '#crossPlatform',
    data:{
        url:'',
        urlFormat:'',
        urlFormatInfo:[],
        vuser:'',
        impTime:'',
        loginMsg:'',
        crossPlatformData:'',

    },
    created(){
        //自动加载indexs方法
    },mounted(){
        this.$nextTick(function () {
            this.crossPlatform();

        })
    },
    methods: {
        crossPlatform:async function () {
            this.urlFormatInfo=apiUrl.urlFormatInfo
            var $ = layui.$;
            var that=this;
            //this.crossPlatformData=[{"browserName":"chrome","systemName":"win10","startTime":"1000 ms","endTime":"3082 ms","loadTime":"2082 ms"}]
            let loading
            this.$nextTick(function () {
                window.layui.use(['upload','element','form','laydate'], function(){
                    var upload = layui.upload;
                    //第一个实例
                    var laydate = layui.laydate;
                    var form=layui.form;
                    var form2=form;
                    form.render();
                    form.on('select(selectCompetition1)', function(data){
                        //console.log(data.value); //得到被选中的值
                        that.classify1=data.value
                        form.render();
                        //   console.log( that.classify1)
                        //  console.log( that.classifyInfo2)

                    });

                    laydate.render({
                        elem: '#times', //指定元素
                        type: 'time',
                        value: '00:00:00' //必须遵循format参数设定的格式
                    });
                });
            });


        },
        crossPlatformInfo:function(){
            let loading
            /*if(this.url!==""&&this.urlFormat!==""&&this.vuser!==""&&this.impTime!==""){*/
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                axios.post(apiUrl.apiUrl+'/WebScript/select',
                    {
                       /* url:this.url,
                        urlFormat:this.urlFormat,
                        //information:this.information,
                        vuser:this.vuser,
                        impTime:this.impTime,*/
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        this.crossPlatformData=response.data.data
                        console.log(this.crossPlatformData)
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            yes: function(index, layero) {
                                //location.reload();
                                layer.close(index);
                            },
                        });
                        console.log(response.data.data);
                    })
                    .catch(error => {
                        layer.close(loading);
                        layer.open({
                            title: '失败',
                            content:'服务器请求失败'
                        });
                    });
           /* }else{
                layer.open({
                    title: '提示',
                    content:'未填完信息'

                });
            }*/
        },
        crossPlatformStart:function(){
            let loading
            loading=layer.load(2, {
                shade: false,
                time: 60*1000
            });
            //console.log(user)
            axios.post(apiUrl.apiUrl+'/WebScript/start',
                {
                }, {
                    headers: {
                        token:sessionStorage.getItem('token') ||'',
                        //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                    },
                    'Content-Type':'application/json'  //如果写成contentType会报错
                })
                .then(response => {
                    layer.close(loading);
                    //this.crossPlatformData=response.data.data
                    console.log(this.crossPlatformData)
                    layer.open({
                        title: '提示',
                        content: response.data.msg,
                        yes: function(index, layero) {
                            //location.reload();
                            layer.close(index);
                        },
                    });
                    console.log(response.data.data);
                })
                .catch(error => {
                    layer.close(loading);
                    layer.open({
                        title: '失败',
                        content:'服务器请求失败'
                    });
                });

        },
        getTimeInfo:function(shijianchuo){
            shijianchuo = shijianchuo - 8 * 60 * 60 * 1000; //（本地时间）东八区减去8小时
            var time = new Date(shijianchuo);
             var y = time.getFullYear();
             var m = time.getMonth()+1;
             var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        },
        add0:function(m){
            return m<10?'0'+m:m
        }

    }

});
window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();

});



