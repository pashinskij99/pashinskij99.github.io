const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
   75,
   window.innerWidth / window.innerHeight,
   0.1,
   1000
)

let light = new THREE.PointLight(0xffffff, 1.5, 30000)
light.position.set(0, 0, 0)
light.castShadow = true
light.shadowMapWidth = 2048
light.shadowMapHeight = 2048
scene.add(light)

// const plane = new THREE.Mesh(
//    new THREE.PlaneGeometry(400, 200, 100, 100),
//    new THREE.MeshLambertMaterial({ color: 0x008cf0 })
// )
// plane.position.y = -Math.PI / 2
// plane.receiveShadow = true
// scene.add(plane)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.Enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 400
camera.position.y = 10

controls = new THREE.OrbitControls(camera, renderer.domElement)

// DOM
const btn = document.querySelector('.btn-create')
const select = document.querySelector('.select')
const input = document.querySelector('.input')
const list = document.querySelector('.elem-list-inner')

select.addEventListener('change', function () {
   let key = this.value
   console.log(key)
})

btn.addEventListener('click', (event) => {
   event.preventDefault()
   console.log(input.value)
   if (select.value == 'cube') {
      const geometry = new THREE.BoxGeometry(
         input.value,
         input.value,
         input.value
      )
      const material = new THREE.MeshBasicMaterial({
         color: '#000',
         wireframe: false,
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.castShadow = true
      scene.add(cube)
      cube.position.x = Math.floor(Math.random() * 5)
      cube.position.y = Math.floor(Math.random() * 5)
      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      <div id="id">${cube.uuid}</div>
      <button class="btn-delete">Delete</button>
      `
      list.append(elem)
      const btnDelete = document.querySelectorAll('.btn-delete')
      const id = document.getElementById('id')
      console.log(id.textContent)

      btnDelete.forEach((item) => {
         item.addEventListener('click', () => {
            console.log('asdasdsa')
            item.parentNode.remove()
         })
      })

      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   } else if (select.value == 'cylinder') {
      const geometry2 = new THREE.CylinderGeometry(
         input.value,
         input.value,
         input.value,
         input.value
      )
      const material2 = new THREE.MeshBasicMaterial({
         color: '#fff',
         wireframe: true,
      })
      const cylinder = new THREE.Mesh(geometry2, material2)
      scene.add(cylinder)
      cylinder.position.x = Math.floor(Math.random() * 100)
      cylinder.position.y = Math.floor(Math.random() * 100)
      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      ${cylinder.uuid}
      <button class="btn-delete">Delete</button>
      `
      list.append(elem)

      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   } else if (select.value == 'sphere') {
      const geometry3 = new THREE.SphereGeometry(
         input.value,
         input.value,
         input.value
      )
      const material3 = new THREE.MeshBasicMaterial({
         color: '#fff',
         wireframe: true,
      })
      const sphere = new THREE.Mesh(geometry3, material3)
      scene.add(sphere)
      sphere.position.x = Math.floor(Math.random() * 100)
      sphere.position.y = Math.floor(Math.random() * 100)
      const elem = document.createElement('li')
      elem.classList.add('list-item', 'list-group-item')
      elem.innerHTML = `
      ${sphere.uuid}
      <button class="btn-delete">Delete</button>
      `
      list.append(elem)
      //
      function animate() {
         requestAnimationFrame(animate)
         renderer.render(scene, camera)
      }
      animate()
   }
})
