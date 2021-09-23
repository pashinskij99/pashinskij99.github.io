const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/textures/NormalMap.png')

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight,
}

window.addEventListener('resize', () => {
   sizes.width = window.innerWidth
   sizes.height = window.innerHeight

   camera.aspect = sizes.width / sizes.height
   camera.updateProjectMatrix()

   renderer.setSize(sizes.width, sizes.height)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(
   75,
   sizes.width / sizes.height,
   0.1,
   100
)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const renderer = new THREE.WebGLRenderer({
   canvas: canvas,
   alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//
controls = new THREE.OrbitControls(camera, renderer.domElement)

// DOM
const btn = document.querySelector('.btn-create')
const select = document.querySelector('.select')
const input = document.querySelector('.input')
const list = document.querySelector('.elem-list-inner')

select.addEventListener('change', function () {
   let key = this.value
})

btn.addEventListener('click', (event) => {
   event.preventDefault()
   if (select.value == 'cube') {
      const geometry = new THREE.BoxGeometry(
         input.value,
         input.value,
         input.value
      )
      const material = new THREE.MeshStandardMaterial()
      material.metalness = 0.7
      material.roughness = 0.2
      material.normalMap = normalTexture
      material.color = new THREE.Color(0x292929)
      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      cube.name = scene.children.length
      scene.add(cube)
      cube.position.x = Math.floor(Math.random() * 3)
      cube.position.y = Math.floor(Math.random() * 3)
      cube.position.z = Math.floor(Math.random() * 3)

      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      <div id="id">${cube.uuid}</div>
      <button class="btn btn-delete">X</button>
      `
      list.append(elem)
      const btnDelete = document.querySelectorAll('.btn-delete')

      btnDelete.forEach((item, i) => {
         item.addEventListener('click', () => {
            item.parentNode.remove()

            function removeEntity(objectName) {
               var selectedObject = scene.getObjectByName(objectName)
               scene.remove(selectedObject)
            }
            removeEntity(i + 2)
         })
      })

      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   } else if (select.value == 'cylinder') {
      const geometry2 = new THREE.CylinderGeometry(
         input.value / 2,
         input.value / 2,
         input.value / 2
         // input.value * 4
      )
      const material2 = new THREE.MeshStandardMaterial()
      material2.metalness = 0.7
      material2.roughness = 0.2
      material2.normalMap = normalTexture
      material2.color = new THREE.Color(0x292929)
      const cylinder = new THREE.Mesh(geometry2, material2)
      cylinder.name = scene.children.length
      scene.add(cylinder)
      cylinder.position.x = Math.floor(Math.random() * 3)
      cylinder.position.y = Math.floor(Math.random() * 3)
      cylinder.position.z = Math.floor(Math.random() * 3)
      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      <div id="id">${cylinder.uuid}</div>
      <button class="btn btn-delete">X</button>
      `
      list.append(elem)

      const btnDelete = document.querySelectorAll('.btn-delete')

      btnDelete.forEach((item, i) => {
         item.addEventListener('click', () => {
            item.parentNode.remove()

            function removeEntity(objectName) {
               var selectedObject = scene.getObjectByName(objectName)
               scene.remove(selectedObject)
            }
            removeEntity(i + 2)
         })
      })

      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   } else if (select.value == 'sphere') {
      const geometry3 = new THREE.SphereGeometry(
         input.value / 2,
         input.value * 5,
         input.value * 5
      )
      const material3 = new THREE.MeshStandardMaterial()
      material3.metalness = 0.7
      material3.roughness = 0.2
      material3.normalMap = normalTexture
      material3.color = new THREE.Color(0x292929)
      const sphere = new THREE.Mesh(geometry3, material3)
      sphere.name = scene.children.length
      scene.add(sphere)
      sphere.position.x = Math.floor(Math.random() * 3)
      sphere.position.y = Math.floor(Math.random() * 3)
      sphere.position.z = Math.floor(Math.random() * 3)
      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      <div id="id">${sphere.uuid}</div>
      <button class="btn btn-delete">X</button>
      `
      list.append(elem)
      const btnDelete = document.querySelectorAll('.btn-delete')

      btnDelete.forEach((item, i) => {
         item.addEventListener('click', () => {
            item.parentNode.remove()

            function removeEntity(objectName) {
               var selectedObject = scene.getObjectByName(objectName)
               scene.remove(selectedObject)
               // animate()
            }
            removeEntity(i + 2)
         })
      })

      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   }
})
