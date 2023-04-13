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
const colorLocation = gl.getAttribLocation(program, 'a_color')
// look up uniforms
const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix')

const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
setGeometry(gl)

const colorBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
setColors(gl)

function radToDeg(r) {
  return (r * 180) / Math.PI
}

function degToRad(d) {
  return (d * Math.PI) / 180
}

const translation = [-150, 0, -360]
const rotation = [degToRad(190), degToRad(40), degToRad(320)]
const scale = [1, 1, 1]
let fieldOfViewRadians = degToRad(60)

drawScene()

// Setup a ui.
webglLessonsUI.setupSlider("#fieldOfView", {
  value: radToDeg(fieldOfViewRadians),
  slide: updateFieldOfView,
  min: 1,
  max: 179
});
webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), min: -200, max: 200});
webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), min: -200, max: 200});
webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), min: -1000, max: 0});
webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
webglLessonsUI.setupSlider("#scaleX", {
  value: scale[0],
  slide: updateScale(0),
  min: -5,
  max: 5,
  step: 0.01,
  precision: 2
});
webglLessonsUI.setupSlider("#scaleY", {
  value: scale[1],
  slide: updateScale(1),
  min: -5,
  max: 5,
  step: 0.01,
  precision: 2
});
webglLessonsUI.setupSlider("#scaleZ", {
  value: scale[2],
  slide: updateScale(2),
  min: -5,
  max: 5,
  step: 0.01,
  precision: 2
});

function updateFieldOfView(event, ui) {
  fieldOfViewRadians = degToRad(ui.value)
  drawScene()
}

function updatePosition(index) {
  return function (event, ui) {
    translation[index] = ui.value
    drawScene()
  }
}

function updateRotation(index) {
  return function (event, ui) {
    const angleInDegrees = ui.value
    const angleInRadians = (angleInDegrees * Math.PI) / 180
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

function drawScene() {
  // 调整画布（canvas）的尺寸以匹配它的显示尺寸
  webglUtils.resizeCanvasToDisplaySize(gl.canvas)
  // 设置适口， 告诉WebGL如何转化裁剪空间到像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  // 清空花布
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  // 剔除背面三角形
  gl.enable(gl.CULL_FACE)

  // 启用深度缓冲区
  gl.enable(gl.DEPTH_TEST)

  gl.useProgram(program)

  gl.enableVertexAttribArray(positionLocation)
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

  gl.enableVertexAttribArray(colorLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0)

  // 计算矩阵
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 1
  const zFar = 2000
  let matrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
  matrix = m4.translate(matrix, translation[0], translation[1], translation[2])
  matrix = m4.xRotate(matrix, rotation[0])
  matrix = m4.yRotate(matrix, rotation[1])
  matrix = m4.zRotate(matrix, rotation[2])
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2])
  // 设置矩阵
  gl.uniformMatrix4fv(matrixUniformLocation, false, matrix)
  // 绘制
  const primitiveType = gl.TRIANGLES
  const count = 16 * 2 * 3 // 16个矩形, 一个矩形2个三角形, 3个顶点, 总共96个点
  gl.drawArrays(primitiveType, 0, count)
}

// 在缓冲存储构成 'F' 的值
function setGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // left column front
      0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

      // top rung front
      30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

      // middle rung front
      30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

      // left column back
      0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

      // top rung back
      30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

      // middle rung back
      30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

      // top
      0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

      // top rung right
      100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

      // under top rung
      30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

      // between top rung and middle
      30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

      // top of middle rung
      30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

      // right of middle rung
      67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

      // bottom of middle rung.
      30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

      // right of bottom
      30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

      // bottom
      0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

      // left side
      0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
    ]),
    gl.STATIC_DRAW
  )
}

// Fill the buffer with colors for the 'F'.
function setColors(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // left column front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // top rung front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // middle rung front
      200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200,
      70, 120,

      // left column back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // top rung back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // middle rung back
      80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70,
      200,

      // top
      70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70,
      200, 210,

      // top rung right
      200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200,
      200, 70,

      // under top rung
      210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,
      100, 70,

      // between top rung and middle
      210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210,
      160, 70,

      // top of middle rung
      70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70,
      180, 210,

      // right of middle rung
      100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100,
      70, 210,

      // bottom of middle rung.
      76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76,
      210, 100,

      // right of bottom
      140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140,
      210, 80,

      // bottom
      90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90,
      130, 110,

      // left side
      160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
      160, 160, 220,
    ]),
    gl.STATIC_DRAW
  )
}
