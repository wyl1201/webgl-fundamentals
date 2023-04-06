/**
 * Creates and links a WebGL shader program.
 *
 * @param {WebGLRenderingContext} gl - The rendering context.
 * @param {WebGLShader} vertexShader - The vertex shader.
 * @param {WebGLShader} fragmentShader - The fragment shader.
 * @returns {WebGLProgram} - The linked shader program.
 * @throws {Error} - If program linking fails.
 */

export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMsg = `An error occurred while linking the shader program:\n${gl.getProgramInfoLog(
      program
    )}`
    gl.deleteProgram(program)
    throw new Error(errorMsg)
  }

  return program
}
