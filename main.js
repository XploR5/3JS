// import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//creating a scene with camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.setZ(30)

//creating a renderer which renders the scene on canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)

// Creating an IcosahedronGeometry for the ico sphere
const icoGeometry = new THREE.IcosahedronGeometry(12, 1)
const icoMaterial = new THREE.MeshStandardMaterial({
  color: 0xadfdd7,
  wireframe: true,
})
const icoSphere = new THREE.Mesh(icoGeometry, icoMaterial)
scene.add(icoSphere)

// Adding vertices as small spheres
const positionAttribute = icoSphere.geometry.getAttribute('position')

const dots = []
for (let i = 0; i < positionAttribute.count; i++) {
  const vertex = new THREE.Vector3()
  vertex.fromBufferAttribute(positionAttribute, i)
  icoSphere.localToWorld(vertex)

  const dotGeometry = new THREE.SphereGeometry(0.1, 32, 32)
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xafffff })
  const dot = new THREE.Mesh(dotGeometry, dotMaterial)
  dots.push(dot)
  dot.position.copy(vertex)

  scene.add(dot)
}

//add light
const pointLight = new THREE.PointLight(0xa151f1)
// pointLight.position.set(0, 0, 1);
const ambientLight = new THREE.AmbientLight(0xfff, 0.55)
scene.add(pointLight, ambientLight)

//defining the animate function
function animate() {
  requestAnimationFrame(animate)
  icoSphere.rotation.y += 0.001

  for (let i = 0; i < positionAttribute.count; i++) {
    const vertex = new THREE.Vector3()
    vertex.fromBufferAttribute(positionAttribute, i)
    icoSphere.localToWorld(vertex)
    dots[i].position.copy(vertex)
  }

  renderer.render(scene, camera)
}

const spotLight = new THREE.SpotLight(0xadfdd7, 2, 0, Math.PI / 2)
spotLight.position.set(50, 50, 50)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 10
spotLight.shadow.camera.far = 200

const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
backLight.position.set(100, 0, -100)

scene.add(spotLight, backLight)

function onWindowResize() {
  // Camera frustum aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight
  // After making changes to aspect
  camera.updateProjectionMatrix()
  // Reset size
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

animate()
