import webglUtils from '../../utils/webgl-utils'
import webglLessonsUI from '../../utils/webgl-lessons-ui'
import m3 from '../../utils/m3'
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

// look up vertex data need to go
const positionLocation = gl.getAttribLocation(program, 'a_position')

// look up uniforms
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setGeometry(gl)

const translation = [100, 150]
let angleInRadians = 0
const scale = [1, 1]
const color = [Math.random(), Math.random(), Math.random(), 1]

drawScene()

// Setup a ui.
webglLessonsUI.setupSlider('#x', {
  slide: updatePosition(0),
  max: gl.canvas.width,
})
webglLessonsUI.setupSlider('#y', {
  slide: updatePosition(1),
  max: gl.canvas.height,
})
webglLessonsUI.setupSlider('#angle', { slide: updateAngle, max: 360 })
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

function drawScene() {
  // 调整画布（canvas）的尺寸以匹配它的显示尺寸
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  // 设置适口， 告诉WebGL如何转化裁剪空间到像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  // 清空花布
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)

  gl.enableVertexAttribArray(positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  const size = 2
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  )

  // 设置全局变量
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)
  gl.uniform4fv(colorUniformLocation, color)

  // 计算矩阵
  const projectionMatrix = m3.projection(gl.canvas.width, gl.canvas.height)
  const translationMatrix = m3.translation(translation[0], translation[1])
  const rotationMatrix = m3.rotation(angleInRadians)
  const scaleMatrix = m3.scaling(scale[0], scale[1])

  // create identity matrix
  let matrix = m3.identity()

  // for (let i = 0; i < 5; i++) {
    // 矩阵相乘
    matrix = m3.multiply(matrix, projectionMatrix)
    matrix = m3.multiply(matrix, translationMatrix)
    matrix = m3.multiply(matrix, rotationMatrix)
    matrix = m3.multiply(matrix, scaleMatrix)
    // 设置矩阵
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix)

    // 绘制
    const primitiveType = gl.TRIANGLES
    const count = 18 // 6 triangles in the 'F', 3 points per triangle
    gl.drawArrays(primitiveType, 0, count)
  // }
}

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

// 在缓冲存储构成 'F' 的值
function setGeometry(gl) {
  const width = 100
  const height = 150
  const x = 0
  const y = 0
  const thickness = 30
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      x,
      y,
      x + thickness,
      y,
      x,
      y + height,
      x,
      y + height,
      x + thickness,
      y,
      x + thickness,
      y + height,

      // 上横
      x + thickness,
      y,
      x + width,
      y,
      x + thickness,
      y + thickness,
      x + thickness,
      y + thickness,
      x + width,
      y,
      x + width,
      y + thickness,

      // 中横
      x + thickness,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + thickness,
      y + thickness * 3,
      x + thickness,
      y + thickness * 3,
      x + (width * 2) / 3,
      y + thickness * 2,
      x + (width * 2) / 3,
      y + thickness * 3,
    ]),
    gl.STATIC_DRAW
  )
}
