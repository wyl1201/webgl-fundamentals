/**
 *
 * @param {WebGLRenderingContext} gl 渲染上下文
 * @param {WebGLShader} vertexShader 顶点着色器
 * @param {WebGLShader} fragmentShader 片段着色器
 * @returns {WebGLProgram} webgl着色程序
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}
