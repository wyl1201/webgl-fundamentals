import webglUtils from '../../utils/webgl-utils'
import webglLessonsUI from '../../utils/webgl-lessons-ui'
import m4 from '../../utils/m4'
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
  'vertex-shader-3d',
  'fragment-shader-3d',
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

function radToDeg(r) {
  return (r * 180) / Math.PI
}

function degToRad(d) {
  return (d * Math.PI) / 180
}

const translation = [45, 150, 0]
const rotation = [degToRad(40), degToRad(25), degToRad(325)]
const scale = [1, 1, 1]
const color = [Math.random(), Math.random(), Math.random(), 1]

drawScene()

// Setup a ui.
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
webglLessonsUI.setupSlider('#z', {
  value: translation[2],
  slide: updatePosition(2),
  max: gl.canvas.height,
})
webglLessonsUI.setupSlider('#angleX', {
  value: radToDeg(rotation[0]),
  slide: updateRotation(0),
  max: 360,
})
webglLessonsUI.setupSlider('#angleY', {
  value: radToDeg(rotation[1]),
  slide: updateRotation(1),
  max: 360,
})
webglLessonsUI.setupSlider('#angleZ', {
  value: radToDeg(rotation[2]),
  slide: updateRotation(2),
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
webglLessonsUI.setupSlider('#scaleZ', {
  value: scale[2],
  slide: updateScale(2),
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
  const size = 3
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
  const matrix = m4.orthographic(
    gl.canvas.clientWidth,
    gl.canvas.clientHeight,
    400
  )
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
  matrix = m4.xRotate(matrix, rotation[0])
  matrix = m4.yRotate(matrix, rotation[1])
  matrix = m4.zRotate(matrix, rotation[2])
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2])
  // 设置矩阵
  gl.uniformMatrix3fv(matrixUniformLocation, false, matrix)

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

function updateRotation(index) {
  return function (event, ui) {
    var angleInDegrees = ui.value
    var angleInRadians = (angleInDegrees * Math.PI) / 180
    rotation[index] = angleInRadians
    drawScene()
  }
}

function updateScale(index) {
  return function (event, ui) {
    scale[index] = ui.value
    drawScene()
  }
}

// 在缓冲存储构成 'F' 的值
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // 左竖
      0, 0, 0, 30, 0, 0, 0, 150, 0, 0, 150, 0, 30, 0, 0, 30, 150, 0,

      // 上横
      30, 0, 0, 100, 0, 0, 30, 30, 0, 30, 30, 0, 100, 0, 0, 100, 30, 0,

      // 下横
      30, 60, 0, 67, 60, 0, 30, 90, 0, 30, 90, 0, 67, 60, 0, 67, 90, 0,
    ]),
    gl.STATIC_DRAW
  )
}
