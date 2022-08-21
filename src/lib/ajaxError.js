import tracker from "../utils/tracker";
import axios from 'axios'
import throttling from "../utils/throttling";
var timeCnt=0;
export  function injectXHR()
{
    let startTime;
    let XMLHttpRequest=window.XMLHttpRequest;
    let oldOpen=XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open=function(method,url,async)
    {
        this.logData={method,url,async};

        return oldOpen.apply(this,arguments)
    }
    let oldSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send=function(body)
    {
        if(this.logData)
        {
            startTime=Date.now();
            let handler=(type)=>(event)=>{
                let duration=Date.now()-startTime;
                let status=this.statusText;
                let statusText=this.statusText;
               let log={
                    kind:'stability',
                    type:'xhr',
                    eventType:event.type,//load error abort
                    pathname:this.logData.url,//请求路径
                    status:status+'-'+statusText,//状态码
                    duration,//持续时间
                    response:this.response?JSON.stringify(this.response):'',//响应体
                    params:body||''
                }
                if(timeCnt==0)
                {
                    timeCnt++;
                     axios.post('http://43.138.126.219:8000/api/ajaxstatus/new',log).then(res=>{
                    console.log(res);
                     })
                }
               
            }
            this.addEventListener('load',handler('load'),false);
            this.addEventListener('error',handler('error'),false);
            this.addEventListener('abort',handler('abort'),false);

        }
        return oldSend.apply(this,arguments)
    }
}