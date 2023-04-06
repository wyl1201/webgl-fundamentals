/**
 * Compiles and returns a shader object.
 *
 * @param {WebGL2RenderingContext} gl - The rendering context.
 * @param {GLenum} type - The type of shader to be created.
 * @param {string} source - The shader source code.
 * @returns {WebGLShader} - The compiled shader object.
 * @throws {Error} - If shader compilation fails.
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errorMsg = `An error occurred while compiling the shader:\n${gl.getShaderInfoLog(shader)}`;
    gl.deleteShader(shader);
    throw new Error(errorMsg);
  }

  return shader;
}

