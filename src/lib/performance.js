export default function (report) {
  /**
   * 列举出性能指标对应的 entry type
   * fp,fcp --> paint
   * lcp --> largest-contentful-paint
   * fip --> first-input
   */
  // 3. 封装成一个 monitor
    const name = "performance";
    const entryTypes = ["paint", "largest-contentful-paint", "first-input"];
    function start() {
      const p = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          report({ name, data: entry },'performance');
        }
      });
      p.observe({ entryTypes });
    }
    return { name, start };
}
