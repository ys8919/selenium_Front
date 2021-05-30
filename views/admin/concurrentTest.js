import apiUrl from '../Global.js'
Vue.use(apiUrl);
var $ = layui.$;
var concurrentTest = new Vue({
    el: '#concurrentTest',
    data:{
        url:'',
        urlFormat:'',
        urlFormatInfo:[],
        vUser:'',
        vBody:'',
        vSuccess:'',
        impTime:'',
        loginMsg:'',
        echartDataY:[],
        echartDataN:[],
        echartDataTime:[],
        responseTime:[],
        responseTimeX:[],
        countTime:'',
        successResponse:'',
        failResponse:'',

    },
    created(){
        //自动加载indexs方法

    },mounted(){
        this.$nextTick(function () {
            //自动加载indexs方法
            this.concurrentTest();
        })
    },
    methods: {
        concurrentTest:async function () {
            this.urlFormatInfo=apiUrl.urlFormatInfo
            var $ = layui.$;
            var that=this;

            let loading
           this.$nextTick(function () {

                window.layui.use(['upload','element','form','laydate'], function(){
                    var upload = layui.upload;
                    //第一个实例
                    var laydate = layui.laydate;
                    var form=layui.form;
                    form.render();
                    form.on('select(selectCompetition1)', function(data){
                        //console.log(data.value); //得到被选中的值
                        that.urlFormat=data.value
                        form.render();
                    });
                    laydate.render({
                        elem: '#times', //指定元素
                        type: 'time',
                        //value: '00:00:00' //必须遵循format参数设定的格式
                        min: '00:00:00',
                        trigger: 'click',
                        done: function(value, date, endDate){
                            that.impTime=value
                        },
                    });
                });
            });

        },
        concurrentInfo:function(){
            let loading
            if(this.url!==""&&this.urlFormat!==""&&this.vUser!==""&&this.impTime!==""){
                loading=layer.load(2, {
                    shade: false,
                    time: 60*1000
                });
                //console.log(user)
                this.countTime='测试中，请稍等。。。。'
                axios.post(apiUrl.apiUrl+'/concurrentTest/start',
                    {
                        url:this.url,
                        urlFormat:this.urlFormat,
                        vuser:this.vUser,
                        vSuccess:this.vSuccess,
                        vBody:this.vBody,
                        impTime:this.impTime,
                    }, {
                        headers: {
                            token:sessionStorage.getItem('token') ||'',
                            //jurisdiction:sessionStorage.getItem('jurisdiction') ||''
                        },
                        'Content-Type':'application/json'  //如果写成contentType会报错
                    })
                    .then(response => {
                        layer.close(loading);
                        const currData= JSON.parse(JSON.stringify(response.data.data.successPer))
                        this.countTime=JSON.parse(JSON.stringify(response.data.data.countTime))+' ms'
                        this.successResponse=JSON.parse(JSON.stringify(response.data.data.successResponse))
                        this.failResponse=JSON.parse(JSON.stringify(response.data.data.failResponse))
                        this.responseTime=JSON.parse(JSON.stringify(response.data.data.responseTime))
                        for (let i = 0; i < this.responseTime.length; i++) {
                            this.responseTimeX[i]=i+1;
                        }
                        //console.log(currData)
                        this.echartDataTime[0]='00:00:00'
                        const timeStart=currData[0].time_d
                        for (let i = 0; i < currData.length; i++) {
                            //console.log(currData[i])
                            this.echartDataY[i]=currData[i].data.y
                            this.echartDataN[i]=currData[i].data.n
                            //this.echartDataTime.push('00:00:')
                            this.echartDataTime[i]=this.getTimeInfo(currData[i].time_d-timeStart)
                        }

                        var that=this
                        layer.open({
                            title: '提示',
                            content: response.data.msg,
                            yes: function(index, layero) {
                                //location.reload();
                                layer.close(index);
                                //调用图表
                                that.echart1()
                                that.echart2()
                            },
                        });
                        console.log(response.data);
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
        getTimeInfo:function(shijianchuo){
            shijianchuo = shijianchuo - 8 * 60 * 60 * 1000; //（本地时间）东八区减去8小时
            var time = new Date(shijianchuo);
            // var y = time.getFullYear();
            // var m = time.getMonth()+1;
            // var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);/*y+'-'+add0(m)+'-'+add0(d)+' '+*/
        },
        add0:function(m){
            return m<10?'0'+m:m
        },
        echart1:function (){
            var chartDom = document.getElementById('echartsMain');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: {
                    text: '请求数'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['成功请求', '失败请求']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.echartDataTime
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: [
                    {
                        name: '成功请求',
                        type: 'line',
                        data: this.echartDataY,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start',
                                        formatter: '最大值'
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }
                    },
                    {
                        name: '失败请求',
                        type: 'line',
                        data: this.echartDataN,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }

                    }
                ]
            };

            option && myChart.setOption(option);
        },
        echart2:function (){
            var chartDom = document.getElementById('echartsMain2');
            var myChart = echarts.init(chartDom);
            var option;
            option = {
                title: {
                    text: '请求响应时间'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['请求响应时间，单位：ms']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data:this.responseTimeX
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}ms'
                    }
                },
                series: [
                    {
                        name: '响应时间',
                        type: 'line',
                        data: this.responseTime,
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start',
                                        formatter: '最大值'
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }
                    }
                ]
            };

            option && myChart.setOption(option);
        }

    }

});



window.layui.use('element', function(){
    var element =  window.layui.element;
    element.init();

});
