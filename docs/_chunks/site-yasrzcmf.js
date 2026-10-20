import{L}from"./site-4jk2y6d1.js";import{ge,ad,hr,ar,Qs,Ly,es,ld}from"./site-7zkm9jby.js";import{fo,Zs,Va,ii,O,X,Bc,B,Hl,p,fs,$r,Br}from"./site-w6hmvdms.js";import{he}from"./site-n0enj7e7.js";import{_}from"./site-4h1ky90k.js";import{J,n,gi,eh,Zr}from"./site-rcaz5bsy.js";import{Ut}from"./site-xynfywsg.js";import{h,G,lr,A,k,g,e,R,d,l,a,u,S,ce,Ai,wr,x,Kt}from"./site-ky7rmxkt.js";import{me}from"./site-yscgk7km.js";import{c}from"./site-h3pwfkan.js";var Ie={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};Ly();ld();Bc();var Ft,qt;class ks extends p{_isShaderMaterial(t){if(!t)return!1;return t.getClassName()==="ShaderMaterial"}constructor(t,s=null,i=null,r=null,o,m,f,y){super(t,s,i,r,o);if(this.useVertexColor=m,this.useVertexAlpha=f,this.color=new u(1,1,1),this.alpha=1,this._shaderLanguage=0,this._ownsMaterial=!1,r)this.color=r.color.clone(),this.alpha=r.alpha,this.useVertexColor=r.useVertexColor,this.useVertexAlpha=r.useVertexAlpha;this.intersectionThreshold=0.1;let M=[],v={attributes:[n.PositionKind],uniforms:["world","viewProjection"],needAlphaBlending:!0,defines:M,useClipPlane:null,shaderLanguage:0};if(!this.useVertexAlpha)v.needAlphaBlending=!1;else v.defines.push("#define VERTEXALPHA");if(!this.useVertexColor)v.uniforms.push("color"),this._color4=new S;else v.defines.push("#define VERTEXCOLOR"),v.attributes.push(n.ColorKind);if(y)this.material=y;else{if(this.getScene().getEngine().isWebGPU&&!ks.ForceGLSL)this._shaderLanguage=1;v.shaderLanguage=this._shaderLanguage,v.extraInitializationsAsync=async()=>{if(this._shaderLanguage===1)await Promise.all([(h("zmcm853k"),import("./color.vertex-zmcm853k.js")),(h("6gjvc2sp"),import("./color.fragment-6gjvc2sp.js"))]);else await Promise.all([(h("gn11ev4t"),import("./color.vertex-gn11ev4t.js")),(h("32w5h4bm"),import("./color.fragment-32w5h4bm.js"))])};let D=new ge("colorShader",this.getScene(),"color",v,!1);D.doNotSerialize=!0,this._ownsMaterial=!0,this._setInternalMaterial(D)}}getClassName(){return"LinesMesh"}get material(){return this._internalAbstractMeshDataInfo._material}set material(t){let s=this.material;if(s===t)return;let i=s&&this._ownsMaterial;if(this._ownsMaterial=!1,this._setInternalMaterial(t),i)s?.dispose()}_setInternalMaterial(t){if(this._setMaterial(t),this.material)this.material.fillMode=B.LineListDrawMode,this.material.disableLighting=!0}get checkCollisions(){return!1}set checkCollisions(t){}_bind(t,s){if(!this._geometry)return this;let i=this.isUnIndexed?null:this._geometry.getIndexBuffer();if(!this._userInstancedBuffersStorage||this.hasThinInstances)this._geometry._bind(s,i);else this._geometry._bind(s,i,this._userInstancedBuffersStorage.vertexBuffers,this._userInstancedBuffersStorage.vertexArrayObjects);if(!this.useVertexColor&&this._isShaderMaterial(this.material)){let{r,g:o,b:m}=this.color;this._color4.set(r,o,m,this.alpha),this.material.setColor4("color",this._color4)}return this}_draw(t,s,i){if(!this._geometry||!this._geometry.getVertexBuffers()||!this._unIndexed&&!this._geometry.getIndexBuffer())return this;let r=this.getScene().getEngine();if(this._unIndexed)r.drawArraysType(B.LineListDrawMode,t.verticesStart,t.verticesCount,i);else r.drawElementsType(B.LineListDrawMode,t.indexStart,t.indexCount,i);return this}dispose(t,s=!1,i){if(!i){if(this._ownsMaterial)this.material?.dispose(!1,!1,!0);else if(s)this.material?.dispose(!1,!1,!0)}super.dispose(t)}clone(t,s=null,i){if(s&&s._addToSceneRootNodes===void 0){let r=s;return r.source=this,new ks(t,this.getScene(),r.parent,r.source,r.doNotCloneChildren)}return new ks(t,this.getScene(),s,this,i)}createInstance(t){let s=new uc(t,this);if(this.instancedBuffers){s.instancedBuffers={};for(let i in this.instancedBuffers)s.instancedBuffers[i]=this.instancedBuffers[i]}return s}serialize(t){super.serialize(t),t.color=this.color.asArray(),t.alpha=this.alpha}static Parse(t,s){let i=new ks(t.name,s);return i.color=u.FromArray(t.color),i.alpha=t.alpha,i}}ks.ForceGLSL=!1;class uc extends fs{constructor(t,s){super(t,s);this.intersectionThreshold=s.intersectionThreshold}getClassName(){return"InstancedLinesMesh"}}var Pt=!1;function ev(){if(Pt)return;Pt=!0,p._LinesMeshParser=(t,s)=>ks.Parse(t,s)}(Ft=ks.prototype).enableEdgesRendering??(Ft.enableEdgesRendering=ce("LinesMesh","enableEdgesRendering"));(qt=uc.prototype).enableEdgesRendering??(qt.enableEdgesRendering=ce("InstancedLinesMesh","enableEdgesRendering"));function tv(t){let s=[],i=[],{lines:r,colors:o}=t,m=[],f=0;for(let M=0;M<r.length;M++){let v=r[M];for(let b=0;b<v.length;b++){let{x:D,y:T,z:P}=v[b];if(i.push(D,T,P),o){let z=o[M],{r:W,g:E,b:w,a:q}=z[b];m.push(W,E,w,q)}if(b>0)s.push(f-1),s.push(f);f++}}let y=new O;if(y.indices=s,y.positions=i,o)y.colors=m;return y}function iv(t){let s=t.dashSize||3,i=t.gapSize||1,r=t.dashNb||200,o=t.points,m=[],f=[],y=e.Zero(),M=0,v,b,D=0,T;for(T=0;T<o.length-1;T++)o[T+1].subtractToRef(o[T],y),M+=y.length();let P=M/r,z=s*P/(s+i);for(T=0;T<o.length-1;T++){o[T+1].subtractToRef(o[T],y),v=Math.floor(y.length()/P),y.normalize();for(let E=0;E<v;E++)b=P*E,m.push(o[T].x+b*y.x,o[T].y+b*y.y,o[T].z+b*y.z),m.push(o[T].x+(b+z)*y.x,o[T].y+(b+z)*y.y,o[T].z+(b+z)*y.z),f.push(D,D+1),D+=2}let W=new O;return W.positions=m,W.indices=f,W}function Bs(t,s,i=null){let{instance:r,lines:o,colors:m}=s;if(r){let v=r.getVerticesData(n.PositionKind),b,D;if(m)b=r.getVerticesData(n.ColorKind);let T=0,P=0;for(let z=0;z<o.length;z++){let W=o[z];for(let E=0;E<W.length;E++){if(v[T]=W[E].x,v[T+1]=W[E].y,v[T+2]=W[E].z,m&&b)D=m[z],b[P]=D[E].r,b[P+1]=D[E].g,b[P+2]=D[E].b,b[P+3]=D[E].a,P+=4;T+=3}}if(r.updateVerticesData(n.PositionKind,v,!1,!1),m&&b)r.updateVerticesData(n.ColorKind,b,!1,!1);return r.refreshBoundingInfo(),r}let y=new ks(t,i,null,void 0,void 0,m?!0:!1,s.useVertexAlpha,s.material);return tv(s).applyToMesh(y,s.updatable),y}function Ir(t,s,i=null){let r=s.colors?[s.colors]:null;return Bs(t,{lines:[s.points],updatable:s.updatable,instance:s.instance,colors:r,useVertexAlpha:s.useVertexAlpha,material:s.material},i)}function bh(t,s,i=null){let{points:r,instance:o}=s,m=s.gapSize||1,f=s.dashSize||3;if(o){let v=(b)=>{let D=e.Zero(),T=b.length/6,P=0,z,W,E=0,w,q;for(w=0;w<r.length-1;w++)r[w+1].subtractToRef(r[w],D),P+=D.length();let C=P/T,I=o._creationDataStorage.dashSize,U=o._creationDataStorage.gapSize,F=I*C/(I+U);for(w=0;w<r.length-1;w++){r[w+1].subtractToRef(r[w],D),z=Math.floor(D.length()/C),D.normalize(),q=0;while(q<z&&E<b.length)W=C*q,b[E]=r[w].x+W*D.x,b[E+1]=r[w].y+W*D.y,b[E+2]=r[w].z+W*D.z,b[E+3]=r[w].x+(W+F)*D.x,b[E+4]=r[w].y+(W+F)*D.y,b[E+5]=r[w].z+(W+F)*D.z,E+=6,q++}while(E<b.length)b[E]=r[w].x,b[E+1]=r[w].y,b[E+2]=r[w].z,E+=3};if(s.dashNb||s.dashSize||s.gapSize||s.useVertexAlpha||s.material)c.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return o.updateMeshPositions(v,!1),o}let y=new ks(t,i,null,void 0,void 0,void 0,s.useVertexAlpha,s.material);return iv(s).applyToMesh(y,s.updatable),y._creationDataStorage=new Hl,y._creationDataStorage.dashSize=f,y._creationDataStorage.gapSize=m,y}var JE={CreateDashedLines:bh,CreateLineSystem:Bs,CreateLines:Ir},kt=!1;function rv(){if(kt)return;kt=!0,O.CreateLineSystem=tv,O.CreateDashedLines=iv,p.CreateLines=(t,s,i=null,r=!1,o=null)=>Ir(t,{points:s,updatable:r,instance:o},i),p.CreateDashedLines=(t,s,i,r,o,m=null,f,y)=>bh(t,{points:s,dashSize:i,gapSize:r,dashNb:o,updatable:f,instance:y},m)}rv();var Bt=0.28209479177387814;async function Ce(t,s,i){return await new Promise((o,m)=>{let f=i.createCanvasImage();if(!f)throw Error("Failed to create ImageBitmap");f.onload=()=>{try{let M=i.createCanvas(f.width,f.height);if(!M)throw Error("Failed to create canvas");let v=M.getContext("2d");if(!v)throw Error("Failed to get 2D context");v.drawImage(f,0,0);let b=v.getImageData(0,0,M.width,M.height);o({bits:new Uint8Array(b.data.buffer),width:b.width,height:b.height})}catch(M){m(`Error loading image ${f.src} with exception: ${M}`)}},f.onerror=(M)=>{m(`Error loading image ${f.src} with exception: ${M}`)},f.crossOrigin="anonymous";let y;if(typeof t==="string"){if(!s)throw Error("filename is required when using a URL");f.src=t+s}else{let M=new Blob([t],{type:"image/webp"});y=URL.createObjectURL(M),f.src=y}})}async function xs(t,s,i){let r=t.count?t.count:t.means.shape[0],o=32,m=new ArrayBuffer(32*r),f=new Float32Array(m),y=new Float32Array(m),M=new Uint8ClampedArray(m),v=new Uint8ClampedArray(m),b=(w)=>Math.sign(w)*(Math.exp(Math.abs(w))-1),D=s[0].bits,T=s[1].bits;if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");for(let w=0;w<r;w++){let q=w*4;for(let C=0;C<3;C++){let I=t.means.mins[C],U=t.means.maxs[C],F=T[q+C],V=D[q+C],N=F<<8|V,K=ar.Lerp(I,U,N/65535);f[w*8+C]=b(K)}}let P=s[2].bits;if(t.version===2){if(!t.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let w=0;w<r;w++){let q=w*4;for(let C=0;C<3;C++){let I=t.scales.codebook[P[q+C]],U=Math.exp(I);y[w*8+3+C]=U}}}else{if(!Array.isArray(t.scales.mins)||!Array.isArray(t.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let w=0;w<r;w++){let q=w*4;for(let C=0;C<3;C++){let I=P[q+C],U=ar.Lerp(t.scales.mins[C],t.scales.maxs[C],I/255),F=Math.exp(U);y[w*8+3+C]=F}}}let z=s[4].bits;if(t.version===2){if(!t.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let w=0;w<r;w++){let q=w*4;for(let C=0;C<3;C++){let I=0.5+t.sh0.codebook[z[q+C]]*Bt;M[w*32+24+C]=Math.max(0,Math.min(255,Math.round(255*I)))}M[w*32+24+3]=z[q+3]}}else{if(!Array.isArray(t.sh0.mins)||!Array.isArray(t.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let w=0;w<r;w++){let q=w*4;for(let C=0;C<4;C++){let I=t.sh0.mins[C],U=t.sh0.maxs[C],F=z[q+C],V=ar.Lerp(I,U,F/255),N;if(C<3)N=0.5+V*Bt;else N=1/(1+Math.exp(-V));M[w*32+24+C]=Math.max(0,Math.min(255,Math.round(255*N)))}}}let W=(w)=>(w/255-0.5)*2/Math.SQRT2,E=s[3].bits;for(let w=0;w<r;w++){let q=E[w*4+0],C=E[w*4+1],I=E[w*4+2],U=E[w*4+3],F=W(q),V=W(C),N=W(I),K=U-252,te=F*F+V*V+N*N,j=Math.sqrt(Math.max(0,1-te)),Q;switch(K){case 0:Q=[j,F,V,N];break;case 1:Q=[F,j,V,N];break;case 2:Q=[F,V,j,N];break;case 3:Q=[F,V,N,j];break;default:throw Error("Invalid quaternion mode")}v[w*32+28+0]=Q[0]*127.5+127.5,v[w*32+28+1]=Q[1]*127.5+127.5,v[w*32+28+2]=Q[2]*127.5+127.5,v[w*32+28+3]=Q[3]*127.5+127.5}if(t.shN){let w=t.shN.bands?(t.shN.bands+1)**2-1:t.shN.shape[1]/3,q=t.shN.bands!==void 0&&t.shN.bands!==null?t.shN.bands:Math.round(Math.sqrt(w+1)-1),C=s[5].bits,I=s[6].bits,U=s[5].width,F=w*3,V=Math.ceil(F/16),K=i.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/K),j=Qs(V,te*K*4*4);if(t.version===2){if(!t.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let Q=0;Q<r;Q++){let ie=I[Q*4+0]+(I[Q*4+1]<<8),H=ie%64*w,ee=Math.floor(ie/64);for(let ne=0;ne<w;ne++)for(let se=0;se<3;se++){let le=ne*3+se,oe=Math.floor(le/16),Y=j[oe],fe=le%16,_e=Q*16,xe=t.shN.codebook[C[(H+ne)*4+se+ee*U*4]]*127.5+127.5;Y[fe+_e]=Math.max(0,Math.min(255,xe))}}}else for(let Q=0;Q<r;Q++){let ie=I[Q*4+0]+(I[Q*4+1]<<8),H=ie%64*w,ee=Math.floor(ie/64),ne=t.shN.mins,se=t.shN.maxs;for(let le=0;le<3;le++)for(let oe=0;oe<w/3;oe++){let Y=oe*3+le,fe=Math.floor(Y/16),_e=j[fe],xe=Y%16,de=Q*16,re=ar.Lerp(ne,se,C[(H+oe)*4+le+ee*U*4]/255)*127.5+127.5;_e[xe+de]=Math.max(0,Math.min(255,re))}}return await new Promise((Q)=>{Q({mode:0,data:m,hasVertexColors:!1,sh:j,shDegree:q})})}return await new Promise((w)=>{w({mode:0,data:m,hasVertexColors:!1})})}async function zt(t,s,i){let r,o;if(t instanceof Map){o=t;let y=o.get("meta.json");if(!y)throw Error("meta.json not found in files Map");r=JSON.parse(new TextDecoder().decode(y))}else r=t;let m=[...r.means.files,...r.scales.files,...r.quats.files,...r.sh0.files];if(r.shN)m.push(...r.shN.files);let f=await Promise.all(m.map(async(y)=>{if(o&&o.has(y)){let M=o.get(y);return await Ce(M,y,i.getEngine())}else return await Ce(s,y,i.getEngine())}));return await xs(r,f,i)}function ys(t,s,i,r){let o=new he(s,i,r,_.TEXTUREFORMAT_RGBA,t,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE);return o.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,o.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE,o}function Qe(t,s){return ys(t,s.bits,s.width,s.height)}async function Ye(t,s,i){let r=i.getEngine();if(typeof createImageBitmap==="function")try{let m=s.toLowerCase().endsWith(".png")?"image/png":"image/webp",f;if(typeof t==="string"){let M=await x.LoadFileAsync(t+s,!0);f=new Blob([M],{type:m})}else f=new Blob([t],{type:m});let y=await createImageBitmap(f,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let M=new he(null,y.width,y.height,_.TEXTUREFORMAT_RGBA,i,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE);M.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,M.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE;let v=M.getInternalTexture();if(v)r.updateDynamicTexture(v,y,!1,!1);return M}finally{y.close()}}catch{}let o=await Ce(t,s,r);return Qe(i,o)}function Ss(t,s,i,r){let o=(f)=>Math.sign(f)*(Math.exp(Math.abs(f))-1);if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");let m=new Float32Array(r*4);for(let f=0;f<r;f++){let y=f*4;for(let M=0;M<3;M++){let v=i[y+M]<<8|s[y+M],b=ar.Lerp(t.means.mins[M],t.means.maxs[M],v/65535);m[f*4+M]=o(b)}m[f*4+3]=1}return m}async function Le(t,s,i,r=!0,o,m){let f,y;if(t instanceof Map){y=t;let H=y.get("meta.json");if(!H)throw Error("meta.json not found in files Map");f=JSON.parse(new TextDecoder().decode(H))}else f=t;let M=async(H)=>{if(y&&y.has(H))return await Ce(y.get(H),H,i.getEngine());if(o){let ee=new Uint8Array(await o.loadFileAsync(s+H,m));return await Ce(ee,H,i.getEngine())}return await Ce(s,H,i.getEngine())},v=async(H)=>{if(y&&y.has(H))return await Ye(y.get(H),H,i);if(o){let ee=new Uint8Array(await o.loadFileAsync(s+H,m));return await Ye(ee,H,i)}return await Ye(s,H,i)},b=[...f.scales.files,...f.quats.files,...f.sh0.files,...f.shN?.files??[]],D,T,P,z,W=null,E;if(r){let[H,ee]=await Promise.all([Promise.all(f.means.files.map(M)),Promise.all(b.map(v))]);W=[H[0],H[1]],E=ee,D=Qe(i,H[0]),T=Qe(i,H[1]),P=H[0].width,z=H[0].height}else{let[H,ee]=await Promise.all([Promise.all(f.means.files.map(v)),Promise.all(b.map(v))]);E=ee,D=H[0],T=H[1];let ne=D.getSize();P=ne.width,z=ne.height}let w=f.count??f.means.shape[0],q=P*z;if(q<w)throw Error(`SOG texture contains ${q} texels, but metadata references ${w} splats.`);let C=E[0],I=E[1],U=E[2],F,V,N=0,K=0;if(f.shN&&E.length>=5)F=E[3],V=E[4],N=f.shN.bands?(f.shN.bands+1)**2-1:f.shN.shape[1]/3,K=f.shN.bands??Math.round(Math.sqrt(N+1)-1);let te;if(f.version===2){let ee=new Float32Array(768);if(f.scales.codebook)ee.set(f.scales.codebook.slice(0,256),0);if(f.sh0.codebook)ee.set(f.sh0.codebook.slice(0,256),256);if(f.shN?.codebook)ee.set(f.shN.codebook.slice(0,256),512);te=new he(ee,768,1,_.TEXTUREFORMAT_R,i,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT),te.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,te.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE}let j=f.means.mins,Q=f.means.maxs,ie={version:f.version===2?2:1,splatCount:w,shDegree:K,meansTextureL:D,meansTextureU:T,scalesTexture:C,quatsTexture:I,sh0Texture:U,shCentroidsTexture:F,shLabelsTexture:V,codebookTexture:te,meansMin:[j[0],j[1],j[2]],meansMax:[Q[0],Q[1],Q[2]],scalesMin:Array.isArray(f.scales.mins)?[f.scales.mins[0],f.scales.mins[1],f.scales.mins[2]]:void 0,scalesMax:Array.isArray(f.scales.maxs)?[f.scales.maxs[0],f.scales.maxs[1],f.scales.maxs[2]]:void 0,sh0Min:Array.isArray(f.sh0.mins)?[f.sh0.mins[0],f.sh0.mins[1],f.sh0.mins[2],f.sh0.mins[3]]:void 0,sh0Max:Array.isArray(f.sh0.maxs)?[f.sh0.maxs[0],f.sh0.maxs[1],f.sh0.maxs[2],f.sh0.maxs[3]]:void 0,shnMin:typeof f.shN?.mins==="number"?f.shN.mins:void 0,shnMax:typeof f.shN?.maxs==="number"?f.shN.maxs:void 0,shCoeffCount:N,positions:W?Ss(f,W[0].bits,W[1].bits,w):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:K,sogTextures:ie}}ad();var Me=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,It=`precision highp float;
precision highp int;

uniform sampler2D sogMeansLTex;
uniform sampler2D sogMeansUTex;
uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogSh0Tex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogMeansMin;
uniform vec3 sogMeansMax;
uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform vec4 sogSh0Min;
uniform vec4 sogSh0Max;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[4];

mat3 transposeM(mat3 m) {
    return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 mL = texelFetch(sogMeansLTex, src, 0).xyz;
    vec3 mU = texelFetch(sogMeansUTex, src, 0).xyz;
    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);
    vec4 c0 = texelFetch(sogSh0Tex, src, 0);

    // Position: q16 = (u<<8)|l normalized; n = lerp(min,max,q16); pos = sign(n)*(exp(|n|)-1)
    vec3 q16 = (mU * 256.0 + mL) * (255.0 / 65535.0);
    vec3 nPos = mix(sogMeansMin, sogMeansMax, q16);
    vec3 center = sign(nPos) * (exp(abs(nPos)) - vec3(1.0));

    // Scale (v1: lerp+exp ; v2: codebook lookup)
    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    // Quaternion (largest-omitted, mode in alpha as 252 + omitted-index)
    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    mat3 S2 = mat3(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    mat3 Sigma = R * S2 * transposeM(R);

    // Color (sh0)
    const float SH_C0 = 0.28209479177387814;
    vec3 colRgb;
    float colA;
    if (uVersion == 2) {
        vec3 c3;
        c3.x = texelFetch(sogCodebookTex, ivec2(256 + int(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = texelFetch(sogCodebookTex, ivec2(256 + int(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = texelFetch(sogCodebookTex, ivec2(256 + int(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        vec4 cLerp = mix(sogSh0Min, sogSh0Max, c0);
        colRgb = vec3(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    glFragData[0] = vec4(center, 1.0);
    glFragData[1] = vec4(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    glFragData[2] = vec4(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    glFragData[3] = vec4(colRgb, colA);
}
`,be=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,Et=`
var sogMeansLTexSampler : sampler;
var sogMeansLTex : texture_2d<f32>;
var sogMeansUTexSampler : sampler;
var sogMeansUTex : texture_2d<f32>;
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogSh0TexSampler : sampler;
var sogSh0Tex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogMeansMin : vec3<f32>;
uniform sogMeansMax : vec3<f32>;
uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform sogSh0Min : vec4<f32>;
uniform sogSh0Max : vec4<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let mL : vec3<f32> = textureLoad(sogMeansLTex, src, 0).xyz;
    let mU : vec3<f32> = textureLoad(sogMeansUTex, src, 0).xyz;
    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);
    let c0 : vec4<f32> = textureLoad(sogSh0Tex, src, 0);

    let q16 : vec3<f32> = (mU * 256.0 + mL) * (255.0 / 65535.0);
    let nPos : vec3<f32> = mix(uniforms.sogMeansMin, uniforms.sogMeansMax, q16);
    let center : vec3<f32> = sign(nPos) * (exp(abs(nPos)) - vec3<f32>(1.0));

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    let S2 : mat3x3<f32> = mat3x3<f32>(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    let Sigma : mat3x3<f32> = R * S2 * transpose(R);

    let SH_C0 : f32 = 0.28209479177387814;
    var colRgb : vec3<f32>;
    var colA : f32;
    if (uniforms.uVersion == 2) {
        var c3 : vec3<f32>;
        c3.x = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3<f32>(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        let cLerp : vec4<f32> = mix(uniforms.sogSh0Min, uniforms.sogSh0Max, c0);
        colRgb = vec3<f32>(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    fragmentOutputs.fragData0 = vec4<f32>(center, 1.0);
    fragmentOutputs.fragData1 = vec4<f32>(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    fragmentOutputs.fragData2 = vec4<f32>(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    fragmentOutputs.fragData3 = vec4<f32>(colRgb, colA);
}
`,Ot="gsSogRotDecodeToWorkBuffer",Wt=`precision highp float;
precision highp int;

uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);

    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    glFragData[0] = vec4(R[0], R[1].x);
    glFragData[1] = vec4(R[1].y, R[1].z, R[2].x, R[2].y);
    glFragData[2] = vec4(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,Vt=`
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    fragmentOutputs.fragData0 = vec4<f32>(R[0], R[1].x);
    fragmentOutputs.fragData1 = vec4<f32>(R[1].y, R[1].z, R[2].x, R[2].y);
    fragmentOutputs.fragData2 = vec4<f32>(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,Gt="gsSogShDecodeToWorkBuffer",Nt=`precision highp float;
precision highp int;

uniform sampler2D sogShLabelsTex;
uniform sampler2D sogShCentroidsTex;
uniform sampler2D sogCodebookTex;
uniform float sogShnMin;
uniform float sogShnMax;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;
uniform int uCoeffs;
uniform int uShTextureIndex;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int kLocal = global - uOffset;

    // 16-bit label for this source splat (LSB in r, MSB in g), indexed over the labels texture's own width.
    ivec2 lsz = textureSize(sogShLabelsTex, 0);
    ivec2 lsrc = ivec2(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    vec4 labelRaw = texelFetch(sogShLabelsTex, lsrc, 0);
    int n = int(labelRaw.r * 255.0 + 0.5) + int(labelRaw.g * 255.0 + 0.5) * 256;
    int u = (n - (n / 64) * 64) * uCoeffs;
    int v = n / 64;

    uint packed0 = 0u;
    uint packed1 = 0u;
    uint packed2 = 0u;
    uint packed3 = 0u;

    for (int b = 0; b < 16; b++) {
        int s = uShTextureIndex * 16 + b; // flat SH scalar index
        int kc = s / 3;                    // higher-order coefficient (0-based)
        int j = s - kc * 3;                // channel (0=r,1=g,2=b)
        float byteVal = 128.0;             // neutral (decompose(128) ~= 0)
        if (kc < uCoeffs) {
            vec4 centroidRaw = texelFetch(sogShCentroidsTex, ivec2(u + kc, v), 0);
            float ch = (j == 0) ? centroidRaw.r : ((j == 1) ? centroidRaw.g : centroidRaw.b);
            float coeff;
            if (uVersion == 2) {
                int cidx = int(ch * 255.0 + 0.5);
                coeff = texelFetch(sogCodebookTex, ivec2(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(sogShnMin, sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        uint bv = uint(byteVal + 0.5);
        int comp = b / 4;
        uint contrib = bv << uint((b - comp * 4) * 8);
        if (comp == 0) { packed0 |= contrib; }
        else if (comp == 1) { packed1 |= contrib; }
        else if (comp == 2) { packed2 |= contrib; }
        else { packed3 |= contrib; }
    }
    outSh = uvec4(packed0, packed1, packed2, packed3);
}
`,Xt=`
var sogShLabelsTexSampler : sampler;
var sogShLabelsTex : texture_2d<f32>;
var sogShCentroidsTexSampler : sampler;
var sogShCentroidsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogShnMin : f32;
uniform sogShnMax : f32;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;
uniform uCoeffs : i32;
uniform uShTextureIndex : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let kLocal : i32 = global - uniforms.uOffset;

    let lsz : vec2<i32> = vec2<i32>(textureDimensions(sogShLabelsTex, 0));
    let lsrc : vec2<i32> = vec2<i32>(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    let labelRaw : vec4<f32> = textureLoad(sogShLabelsTex, lsrc, 0);
    let n : i32 = i32(labelRaw.r * 255.0 + 0.5) + i32(labelRaw.g * 255.0 + 0.5) * 256;
    let u : i32 = (n - (n / 64) * 64) * uniforms.uCoeffs;
    let v : i32 = n / 64;

    var packed : array<u32, 4> = array<u32, 4>(0u, 0u, 0u, 0u);

    for (var b : i32 = 0; b < 16; b = b + 1) {
        let s : i32 = uniforms.uShTextureIndex * 16 + b;
        let kc : i32 = s / 3;
        let j : i32 = s - kc * 3;
        var byteVal : f32 = 128.0;
        if (kc < uniforms.uCoeffs) {
            let centroidRaw : vec4<f32> = textureLoad(sogShCentroidsTex, vec2<i32>(u + kc, v), 0);
            var ch : f32 = centroidRaw.b;
            if (j == 0) { ch = centroidRaw.r; } else if (j == 1) { ch = centroidRaw.g; }
            var coeff : f32;
            if (uniforms.uVersion == 2) {
                let cidx : i32 = i32(ch * 255.0 + 0.5);
                coeff = textureLoad(sogCodebookTex, vec2<i32>(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(uniforms.sogShnMin, uniforms.sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        let bv : u32 = u32(byteVal + 0.5);
        let comp : i32 = b / 4;
        packed[comp] = packed[comp] | (bv << u32((b - comp * 4) * 8));
    }
    fragmentOutputs.fragData0 = vec4<u32>(packed[0], packed[1], packed[2], packed[3]);
}
`,Ht="gsWorkBufferRelayout",Zt=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform sampler2D uSrc3;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged):
//   uSrcBaseOffset — added to the map's (region-local) source index so pass 1 reads the correct GLOBAL atlas texel.
//   uDstBaseRow    — subtracted from the atlas destination row so pass 2's identity copy reads the region-local temp.
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[4];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
    glFragData[3] = texelFetch(uSrc3, s, 0);
}
`,jt="gsWorkBufferShCopy",Yt=`precision highp float;
precision highp int;
precision highp usampler2D;

uniform sampler2D uMapTex;
uniform usampler2D uSrcSh;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    outSh = texelFetch(uSrcSh, s, 0);
}
`,Qt=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
// Integer source sampled via textureLoad only — NO paired sampler (a sampler on a Uint texture fails WebGPU
// validation: "None of the supported sample types (Uint)"). Mirrors the draw shader's shTexture0 declaration.
var uSrcSh : texture_2d<u32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    // Wrap in an explicit vec4<u32> so the WGSL processor emits an integer fragData location (its detection keys
    // off a literal vec4<u32>/vec4u in the assignment; a bare textureLoad(...) would default to vec4<f32>).
    fragmentOutputs.fragData0 = vec4<u32>(textureLoad(uSrcSh, s, 0));
}
`,$t="gsWorkBufferRotCopy",Jt=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
}
`,ts=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
}
`,ss=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;
var uSrc3Sampler : sampler;
var uSrc3 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged).
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
    fragmentOutputs.fragData3 = textureLoad(uSrc3, s, 0);
}
`;class Ee{get supportsAsyncCentersReadback(){let t=this._scene.getEngine();if(t.isWebGPU)return!0;let s=t;return!!s._gl&&typeof s._readPixelsAsync==="function"&&(s.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((t)=>t.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(t,s,i,r,o){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=t,this._shaderLanguage=t.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,s),i)this._mrt=i.mrt,this._textureSize=i.width,this._baseOffset=i.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,s)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(r&&r.textureCount>0){if(r.externalMrts)this._shMrts=r.externalMrts.slice(0,r.textureCount),this._ownsShMrts=!1;else{for(let m=0;m<r.textureCount;m++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${m}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(o){if(o.externalMrt)this._rotMrt=o.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(t){if(!this._ownsMrt)this._mrt=t}rebindShAtlas(t){if(!this._ownsShMrts&&t&&this._shMrts.length)this._shMrts=t.slice(0,this._shMrts.length)}rebindRotAtlas(t){if(!this._ownsRotMrt&&t&&this._rotMrt)this._rotMrt=t}setBaseOffset(t){if(!this._ownsMrt)this._baseOffset=t}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){c.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,t,s);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,t,t,0,-i),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((r,o)=>this._createShMrt(`gsShAtlasBackup${o}`,!1,t,s));for(let r=0;r<this._shMrts.length;r++)this._renderShCopyPass(this._backupShMrts[r],this._shMrts[r].textures[0],this._mrt.textures[0],0,t,t,0,-i)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,t,s);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,t,t,0,-i)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t),r=this._scene.getEngine();r.enableScissor(0,i,t,s);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,t,t,0,i),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let o=0;o<this._shMrts.length&&o<this._backupShMrts.length;o++)this._renderShCopyPass(this._shMrts[o],this._backupShMrts[o].textures[0],this._mrt.textures[0],0,t,t,0,i);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,t,t,0,i)}finally{r.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let o of this._backupShMrts)o.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,m=new hr(t,{width:i,height:r},4,this._scene,{types:[_.TEXTURETYPE_FLOAT,o,o,_.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}Centers`,`${t}CovA`,`${t}CovB`,`${t}Colors`]);if(m.clearColor=new S(0,0,0,0),m.renderList=[],s)m.onClearObservable.add(()=>{});return m}_createShMrt(t,s,i=this._textureSize,r=this._textureSize){let o=new hr(t,{width:i,height:r},1,this._scene,{types:[_.TEXTURETYPE_UNSIGNED_INTEGER],formats:[_.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[t]);if(o.clearColor=new S(0,0,0,0),o.renderList=[],s)o.onClearObservable.add(()=>{});return o}_createRotMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,m=new hr(t,{width:i,height:r},3,this._scene,{types:[o,o,o],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}A`,`${t}B`,`${t}Scale`]);if(m.clearColor=new S(0,0,0,0),m.renderList=[],s)m.onClearObservable.add(()=>{});return m}async decodeAsync(t,s){if(this._disposed)return;this._applyPack(t);let i=this._shMaterial!==null&&this._shMrts.length>0;if(i)this._applyShPack(t);let r=this._rotMaterial!==null&&this._rotMrt!==null;if(r)this._applyRotPack(t);await new Promise((o)=>{let m=()=>{if(this._disposed){o();return}if(!this._material.isReady(this._quad)||i&&!this._shMaterial.isReady(this._quad)||r&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(m);return}let f=this._textureSize,y=this._baseOffset+s;if(this._material.setInt("uOffset",y),i)this._shMaterial.setInt("uOffset",y);if(r)this._rotMaterial.setInt("uOffset",y);let M=Math.floor(y/f),v=Math.max(1,Math.ceil((y+t.splatCount)/f)-M),b=this._scene.getEngine();b.enableScissor(0,M,f,v);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),i){for(let D=0;D<this._shMrts.length;D++)this._shMaterial.setInt("uShTextureIndex",D),this._quad.material=this._shMaterial,this._shMrts[D].renderList=[this._quad],this._shMrts[D].render();this._quad.material=this._material}if(r)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{b.disableScissor()}o()};this._scene.onBeforeRenderObservable.addOnce(m)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let t=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),s=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&t&&s}_bindCopyMaterialsToAtlas(){let t=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",t[0]),this._copyMaterial.setTexture("uSrc0",t[0]),this._copyMaterial.setTexture("uSrc1",t[1]),this._copyMaterial.setTexture("uSrc2",t[2]),this._copyMaterial.setTexture("uSrc3",t[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",t[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let s=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",t[0]),this._rotCopyMaterial.setTexture("uSrc0",s[0]),this._rotCopyMaterial.setTexture("uSrc1",s[1]),this._rotCopyMaterial.setTexture("uSrc2",s[2])}}relayoutSync(t){if(this._disposed||!this._copyMaterial)return;let s=this._textureSize,i=s,r=this._ownsMrt?s:Math.max(1,Math.floor(this._capacity/s));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(i*r);let o=this._relayoutMapData;if(o.fill(-1),o.set(t.subarray(0,Math.min(t.length,o.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new he(o,i,r,_.TEXTUREFORMAT_R,this._scene,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT);else this._relayoutMapTexture.update(o);let m=this._relayoutMapTexture;if(this._ownsMrt){let T=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(T,this._mrt.textures,m,1),this._renderRelayoutPass(this._mrt,T.textures,m,0)}finally{T.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let P=0;P<this._shMrts.length;P++){let z=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(z,this._shMrts[P].textures[0],m,1),this._renderShCopyPass(this._shMrts[P],z.textures[0],m,0)}finally{z.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let P=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(P,this._rotMrt.textures,m,1),this._renderRotCopyPass(this._rotMrt,P.textures,m,0)}finally{P.dispose()}}this._quad.material=this._material;return}let f=Math.floor(this._baseOffset/s),y=r,M=this._scene.getEngine(),v=this._createMrt("gsRelayoutTemp",!1,s,y),b=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((T,P)=>this._createShMrt(`gsShRelayoutTemp${P}`,!1,s,y)):[],D=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,s,y):null;try{this._renderRelayoutPass(v,this._mrt.textures,m,1,s,s,this._baseOffset,0);for(let T=0;T<b.length;T++)this._renderShCopyPass(b[T],this._shMrts[T].textures[0],m,1,s,s,this._baseOffset,0);if(D)this._renderRotCopyPass(D,this._rotMrt.textures,m,1,s,s,this._baseOffset,0);M.enableScissor(0,f,s,y);try{this._renderRelayoutPass(this._mrt,v.textures,m,0,s,s,0,f);for(let T=0;T<b.length;T++)this._renderShCopyPass(this._shMrts[T],b[T].textures[0],m,0,s,s,0,f);if(D)this._renderRotCopyPass(this._rotMrt,D.textures,m,0,s,s,0,f)}finally{M.disableScissor()}}finally{v.dispose();for(let T of b)T.dispose();D?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(t,s,i,r,o=this._textureSize,m=this._textureSize,f=0,y=0){let M=this._copyMaterial;M.setTexture("uMapTex",i),M.setTexture("uSrc0",s[0]),M.setTexture("uSrc1",s[1]),M.setTexture("uSrc2",s[2]),M.setTexture("uSrc3",s[3]),M.setInt("uDstWidth",o),M.setInt("uSrcWidth",m),M.setInt("uUseMap",r),M.setInt("uSrcBaseOffset",f),M.setInt("uDstBaseRow",y),this._quad.material=M,t.renderList=[this._quad],t.render()}_createCopyMaterial(){let t=this._shaderLanguage===1,s=new ge(Ht,this._scene,{vertexSource:t?be:Me,fragmentSource:t?ss:Zt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderShCopyPass(t,s,i,r,o=this._textureSize,m=this._textureSize,f=0,y=0){let M=this._shCopyMaterial;M.setTexture("uMapTex",i),M.setTexture("uSrcSh",s),M.setInt("uDstWidth",o),M.setInt("uSrcWidth",m),M.setInt("uUseMap",r),M.setInt("uSrcBaseOffset",f),M.setInt("uDstBaseRow",y),this._quad.material=M,t.renderList=[this._quad],t.render()}_createShCopyMaterial(){let t=this._shaderLanguage===1,s=new ge(jt,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Qt:Yt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderRotCopyPass(t,s,i,r,o=this._textureSize,m=this._textureSize,f=0,y=0){let M=this._rotCopyMaterial;M.setTexture("uMapTex",i),M.setTexture("uSrc0",s[0]),M.setTexture("uSrc1",s[1]),M.setTexture("uSrc2",s[2]),M.setInt("uDstWidth",o),M.setInt("uSrcWidth",m),M.setInt("uUseMap",r),M.setInt("uSrcBaseOffset",f),M.setInt("uDstBaseRow",y),this._quad.material=M,t.renderList=[this._quad],t.render()}_createRotCopyMaterial(){let t=this._shaderLanguage===1,s=new ge($t,this._scene,{vertexSource:t?be:Me,fragmentSource:t?ts:Jt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}async readCentersRangeAsync(t,s){if(this._disposed||s<=0||!this.supportsAsyncCentersReadback)return null;let i=this._textureSize,r=this._baseOffset+t,o=Math.floor(r/i),f=Math.ceil((r+s)/i)-o,y=(r-o*i)*4,M=y+s*4,v=this._mrt.textures[0],b=this._scene.getEngine();if(b.isWebGPU){let w=await v.readPixels(0,0,null,!0,!0,0,o,i,f);if(this._disposed||!w)return null;let q=w instanceof Float32Array?w:new Float32Array(w.buffer,w.byteOffset,w.byteLength/4);return q.length>=M?q.subarray(y,M):null}let D=b,T=D._gl,P=v.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!P)return null;let z=new Float32Array(i*f*4);if(!this._readFbo)this._readFbo=T.createFramebuffer();let W=D._currentFramebuffer;T.bindFramebuffer(T.FRAMEBUFFER,this._readFbo),T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,P,0),T.readBuffer(T.COLOR_ATTACHMENT0);let E=D._readPixelsAsync(0,o,i,f,T.RGBA,T.FLOAT,z);if(T.bindFramebuffer(T.FRAMEBUFFER,W),!W)T.readBuffer(T.BACK);if(!E)return null;if(await E,this._disposed||z.length<M)return null;return z.subarray(y,M)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let t of this._backupShMrts)t.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let t of this._shMrts)t.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let t=new p("gsWorkBufferQuad",this._scene),s=new O;return s.positions=[-1,-1,0,3,-1,0,-1,3,0],s.indices=[0,1,2],s.applyToMesh(t),this._scene.removeMesh(t),t}_createMaterial(){let t=this._shaderLanguage===1,s=new ge("gsSogDecode",this._scene,{vertexSource:t?be:Me,fragmentSource:t?Et:It},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyPack(t){let s=this._material,i=t.meansTextureL.getSize().width;s.setTexture("sogMeansLTex",t.meansTextureL),s.setTexture("sogMeansUTex",t.meansTextureU),s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogSh0Tex",t.sh0Texture),s.setTexture("sogCodebookTex",t.codebookTexture??t.sh0Texture),s.setVector3("sogMeansMin",new e(t.meansMin[0],t.meansMin[1],t.meansMin[2])),s.setVector3("sogMeansMax",new e(t.meansMax[0],t.meansMax[1],t.meansMax[2]));let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2]));let m=t.sh0Min??[0,0,0,0],f=t.sh0Max??[0,0,0,0];s.setVector4("sogSh0Min",new R(m[0],m[1],m[2],m[3])),s.setVector4("sogSh0Max",new R(f[0],f[1],f[2],f[3])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}_createShMaterial(){let t=this._shaderLanguage===1,s=new ge(Gt,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Xt:Nt},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyShPack(t){let s=this._shMaterial,i=!!t.shLabelsTexture&&!!t.shCentroidsTexture,r=t.shLabelsTexture??t.sh0Texture,o=t.shCentroidsTexture??t.sh0Texture;s.setTexture("sogShLabelsTex",r),s.setTexture("sogShCentroidsTex",o),s.setTexture("sogCodebookTex",t.codebookTexture??r),s.setFloat("sogShnMin",t.shnMin??0),s.setFloat("sogShnMax",t.shnMax??0),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",r.getSize().width),s.setInt("uCoeffs",i?t.shCoeffCount:0)}_createRotMaterial(){let t=this._shaderLanguage===1,s=new ge(Ot,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Vt:Wt},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyRotPack(t){let s=this._rotMaterial,i=t.scalesTexture.getSize().width;s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogCodebookTex",t.codebookTexture??t.scalesTexture);let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}}class $e{constructor(t){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,t?.maxConcurrent??2),this.maxRetries=Math.max(0,t?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(t,s){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let i=this._pending.get(t);if(i)return await i.promise;let r={url:t,groupId:s,settled:!1,cancelled:!1,started:!1,slotReleased:!1};if(r.promise=new Promise((o,m)=>{r.resolve=o,r.reject=m}),this._pending.set(t,r),s!==void 0){let o=this._groups.get(s);if(!o)o=new Set,this._groups.set(s,o);o.add(t)}return this._queue.push(r),this._pump(),await r.promise}cancel(t){let s=this._pending.get(t);if(!s)return;this._abort(s,Error(`GaussianSplattingDownloadManager: download cancelled (${t}).`))}cancelGroup(t){let s=this._groups.get(t);if(!s)return;for(let i of Array.from(s))this.cancel(i);this._groups.delete(t)}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let t of Array.from(this._pending.values()))this._abort(t,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(t,s){if(t.settled)return;t.cancelled=!0;let i=this._queue.indexOf(t);if(i!==-1)this._queue.splice(i,1);if(t.request?.abort(),t.cancelAttempt?.(s),this._settle(t,()=>t.reject(s)),t.started)this._releaseSlot(t)}_settle(t,s){if(t.settled)return;if(t.settled=!0,this._pending.delete(t.url),t.groupId!==void 0){let i=this._groups.get(t.groupId);if(i){if(i.delete(t.url),i.size===0)this._groups.delete(t.groupId)}}s()}_releaseSlot(t){if(t.slotReleased)return;t.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let t=this._queue.shift();if(t.settled)continue;t.started=!0,this._activeCount++,this._runTaskAsync(t).finally(()=>{this._releaseSlot(t)})}}async _runTaskAsync(t){let s;for(let i=0;i<=this.maxRetries;i++){if(this._disposed||t.cancelled)return;try{let r=await this._downloadAttemptAsync(t);this._settle(t,()=>t.resolve(r));return}catch(r){if(t.cancelAttempt=void 0,this._disposed||t.cancelled)return;s=r}}this._settle(t,()=>t.reject(s))}async _downloadAttemptAsync(t){return await new Promise((s,i)=>{t.cancelAttempt=i,t.request=x.LoadFile(t.url,(r)=>s(r),void 0,void 0,!0,(r,o)=>i(o instanceof Error?o:Error(`GaussianSplattingDownloadManager: failed to load ${t.url}.`)))})}}class is{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class Ke{constructor(t=0,s=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=s,t>0){this._capacity=t,this._freeSize=t;let i=this._obtain(0,t,!0);this._headAll=i,this._tailAll=i,this._addToBucket(i)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(t){if(t<=0)return null;let s=this._findFreeBlock(t);if(!s)return null;if(this._usedSize+=t,this._freeSize-=t,s._size===t)return s._free=!1,this._removeFromBucket(s),s;let i=this._obtain(s._offset,t,!1);return s._offset+=t,s._size-=t,this._rebucket(s),this._insertAfterInMainList(i,s._prev),i}free(t){if(!t||t._free)return;t._free=!0,this._usedSize-=t._size,this._freeSize+=t._size;let{_prev:s,_next:i}=t,r=s&&s._free,o=i&&i._free;if(r&&o)s._size+=t._size+i._size,this._removeFromMainList(t),this._removeFromMainList(i),this._removeFromBucket(i),this._release(t),this._release(i),this._rebucket(s);else if(r)s._size+=t._size,this._removeFromMainList(t),this._release(t),this._rebucket(s);else if(o)t._size+=i._size,this._removeFromMainList(i),this._removeFromBucket(i),this._release(i),this._addToBucket(t);else this._addToBucket(t)}grow(t){if(t<=this._capacity)return;let s=t-this._capacity;if(this._capacity=t,this._freeSize+=s,this._tailAll&&this._tailAll._free)this._tailAll._size+=s,this._rebucket(this._tailAll);else{let i=this._obtain(this._capacity-s,s,!0);this._insertAfterInMainList(i,this._tailAll),this._addToBucket(i)}}defrag(t=0,s=new Set){if(s.clear(),this._freeRegionCount===0)return s;if(t===0)this._defragFull(s);else this._defragIncremental(t,s);return s}updateAllocation(t,s){for(let i=0;i<t.length;i++)this.free(t[i]);for(let i=0;i<s.length;i++){let r=s[i],o=this.allocate(r);if(o)s[i]=o;else{let m=r;for(let M=i+1;M<s.length;M++)m+=s[M];let f=this._usedSize+m,y=Math.ceil(f*this._growMultiplier);if(y>this._capacity)this.grow(y);this.defrag(0);for(let M=i;M<s.length;M++)s[M]=this.allocate(s[M]);return!0}}return!1}_bucketFor(t){return 31-Math.clz32(t)}_addToBucket(t){let s=this._bucketFor(t._size);t._bucket=s;while(s>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(t._prevFree=null,t._nextFree=this._freeBucketHeads[s],this._freeBucketHeads[s])this._freeBucketHeads[s]._prevFree=t;this._freeBucketHeads[s]=t,this._freeRegionCount++}_removeFromBucket(t){let s=t._bucket;if(t._prevFree)t._prevFree._nextFree=t._nextFree;else this._freeBucketHeads[s]=t._nextFree;if(t._nextFree)t._nextFree._prevFree=t._prevFree;t._prevFree=null,t._nextFree=null,t._bucket=-1,this._freeRegionCount--}_rebucket(t){if(this._bucketFor(t._size)!==t._bucket)this._removeFromBucket(t),this._addToBucket(t)}_obtain(t,s,i){let r=this._pool.length>0?this._pool.pop():new is;return r._offset=t,r._size=s,r._free=i,r._prev=null,r._next=null,r._prevFree=null,r._nextFree=null,r._bucket=-1,r}_release(t){t._prev=null,t._next=null,t._prevFree=null,t._nextFree=null,t._bucket=-1,this._pool.push(t)}_insertAfterInMainList(t,s){if(s===null){if(t._prev=null,t._next=this._headAll,this._headAll)this._headAll._prev=t;if(this._headAll=t,!this._tailAll)this._tailAll=t}else{if(t._prev=s,t._next=s._next,s._next)s._next._prev=t;if(s._next=t,this._tailAll===s)this._tailAll=t}}_removeFromMainList(t){if(t._prev)t._prev._next=t._next;else this._headAll=t._next;if(t._next)t._next._prev=t._prev;else this._tailAll=t._prev;t._prev=null,t._next=null}_findFreeBlock(t){let s=this._bucketFor(t),i=this._freeBucketHeads.length;if(s<i){let r=null,o=this._freeBucketHeads[s];while(o){if(o._size>=t){if(!r||o._size<r._size){if(r=o,o._size===t)break}}o=o._nextFree}if(r)return r}for(let r=s+1;r<i;r++)if(this._freeBucketHeads[r])return this._freeBucketHeads[r];return null}_defragFull(t){for(let o=0;o<this._freeBucketHeads.length;o++){let m=this._freeBucketHeads[o];while(m){let f=m._nextFree;this._removeFromMainList(m),m._prevFree=null,m._nextFree=null,m._bucket=-1,this._pool.push(m),m=f}this._freeBucketHeads[o]=null}this._freeRegionCount=0;let s=0,i=this._headAll;while(i){if(i._offset!==s)i._offset=s,t.add(i);s+=i._size,i=i._next}let r=this._capacity-s;if(r>0){let o=this._obtain(s,r,!0);this._insertAfterInMainList(o,this._tailAll),this._addToBucket(o)}}_defragIncremental(t,s){let i=Math.ceil(t/2),r=t-i;for(let m=0;m<i;m++){let f=this._tailAll;while(f&&f._free)f=f._prev;if(!f)break;let y=this._findFreeBlock(f._size);if(!y||y._offset>=f._offset)break;this._moveBlock(f,y),s.add(f)}let o=this._headAll;for(let m=0;m<r&&o;){let f=o._next;if(o._free&&f&&!f._free){let y=f,M=o;y._offset=M._offset,M._offset=y._offset+y._size;let v=M._prev,b=y._next;if(y._prev=v,y._next=M,M._prev=y,M._next=b,v)v._next=y;else this._headAll=y;if(b)b._prev=M;else this._tailAll=M;if(M._next&&M._next._free){let D=M._next;M._size+=D._size,this._removeFromMainList(D),this._removeFromBucket(D),this._release(D),this._rebucket(M)}s.add(y),m++,o=M._next}else o=f}}_moveBlock(t,s){let i=t._size,r=s._offset,o=t._prev;this._removeFromMainList(t);let m=this._obtain(t._offset,i,!0);if(this._insertAfterInMainList(m,o),this._addToBucket(m),m._next&&m._next._free){let f=m._next;m._size+=f._size,this._removeFromMainList(f),this._removeFromBucket(f),this._release(f),this._rebucket(m)}if(m._prev&&m._prev._free){let f=m._prev;f._size+=m._size,this._removeFromMainList(m),this._removeFromBucket(m),this._release(m),this._rebucket(f)}if(t._offset=r,s._size===i){let f=s._prev;this._removeFromMainList(s),this._removeFromBucket(s),this._release(s),this._insertAfterInMainList(t,f)}else s._offset+=i,s._size-=i,this._rebucket(s),this._insertAfterInMainList(t,s._prev)}}class Je{constructor(t,s,i){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new Ke(t),this._cooldownFrames=Math.max(0,s),this._onEvict=i}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(t){return this._blocks.has(t)}offset(t){return this._blocks.get(t)?.offset}allocate(t,s){let i=this._blocks.get(t);if(i)return i.offset;let r=this._allocator.allocate(s);if(!r){if(this._evictAllCooled(),r=this._allocator.allocate(s),!r)return null}return this._blocks.set(t,r),r.offset}pin(t,s){let i=this.allocate(t,s);if(i!==null)this._pinned.add(t);return i}free(t){if(this._pinned.has(t))return;let s=this._blocks.get(t);if(!s)return;this._allocator.free(s),this._blocks.delete(t),this._cooldown.delete(t)}compact(){let t=new Map;for(let[i,r]of Array.from(this._blocks))t.set(i,r.offset);this._allocator.defrag(0);let s=[];for(let[i,r]of Array.from(this._blocks)){let o=t.get(i);if(o!==r.offset)s.push({file:i,oldOffset:o,newOffset:r.offset,count:r.size})}return s}getResidentBlocks(){let t=[];for(let[s,i]of Array.from(this._blocks))t.push({file:s,offset:i.offset,count:i.size});return t}scheduleEviction(t){if(this._pinned.has(t)||!this._blocks.has(t))return;this._cooldown.set(t,this._cooldownFrames)}cancelEviction(t){this._cooldown.delete(t)}tick(){if(this._cooldown.size===0)return[];let t=[];for(let[s,i]of Array.from(this._cooldown))if(i<=1)t.push(s);else this._cooldown.set(s,i-1);for(let s of t)this._evict(s);return t}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let t=Array.from(this._cooldown.keys());for(let s of t)this._evict(s)}_evict(t){let s=this._blocks.get(t);if(s)this._allocator.free(s),this._blocks.delete(t);this._cooldown.delete(t),this._onEvict(t)}}var Ms=Math.tan(22.5*Math.PI/180),bs=-2,rs=-1,vs=84,et=new l,ws=new e,Rs=new e,os=new e,Ts=new e(0,0,1),as=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],ns=as.length*2,Oe=[new S(1,0.2,0.2,1),new S(1,0.6,0.1,1),new S(1,1,0.2,1),new S(0.3,1,0.3,1),new S(0.2,1,1,1),new S(0.4,0.5,1,1),new S(0.9,0.4,1,1),new S(1,1,1,1)];class ye extends es{static IsLODMetadata(t){if(typeof t!=="object"||t===null)return!1;let s=t;return typeof s.lodLevels==="number"&&Array.isArray(s.filenames)&&typeof s.tree==="object"&&s.tree!==null}constructor(t,s,i,r,o={}){super(t,null,r,!1);this._leafNodes=[],this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._frustumCulling=!0,this._frustumPlanes=[new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0)],this._cullViewProj=new l,this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPos=new e(1/0,1/0,1/0),this._forceLodUpdate=!1,this._boundsMin=new e(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new e(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=s,this._rootUrl=i,this._streamOptions=o,this._hostCompound=o.hostCompound??null,this._decodeSh=o.decodeSh??!0,this._needsRotationScale=o.needsRotationScale??!1;let m=Math.max(0,s.lodLevels-1);if(this._lodRangeMax=m,o.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,o.lodBaseDistance);if(o.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,o.lodMultiplier);if(o.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,o.lodBehindPenalty);if(o.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(o.lodRangeMin,m));if(o.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(o.lodRangeMax,m));if(o.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,o.maxDecodesPerFrame);if(o.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,o.lodCooldownFrames);if(o.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,o.lodUpdateInterval);if(o.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,o.lodUpdateDistance);if(o.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(o.maxDetailLod));if(o.frustumCulling!==void 0)this._frustumCulling=o.frustumCulling;if(o.debugLodSource)this._debugLodSource=o.debugLodSource;if(o.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(o.evictionCooldownFrames));if(o.maxResidentSplats!==void 0&&o.maxResidentSplats>0)this._maxResidentSplats=Math.floor(o.maxResidentSplats);if(o.memoryBudgetMb!==void 0&&o.memoryBudgetMb>0)this._memoryBudgetMb=o.memoryBudgetMb;if(this._downloadManager=new $e({maxConcurrent:o.maxConcurrentDownloads,maxRetries:o.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((y,M)=>{this._partReadyResolve=y,this._partReadyReject=M}),this._partReadyPromise.catch(()=>{});let f=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(f)}if(this._collectLodEntries(s.tree),o.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let f=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!f&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(f)=>{if(c.Error("GaussianSplattingStream: streaming failed: "+(f?.message??f)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(f?.message??f)),this._hostCompound&&!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(t=!1){if(this._hostCompound)return!0;return super.isReady(t)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(t){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(t))}async whenSettledAsync(t=3){if(this._disposed)return;this._forceLodUpdate=!0;let s=Math.max(1,t),i=this._scene,r=0,o=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++r>=s;return r=0,!1};if(i.getEngine().activeRenderLoops.length>0){await new Promise((y)=>{let M=null;M=i.onAfterRenderObservable.add(()=>{if(this._disposed||o()){if(M)i.onAfterRenderObservable.remove(M),M=null;y()}})});return}let m=i.getEngine(),f=globalThis.requestAnimationFrame;while(!this._disposed){if(m.beginFrame(),i.render(),m.endFrame(),o())return;await new Promise((y)=>{if(typeof f==="function")f(()=>y());else setTimeout(y,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(t){let s=Math.max(0,Math.floor(t));if(this._maxDetailLod===s)return;this._maxDetailLod=s,this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(t){if(this._frustumCulling===t)return;this._frustumCulling=t,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(t){if(this._debugDisplay===t)return;if(this._debugDisplay=t,t)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(t){if(this._debugLodSource===t)return;if(this._debugLodSource=t,this._debugDisplay)this._refreshDebugDisplay()}dispose(t){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(t)}_disposeAndReclaim(){let t=this._hostCompound,s=!!this._host&&!this._partReleasedByHost;if(this.dispose(),s&&t&&!t.isDisposed())t.compactAtlas()}_getEffectiveWorldMatrix(t){if(this._host)return this._host.proxy.computeWorldMatrix(t);return this.computeWorldMatrix(t)}evaluateOptimalLods(t=this._scene.activeCamera){if(!t||this._leafNodes.length===0)return;let s=Math.max(0,this._metadata.lodLevels-1),i=this._lodBaseDistance,r=this._lodMultiplier,o=this._lodBehindPenalty,m=this._lodRangeMin,f=this._lodRangeMax,y=this._scene.getEngine().getAspectRatio(t)||1,M=Math.tan(t.fov*0.5);if(t.fovMode===X.FOVMODE_HORIZONTAL_FIXED)M/=y;let v=M*y,b=Math.min(M,v)/Ms;this._getEffectiveWorldMatrix(!1).invertToRef(et);let D=e.TransformCoordinatesToRef(t.globalPosition,et,ws),{x:T,y:P,z}=D,W=0,E=0,w=0;if(o>1){t.getDirectionToRef(Ts,os);let q=e.TransformNormalToRef(os,et,Rs);q.normalize(),W=q.x,E=q.y,w=q.z}for(let q of this._leafNodes){let C=q.bound.min,I=q.bound.max,U=T<C[0]?C[0]:T>I[0]?I[0]:T,F=P<C[1]?C[1]:P>I[1]?I[1]:P,V=z<C[2]?C[2]:z>I[2]?I[2]:z,N=U-T,K=F-P,te=V-z,j=Math.sqrt(N*N+K*K+te*te),Q=j;if(o>1&&j>0.01){let ee=(W*N+E*K+w*te)/j;if(ee<0)Q=j*(1+-ee*(o-1))}let ie=Q*b,H;if(s===0||ie<i)H=0;else{H=s;while(H>1&&ie<i*Math.pow(r,H-1))H--}if(H<m)H=m;else if(H>f)H=f;if(this._frustumCulling&&q.inFrustum===!1)H=f;q.optimalLod=H}}_displayedLodLevel(t){if(this._debugLodSource==="optimal")return t.optimalLod??t.activeLod??0;return t.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let t=this._debugDisplay;if(t&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!t&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let t=[],s=[];for(let r of this._leafNodes){let o=Oe[this._displayedLodLevel(r)%Oe.length],m=r.bound.min,f=r.bound.max,y=[new e(m[0],m[1],m[2]),new e(f[0],m[1],m[2]),new e(f[0],f[1],m[2]),new e(m[0],f[1],m[2]),new e(m[0],m[1],f[2]),new e(f[0],m[1],f[2]),new e(f[0],f[1],f[2]),new e(m[0],f[1],f[2])];for(let M of as)t.push([y[M[0]],y[M[1]]]),s.push([o,o])}if(this._debugSignature=this._computeDebugSignature(),t.length===0)return;let i=Bs(this.name+"_lodDebug",{lines:t,colors:s,updatable:!0,useVertexAlpha:!1},this._scene);i.parent=this,i.isPickable=!1,i.doNotSerialize=!0,i.reservedDataStore={hidden:!0},this._debugMesh=i,this._debugColorData=new Float32Array(this._leafNodes.length*ns*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let t=this._debugColorData,s=0;for(let i of this._leafNodes){let r=Oe[this._displayedLodLevel(i)%Oe.length];for(let o=0;o<ns;o++)t[s++]=r.r,t[s++]=r.g,t[s++]=r.b,t[s++]=r.a}this._debugMesh.updateVerticesData(n.ColorKind,t),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let t=0;for(let s of this._leafNodes)t=t*31+this._displayedLodLevel(s)|0;return t}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(t){if(t.children){for(let i of t.children)this._collectLodEntries(i);return}if(!t.lods)return;let s=[];for(let i of Object.keys(t.lods)){let r=Number(i),o=t.lods[i];if(Number.isFinite(r)&&o&&o.count>0)s.push(r)}if(s.length===0)return;s.sort((i,r)=>i-r),t.availableLevels=s,t.baseLod=s[s.length-1],t.activeLod=void 0,t.lodCooldown=0,t.inFrustum=!0,t.cullBounds=new ii(e.FromArray(t.bound.min),e.FromArray(t.bound.max)),this._leafNodes.push(t)}async _streamAllAsync(){let t=this._collectAllFileIds(),s=await this._gatherCountsAsync(t);if(this._disposed)return;this._resolveResidentBudget();let i=1;if(s>0)i+=s;for(let m of t){let f=this._fileCounts.get(m);if(f!==void 0&&f>0)i+=f}if(i<=1)return;this._evictionEnabled=this._residentBudget>0&&this._residentBudget<i;let r=this._evictionEnabled?Math.max(this._residentBudget,1):i;if(this._residency=new Je(r,this._evictionCooldownFrames,(m)=>this._onFileEvicted(m)),this._residency.pin(bs,1),s>0){let m=this._residency.pin(rs,s);if(m!==null)this._environmentRange={offset:m,count:s};else c.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let m=l.Compose(new e(1,-1,1),d.RotationYawPitchRoll(0,-Math.PI/2,0),e.ZeroReadOnly),f=this._hostCompound.reserveStreamingPart(r,m,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=f,this._positionBase=f.base;let y=this._hostCompound,M=y.onPartRemovedObservable.add((T)=>{if(!this._disposed&&this._host&&T===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>y.onPartRemovedObservable.remove(M);let v=this._shTextureCount>0&&f.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:f.shMrtAtlas}:void 0,b=this._needsRotationScale&&f.rotMrtAtlas?{externalMrt:f.rotMrtAtlas}:void 0;this._workBuffer=new Ee(this._scene,f.capacity,{mrt:f.mrtAtlas,width:f.atlasWidth,baseOffset:f.base},v,b),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=f.splatPositions,this._vertexCount=r;let D=this._workBuffer;this._unsubBeforeRebuild=f.onBeforeAtlasRebuild(()=>{D.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=f.onAfterAtlasRebuild(()=>{if(f.mrtAtlas)D.rebindAtlas(f.mrtAtlas);if(D.rebindShAtlas(f.shMrtAtlas),D.rebindRotAtlas(f.rotMrtAtlas),this._positionBase=f.base,D.setBaseOffset(f.base),D.restoreRegion(),this._splatPositions=f.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),f.setActiveRanges([])}else{let m=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,f=this._needsRotationScale?{}:void 0;this._workBuffer=new Ee(this._scene,r,void 0,m,f),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let y=new Float32Array(r*4),M=this._workBuffer.textures,v=m?this._workBuffer.shTextures:void 0,b=f?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(M[0],M[1],M[2],M[3],y,r,v,this._streamShDegree,b),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;let o=new Set;for(let m of this._leafNodes){let f=m.lods[String(m.baseLod)];if(f&&this._fileCounts.has(f.file))o.add(f.file)}for(let m of Array.from(o)){if(this._disposed)return;await this._decodeFileAsync(m)}if(this._disposed)return;if(this._baseLayerReady=!0,!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame());this._resolvePartReady()}async _waitForCanBackupAsync(t){for(let s=0;s<600&&!this._disposed;s++){if(t.canBackup)return;await new Promise((i)=>this._scene.onBeforeRenderObservable.addOnce(()=>i()))}if(!this._disposed&&!t.canBackup)c.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(){let t=this._maxResidentSplats;if(this._memoryBudgetMb>0){let s=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48,i=vs+this._shTextureCount*16+(this._needsRotationScale?s:0),r=Math.floor(this._memoryBudgetMb*1024*1024/i);t=t>0?Math.min(t,r):r}this._residentBudget=t}_collectAllFileIds(){let t=new Set;for(let s of this._leafNodes)for(let i of s.availableLevels){let r=s.lods[String(i)];if(r)t.add(r.file)}return Array.from(t).sort((s,i)=>s-i)}async _gatherCountsAsync(t){let s=0,i=0,r=0,o=(m)=>{let f=ye._GetShInfo(m);if(f.degree>i)i=f.degree;if(f.coeffs>r)r=f.coeffs};if(this._metadata.environment)try{let m=this._rootUrl+this._metadata.environment,f=await this._downloadManager.loadFileAsync(m),y=await this._unzipAsync(new Uint8Array(f)),M=y.get("meta.json");if(M){let v=JSON.parse(new TextDecoder().decode(M));s=ye._GetSplatCount(v),o(v),this._environmentFiles=y}}catch(m){c.Warn("GaussianSplattingStream: failed to load environment: "+(m?.message??m))}await Promise.all(t.map(async(m)=>{let f=this._metadata.filenames[m];if(!f){c.Warn(`GaussianSplattingStream: missing filename for file index ${m}.`);return}try{let y=this._rootUrl+f,M=y.substring(0,y.lastIndexOf("/")+1),v=await this._downloadManager.loadFileAsync(y),b=JSON.parse(new TextDecoder().decode(new Uint8Array(v)));this._fileCounts.set(m,ye._GetSplatCount(b)),this._fileMeta.set(m,{sogData:b,subRootUrl:M})}catch(y){c.Warn(`GaussianSplattingStream: failed to load metadata for ${f}: ${y?.message??y}`)}}));for(let{sogData:m}of this._fileMeta.values())o(m);if(this._decodeSh&&i>0&&r>0)this._streamShDegree=i,this._shTextureCount=Math.ceil(r*3/16);return s}_enqueueDecode(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._fileMeta.has(t))return;if(this._decodeQueue.indexOf(t)===-1)this._decodeQueue.push(t)}_pumpDecodeQueue(){let t=0;while(this._decodeQueue.length>0&&t<this._maxDecodesPerFrame){let s=this._decodeQueue.shift();if(this._decodedFiles.has(s)||this._loadingFiles.has(s))continue;t++,this._decodeFileAsync(s).catch((i)=>{c.Warn("GaussianSplattingStream: decode failed: "+(i?.message??i))})}}_applyPositions(t,s,i){this._splatPositions.set(t,(this._positionBase+s)*4),this._updateBounds(t,i),this._sinkPostPositionsRange(s,i)}_sinkSetActiveRanges(t){if(this._host)this._host.setActiveRanges(t);else this.setSplatIndexRanges(t)}_sinkPostPositionsRange(t,s){if(this._host)this._host.postPositionsRange(t,s);else this._postWorkerPositionsRange(t,s)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(t,s,i){if(this._readbackProbed=!0,!this._workBuffer)return;let r=Math.min(s,1024),o=!1;try{let m=await this._workBuffer.readCentersRangeAsync(t,r);if(this._disposed)return;if(m&&m.length>=r*4){o=!0;for(let f=0;f<r&&o;f++)for(let y=0;y<3;y++){let M=m[f*4+y],v=i[f*4+y];if(Math.abs(M-v)>0.01*(1+Math.abs(v))){o=!1;break}}}}catch{o=!1}this._useGpuPositionReadback=o,c.Log(o?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(t,s,i){if(this._useGpuPositionReadback&&this._workBuffer){let o=await this._workBuffer.readCentersRangeAsync(s,i);if(this._disposed)return!1;if(o&&this._splatPositions)return this._applyPositions(o,s,i),!0}let r=t.positions.length>=i*4?t.positions.subarray(0,i*4):null;if(!r||!this._splatPositions)return!1;if(this._applyPositions(r,s,i),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(s,i,r);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let t=this._environmentRange;try{let i=(await Le(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!i)return;try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(i,t.offset),this._disposed)return;if(await this._applyDecodedPositionsAsync(i,t.offset,t.count),this._disposed)return;this._refreshActiveRanges()}finally{ye._DisposePack(i)}}catch(s){c.Warn("GaussianSplattingStream: failed to decode environment: "+(s?.message??s))}}async _decodeFileAsync(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._residency)return;let s=this._fileMeta.get(t),i=this._fileCounts.get(t);if(!s||i===void 0)return;this._loadingFiles.add(t),this._cancelledDecodes.delete(t);let r=!1;try{let m=(await Le(s.sogData,s.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,t)).sogTextures;if(!m)return;let f=await this._acquireDecodeGateAsync();try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;let y=this._residency.allocate(t,i);if(y===null)y=await this._relayoutAndAllocateAsync(t,i);if(y===null){if(!this._cancelledDecodes.has(t))c.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${t}.`);return}if(r=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;if(await this._workBuffer.decodeAsync(m,y),this._disposed||this._cancelledDecodes.has(t))return;if(await this._applyDecodedPositionsAsync(m,y,i),this._disposed)return;if(this._decodedFiles.add(t),this._applyDesiredLods())this._refreshActiveRanges()}finally{ye._DisposePack(m),f()}}catch(o){if(!this._cancelledDecodes.has(t))throw o}finally{if(r&&!this._decodedFiles.has(t))this._residency.free(t);this._loadingFiles.delete(t),this._cancelledDecodes.delete(t)}}async _acquireDecodeGateAsync(){let t=this._decodeGate,s;return this._decodeGate=new Promise((i)=>{s=i}),await t,s}async _relayoutAndAllocateAsync(t,s){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<s)return null;return await new Promise((i)=>{let r=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(t)){i(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(r);return}this._performRelayout(),i(this._residency.allocate(t,s))};this._scene.onBeforeRenderObservable.addOnce(r)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let t=this._relayoutOldOffsets;t.clear();for(let y of this._residency.getResidentBlocks())t.set(y.file,y.offset);if(this._residency.compact().length===0)return;let i=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==i)this._relayoutSrcIndex=new Float32Array(i);let r=this._relayoutSrcIndex;r.fill(-1);let o=this._residency.getResidentBlocks();for(let y of o){let M=t.get(y.file);for(let v=0;v<y.count;v++)r[y.offset+v]=M+v}this._workBuffer.relayoutSync(r);let m=this._splatPositions,f=this._positionBase;o.sort((y,M)=>y.offset-M.offset);for(let y of o){let M=t.get(y.file);if(M!==y.offset)m.copyWithin((f+y.offset)*4,(f+M)*4,(f+M+y.count)*4)}if(this._environmentRange){let y=this._residency.offset(rs);if(y!==void 0)this._environmentRange.offset=y}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(t){this._decodedFiles.delete(t)}_cappedLevelForNode(t,s){let i=t.availableLevels,r=this._maxDetailLod,o=-1,m=Number.POSITIVE_INFINITY;for(let f of i){if(f<r)continue;let y=Math.abs(f-s);if(y<m)o=f,m=y}return o<0?t.baseLod:o}_computeTargetLevels(){for(let t of this._leafNodes){let s=t.optimalLod??t.baseLod;t.targetLevel=this._cappedLevelForNode(t,s)}}_applyDesiredLods(){let t=!1;for(let s of this._leafNodes){if(s.lodCooldown&&s.lodCooldown>0)continue;let i=s.targetLevel??s.baseLod,r;if(i!==s.activeLod){let o=s.lods[String(i)];if(o)if(this._decodedFiles.has(o.file))this._switchActiveFile(s,o.file),s.activeLod=i,s.lodCooldown=this._lodCooldownFrames,t=!0;else r=o.file}if(s.pendingFile!==r){if(s.pendingFile!==void 0)this._releaseFileRef(s.pendingFile);if(r!==void 0)this._acquirePendingFile(r);s.pendingFile=r}}return t}_switchActiveFile(t,s){if(t.activeFile===s)return;if(t.activeFile!==void 0)this._releaseFileRef(t.activeFile);this._acquireFileRef(s),t.activeFile=s}_acquireFileRef(t){let s=(this._fileRefs.get(t)??0)+1;if(this._fileRefs.set(t,s),s===1)this._residency?.cancelEviction(t)}_acquirePendingFile(t){this._acquireFileRef(t),this._enqueueDecode(t)}_releaseFileRef(t){let s=(this._fileRefs.get(t)??0)-1;if(s>0){this._fileRefs.set(t,s);return}if(this._fileRefs.delete(t),this._decodedFiles.has(t)){if(this._evictionEnabled)this._residency?.scheduleEviction(t);return}let i=this._decodeQueue.indexOf(t);if(i!==-1)this._decodeQueue.splice(i,1);if(this._loadingFiles.has(t))this._cancelledDecodes.add(t),this._downloadManager.cancelGroup(t)}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;let t=!1;for(let r of this._leafNodes)if(r.lodCooldown&&r.lodCooldown>0){if(r.lodCooldown--,r.lodCooldown===0&&r.targetLevel!==void 0&&r.targetLevel!==r.activeLod)t=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let s=this._updateNodeFrustum(),i=this._forceLodUpdate||s||t;if(!i&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let r=this._scene.activeCamera,o=this._lodUpdateDistance;if(!r||e.DistanceSquared(r.globalPosition,this._lastLodCamPos)>=o*o){if(r)this._lastLodCamPos.copyFrom(r.globalPosition);i=!0}}if(i){if(this._forceLodUpdate=!1,this._framesSinceLodUpdate=0,this.evaluateOptimalLods(this._scene.activeCamera),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_updateNodeFrustum(){let t=this._scene.activeCamera,s=!1;if(!this._frustumCulling||!t){for(let r of this._leafNodes)if(r.inFrustum===!1)r.inFrustum=!0,s=!0;return s}let i=this._getEffectiveWorldMatrix(!1);t.getViewMatrix().multiplyToRef(t.getProjectionMatrix(),this._cullViewProj),Zr.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);for(let r of this._leafNodes){r.cullBounds.update(i);let o=r.cullBounds.isInFrustum(this._frustumPlanes);if(o!==r.inFrustum)r.inFrustum=o,s=!0}return s}static _GetSplatCount(t){return t.count??(Array.isArray(t.means.shape)?t.means.shape[0]:0)}static _GetShInfo(t){if(!t.shN)return{degree:0,coeffs:0};let s=4,i=0,r=t.shN.bands;if(typeof r==="number"&&Number.isFinite(r)&&r>0)i=Math.floor(r);else if(Array.isArray(t.shN.shape)&&Number.isFinite(t.shN.shape[1])&&t.shN.shape[1]>0){let o=Math.floor(t.shN.shape[1]/3);i=o>0?Math.round(Math.sqrt(o+1)-1):0}if(!(i>0))return{degree:0,coeffs:0};if(i>s)c.Warn(`GaussianSplattingStream: SH degree ${i} exceeds the maximum supported (${s}); clamping.`),i=s;return{degree:i,coeffs:(i+1)**2-1}}static _DisposePack(t){t.meansTextureL.dispose(),t.meansTextureU.dispose(),t.scalesTexture.dispose(),t.quatsTexture.dispose(),t.sh0Texture.dispose(),t.shCentroidsTexture?.dispose(),t.shLabelsTexture?.dispose(),t.codebookTexture?.dispose()}_updateBounds(t,s){let i=this._boundsMin,r=this._boundsMax;for(let o=0;o<s;o++){let m=t[o*4+0],f=t[o*4+1],y=t[o*4+2];i.minimizeInPlaceFromFloats(m,f,y),r.maximizeInPlaceFromFloats(m,f,y)}if(this._host)this._host.expandBounds(i,r);else this.setBoundingInfo(new ii(i,r))}_refreshActiveRanges(){let t=[];if(this._environmentRange)t.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let s of this._leafNodes){if(s.activeLod===void 0)continue;let i=s.lods[String(s.activeLod)];if(!i)continue;let r=this._residency?.offset(i.file);if(r===void 0)continue;t.push({offset:r+i.offset,count:i.count})}this._sinkSetActiveRanges(ye._CoalesceRanges(t))}static _CoalesceRanges(t){if(t.length<=1)return t;let s=t.slice().sort((r,o)=>r.offset-o.offset),i=[{offset:s[0].offset,count:s[0].count}];for(let r=1;r<s.length;r++){let o=i[i.length-1],m=s[r],f=o.offset+o.count;if(m.offset<=f){let y=Math.max(f,m.offset+m.count);o.count=y-o.offset}else i.push({offset:m.offset,count:m.count})}return i}async _unzipAsync(t){let s=this._streamOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let i=s.unzipSync(t),r=new Map;for(let[o,m]of Object.entries(i))r.set(o,m);return r}}class Ff{constructor(t,s,i,r,o){this.idx=0,this.color=new S(1,1,1,1),this.position=e.Zero(),this.rotation=e.Zero(),this.uv=new g(0,0),this.velocity=e.Zero(),this.pivot=e.Zero(),this.translateFromPivot=!1,this._pos=0,this._ind=0,this.groupId=0,this.idxInGroup=0,this._stillInvisible=!1,this._rotationMatrix=[1,0,0,0,1,0,0,0,1],this.parentId=null,this._globalPosition=e.Zero(),this.idx=t,this._group=s,this.groupId=i,this.idxInGroup=r,this._pcs=o}get size(){return this.size}set size(t){this.size=t}get quaternion(){return this.rotationQuaternion}set quaternion(t){this.rotationQuaternion=t}intersectsMesh(t,s){if(!t.hasBoundingInfo)return!1;if(!this._pcs.mesh)throw Error("Point Cloud System doesnt contain the Mesh");if(s)return t.getBoundingInfo().boundingSphere.intersectsPoint(this.position.add(this._pcs.mesh.position));let i=t.getBoundingInfo().boundingBox,r=i.maximumWorld.x,o=i.minimumWorld.x,m=i.maximumWorld.y,f=i.minimumWorld.y,y=i.maximumWorld.z,M=i.minimumWorld.z,v=this.position.x+this._pcs.mesh.position.x,b=this.position.y+this._pcs.mesh.position.y,D=this.position.z+this._pcs.mesh.position.z;return o<=v&&v<=r&&f<=b&&b<=m&&M<=D&&D<=y}getRotationMatrix(t){let s;if(this.rotationQuaternion)s=this.rotationQuaternion;else{s=a.Quaternion[0];let i=this.rotation;d.RotationYawPitchRollToRef(i.y,i.x,i.z,s)}s.toRotationMatrix(t)}}class fc{get groupID(){return this.groupId}set groupID(t){this.groupId=t}constructor(t,s){this.groupId=t,this._positionFunction=s}}var Qx={internalPickerForMesh:void 0};class Z{constructor(t,s,i=Number.MAX_VALUE,r=G){this.origin=t,this.direction=s,this.length=i,this.epsilon=r}clone(){return new Z(this.origin.clone(),this.direction.clone(),this.length)}intersectsBoxMinMax(t,s,i=0){let r=Z._TmpVector3[0].copyFromFloats(t.x-i,t.y-i,t.z-i),o=Z._TmpVector3[1].copyFromFloats(s.x+i,s.y+i,s.z+i),m=0,f=Number.MAX_VALUE,y,M,v,b;if(Math.abs(this.direction.x)<0.0000001){if(this.origin.x<r.x||this.origin.x>o.x)return!1}else{if(y=1/this.direction.x,M=(r.x-this.origin.x)*y,v=(o.x-this.origin.x)*y,v===-1/0)v=1/0;if(M>v)b=M,M=v,v=b;if(m=Math.max(M,m),f=Math.min(v,f),m>f)return!1}if(Math.abs(this.direction.y)<0.0000001){if(this.origin.y<r.y||this.origin.y>o.y)return!1}else{if(y=1/this.direction.y,M=(r.y-this.origin.y)*y,v=(o.y-this.origin.y)*y,v===-1/0)v=1/0;if(M>v)b=M,M=v,v=b;if(m=Math.max(M,m),f=Math.min(v,f),m>f)return!1}if(Math.abs(this.direction.z)<0.0000001){if(this.origin.z<r.z||this.origin.z>o.z)return!1}else{if(y=1/this.direction.z,M=(r.z-this.origin.z)*y,v=(o.z-this.origin.z)*y,v===-1/0)v=1/0;if(M>v)b=M,M=v,v=b;if(m=Math.max(M,m),f=Math.min(v,f),m>f)return!1}return!0}intersectsBox(t,s=0){return this.intersectsBoxMinMax(t.minimum,t.maximum,s)}intersectsSphere(t,s=0){let i=t.center.x-this.origin.x,r=t.center.y-this.origin.y,o=t.center.z-this.origin.z,m=i*i+r*r+o*o,f=t.radius+s,y=f*f;if(m<=y)return!0;let M=i*this.direction.x+r*this.direction.y+o*this.direction.z;if(M<0)return!1;return m-M*M<=y}intersectsTriangle(t,s,i){let r=Z._TmpVector3[0],o=Z._TmpVector3[1],m=Z._TmpVector3[2],f=Z._TmpVector3[3],y=Z._TmpVector3[4];s.subtractToRef(t,r),i.subtractToRef(t,o),e.CrossToRef(this.direction,o,m);let M=e.Dot(r,m);if(M===0)return null;let v=1/M;this.origin.subtractToRef(t,f);let b=e.Dot(f,m)*v;if(b<-this.epsilon||b>1+this.epsilon)return null;e.CrossToRef(f,r,y);let D=e.Dot(this.direction,y)*v;if(D<-this.epsilon||b+D>1+this.epsilon)return null;let T=e.Dot(o,y)*v;if(T>this.length||T<0)return null;return new Va(1-b-D,b,T)}intersectsPlane(t){let s,i=e.Dot(t.normal,this.direction);if(Math.abs(i)<0.000000999999997475243)return null;else{let r=e.Dot(t.normal,this.origin);if(s=(-t.d-r)/i,s<0)if(s<-0.000000999999997475243)return null;else return 0;return s}}intersectsAxis(t,s=0){switch(t){case"y":{let i=(this.origin.y-s)/this.direction.y;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,s,this.origin.z+this.direction.z*-i)}case"x":{let i=(this.origin.x-s)/this.direction.x;if(i>0)return null;return new e(s,this.origin.y+this.direction.y*-i,this.origin.z+this.direction.z*-i)}case"z":{let i=(this.origin.z-s)/this.direction.z;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,this.origin.y+this.direction.y*-i,s)}default:return null}}intersectsMesh(t,s,i,r=!1,o,m=!1){let f=a.Matrix[0];if(t.getWorldMatrix().invertToRef(f),this._tmpRay)Z.TransformToRef(this,f,this._tmpRay);else this._tmpRay=Z.Transform(this,f);return t.intersects(this._tmpRay,s,i,r,o,m)}intersectsMeshes(t,s,i){if(i)i.length=0;else i=[];for(let r=0;r<t.length;r++){let o=this.intersectsMesh(t[r],s);if(o.hit)i.push(o)}return i.sort(this._comparePickingInfo),i}_comparePickingInfo(t,s){if(t.distance<s.distance)return-1;else if(t.distance>s.distance)return 1;else return 0}intersectionSegment(t,s,i){let r=this.origin,o=a.Vector3[0],m=a.Vector3[1],f=a.Vector3[2],y=a.Vector3[3];s.subtractToRef(t,o),this.direction.scaleToRef(Z._Rayl,f),r.addToRef(f,m),t.subtractToRef(r,y);let M=e.Dot(o,o),v=e.Dot(o,f),b=e.Dot(f,f),D=e.Dot(o,y),T=e.Dot(f,y),P=M*b-v*v,z,W=P,E,w=P;if(P<Z._Smallnum)z=0,W=1,E=T,w=b;else if(z=v*T-b*D,E=M*T-v*D,z<0)z=0,E=T,w=b;else if(z>W)z=W,E=T+v,w=b;if(E<0)if(E=0,-D<0)z=0;else if(-D>M)z=W;else z=-D,W=M;else if(E>w)if(E=w,-D+v<0)z=0;else if(-D+v>M)z=W;else z=-D+v,W=M;let q=Math.abs(z)<Z._Smallnum?0:z/W,C=Math.abs(E)<Z._Smallnum?0:E/w,I=a.Vector3[4];f.scaleToRef(C,I);let U=a.Vector3[5];o.scaleToRef(q,U),U.addInPlace(y);let F=a.Vector3[6];if(U.subtractToRef(I,F),C>0&&C<=this.length&&F.lengthSquared()<i*i)return U.length();return-1}update(t,s,i,r,o,m,f,y=!1){if(y){if(!Z._RayDistant)Z._RayDistant=Z.Zero();Z._RayDistant.unprojectRayToRef(t,s,i,r,l.IdentityReadOnly,m,f);let M=a.Matrix[0];o.invertToRef(M),Z.TransformToRef(Z._RayDistant,M,this)}else this.unprojectRayToRef(t,s,i,r,o,m,f);return this}static Zero(){return new Z(e.Zero(),e.Zero())}static CreateNew(t,s,i,r,o,m,f){return Z.Zero().update(t,s,i,r,o,m,f)}static CreateNewFromTo(t,s,i=l.IdentityReadOnly){let r=new Z(new e(0,0,0),new e(0,0,0));return Z.CreateFromToToRef(t,s,r,i)}static CreateFromToToRef(t,s,i,r=l.IdentityReadOnly){i.origin.copyFrom(t);let o=s.subtractToRef(t,i.direction),m=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z);return i.length=m,i.direction.normalize(),Z.TransformToRef(i,r,i)}static Transform(t,s){let i=new Z(new e(0,0,0),new e(0,0,0));return Z.TransformToRef(t,s,i),i}static TransformToRef(t,s,i){e.TransformCoordinatesToRef(t.origin,s,i.origin),e.TransformNormalToRef(t.direction,s,i.direction),i.length=t.length,i.epsilon=t.epsilon;let r=i.direction,o=r.length();if(!(o===0||o===1)){let m=1/o;r.x*=m,r.y*=m,r.z*=m,i.length*=o}return i}unprojectRayToRef(t,s,i,r,o,m,f){let y=a.Matrix[0];o.multiplyToRef(m,y),y.multiplyToRef(f,y),y.invert();let M=A.LastCreatedEngine,v=a.Vector3[0];v.x=t/i*2-1,v.y=-(s/r*2-1),v.z=M?.useReverseDepthBuffer?1:M?.isNDCHalfZRange?0:-1;let b=a.Vector3[1].copyFromFloats(v.x,v.y,0.99999999),D=a.Vector3[2],T=a.Vector3[3];e.TransformCoordinatesToRef(v,y,D),e.TransformCoordinatesToRef(b,y,T),this.origin.copyFrom(D),T.subtractToRef(D,this.direction),this.direction.normalize()}}Z._TmpVector3=lr(6,e.Zero);Z._RayDistant=Z.Zero();Z._Smallnum=0.00000001;Z._Rayl=1e9;function gh(t,s,i,r,o,m=!1){let f=Z.Zero();return hc(t,s,i,r,f,o,m),f}function hc(t,s,i,r,o,m,f=!1,y=!1){let M=t.getEngine();if(!m&&!(m=t.activeCamera)&&!(m=t.cameraToUseForPointers))return t;let v=m.viewport,b=M.getRenderHeight(),{x:D,y:T,width:P,height:z}=v.toGlobal(M.getRenderWidth(),b),W=1/M.getHardwareScalingLevel();return s=s*W-D,i=i*W-(b-T-z),o.update(s,i,P,z,r?r:l.IdentityReadOnly,f?l.IdentityReadOnly:m.getViewMatrix(),m.getProjectionMatrix(),y),t}function _h(t,s,i,r){let o=Z.Zero();return Ol(t,s,i,o,r),o}function Ol(t,s,i,r,o){if(!gi)return t;let m=t.getEngine();if(!o&&!(o=t.activeCamera)&&!(o=t.cameraToUseForPointers))throw Error("Active camera not set");let f=o.viewport,y=m.getRenderHeight(),{x:M,y:v,width:b,height:D}=f.toGlobal(m.getRenderWidth(),y),T=l.Identity(),P=1/m.getHardwareScalingLevel();return s=s*P-M,i=i*P-(y-v-D),r.update(s,i,b,D,T,T,o.getProjectionMatrix()),t}function We(t,s,i,r,o,m,f,y){let M=s(r,i.enableDistantPicking);return tt(t,i,r,M,o,m,f,y)}function tt(t,s,i,r,o,m,f,y){let M=s.intersects(r,o,f,m,i,y);if(!M||!M.hit)return null;if(!o&&t!=null&&M.distance>=t.distance)return null;return M}function Cs(t,s){return t==="InstancedLinesMesh"||t==="LinesMesh"?s.intersectionThreshold:0}function ls(t){let s=t.getClassName();if(s==="GreasedLineMesh")return{rawBoundingInfo:null,intersectionThreshold:0};let i=t.rawBoundingInfo;return{rawBoundingInfo:i,intersectionThreshold:i?Cs(s,t):0}}function cs(t,s,i,r,o){let m=t(i,s.enableDistantPicking);if(!m.intersectsSphere(r.boundingSphere,o)||!m.intersectsBox(r.boundingBox,o))return null;return m}function st(t,s,i,r,o,m){let f=null,y=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),M=t.cameraToUseForPointers||t.activeCamera,v=Qx.internalPickerForMesh||We,b=v===We;for(let D=0;D<t.meshes.length;D++){let T=t.meshes[D];if(i){if(!i(T,-1))continue}else if(!T.isEnabled()||!T.isVisible||!T.isPickable)continue;let P=y&&T.isWorldMatrixCameraDependent(),z=T.computeWorldMatrix(P,M);if(T.hasThinInstances&&T.thinInstanceEnablePicking){let W=v(f,s,T,z,!0,!0,m);if(W){if(o)return W;let{rawBoundingInfo:E,intersectionThreshold:w}=ls(T),q=T._thinInstanceDataStorage.matrixData;if(q){let C=a.Matrix[0],I=a.Matrix[1],U=Math.min(T.thinInstanceCount,q.length>>4);for(let F=0;F<U;F++){if(i&&!i(T,F))continue;l.FromArrayToRef(q,F<<4,C),C.multiplyToRef(z,I);let V=b&&E?cs(s,T,I,E,w):null;if(b&&E&&!V)continue;let N=b&&V?tt(f,T,I,V,r,o,m,!0):v(f,s,T,I,r,o,m,!0);if(N){if(f=N,f.thinInstanceIndex=F,r)return f}}}}}else{let W=v(f,s,T,z,r,o,m);if(W){if(f=W,r)return f}}}return f||new gi}function us(t,s,i,r){if(!gi)return null;let o=[],m=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),f=t.cameraToUseForPointers||t.activeCamera,y=Qx.internalPickerForMesh||We,M=y===We;for(let v=0;v<t.meshes.length;v++){let b=t.meshes[v];if(i){if(!i(b,-1))continue}else if(!b.isEnabled()||!b.isVisible||!b.isPickable)continue;let D=m&&b.isWorldMatrixCameraDependent(),T=b.computeWorldMatrix(D,f);if(b.hasThinInstances&&b.thinInstanceEnablePicking){if(y(null,s,b,T,!0,!0,r)){let{rawBoundingInfo:z,intersectionThreshold:W}=ls(b),E=b._thinInstanceDataStorage.matrixData;if(E){let w=a.Matrix[0],q=a.Matrix[1],C=Math.min(b.thinInstanceCount,E.length>>4);for(let I=0;I<C;I++){if(i&&!i(b,I))continue;l.FromArrayToRef(E,I<<4,w),w.multiplyToRef(T,q);let U=M&&z?cs(s,b,q,z,W):null;if(M&&z&&!U)continue;let F=M&&U?tt(null,b,q,U,!1,!1,r,!0):y(null,s,b,q,!1,!1,r,!0);if(F)F.thinInstanceIndex=I,o.push(F)}}}}else{let P=y(null,s,b,T,!1,!1,r);if(P)o.push(P)}}return o}function qx(t,s,i,r,o,m){if(!gi)return null;let f=st(t,(y)=>{if(!t._tempPickingRay)t._tempPickingRay=Z.Zero();return hc(t,s,i,y,t._tempPickingRay,m||null),t._tempPickingRay},r,o,!0);if(f)f.ray=gh(t,s,i,l.Identity(),m||null);return f}function xh(t,s,i,r,o,m,f,y=!1){let M=st(t,(v,b)=>{if(!t._tempPickingRay)t._tempPickingRay=Z.Zero();return hc(t,s,i,v,t._tempPickingRay,m||null,!1,b),t._tempPickingRay},r,o,!1,f);if(M)M.ray=gh(t,s,i,l.Identity(),m||null);return M}function vh(t,s,i,r,o){let m=st(t,(f)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=l.Identity();if(f.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=Z.Zero();return Z.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r,!1,o);if(m)m.ray=s;return m}function Zx(t,s,i,r,o,m){return us(t,(f)=>gh(t,s,i,f,o||null),r,m)}function Kx(t,s,i,r){return us(t,(o)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=l.Identity();if(o.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=Z.Zero();return Z.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r)}function KE(t,s=100,i,r){return Nf(t,new Z(e.Zero(),e.Zero(),s),s,i,r)}function Nf(t,s,i=100,r,o){if(!r)r=t.getWorldMatrix();if(s.length=i,o)s.origin.copyFrom(o);else s.origin.copyFrom(t.position);let m=a.Vector3[2];m.set(0,0,t._scene.useRightHandedSystem?-1:1);let f=a.Vector3[3];return e.TransformNormalToRef(m,r,f),e.NormalizeToRef(f,s.direction),s}function Jx(t,s){if(s)s.prototype.getForwardRay=function(i=100,r,o){return Nf(this,new Z(e.Zero(),e.Zero(),i),i,r,o)},s.prototype.getForwardRayToRef=function(i,r=100,o,m){return Nf(this,i,r,o,m)};if(!t)return;eh._IsPickingAvailable=!0,t.prototype.createPickingRay=function(i,r,o,m,f=!1){return gh(this,i,r,o,m,f)}}var sv;(function(t){t[t.Color=2]="Color",t[t.UV=1]="UV",t[t.Random=0]="Random",t[t.Stated=3]="Stated"})(sv||(sv={}));class kf{get positions(){return this._positions32}get colors(){return this._colors32}get uvs(){return this._uvs32}constructor(t,s,i,r){if(this.particles=[],this.nbParticles=0,this.counter=0,this.vars={},this._promises=[],this._positions=[],this._indices=[],this._normals=[],this._colors=[],this._uvs=[],this._updatable=!0,this._isVisibilityBoxLocked=!1,this._alwaysVisible=!1,this._groups=[],this._groupCounter=0,this._computeParticleColor=!0,this._computeParticleTexture=!0,this._computeParticleRotation=!0,this._computeBoundingBox=!1,this._isReady=!1,this.name=t,this._size=s,this._scene=i||A.LastCreatedScene,r&&r.updatable!==void 0)this._updatable=r.updatable;else this._updatable=!0}async buildMeshAsync(t){return await Promise.all(this._promises),this._isReady=!0,await this._buildMeshAsync(t)}async _buildMeshAsync(t){if(this.nbParticles===0)this.addPoints(1);this._positions32=new Float32Array(this._positions),this._uvs32=new Float32Array(this._uvs),this._colors32=new Float32Array(this._colors);let s=new O;if(s.set(this._positions32,n.PositionKind),this._uvs32.length>0)s.set(this._uvs32,n.UVKind);let i=0;if(this._colors32.length>0)i=1,s.set(this._colors32,n.ColorKind);let r=new p(this.name,this._scene);if(s.applyToMesh(r,this._updatable),this.mesh=r,this._positions=null,this._uvs=null,this._colors=null,!this._updatable)this.particles.length=0;let o=t;if(!o)o=new L("point cloud material",this._scene),o.emissiveColor=new u(i,i,i),o.disableLighting=!0,o.pointsCloud=!0,o.pointSize=this._size;return r.material=o,r}_addParticle(t,s,i,r){let o=new Ff(t,s,i,r,this);return this.particles.push(o),o}_randomUnitVector(t){t.position=new e(Math.random(),Math.random(),Math.random()),t.color=new S(1,1,1,1)}_getColorIndicesForCoord(t,s,i,r){let o=t._groupImageData,m=i*(r*4)+s*4,f=[m,m+1,m+2,m+3],y=f[0],M=f[1],v=f[2],b=f[3],D=o[y],T=o[M],P=o[v],z=o[b];return new S(D/255,T/255,P/255,z)}_setPointsColorOrUV(t,s,i,r,o,m,f,y){if(y=y??0,i)t.updateFacetData();let v=2*t.getBoundingInfo().boundingSphere.radius,b=t.getVerticesData(n.PositionKind),D=t.getIndices(),T=t.getVerticesData(n.UVKind+(y?y+1:"")),P=t.getVerticesData(n.ColorKind),z=e.Zero();t.computeWorldMatrix();let W=t.getWorldMatrix();if(!W.isIdentity()){b=b.slice(0);for(let ue=0;ue<b.length/3;ue++)e.TransformCoordinatesFromFloatsToRef(b[3*ue],b[3*ue+1],b[3*ue+2],W,z),b[3*ue]=z.x,b[3*ue+1]=z.y,b[3*ue+2]=z.z}let E,w,q,C,I,U,F,V,N,K,te,j,Q,ie=e.Zero(),H=e.Zero(),ee=e.Zero(),ne=e.Zero(),se=e.Zero(),le,oe,Y,fe,_e,xe,de=g.Zero(),re=g.Zero(),rt=g.Zero(),ot=g.Zero(),nt=g.Zero(),at,lt,ct,ut,ht,ft,dt,pt,_t,mt,gt,xt,De=R.Zero(),Ge=R.Zero(),yt=R.Zero(),St=R.Zero(),Mt=R.Zero(),Se,Fe;f=f?f:0;let Ae,qe,ae=new R(0,0,0,1),Ne,Xe,bt,ve,vt,wt,Rt,Pe=new Z(e.Zero(),new e(1,0,0)),He,ke;for(let ue=0;ue<D.length/3;ue++){if(w=D[3*ue],q=D[3*ue+1],C=D[3*ue+2],I=b[3*w],U=b[3*w+1],F=b[3*w+2],V=b[3*q],N=b[3*q+1],K=b[3*q+2],te=b[3*C],j=b[3*C+1],Q=b[3*C+2],ie.set(I,U,F),H.set(V,N,K),ee.set(te,j,Q),H.subtractToRef(ie,ne),ee.subtractToRef(H,se),T)le=T[2*w],oe=T[2*w+1],Y=T[2*q],fe=T[2*q+1],_e=T[2*C],xe=T[2*C+1],de.set(le,oe),re.set(Y,fe),rt.set(_e,xe),re.subtractToRef(de,ot),rt.subtractToRef(re,nt);if(P&&r)at=P[4*w],lt=P[4*w+1],ct=P[4*w+2],ut=P[4*w+3],ht=P[4*q],ft=P[4*q+1],dt=P[4*q+2],pt=P[4*q+3],_t=P[4*C],mt=P[4*C+1],gt=P[4*C+2],xt=P[4*C+3],De.set(at,lt,ct,ut),Ge.set(ht,ft,dt,pt),yt.set(_t,mt,gt,xt),Ge.subtractToRef(De,St),yt.subtractToRef(Ge,Mt);let Ze,Tt,Ct,Dt,At,we,Re,Be,Lt=new u(0,0,0),ze=new u(0,0,0),Te,pe;for(let je=0;je<s._groupDensity[ue];je++){if(E=this.particles.length,this._addParticle(E,s,this._groupCounter,ue+je),pe=this.particles[E],Se=Math.sqrt(k(0,1)),Fe=k(0,1),Ae=ie.add(ne.scale(Se)).add(se.scale(Se*Fe)),i){if(Ne=t.getFacetNormal(ue).normalize().scale(-1),Xe=ne.clone().normalize(),bt=e.Cross(Ne,Xe),ve=k(0,2*Math.PI),vt=Xe.scale(Math.cos(ve)).add(bt.scale(Math.sin(ve))),ve=k(0.1,Math.PI/2),ke=vt.scale(Math.cos(ve)).add(Ne.scale(Math.sin(ve))),Pe.origin=Ae.add(ke.scale(0.00001)),Pe.direction=ke,Pe.length=v,He=Pe.intersectsMesh(t),He.hit)Rt=He.pickedPoint.subtract(Ae).length(),wt=k(0,1)*Rt,Ae.addInPlace(ke.scale(wt))}if(pe.position=Ae.clone(),this._positions.push(pe.position.x,pe.position.y,pe.position.z),r!==void 0){if(T)if(qe=de.add(ot.scale(Se)).add(nt.scale(Se*Fe)),r)if(o&&s._groupImageData!==null)Ze=s._groupImgWidth,Tt=s._groupImgHeight,Te=this._getColorIndicesForCoord(s,Math.round(qe.x*Ze),Math.round(qe.y*Tt),Ze),pe.color=Te,this._colors.push(Te.r,Te.g,Te.b,Te.a);else if(P)ae=De.add(St.scale(Se)).add(Mt.scale(Se*Fe)),pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else ae=De.set(Math.random(),Math.random(),Math.random(),1),pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else pe.uv=qe.clone(),this._uvs.push(pe.uv.x,pe.uv.y)}else{if(m){if(Lt.set(m.r,m.g,m.b),Ct=k(-f,f),Dt=k(-f,f),Be=Lt.toHSV(),At=Be.r,we=Be.g+Ct,Re=Be.b+Dt,we<0)we=0;if(we>1)we=1;if(Re<0)Re=0;if(Re>1)Re=1;u.HSVtoRGBToRef(At,we,Re,ze),ae.set(ze.r,ze.g,ze.b,1)}else ae=De.set(Math.random(),Math.random(),Math.random(),1);pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w)}}}}_colorFromTexture(t,s,i){if(t.material===null){c.Warn(t.name+"has no material."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let o=t.material.getActiveTextures();if(o.length===0){c.Warn(t.name+"has no usable texture."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let m=t.clone();m.setEnabled(!1),this._promises.push(new Promise((f)=>{Ut.WhenAllReady(o,()=>{let y=s._textureNb;if(y<0)y=0;if(y>o.length-1)y=o.length-1;let M=()=>{s._groupImgWidth=o[y].getSize().width,s._groupImgHeight=o[y].getSize().height,this._setPointsColorOrUV(m,s,i,!0,!0,void 0,void 0,o[y].coordinatesIndex),m.dispose(),f()};s._groupImageData=null;let v=o[y].readPixels();if(!v)M();else v.then((b)=>{s._groupImageData=b,M()})})}))}_calculateDensity(t,s,i){let r,o,m,f,y,M,v,b,D,T,P,z,W=e.Zero(),E=e.Zero(),w=e.Zero(),q=e.Zero(),C=e.Zero(),I=e.Zero(),U,F=[],V=0,N=i.length/3;for(let j=0;j<N;j++)r=i[3*j],o=i[3*j+1],m=i[3*j+2],f=s[3*r],y=s[3*r+1],M=s[3*r+2],v=s[3*o],b=s[3*o+1],D=s[3*o+2],T=s[3*m],P=s[3*m+1],z=s[3*m+2],W.set(f,y,M),E.set(v,b,D),w.set(T,P,z),E.subtractToRef(W,q),w.subtractToRef(E,C),e.CrossToRef(q,C,I),U=0.5*I.length(),V+=U,F[j]=V;let K=Array(N),te=t;for(let j=N-1;j>0;j--){let Q=F[j];if(Q===0)K[j]=0;else{let H=(Q-F[j-1])/Q*te,ee=Math.floor(H),ne=H-ee,se=Number(Math.random()<ne),le=ee+se;K[j]=le,te-=le}}return K[0]=te,K}addPoints(t,s=this._randomUnitVector){let i=new fc(this._groupCounter,s),r,o=this.nbParticles;for(let m=0;m<t;m++){if(r=this._addParticle(o,i,this._groupCounter,m),i&&i._positionFunction)i._positionFunction(r,o,m);if(this._positions.push(r.position.x,r.position.y,r.position.z),r.color)this._colors.push(r.color.r,r.color.g,r.color.b,r.color.a);if(r.uv)this._uvs.push(r.uv.x,r.uv.y);o++}return this.nbParticles+=t,this._groupCounter++,this._groupCounter}addSurfacePoints(t,s,i,r,o){let m=i?i:0;if(isNaN(m)||m<0||m>3)m=0;let f=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let M=new fc(this._groupCounter,null);if(M._groupDensity=this._calculateDensity(s,f,y),m===2)M._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(m){case 2:this._colorFromTexture(t,M,!1);break;case 1:this._setPointsColorOrUV(t,M,!1,!1,!1);break;case 0:this._setPointsColorOrUV(t,M,!1);break;case 3:this._setPointsColorOrUV(t,M,!1,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}addVolumePoints(t,s,i,r,o){let m=i?i:0;if(isNaN(m)||m<0||m>3)m=0;let f=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let M=new fc(this._groupCounter,null);if(M._groupDensity=this._calculateDensity(s,f,y),m===2)M._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(m){case 2:this._colorFromTexture(t,M,!0);break;case 1:this._setPointsColorOrUV(t,M,!0,!1,!1);break;case 0:this._setPointsColorOrUV(t,M,!0);break;case 3:this._setPointsColorOrUV(t,M,!0,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}setParticles(t=0,s=this.nbParticles-1,i=!0){if(!this._updatable||!this._isReady)return this;this.beforeUpdateParticles(t,s,i);let r=a.Matrix[0],o=this.mesh,m=this._colors32,f=this._positions32,y=this._uvs32,M=a.Vector3,v=M[5].copyFromFloats(1,0,0),b=M[6].copyFromFloats(0,1,0),D=M[7].copyFromFloats(0,0,1),T=M[8].setAll(Number.MAX_VALUE),P=M[9].setAll(-Number.MAX_VALUE);l.IdentityToRef(r);let z;if(this.mesh?.isFacetDataEnabled)this._computeBoundingBox=!0;if(s=s>=this.nbParticles?this.nbParticles-1:s,this._computeBoundingBox){if(t!=0||s!=this.nbParticles-1){let q=this.mesh?.getBoundingInfo();if(q)T.copyFrom(q.minimum),P.copyFrom(q.maximum)}}let W,E,w;for(let q=t;q<=s;q++){let C=this.particles[q];z=C.idx,W=3*z,E=4*z,w=2*z,this.updateParticle(C);let{_rotationMatrix:I,position:U,_globalPosition:F}=C;if(this._computeParticleRotation)C.getRotationMatrix(r);if(C.parentId!==null){let oe=this.particles[C.parentId],{_rotationMatrix:Y,_globalPosition:fe}=oe,_e=U.x*Y[1]+U.y*Y[4]+U.z*Y[7],xe=U.x*Y[0]+U.y*Y[3]+U.z*Y[6],de=U.x*Y[2]+U.y*Y[5]+U.z*Y[8];if(F.x=fe.x+xe,F.y=fe.y+_e,F.z=fe.z+de,this._computeParticleRotation){let re=r.m;I[0]=re[0]*Y[0]+re[1]*Y[3]+re[2]*Y[6],I[1]=re[0]*Y[1]+re[1]*Y[4]+re[2]*Y[7],I[2]=re[0]*Y[2]+re[1]*Y[5]+re[2]*Y[8],I[3]=re[4]*Y[0]+re[5]*Y[3]+re[6]*Y[6],I[4]=re[4]*Y[1]+re[5]*Y[4]+re[6]*Y[7],I[5]=re[4]*Y[2]+re[5]*Y[5]+re[6]*Y[8],I[6]=re[8]*Y[0]+re[9]*Y[3]+re[10]*Y[6],I[7]=re[8]*Y[1]+re[9]*Y[4]+re[10]*Y[7],I[8]=re[8]*Y[2]+re[9]*Y[5]+re[10]*Y[8]}}else if(F.x=0,F.y=0,F.z=0,this._computeParticleRotation){let oe=r.m;I[0]=oe[0],I[1]=oe[1],I[2]=oe[2],I[3]=oe[4],I[4]=oe[5],I[5]=oe[6],I[6]=oe[8],I[7]=oe[9],I[8]=oe[10]}let N=M[11];if(C.translateFromPivot)N.setAll(0);else N.copyFrom(C.pivot);let K=M[0];K.copyFrom(C.position);let te=K.x-C.pivot.x,j=K.y-C.pivot.y,Q=K.z-C.pivot.z,ie=te*I[0]+j*I[3]+Q*I[6],H=te*I[1]+j*I[4]+Q*I[7],ee=te*I[2]+j*I[5]+Q*I[8];ie+=N.x,H+=N.y,ee+=N.z;let ne=f[W]=F.x+v.x*ie+b.x*H+D.x*ee,se=f[W+1]=F.y+v.y*ie+b.y*H+D.y*ee,le=f[W+2]=F.z+v.z*ie+b.z*H+D.z*ee;if(this._computeBoundingBox)T.minimizeInPlaceFromFloats(ne,se,le),P.maximizeInPlaceFromFloats(ne,se,le);if(this._computeParticleColor&&C.color){let oe=C.color,Y=this._colors32;Y[E]=oe.r,Y[E+1]=oe.g,Y[E+2]=oe.b,Y[E+3]=oe.a}if(this._computeParticleTexture&&C.uv){let oe=C.uv,Y=this._uvs32;Y[w]=oe.x,Y[w+1]=oe.y}}if(o){if(i){if(this._computeParticleColor)o.updateVerticesData(n.ColorKind,m,!1,!1);if(this._computeParticleTexture)o.updateVerticesData(n.UVKind,y,!1,!1);o.updateVerticesData(n.PositionKind,f,!1,!1)}if(this._computeBoundingBox)if(o.hasBoundingInfo)o.getBoundingInfo().reConstruct(T,P,o._worldMatrix);else o.buildBoundingInfo(T,P,o._worldMatrix)}return this.afterUpdateParticles(t,s,i),this}dispose(){this.mesh?.dispose(),this.vars=null,this._positions=null,this._indices=null,this._normals=null,this._uvs=null,this._colors=null,this._indices32=null,this._positions32=null,this._uvs32=null,this._colors32=null}refreshVisibleSize(){if(!this._isVisibilityBoxLocked)this.mesh?.refreshBoundingInfo();return this}setVisibilityBox(t){if(!this.mesh)return;let s=t/2;this.mesh.buildBoundingInfo(new e(-s,-s,-s),new e(s,s,s))}get isAlwaysVisible(){return this._alwaysVisible}set isAlwaysVisible(t){if(!this.mesh)return;this._alwaysVisible=t,this.mesh.alwaysSelectAsActiveMesh=t}set computeParticleRotation(t){this._computeParticleRotation=t}set computeParticleColor(t){this._computeParticleColor=t}set computeParticleTexture(t){this._computeParticleTexture=t}get computeParticleColor(){return this._computeParticleColor}get computeParticleTexture(){return this._computeParticleTexture}set computeBoundingBox(t){this._computeBoundingBox=t}get computeBoundingBox(){return this._computeBoundingBox}initParticles(){}recycleParticle(t){return t}updateParticle(t){return t}beforeUpdateParticles(t,s,i){}afterUpdateParticles(t,s,i){}}var Ve=0;async function Sh(t,s){return await new Promise((i,r)=>{let o,m;if(Ai())o=window,m="window";else if(typeof self<"u")o=self,m="self";else{r(Error("Cannot load script module outside of a window or a worker"));return}if(!o._LoadScriptModuleResolve)o._LoadScriptModuleResolve={};o._LoadScriptModuleResolve[Ve]=i,t+=`
            ${m}._LoadScriptModuleResolve[${Ve}](returnedValue);
            ${m}._LoadScriptModuleResolve[${Ve}] = undefined;
        `,Ve++,x.LoadScript(t,void 0,(f,y)=>{r(y||Error(f))},s,!0)})}var Ds=32768,Ue=0.28209479177387814,it=null,hs=null;function ds(t,s,i){let r=new Uint8Array(t),o=new Uint32Array(t.slice(0,12)),m=o[2],f=r[12],y=r[13],M=r[14],v=r[15],b=o[1];if(v||o[0]!=1347635022||b<2||b>4)return new Promise((F)=>{F({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let T=new ArrayBuffer(32*m),P=1/(1<<y),z=new Int32Array(1),W=new Uint8Array(z.buffer),E=function(F,V){return W[0]=F[V+0],W[1]=F[V+1],W[2]=F[V+2],W[3]=F[V+2]&128?255:0,z[0]*P},w=16,q=new Float32Array(T),C=new Float32Array(T),I=new Uint8ClampedArray(T),U=new Uint8ClampedArray(T);for(let F=0;F<m;F++)q[F*8+0]=E(r,w+0),q[F*8+1]=E(r,w+3),q[F*8+2]=E(r,w+6),w+=9;for(let F=0;F<m;F++){for(let V=0;V<3;V++){let K=(r[w+m+F*3+V]-127.5)/38.25;I[F*32+24+V]=ar.Clamp((0.5+Ue*K)*255,0,255)}I[F*32+24+3]=r[w+F]}w+=m*4;for(let F=0;F<m;F++)C[F*8+3+0]=Math.exp(r[w+0]/16-10),C[F*8+3+1]=Math.exp(r[w+1]/16-10),C[F*8+3+2]=Math.exp(r[w+2]/16-10),w+=3;if(b>=3){let F=Math.SQRT1_2;for(let V=0;V<m;V++){let N=[r[w+0],r[w+1],r[w+2],r[w+3]],K=N[0]+(N[1]<<8)+(N[2]<<16)+(N[3]<<24),te=511,j=[],Q=K>>>30,ie=K,H=0;for(let se=3;se>=0;--se)if(se!==Q){let le=ie&511,oe=ie>>>9&1;if(ie=ie>>>10,j[se]=F*(le/511),oe===1)j[se]=-j[se];H+=j[se]*j[se]}let ee=1-H;j[Q]=Math.sqrt(Math.max(ee,0));let ne=[3,0,1,2];for(let se=0;se<4;se++)U[V*32+28+se]=Math.round(127.5+j[ne[se]]*127.5);w+=4}}else for(let F=0;F<m;F++){let V=r[w+0],N=r[w+1],K=r[w+2],te=V/127.5-1,j=N/127.5-1,Q=K/127.5-1;U[F*32+28+1]=V,U[F*32+28+2]=N,U[F*32+28+3]=K;let ie=1-(te*te+j*j+Q*Q);U[F*32+28+0]=127.5+Math.sqrt(ie<0?0:ie)*127.5,w+=3}if(f){let V=((f+1)*(f+1)-1)*3,N=Math.ceil(V/16),K=w,j=s.getEngine().getCaps().maxTextureSize,Q=Math.ceil(m/j),ie=Qs(N,Q*j*4*4);for(let H=0;H<m;H++)for(let ee=0;ee<V;ee++){let ne=r[K++],se=Math.floor(ee/16),le=ie[se],oe=ee%16,Y=H*16;le[oe+Y]=ne}return new Promise((H)=>{H({mode:0,data:T,hasVertexColors:!1,sh:ie,shDegree:f,trainedWithAntialiasing:!!M})})}return new Promise((F)=>{F({mode:0,data:T,hasVertexColors:!1,trainedWithAntialiasing:!!M})})}async function ps(t){if(it&&hs===t)return await it;let s=Sh(`import createSpzModule from '${t}';
         const module = await createSpzModule();
         const returnedValue = module;`);return hs=t,it=s,await s}function*As(t,s,i=!1){let r=t.numPoints,o=32,m=new ArrayBuffer(32*r),f=new Float32Array(m),y=new Uint8Array(m),{positions:M,scales:v,colors:b,alphas:D,rotations:T}=t,P=null,z=t.shDegree,W=null,E=0,w=null,q=null,C=null;if(z>0&&t.sh.length>0){E=((z+1)*(z+1)-1)*3;let V=Math.ceil(E/16),K=s.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/K);P=Qs(V,te*K*4*4),w=new Int32Array(V),q=new Int32Array(V);for(let j=0;j<V;j++)w[j]=j*16,q[j]=Math.min((j+1)*16,E);C=P,W=t.sh}for(let F=0;F<r;F++){let V=F*8,N=F*32,K=F*3,te=F*4;f[V+0]=M[K+0],f[V+1]=M[K+1],f[V+2]=M[K+2],f[V+3]=Math.exp(v[K+0]),f[V+4]=Math.exp(v[K+1]),f[V+5]=Math.exp(v[K+2]);let j=(0.5+Ue*b[K+0])*255,Q=(0.5+Ue*b[K+1])*255,ie=(0.5+Ue*b[K+2])*255;y[N+24]=j<=0?0:j>=255?255:j+0.5|0,y[N+25]=Q<=0?0:Q>=255?255:Q+0.5|0,y[N+26]=ie<=0?0:ie>=255?255:ie+0.5|0,y[N+27]=1/(1+Math.exp(-D[F]))*255+0.5|0;let H=T[te+3]*127.5+127.5,ee=T[te+0]*127.5+127.5,ne=T[te+1]*127.5+127.5,se=T[te+2]*127.5+127.5;if(y[N+28]=H<=0?0:H>=255?255:H+0.5|0,y[N+29]=ee<=0?0:ee>=255?255:ee+0.5|0,y[N+30]=ne<=0?0:ne>=255?255:ne+0.5|0,y[N+31]=se<=0?0:se>=255?255:se+0.5|0,W&&C&&w&&q){let le=F*E,oe=F*16;for(let Y=0;Y<C.length;Y++){let fe=C[Y],_e=w[Y],xe=q[Y];for(let de=_e;de<xe;de++){let re=W[le+de]*128+128;fe[oe+de-_e]=re<=0?0:re>=255?255:re+0.5|0}}}if(F%Ds===0&&i)yield}let I,U;if(t.extensions)for(let F of t.extensions){let V=F;if(V.safeOrbitRadiusMin!==void 0){I=V.safeOrbitRadiusMin,U=[V.safeOrbitElevationMin,V.safeOrbitElevationMax];break}}return{mode:0,data:m,hasVertexColors:!1,sh:P!==null?P:void 0,shDegree:z>0?z:void 0,trainedWithAntialiasing:!!t.antialiased,safeOrbitCameraRadiusMin:I,safeOrbitCameraElevationMinMax:U}}async function _s(t,s){return await Zs(As(t,s,!0),fo())}class $n{constructor(t={}){this.name=Ie.name,this._assetContainer=null,this.extensions=Ie.extensions,this._loadingOptions={...$n._DefaultLoadingOptions,...t}}createPlugin(t){return new $n(t[Ie.name])}async importMeshAsync(t,s,i,r,o,m){let f=this._tryCreateLODStream(s,i,r);if(f)return{meshes:[f],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(t,s,i,r).then((y)=>({meshes:y,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(t,s,i){if(typeof s!=="string")return null;let r;try{r=JSON.parse(s)}catch{return null}if(!ye.IsLODMetadata(r))return null;let o=t._blockEntityCollection;t._blockEntityCollection=!!this._assetContainer;try{let m=new ye("GaussianSplattingStream",r,i,t,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return m._parentContainer=this._assetContainer,m}finally{t._blockEntityCollection=o}}static _BuildPointCloud(t,s){if(!s.byteLength)return!1;let i=new Uint8Array(s),r=new Float32Array(s),o=32,m=i.length/o,f=function(y,M){let v=r[8*M+0],b=r[8*M+1],D=r[8*M+2];y.position=new e(v,b,D);let T=i[o*M+24+0]/255,P=i[o*M+24+1]/255,z=i[o*M+24+2]/255;y.color=new S(T,P,z,1)};return t.addPoints(m,f),!0}static _BuildMesh(t,s){let i=new p("PLYMesh",t),r=new Uint8Array(s.data),o=new Float32Array(s.data),m=32,f=r.length/32,y=[],M=new O;for(let v=0;v<f;v++){let b=o[8*v+0],D=o[8*v+1],T=o[8*v+2];y.push(b,D,T)}if(s.hasVertexColors){let v=new Float32Array(f*4);for(let b=0;b<f;b++){let D=r[32*b+24+0]/255,T=r[32*b+24+1]/255,P=r[32*b+24+2]/255;v[b*4+0]=D,v[b*4+1]=T,v[b*4+2]=P,v[b*4+3]=1}M.colors=v}return M.positions=y,M.indices=s.faces,M.applyToMesh(i),i}async _unzipWithFFlateAsync(t){let s=this._loadingOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let{unzipSync:i}=s,r=i(t),o=new Map;for(let[m,f]of Object.entries(r))o.set(m,f);return o}_parseAsync(t,s,i,r){let o=[],m=(w)=>{s._blockEntityCollection=!!this._assetContainer;let q=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(q._parentContainer=this._assetContainer,o.push(q),w.sogTextures)q.setSogTextureData(w.sogTextures);else q.updateData(w.data,w.sh,{flipY:!1},void 0,w.shDegree);q.scaling.y*=-1,q.computeWorldMatrix(!0),q.safeOrbitCameraLimits=$n._ExtractSafeOrbitLimits(w),s._blockEntityCollection=!1},f=s.getEngine(),y=this._loadingOptions.useSogTextures;if(y&&!f.isWebGPU&&f.version<2)c.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),y=!1;let M=y?Le:zt;if(typeof i==="string"){let w=JSON.parse(i);if(w&&w.means&&w.scales&&w.quats&&w.sh0)return new Promise((q,C)=>{M(w,r,s).then((I)=>{m(I),q(o)}).catch((I)=>{C(Error("Failed to parse SOG data.",{cause:I}))})})}let v=i instanceof ArrayBuffer?new Uint8Array(i):i;if(v[0]===80&&v[1]===75)return new Promise((w,q)=>{this._unzipWithFFlateAsync(v).then((C)=>{M(C,r,s).then((I)=>{m(I),w(o)}).catch((I)=>{q(Error("Failed to parse SOG zip data.",{cause:I}))})})});let b=(w)=>{$n._ConvertPLYToSplat(i).then(async(q)=>{switch(s._blockEntityCollection=!!this._assetContainer,q.mode){case 0:{let C=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(C._parentContainer=this._assetContainer,o.push(C),C.updateData(q.data,q.sh,{flipY:!1},void 0,q.shDegree),C.scaling.y*=-1,q.chirality==="RightHanded")C.scaling.y*=-1;switch(q.upAxis){case"X":C.rotation=new e(0,0,Math.PI/2);break;case"Y":C.rotation=new e(0,0,Math.PI);break;case"Z":C.rotation=new e(-Math.PI/2,Math.PI,0);break}C.computeWorldMatrix(!0),C.safeOrbitCameraLimits=$n._ExtractSafeOrbitLimits(q)}break;case 1:{let C=new kf("PointCloud",1,s);if($n._BuildPointCloud(C,q.data))await C.buildMeshAsync().then((I)=>{o.push(I)});else C.dispose()}break;case 2:if(q.faces)o.push($n._BuildMesh(s,q));else throw Error("PLY mesh doesn't contain face informations.");break;default:throw Error("Unsupported Splat mode")}s._blockEntityCollection=!1,this.applyAutoCameraLimits($n._ExtractSafeOrbitLimits(q),s),w(o)})},D=v[0]===31&&v[1]===139,T=v[0]===78&&v[1]===71&&v[2]===83&&v[3]===80;if(!D&&!T)return new Promise((w)=>{b(w)});let P=(w,q)=>{s._blockEntityCollection=!!this._assetContainer;let C=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(w.trainedWithAntialiasing){let U=C.material;U.kernelSize=0.1,U.compensation=!0}if(C._parentContainer=this._assetContainer,o.push(C),C.updateData(w.data,w.sh,{flipY:!1},void 0,w.shDegree),!this._loadingOptions.flipY)C.scaling.y*=-1,C.computeWorldMatrix(!0);s._blockEntityCollection=!1;let I=$n._ExtractSafeOrbitLimits(w);C.safeOrbitCameraLimits=I,this.applyAutoCameraLimits(I,s),q(o)};if(this._loadingOptions.spzLibraryUrl)return ps(this._loadingOptions.spzLibraryUrl).then((w)=>{let q=w.loadSpzFromBuffer(new Uint8Array(i),{to:w.CoordinateSystem.RUB});return _s(q,s).then((C)=>new Promise((I)=>{P(C,I)}))});if(T)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let z=new ReadableStream({start(w){w.enqueue(new Uint8Array(i)),w.close()}}),W=new DecompressionStream("gzip"),E=z.pipeThrough(W);return new Promise((w)=>{new Response(E).arrayBuffer().then((q)=>{ds(q,s,this._loadingOptions).then((C)=>{P(C,w)})}).catch(()=>{b(w)})})}static _ExtractSafeOrbitLimits(t){if(t.safeOrbitCameraRadiusMin===void 0&&t.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:t.safeOrbitCameraRadiusMin,elevationMinMax:t.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(t,s){if(this._loadingOptions.disableAutoCameraLimits||!t)return;if(s.activeCamera?.getClassName()==="ArcRotateCamera"){let i=s.activeCamera;if(t.elevationMinMax)i.lowerBetaLimit=Math.PI*0.5-t.elevationMinMax[1],i.upperBetaLimit=Math.PI*0.5-t.elevationMinMax[0];if(t.radiusMin)i.lowerRadiusLimit=t.radiusMin}}loadAssetContainerAsync(t,s,i){let r=new $r(t);return this._assetContainer=r,this.importMeshAsync(null,t,s,i).then((o)=>{for(let m of o.meshes)r.meshes.push(m);return this._assetContainer=null,r}).catch((o)=>{throw this._assetContainer=null,o})}loadAsync(t,s,i){return this.importMeshAsync(null,t,s,i).then(()=>{})}static _ConvertPLYToSplat(t){let s=new Uint8Array(t),i=new TextDecoder().decode(s.slice(0,10240)),r=`end_header
`,o=i.indexOf(`end_header
`);if(o<0||!i)return new Promise((U)=>{U({mode:0,data:t,rawSplat:!0})});let m=parseInt(/element vertex (\d+)\n/.exec(i)[1]),f=/element face (\d+)\n/.exec(i),y=0;if(f)y=parseInt(f[1]);let M=/element chunk (\d+)\n/.exec(i),v=0;if(M)v=parseInt(M[1]);let b=0,D=0,T={double:8,int:4,uint:4,float:4,short:2,ushort:2,uchar:1,list:0},P={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},z=P.Chunk,W=[],E=[],w=i.slice(0,o).split(`
`),q={};for(let U of w)if(U.startsWith("property ")){let[,F,V]=U.split(" ");if(z==P.Chunk)E.push({name:V,type:F,offset:D}),D+=T[F];else if(z==P.Vertex)W.push({name:V,type:F,offset:b}),b+=T[F];else if(z==P.SH)W.push({name:V,type:F,offset:b});else if(z==P.Float_Tuple){let N=new DataView(t,D,T.float*2);q.safeOrbitCameraElevationMinMax=[N.getFloat32(0,!0),N.getFloat32(4,!0)]}else if(z==P.Float){let N=new DataView(t,D,T.float);q.safeOrbitCameraRadiusMin=N.getFloat32(0,!0)}else if(z==P.Uchar){let N=new DataView(t,D,T.uchar);if(V=="up_axis")q.upAxis=N.getUint8(0)==0?"X":N.getUint8(0)==1?"Y":"Z";else if(V=="chirality")q.chirality=N.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!T[F])c.Warn(`Unsupported property type: ${F}.`)}else if(U.startsWith("element ")){let[,F]=U.split(" ");if(F=="chunk")z=P.Chunk;else if(F=="vertex")z=P.Vertex;else if(F=="sh")z=P.SH;else if(F=="safe_orbit_camera_elevation_min_max_radians")z=P.Float_Tuple;else if(F=="safe_orbit_camera_radius_min")z=P.Float;else if(F=="up_axis"||F=="chirality")z=P.Uchar}let C=b,I=D;return es.ConvertPLYWithSHToSplatAsync(t).then(async(U)=>{let F=new DataView(t,o+11),V=I*v+C*m,N=[];if(y)for(let ee=0;ee<y;ee++){let ne=F.getUint8(V);if(ne!=3)continue;V+=1;for(let se=0;se<ne;se++){let le=F.getUint32(V+(2-se)*4,!0);N.push(le)}V+=12}if(v)return await new Promise((ee)=>{ee({mode:0,data:U.buffer,sh:U.sh,shDegree:U.shDegree,faces:N,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let K=0,te=0,j=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],Q=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let ee=0;ee<W.length;ee++){let ne=W[ee];if(j.includes(ne.name))K++;if(Q.includes(ne.name))te++}let ie=K==j.length&&te>=3,H=y?2:ie?0:1;return await new Promise((ee)=>{ee({...q,mode:H,data:U.buffer,sh:U.sh,shDegree:U.shDegree,faces:N,hasVertexColors:!!te,compressed:!1,rawSplat:!1})})})}}$n._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?"https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js":void 0};var ms=!1;function Kb(){if(ms)return;ms=!0,Br(new $n)}var gs=!1;function ea(){if(gs)return;gs=!0,J.prototype.createDynamicTexture=function(t,s,i,r){let o=new me(this,4);if(o.baseWidth=t,o.baseHeight=s,i)t=this.needPOTTextures?wr(t,this._caps.maxTextureSize):t,s=this.needPOTTextures?wr(s,this._caps.maxTextureSize):s;return o.width=t,o.height=s,o.isReady=!1,o.generateMipMaps=i,o.samplingMode=r,this.updateTextureSamplingMode(r,o),this._internalTexturesCache.push(o),o},J.prototype.updateDynamicTexture=function(t,s,i,r=!1,o,m=!1,f=!1){if(!t)return;let y=this._gl,M=y.TEXTURE_2D,v=this._bindTextureDirectly(M,t,!0,m);if(this._unpackFlipY(i===void 0?t.invertY:i),r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);let b=this._getWebGLTextureType(t.type),D=this._getInternalFormat(o?o:t.format),T=this._getRGBABufferInternalSizedFormat(t.type,D);if(y.texImage2D(M,0,T,D,b,s),t.generateMipMaps)y.generateMipmap(M);if(!v)this._bindTextureDirectly(M,null);if(r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0);if(o)t.format=o;t._dynamicTextureSource=s,t._premulAlpha=r,t.invertY=i||!1,t.isReady=!0}}ea();Kb();
export{Qx,Z,gh,hc,_h,Ol,qx,xh,vh,Zx,Kx,KE,Nf,Jx,ks,uc,ev,tv,iv,Bs,Ir,bh,JE,rv,ea,Sh,Ff,fc,sv,kf,$n,Kb};

//# debugId=DC170CEFD3009C2164756E2164756E21
//# sourceMappingURL=site-yasrzcmf.js.map
