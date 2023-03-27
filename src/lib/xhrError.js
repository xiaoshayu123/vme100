

function hookMethod(obj,key,hookFunc){
return (...params)=>{
  obj[key]=hookFunc(obj[key],...params);
}
}
export function createXhrMonitor(report) {
  const name = "xhr-error";
  let XMLHttpRequest=window.XMLHttpRequest.prototype;
  function start() {
    hookMethod(XMLHttpRequest.prototype, 'open', (origin) =>
    function (this, method, url) {
      this.payload = {
        method,
        url,
      };
      origin.apply(this, [method, url]);
    }
  )();
  hookMethod(XMLHttpRequest.prototype, 'send', (origin) =>
  function (this, ...params) {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status >= 400) {
        this.payload.status = this.status;
        report({ name, data: this.payload },'xhr');
      }
    });
    origin.apply(this, ...params);
  }
)();
  }
  return { name, start }
}