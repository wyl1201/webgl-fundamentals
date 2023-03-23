import { instrumentGLContext } from '@luma.gl/gltools'
import { Buffer, clear } from '@luma.gl/webgl'
import { Model } from '@luma.gl/engine'
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

instrumentGLContext(gl)

const vertexSource = document.getElementById('vertex-shader-2d').textContent
const fragmentSource = document.getElementById('fragment-shader-2d').textContent

// create a buffer for the positions
const positionBuffer = new Buffer(
  gl,
  new Float32Array([
    -150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100,
  ])
)

// create a buffer for the colors
const colorBuffer = new Buffer(
  gl,
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
  ])
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

  const model = new Model(gl, {
    id: 'webgl-how-it-works',
    vs: vertexSource,
    fs: fragmentSource,
    attributes: {
      a_position: positionBuffer,
      a_color: colorBuffer,
    },
    vertexCount: 6,
    drawMode: gl.TRIANGLES,
  })

  // 计算变化矩阵
  let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight)
  matrix = m3.translate(matrix, translation[0], translation[1])
  matrix = m3.rotate(matrix, angleInRadians)
  matrix = m3.scale(matrix, scale[0], scale[1])
  // set matrixLocation and draw
  model.setUniforms({ u_matrix: matrix })
  // 清空花布
  clear(gl, { color: [0, 0, 0, 0] })
  // 绘制几何图形
  model.draw()
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
