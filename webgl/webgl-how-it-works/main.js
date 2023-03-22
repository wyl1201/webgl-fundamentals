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

// 创建着色程序
const program = webglUtils.createProgramFromScripts(gl, [
  'vertex-shader-2d',
  'fragment-shader-2d',
])

// look up where vertex data need to go
const positionLocation = gl.getAttribLocation(program, 'a_position')
const colorLocation = gl.getAttribLocation(program, 'a_color')

// look up uniforms
const matrixLocation = gl.getUniformLocation(program, 'u_matrix')

// create a buffer for the positions
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100,
  ]),
  gl.STATIC_DRAW
)

// create a buffer for the colors
const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
    Math.random(),
    Math.random(),
    Math.random(),
    1,
  ]),
  gl.STATIC_DRAW
)

// 矩阵变化初始值
const translation = [200, 150]
let angleInRadians = 0
const scale = [1, 1]

// 执行着色器程序完成绘制
drawScene()

function drawScene() {
  console.log(`--draw--`)
  // 调整画布（canvas）的尺寸以匹配它的显示尺寸
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  // 清空画布
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // tell ir to use our program  (pair of shaders)
  gl.useProgram(program)

  // 激活位置属性
  gl.enableVertexAttribArray(positionLocation)
  // 绑定位置缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据
  let size = 2,
    type = gl.FLOAT,
    normalize = false,
    stride = 0,
    offset = 0
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  // 激活颜色属性
  gl.enableVertexAttribArray(colorLocation)
  // 绑定颜色缓存
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  // 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取颜色数据
  gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0)

  // 计算变化矩阵
  let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
  matrix = m3.translate(matrix, translation[0], translation[1])
  matrix = m3.rotate(matrix, angleInRadians)
  matrix = m3.scale(matrix, scale[0], scale[1])
  // set matrixLocation
  gl.uniformMatrix3fv(matrixLocation, false, matrix)

  // 绘制集合图形
  const primitiveType = gl.TRIANGLES
  const count = 6
  gl.drawArrays(primitiveType, 0, count)
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
