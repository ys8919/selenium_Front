
//线上接口地址
//const apiUrl='http://192.168.1.106:8080';
//const apiUrl='http://134.175.222.24:8888';
const apiUrl='http://127.0.0.1:8080/Selenium';
const urlFormatInfo=['GET','POST','PUT ','DELETE']
function formatInfo (res) {
    var info
    switch (res) {
        case 1:
            info=format[1]
            break;
        case 2:
            info=format[2]
            break;
        case 3:
            info=format[3]
            break;
        case 4:
            info=format[4]
            break;
        case 5:
            info=format[5]
            break;
        case 6:
            info=format[6]
            break;
        case 7:
            info=format[7]
            break;
        default:
            info=format[0]
    }
    return info
}



export default{
    apiUrl,urlFormatInfo,
    install: function (Vue) {
        Vue.prototype.formatInfo= (res) => formatInfo(res);

    }

}
