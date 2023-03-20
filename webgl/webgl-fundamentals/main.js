import { createProgram } from '../../utils/program'
import { createShader } from '../../utils/shader'
import webglUtils from '../../utils/webgl-utils'

const canvas = document.querySelector('#canvas')

/**
 * @type {WebGL2RenderingContext} gl 渲染上下文
 */
const gl = canvas.getContext('webgl')

const vertexShaderSource =
  document.querySelector('#vertex-shader-2d').textContent
const fragmentShaderSource = document.querySelector(
  '#fragment-shader-2d'
).textContent

// 创建着色器
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(
  gl,
  gl.FRAGMENT_SHADER,
  fragmentShaderSource
)

// 创建着色程序
const program = createProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program)

// 将数据存入缓冲区
const positions = [0, 0, 0, 0.5, 0.7, 0]
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// 将缓冲区数据读取到 GPU 中
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionAttributeLocation)

// 执行着色器程序完成绘制
// 调整画布（canvas）的尺寸以匹配它的显示尺寸
webglUtils.resizeCanvasToDisplaySize(gl.canvas)
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
// 清空画布
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
const primitiveType = gl.TRIANGLES
const offset = 0
const count = positions.length / 2
gl.drawArrays(primitiveType, offset, count)
