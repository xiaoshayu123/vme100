
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector';
import axios from 'axios'
export function injectJsError()
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
        }
axios.post('http://43.138.126.219:8000/api/jserror/new',log).then(res=>{
        console.log(res);
            }) 
        
    
   },true);
   
   window.addEventListener('unhandledrejection',function(event){
    console.log(event);
    let log={
        filename:'',
        line:0,
        column:0,
    }
    let reason=event.reason;
    if(typeof reason==='string')
    {
        log.message=reason
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
    }  
          axios.post('http://43.138.126.219:8000/api/promiseerror/new',data).then(res=>{
        console.log(res);
            }) 
    
   
   },true)
}
