const globalForModal = {
  cameraPositionNow: null,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  arrForSubTexts: [],
  arrForMesh: [],
  arrForGroup: [],
  camera: null,
  secondTunnelIsOpen: false,
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
  arrForSubTexts: [],
  arrForMesh: [],
  arrForGroup: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
  takeCanvas: document.querySelector("#scene"),
  stopped: false,
  positionForTextOnTexture: null,
  leaveFromWindow: false,
  funcInit: null,
  hamburgerIsOpen: false,
  openSecondTunnel: false
}
global.takeCanvas.classList.add("visible")

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

const hamburger = document.querySelector(".hamburger"),
    hamburgerContainer = document.querySelector('.hamburger-container')
hamburger.addEventListener("click", () => {
  if (globalForModal.takeProbCanvas.className == "modal-canvas-block hide") {
    globalForModal.takeProbCanvas.classList.remove("hide")
    globalForModal.takeProbCanvas.classList.add("show")
    hamburgerContainer.classList.add('hamburger-close')
    globalForModal.secondTunnelIsOpen = true
  } else if (globalForModal.takeProbCanvas.className == "modal-canvas-block show") {
    globalForModal.takeProbCanvas.classList.remove("show")
    globalForModal.takeProbCanvas.classList.add("hide")
    globalForModal.secondTunnelIsOpen = false
    hamburgerContainer.classList.remove('hamburger-close')
  }
})

const video = document.querySelector('.video')

const btnMusic = document.querySelector('.btn-music')
let music = false

btnMusic.addEventListener("click", () => {
  const imgAudio = document.querySelector(".btn-music img")
  if(!music) {
    video.muted = false
    music = true
    imgAudio.src = 'img/sound/AudioOFFIcon.png'
  } else {
    video.muted = true
    music = false
    imgAudio.src = 'img/sound/AudioONIcon.png'
  }
})

const closeVideoBtn = document.getElementById("closeVideoBtn")
closeVideoBtn.addEventListener("click", () => {
  global.takeCanvas.classList.remove("visible")
  const videoBg = document.querySelector('#video-bg')
  global.videoIsEnd = true
  closeVideoBtn.remove()
  setTimeout(() => {
    videoBg.remove()
  }, 2500)
})
video.addEventListener('ended', () => {
  global.takeCanvas.classList.remove("visible")
  const videoBg = document.querySelector('#video-bg')
  global.videoIsEnd = true
  closeVideoBtn.remove()
  setTimeout(() => {
    videoBg.remove()
  }, 2500)
})

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

window.addEventListener('click', () => {
  if(currentIntersect) {
    if(global.videoIsEnd) {
      if(currentIntersect.object.name === 'NAMASTATE' ) {
        window.open('https://namastate.wpengine.com/', '_blank')
      } else {
        global.checkModal = true
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
  }
})

globalForModal.takeCanvas.addEventListener('click', () => {
  if(currentIntersect1) {
    if(!globalForModal.checkModal && global.videoIsEnd) {
      if(currentIntersect1.object.name === 'NAMASTATE') {
        window.open('https://namastate.wpengine.com/', '_blank')
      } else {
        globalForModal.checkModal = true
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
  }
})

function Tunnel(texture, canvas, textTexture, textSubTexture) {
  this.textTexture = textTexture
  this.textSubTexture = textSubTexture
  this.texture = texture
  this.canvas = canvas

  this.init()
  this.createMesh()

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
  this.renderer.setClearColor( "#F3F0EF" );
  this.renderer.setSize(ww, wh)

  this.camera = new THREE.PerspectiveCamera( 10.1, ww / wh, 0.03, 1.3)
  global.camera = this.camera
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.5
  if(global.cameraPositionNow) {
    this.camera.position.set(global.cameraPositionNow)
  }

  this.scene = new THREE.Scene()

  var light = new THREE.HemisphereLight( "#F3F0EF", "#F3F0EF", 1 )
  this.scene.add( light )

  this.addParticle()
};

Tunnel.prototype.addParticle = function() {
  this.plane = new THREE.PlaneBufferGeometry( .783, .96 )
  this.planeText = new THREE.PlaneBufferGeometry( .25, .2 )
  this.planeSubText = new THREE.PlaneGeometry( .15, .03 )
  this.particles = []
  this.text = []
  this.firText = [this.textTexture[0], 'NAMASTATE']
  this.secText = [this.textTexture[1], 'AWARENESS']
  this.thirText = [this.textTexture[2], 'JOURNEY']
  this.fourText = [this.textTexture[3], 'SENSORIA']
  this.fiveText = [this.textTexture[4], 'ALL GOODS']
  this.sixText = [this.textTexture[5], 'COMMUNITAS']
  this.sevenText = [this.textTexture[6], 'NAMA VISION']
  this.eightText = [this.textTexture[7], 'CONNECT']
  this.textSub = []
  this.textSub1 = [this.textSubTexture[0], 'mind']
  this.textSub2 = [this.textSubTexture[1], 'mind']
  this.textSub3 = [this.textSubTexture[2], 'exp']
  this.textSub4 = [this.textSubTexture[3], 'stream']
  this.textSub5 = [this.textSubTexture[4], 'shop']
  this.textSub6 = [this.textSubTexture[5], 'stay']
  this.textSub7 = [this.textSubTexture[6], 'discover']
  this.textSub8 = [this.textSubTexture[7], 'contact']
  this.textures = []
  this.texture1 = [this.texture[0]]
  this.texture2 = [this.texture[1]]
  this.texture3 = [this.texture[2]]
  this.texture4 = [this.texture[3]]
  this.texture5 = [this.texture[4]]
  this.texture6 = [this.texture[5]]
  this.texture7 = [this.texture[6]]

  for (var i = 0; i <= 49; i++) {
    global.iForPositionZ = i
    this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6, this.texture7)
    this.text.push(this.sixText,this.fiveText,this.fourText,this.thirText,this.secText, this.firText,this.eightText, this.sevenText)
    this.textSub.push(this.textSub6, this.textSub5,this.textSub4,this.textSub3,this.textSub2,this.textSub1, this.textSub8, this.textSub7)
    this.particles.push(new Particle(this.scene, i, this.textures, this.plane, this.text[i],  this.planeText, this.planeSubText, this.textSub[i]))
  }
};

Tunnel.prototype.createMesh = function() {
  var points = []
  var i = 0
  var geometry

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
     points.push(new THREE.Vector3(0, 0, 2.75 * (i / 4)))
  }
  points[4].y = -0.05

  this.curve = new THREE.CatmullRomCurve3(points)
  this.curve.type = "catmullrom"

  geometry = new THREE.Geometry()
  geometry.vertices = this.curve.getPoints(70)
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())

  this.tubeMaterial = new THREE.PointsMaterial({
    visible: false
  })

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
  this.tubeGeometry_o = this.tubeGeometry.clone()
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  this.scene.add(this.tubeMesh)
};

const clickable = document.querySelector(".clickable")
Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false)
  clickable.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
  clickable.addEventListener('touchstart', this.onTouchStart.bind(this), false);
  clickable.addEventListener('touchmove', this.onTouchMove.bind(this), false);
  clickable.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  clickable.addEventListener('mouseleave', (event) => {
    global.leaveFromWindow = true
  }, false);
  clickable.addEventListener('mouseover', () => {
    global.leaveFromWindow = false
  })
};
let num1 = 100
let num3 = 100
let timerTunnel
let down, top1

Tunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {

    num1 += event.deltaY * 4.5
    // scrollDown
    global.scrollWhere = 'down'
    down = gsap.to(this, 0, {
      speed: 550 + num1, // 550 + num1
      ease: Power2.easeInOut,
    })

    clearTimeout(timerTunnel)
    timerTunnel = setTimeout(() => {
      down = gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut // Power1.easeInOut
      })
      global.scrollWhere = null
      num1 = 100
    }, 200)
  } else if(event.deltaY < 0)  {
    //scrollTop
    global.scrollWhere = 'top'
    num3 += event.deltaY * 4.5
    top1 = gsap.to(this, 0, {
      speed: 550 - num3,
      ease: Power2.easeInOut // Power1.easeInOut // Power2.easeInOut
    })

    clearTimeout(timerTunnel)
    timerTunnel = setTimeout(() => {
      top1 = gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut // Power1.easeInOut
      })
      num3 = 100
      global.scrollWhere = null
    }, 200)
  }
}

let x1 = null
let y1 = null

Tunnel.prototype.onTouchStart = function() {

}

Tunnel.prototype.onTouchMove = function() {

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

Tunnel.prototype.updateTunnelElementsByDistance = function(){

  const startSize = 1;
  const endSize = 0.3;

  const particlesMeasurement = [];

  let minD = Infinity;
  let maxD = -Infinity;

  for( const np of this.particles ){
    const nm = { d: np.mesh.position.distanceTo( this.camera.position ), p: np.mesh };
    if( nm.d > maxD ){ maxD = nm.d;}
    if( nm.d < minD ){ minD = nm.d;}
    particlesMeasurement.push( nm );
  }

  const MATH_PI_1_2 = Math.PI / 2;
  const RADIAN_RANGE = 0.02;
  const RADIAN_START = MATH_PI_1_2 + ( MATH_PI_1_2 - RADIAN_RANGE );

  for( const pm of particlesMeasurement ){
    const alphaLinier = pm.d / ( maxD - minD );
    const sinAlpha = Math.sin( RADIAN_START + RADIAN_RANGE * alphaLinier );

    const scaleAlpha = sinAlpha * 1.9; // 1.4

    pm.p.scale.set( scaleAlpha, scaleAlpha, scaleAlpha );
  }
};

Tunnel.prototype.updateCameraPosition = function() {
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 10
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 10

  this.mouse.ratio.x = (this.mouse.position.x / ww)
  this.mouse.ratio.y = (this.mouse.position.y / wh)

  const test1 = 0.000008;
  const test2 = test1 / 2;
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05)
  this.camera.position.x = (this.mouse.ratio.x * test1 - test2);
  this.camera.position.y = -(this.mouse.ratio.y * test1 - test2) - -0.00541;
  global.cameraPositionNow = this.camera.position;
}

Tunnel.prototype.updateCurve = function() {
  let i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 1;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 1;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 180;
  this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 180;
  this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

let selectedObject = null, max = -0.15, min = 0.15
const colorF = new THREE.Color("#F3F0EF")
const colorB = new THREE.Color("#3B5971")

Tunnel.prototype.render = function(time) {
  if(!global.checkModal && global.videoIsEnd && !global.leaveFromWindow) {
    this.updateCameraPosition();
  }
  this.updateTunnelElementsByDistance();

  this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
      ){
      this.particles.splice(i, 1)
      i--
    }
  }
  this.renderer.render(this.scene, this.camera);

  if(!global.hamburgerIsOpen && !globalForModal.secondTunnelIsOpen) {

    raycaster.setFromCamera(mouse, this.camera)
    this.intersectsGroup = raycaster.intersectObjects(global.arrForGroup, true)
    this.intersectsText = raycaster.intersectObjects(global.arrForTexts)

    for (const object of global.arrForGroup) {
      if(!global.checkModal && !globalForModal.secondTunnelIsOpen) {
        if(object.children[0].children[0].material.alphaMap.name === 'CONNECT') {
          gsap.to(object.children[0].children[0].scale, {x: 0.3, y: 0.1})
        } else if(object.children[0].children[0].material.alphaMap.name === 'AWARENESS') {
          gsap.to(object.children[0].children[0].scale, {x: 1.5, y: 0.15})
        } else if(object.children[0].children[0].material.alphaMap.name === 'JOURNEY') {
          gsap.to(object.children[0].children[0].scale, {x: 0.3, y: 0.15})
        } else if(object.children[0].children[0].material.alphaMap.name === 'COMMUNITAS') {
          gsap.to(object.children[0].children[0].scale, {x: 1.7, y: 0.15})
        } else if(object.children[0].children[0].material.alphaMap.name === 'SENSORIA') {
          gsap.to(object.children[0].children[0].scale, {x: 0.5, y: 0.15})
        } else if(object.children[0].children[0].material.alphaMap.name === 'ALL GOODS') {
          gsap.to(object.children[0].children[0].scale, {x: 0.6, y: 0.15})
        } else if(object.children[0].children[0].material.alphaMap.name === 'NAMA VISION') {
          gsap.to(object.children[0].children[0].scale, {x: 1.3, y: 0.3})
        } else if(object.children[0].children[0].material.alphaMap.name === 'NAMASTATE') {
          gsap.to(object.children[0].children[0].scale, {x: 1.4, y: 0.4})
        }
        if(object.children[0].children[1].material.alphaMap.name === 'mind') {
          gsap.to(object.children[0].children[1].scale, {x: 2, y: 2})
        } else if(object.children[0].children[1].material.alphaMap.name === 'exp') {
          gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        } else if(object.children[0].children[1].material.alphaMap.name === 'stream') {
          gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
        } else if(object.children[0].children[1].material.alphaMap.name === 'shop') {
          gsap.to(object.children[0].children[1].scale, {x: 1.3, y: 1.4})
        } else if(object.children[0].children[1].material.alphaMap.name === 'stay') {
          gsap.to(object.children[0].children[1].scale, {x: 0.75, y: 1.2})
        } else if(object.children[0].children[1].material.alphaMap.name === 'discover') {
          gsap.to(object.children[0].children[1].scale, {x: 1.7, y: 1.7})
        }else if(object.children[0].children[1].material.alphaMap.name === 'contact') {
          gsap.to(object.children[0].children[1].scale, {x: 1.8, y: 1.7})
        }
        if( object.children[0].material.name === 'blue' ) {
          gsap.to(object.children[0].children[0].material.color, {
            r: colorF.r,
            g: colorF.g,
            b: colorF.b
          })
          gsap.to(object.children[0].children[1].material.color, {
            r: object.children[0].material.color.r,
            g: object.children[0].material.color.g,
            b: object.children[0].material.color.b
          })
        } else {
          gsap.to(object.children[0].children[0].material.color, {r: colorB.r, g: colorB.g, b: colorB.b})
          gsap.to(object.children[0].children[1].material.color, {r: object.children[0].material.color.r, g: object.children[0].material.color.g, b: object.children[0].material.color.b})
        }
        if(global.scrollWhere === 'down' || global.scrollWhere === 'top') { //
          gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})
        }
        gsap.to(object.scale, {x: 1, y: 1, duration: 3, ease: "elastic"})
        gsap.to(object.children[0].children[0].scale, {x: .8, y: .3, duration: 1, ease: "elastic"})
      }
    }

    if ( this.intersectsText.length > 0 ) {
      if(!global.checkModal && !globalForModal.secondTunnelIsOpen) {
        const res = this.intersectsText.filter(function (res) {
          return res.object;
        })[0];
        if (res && res.object) {
          selectedObject = res.object;
          gsap.to(selectedObject.scale, {x: .9, y: .3, duration: 3, ease: 'elastic'})
          currentName = selectedObject.name
          if (selectedObject.parent.material.name === 'blue') {
            gsap.to(selectedObject.material.color, {r: 0, g: 0, b: 0})
            gsap.to(selectedObject.parent.children[1].material.color, {
              r: 0,
              g: 0,
              b: 0
            })
          }
           else {
            gsap.to(selectedObject.material.color, {r: 2, g: 2, b: 2})
            gsap.to(selectedObject.parent.children[1].material.color, {r: 2, g: 2, b: 2})
          }
          gsap.to( selectedObject.parent.parent.scale, {x: 1.02, y: 1.02, duration: 3, ease: 'elastic'})
        }
      }
    }

    if(this.intersectsText.length) {
      if(currentIntersect === null) {
      }
      currentIntersect = this.intersectsText[0]
    } else {
      if(currentIntersect) {
      }
      currentIntersect = null
    }
  }
    window.requestAnimationFrame(this.render.bind(this));
}
function Particle(scene,  i, texture, plane, text, textGeometry, textSubGeometry, textForSubTitle ) {
  const radius = .022
  this.material = texture[i][0]
  text[0].name = text[1]
  textForSubTitle[0].name = textForSubTitle[1]
  if(i === 49) {
    this.material = this.material.clone()
    this.material.color = new THREE.Color("#F8D185")
  }
  this.material.transparent = true
  this.mesh = new THREE.Mesh(plane, this.material);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 0);
  this.percent = i * 0.02;
  this.burst =  false;
  this.offset = new THREE.Vector3(0, 0, 2);
  this.speed = 1;
  this.mesh.rotation.y = Math.PI
  this.mesh.name = i
  const group = new THREE.Group()
  scene.add(group)
  if (!this.burst){
    this.speed *= 0.000001;
  }
  /*
  * Text
  * */
  this.i = i

  this.textMaterial = new THREE.MeshBasicMaterial({
    alphaMap: text[0],
    depthTest: false,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 2
  })

  this.subTextMaterial = new THREE.MeshBasicMaterial({
    alphaMap: textForSubTitle[0],
    side: THREE.FrontSide,
    transparent: true,
    opacity: text[0].name === 'NAMASTATE' ? 0 : 2
  })

  this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial)

  this.subTextMesh = new THREE.Mesh(textSubGeometry, this.subTextMaterial)
  this.mesh.add(this.textMesh, this.subTextMesh)

  this.textMesh.name = text[1]
  this.subTextMesh.name = textForSubTitle[1]
  if(text[0].name === 'NAMASTATE'){
    this.textMesh.position.set(-0.156, -0.26, 0.05)
    this.textMesh.rotation.set(0, 0, -0.8)
    this.subTextMesh.position.set(0.256, -0.13, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.9)
  }
  else {
    this.textMesh.position.set(0, 0.44, 0.05)
    this.subTextMesh.position.set(0.24, -0.15, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.95)
  }
  if (textForSubTitle[0].name === 'shop') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  } else if (textForSubTitle[0].name === 'stay') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  }
  global.arrForTexts.push(this.textMesh)
  global.arrForSubTexts.push(this.subTextMesh)
  global.arrForGroup.push(group)
  group.add(this.mesh)
  scene.add(group)
}

Particle.prototype.update = function (tunnel) {
  if(!global.checkModal) {
    if(global.scrollWhere === "down") {
      this.percent -= (this.speed   ) * (tunnel.speed)
    } else if(global.scrollWhere === "top") {
      this.percent += this.speed * (tunnel.speed)
    }
  }
  this.pos = tunnel.curve.getPoint(1 - ((this.percent + 999999)%1)).add(this.offset)
  if(global.videoIsEnd) {
    gsap.to(this.offset, {z: 0, duration: 4})
  }
  global.thisPos = this.pos
  this.mesh.position.x = this.pos.x - 0.000;
  this.mesh.position.y = this.pos.y - 0.0013;
  this.mesh.position.z =  0.000001 + this.pos.z
  // this.textMesh.position.x = this.pos.x
}
const document1 = document.querySelector('.content')

window.onload = function() {
  const textTexture = [
    loader.load("/img/texture/clearTexture/namastate.png"),
    loader.load("/img/texture/clearTexture/awarenes.png"),
    loader.load("/img/texture/clearTexture/journey.png"),
    loader.load("/img/texture/clearTexture/sensoria.png"),
    loader.load("/img/texture/clearTexture/all_goods.png"),
    loader.load("/img/texture/clearTexture/communitas.png"),
    loader.load("/img/texture/clearTexture/nama.png"),
    loader.load("/img/texture/clearTexture/connect.png"),
  ]

  const textSubTexture = [
    loader.load("/img/texture/clearTexture/mind.png"),
    loader.load("/img/texture/clearTexture/mind.png"),
    loader.load("/img/texture/clearTexture/exp.png"),
    loader.load("/img/texture/clearTexture/stream.png"),
    loader.load("/img/texture/clearTexture/shop.png"),
    loader.load("/img/texture/clearTexture/stay.png"),
    loader.load("/img/texture/clearTexture/discover.png"),
    loader.load("/img/texture/clearTexture/contact.png"),
  ]

  const textureForTringle = loader.load("/img/texture/clearTexture/Chunnel_1.png")

  const materials = [
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2, side: THREE.FrontSide, color: "#CAACD2"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2, side: THREE.FrontSide, color: "#F6AD5E"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2, side: THREE.FrontSide, color: "#F8D185"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2, side: THREE.FrontSide, color: "#4595A3", name: "blue"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2, side: THREE.FrontSide, color: "#A9D060"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2 , side: THREE.FrontSide, color: "#80CED0"}),
    new THREE.MeshBasicMaterial({alphaMap: textureForTringle, opacity: 2 , side: THREE.FrontSide,color: "#D87B47", name: "red"})
  ]

  loadManager.onLoad = () => {
    window.tunnel = new Tunnel(materials,document.querySelector("#scene"), textTexture, textSubTexture)
    window.tunnelModal = new ModalTunnel(materials, document.querySelector(".prob_canvas"), textTexture, textSubTexture)
  }
}

function ModalTunnel(texture, canvas, textTexture, textSubTexture) {
  this.textTexture = textTexture
  this.textSubTexture = textSubTexture
  this.texture = texture
  this.canvas = canvas

  this.raycaster = new THREE.Raycaster()

  this.init()
  this.createMesh()

  this.handleEvents()

  window.requestAnimationFrame(this.render.bind(this))

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
  this.renderer.setClearColor( "#F3F0EF" );
  this.renderer.setSize(ww ,wh)

  this.camera = new THREE.PerspectiveCamera(10.1, ww /wh, 0.03, 1.3)
  globalForModal.camera = this.camera
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.5 // 0.25

  this.scene = new THREE.Scene()

  var light = new THREE.HemisphereLight( '#F3F0EF', '#F3F0EF', 1 )
  this.scene.add( light )

  this.addParticle()
};

ModalTunnel.prototype.addParticle = function() {
  this.plane = new THREE.PlaneBufferGeometry( .783, .96 )
  this.planeText = new THREE.PlaneBufferGeometry( .25, .2 )
  this.planeSubText = new THREE.PlaneGeometry( .15, .03 )
  this.particles = []
  this.text = []
  this.firText = [this.textTexture[0], 'NAMASTATE']
  this.secText = [this.textTexture[1], 'AWARENESS']
  this.thirText = [this.textTexture[2], 'JOURNEY']
  this.fourText = [this.textTexture[3], 'SENSORIA']
  this.fiveText = [this.textTexture[4], 'ALL GOODS']
  this.sixText = [this.textTexture[5], 'COMMUNITAS']
  this.sevenText = [this.textTexture[6], 'NAMA VISION']
  this.eightText = [this.textTexture[7], 'CONNECT']
  this.textSub = []
  this.textSub1 = [this.textSubTexture[0], 'mind']
  this.textSub2 = [this.textSubTexture[1], 'mind']
  this.textSub3 = [this.textSubTexture[2], 'exp']
  this.textSub4 = [this.textSubTexture[3], 'stream']
  this.textSub5 = [this.textSubTexture[4], 'shop']
  this.textSub6 = [this.textSubTexture[5], 'stay']
  this.textSub7 = [this.textSubTexture[6], 'discover']
  this.textSub8 = [this.textSubTexture[7], 'contact']
  this.textures = []
  this.texture1 = [this.texture[0]]
  this.texture2 = [this.texture[1]]
  this.texture3 = [this.texture[2]]
  this.texture4 = [this.texture[3]]
  this.texture5 = [this.texture[4]]
  this.texture6 = [this.texture[5]]
  this.texture7 = [this.texture[6]]

  for (var i = 0; i <= 49; i++) {
    globalForModal.iForPositionZ = i
    this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6, this.texture7)
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText, this.eightText)
    this.textSub.push(this.textSub1, this.textSub2,this.textSub3,this.textSub4,this.textSub5,this.textSub6, this.textSub7, this.textSub8)
    this.particles.push(new ModalParticle(this.scene, i, this.textures, this.plane, this.text[i],  this.planeText, this.planeSubText, this.textSub[i]))
  }
};

ModalTunnel.prototype.createMesh = function() {
  var points = []
  var i = 0
  var geometry = new THREE.Geometry()

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.75 * (i / 4)))
  }
  points[4].y = -0.05

  this.curve = new THREE.CatmullRomCurve3(points)
  this.curve.type = "catmullrom"

  geometry = new THREE.Geometry()
  geometry.vertices = this.curve.getPoints(70)
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())

  this.tubeMaterial = new THREE.PointsMaterial({
    side: THREE.DoubleSide,
    color: "#F3F0EF",
    visible: false
  })

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
  this.tubeGeometry_o = this.tubeGeometry.clone()
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  this.tubeMesh.scale.set(0.8,0.7,1)
  this.scene.add(this.tubeMesh)
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
let num2 = 100
let timerModalTunnel
ModalTunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {
    num2 += event.deltaY * 4.5;
    // scrollDown
    globalForModal.scrollWhere = 'down'
    gsap.to(this, 0, {
      speed: 550 + num2,
      ease: Power2.easeInOut
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      globalForModal.scrollWhere = null
      num2 = 100
    }, 200)
  } else if (event.deltaY < 0) {
    //scrollTop
    num2 += event.deltaY * 4.5
    globalForModal.scrollWhere = 'top'
    gsap.to(this, 0, {
      speed: 550 + -(num2),
      ease: Power2.easeInOut
    })
    clearTimeout(timerModalTunnel)
    timerModalTunnel = setTimeout(() => {
      gsap.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
      num2 = 100
      globalForModal.scrollWhere = null
    }, 200)
  }
}

const popupContent = document.querySelector(".popup_content")

ModalTunnel.prototype.onResize = function() {
  this.modalWW = this.fakeCanvas.offsetWidth
  this.modalWH = this.fakeCanvas.offsetHeight

  isMobile = this.modalWW < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
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
ModalTunnel.prototype.updateTunnelElementsByDistance = function(){

  const startSize = 1;
  const endSize = 0.3;

  const particlesMeasurement = [];

  let minD = Infinity;
  let maxD = -Infinity;

  for( const np of this.particles ){
    const nm = { d: np.mesh.position.distanceTo( this.camera.position ), p: np.mesh };
    if( nm.d > maxD ){ maxD = nm.d;}
    if( nm.d < minD ){ minD = nm.d;}
    particlesMeasurement.push( nm );
  }

  const MATH_PI_1_2 = Math.PI / 2;
  const RADIAN_RANGE = 0.02;
  const RADIAN_START = MATH_PI_1_2 + ( MATH_PI_1_2 - RADIAN_RANGE );

  for( const pm of particlesMeasurement ){
    const alphaLinier = pm.d / ( maxD - minD );
    const sinAlpha = Math.sin( RADIAN_START + RADIAN_RANGE * alphaLinier );

    const scaleAlpha = sinAlpha * 1.9; // 1.4

    pm.p.scale.set( scaleAlpha, scaleAlpha, scaleAlpha );
  }
};

ModalTunnel.prototype.updateCameraPosition = function() {
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 10
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 10

  this.mouse.ratio.x = (this.mouse.position.x / ww)
  this.mouse.ratio.y = (this.mouse.position.y / wh)

  const test1 = 0.000008;
  const test2 = test1 / 2;
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05)
  this.camera.position.x = (this.mouse.ratio.x * test1 - test2);
  this.camera.position.y = -(this.mouse.ratio.y * test1 - test2) - -0.00541;
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
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 1;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 1;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 180;
  this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 35;
  this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 180;
  this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 35;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

let selectedObject1 = null

ModalTunnel.prototype.render = function(time) {
  if(global.videoIsEnd && !globalForModal.leaveFromWindow) {
    this.updateCameraPosition();
  }

  this.updateTunnelElementsByDistance();

  this.updateCurve();

  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
    ){
      this.particles.splice(i, 1)
      i--
    }
  }

  this.renderer.render(this.scene, this.camera);

  this.raycaster.setFromCamera(mouse1, this.camera)
  this.intersectsGroup = this.raycaster.intersectObjects(globalForModal.arrForGroup, true)
  this.intersectsText = this.raycaster.intersectObjects(globalForModal.arrForTexts)

  for (const object of globalForModal.arrForGroup) {
      if(object.children[0].children[0].material.alphaMap.name === 'CONNECT') {
        gsap.to(object.children[0].children[0].scale, {x: 0.3, y: 0.1})
      } else if(object.children[0].children[0].material.alphaMap.name === 'AWARENESS') {
        gsap.to(object.children[0].children[0].scale, {x: 1.5, y: 0.15})
      } else if(object.children[0].children[0].material.alphaMap.name === 'JOURNEY') {
        gsap.to(object.children[0].children[0].scale, {x: 0.3, y: 0.15})
      } else if(object.children[0].children[0].material.alphaMap.name === 'COMMUNITAS') {
        gsap.to(object.children[0].children[0].scale, {x: 1.7, y: 0.15})
      } else if(object.children[0].children[0].material.alphaMap.name === 'SENSORIA') {
        gsap.to(object.children[0].children[0].scale, {x: 0.5, y: 0.15})
      } else if(object.children[0].children[0].material.alphaMap.name === 'ALL GOODS') {
        gsap.to(object.children[0].children[0].scale, {x: 0.6, y: 0.15})
      } else if(object.children[0].children[0].material.alphaMap.name === 'NAMA VISION') {
        gsap.to(object.children[0].children[0].scale, {x: 1.3, y: 0.3})
      } else if(object.children[0].children[0].material.alphaMap.name === 'NAMASTATE') {
        gsap.to(object.children[0].children[0].scale, {x: 1.4, y: 0.4})
      }
      if(object.children[0].children[1].material.alphaMap.name === 'mind') {
        gsap.to(object.children[0].children[1].scale, {x: 2, y: 2})
      } else if(object.children[0].children[1].material.alphaMap.name === 'exp') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
      } else if(object.children[0].children[1].material.alphaMap.name === 'stream') {
        gsap.to(object.children[0].children[1].scale, {x: 2.5, y: 2})
      } else if(object.children[0].children[1].material.alphaMap.name === 'shop') {
        gsap.to(object.children[0].children[1].scale, {x: 1.3, y: 1.4})
      } else if(object.children[0].children[1].material.alphaMap.name === 'stay') {
        gsap.to(object.children[0].children[1].scale, {x: 0.75, y: 1.2})
      } else if(object.children[0].children[1].material.alphaMap.name === 'discover') {
        gsap.to(object.children[0].children[1].scale, {x: 1.7, y: 1.7})
      }else if(object.children[0].children[1].material.alphaMap.name === 'contact') {
        gsap.to(object.children[0].children[1].scale, {x: 1.8, y: 1.7})
      }
      if( object.children[0].material.name === 'blue' ) {
        gsap.to(object.children[0].children[0].material.color, {
          r: colorF.r,
          g: colorF.g,
          b: colorF.b
        })
        gsap.to(object.children[0].children[1].material.color, {
          r: object.children[0].material.color.r,
          g: object.children[0].material.color.g,
          b: object.children[0].material.color.b
        })
      } else {
        gsap.to(object.children[0].children[0].material.color, {r: colorB.r, g: colorB.g, b: colorB.b})
        gsap.to(object.children[0].children[1].material.color, {r: object.children[0].material.color.r, g: object.children[0].material.color.g, b: object.children[0].material.color.b})
      }
      if(globalForModal.scrollWhere === 'down' || globalForModal.scrollWhere === 'top') {
        gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})
      }
      gsap.to(object.scale, {x: 1, y: 1, duration: 3, ease: "elastic"})
      gsap.to(object.children[0].children[0].scale, {x: .8, y: .3, duration: 1, ease: "elastic"})
      // gsap.to(object.children[0].children[1].scale, {x: 1.6, y: 1.7, duration: 1, ease: "elastic"})
  }

  if ( this.intersectsText.length > 0 ) {
      const res = this.intersectsText.filter(function (res) {
        return res.object;
      })[0];
      if (res && res.object) {
        selectedObject1 = res.object;
        gsap.to(selectedObject1.scale, {x: .9, y: .3, duration: 3, ease: 'elastic'})
        currentName1 = selectedObject1.name
        if (selectedObject1.parent.material.name === 'blue') {
          gsap.to(selectedObject1.material.color, {r: 0, g: 0, b: 0})
          gsap.to(selectedObject1.parent.children[1].material.color, {
            r: 0,
            g: 0,
            b: 0
          })
        }
        else {
          gsap.to(selectedObject1.material.color, {r: 2, g: 2, b: 2})
          gsap.to(selectedObject1.parent.children[1].material.color, {r: 2, g: 2, b: 2})
        }
        gsap.to( selectedObject1.parent.parent.scale, {x: 1.02, y: 1.02, duration: 3, ease: 'elastic'})
      }
  }

  if(this.intersectsText.length) {
    if(currentIntersect1 === null) {
    }
    currentIntersect1 = this.intersectsText[0]
  } else {
    if(currentIntersect1) {
    }
    currentIntersect1 = null
  }

  window.requestAnimationFrame(this.render.bind(this));

}

function ModalParticle(scene, i, texture, plane, text, textGeometry, textSubGeometry, textForSubTitle ) {
  const radius = .022
  this.material = texture[i][0]
  text[0].name = text[1]
  textForSubTitle[0].name = textForSubTitle[1]
  if(i === 49) {
    this.material = this.material.clone()
    this.material.color = new THREE.Color("#F8D185")
  }
  this.material.transparent = true
  this.mesh = new THREE.Mesh(plane, this.material);
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0, 0, 0);
  this.percent = i * 0.02;
  this.burst =  false;
  this.offset = new THREE.Vector3(0, 0, 0);
  this.speed = 1;
  this.mesh.rotation.y = Math.PI
  this.mesh.name = i
  const group = new THREE.Group()
  scene.add(group)
  if (!this.burst){
    this.speed *= 0.000001;
  }
  /*
  * Text
  * */
  this.i = i

  this.textMaterial = new THREE.MeshBasicMaterial({
    alphaMap: text[0],
    depthTest: false,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 2
  })

  this.subTextMaterial = new THREE.MeshBasicMaterial({
    alphaMap: textForSubTitle[0],
    side: THREE.FrontSide,
    transparent: true,
    opacity: text[0].name === 'NAMASTATE' ? 0 : 2
  })

  this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial)

  this.subTextMesh = new THREE.Mesh(textSubGeometry, this.subTextMaterial)
  this.mesh.add(this.textMesh, this.subTextMesh)

  this.textMesh.name = text[1]
  this.subTextMesh.name = textForSubTitle[1]
  if(text[0].name === 'NAMASTATE'){
    this.textMesh.position.set(-0.156, -0.26, 0.05)
    this.textMesh.rotation.set(0, 0, -0.8)
    this.subTextMesh.position.set(0.256, -0.13, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.9)
  }
  else {
    this.textMesh.position.set(0, 0.44, 0.05)
    this.subTextMesh.position.set(0.24, -0.15, 0.05)
    this.subTextMesh.rotation.set(0, 0, 0.95)
  }
  if (textForSubTitle[0].name === 'shop') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  } else if (textForSubTitle[0].name === 'stay') {
    this.subTextMesh.position.set(0.24, -0.13, 0.05)
  }
  globalForModal.arrForTexts.push(this.textMesh)
  globalForModal.arrForSubTexts.push(this.subTextMesh)
  globalForModal.arrForGroup.push(group)
  group.add(this.mesh)
  scene.add(group)
}

ModalParticle.prototype.update = function (tunnel) {
  if(globalForModal.scrollWhere === "down") {
    this.percent -= (this.speed  ) * (tunnel.speed)
  } else if(globalForModal.scrollWhere === "top") {
    this.percent += this.speed * (tunnel.speed)
  }
  this.pos = tunnel.curve.getPoint(1 - ((this.percent + 999999)%1)).add(this.offset)

  globalForModal.thisPos = this.pos
  this.mesh.position.x = this.pos.x - 0.000;
  this.mesh.position.y = this.pos.y - 0.0013;
  this.mesh.position.z =  0.000001 + this.pos.z
}





