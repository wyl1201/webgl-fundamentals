import { createProgram } from '../../utils/program'
import { createShader } from '../../utils/shader'

const canvas = document.querySelector('#c')

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

// 


