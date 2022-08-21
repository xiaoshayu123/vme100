import axios from 'axios';

let lastEvent;
['click','touchstart','mousedown','keydown','mouseover'].forEach(eventType=>{
    document.addEventListener(eventType,event=>{
        lastEvent=event;
    },{
        capture:true,//捕获阶段触发
        passive:true//默认不阻止默认事件
    });
});

function getLastEvent()
{
    return lastEvent
}

function getSelector(target)
{
    if(typeof target =='undefined')return '';
    let result=target.path.reverse().slice(2).map(element=>{
           if(element.id)
           {
            return `${element.tagName.toLowerCase()}#${element.id}`
           }else if(element.className &&typeof element.className==='string')
           {
            return `${element.tagName.toLowerCase()}.${element.className}`
           }else
           {
            return `${element.nodeName.toLowerCase()}`
           }
    }).join(' ');
    return result
}

function injectJsError()
{
    //监听全局未捕获的错误
   window.addEventListener('error',error=>{
    console.log('error',error);
        let log={
            kind:'stability',//监控指标大类
            type:'error',//小类型 这是一个错误
            errorType:'jsError',//JS执行错误
            message:error.message,//报错信息
            filename:error.filename,//文件名字
            //报错信息
            line:error.lineno,
            column:error.colno,
            position:`${error.lineno}行 ${error.colno}列`,//报错位置
            stack:error.error.stack.split('\n').slice(1).map(item=>item.replace(/^\s+at\s+/g,'')).join(' ^ '),
            seletor:getSelector(getLastEvent())
        };
axios.post('http://43.138.126.219:8000/api/jserror/new',log).then(res=>{
        console.log(res);
            }); 
        
    
   },true);
   
   window.addEventListener('unhandledrejection',function(event){
    console.log(event);
    let log={
        filename:'',
        line:0,
        column:0,
    };
    let reason=event.reason;
    if(typeof reason==='string')
    {
        log.message=reason;
    }else if(typeof reason==='object')
    {
        if(reason.stack)
        {
            let matchResult=reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
            log.filename=matchResult[1];
            log.line=matchResult[2];
            log.column=matchResult[3];
        }
    }
    let data={
        kind:'stability',//监控指标大类
        type:'error',//小类型 这是一个错误
        errorType:'promiseError',//promise异步任务错误
        message:event.reason.message,//报错信息
        position:`${log.line}行 ${log.column}列`,//报错位置
        stack:event.reason.stack.split('\n').slice(1).map(item=>item.replace(/^\s+at\s+/g,"")).join(' ^ '),
        seletor:getSelector(getLastEvent()),
        ...log
    };  
          axios.post('http://43.138.126.219:8000/api/promiseerror/new',data).then(res=>{
        console.log(res);
            }); 
    
   
   },true);
}

class SendTracker{
    constructor()
    {
        this.url='';
        this.xhr=new XMLHttpRequest;
    }
    send(data={}){
        console.log(data);
    }
}

new SendTracker();

var timeCnt=0;
function injectXHR()
{
    let startTime;
    let XMLHttpRequest=window.XMLHttpRequest;
    let oldOpen=XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open=function(method,url,async)
    {
        this.logData={method,url,async};

        return oldOpen.apply(this,arguments)
    };
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
                };
                if(timeCnt==0)
                {
                    timeCnt++;
                     axios.post('http://43.138.126.219:8000/api/ajaxstatus/new',log).then(res=>{
                    console.log(res);
                     });
                }
               
            };
            this.addEventListener('load',handler(),false);
            this.addEventListener('error',handler(),false);
            this.addEventListener('abort',handler(),false);

        }
        return oldSend.apply(this,arguments)
    };
}

function performance(){
    injectJsError();
    injectXHR();
    console.log("前端监控以就绪");

}

export { performance };
