import webglUtils from '../../utils/webgl-utils'
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

// look up vertex data need to go
const positionLocation = gl.getAttribLocation(program, 'a_position')

// look up uniforms
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
const rotationUniformLocation = gl.getUniformLocation(program, 'u_rotation')
const translationUniformLocation = gl.getUniformLocation(
  program,
  'u_translation'
)
const colorUniformLocation = gl.getUniformLocation(program, 'u_color')

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setGeometry(gl)

const translation = [0, 0]
const rotation = [0, 1]
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
  gl.uniform2fv(rotationUniformLocation, rotation)
  gl.uniform2fv(translationUniformLocation, translation)
  gl.uniform4fv(colorUniformLocation, color)

  // 绘制
  const primitiveType = gl.TRIANGLES
  const count = 18 // 6 triangles in the 'F', 3 points per triangle
  gl.drawArrays(primitiveType, 0, count)
}

function updatePosition(index) {
  return function (event, ui) {
    translation[index] = ui.value
    drawScene()
  }
}

function updateAngle(event, ui) {
  var angleInDegrees = 360 - ui.value
  var angleInRadians = (angleInDegrees * Math.PI) / 180
  rotation[0] = Math.sin(angleInRadians)
  rotation[1] = Math.cos(angleInRadians)
  drawScene()
}

function setRectangle(gl, x, y) {
  const width = 100
  const height = 30
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  )
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
