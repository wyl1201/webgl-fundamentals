/**
 *
 * @param {WebGL2RenderingContext} gl 渲染上下文
 * @param {GLenum} type 着色器类型
 * @param {string} source 数据源
 * @returns {WebGLShader} 着色器
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type) // 创建着色器对象
  gl.shaderSource(shader, source) // 提供数据源
  gl.compileShader(shader) // 编译 -> 生成着色器
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}
