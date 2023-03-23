import './index.css'
import mapboxgl from 'mapbox-gl'
import { instrumentGLContext } from '@luma.gl/gltools'
import { Buffer } from '@luma.gl/webgl'
import { Model } from '@luma.gl/engine'

mapboxgl.accessToken =
  'pk.eyJ1Ijoid2FuZ25hbmZlbmciLCJhIjoiY2xmajluNnV6MDNtNTQybXd0cjJsenBsdyJ9.uMi4kuxcYRHx7HMbtdvEtw'
const map = new mapboxgl.Map({
  container: 'map',
  zoom: 3,
  center: [116.4199, 40.18994],
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: 'mapbox://styles/mapbox/light-v11',
  antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
  projection: 'mercator',
})

// create a custom style layer to implement the WebGL content
const highlightLayer = {
  id: 'highlight',
  type: 'custom',

  // method called when the layer is added to the map
  // https://docs.mapbox.com/mapbox-gl-js/api/#styleimageinterface#onadd
  onAdd: function (map, gl) {
    instrumentGLContext(gl)
    this.map = map
    // create GLSL source for vertex shader
    const vertexSource = `
            attribute vec2 positions;
            attribute vec3 colors;

            uniform mat4 uPMatrix;
            varying vec3 vColor;

            void main() {
                vColor = colors;
                gl_Position = uPMatrix * vec4(positions, 0.0, 1.0);
            }`

    // create GLSL source for fragment shader
    const fragmentSource = `
            varying vec3 vColor;

            void main() {
                gl_FragColor = vec4(vColor, 0.5) ;
            }`

    // define vertices of the triangle to be rendered in the custom style layer
    const beijing = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: 116.41995,
      lat: 40.18994,
    })
    const shanghai = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: 121.472644,
      lat: 31.231706,
    })
    const anhui = mapboxgl.MercatorCoordinate.fromLngLat({
      lng: 117.283042,
      lat: 31.86119,
    })

    // create and initialize a WebGLBuffer to store vertex and color data
    this.positionBuffer = new Buffer(
      gl,
      new Float32Array([
        beijing.x,
        beijing.y,
        shanghai.x,
        shanghai.y,
        anhui.x,
        anhui.y,
      ])
    )

    this.colorBuffer = new Buffer(
      gl,
      new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0])
    )

    this.model = new Model(gl, {
      id: 'program',
      vs: vertexSource,
      fs: fragmentSource,
      attributes: {
        positions: this.positionBuffer,
        colors: this.colorBuffer,
      },
      vertexCount: 3,
    })
  },

  // method fired on each animation frame
  // https://docs.mapbox.com/mapbox-gl-js/api/#map.event:render
  render: function (gl, matrix) {
    this.model.setUniforms({ uPMatrix: matrix }).draw()
  },
}

// add the custom style layer to the map
map.on('load', () => {
  map.addLayer(highlightLayer, 'building')
})
