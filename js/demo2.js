// const globalForModal = {
//   cameraPositionNow: null,
//   iForPositionZ: null,
//   elapsedTime: null,
//   scrollWhere: null,
//   thisPos: null,
//   arrForTexts: [],
//   arrForMesh: [],
//   camera: null,
//   checkModal: false,
//   videoIsEnd: false,
//   takeCanvas: document.querySelector(".prob_canvas"),
//   takeCanvasContainer: document.querySelector(".popup_container"),
//   stopped: false,
//   positionForTextOnTexture: null,
//   leaveFromWindow: false,
//   funcInit: null,
//   modalWW: this.takeCanvas ? this.takeCanvas.offsetWidth : null,
//   modalWH: this.takeCanvas ? this.takeCanvas.offsetHeight : null,
//   takeProbCanvas: document.querySelector(".modal-canvas-block"),
//   takeFakeCanvas: document.querySelector(".fake-canvas")
// }

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

// const closeBtnForModal = document.querySelector(".close")
// closeBtnForModal.addEventListener("click", () => {
//   globalForModal.takeProbCanvas.classList.remove("show")
//   globalForModal.takeProbCanvas.classList.add("hide")
// })

const createHamburger = () => {
  const hamburger = document.createElement("div")
  hamburger.classList.add("hamburger")
  hamburger.innerHTML = `
    <div class="hamburger-container">
      <div class="hamburger-content"></div>
    </div>
  `
  document1.append(hamburger)
  const hamburgerBtn = document.querySelector(".hamburger"),
      hamburgerContainer = document.querySelector('.hamburger-container')
  hamburgerBtn.addEventListener("click", () => {
      hamburgerContainer.classList.toggle("hamburger-close")
  })
  // }
  //   // if (globalForModal.takeProbCanvas.className == "modal-canvas-block hide") {
  //   //   globalForModal.takeProbCanvas.classList.remove("hide")
  //   //   globalForModal.takeProbCanvas.classList.add("show")
  //   // } else if (globalForModal.takeProbCanvas.className == "modal-canvas-block show") {
  //   //   globalForModal.takeProbCanvas.classList.remove("show")
  //   //   globalForModal.takeProbCanvas.classList.add("hide")
  //   // }
  //
  //   // const wrapperForClose = document.querySelector(".modal-body")
  //   // wrapperForClose.addEventListener("click", () => {
  //   //   // globalForModal.takeProbCanvas.classList.remove("show")
  //   //   // globalForModal.takeProbCanvas.classList.add("hide")
  //   // })
  // })
}

const video = document.querySelector('.video')

const btnMusic = document.querySelector('.btn-music')
let music = false

btnMusic.addEventListener("click", () => {
  if(!music) {
    video.muted = false
    music = true
    btnMusic.textContent = "Audio Off"
  } else {
    video.muted = true
    music = false
    btnMusic.textContent = "Audio On"
  }
})

const closeVideoBtn = document.getElementById("closeVideoBtn")
closeVideoBtn.addEventListener("click", () => {
  global.takeCanvas.classList.remove("visible")
  const videoBg = document.querySelector('#video-bg')
  // const fakeModal = document.querySelector(".modal-canvas-block")
  // fakeModal.classList.add("opacity-off")// .opacity-on
  global.videoIsEnd = true
  // videoBg.style.opacity = '0'
  // video.style.opacity = '0'
  closeVideoBtn.remove()
  setTimeout(() => {
    videoBg.remove()
  }, 2500)
  createHamburger()
  // global.takeCanvas.classList.add('animate-canvas')
  // globalForModal.takeProbCanvas.classList.add("hide")
})
video.addEventListener('ended', () => {
  global.takeCanvas.classList.remove("visible")
  const videoBg = document.querySelector('#video-bg')
  global.videoIsEnd = true
  closeVideoBtn.remove()
  // videoBg.style.opacity = '0'
  // video.style.opacity = '0'
  setTimeout(() => {
    videoBg.remove()
  }, 2500)
  createHamburger()
  // global.takeCanvas.classList.add('animate-canvas')
  // globalForModal.takeProbCanvas.classList.add("hide")
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

// globalForModal.takeCanvas.addEventListener('click', () => {
//   if(currentIntersect1) {
//     if(!globalForModal.checkModal && global.videoIsEnd) {
//       globalForModal.checkModal = true
//       // global.takeCanvas.classList.add("noPointer")
//       const element = document.createElement('div')
//       element.classList.add("modal", "noselect")
//       element.innerHTML = `
//       <div class="modal-body"></div>
//       <div class="modal_container">
//           <div class="modal_close">
//             <div class="modal_close_item">
//                 X
//             </div>
//             </div>
//             <h1 class="modal_title">
//                 ${currentName1}
//             </h1>
//       <div>
//     `
//       document1.append(element)
//
//       const modalBody = document.querySelectorAll(".modal-body").forEach(item => {
//         item.addEventListener("click", () => {
//           const modal = document.querySelector('.modal')
//
//           if(modal) {
//             modal.remove()
//           }
//           globalForModal.checkModal = false
//         })
//       })
//
//       const deleteModal = document.querySelector(".modal_close")
//       deleteModal.addEventListener("click", () => {
//         const modal = document.querySelector('.modal')
//         modal.remove()
//         globalForModal.checkModal = false
//       })
//     }
//   }
// })

function Tunnel(texture, canvas, textTexture, textSubTexture) {
  this.textTexture = textTexture
  this.textSubTexture = textSubTexture
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
  this.renderer.setClearColor( "#F3F0EF" );
  this.renderer.setSize(ww, wh)

  this.camera = new THREE.PerspectiveCamera( 10.1, ww / wh, 0.03, 1.3) // 1.1 // 1.3
  global.camera = this.camera
  this.camera.rotation.y = Math.PI
  this.camera.position.z = 0.5// 0.25\
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
  this.color = []
  this.fir = [69, 149, 163]
  this.sec = [248, 209, 133]
  this.thir = [172, 177, 208]
  this.four = [130, 207, 209]
  this.five = [246, 173, 94]
  this.six = [169, 208, 96]
  this.text = []
  this.firText = [this.textTexture[0]]
  this.secText = [this.textTexture[1]]
  this.thirText = [this.textTexture[2]]
  this.fourText = [this.textTexture[3]]
  this.fiveText = [this.textTexture[4]]
  this.sixText = [this.textTexture[5]]
  this.sevenText = [this.textTexture[6]]
  this.eightText = [this.textTexture[7]]
  this.textSub = []
  this.textSub1 = [this.textSubTexture[0]]
  this.textSub2 = [this.textSubTexture[1]]
  this.textSub3 = [this.textSubTexture[2]]
  this.textSub4 = [this.textSubTexture[3]]
  this.textSub5 = [this.textSubTexture[4]]
  this.textSub6 = [this.textSubTexture[5]]
  this.textSub7 = [this.textSubTexture[6]]
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
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText, this.eightText)
    this.textSub.push(this.textSub1, this.textSub2,this.textSub3,this.textSub4,this.textSub5,this.textSub6, this.textSub7)
    this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new Particle(this.scene, i, this.textures, this.color, this.plane, this.text[i],  this.planeText, this.planeSubText, this.textSub[i]))
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

const clickable = document.querySelector(".clickable")
Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false)
  clickable.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
  clickable.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  clickable.addEventListener('mouseleave', (event) => {
    global.leaveFromWindow = true
  }, false);
  clickable.addEventListener('mouseover', () => {
    global.leaveFromWindow = false
  })
};
let num1 = 100

Tunnel.prototype.onMouseDown = function() {

  if(event.deltaY > 0) {
    num1 += event.deltaY * 3
    // scrollDown
    global.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 550 + num1, // 550 + num1
      ease: "elastic",
    })
    // document.body.style.cursor = "url(../img/cursor/scroll-cursor.png)"
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "elastic" // Power1.easeInOut
      })
      global.scrollWhere = null
      num1 = 100
    }, 200)
  } else if(event.deltaY < 0)  {
    //scrollTop
    global.scrollWhere = 'top'
    num1 += event.deltaY * 4.5
    TweenMax.to(this, 0, {
      speed: 550 - num1,
      ease: "elastic" // Power1.easeInOut // Power2.easeInOut
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "elastic" // Power1.easeInOut
      })
      num1 = 100
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
const colorB = new THREE.Color("#4595A3")
const colorC = new THREE.Color("#F8D185")

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

  if(!global.hamburgerIsOpen) {

    raycaster.setFromCamera(mouse, this.camera)
    this.intersectsGroup = raycaster.intersectObjects(global.arrForGroup, true)
    this.intersectsText = raycaster.intersectObjects(global.arrForTexts)

    for (const object of global.arrForGroup) {
      if(!global.checkModal) {
        
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
        } 
        // else if( object.children[0].name === 49 ) {
        //   gsap.to(object.children[0].material.color, {
        //     r: colorC.r,
        //     g: colorC.g,
        //     b: colorC.b
        //   })
        // }
         else {
          gsap.to(object.children[0].children[0].material.color, {r: colorB.r, g: colorB.g, b: colorB.b})
          gsap.to(object.children[0].children[1].material.color, {r: object.children[0].material.color.r, g: object.children[0].material.color.g, b: object.children[0].material.color.b})
        }
        if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
          gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})
        }
        gsap.to(object.scale, {x: 1, y: 1, duration: 3, ease: "elastic"})
        gsap.to(object.children[0].children[0].scale, {x: .8, y: .3, duration: 3, ease: "elastic"})
        gsap.to(object.children[0].children[1].scale, {x: 1.2, y: 1.7, duration: 3, ease: "elastic"})
        if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
          global.takeCanvas.style.cursor = "url('/img/cursor/cursor-prob.svg'), pointer"
        } else {
          global.takeCanvas.style.cursor = "auto"
        }
      } else {
        global.takeCanvas.style.cursor = "auto"
      }
    }

    if ( this.intersectsText.length > 0 ) {
      if(!global.checkModal) {
        const res = this.intersectsText.filter(function (res) {
          return res.object;
        })[0];
        if (res && res.object) {
          selectedObject = res.object;
          gsap.to(selectedObject.scale, {x: .9, y: .3, duration: 3, ease: 'elastic'})
          currentName = selectedObject.name
          global.takeCanvas.style.cursor = "pointer"
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

function Particle(scene,  i, texture, color, plane, text, textGeometry, textSubGeometry, textForSubTitle ) {
  const radius = .022
  this.material = texture[i][0]
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
    opacity: 1.4
  })
  this.textMesh = new THREE.Mesh(textGeometry, this.textMaterial)

  this.subTextMesh = new THREE.Mesh(textSubGeometry, this.subTextMaterial)
  this.mesh.add(this.textMesh, this.subTextMesh)

  // this.textMesh.name = text[i]
  this.subTextMesh.name = textForSubTitle
  if(this.textMesh.name[0] === 'NAMASTATE'){
    this.textMesh.position.set(-0.156, -0.26, 0.2)
    this.textMesh.rotation.set(0, 0, -0.8)
    this.subTextMesh.position.set(0.256, -0.13, 0.15)
    this.subTextMesh.rotation.set(0, 0, 0.9)
  } else {
    this.textMesh.position.set(0, 0.435, 0.1)
    this.subTextMesh.position.set(0.256, -0.11, 0.15)
    this.subTextMesh.rotation.set(0, 0, 0.9)
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
      this.percent -= (this.speed - 2  ) * (tunnel.speed)
    } else if(global.scrollWhere === "top") {
      this.percent += this.speed * (tunnel.speed)
    }
  }
  this.pos = tunnel.curve.getPoint(1 - ((this.percent + 1)%1))
  global.thisPos = this.pos
  this.mesh.position.x = this.pos.x - 0.000;
  this.mesh.position.y = this.pos.y - 0.0013;
  this.mesh.position.z =  0.000001 + this.pos.z 
}
const document1 = document.querySelector('.content')

window.onload = function() {
  const textTexture = [
      loader.load("/img/texture/clearTexture/connect.png"),
      loader.load("/img/texture/clearTexture/awarenes.png"),
      loader.load("/img/texture/clearTexture/journey.png"),
      loader.load("/img/texture/clearTexture/communitas.png"),
      loader.load("/img/texture/clearTexture/sensoria.png"),
      loader.load("/img/texture/clearTexture/all_goods.png"),
      loader.load("/img/texture/clearTexture/nama.png"),
      loader.load("/img/texture/clearTexture/namastate.png")
  ]

  const textSubTexture = [
    loader.load("/img/texture/clearTexture/mind.png"),
    loader.load("/img/texture/clearTexture/choose.png"),
    loader.load("/img/texture/clearTexture/stream.png"),
    loader.load("/img/texture/clearTexture/shop.png"),
    loader.load("/img/texture/clearTexture/stay.png"),
    loader.load("/img/texture/clearTexture/discover.png"),
    loader.load("/img/texture/clearTexture/contact.png"),
  ]

  const materials = [
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_1.png"), opacity: 2, side: THREE.FrontSide, color: "#ACB1D0"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_2.png"), opacity: 2, side: THREE.FrontSide, color: "#F6AD5E"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_3.png"), opacity: 2, side: THREE.FrontSide, color: "#F8D185"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_4.png"), opacity: 2, side: THREE.FrontSide, color: "#4595A3", name: "blue"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_5.png"), opacity: 2, side: THREE.FrontSide, color: "#A9D060"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_6.png"), opacity: 2 , side: THREE.FrontSide, color: "#80CED0"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_7.png"), opacity: 2 , side: THREE.FrontSide,color: "#D87B47", name: "red"})
  ]

  loadManager.onLoad = () => {
    // window.tunnelModal = new ModalTunnel(materials, document.querySelector(".prob_canvas"))
    window.tunnel = new Tunnel(materials,document.querySelector("#scene"), textTexture, textSubTexture)
  }
}

// function ModalTunnel(texture, canvas) {
//   this.ResourceTracker = new ResourceTracker()
//   this.texture = texture
//   this.canvas = canvas
//
//   texture.forEach((i) => this.ResourceTracker.track(i.map))
//
//   this.raycaster = new THREE.Raycaster()
//
//   this.init()
//   this.createMesh()
//
//   this.enabled = true
//
//
//   this.handleEvents()
//
//   window.requestAnimationFrame(this.render.bind(this))
//
// }
// ModalTunnel.prototype.dispose = function() {
//   this.ResourceTracker.dispose()
// }
//
// ModalTunnel.prototype.init = function() {
//
//   this.speed = 1;
//   this.prevTime = 0;
//   this.modalContainer = document.querySelector(".modal-canvas-container")
//   this.fakeCanvas = globalForModal.takeFakeCanvas
//   this.modalWW = this.modalContainer.offsetWidth
//   this.modalWH = this.modalContainer.offsetHeight
//   this.mouse = {
//     position: new THREE.Vector2(ww * 0.5,  wh * 0.5),
//     ratio: new THREE.Vector2(0, 0),
//     target: new THREE.Vector2(ww * 0.5,  wh * 0.5)
//   };
//
//   this.renderer = new THREE.WebGLRenderer({
//     antialias: true,
//     canvas: this.canvas
//   });
//   this.renderer.setSize(this.modalWW ,this.modalWH)
//
//   this.camera = new THREE.PerspectiveCamera(15, ww /wh, 0.01, 1000)
//   globalForModal.camera = this.camera
//   this.camera.rotation.y = Math.PI
//   this.camera.position.z = 0.6 // 0.25
//
//   this.ResourceTracker.track(this.camera)
//
//   this.scene = new THREE.Scene()
//   this.scene.fog = new THREE.Fog(0x000d25,0.05,3.6)
//
//   var light = new THREE.HemisphereLight( 0xffffff, 0xfffffff, 1 )
//   this.scene.add( light )
//
//   this.addParticle()
//
//   this.ResourceTracker.track(this.scene)
// };
//
// ModalTunnel.prototype.addParticle = function() {
//   this.particles = []
//   this.texts = []
//   this.color = []
//   this.fir = [69, 149, 163]
//   this.sec = [248, 209, 133]
//   this.thir = [172, 177, 208]
//   this.four = [130, 207, 209]
//   this.five = [246, 173, 94]
//   this.six = [169, 208, 96]
//   this.text = []
//   this.firText = ['AWARENESS']
//   this.secText = ['NAMA VISION']
//   this.thirText = ['JOURNEY']
//   this.fourText = ["SENSORIA"]
//   this.fiveText = ["ALL GOODS"]
//   this.sixText = ['COMMUNITAS']
//   this.sevenText = ['CONNECT']
//   this.positionForText = []
//   this.p1 = [0.00257, -0.0136, 0, -0.7]
//   this.p2 = [-0.0097, -0.005, 0, -1.6]
//   this.p3 = [-0.002, -0.0001, 0,-0.]
//   this.p4 = [0.0035, -0.00075, 0, 0.28]
//   this.p6 = [-0.00695, -0.012, 0, 0.85]
//   this.p7 = [0.0059, -0.003, 0, -1.05]
//   this.p8 = [0.0047, -0.01, 0, -1.5]
//   this.textures = []
//   this.texture1 = [this.texture[0]]
//   this.texture2 = [this.texture[1]]
//   this.texture3 = [this.texture[2]]
//   this.texture4 = [this.texture[3]]
//   this.texture5 = [this.texture[4]]
//   this.texture6 = [this.texture[5]]
//
//   for (var i = 0; i <= 49; i++) {
//     globalForModal.iForPositionZ = i
//     this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6,)
//     this.positionForText.push(this.p3, this.p1, this.p2, this.p3, this.p4, this.p6, this.p7, this.p8 )
//     this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText)
//     this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
//     this.particles.push(new ModalParticle(this.scene, false, 100, i, this.textures, this.color))
//     this.texts.push(new ModalText(this.scene, true, 1000, i, this.text, this.positionForText))
//   }
// };
//
// ModalTunnel.prototype.createMesh = function() {
//   var points = []
//   var i = 0
//   var geometry = new THREE.Geometry()
//
//   this.scene.remove(this.tubeMesh)
//
//   for (i = 0; i < 5; i += 1) {
//     points.push(new THREE.Vector3(0, 0, 3 * (i / 4)))
//   }
//   points[4].y = -0.06
//
//   this.curve = new THREE.CatmullRomCurve3(points)
//   this.curve.type = "catmullrom"
//
//   geometry = new THREE.Geometry()
//   geometry.vertices = this.curve.getPoints(70)
//   this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial())
//
//   this.tubeMaterial = new THREE.PointsMaterial({
//     side: THREE.BackSide,
//     color: "rgb(243, 240, 239)",
//   })
//
//   this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false)
//   this.tubeGeometry_o = this.tubeGeometry.clone()
//   this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
//   this.tubeMesh.scale.set(0.81,0.81,1)
//   this.tubeMesh.position.set(0, 0, 0)
//   this.scene.add(this.tubeMesh);
// };
//
// ModalTunnel.prototype.handleEvents = function() {
//   const canvas = this.canvas
//
//   const popupCanvasContainer = document.querySelector(".prob_canvas")
//   window.addEventListener('resize', this.onResize.bind(this), false)
//   popupCanvasContainer.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
//   popupCanvasContainer.addEventListener('mousemove', this.onMouseMove.bind(this), false);
//   popupCanvasContainer.addEventListener('mouseleave', (event) => {
//     globalForModal.leaveFromWindow = true
//   }, false);
//   popupCanvasContainer.addEventListener('mouseover', () => {
//     globalForModal.leaveFromWindow = false
//   })
//   canvas.addEventListener("mousemove", (event) => {
//     mouse1.x = ( (event.layerX - canvas.offsetLeft) / canvas.clientWidth ) * 2 - 1;
//     mouse1.y = ( (event.layerY - canvas.offsetTop) / canvas.clientHeight ) * -2 + 1;
//   })
//   // document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
// };
// let num2 = 100
// ModalTunnel.prototype.onMouseDown = function() {
//   if(event.deltaY > 0) {
//     num2 += event.deltaY;
//     // scrollDown
//     globalForModal.scrollWhere = 'down'
//     TweenMax.to(this, 0, {
//       speed: 1550 + num2,
//       ease: Power2.easeInOut
//     })
//     // document.body.style.cursor = "url(../img/cursor/scroll-cursor.png)"
//     setTimeout(() => {
//       TweenMax.to(this, 0, {
//         speed: 0,
//         ease: Power2.easeInOut
//       })
//       num2 = 100
//       globalForModal.scrollWhere = null
//
//     }, 200)
//   } else {
//     //scrollTop
//     num2 += event.deltaY
//     globalForModal.scrollWhere = 'top'
//     TweenMax.to(this, 0, {
//       speed: 1550 + -(num2),
//       ease: Power2.easeInOut
//     })
//     setTimeout(() => {
//       TweenMax.to(this, 0, {
//         speed: 0,
//         ease: Power2.easeInOut
//       })
//       num2 = 100
//       globalForModal.scrollWhere = null
//     }, 200)
//   }
// }
//
// const popupContent = document.querySelector(".popup_content")
//
// ModalTunnel.prototype.onResize = function() {
//   this.modalWW = this.fakeCanvas.offsetWidth
//   this.modalWH = this.fakeCanvas.offsetHeight
//
//   isMobile = this.modalWW < 500;
//
//   this.camera.aspect = ww / wh;
//   this.camera.updateProjectionMatrix();
//   this.renderer.setSize(this.modalWW, this.modalWH);
//
// }
//
// ModalTunnel.prototype.onMouseMove = function(e) {
//   if (e.type === "mousemove"){
//     this.mouse.target.x = e.clientX;
//     this.mouse.target.y = e.clientY;
//   } else {
//     this.mouse.target.x = e.touches[0].clientX;
//     this.mouse.target.y = e.touches[0].clientY;
//   }
// }
//
// ModalTunnel.prototype.updateCameraPosition = function() {
//   this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
//   this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;
//
//   this.mouse.ratio.x = (this.mouse.position.x / ww);
//   this.mouse.ratio.y = (this.mouse.position.y / wh);
//
//   this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.1 - 0.05);
//   // this.camera.position.x = -(this.mouse.ratio.x * 0.0008 - 0.0004) * 22;
//   // this.camera.position.y = -(this.mouse.ratio.y * 0.0008 - 0.0004) * 22;
//   globalForModal.cameraPositionNow = this.camera.position
// }
//
// ModalTunnel.prototype.updateCurve = function() {
//   let i = 0;
//   let index = 0;
//   let vertice_o = null;
//   let vertice = null;
//   for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
//     vertice_o = this.tubeGeometry_o.vertices[i];
//     vertice = this.tubeGeometry.vertices[i];
//     index = Math.floor(i / 30);
//     vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 1;
//     vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 1;
//   }
//   this.tubeGeometry.verticesNeedUpdate = true;
//
//   this.curve.points[1].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 90;
//   this.curve.points[2].x = (0.6 * (1 - this.mouse.ratio.x) - 0.3) / 8;
//   this.curve.points[3].x = 0;
//   this.curve.points[4].x = -(0.6 * (1 - this.mouse.ratio.x) - 0.3) / 8;
//   this.curve.points[1].y = -(0.6 * (1 - this.mouse.ratio.y) - 0.3) / 90;
//   this.curve.points[2].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 8
//   this.curve.points[3].y = -0.02;
//   this.curve.points[4].y = (0.6 * (1 - this.mouse.ratio.y) - 0.3) / 8 ;
//
//   this.splineMesh.geometry.verticesNeedUpdate = true;
//   this.splineMesh.geometry.vertices = this.curve.getPoints(70);
// }
//
// ModalTunnel.prototype.render = function(time) {
//   if(global.videoIsEnd && !globalForModal.leaveFromWindow) {
//     this.updateCameraPosition();
//   }
//
//   this.updateCurve();
//
//   for(var i = 0; i < this.particles.length; i++){
//     this.particles[i].update(this);
//     this.texts[i].update(this);
//     if(
//         this.particles[i].burst
//         &&
//         this.particles[i].percent > 1
//         &&
//         this.texts[i].burst
//         &&
//         this.texts[i].percent > 1
//     ){
//       this.particles.splice(i, 1)
//       this.texts.splice(i, 1)
//       this.text.splice(i, 1)
//       this.color.splice(i, 1)
//       this.textures.splice(i, 1)
//       i--
//     }
//   }
//
//   this.renderer.render(this.scene, this.camera);
//
//   this.raycaster.setFromCamera(mouse1, globalForModal.camera)
//   this.intersects = this.raycaster.intersectObjects(globalForModal.arrForTexts)
//   for (const object of globalForModal.arrForTexts) {
//     // if(globalForModal.checkModal) {
//     object.material.color.set("#42434A")
//     gsap.to(object.scale, {x: 0.006,y: 0.003, z: 0.1, duration: 3, ease: "elastic"})
//
//     if(globalForModal.scrollWhere === 'down' || globalForModal.scrollWhere === 'top') {
//       this.canvas.style.cursor = "url('/img/cursor/cursor-prob.svg'), pointer"
//     } else {
//       this.canvas.style.cursor = "auto"
//     }
//     // } else {
//     //   globalForModal.takeCanvas.style.cursor = "auto"
//     // }
//   }
//
//   for(const intersect of this.intersects) {
//     // if(!globalForModal.checkModal) {
//     currentName1 = intersect.object.name
//     intersect.object.material.color.set("#F3F0EF")
//     gsap.to(intersect.object.scale, {x: 0.009, y: 0.005, z:0.1, duration: 3, ease: "elastic"})
//     this.canvas.style.cursor = "url('/img/cursor/Hand-Shaped-Mouse-Icon-Vector.svg'), pointer"
//     // }
//   }
//   if(this.intersects.length) {
//     if(currentIntersect1 === null) {
//     }
//     currentIntersect1 = this.intersects[0]
//   } else {
//     if(currentIntersect1) {
//     }
//     currentIntersect1 = null
//   }
//
//   window.requestAnimationFrame(this.render.bind(this));
// }
//
// function ModalParticle(scene, burst, time, i, texture, color) {
//   const radius = .0008
//   let geom
//   const random = true
//   if(random){
//     geom = this.plane
//   }
//
//   this.mesh = new THREE.Mesh(geom, texture[i][0]);
//   this.mesh.scale.set(radius, radius, radius);
//   this.mesh.position.set(0, 0, 1.5);
//   this.percent = burst ? .2 : i * .06;
//   this.burst = burst ? true : false;
//   this.offset = new THREE.Vector3(0, 0, 0);
//   this.speed = 1;
//   this.mesh.rotation.y = Math.PI
//
//   if (!this.burst){
//     this.speed *= 0.000001;
//     this.mesh.scale.x *= 27.4;
//     this.mesh.scale.y *= 27.4;
//     this.mesh.scale.z *= 1.4;
//   }
//   scene.add(this.mesh)
// }
//
// function ModalText (scene, burst, time, i, text, newPosition) {
//   this.i = i
//   // this.textNewPosition = newPosition
//   var canvas = document.createElement("canvas");
//   canvas.width = 512;
//   canvas.height = 256;
//   var context = canvas.getContext("2d");
//   var x = window.innerWidth / 2 - 300;
//   var y = window.innerHeight / 2 - 300;
//   context.font = "70px Namastate-Regular"
//   context.textAlign = "center";
//   context.fillRect(0, 0, 600, 600);
//   context.fillStyle = "#fff";
//   context.fillText(text[i], canvas.width / 2, canvas.height / 2);
//   var texture = new THREE.Texture(canvas);
//   texture.needsUpdate = true;
//   const textGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5)
//   const textMaterial = new THREE.MeshBasicMaterial({
//     alphaMap: texture,
//     color: 0xffffff,
//     side: THREE.FrontSide,
//     transparent: true,
//     transparent: true,
//     opacity: 1.4
//   })
//   this.textMesh = new THREE.Mesh(textGeometry, textMaterial)
//   this.textMesh.name = text[i]
//   this.textMesh.scale.set(0.00017, 0.00009, 0.0002)
//   this.textMesh.rotation.y = Math.PI
//   if (!this.burst){
//     this.speed = 0;
//     this.textMesh.scale.x *= 20.6;
//     this.textMesh.scale.y *= 20.6;
//     this.textMesh.scale.z *= 1.4;
//   }
//   globalForModal.arrForTexts.push(this.textMesh)
//   scene.add(this.textMesh)
//
//   this.positionForText = newPosition
// }
//
// ModalParticle.prototype.plane = new THREE.PlaneBufferGeometry( 1, 1 );
// ModalParticle.prototype.update = function (tunnel) {
// // if(!globalForModal.checkModal) {
//   if(globalForModal.scrollWhere === "down") {
//     this.percent -= (this.speed - 1 * 2  ) * (this.burst ? 1 : tunnel.speed + 1)
//   } else if(globalForModal.scrollWhere === "top") {
//     this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
//   }
//   // }
//   this.pos = tunnel.curve.getPoint(1 - (this.percent%1)).add(this.offset)
//   globalForModal.thisPos = this.pos
//   this.mesh.position.x = this.pos.x + 0.002 //+ 0.007;
//   this.mesh.position.y = this.pos.y;
//   this.mesh.position.z = this.pos.z + 0.00001;
// }
// // const document1 = document.querySelector('.content')
// ModalText.prototype.update = function (tunnel) {
//   this.textMesh.position.x = globalForModal.thisPos.x + this.positionForText[this.i][0] + 0.001 + 0.0019
//   this.textMesh.position.y = globalForModal.thisPos.y + 0.0098 + this.positionForText[this.i][1] // +
//   this.textMesh.position.z = globalForModal.thisPos.z - 0.001;
//   this.textMesh.rotation.z = 0 + this.positionForText[this.i][3]
// }




