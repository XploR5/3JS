import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 30

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

const geometry = new THREE.IcosahedronGeometry(10, 1)
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
})
const icoSphere = new THREE.Mesh(geometry, material)

scene.add(icoSphere)

const positionAttribute = icoSphere.geometry.getAttribute('position')

const dots = []
for (let i = 0; i < positionAttribute.count; i++) {
  const vertex = new THREE.Vector3()
  vertex.fromBufferAttribute(positionAttribute, i)
  icoSphere.localToWorld(vertex)

  const dotGeometry = new THREE.SphereGeometry(0.1, 32, 32)
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const dot = new THREE.Mesh(dotGeometry, dotMaterial)
  dots.push(dot)
  dot.position.copy(vertex)

  scene.add(dot)
}

const ambientLight = new THREE.AmbientLight(0x404040)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(0, 0, 50)
scene.add(pointLight)

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

animate()
