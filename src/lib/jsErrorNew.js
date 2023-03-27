export default function(report){
    const name = "js-error";
    function start() {
      window.addEventListener("error", (e) => {
        // 只有 error 属性不为空的 ErrorEvent 才是一个合法的 js 错误
        if (e.error) {
          report({ name, data: { type: e.type, message: e.message } },'jserror');
        }
      });
      window.addEventListener("unhandledrejection", (e) => {
        report({ name, data: { type: e.type, reason: e.reason } },'jserror');
      });
    }
    return { name, start }
}