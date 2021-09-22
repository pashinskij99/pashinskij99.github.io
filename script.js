const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
   75,
   window.innerWidth / window.innerHeight,
   0.1,
   1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

controls = new THREE.OrbitControls(camera, renderer.domElement)

camera.position.z = 135

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
         color: '#fff',
         wireframe: true,
      })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      cube.position.x = Math.floor(Math.random() * 160)
      cube.position.y = Math.floor(Math.random() * 100)
      const elem = document.createElement('li')
      elem.classList.add('list-item')
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
         cube.rotation.x += 0.01
         cube.rotation.y += 0.01
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
      cylinder.position.x = Math.floor(Math.random() * 160)
      cylinder.position.y = Math.floor(Math.random() * 100)
      const elem = document.createElement('li')
      elem.classList.add('list-item')
      elem.innerHTML = `
      ${cylinder.uuid}
      <button class="btn-delete">Delete</button>
      `
      list.append(elem)

      function animate() {
         requestAnimationFrame(animate)
         cylinder.rotation.x += 0.01
         cylinder.rotation.y += 0.01
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
      sphere.position.x = Math.floor(Math.random() * 160)
      sphere.position.y = Math.floor(Math.random() * 100)
      const elem = document.createElement('li')
      elem.classList.add('list-item')
      elem.innerHTML = `
      ${sphere.uuid}
      <button class="btn-delete">Delete</button>
      `
      list.append(elem)
      //
      function animate() {
         requestAnimationFrame(animate)
         sphere.rotation.x += 0.01
         sphere.rotation.y += 0.01

         renderer.render(scene, camera)
      }
      animate()
   }
})
