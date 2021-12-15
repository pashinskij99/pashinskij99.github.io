// Get window dimension
const global = {
  cameraPositionNow: null,
  iForPositionZ: null,
  elapsedTime: null,
  scrollWhere: null,
  thisPos: null,
  arrForTexts: [],
  arrForMesh: [],
  arrForSubTexts: [],
  camera: null,
  checkModal: false,
  videoIsEnd: false,
  takeCanvas: document.querySelector("#scene"),
  stopped: false,
  positionForTextOnTexture: null,
  leaveFromWindow: false,
  funcInit: null,
  hamburgerIsOpen: false,
  arrForGroup: []
}

var ww = document.documentElement.clientWidth || document.body.clientWidth;
var wh = window.innerHeight;

// Save half window dimension
var ww2 = ww * 0.5, wh2 = wh * 0.5;

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / ww * 2 - 1
  mouse.y = - (event.clientY / wh) * 2 + 1
})

// Constructor function
function Tunnel(materials, textTexture, subTextTexture) {
  this.materials = materials
  this.textTexture = textTexture
  this.subTextTexture = subTextTexture
  // Init the scene and the
  this.init();
  // Create the shape of the tunnel
  this.createMesh();

  // Mouse events & window resize
  this.handleEvents();

  // Start loop animation
  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function() {
  // Define the speed of the tunnel
  this.speed = 0.02;

  // Store the position of the mouse
  // Default is center of the screen
  this.mouse = {
    position: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(0, 0)
  };

  // Create a WebGL renderer
  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#scene")
  });
  // Set size of the renderer and its background color
  this.renderer.setSize(ww, wh);
  this.renderer.setClearColor( "#F3F0EF" );

  // Create a camera and move it along Z axis
  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 1000);
  this.camera.position.z = 0.35;

  // Create an empty scene and define a fog for it
  this.scene = new THREE.Scene();
  // this.scene.fog = new THREE.Fog(0x222222, 0.6, 2.8);
};

Tunnel.prototype.addParticle = function() {
  this.plane = new THREE.PlaneBufferGeometry( 1.783, 1.96 )
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
  this.firText = [this.textTexture[0], 'NAMASTATE']
  this.secText = [this.textTexture[1], 'AWARENESS']
  this.thirText = [this.textTexture[2], 'JOURNEY']
  this.fourText = [this.textTexture[3], 'SENSORIA']
  this.fiveText = [this.textTexture[4], 'ALL GOODS']
  this.sixText = [this.textTexture[5], 'COMMUNITAS']
  this.sevenText = [this.textTexture[6], 'NAMA VISION']
  this.eightText = [this.textTexture[7], 'CONNECT']
  this.textSub = []
  this.textSub1 = [this.subTextTexture[0], 'mind']
  this.textSub2 = [this.subTextTexture[1], 'mind']
  this.textSub3 = [this.subTextTexture[2], 'exp']
  this.textSub4 = [this.subTextTexture[3], 'stream']
  this.textSub5 = [this.subTextTexture[4], 'shop']
  this.textSub6 = [this.subTextTexture[5], 'stay']
  this.textSub7 = [this.subTextTexture[6], 'discover']
  this.textSub8 = [this.subTextTexture[7], 'contact']
  this.textures = []
  this.texture1 = [this.materials[0]]
  this.texture2 = [this.materials[1]]
  this.texture3 = [this.materials[2]]
  this.texture4 = [this.materials[3]]
  this.texture5 = [this.materials[4]]
  this.texture6 = [this.materials[5]]
  this.texture7 = [this.materials[6]]
  for (var i = 0; i <= 49; i++) {
    global.iForPositionZ = i
    this.textures.push(this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6, this.texture7)
    this.text.push(this.firText,this.secText,this.thirText,this.fourText,this.fiveText, this.sixText,this.sevenText, this.eightText)
    this.textSub.push(this.textSub1, this.textSub2,this.textSub3,this.textSub4,this.textSub5,this.textSub6, this.textSub7, this.textSub8)
    this.color.push(this.fir, this.sec, this.thir, this.four, this.five, this.six)
    this.particles.push(new Particle(this.scene, i, this.textures, this.color, this.plane, this.text[i],  this.planeText, this.planeSubText, this.textSub[i]))
  }
};

Tunnel.prototype.createMesh = function() {
  // Empty array to store the points along the path
  var points = [];

  // Define points along Z axis to create a curve
  for (var i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  // Set custom Y position for the last point
  points[4].y = -0.06;

  // Create a curve based on the points
  this.curve = new THREE.CatmullRomCurve3(points);
  // Define the curve type

  // Empty geometry
  var geometry = new THREE.Geometry();
  // Create vertices based on the curve
  geometry.vertices = this.curve.getPoints(70);
  // Create a line from the points with a basic line material
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  // Create a material for the tunnel with a custom texture
  // Set side to BackSide since the camera is inside the tunnel
  this.tubeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    map: textures.stone.texture,
    bumpMap: textures.stoneBump.texture,
    visible: false
  });
  
  // Add two lights in the scene
  // An hemisphere light, to add different light from sky and ground
  var light = new THREE.HemisphereLight( "#F3F0EF", "#F3F0EF", 1);
this.scene.add( light );
  // Add a directional light for the bump
  // Repeat the pattern
  this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.map.repeat.set(30, 6);
  this.tubeMaterial.bumpMap.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.bumpMap.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.bumpMap.repeat.set(30, 6);

  // Create a tube geometry based on the curve
  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false);
  // Create a mesh based on the tube geometry and its material
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  // Push the tube into the scene
  this.scene.add(this.tubeMesh);

  // Clone the original tube geometry
  // Because we will modify the visible one but we need to keep track of the original position of the vertices
  this.tubeGeometry_o = this.tubeGeometry.clone();

  this.addParticle()

};
const clickable = document.querySelector("#scene")

Tunnel.prototype.handleEvents = function() {
  // When user resize window
  clickable.addEventListener('mousewheel', this.onMouseWheel.bind(this), false);
  window.addEventListener("resize", this.onResize.bind(this), false);
  // When user move the mouse
  document.body.addEventListener(
    "mousemove",
    this.onMouseMove.bind(this),
    false
  );
};

let num1 = 100

Tunnel.prototype.onMouseWheel = function() {

  if(event.deltaY > 0) {
    num1 += event.deltaY * 4.5
    // scrollDown
    global.scrollWhere = 'down'
    TweenMax.to(this, 0, {
      speed: 550 + num1,
      ease: "slow(0.7, 2, false)"
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "slow(0.7, 2, false)"
      })
      global.scrollWhere = null
      num1 = 100
    }, 200)
  } else  {
    //scrollTop
    global.scrollWhere = 'top'
    num1 += event.deltaY * 4.5
    TweenMax.to(this, 0, {
      speed: 550 - num1,
      ease: "slow(0.7, 2, false)"
    })
    setTimeout(() => {
      TweenMax.to(this, 0, {
        speed: 0,
        ease: "slow(0.7, 2, false)"
      })
      num1 = 100
      global.scrollWhere = null
    }, 200)
  }
}

Tunnel.prototype.onResize = function() {
  // On resize, get new width & height of window
  ww = document.documentElement.clientWidth || document.body.clientWidth;
  wh = window.innerHeight;
  ww2 = ww * 0.5;
  wh2 = wh * 0.5;

  // Update camera aspect
  this.camera.aspect = ww / wh;
  // Reset aspect of the camera
  this.camera.updateProjectionMatrix();
  // Update size of the canvas
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function(e) {
  // Save mouse X & Y position
  this.mouse.target.x = (e.clientX - ww2) / ww2;
  this.mouse.target.y = (wh2 - e.clientY) / wh2;
};

Tunnel.prototype.updateCameraPosition = function() {
  // Update the mouse position with some lerp
  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

  // Rotate Z & Y axis
  this.camera.rotation.z = this.mouse.position.x * 0.2;
  this.camera.rotation.y = Math.PI - this.mouse.position.x * 0.06;
  // Move a bit the camera horizontally & vertically
  this.camera.position.x = this.mouse.position.x * 0.015;
  this.camera.position.y = -this.mouse.position.y * 0.015;
};

Tunnel.prototype.updateMaterialOffset = function() {
  // Update the offset of the material
  this.tubeMaterial.map.offset.x += this.speed;
};

Tunnel.prototype.updateCurve = function() {
  var index = 0, vertice_o = null, vertice = null;
  // For each vertice of the tube, move it a bit based on the spline
  for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
    // Get the original tube vertice
    vertice_o = this.tubeGeometry_o.vertices[i];
    // Get the visible tube vertice
    vertice = this.tubeGeometry.vertices[i];
    // Calculate index of the vertice based on the Z axis
    // The tube is made of 50 rings of vertices
    index = Math.floor(i / 50);
    // Update tube vertice
    vertice.x +=
      (vertice_o.x + this.splineMesh.geometry.vertices[index].x - vertice.x) /
      10;
    vertice.y +=
      (vertice_o.y + this.splineMesh.geometry.vertices[index].y - vertice.y) /
      5;
  }
  // Warn ThreeJs that the points have changed
  this.tubeGeometry.verticesNeedUpdate = true;

  // Update the points along the curve base on mouse position
  this.curve.points[2].x = -this.mouse.position.x * 0.1;
  this.curve.points[4].x = -this.mouse.position.x * 0.1;
  this.curve.points[2].y = this.mouse.position.y * 0.1;

  // Warn ThreeJs that the spline has changed
  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
};

let selectedObject = null,
    max = 2.55, min = 2.9

Tunnel.prototype.render = function() {
  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].update(this);
    if(
        this.particles[i].burst
        &&
        this.particles[i].percent > 1
    ){
      this.particles.splice(i, 1)
      this.text.splice(i, 1)
      this.color.splice(i, 1)
      i--
    }
  }

  // Update camera position & rotation
  this.updateCameraPosition();

  // Update the tunnel
  this.updateCurve();

  // render the scene
  this.renderer.render(this.scene, this.camera);

  raycaster.setFromCamera(mouse, this.camera)
  this.intersectsGroup = raycaster.intersectObjects(global.arrForGroup, true)

  for (const object of global.arrForGroup) {
    if(!global.checkModal) {
      gsap.to(object.children[0].scale, {x: 0.02, y: 0.02, duration: 4})
      gsap.to(object.children[0].children[0].scale, {x: 1, y: 0.6})
      gsap.to(object.children[0].children[0].material.color, {r: 1, b: 1, g: 1})
      // gsap.to(object.children[0].rotation, {x: 0.004, y: 0.004, z: 1, duration: 2})
      if(global.scrollWhere === 'down' || global.scrollWhere === 'top') {
        // console.log(object.children[0].rotation)
        // gsap.to(object.children[0].rotation, { z: Math.random() * (max - min) + min, duration: 2})

        global.takeCanvas.style.cursor = "pointer"
      } else {
        global.takeCanvas.style.cursor = "auto"
      }
    } else {
      global.takeCanvas.style.cursor = "auto"
    }
  }

  if ( this.intersectsGroup.length > 0 ) {

    const res = this.intersectsGroup.filter( function ( res ) {
      return  res.object.children[0]; // res &&
    } )[ 0 ];
    if ( res && res.object ) {

      selectedObject = res.object;
      // console.log(selectedObject.children[0].scale)
      try {
        if( selectedObject.children[0].geometry.type === 'PlaneGeometry') {
          gsap.to(selectedObject.children[0].scale, {x: 1.5, y: 0.6})
          gsap.to(selectedObject.children[0].material.color, {r: 0, b: 0, g: 0})
          gsap.to(selectedObject.scale, {x: 0.015, y: 0.015, duration: 2})
        }
      } catch (e) {
      }
    }

  }

  // Animation loop
  window.requestAnimationFrame(this.render.bind(this));
};
function Particle(scene,  i, texture, color, plane, text, textGeometry, textSubGeometry, textForSubTitle) {
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
    opacity: 0
  })

  this.subTextMaterial = new THREE.MeshBasicMaterial({
    alphaMap: textForSubTitle[0],
    side: THREE.FrontSide,
    transparent: true,
    opacity: 0
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
Particle.prototype.update = function (tunnel, delta) {

  if (global.scrollWhere === "down") {
    this.percent -= (this.speed - 2) * (this.burst ? 1 : tunnel.speed + 1)
  } else if (global.scrollWhere === "top") {
    this.percent += this.speed * (this.burst ? 1 : tunnel.speed + 1)
  }
  // this.mesh.geometry.verticesNeedUpdate = true;
  // this.textMesh.geometry.verticesNeedUpdate = true;

  this.pos = tunnel.curve.getPoint(1 - (this.percent % 1)).add(this.offset)
  global.thisPos = this.pos

  this.mesh.position.x = this.pos.x
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;

}
// All needed textures
var textures = {
  "stone": {
    url: "img/demo1/stonePattern.jpg"
  },
  "stoneBump": {
    url: "img/demo1/stonePatternBump.jpg"
  }
};
// Create a new loader
var loader = new THREE.TextureLoader();
// Prevent crossorigin issue
loader.crossOrigin = "Anonymous";
// Load all textures
for (var name in textures) {
  (function(name) {
  loader.load(textures[name].url, function(texture) {
    textures[name].texture = texture;
    checkTextures();
  });
})(name)
}
var texturesLoaded = 0;
function checkTextures() {
  texturesLoaded++;
  if (texturesLoaded === Object.keys(textures).length) {
    document.body.classList.remove("loading");
    // When all textures are loaded, init the scene
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
    const materials = [
      new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_1.png"), opacity: 2, side: THREE.FrontSide, color: "#CAACD2"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_2.png"), opacity: 2, side: THREE.FrontSide, color: "#F6AD5E"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_3.png"), opacity: 2, side: THREE.FrontSide, color: "#F8D185"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_4.png"), opacity: 2, side: THREE.FrontSide, color: "#4595A3", name: "blue"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_5.png"), opacity: 2, side: THREE.FrontSide, color: "#A9D060"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_6.png"), opacity: 2 , side: THREE.FrontSide, color: "#80CED0"}),
    new THREE.MeshBasicMaterial({alphaMap: loader.load("/img/texture/clearTexture/Chunnel_7.png"), opacity: 2 , side: THREE.FrontSide,color: "#D87B47", name: "red"})
    ]
    window.tunnel = new Tunnel(materials, textTexture, textSubTexture);
  }
}
