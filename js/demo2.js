const global = {
  myTime: 13000,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
}

const videoBg = document.querySelector('#video-bg')
const closeVideoBtn = document.getElementById("closeVideoBtn")
closeVideoBtn.addEventListener("click", () => {
  global.videoIsEnd = true

  videoBg.style.opacity = '0'
  video.style.opacity = '0'
  closeVideoBtn.remove()
  setTimeout(() => {
    videoBg.remove()
  }, 1000)
})
const body = document.querySelector('body')
// video
const video = document.querySelector('.video')
video.addEventListener('ended', () => {
  global.videoIsEnd = true
  closeVideoBtn.remove()
  videoBg.style.opacity = '0'
  video.style.opacity = '0'
  setTimeout(() => {
    videoBg.remove()
  }, 1000)

})

if(global.videoIsEnd) {

}

var ww = window.innerWidth;
var wh = window.innerHeight;
var isMobile = ww < 500;

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()
let currentIntersect = null
let currentName = null

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

window.addEventListener('click', () => {
  if(currentIntersect) {
    global.checkModal = true
    const element = document.createElement('div')
    element.classList.add("modal")
    element.innerHTML = `
      <div class="modal_container">
        <div class="modal_close">X</div>
        <h1 class="modal_title">
            ${currentName}
        </h1>
      <div>
    `
    document1.append(element)
    const deleteModal = document.querySelector(".modal_close")
    deleteModal.addEventListener("click", () => {
      const modal = document.querySelector('.modal')
      modal.remove()
      global.checkModal = false
    })
  }
})

function Tunnel(texture, font) {
  this.texture = texture
  this.font = font
  this.init();
  this.createMesh();

  this.handleEvents();

  window.requestAnimationFrame(this.render.bind(this));
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
    canvas: document.querySelector("#scene")
  });
  this.renderer.setSize(ww, wh);

  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 100);
  global.camera = this.camera
  this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.35;

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog(0x000d25,0.05,1.6);

  var light = new THREE.HemisphereLight( 0xffffff, 0xfffffff, 1 );
  this.scene.add( light );

  this.addParticle();
};

Tunnel.prototype.addParticle = function() {
  this.particles = [];
  this.texts = [];
  this.b = []
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

  for (var i = 0; i <= 50; i++) {
    global.iForPositionZ = i
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText)
    this.b.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new Particle(this.scene, false, 100, i, this.texture, this.b))
    this.texts.push(new Text(this.scene, true, 1000, i, this.text))
  }
};

Tunnel.prototype.createMesh = function() {
  var points = [];
  var i = 0;
  var geometry = new THREE.Geometry();

  this.scene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
     points.push(new THREE.Vector3(0, 0, 3 * (i / 4)));
  }
  points[4].y = -0.06;

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = "catmullrom";

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(70);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  this.tubeMaterial = new THREE.PointsMaterial({
    side: THREE.BackSide,
    color: "rgb(243, 240, 239)",
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false);
  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

  this.scene.add(this.tubeMesh);
};

Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false)

  document.body.addEventListener('mousemove', this.onMouseMove.bind(this), false);

  document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
  document.body.addEventListener('mousewheel', this.onMouseDown.bind(this), false);
};

Tunnel.prototype.onMouseDown = function() {
  if(event.deltaY > 0) {
    // scrollDown
    global.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 1550,
      ease: Power2.easeInOut
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: Power2.easeInOut
      })
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
  this.camera.position.x = this.mouse.ratio.x * 0.008 - 0.004;
  this.camera.position.y = this.mouse.ratio.y * 0.008 - 0.004;
}

Tunnel.prototype.updateCurve = function() {
  let i = 0;
  let index = 0;
  let vertice_o = null;
  let vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    // index = Math.floor(i / 30);
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 5;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 5;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[2].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;

  this.curve.points[2].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;
  this.curve.points[3].y = 1;
  this.curve.points[4].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
}

Tunnel.prototype.render = function(time) {

  this.updateCameraPosition();

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
      i--
    }
  }

  this.renderer.render(this.scene, this.camera);

  if(global.iForPositionZ === 50) {
    raycaster.setFromCamera(mouse, global.camera)

    this.intersects = raycaster.intersectObjects(global.arrForTexts)

    for (const object of global.arrForTexts) {
      object.material.color.set("#fff")
      object.scale.set(0.006, 0.003, 0.0002)
      // object.scale.set(0.005, 0.003, 0.002)
    }

    for(const intersect of this.intersects) {
      currentName = intersect.object.name
      intersect.object.material.color.set("#000")
      intersect.object.scale.set(0.0065, 0.0035, 0.0002)
      // intersect.object.scale.set(0.006, 0.004, 0.002)
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
  const myTime = global.myTime
  const radius = .0008;
  let geom = this.icosahedron;
  console.log(geom);
  const random = true;
  if(random){
    geom = this.plane
  }
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    color: `rgb(${color[i]})`,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
  });
  this.mesh = new THREE.Mesh(geom, mat);
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

function Text (scene, burst, time, i, text) {
  var canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  var context = canvas.getContext("2d");
  this.text = "hola"
  var x = window.innerWidth / 2 - 300;
  var y = window.innerHeight / 2 - 300;

  context.font = "70px Namastate-Light";
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
}

Particle.prototype.plane = new THREE.PlaneBufferGeometry( 1, 1 );
Particle.prototype.update = function (tunnel) {
  if(global.scrollWhere === "down") {
    body.style.cursor = 'url("]"), default'
    this.percent -= (this.speed - 1 * 2  ) * (this.burst ? 1 : tunnel.speed + 1)
  } else {
    this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
  }
  this.pos = tunnel.curve.getPoint(1 - (this.percent%1)).add(this.offset)
  global.thisPos = this.pos
  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z + 0.00001;
}
const document1 = document.querySelector('.content')
Text.prototype.update = function (tunnel) {

  this.textMesh.position.x = global.thisPos.x;
  this.textMesh.position.y = global.thisPos.y + 0.0101;
  this.textMesh.position.z = global.thisPos.z;
}
window.onload = function() {
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('/img/texture/Chunnel_All-7.png', (texture) => {
    // texture.width = 2048
    // texture.height = 2048
    window.tunnel = new Tunnel(texture)
  })
}


