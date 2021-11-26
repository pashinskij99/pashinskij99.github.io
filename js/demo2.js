const globalForModal = {
  cameraPositionNow: null,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  arrForMesh: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
  takeCanvas: document.querySelector(".prob_canvas"),
  takeCanvasContainer: document.querySelector(".popup_container"),
  stopped: false,
  positionForTextOnTexture: null,
  leaveFromWindow: false,
  funcInit: null,
  modalWW: this.takeCanvas ? this.takeCanvas.offsetWidth : null,
  modalWH: this.takeCanvas ? this.takeCanvas.offsetHeight : null,
  takeProbCanvas: document.querySelector(".modal-canvas-block"),
  takeFakeCanvas: document.querySelector(".fake-canvas")
}

const global = {
  cameraPositionNow: null,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  arrForMesh: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
  takeCanvas: document.querySelector("#scene"),
  stopped: false,
  positionForTextOnTexture: null,
  leaveFromWindow: false,
  funcInit: null,
  hamburgerIsOpen: false
}

class ResourceTracker {
  constructor() {
    this.resources = new Set();
  }
  track(resource) {
    if (!resource) {
      return resource;
    }

    // handle children and when material is an array of materials or
    // uniform is array of textures
    if (Array.isArray(resource)) {
      resource.forEach(resource => this.track(resource));
      return resource;
    }

    if (resource.dispose || resource instanceof THREE.Object3D) {
      this.resources.add(resource);
    }
    if (resource instanceof THREE.Object3D) {
      this.track(resource.geometry);
      this.track(resource.material);
      this.track(resource.children);
    } else if (resource instanceof THREE.Material) {
      // We have to check if there are any textures on the material
      for (const value of Object.values(resource)) {
        if (value instanceof THREE.Texture) {
          this.track(value);
        }
      }
      // We also have to check if any uniforms reference textures or arrays of textures
      if (resource.uniforms) {
        for (const value of Object.values(resource.uniforms)) {
          if (value) {
            const uniformValue = value.value;
            if (uniformValue instanceof THREE.Texture ||
                Array.isArray(uniformValue)) {
              this.track(uniformValue);
            }
          }
        }
      }
    }
    return resource;
  }
  untrack(resource) {
    this.resources.delete(resource);
  }
  dispose() {
    for (const resource of this.resources) {
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }
      if (resource.dispose) {
        resource.dispose();
      }
    }
    this.resources.clear();
  }
}


const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)

const body = document.querySelector('body')

const raycaster = new THREE.Raycaster()

var ww = window.innerWidth
var wh = window.innerHeight

var isMobile = ww < 500

const mouse = new THREE.Vector2()
let currentIntersect = null
let currentName = null
const mouse1 = new THREE.Vector2()
let currentIntersect1 = null
let currentName1 = null

const closeBtnForModal = document.querySelector(".close")
closeBtnForModal.addEventListener("click", () => {
  globalForModal.takeProbCanvas.classList.remove("show")
  globalForModal.takeProbCanvas.classList.add("hide")
})

const createHamburger = () => {
  const hamburger = document.createElement("div")
  hamburger.classList.add("hamburger")
  hamburger.innerHTML = `
    <div class="hamburger-container">
        <span></span>
        <span></span>
        <span></span>
    </div>
  `
  document1.append(hamburger)
  const hamburgerBtn = document.querySelector(".hamburger")
  hamburgerBtn.addEventListener("click", () => {
    if (globalForModal.takeProbCanvas.className == "modal-canvas-block hide") {
      globalForModal.takeProbCanvas.classList.remove("hide")
      globalForModal.takeProbCanvas.classList.add("show")
    } else if (globalForModal.takeProbCanvas.className == "modal-canvas-block show") {
      globalForModal.takeProbCanvas.classList.remove("show")
      globalForModal.takeProbCanvas.classList.add("hide")
    }

    const wrapperForClose = document.querySelector(".modal-body")
    wrapperForClose.addEventListener("click", () => {
      globalForModal.takeProbCanvas.classList.remove("show")
      globalForModal.takeProbCanvas.classList.add("hide")
    })
  })
}

const video = document.querySelector('.video')

const btnMusic = document.querySelector('.btn-music')
let music = false

btnMusic.addEventListener("click", () => {
  if(!music) {
    video.muted = false
    music = true
    btnMusic.textContent = "Music Off"
  } else {
    video.muted = true
    music = false
    btnMusic.textContent = "Music On"
  }
})

const closeVideoBtn = document.getElementById("closeVideoBtn")
closeVideoBtn.addEventListener("click", () => {
  const videoBg = document.querySelector('#video-bg')
  global.videoIsEnd = true
  videoBg.style.opacity = '0'
  video.style.opacity = '0'
  closeVideoBtn.remove()
  setTimeout(() => {
    videoBg.remove()
  }, 1000)
  createHamburger()
  global.takeCanvas.classList.add('animate-canvas')
  globalForModal.takeProbCanvas.classList.add("hide")
})
video.addEventListener('ended', () => {
  const videoBg = document.querySelector('#video-bg')
  global.videoIsEnd = true
  closeVideoBtn.remove()
  videoBg.style.opacity = '0'
  video.style.opacity = '0'
  setTimeout(() => {
    videoBg.remove()
  }, 1000)
  createHamburger()
  global.takeCanvas.classList.add('animate-canvas')
  globalForModal.takeProbCanvas.classList.add("hide")
})

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

window.addEventListener('click', () => {
  if(currentIntersect) {
    if(!global.checkModal && global.videoIsEnd) {
      global.checkModal = true
      // global.takeCanvas.classList.add("noPointer")
      const element = document.createElement('div')
      element.classList.add("modal", "noselect")
      element.innerHTML = `
      <div class="modal-body"></div>
      <div class="modal_container">
          <div class="modal_close">
            <div class="modal_close_item">
                X
            </div> 
            </div>
            <h1 class="modal_title">
                ${currentName}
            </h1>
      <div>
    `
      document1.append(element)

      const modalBody = document.querySelectorAll(".modal-body").forEach(item => {
        item.addEventListener("click", () => {
          const modal = document.querySelector('.modal')

          if(modal) {
            modal.remove()
          }
          global.checkModal = false
        })
      })

      const deleteModal = document.querySelector(".modal_close")
      deleteModal.addEventListener("click", () => {
        const modal = document.querySelector('.modal')
        modal.remove()
        global.checkModal = false
      })
    }
  }
})

globalForModal.takeCanvas.addEventListener('click', () => {
  if(currentIntersect1) {
    if(!globalForModal.checkModal && global.videoIsEnd) {
      globalForModal.checkModal = true
      // global.takeCanvas.classList.add("noPointer")
      const element = document.createElement('div')
      element.classList.add("modal", "noselect")
      element.innerHTML = `
      <div class="modal-body"></div>
      <div class="modal_container">
          <div class="modal_close">
            <div class="modal_close_item">
                X
            </div> 
            </div>
            <h1 class="modal_title">
                ${currentName1}
            </h1>
      <div>
    `
      document1.append(element)

      const modalBody = document.querySelectorAll(".modal-body").forEach(item => {
        item.addEventListener("click", () => {
          const modal = document.querySelector('.modal')

          if(modal) {
            modal.remove()
          }
          globalForModal.checkModal = false
        })
      })

      const deleteModal = document.querySelector(".modal_close")
      deleteModal.addEventListener("click", () => {
        const modal = document.querySelector('.modal')
        modal.remove()
        globalForModal.checkModal = false
      })
    }
  }
})

function Tunnel(texture, canvas, ) {
  this.texture = texture
  this.canvas = canvas

  this.init()
  this.createMesh()

  this.enabled = true

  this.handleEvents()

  window.requestAnimationFrame(this.render.bind(this))
}

Tunnel.prototype.init = function() {
  this.speed = 1;
  this.prevTime = 0;

  this.mouse = {
    position: new THREE.Vector2(ww * 0.5, wh * 0.5),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5, wh * 0.5)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  this.renderer.setSize(ww, wh)

  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 100)
  global.camera = this.camera
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.25
  if(global.cameraPositionNow) {
    this.camera.position.set(global.cameraPositionNow)
  }

  this.scene = new THREE.Scene()
  this.scene.fog = new THREE.Fog(0x000d25,0.05,3.6)

  var light = new THREE.HemisphereLight( 0xffffff, 0xfffffff, 1 )
  this.scene.add( light )

  this.addParticle()
};

Tunnel.prototype.addParticle = function() {
  this.particles = []
  this.texts = []
  this.color = []
  this.fir = [69, 149, 163]
  this.sec = [248, 209, 133]
  this.thir = [172, 177, 208]
  this.four = [130, 207, 209]
  this.five = [246, 173, 94]
  this.six = [169, 208, 96]
  this.text = []
  this.firText = ['AWARENESS']
  this.secText = ['NAMA VISION']
  this.thirText = ['JOURNEY']
  this.fourText = ["SENSORIA"]
  this.fiveText = ["ALL GOODS"]
  this.sixText = ['COMMUNITAS']
  this.sevenText = ['CONNECT']
  this.positionForText = []
  this.p1 = [0.00257, -0.0136, 0, -0.7]
  this.p2 = [-0.0097, -0.005, 0, -1.6]
  this.p3 = [-0.002, -0.0001, 0,-0.]
  this.p4 = [0.0035, -0.00075, 0, 0.28]
  this.p6 = [-0.00695, -0.012, 0, 0.85]
  this.p7 = [0.0059, -0.003, 0, -1.05]
  this.p8 = [0.0047, -0.01, 0, -1.5]
  this.textures = []
  this.texture1 = [this.texture[0]]
  this.texture2 = [this.texture[1]]
  this.texture3 = [this.texture[2]]
  this.texture4 = [this.texture[3]]
  this.texture5 = [this.texture[4]]
  this.texture6 = [this.texture[5]]

  for (var i = 0; i <= 49; i++) {
    global.iForPositionZ = i
    this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6,)
    this.positionForText.push(this.p3, this.p1, this.p2, this.p3, this.p4, this.p6, this.p7, this.p8 )
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText)
    this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new Particle(this.scene, false, 100, i, this.textures, this.color))
    this.texts.push(new Text(this.scene, true, 1000, i, this.text, this.positionForText))
  }
};

Tunnel.prototype.createMesh = function() {
  var points = []
  var i = 0
  var geometry = new THREE.Geometry()

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
     points.push(new THREE.Vector3(0, 0, 3 * (i / 4)))
  }
  points[4].y = -0.06

  this.curve = new THREE.CatmullRomCurve3(points)
  this.curve.type = "catmullrom"

  geometry = new THREE.Geometry()
  geometry.vertices = this.curve.getPoints(70)
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())

  this.tubeMaterial = new THREE.PointsMaterial({
    side: THREE.DoubleSide,
    color: "rgb(243, 240, 239)",
  })

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
  this.tubeGeometry_o = this.tubeGeometry.clone()
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  this.tubeMesh.scale.set(0.81,0.81,1)
  this.tubeMesh.position.set(0, 0, 0)
  this.scene.add(this.tubeMesh);
};
const clickable = document.querySelector(".clickable")
Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false)
  clickable.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
  clickable.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  // window.addEventListener('mouseout', this.onMouseUp.bind(this), false);
  clickable.addEventListener('mouseleave', (event) => {
    global.leaveFromWindow = true
  }, false);
  clickable.addEventListener('mouseover', () => {
    global.leaveFromWindow = false
  })
  // document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
};

Tunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {
    // scrollDown
    global.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 1550,
      ease: Power2.easeInOut
    })
    // document.body.style.cursor = "url(../img/cursor/scroll-cursor.png)"
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      global.scrollWhere = null

    }, 200)
  } else {
    //scrollTop
    global.scrollWhere = 'top'
    TweenMax.to(this, 0, {
      speed: 1550,
      ease: Power2.easeInOut
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      global.scrollWhere = null
    }, 200)
  }
}

Tunnel.prototype.onResize = function() {
  ww = window.innerWidth;
  wh = window.innerHeight;

  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
}

Tunnel.prototype.onMouseMove = function(e) {
  if (e.type === "mousemove"){
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
}

Tunnel.prototype.updateCameraPosition = function() {
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 250;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 250;

  this.mouse.ratio.x = (this.mouse.position.x / ww);
  this.mouse.ratio.y = (this.mouse.position.y / wh);

  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05);
  // this.camera.position.x = -(this.mouse.ratio.x * 0.0008 - 0.0004) * 22;
  // this.camera.position.y = -(this.mouse.ratio.y * 0.0008 - 0.0004) * 22;
  global.cameraPositionNow = this.camera.position
}

Tunnel.prototype.updateCurve = function() {
  let i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i /30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 5;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 5;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 15;
  this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 115;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 115;
  this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 15;
  this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 115;
  this.curve.points[3].y = -0.015;
  this.curve.points[4].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 115 ;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

Tunnel.prototype.render = function(time) {
  if(!global.checkModal && global.videoIsEnd && !global.leaveFromWindow) {
    this.updateCameraPosition();
  }

  this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    this.texts[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
        &&
        this.texts[i].burst
        &&
        this.texts[i].percent > 1
      ){
      this.particles.splice(i, 1)
      this.texts.splice(i, 1)
      this.text.splice(i, 1)
      this.color.splice(i, 1)
      i--
    }
  }

  this.renderer.render(this.scene, this.camera);

  if(!global.hamburgerIsOpen) {
    raycaster.setFromCamera(mouse, global.camera)
    this.intersects = raycaster.intersectObjects(global.arrForTexts)
    // console.log("second", this.intersects)
    for (const object of global.arrForTexts) {
      if(!global.checkModal) {
        object.material.color.set("#42434A")
        gsap.to(object.scale, {x: 0.006,y: 0.003, z: 0.0002, duration: 3, ease: "elastic"})

        if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
          global.takeCanvas.style.cursor = "url('/img/cursor/cursor-prob.svg'), pointer" +
              " "
        } else {
          global.takeCanvas.style.cursor = "auto"
        }
      } else {
        global.takeCanvas.style.cursor = "auto"
      }
    }

    for(const intersect of this.intersects) {
      if(!global.checkModal) {
        currentName = intersect.object.name
        intersect.object.material.color.set("#F3F0EF")
        gsap.to(intersect.object.scale, {x: 0.009, y: 0.005, z: 0.0002, duration: 3, ease: "elastic"})
        global.takeCanvas.style.cursor = "url('/img/cursor/Hand-Shaped-Mouse-Icon-Vector.svg'), pointer"
      }
    }
    if(this.intersects.length) {
      if(currentIntersect === null) {
      }
      currentIntersect = this.intersects[0]
    } else {
      if(currentIntersect) {
      }
      currentIntersect = null
    }
  }
    window.requestAnimationFrame(this.render.bind(this));
}

function Particle(scene, burst, time, i, texture, color) {
  // const myTime = global.myTime
  const radius = .0008
  let geom
  const random = true
  if(random){
    geom = this.plane
  }

  this.mesh = new THREE.Mesh(geom, texture[i][0]);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 1.5);
  this.percent = burst ? .2 : i * .06;
  this.burst = burst ? true : false;
  this.offset = new THREE.Vector3(0, 0, 0);
  this.speed = 1;
  this.mesh.rotation.y = Math.PI

  if (!this.burst){
    this.speed *= 0.000001;
    this.mesh.scale.x *= 27.4;
    this.mesh.scale.y *= 27.4;
    this.mesh.scale.z *= 1.4;
  }
  scene.add(this.mesh)
}

function Text (scene, burst, time, i, text, newPosition) {
  this.i = i
  // this.textNewPosition = newPosition
  var canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  var context = canvas.getContext("2d");
  var x = window.innerWidth / 2 - 300;
  var y = window.innerHeight / 2 - 300;
  context.font = "70px Namastate-Regular"
  context.textAlign = "center";
  context.fillRect(0, 0, 600, 600);
  context.fillStyle = "#fff";
  context.fillText(text[i], canvas.width / 2, canvas.height / 2);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  const textGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5)
  const textMaterial = new THREE.MeshBasicMaterial({
    alphaMap: texture,
    color: 0xffffff,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 1.4
  })
  this.textMesh = new THREE.Mesh(textGeometry, textMaterial)
  this.textMesh.name = text[i]
  this.textMesh.scale.set(0.00017, 0.00009, 0.0002)
  this.textMesh.rotation.y = Math.PI
  if (!this.burst){
    this.speed = 0;
    this.textMesh.scale.x *= 20.6;
    this.textMesh.scale.y *= 20.6;
    this.textMesh.scale.z *= 1.4;
  }
  global.arrForTexts.push(this.textMesh)
  scene.add(this.textMesh)

  this.positionForText = newPosition

}

Particle.prototype.plane = new THREE.PlaneBufferGeometry( 1, 1 );
Particle.prototype.update = function (tunnel) {
  if(!global.checkModal) {
    if(global.scrollWhere === "down") {
      this.percent -= (this.speed - 1 * 2  ) * (this.burst ? 1 : tunnel.speed + 1)
    } else if(global.scrollWhere === "top") {
      this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
    }
  }

  this.pos = tunnel.curve.getPoint(1 - (this.percent%1)).add(this.offset)
  global.thisPos = this.pos
  this.mesh.position.x = this.pos.x+0.002;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z + 0.00001;
}
const document1 = document.querySelector('.content')
Text.prototype.update = function (tunnel) {
  this.textMesh.position.x = global.thisPos.x + this.positionForText[this.i][0] + 0.001 + 0.0019
  this.textMesh.position.y = global.thisPos.y + 0.0098 + this.positionForText[this.i][1] // +
  this.textMesh.position.z = global.thisPos.z - 0.001;
  this.textMesh.rotation.z = 0 + this.positionForText[this.i][3]
}
window.onload = function() {
  const materials = [
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_1.png"),map: loader.load("/img/texture/Chunnel_1.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false, }),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_2.png"),map: loader.load("/img/texture/Chunnel_2.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false,}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_3.png"),map: loader.load("/img/texture/Chunnel_3.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false,}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_4.png"),map: loader.load("/img/texture/Chunnel_4.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false,}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_5.png"),map: loader.load("/img/texture/Chunnel_5.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false,}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/Chunnel_6.png"),map: loader.load("/img/texture/Chunnel_6.png"), opacity: 1.7 , side: THREE.FrontSide, transparent: true , depthWrite: false,})
  ]

  loadManager.onLoad = () => {
    window.tunnelModal = new ModalTunnel(materials, document.querySelector(".prob_canvas"))

    window.tunnel = new Tunnel(materials,document.querySelector("#scene"))
  }
}

function ModalTunnel(texture, canvas) {
  this.ResourceTracker = new ResourceTracker()
  this.texture = texture
  this.canvas = canvas

  texture.forEach((i) => this.ResourceTracker.track(i.map))

  this.raycaster = new THREE.Raycaster()

  this.init()
  this.createMesh()

  this.enabled = true


  this.handleEvents()

  window.requestAnimationFrame(this.render.bind(this))

}
ModalTunnel.prototype.dispose = function() {
  this.ResourceTracker.dispose()
}

ModalTunnel.prototype.init = function() {

  this.speed = 1;
  this.prevTime = 0;
  this.modalContainer = document.querySelector(".modal-canvas-container")
  this.fakeCanvas = globalForModal.takeFakeCanvas
  this.modalWW = this.modalContainer.offsetWidth
  this.modalWH = this.modalContainer.offsetHeight
  this.mouse = {
    position: new THREE.Vector2(ww * 0.5,  wh * 0.5),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5,  wh * 0.5)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: this.canvas
  });
  this.renderer.setSize(this.modalWW ,this.modalWH)

  this.camera = new THREE.PerspectiveCamera(15, ww /wh, 0.01, 100)
  globalForModal.camera = this.camera
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.25

  this.ResourceTracker.track(this.camera)
  // if(globalForModal.cameraPositionNow) {
  //   this.camera.position.set(globalForModal.cameraPositionNow)
  // }

  this.scene = new THREE.Scene()
  this.scene.fog = new THREE.Fog(0x000d25,0.05,3.6)

  var light = new THREE.HemisphereLight( 0xffffff, 0xfffffff, 1 )
  this.scene.add( light )

  this.addParticle()

  this.ResourceTracker.track(this.scene)
};

ModalTunnel.prototype.addParticle = function() {
  this.particles = []
  this.texts = []
  this.color = []
  this.fir = [69, 149, 163]
  this.sec = [248, 209, 133]
  this.thir = [172, 177, 208]
  this.four = [130, 207, 209]
  this.five = [246, 173, 94]
  this.six = [169, 208, 96]
  this.text = []
  this.firText = ['AWARENESS']
  this.secText = ['NAMA VISION']
  this.thirText = ['JOURNEY']
  this.fourText = ["SENSORIA"]
  this.fiveText = ["ALL GOODS"]
  this.sixText = ['COMMUNITAS']
  this.sevenText = ['CONNECT']
  this.positionForText = []
  this.p1 = [0.00257, -0.0136, 0, -0.7]
  this.p2 = [-0.0097, -0.005, 0, -1.6]
  this.p3 = [-0.002, -0.0001, 0,-0.]
  this.p4 = [0.0035, -0.00075, 0, 0.28]
  this.p6 = [-0.00695, -0.012, 0, 0.85]
  this.p7 = [0.0059, -0.003, 0, -1.05]
  this.p8 = [0.0047, -0.01, 0, -1.5]
  this.textures = []
  this.texture1 = [this.texture[0]]
  this.texture2 = [this.texture[1]]
  this.texture3 = [this.texture[2]]
  this.texture4 = [this.texture[3]]
  this.texture5 = [this.texture[4]]
  this.texture6 = [this.texture[5]]

  for (var i = 0; i <= 49; i++) {
    globalForModal.iForPositionZ = i
    this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6,)
    this.positionForText.push(this.p3, this.p1, this.p2, this.p3, this.p4, this.p6, this.p7, this.p8 )
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText)
    this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new ModalParticle(this.scene, false, 100, i, this.textures, this.color))
    this.texts.push(new ModalText(this.scene, true, 1000, i, this.text, this.positionForText))
  }
};

ModalTunnel.prototype.createMesh = function() {
  var points = []
  var i = 0
  var geometry = new THREE.Geometry()

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 3 * (i / 4)))
  }
  points[4].y = -0.06

  this.curve = new THREE.CatmullRomCurve3(points)
  this.curve.type = "catmullrom"

  geometry = new THREE.Geometry()
  geometry.vertices = this.curve.getPoints(70)
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())

  this.tubeMaterial = new THREE.PointsMaterial({
    side: THREE.BackSide,
    color: "rgb(243, 240, 239)",
  })

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
  this.tubeGeometry_o = this.tubeGeometry.clone()
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  this.tubeMesh.scale.set(0.81,0.81,1)
  this.tubeMesh.position.set(0, 0, 0)
  this.scene.add(this.tubeMesh);
};

ModalTunnel.prototype.handleEvents = function() {
  const canvas = this.canvas

  const popupCanvasContainer = document.querySelector(".prob_canvas")
  window.addEventListener('resize', this.onResize.bind(this), false)
  popupCanvasContainer.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
  popupCanvasContainer.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  popupCanvasContainer.addEventListener('mouseleave', (event) => {
    globalForModal.leaveFromWindow = true
  }, false);
  popupCanvasContainer.addEventListener('mouseover', () => {
    globalForModal.leaveFromWindow = false
  })
  canvas.addEventListener("mousemove", (event) => {
    mouse1.x = ( (event.layerX - canvas.offsetLeft) / canvas.clientWidth ) * 2 - 1;
    mouse1.y = ( (event.layerY - canvas.offsetTop) / canvas.clientHeight ) * -2 + 1;
  })
  // document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
};

ModalTunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {
    // scrollDown
    globalForModal.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 1550,
      ease: Power2.easeInOut
    })
    // document.body.style.cursor = "url(../img/cursor/scroll-cursor.png)"
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      globalForModal.scrollWhere = null

    }, 200)
  } else {
    //scrollTop
    globalForModal.scrollWhere = 'top'
    TweenMax.to(this, 0, {
      speed: 1550,
      ease: Power2.easeInOut
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      globalForModal.scrollWhere = null
    }, 200)
  }
}

const popupContent = document.querySelector(".popup_content")

ModalTunnel.prototype.onResize = function() {
  this.modalWW = this.fakeCanvas.offsetWidth
  this.modalWH = this.fakeCanvas.offsetHeight
  // console.log(this.modalWH)

  isMobile = this.modalWW < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.modalWW, this.modalWH);

}

ModalTunnel.prototype.onMouseMove = function(e) {
  if (e.type === "mousemove"){
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
}

ModalTunnel.prototype.updateCameraPosition = function() {
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 250;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 250;

  this.mouse.ratio.x = (this.mouse.position.x / ww);
  this.mouse.ratio.y = (this.mouse.position.y / wh);

  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05);
  // this.camera.position.x = -(this.mouse.ratio.x * 0.0008 - 0.0004) * 22;
  // this.camera.position.y = -(this.mouse.ratio.y * 0.0008 - 0.0004) * 22;
  globalForModal.cameraPositionNow = this.camera.position
}

ModalTunnel.prototype.updateCurve = function() {
  let i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i /30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 5;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 5;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 15;
  this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 85;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 85;
  this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 15;
  this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 85;
  this.curve.points[3].y = -0.015;
  this.curve.points[4].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 85 ;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

ModalTunnel.prototype.render = function(time) {
  if(global.videoIsEnd && !globalForModal.leaveFromWindow) {
    this.updateCameraPosition();
  }

  this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    this.texts[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
        &&
        this.texts[i].burst
        &&
        this.texts[i].percent > 1
    ){
      this.particles.splice(i, 1)
      this.texts.splice(i, 1)
      this.text.splice(i, 1)
      this.color.splice(i, 1)
      this.textures.splice(i, 1)
      i--
    }
  }

  this.renderer.render(this.scene, this.camera);

  this.raycaster.setFromCamera(mouse1, globalForModal.camera)
  this.intersects = this.raycaster.intersectObjects(globalForModal.arrForTexts)
  for (const object of globalForModal.arrForTexts) {
    // if(globalForModal.checkModal) {
    object.material.color.set("#42434A")
    gsap.to(object.scale, {x: 0.006,y: 0.003, z: 0.1, duration: 3, ease: "elastic"})

    if(globalForModal.scrollWhere === 'down' || globalForModal.scrollWhere === 'top') {
      this.canvas.style.cursor = "url('/img/cursor/cursor-prob.svg'), pointer"
    } else {
      this.canvas.style.cursor = "auto"
    }
    // } else {
    //   globalForModal.takeCanvas.style.cursor = "auto"
    // }
  }

  for(const intersect of this.intersects) {
    // if(!globalForModal.checkModal) {
    currentName1 = intersect.object.name
    intersect.object.material.color.set("#F3F0EF")
    gsap.to(intersect.object.scale, {x: 0.009, y: 0.005, z:0.1, duration: 3, ease: "elastic"})
    this.canvas.style.cursor = "url('/img/cursor/Hand-Shaped-Mouse-Icon-Vector.svg'), pointer"
    // }
  }
  if(this.intersects.length) {
    if(currentIntersect1 === null) {
    }
    currentIntersect1 = this.intersects[0]
  } else {
    if(currentIntersect1) {
    }
    currentIntersect1 = null
  }

  window.requestAnimationFrame(this.render.bind(this));
}

function ModalParticle(scene, burst, time, i, texture, color) {
  const radius = .0008
  let geom
  const random = true
  if(random){
    geom = this.plane
  }

  this.mesh = new THREE.Mesh(geom, texture[i][0]);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 1.5);
  this.percent = burst ? .2 : i * .06;
  this.burst = burst ? true : false;
  this.offset = new THREE.Vector3(0, 0, 0);
  this.speed = 1;
  this.mesh.rotation.y = Math.PI

  if (!this.burst){
    this.speed *= 0.000001;
    this.mesh.scale.x *= 27.4;
    this.mesh.scale.y *= 27.4;
    this.mesh.scale.z *= 1.4;
  }
  scene.add(this.mesh)
}

function ModalText (scene, burst, time, i, text, newPosition) {
  this.i = i
  // this.textNewPosition = newPosition
  var canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  var context = canvas.getContext("2d");
  var x = window.innerWidth / 2 - 300;
  var y = window.innerHeight / 2 - 300;
  context.font = "70px Namastate-Regular"
  context.textAlign = "center";
  context.fillRect(0, 0, 600, 600);
  context.fillStyle = "#fff";
  context.fillText(text[i], canvas.width / 2, canvas.height / 2);
  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  const textGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5)
  const textMaterial = new THREE.MeshBasicMaterial({
    alphaMap: texture,
    color: 0xffffff,
    side: THREE.FrontSide,
    transparent: true,
    transparent: true,
    opacity: 1.4
  })
  this.textMesh = new THREE.Mesh(textGeometry, textMaterial)
  this.textMesh.name = text[i]
  this.textMesh.scale.set(0.00017, 0.00009, 0.0002)
  this.textMesh.rotation.y = Math.PI
  if (!this.burst){
    this.speed = 0;
    this.textMesh.scale.x *= 20.6;
    this.textMesh.scale.y *= 20.6;
    this.textMesh.scale.z *= 1.4;
  }
  globalForModal.arrForTexts.push(this.textMesh)
  scene.add(this.textMesh)

  this.positionForText = newPosition
}

ModalParticle.prototype.plane = new THREE.PlaneBufferGeometry( 1, 1 );
ModalParticle.prototype.update = function (tunnel) {
// if(!globalForModal.checkModal) {
  if(globalForModal.scrollWhere === "down") {
    this.percent -= (this.speed - 1 * 2  ) * (this.burst ? 1 : tunnel.speed + 1)
  } else if(globalForModal.scrollWhere === "top") {
    this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
  }
  // }
  this.pos = tunnel.curve.getPoint(1 - (this.percent%1)).add(this.offset)
  globalForModal.thisPos = this.pos
  this.mesh.position.x = this.pos.x + 0.002 //+ 0.007;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z + 0.00001;
}
// const document1 = document.querySelector('.content')
ModalText.prototype.update = function (tunnel) {
  this.textMesh.position.x = globalForModal.thisPos.x + this.positionForText[this.i][0] + 0.001 + 0.0019
  this.textMesh.position.y = globalForModal.thisPos.y + 0.0098 + this.positionForText[this.i][1] // +
  this.textMesh.position.z = globalForModal.thisPos.z - 0.001;
  this.textMesh.rotation.z = 0 + this.positionForText[this.i][3]
}




