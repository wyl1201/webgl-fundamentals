import { createProgram } from '../../utils/program'
import { createShader } from '../../utils/shader'
import webglUtils from '../../utils/webgl-utils'
import m3 from '../../utils/m3'
import webglLessonsUI from '../../utils/webgl-lessons-ui'
import '../../styles/index.css'
import '../../styles/webgl-tutorials.css'
import './index.css'

const canvas = document.querySelector('#canvas')

/**
 * @type {WebGL2RenderingContext} gl 渲染上下文
 */
const gl = canvas.getContext('webgl')

// 创建着色器
const vertexShaderSource =
  document.querySelector('#vertex-shader-2d').textContent
const fragmentShaderSource = document.querySelector(
  '#fragment-shader-2d'
).textContent
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
// const positions = [0, 0, 0, 0.5, 0.7, 0]
const positions = [0, -100, 150, 125, -175, 100]
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

// 将缓冲区数据读取到 GPU 中
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(positionAttributeLocation)

// 矩阵变化初始值
const translation = [200, 150]
let angleInRadians = 0
const scale = [1, 1]

// lookup uniforms
const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

// 执行着色器程序完成绘制
drawScene()

function drawScene() {
  console.log(`--draw--`)
  // 调整画布（canvas）的尺寸以匹配它的显示尺寸
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // 计算变化矩阵
  let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
  matrix = m3.translate(matrix, translation[0], translation[1])
  matrix = m3.rotate(matrix, angleInRadians)
  matrix = m3.scale(matrix, scale[0], scale[1])
  // set matrixLocation
  gl.uniformMatrix3fv(matrixLocation, false, matrix)
  // 清空画布
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const primitiveType = gl.TRIANGLES
  const offset = 0
  const count = positions.length / 2
  gl.drawArrays(primitiveType, offset, count)
}

// Setup a ui.
webglLessonsUI.setupSlider('#x', {
  value: translation[0],
  slide: updatePosition(0),
  max: gl.canvas.width,
})
webglLessonsUI.setupSlider('#y', {
  value: translation[1],
  slide: updatePosition(1),
  max: gl.canvas.height,
})
webglLessonsUI.setupSlider('#angle', {
  slide: updateAngle,
  max: 360,
})
webglLessonsUI.setupSlider('#scaleX', {
  value: scale[0],
  slide: updateScale(0),
  min: -5,
  max: 5,
  step: 0.01,
  precision: 2,
})
webglLessonsUI.setupSlider('#scaleY', {
  value: scale[1],
  slide: updateScale(1),
  min: -5,
  max: 5,
  step: 0.01,
  precision: 2,
})

function updatePosition(index) {
  return function (event, ui) {
    translation[index] = ui.value
    drawScene()
  }
}

function updateAngle(event, ui) {
  const angleInDegrees = 360 - ui.value
  angleInRadians = (angleInDegrees * Math.PI) / 180
  drawScene()
}

function updateScale(index) {
  return function (event, ui) {
    scale[index] = ui.value
    drawScene()
  }
}
