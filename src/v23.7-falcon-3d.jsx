import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';

/* V23.7 FALCON 3D HERO LAYER
   A procedurally modelled low-poly falcon rendered behind the home hero copy.
   No external model asset: every mesh is generated from three.js primitives and
   extruded planforms, so the silhouette is tuned in code and inherits the live
   JYC gold/paper/ink theme tokens instead of a baked texture.

   Interaction policy (CONTRIBUTING.md rules 4 and 5):
   - The falcon cruises on a slow left/right sine at all times, so a stationary
     cursor still produces motion. Pointer input is added on top of that cruise.
   - The loop is gated, not permanent: an IntersectionObserver stops it when the
     hero leaves the viewport, and document visibility stops it in background
     tabs. AMBIENT_FPS caps the idle frame rate, which also clamps the hero to
     60fps on 120Hz displays.
   - prefers-reduced-motion, save-data, low device memory and missing WebGL
     never load the layer at all. Touch devices mount it too, but only get the
     ambient cruise, since the pointer listener is gated on a fine pointer. */

const POINTER_ACTIVE_MS=1200;
const AMBIENT_FPS=60;
const AMBIENT_FRAME_MS=1000/AMBIENT_FPS;
const MAX_PIXEL_RATIO=1.75;
const LITE_PIXEL_RATIO=1.2;

function readToken(name,fallback){
  if(typeof window==='undefined')return fallback;
  const raw=getComputedStyle(document.documentElement).getPropertyValue(name);
  return (raw||'').trim()||fallback;
}

function palette(){
  const isDark=document.documentElement.dataset.theme==='dark';
  return {
    isDark,
    gold:readToken(isDark?'--jyc-dark-gold':'--jyc-light-gold','#a47b43'),
    goldDeep:readToken('--jyc-gold','#9b743f'),
    goldBright:readToken('--jyc-gold-2','#c5a16b'),
    paper:readToken('--jyc-light-bg','#eee4d1'),
    night:readToken('--jyc-dark-bg','#090a0d'),
    nightBright:readToken('--jyc-dark-ink','#f4eadd'),
    beak:readToken('--jyc-light-ink','#2b241c')
  };
}

function discStrength(theme){
  return theme.isDark?0.72:0.62;
}

/* Swept planform with a serrated tip so the wing reads as a falcon's pointed
   primaries rather than a generic bird wing. */
function wingShape(){
  const shape=new THREE.Shape();
  shape.moveTo(0,0.16);
  shape.lineTo(0.20,0.205);
  shape.lineTo(0.44,0.175);
  shape.lineTo(0.66,0.105);
  shape.lineTo(0.84,0.015);
  const primaries=4;
  for(let i=0;i<primaries;i++){
    const a=0.84+(0.16/primaries)*i;
    const b=0.84+(0.16/primaries)*(i+1);
    shape.lineTo(a+0.015,-0.015-i*0.012);
    shape.lineTo(b,-0.05-i*0.018);
  }
  shape.lineTo(0.62,-0.14);
  shape.lineTo(0.34,-0.215);
  shape.lineTo(0,-0.245);
  shape.closePath();
  return shape;
}

function tailShape(){
  const shape=new THREE.Shape();
  shape.moveTo(0,0.14);
  shape.lineTo(0.30,0.12);
  shape.lineTo(0.52,0.05);
  shape.lineTo(0.50,-0.08);
  shape.lineTo(0.30,-0.17);
  shape.lineTo(0,-0.19);
  shape.closePath();
  return shape;
}

function panel(shape,depth){
  const geometry=new THREE.ExtrudeGeometry(shape,{
    depth,
    bevelEnabled:true,
    bevelThickness:depth*0.3,
    bevelSize:depth*0.28,
    bevelOffset:0,
    bevelSegments:1,
    curveSegments:1,
    steps:1
  });
  geometry.rotateX(-Math.PI/2);
  geometry.computeVertexNormals();
  return geometry;
}

function buildFalcon(theme){
  const bodyMaterial=new THREE.MeshStandardMaterial({
    color:new THREE.Color(theme.gold),metalness:0.58,roughness:0.36,flatShading:true
  });
  const wingMaterial=new THREE.MeshStandardMaterial({
    color:new THREE.Color(theme.goldDeep),metalness:0.5,roughness:0.44,flatShading:true,side:THREE.DoubleSide
  });
  const trimMaterial=new THREE.MeshStandardMaterial({
    color:new THREE.Color(theme.goldBright),metalness:0.72,roughness:0.24,flatShading:true
  });
  const beakMaterial=new THREE.MeshStandardMaterial({
    color:new THREE.Color(theme.isDark?'#e3c79b':'#8a6a39'),metalness:0.35,roughness:0.5,flatShading:true
  });
  const eyeMaterial=new THREE.MeshStandardMaterial({
    color:new THREE.Color(theme.isDark?'#2a2016':'#2b241c'),metalness:0.1,roughness:0.62,flatShading:true
  });

  const falcon=new THREE.Group();

  const body=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),bodyMaterial);
  body.scale.set(0.5,0.44,1.18);
  falcon.add(body);

  const breast=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),bodyMaterial);
  breast.scale.set(0.36,0.32,0.66);
  breast.position.set(0,-0.1,0.34);
  falcon.add(breast);

  const neck=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.3,0.46,10),bodyMaterial);
  neck.rotation.x=Math.PI/2.35;
  neck.position.set(0,0.2,0.72);
  falcon.add(neck);

  const head=new THREE.Mesh(new THREE.SphereGeometry(0.27,16,12),bodyMaterial);
  head.scale.set(1,0.94,1.08);
  head.position.set(0,0.36,1.02);
  falcon.add(head);

  const crown=new THREE.Mesh(new THREE.SphereGeometry(0.27,14,10,0,Math.PI*2,0,Math.PI*0.5),trimMaterial);
  crown.scale.set(1.02,0.6,1.05);
  crown.position.set(0,0.41,0.99);
  falcon.add(crown);

  const beak=new THREE.Mesh(new THREE.ConeGeometry(0.088,0.36,8),beakMaterial);
  beak.rotation.x=Math.PI/2+0.16;
  beak.position.set(0,0.3,1.35);
  falcon.add(beak);

  const cere=new THREE.Mesh(new THREE.SphereGeometry(0.082,10,8),eyeMaterial);
  cere.scale.set(1,0.86,0.7);
  cere.position.set(0,0.33,1.2);
  falcon.add(cere);

  [-1,1].forEach(side=>{
    const eye=new THREE.Mesh(new THREE.SphereGeometry(0.055,10,8),eyeMaterial);
    eye.position.set(side*0.16,0.4,1.19);
    falcon.add(eye);

    const talon=new THREE.Mesh(new THREE.ConeGeometry(0.055,0.3,6),beakMaterial);
    talon.rotation.x=Math.PI*0.62;
    talon.position.set(side*0.15,-0.4,0.34);
    falcon.add(talon);
  });

  const wingGeometry=panel(wingShape(),0.05);
  [-1,1].forEach(side=>{
    const wing=new THREE.Group();
    const membrane=new THREE.Mesh(wingGeometry,wingMaterial);
    membrane.scale.set(3.5,1,2.5);
    wing.add(membrane);

    const shoulder=new THREE.Mesh(new THREE.SphereGeometry(0.3,12,10),bodyMaterial);
    shoulder.scale.set(0.9,0.7,1.3);
    shoulder.position.set(side*0.26,0.06,0.16);
    wing.add(shoulder);

    wing.position.set(0,0.1,0.12);
    wing.rotation.set(-0.34,side<0?Math.PI:0,side*0.3);
    falcon.add(wing);
  });

  const tail=new THREE.Mesh(panel(tailShape(),0.045),wingMaterial);
  tail.scale.set(1.9,1,1.5);
  tail.position.set(0,0.04,-1.02);
  tail.rotation.x=0.18;
  falcon.add(tail);

  const tailBand=new THREE.Mesh(new THREE.ConeGeometry(0.42,0.34,6),trimMaterial);
  tailBand.rotation.x=-Math.PI/2;
  tailBand.scale.set(1.5,1,0.28);
  tailBand.position.set(0,0.06,-1.72);
  falcon.add(tailBand);

  falcon.rotation.set(-0.08,0.32,-0.16);
  falcon.position.set(0.7,0.35,0);
  falcon.scale.setScalar(1.12);

  return {falcon,materials:{body:bodyMaterial,wing:wingMaterial,trim:trimMaterial}};
}

function buildSkyDisc(theme){
  const material=new THREE.ShaderMaterial({
    transparent:true,
    depthWrite:false,
    uniforms:{
      uColor:{value:new THREE.Color(theme.isDark?theme.gold:theme.goldBright)},
      uStrength:{value:discStrength(theme)}
    },
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:[
      'varying vec2 vUv;',
      'uniform vec3 uColor;',
      'uniform float uStrength;',
      'void main(){',
      'float d=length(vUv-0.5)*2.0;',
      'float halo=pow(smoothstep(1.0,0.0,d),2.4);',
      'float ring=smoothstep(0.88,0.6,d)*smoothstep(0.26,0.56,d);',
      'float alpha=(halo*0.74+ring*0.16)*uStrength;',
      'if(alpha<0.002)discard;',
      'gl_FragColor=vec4(uColor,alpha);',
      '}'
    ].join('\n')
  });
  const disc=new THREE.Mesh(new THREE.CircleGeometry(3.4,64),material);
  disc.position.set(0.7,0.4,-1.6);
  return {disc,material};
}

function applyTheme(theme,scene,parts,sky,lights,renderer){
  parts.materials.body.color.set(theme.gold);
  parts.materials.wing.color.set(theme.goldDeep);
  parts.materials.trim.color.set(theme.goldBright);
  sky.material.uniforms.uColor.value.set(theme.isDark?theme.nightBright:theme.goldBright);
  scene.fog.color.set(theme.isDark?theme.night:theme.paper);
  lights.key.color.set(theme.isDark?'#ffe6b8':'#fff3d8');
  lights.rim.color.set(theme.isDark?'#9fc0d8':'#e6d3ae');
  lights.hemi.color.set(theme.isDark?'#2b2a33':'#fdf3e0');
  lights.hemi.groundColor.set(theme.isDark?theme.night:'#c9b58f');
  renderer.toneMappingExposure=theme.isDark?1.16:1.04;
}

function supportsFalcon(){
  if(typeof window==='undefined'||typeof document==='undefined')return false;
  if(document.documentElement.dataset.performance==='lite')return false;
  const conn=navigator.connection;
  if(conn&&conn.saveData)return false;
  if(typeof navigator.deviceMemory==='number'&&navigator.deviceMemory<=2)return false;
  if(!window.matchMedia('(prefers-reduced-motion: no-preference)').matches)return false;
  try{
    const probe=document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext&&(probe.getContext('webgl2')||probe.getContext('webgl')));
  }catch(error){
    return false;
  }
}

export function mountFalcon3D(host){
  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  }catch(error){
    return ()=>{};
  }

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,0.1,100);
  camera.position.set(0,0,8.6);

  const hemi=new THREE.HemisphereLight(0xfdf3e0,0xc9b58f,1.35);
  const key=new THREE.DirectionalLight(0xfff3d8,2.6);
  key.position.set(-3.2,4.4,5.2);
  const rim=new THREE.DirectionalLight(0xe6d3ae,1.7);
  rim.position.set(4.6,-1.2,-4.4);
  const fill=new THREE.DirectionalLight(0xffffff,0.5);
  fill.position.set(0,-3,2);
  scene.add(hemi,key,rim,fill);
  const lights={hemi,key,rim};

  let theme=palette();
  scene.fog=new THREE.Fog(theme.isDark?theme.night:theme.paper,7.4,15);
  const parts=buildFalcon(theme);
  const sky=buildSkyDisc(theme);
  const rig=new THREE.Group();
  rig.add(parts.falcon,sky.disc);
  rig.position.set(0.6,0.3,0);
  scene.add(rig);

  renderer.setClearAlpha(0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);
  renderer.domElement.className='falcon-3d-canvas';
  renderer.domElement.setAttribute('aria-hidden','true');

  const pointer={x:0,y:0,tx:0,ty:0};
  let frame=0;
  let running=false;
  let visible=true;
  let lastPointerAt=-1e9;
  let lastFrameAt=0;
  let nextAmbientAt=0;
  let width=0;
  let height=0;

  const draw=now=>{
    frame=0;
    if(!running)return;

    /* Ambient cruise runs whether or not the cursor moves. While the pointer is
       idle we still pay for a rAF callback but only render at AMBIENT_FPS, so a
       static cursor costs a fraction of the GPU work. */
    const pointerActive=now-lastPointerAt<POINTER_ACTIVE_MS;
    if(!pointerActive){
      if(now<nextAmbientAt){frame=requestAnimationFrame(draw);return}
      nextAmbientAt=now+AMBIENT_FRAME_MS;
    }

    const dt=lastFrameAt?Math.min(0.1,(now-lastFrameAt)/1000):1/AMBIENT_FPS;
    lastFrameAt=now;
    const blend=1-Math.pow(pointerActive?0.9:0.86,dt*60);
    pointer.x+=(pointer.tx-pointer.x)*blend;
    pointer.y+=(pointer.ty-pointer.y)*blend;

    const seconds=now*0.001;
    const sway=Math.sin(seconds*1.05)*0.88+Math.sin(seconds*2.13+0.4)*0.12;
    const bob=Math.sin(seconds*1.5+0.6);
    const bank=Math.sin(seconds*2.1+0.3);
    const {x,y}=pointer;

    parts.falcon.rotation.y=0.32+sway*0.5+x*0.52;
    parts.falcon.rotation.x=-0.08+bob*0.08-y*0.34;
    parts.falcon.rotation.z=-0.16+bank*0.17+x*0.2;
    rig.rotation.y=sway*0.08+x*0.2;
    rig.position.set(0.6+sway*0.48+x*0.5,0.3+bob*0.11-y*0.36,0);
    sky.material.uniforms.uStrength.value=discStrength(theme)*(0.94+bob*0.08);

    camera.position.set(sway*0.18+x*0.5,-y*0.3,8.6);
    camera.lookAt(0.2,0.1,0);
    renderer.render(scene,camera);
    frame=requestAnimationFrame(draw);
  };

  const sync=()=>{
    const shouldRun=visible&&!document.hidden;
    if(shouldRun&&!running){
      running=true;
      lastFrameAt=0;
      nextAmbientAt=0;
      frame=requestAnimationFrame(draw);
    }else if(!shouldRun&&running){
      running=false;
      if(frame)cancelAnimationFrame(frame);
      frame=0;
    }
  };

  const renderStill=()=>renderer.render(scene,camera);

  const resize=()=>{
    const box=host.getBoundingClientRect();
    const nextWidth=Math.max(1,Math.round(box.width));
    const nextHeight=Math.max(1,Math.round(box.height));
    if(nextWidth===width&&nextHeight===height)return;
    width=nextWidth;
    height=nextHeight;
    const lite=document.documentElement.dataset.performance==='lite';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,lite?LITE_PIXEL_RATIO:MAX_PIXEL_RATIO));
    renderer.setSize(width,height,false);
    camera.aspect=width/height;
    camera.updateProjectionMatrix();
    if(!frame)renderStill();
  };

  const onPointer=event=>{
    if(event.pointerType==='touch')return;
    pointer.tx=Math.max(-1,Math.min(1,(event.clientX/window.innerWidth)*2-1));
    pointer.ty=Math.max(-1,Math.min(1,(event.clientY/window.innerHeight)*2-1));
    lastPointerAt=performance.now();
    sync();
  };

  const onLeave=()=>{
    pointer.tx=0;
    pointer.ty=0;
    lastPointerAt=performance.now();
  };

  const onVisibility=()=>sync();

  const resizeObserver=new ResizeObserver(resize);
  resizeObserver.observe(host);

  const intersectionObserver=new IntersectionObserver(entries=>{
    visible=entries.some(entry=>entry.isIntersecting);
    sync();
  },{threshold:0});
  intersectionObserver.observe(host);

  document.addEventListener('visibilitychange',onVisibility);

  const themeObserver=new MutationObserver(()=>{
    theme=palette();
    applyTheme(theme,scene,parts,sky,lights,renderer);
    resize();
    if(!running)renderStill();
  });
  themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','data-performance']});

  const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
  if(finePointer.matches)window.addEventListener('pointermove',onPointer,{passive:true});
  window.addEventListener('blur',onLeave,{passive:true});

  resize();
  sync();

  return ()=>{
    running=false;
    if(frame)cancelAnimationFrame(frame);
    frame=0;
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange',onVisibility);
    window.removeEventListener('pointermove',onPointer);
    window.removeEventListener('blur',onLeave);
    scene.traverse(node=>{
      if(node.geometry)node.geometry.dispose();
      const material=node.material;
      if(Array.isArray(material))material.forEach(entry=>entry.dispose&&entry.dispose());
      else if(material&&material.dispose)material.dispose();
    });
    renderer.dispose();
    if(renderer.domElement.parentNode===host)host.removeChild(renderer.domElement);
  };
}

export default function Falcon3DLayer(){
  const layerRef=useRef(null);
  const stageRef=useRef(null);

  useEffect(()=>{
    const stage=stageRef.current;
    if(!stage||!supportsFalcon())return undefined;
    let teardown=()=>{};
    let cancelled=false;
    const start=()=>{
      if(cancelled)return;
      teardown=mountFalcon3D(stage);
      if(layerRef.current)layerRef.current.classList.add('is-ready');
    };
    const idle=window.requestIdleCallback
      ?window.requestIdleCallback(start,{timeout:900})
      :window.setTimeout(start,220);
    return ()=>{
      cancelled=true;
      if(window.cancelIdleCallback)window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      teardown();
    };
  },[]);

  return <div className="falcon-3d-layer" ref={layerRef} aria-hidden="true" role="presentation" data-falcon-3d="home-hero">
    <span className="falcon-3d-stage" ref={stageRef}/>
    <span className="falcon-3d-scrim"/>
  </div>;
}
