// import {injectJsError} from './lib/jsError'
// import {injectXHR} from './lib/ajaxError'
// export function performance(){
//     injectJsError()
//     injectXHR()
//     console.log("前端监控以就绪");
// }

import jsErrorNew from "./lib/jsErrorNew";
import performance from "./lib/performance";
import staticResources from "./lib/staticResources";
import xhrError from './lib/xhrError';

export default class monitorSDK{
  constructor(url){
    this.url=url;
  }
   report(data,name) {
    // 注意：数据发送前需要先序列化为字符串
    navigator.sendBeacon(`${this.url}/${name}/new`, JSON.stringify(data));
  }
  start(){
   jsErrorNew().start();
   performance().start();
   staticResources().start();
   xhrError().start();
  }
}