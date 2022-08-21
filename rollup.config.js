
export default {
  input: './src/index.js', // 入口文件
  output: [
    {
      format: 'cjs', // 打包为commonjs格式
      file: 'dist/vme100.cjs.js', // 打包后的文件路径名称
      name: 'vme100' // 打包后的默认导出文件名称
    },
    {
      format: 'esm', // 打包为esm格式
      file: 'dist/vme100.esm.js',
      name: 'vme100'
    },
    {
      format: 'umd', // 打包为umd通用格式
      file: 'dist/vme100.umd.js',
      name: 'vme100',
      minifyInternalExports: true
    }
  ],
}
