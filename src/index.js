import {injectJsError} from './lib/jsError'
import {injectXHR} from './lib/ajaxError'
export function performance(){
    injectJsError()
    injectXHR()
    console.log("前端监控以就绪");

}