export default function () {
    const name = "resource-error";

    function start() {
      window.addEventListener('error',e=>{
          //区分jsError
      const target = e.target || e.srcElement;
      if (!target) {
        return;
      }
      if (target instanceof HTMLElement) {
        let url;
        //区分link标签区分大小写
        if (target.tagName.toLocaleLowerCase() === "link") {
          url = target.getAttribute("href");
        } else {
          url = target.getAttribute("src");
        }
        report({name,data:{url}},'static')
      }
      },true)
    }
    return {name,start};
}
