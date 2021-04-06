import './node_modules/three/build/three.min.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls';
const gui = new dat.GUI();
const world = {
  plane:{
    width:20,
    height:10,
    widthSegment:20,
    heightSegment:20,
  }
}
gui.add(world.plane,'width', 1, 30)
.onChange(()=>{
  generatePlain();
})

gui.add(world.plane,'height', 1, 30)
.onChange(()=>{
  generatePlain();
})

gui.add(world.plane,'widthSegment', 1, 50)
.onChange(()=>{
  generatePlain();
})

gui.add(world.plane,'heightSegment',1,50)
.onChange(()=>{
  generatePlain();
})

function generatePlain(){
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegment,world.plane.heightSegment);
  const {array} = plane.geometry.attributes.position
  for (let i = 0; i < array.length; i+=3) {
    const x = array[i];
    const y = array[i+1];
    const z = array[i+2];
    array[i+2] += Math.random();
  }
  const colors = [];
  for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }
  //creating a new attribute for the geometry it is an array of integers
  plane.geometry.setAttribute('color',
  new THREE.BufferAttribute( new Float32Array(colors),3 )
  )
  plane.geometry.attributes.position.originalPosition = plane.geometry.attributes.position.array
}

//raycaster is used to
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffff00, 1);
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.getElementById('app').append(renderer.domElement);

new OrbitControls(camera,renderer.domElement);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height, world.plane.widthSegment, world.plane.heightSegment);
const planeMaterial = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, flatShading:THREE.FlatShading, vertexColors:true});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane)

const {array} = plane.geometry.attributes.position
for (let i = 0; i < array.length; i+=3) {
  const x = array[i];
  const y = array[i+1];
  const z = array[i+2];
  array[i+2] += Math.random()-0.5;
}

const colors = [];
for (let i = 0; i < plane.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}
plane.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute( new Float32Array(colors),3 ),
)

plane.geometry.attributes.position.originalPosition = plane.geometry.attributes.position.array
//console.log(plane.geometry.attributes.position);
//we are using light because we changed our material to phong and it will react to light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0,0,-1);
scene.add(light);
const bLight = new THREE.DirectionalLight(0xffffff, 1);
bLight.position.set(0,0,1);
scene.add(bLight)

const mouse={
  x:undefined,
  y:undefined
}

let frame = 1;
function animate() {
  frame += 0.01;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse,camera);
  const {array, originalPosition} = plane.geometry.attributes.position;
  for (let i = 0; i < array.length; i+=3) {
    array[i] = originalPosition[i] + Math.cos(frame + (Math.random()-0.5) ) / 1000;
    array[i+1] = originalPosition[i+1] + Math.sin(frame + (Math.random()-0.5) ) / 1000;
    plane.geometry.attributes.position.needsUpdate = true;
  }

  const intersect = raycaster.intersectObject(plane);
  if(intersect.length) {
    //console.log(intersect[0].face);
    const {color} = intersect[0].object.geometry.attributes;
    //setX is for changing the r value in rgb color
    //setY is for changing the g value in rgb color
    //setZ is for changing the b value in rgb color
    //the face object is giving us the verticels around the intersected verticle
    color.setX(intersect[0].face.a,0.1)
    color.setY(intersect[0].face.a,0.5)
    color.setZ(intersect[0].face.a,1)

    color.setX(intersect[0].face.b,0.1)
    color.setY(intersect[0].face.b,0.5)
    color.setZ(intersect[0].face.b,1)

    color.setX(intersect[0].face.c,0.1)
    color.setY(intersect[0].face.c,0.5)
    color.setZ(intersect[0].face.c,1)
    color.needsUpdate = true;

    const initialColor = {
      r:0,
      g:.19,
      b:.4
    }
    const hoverColor = {
      r:.1,
      g:.5,
      b:1
    }
    gsap.to(hoverColor,{
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration:1.4,
      //this is going to change from hover color to initial color and in each update we are going to change the color of the faces
      onUpdate:function(){
          color.setX(intersect[0].face.a, hoverColor.r)
          color.setY(intersect[0].face.a, hoverColor.g)
          color.setZ(intersect[0].face.a, hoverColor.b)

          color.setX(intersect[0].face.b, hoverColor.r)
          color.setY(intersect[0].face.b, hoverColor.g)
          color.setZ(intersect[0].face.b, hoverColor.b)

          color.setX(intersect[0].face.c, hoverColor.r)
          color.setY(intersect[0].face.c, hoverColor.g)
          color.setZ(intersect[0].face.c, hoverColor.b)
          color.needsUpdate = true;
      }
    })
  }
}
animate();

addEventListener('mousemove',(e)=>{
  mouse.x = (e.x / innerWidth) * 2 - 1 ;
  mouse.y = -(e.y / innerHeight) * 2 + 1 ;
})
