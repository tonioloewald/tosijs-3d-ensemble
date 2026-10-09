import{L}from"./site-bhwwspnh.js";import{Se,ad,cr,nr,Qs,Ly,es,ld}from"./site-xn1x509g.js";import{fo,Zs,Va,ii,M,q,Bc,k,Hl,p,fs,Xr,kr}from"./site-q5cfgh8v.js";import{fe}from"./site-3qkje26k.js";import{_}from"./site-4h1ky90k.js";import{K,n,mi,eh,Zr}from"./site-gc0km1vt.js";import{Ut}from"./site-s1z5jbr4.js";import{h,G,ar,E,F,m,e,w,d,c,a,u,S,ce,Ci,Rr,x,Kt}from"./site-nky97gw9.js";import{me}from"./site-x1mtgtfk.js";import{l}from"./site-sqgademg.js";var Ie={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};Ly();ld();Bc();var Ft,qt;class ks extends p{_isShaderMaterial(t){if(!t)return!1;return t.getClassName()==="ShaderMaterial"}constructor(t,s=null,i=null,r=null,o,g,f,y){super(t,s,i,r,o);if(this.useVertexColor=g,this.useVertexAlpha=f,this.color=new u(1,1,1),this.alpha=1,this._shaderLanguage=0,this._ownsMaterial=!1,r)this.color=r.color.clone(),this.alpha=r.alpha,this.useVertexColor=r.useVertexColor,this.useVertexAlpha=r.useVertexAlpha;this.intersectionThreshold=0.1;let b=[],R={attributes:[n.PositionKind],uniforms:["world","viewProjection"],needAlphaBlending:!0,defines:b,useClipPlane:null,shaderLanguage:0};if(!this.useVertexAlpha)R.needAlphaBlending=!1;else R.defines.push("#define VERTEXALPHA");if(!this.useVertexColor)R.uniforms.push("color"),this._color4=new S;else R.defines.push("#define VERTEXCOLOR"),R.attributes.push(n.ColorKind);if(y)this.material=y;else{if(this.getScene().getEngine().isWebGPU&&!ks.ForceGLSL)this._shaderLanguage=1;R.shaderLanguage=this._shaderLanguage,R.extraInitializationsAsync=async()=>{if(this._shaderLanguage===1)await Promise.all([(h("vrny48ba"),import("./color.vertex-vrny48ba.js")),(h("sw45h91f"),import("./color.fragment-sw45h91f.js"))]);else await Promise.all([(h("z2n5aach"),import("./color.vertex-z2n5aach.js")),(h("v1rtqj5c"),import("./color.fragment-v1rtqj5c.js"))])};let A=new Se("colorShader",this.getScene(),"color",R,!1);A.doNotSerialize=!0,this._ownsMaterial=!0,this._setInternalMaterial(A)}}getClassName(){return"LinesMesh"}get material(){return this._internalAbstractMeshDataInfo._material}set material(t){let s=this.material;if(s===t)return;let i=s&&this._ownsMaterial;if(this._ownsMaterial=!1,this._setInternalMaterial(t),i)s?.dispose()}_setInternalMaterial(t){if(this._setMaterial(t),this.material)this.material.fillMode=k.LineListDrawMode,this.material.disableLighting=!0}get checkCollisions(){return!1}set checkCollisions(t){}_bind(t,s){if(!this._geometry)return this;let i=this.isUnIndexed?null:this._geometry.getIndexBuffer();if(!this._userInstancedBuffersStorage||this.hasThinInstances)this._geometry._bind(s,i);else this._geometry._bind(s,i,this._userInstancedBuffersStorage.vertexBuffers,this._userInstancedBuffersStorage.vertexArrayObjects);if(!this.useVertexColor&&this._isShaderMaterial(this.material)){let{r,g:o,b:g}=this.color;this._color4.set(r,o,g,this.alpha),this.material.setColor4("color",this._color4)}return this}_draw(t,s,i){if(!this._geometry||!this._geometry.getVertexBuffers()||!this._unIndexed&&!this._geometry.getIndexBuffer())return this;let r=this.getScene().getEngine();if(this._unIndexed)r.drawArraysType(k.LineListDrawMode,t.verticesStart,t.verticesCount,i);else r.drawElementsType(k.LineListDrawMode,t.indexStart,t.indexCount,i);return this}dispose(t,s=!1,i){if(!i){if(this._ownsMaterial)this.material?.dispose(!1,!1,!0);else if(s)this.material?.dispose(!1,!1,!0)}super.dispose(t)}clone(t,s=null,i){if(s&&s._addToSceneRootNodes===void 0){let r=s;return r.source=this,new ks(t,this.getScene(),r.parent,r.source,r.doNotCloneChildren)}return new ks(t,this.getScene(),s,this,i)}createInstance(t){let s=new uc(t,this);if(this.instancedBuffers){s.instancedBuffers={};for(let i in this.instancedBuffers)s.instancedBuffers[i]=this.instancedBuffers[i]}return s}serialize(t){super.serialize(t),t.color=this.color.asArray(),t.alpha=this.alpha}static Parse(t,s){let i=new ks(t.name,s);return i.color=u.FromArray(t.color),i.alpha=t.alpha,i}}ks.ForceGLSL=!1;class uc extends fs{constructor(t,s){super(t,s);this.intersectionThreshold=s.intersectionThreshold}getClassName(){return"InstancedLinesMesh"}}var Pt=!1;function ev(){if(Pt)return;Pt=!0,p._LinesMeshParser=(t,s)=>ks.Parse(t,s)}(Ft=ks.prototype).enableEdgesRendering??(Ft.enableEdgesRendering=ce("LinesMesh","enableEdgesRendering"));(qt=uc.prototype).enableEdgesRendering??(qt.enableEdgesRendering=ce("InstancedLinesMesh","enableEdgesRendering"));function tv(t){let s=[],i=[],{lines:r,colors:o}=t,g=[],f=0;for(let b=0;b<r.length;b++){let R=r[b];for(let v=0;v<R.length;v++){let{x:A,y:C,z}=R[v];if(i.push(A,C,z),o){let I=o[b],{r:V,g:W,b:T,a:B}=I[v];g.push(V,W,T,B)}if(v>0)s.push(f-1),s.push(f);f++}}let y=new M;if(y.indices=s,y.positions=i,o)y.colors=g;return y}function iv(t){let s=t.dashSize||3,i=t.gapSize||1,r=t.dashNb||200,o=t.points,g=[],f=[],y=e.Zero(),b=0,R,v,A=0,C;for(C=0;C<o.length-1;C++)o[C+1].subtractToRef(o[C],y),b+=y.length();let z=b/r,I=s*z/(s+i);for(C=0;C<o.length-1;C++){o[C+1].subtractToRef(o[C],y),R=Math.floor(y.length()/z),y.normalize();for(let W=0;W<R;W++)v=z*W,g.push(o[C].x+v*y.x,o[C].y+v*y.y,o[C].z+v*y.z),g.push(o[C].x+(v+I)*y.x,o[C].y+(v+I)*y.y,o[C].z+(v+I)*y.z),f.push(A,A+1),A+=2}let V=new M;return V.positions=g,V.indices=f,V}function Bs(t,s,i=null){let{instance:r,lines:o,colors:g}=s;if(r){let R=r.getVerticesData(n.PositionKind),v,A;if(g)v=r.getVerticesData(n.ColorKind);let C=0,z=0;for(let I=0;I<o.length;I++){let V=o[I];for(let W=0;W<V.length;W++){if(R[C]=V[W].x,R[C+1]=V[W].y,R[C+2]=V[W].z,g&&v)A=g[I],v[z]=A[W].r,v[z+1]=A[W].g,v[z+2]=A[W].b,v[z+3]=A[W].a,z+=4;C+=3}}if(r.updateVerticesData(n.PositionKind,R,!1,!1),g&&v)r.updateVerticesData(n.ColorKind,v,!1,!1);return r.refreshBoundingInfo(),r}let y=new ks(t,i,null,void 0,void 0,g?!0:!1,s.useVertexAlpha,s.material);return tv(s).applyToMesh(y,s.updatable),y}function wr(t,s,i=null){let r=s.colors?[s.colors]:null;return Bs(t,{lines:[s.points],updatable:s.updatable,instance:s.instance,colors:r,useVertexAlpha:s.useVertexAlpha,material:s.material},i)}function bh(t,s,i=null){let{points:r,instance:o}=s,g=s.gapSize||1,f=s.dashSize||3;if(o){let R=(v)=>{let A=e.Zero(),C=v.length/6,z=0,I,V,W=0,T,B;for(T=0;T<r.length-1;T++)r[T+1].subtractToRef(r[T],A),z+=A.length();let D=z/C,O=o._creationDataStorage.dashSize,N=o._creationDataStorage.gapSize,P=O*D/(O+N);for(T=0;T<r.length-1;T++){r[T+1].subtractToRef(r[T],A),I=Math.floor(A.length()/D),A.normalize(),B=0;while(B<I&&W<v.length)V=D*B,v[W]=r[T].x+V*A.x,v[W+1]=r[T].y+V*A.y,v[W+2]=r[T].z+V*A.z,v[W+3]=r[T].x+(V+P)*A.x,v[W+4]=r[T].y+(V+P)*A.y,v[W+5]=r[T].z+(V+P)*A.z,W+=6,B++}while(W<v.length)v[W]=r[T].x,v[W+1]=r[T].y,v[W+2]=r[T].z,W+=3};if(s.dashNb||s.dashSize||s.gapSize||s.useVertexAlpha||s.material)l.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return o.updateMeshPositions(R,!1),o}let y=new ks(t,i,null,void 0,void 0,void 0,s.useVertexAlpha,s.material);return iv(s).applyToMesh(y,s.updatable),y._creationDataStorage=new Hl,y._creationDataStorage.dashSize=f,y._creationDataStorage.gapSize=g,y}var J1={CreateDashedLines:bh,CreateLineSystem:Bs,CreateLines:wr},kt=!1;function rv(){if(kt)return;kt=!0,M.CreateLineSystem=tv,M.CreateDashedLines=iv,p.CreateLines=(t,s,i=null,r=!1,o=null)=>wr(t,{points:s,updatable:r,instance:o},i),p.CreateDashedLines=(t,s,i,r,o,g=null,f,y)=>bh(t,{points:s,dashSize:i,gapSize:r,dashNb:o,updatable:f,instance:y},g)}rv();var Bt=0.28209479177387814;async function Ce(t,s,i){return await new Promise((o,g)=>{let f=i.createCanvasImage();if(!f)throw Error("Failed to create ImageBitmap");f.onload=()=>{try{let b=i.createCanvas(f.width,f.height);if(!b)throw Error("Failed to create canvas");let R=b.getContext("2d");if(!R)throw Error("Failed to get 2D context");R.drawImage(f,0,0);let v=R.getImageData(0,0,b.width,b.height);o({bits:new Uint8Array(v.data.buffer),width:v.width,height:v.height})}catch(b){g(`Error loading image ${f.src} with exception: ${b}`)}},f.onerror=(b)=>{g(`Error loading image ${f.src} with exception: ${b}`)},f.crossOrigin="anonymous";let y;if(typeof t==="string"){if(!s)throw Error("filename is required when using a URL");f.src=t+s}else{let b=new Blob([t],{type:"image/webp"});y=URL.createObjectURL(b),f.src=y}})}async function xs(t,s,i){let r=t.count?t.count:t.means.shape[0],o=32,g=new ArrayBuffer(32*r),f=new Float32Array(g),y=new Float32Array(g),b=new Uint8ClampedArray(g),R=new Uint8ClampedArray(g),v=(T)=>Math.sign(T)*(Math.exp(Math.abs(T))-1),A=s[0].bits,C=s[1].bits;if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");for(let T=0;T<r;T++){let B=T*4;for(let D=0;D<3;D++){let O=t.means.mins[D],N=t.means.maxs[D],P=C[B+D],U=A[B+D],X=P<<8|U,Q=nr.Lerp(O,N,X/65535);f[T*8+D]=v(Q)}}let z=s[2].bits;if(t.version===2){if(!t.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let T=0;T<r;T++){let B=T*4;for(let D=0;D<3;D++){let O=t.scales.codebook[z[B+D]],N=Math.exp(O);y[T*8+3+D]=N}}}else{if(!Array.isArray(t.scales.mins)||!Array.isArray(t.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let T=0;T<r;T++){let B=T*4;for(let D=0;D<3;D++){let O=z[B+D],N=nr.Lerp(t.scales.mins[D],t.scales.maxs[D],O/255),P=Math.exp(N);y[T*8+3+D]=P}}}let I=s[4].bits;if(t.version===2){if(!t.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let T=0;T<r;T++){let B=T*4;for(let D=0;D<3;D++){let O=0.5+t.sh0.codebook[I[B+D]]*Bt;b[T*32+24+D]=Math.max(0,Math.min(255,Math.round(255*O)))}b[T*32+24+3]=I[B+3]}}else{if(!Array.isArray(t.sh0.mins)||!Array.isArray(t.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let T=0;T<r;T++){let B=T*4;for(let D=0;D<4;D++){let O=t.sh0.mins[D],N=t.sh0.maxs[D],P=I[B+D],U=nr.Lerp(O,N,P/255),X;if(D<3)X=0.5+U*Bt;else X=1/(1+Math.exp(-U));b[T*32+24+D]=Math.max(0,Math.min(255,Math.round(255*X)))}}}let V=(T)=>(T/255-0.5)*2/Math.SQRT2,W=s[3].bits;for(let T=0;T<r;T++){let B=W[T*4+0],D=W[T*4+1],O=W[T*4+2],N=W[T*4+3],P=V(B),U=V(D),X=V(O),Q=N-252,te=P*P+U*U+X*X,Z=Math.sqrt(Math.max(0,1-te)),Y;switch(Q){case 0:Y=[Z,P,U,X];break;case 1:Y=[P,Z,U,X];break;case 2:Y=[P,U,Z,X];break;case 3:Y=[P,U,X,Z];break;default:throw Error("Invalid quaternion mode")}R[T*32+28+0]=Y[0]*127.5+127.5,R[T*32+28+1]=Y[1]*127.5+127.5,R[T*32+28+2]=Y[2]*127.5+127.5,R[T*32+28+3]=Y[3]*127.5+127.5}if(t.shN){let T=t.shN.bands?(t.shN.bands+1)**2-1:t.shN.shape[1]/3,B=t.shN.bands!==void 0&&t.shN.bands!==null?t.shN.bands:Math.round(Math.sqrt(T+1)-1),D=s[5].bits,O=s[6].bits,N=s[5].width,P=T*3,U=Math.ceil(P/16),Q=i.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/Q),Z=Qs(U,te*Q*4*4);if(t.version===2){if(!t.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let Y=0;Y<r;Y++){let ie=O[Y*4+0]+(O[Y*4+1]<<8),H=ie%64*T,J=Math.floor(ie/64);for(let ne=0;ne<T;ne++)for(let se=0;se<3;se++){let le=ne*3+se,oe=Math.floor(le/16),j=Z[oe],he=le%16,_e=Y*16,ge=t.shN.codebook[D[(H+ne)*4+se+J*N*4]]*127.5+127.5;j[he+_e]=Math.max(0,Math.min(255,ge))}}}else for(let Y=0;Y<r;Y++){let ie=O[Y*4+0]+(O[Y*4+1]<<8),H=ie%64*T,J=Math.floor(ie/64),ne=t.shN.mins,se=t.shN.maxs;for(let le=0;le<3;le++)for(let oe=0;oe<T/3;oe++){let j=oe*3+le,he=Math.floor(j/16),_e=Z[he],ge=j%16,de=Y*16,re=nr.Lerp(ne,se,D[(H+oe)*4+le+J*N*4]/255)*127.5+127.5;_e[ge+de]=Math.max(0,Math.min(255,re))}}return await new Promise((Y)=>{Y({mode:0,data:g,hasVertexColors:!1,sh:Z,shDegree:B})})}return await new Promise((T)=>{T({mode:0,data:g,hasVertexColors:!1})})}async function zt(t,s,i){let r,o;if(t instanceof Map){o=t;let y=o.get("meta.json");if(!y)throw Error("meta.json not found in files Map");r=JSON.parse(new TextDecoder().decode(y))}else r=t;let g=[...r.means.files,...r.scales.files,...r.quats.files,...r.sh0.files];if(r.shN)g.push(...r.shN.files);let f=await Promise.all(g.map(async(y)=>{if(o&&o.has(y)){let b=o.get(y);return await Ce(b,y,i.getEngine())}else return await Ce(s,y,i.getEngine())}));return await xs(r,f,i)}function ys(t,s,i,r){let o=new fe(s,i,r,_.TEXTUREFORMAT_RGBA,t,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE);return o.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,o.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE,o}function Qe(t,s){return ys(t,s.bits,s.width,s.height)}async function Ye(t,s,i){let r=i.getEngine();if(typeof createImageBitmap==="function")try{let g=s.toLowerCase().endsWith(".png")?"image/png":"image/webp",f;if(typeof t==="string"){let b=await x.LoadFileAsync(t+s,!0);f=new Blob([b],{type:g})}else f=new Blob([t],{type:g});let y=await createImageBitmap(f,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let b=new fe(null,y.width,y.height,_.TEXTUREFORMAT_RGBA,i,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_UNSIGNED_BYTE);b.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,b.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE;let R=b.getInternalTexture();if(R)r.updateDynamicTexture(R,y,!1,!1);return b}finally{y.close()}}catch{}let o=await Ce(t,s,r);return Qe(i,o)}function Ss(t,s,i,r){let o=(f)=>Math.sign(f)*(Math.exp(Math.abs(f))-1);if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");let g=new Float32Array(r*4);for(let f=0;f<r;f++){let y=f*4;for(let b=0;b<3;b++){let R=i[y+b]<<8|s[y+b],v=nr.Lerp(t.means.mins[b],t.means.maxs[b],R/65535);g[f*4+b]=o(v)}g[f*4+3]=1}return g}async function Le(t,s,i,r=!0,o,g){let f,y;if(t instanceof Map){y=t;let H=y.get("meta.json");if(!H)throw Error("meta.json not found in files Map");f=JSON.parse(new TextDecoder().decode(H))}else f=t;let b=async(H)=>{if(y&&y.has(H))return await Ce(y.get(H),H,i.getEngine());if(o){let J=new Uint8Array(await o.loadFileAsync(s+H,g));return await Ce(J,H,i.getEngine())}return await Ce(s,H,i.getEngine())},R=async(H)=>{if(y&&y.has(H))return await Ye(y.get(H),H,i);if(o){let J=new Uint8Array(await o.loadFileAsync(s+H,g));return await Ye(J,H,i)}return await Ye(s,H,i)},v=[...f.scales.files,...f.quats.files,...f.sh0.files,...f.shN?.files??[]],A,C,z,I,V=null,W;if(r){let[H,J]=await Promise.all([Promise.all(f.means.files.map(b)),Promise.all(v.map(R))]);V=[H[0],H[1]],W=J,A=Qe(i,H[0]),C=Qe(i,H[1]),z=H[0].width,I=H[0].height}else{let[H,J]=await Promise.all([Promise.all(f.means.files.map(R)),Promise.all(v.map(R))]);W=J,A=H[0],C=H[1];let ne=A.getSize();z=ne.width,I=ne.height}let T=f.count??f.means.shape[0],B=z*I;if(B<T)throw Error(`SOG texture contains ${B} texels, but metadata references ${T} splats.`);let D=W[0],O=W[1],N=W[2],P,U,X=0,Q=0;if(f.shN&&W.length>=5)P=W[3],U=W[4],X=f.shN.bands?(f.shN.bands+1)**2-1:f.shN.shape[1]/3,Q=f.shN.bands??Math.round(Math.sqrt(X+1)-1);let te;if(f.version===2){let J=new Float32Array(768);if(f.scales.codebook)J.set(f.scales.codebook.slice(0,256),0);if(f.sh0.codebook)J.set(f.sh0.codebook.slice(0,256),256);if(f.shN?.codebook)J.set(f.shN.codebook.slice(0,256),512);te=new fe(J,768,1,_.TEXTUREFORMAT_R,i,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT),te.wrapU=_.TEXTURE_CLAMP_ADDRESSMODE,te.wrapV=_.TEXTURE_CLAMP_ADDRESSMODE}let Z=f.means.mins,Y=f.means.maxs,ie={version:f.version===2?2:1,splatCount:T,shDegree:Q,meansTextureL:A,meansTextureU:C,scalesTexture:D,quatsTexture:O,sh0Texture:N,shCentroidsTexture:P,shLabelsTexture:U,codebookTexture:te,meansMin:[Z[0],Z[1],Z[2]],meansMax:[Y[0],Y[1],Y[2]],scalesMin:Array.isArray(f.scales.mins)?[f.scales.mins[0],f.scales.mins[1],f.scales.mins[2]]:void 0,scalesMax:Array.isArray(f.scales.maxs)?[f.scales.maxs[0],f.scales.maxs[1],f.scales.maxs[2]]:void 0,sh0Min:Array.isArray(f.sh0.mins)?[f.sh0.mins[0],f.sh0.mins[1],f.sh0.mins[2],f.sh0.mins[3]]:void 0,sh0Max:Array.isArray(f.sh0.maxs)?[f.sh0.maxs[0],f.sh0.maxs[1],f.sh0.maxs[2],f.sh0.maxs[3]]:void 0,shnMin:typeof f.shN?.mins==="number"?f.shN.mins:void 0,shnMax:typeof f.shN?.maxs==="number"?f.shN.maxs:void 0,shCoeffCount:X,positions:V?Ss(f,V[0].bits,V[1].bits,T):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:Q,sogTextures:ie}}ad();var Me=`precision highp float;
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
`;class Ee{get supportsAsyncCentersReadback(){let t=this._scene.getEngine();if(t.isWebGPU)return!0;let s=t;return!!s._gl&&typeof s._readPixelsAsync==="function"&&(s.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((t)=>t.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(t,s,i,r,o){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=t,this._shaderLanguage=t.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,s),i)this._mrt=i.mrt,this._textureSize=i.width,this._baseOffset=i.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,s)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(r&&r.textureCount>0){if(r.externalMrts)this._shMrts=r.externalMrts.slice(0,r.textureCount),this._ownsShMrts=!1;else{for(let g=0;g<r.textureCount;g++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${g}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(o){if(o.externalMrt)this._rotMrt=o.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(t){if(!this._ownsMrt)this._mrt=t}rebindShAtlas(t){if(!this._ownsShMrts&&t&&this._shMrts.length)this._shMrts=t.slice(0,this._shMrts.length)}rebindRotAtlas(t){if(!this._ownsRotMrt&&t&&this._rotMrt)this._rotMrt=t}setBaseOffset(t){if(!this._ownsMrt)this._baseOffset=t}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){l.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,t,s);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,t,t,0,-i),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((r,o)=>this._createShMrt(`gsShAtlasBackup${o}`,!1,t,s));for(let r=0;r<this._shMrts.length;r++)this._renderShCopyPass(this._backupShMrts[r],this._shMrts[r].textures[0],this._mrt.textures[0],0,t,t,0,-i)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,t,s);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,t,t,0,-i)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t),r=this._scene.getEngine();r.enableScissor(0,i,t,s);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,t,t,0,i),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let o=0;o<this._shMrts.length&&o<this._backupShMrts.length;o++)this._renderShCopyPass(this._shMrts[o],this._backupShMrts[o].textures[0],this._mrt.textures[0],0,t,t,0,i);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,t,t,0,i)}finally{r.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let o of this._backupShMrts)o.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,g=new cr(t,{width:i,height:r},4,this._scene,{types:[_.TEXTURETYPE_FLOAT,o,o,_.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}Centers`,`${t}CovA`,`${t}CovB`,`${t}Colors`]);if(g.clearColor=new S(0,0,0,0),g.renderList=[],s)g.onClearObservable.add(()=>{});return g}_createShMrt(t,s,i=this._textureSize,r=this._textureSize){let o=new cr(t,{width:i,height:r},1,this._scene,{types:[_.TEXTURETYPE_UNSIGNED_INTEGER],formats:[_.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[t]);if(o.clearColor=new S(0,0,0,0),o.renderList=[],s)o.onClearObservable.add(()=>{});return o}_createRotMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?_.TEXTURETYPE_HALF_FLOAT:_.TEXTURETYPE_FLOAT,g=new cr(t,{width:i,height:r},3,this._scene,{types:[o,o,o],formats:[_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA,_.TEXTUREFORMAT_RGBA],samplingModes:[_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}A`,`${t}B`,`${t}Scale`]);if(g.clearColor=new S(0,0,0,0),g.renderList=[],s)g.onClearObservable.add(()=>{});return g}async decodeAsync(t,s){if(this._disposed)return;this._applyPack(t);let i=this._shMaterial!==null&&this._shMrts.length>0;if(i)this._applyShPack(t);let r=this._rotMaterial!==null&&this._rotMrt!==null;if(r)this._applyRotPack(t);await new Promise((o)=>{let g=()=>{if(this._disposed){o();return}if(!this._material.isReady(this._quad)||i&&!this._shMaterial.isReady(this._quad)||r&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(g);return}let f=this._textureSize,y=this._baseOffset+s;if(this._material.setInt("uOffset",y),i)this._shMaterial.setInt("uOffset",y);if(r)this._rotMaterial.setInt("uOffset",y);let b=Math.floor(y/f),R=Math.max(1,Math.ceil((y+t.splatCount)/f)-b),v=this._scene.getEngine();v.enableScissor(0,b,f,R);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),i){for(let A=0;A<this._shMrts.length;A++)this._shMaterial.setInt("uShTextureIndex",A),this._quad.material=this._shMaterial,this._shMrts[A].renderList=[this._quad],this._shMrts[A].render();this._quad.material=this._material}if(r)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{v.disableScissor()}o()};this._scene.onBeforeRenderObservable.addOnce(g)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let t=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),s=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&t&&s}_bindCopyMaterialsToAtlas(){let t=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",t[0]),this._copyMaterial.setTexture("uSrc0",t[0]),this._copyMaterial.setTexture("uSrc1",t[1]),this._copyMaterial.setTexture("uSrc2",t[2]),this._copyMaterial.setTexture("uSrc3",t[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",t[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let s=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",t[0]),this._rotCopyMaterial.setTexture("uSrc0",s[0]),this._rotCopyMaterial.setTexture("uSrc1",s[1]),this._rotCopyMaterial.setTexture("uSrc2",s[2])}}relayoutSync(t){if(this._disposed||!this._copyMaterial)return;let s=this._textureSize,i=s,r=this._ownsMrt?s:Math.max(1,Math.floor(this._capacity/s));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(i*r);let o=this._relayoutMapData;if(o.fill(-1),o.set(t.subarray(0,Math.min(t.length,o.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new fe(o,i,r,_.TEXTUREFORMAT_R,this._scene,!1,!1,_.TEXTURE_NEAREST_SAMPLINGMODE,_.TEXTURETYPE_FLOAT);else this._relayoutMapTexture.update(o);let g=this._relayoutMapTexture;if(this._ownsMrt){let C=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(C,this._mrt.textures,g,1),this._renderRelayoutPass(this._mrt,C.textures,g,0)}finally{C.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let z=0;z<this._shMrts.length;z++){let I=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(I,this._shMrts[z].textures[0],g,1),this._renderShCopyPass(this._shMrts[z],I.textures[0],g,0)}finally{I.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let z=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(z,this._rotMrt.textures,g,1),this._renderRotCopyPass(this._rotMrt,z.textures,g,0)}finally{z.dispose()}}this._quad.material=this._material;return}let f=Math.floor(this._baseOffset/s),y=r,b=this._scene.getEngine(),R=this._createMrt("gsRelayoutTemp",!1,s,y),v=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((C,z)=>this._createShMrt(`gsShRelayoutTemp${z}`,!1,s,y)):[],A=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,s,y):null;try{this._renderRelayoutPass(R,this._mrt.textures,g,1,s,s,this._baseOffset,0);for(let C=0;C<v.length;C++)this._renderShCopyPass(v[C],this._shMrts[C].textures[0],g,1,s,s,this._baseOffset,0);if(A)this._renderRotCopyPass(A,this._rotMrt.textures,g,1,s,s,this._baseOffset,0);b.enableScissor(0,f,s,y);try{this._renderRelayoutPass(this._mrt,R.textures,g,0,s,s,0,f);for(let C=0;C<v.length;C++)this._renderShCopyPass(this._shMrts[C],v[C].textures[0],g,0,s,s,0,f);if(A)this._renderRotCopyPass(this._rotMrt,A.textures,g,0,s,s,0,f)}finally{b.disableScissor()}}finally{R.dispose();for(let C of v)C.dispose();A?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(t,s,i,r,o=this._textureSize,g=this._textureSize,f=0,y=0){let b=this._copyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrc0",s[0]),b.setTexture("uSrc1",s[1]),b.setTexture("uSrc2",s[2]),b.setTexture("uSrc3",s[3]),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",g),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",f),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createCopyMaterial(){let t=this._shaderLanguage===1,s=new Se(Ht,this._scene,{vertexSource:t?be:Me,fragmentSource:t?ss:Zt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderShCopyPass(t,s,i,r,o=this._textureSize,g=this._textureSize,f=0,y=0){let b=this._shCopyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrcSh",s),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",g),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",f),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createShCopyMaterial(){let t=this._shaderLanguage===1,s=new Se(jt,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Qt:Yt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderRotCopyPass(t,s,i,r,o=this._textureSize,g=this._textureSize,f=0,y=0){let b=this._rotCopyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrc0",s[0]),b.setTexture("uSrc1",s[1]),b.setTexture("uSrc2",s[2]),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",g),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",f),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createRotCopyMaterial(){let t=this._shaderLanguage===1,s=new Se($t,this._scene,{vertexSource:t?be:Me,fragmentSource:t?ts:Jt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}async readCentersRangeAsync(t,s){if(this._disposed||s<=0||!this.supportsAsyncCentersReadback)return null;let i=this._textureSize,r=this._baseOffset+t,o=Math.floor(r/i),f=Math.ceil((r+s)/i)-o,y=(r-o*i)*4,b=y+s*4,R=this._mrt.textures[0],v=this._scene.getEngine();if(v.isWebGPU){let T=await R.readPixels(0,0,null,!0,!0,0,o,i,f);if(this._disposed||!T)return null;let B=T instanceof Float32Array?T:new Float32Array(T.buffer,T.byteOffset,T.byteLength/4);return B.length>=b?B.subarray(y,b):null}let A=v,C=A._gl,z=R.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!z)return null;let I=new Float32Array(i*f*4);if(!this._readFbo)this._readFbo=C.createFramebuffer();let V=A._currentFramebuffer;C.bindFramebuffer(C.FRAMEBUFFER,this._readFbo),C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,z,0),C.readBuffer(C.COLOR_ATTACHMENT0);let W=A._readPixelsAsync(0,o,i,f,C.RGBA,C.FLOAT,I);if(C.bindFramebuffer(C.FRAMEBUFFER,V),!V)C.readBuffer(C.BACK);if(!W)return null;if(await W,this._disposed||I.length<b)return null;return I.subarray(y,b)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let t of this._backupShMrts)t.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let t of this._shMrts)t.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let t=new p("gsWorkBufferQuad",this._scene),s=new M;return s.positions=[-1,-1,0,3,-1,0,-1,3,0],s.indices=[0,1,2],s.applyToMesh(t),this._scene.removeMesh(t),t}_createMaterial(){let t=this._shaderLanguage===1,s=new Se("gsSogDecode",this._scene,{vertexSource:t?be:Me,fragmentSource:t?Et:It},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyPack(t){let s=this._material,i=t.meansTextureL.getSize().width;s.setTexture("sogMeansLTex",t.meansTextureL),s.setTexture("sogMeansUTex",t.meansTextureU),s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogSh0Tex",t.sh0Texture),s.setTexture("sogCodebookTex",t.codebookTexture??t.sh0Texture),s.setVector3("sogMeansMin",new e(t.meansMin[0],t.meansMin[1],t.meansMin[2])),s.setVector3("sogMeansMax",new e(t.meansMax[0],t.meansMax[1],t.meansMax[2]));let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2]));let g=t.sh0Min??[0,0,0,0],f=t.sh0Max??[0,0,0,0];s.setVector4("sogSh0Min",new w(g[0],g[1],g[2],g[3])),s.setVector4("sogSh0Max",new w(f[0],f[1],f[2],f[3])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}_createShMaterial(){let t=this._shaderLanguage===1,s=new Se(Gt,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Xt:Nt},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyShPack(t){let s=this._shMaterial,i=!!t.shLabelsTexture&&!!t.shCentroidsTexture,r=t.shLabelsTexture??t.sh0Texture,o=t.shCentroidsTexture??t.sh0Texture;s.setTexture("sogShLabelsTex",r),s.setTexture("sogShCentroidsTex",o),s.setTexture("sogCodebookTex",t.codebookTexture??r),s.setFloat("sogShnMin",t.shnMin??0),s.setFloat("sogShnMax",t.shnMax??0),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",r.getSize().width),s.setInt("uCoeffs",i?t.shCoeffCount:0)}_createRotMaterial(){let t=this._shaderLanguage===1,s=new Se(Ot,this._scene,{vertexSource:t?be:Me,fragmentSource:t?Vt:Wt},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyRotPack(t){let s=this._rotMaterial,i=t.scalesTexture.getSize().width;s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogCodebookTex",t.codebookTexture??t.scalesTexture);let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}}class $e{constructor(t){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,t?.maxConcurrent??2),this.maxRetries=Math.max(0,t?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(t,s){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let i=this._pending.get(t);if(i)return await i.promise;let r={url:t,groupId:s,settled:!1,cancelled:!1,started:!1,slotReleased:!1};if(r.promise=new Promise((o,g)=>{r.resolve=o,r.reject=g}),this._pending.set(t,r),s!==void 0){let o=this._groups.get(s);if(!o)o=new Set,this._groups.set(s,o);o.add(t)}return this._queue.push(r),this._pump(),await r.promise}cancel(t){let s=this._pending.get(t);if(!s)return;this._abort(s,Error(`GaussianSplattingDownloadManager: download cancelled (${t}).`))}cancelGroup(t){let s=this._groups.get(t);if(!s)return;for(let i of Array.from(s))this.cancel(i);this._groups.delete(t)}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let t of Array.from(this._pending.values()))this._abort(t,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(t,s){if(t.settled)return;t.cancelled=!0;let i=this._queue.indexOf(t);if(i!==-1)this._queue.splice(i,1);if(t.request?.abort(),t.cancelAttempt?.(s),this._settle(t,()=>t.reject(s)),t.started)this._releaseSlot(t)}_settle(t,s){if(t.settled)return;if(t.settled=!0,this._pending.delete(t.url),t.groupId!==void 0){let i=this._groups.get(t.groupId);if(i){if(i.delete(t.url),i.size===0)this._groups.delete(t.groupId)}}s()}_releaseSlot(t){if(t.slotReleased)return;t.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let t=this._queue.shift();if(t.settled)continue;t.started=!0,this._activeCount++,this._runTaskAsync(t).finally(()=>{this._releaseSlot(t)})}}async _runTaskAsync(t){let s;for(let i=0;i<=this.maxRetries;i++){if(this._disposed||t.cancelled)return;try{let r=await this._downloadAttemptAsync(t);this._settle(t,()=>t.resolve(r));return}catch(r){if(t.cancelAttempt=void 0,this._disposed||t.cancelled)return;s=r}}this._settle(t,()=>t.reject(s))}async _downloadAttemptAsync(t){return await new Promise((s,i)=>{t.cancelAttempt=i,t.request=x.LoadFile(t.url,(r)=>s(r),void 0,void 0,!0,(r,o)=>i(o instanceof Error?o:Error(`GaussianSplattingDownloadManager: failed to load ${t.url}.`)))})}}class is{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class Ke{constructor(t=0,s=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=s,t>0){this._capacity=t,this._freeSize=t;let i=this._obtain(0,t,!0);this._headAll=i,this._tailAll=i,this._addToBucket(i)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(t){if(t<=0)return null;let s=this._findFreeBlock(t);if(!s)return null;if(this._usedSize+=t,this._freeSize-=t,s._size===t)return s._free=!1,this._removeFromBucket(s),s;let i=this._obtain(s._offset,t,!1);return s._offset+=t,s._size-=t,this._rebucket(s),this._insertAfterInMainList(i,s._prev),i}free(t){if(!t||t._free)return;t._free=!0,this._usedSize-=t._size,this._freeSize+=t._size;let{_prev:s,_next:i}=t,r=s&&s._free,o=i&&i._free;if(r&&o)s._size+=t._size+i._size,this._removeFromMainList(t),this._removeFromMainList(i),this._removeFromBucket(i),this._release(t),this._release(i),this._rebucket(s);else if(r)s._size+=t._size,this._removeFromMainList(t),this._release(t),this._rebucket(s);else if(o)t._size+=i._size,this._removeFromMainList(i),this._removeFromBucket(i),this._release(i),this._addToBucket(t);else this._addToBucket(t)}grow(t){if(t<=this._capacity)return;let s=t-this._capacity;if(this._capacity=t,this._freeSize+=s,this._tailAll&&this._tailAll._free)this._tailAll._size+=s,this._rebucket(this._tailAll);else{let i=this._obtain(this._capacity-s,s,!0);this._insertAfterInMainList(i,this._tailAll),this._addToBucket(i)}}defrag(t=0,s=new Set){if(s.clear(),this._freeRegionCount===0)return s;if(t===0)this._defragFull(s);else this._defragIncremental(t,s);return s}updateAllocation(t,s){for(let i=0;i<t.length;i++)this.free(t[i]);for(let i=0;i<s.length;i++){let r=s[i],o=this.allocate(r);if(o)s[i]=o;else{let g=r;for(let b=i+1;b<s.length;b++)g+=s[b];let f=this._usedSize+g,y=Math.ceil(f*this._growMultiplier);if(y>this._capacity)this.grow(y);this.defrag(0);for(let b=i;b<s.length;b++)s[b]=this.allocate(s[b]);return!0}}return!1}_bucketFor(t){return 31-Math.clz32(t)}_addToBucket(t){let s=this._bucketFor(t._size);t._bucket=s;while(s>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(t._prevFree=null,t._nextFree=this._freeBucketHeads[s],this._freeBucketHeads[s])this._freeBucketHeads[s]._prevFree=t;this._freeBucketHeads[s]=t,this._freeRegionCount++}_removeFromBucket(t){let s=t._bucket;if(t._prevFree)t._prevFree._nextFree=t._nextFree;else this._freeBucketHeads[s]=t._nextFree;if(t._nextFree)t._nextFree._prevFree=t._prevFree;t._prevFree=null,t._nextFree=null,t._bucket=-1,this._freeRegionCount--}_rebucket(t){if(this._bucketFor(t._size)!==t._bucket)this._removeFromBucket(t),this._addToBucket(t)}_obtain(t,s,i){let r=this._pool.length>0?this._pool.pop():new is;return r._offset=t,r._size=s,r._free=i,r._prev=null,r._next=null,r._prevFree=null,r._nextFree=null,r._bucket=-1,r}_release(t){t._prev=null,t._next=null,t._prevFree=null,t._nextFree=null,t._bucket=-1,this._pool.push(t)}_insertAfterInMainList(t,s){if(s===null){if(t._prev=null,t._next=this._headAll,this._headAll)this._headAll._prev=t;if(this._headAll=t,!this._tailAll)this._tailAll=t}else{if(t._prev=s,t._next=s._next,s._next)s._next._prev=t;if(s._next=t,this._tailAll===s)this._tailAll=t}}_removeFromMainList(t){if(t._prev)t._prev._next=t._next;else this._headAll=t._next;if(t._next)t._next._prev=t._prev;else this._tailAll=t._prev;t._prev=null,t._next=null}_findFreeBlock(t){let s=this._bucketFor(t),i=this._freeBucketHeads.length;if(s<i){let r=null,o=this._freeBucketHeads[s];while(o){if(o._size>=t){if(!r||o._size<r._size){if(r=o,o._size===t)break}}o=o._nextFree}if(r)return r}for(let r=s+1;r<i;r++)if(this._freeBucketHeads[r])return this._freeBucketHeads[r];return null}_defragFull(t){for(let o=0;o<this._freeBucketHeads.length;o++){let g=this._freeBucketHeads[o];while(g){let f=g._nextFree;this._removeFromMainList(g),g._prevFree=null,g._nextFree=null,g._bucket=-1,this._pool.push(g),g=f}this._freeBucketHeads[o]=null}this._freeRegionCount=0;let s=0,i=this._headAll;while(i){if(i._offset!==s)i._offset=s,t.add(i);s+=i._size,i=i._next}let r=this._capacity-s;if(r>0){let o=this._obtain(s,r,!0);this._insertAfterInMainList(o,this._tailAll),this._addToBucket(o)}}_defragIncremental(t,s){let i=Math.ceil(t/2),r=t-i;for(let g=0;g<i;g++){let f=this._tailAll;while(f&&f._free)f=f._prev;if(!f)break;let y=this._findFreeBlock(f._size);if(!y||y._offset>=f._offset)break;this._moveBlock(f,y),s.add(f)}let o=this._headAll;for(let g=0;g<r&&o;){let f=o._next;if(o._free&&f&&!f._free){let y=f,b=o;y._offset=b._offset,b._offset=y._offset+y._size;let R=b._prev,v=y._next;if(y._prev=R,y._next=b,b._prev=y,b._next=v,R)R._next=y;else this._headAll=y;if(v)v._prev=b;else this._tailAll=b;if(b._next&&b._next._free){let A=b._next;b._size+=A._size,this._removeFromMainList(A),this._removeFromBucket(A),this._release(A),this._rebucket(b)}s.add(y),g++,o=b._next}else o=f}}_moveBlock(t,s){let i=t._size,r=s._offset,o=t._prev;this._removeFromMainList(t);let g=this._obtain(t._offset,i,!0);if(this._insertAfterInMainList(g,o),this._addToBucket(g),g._next&&g._next._free){let f=g._next;g._size+=f._size,this._removeFromMainList(f),this._removeFromBucket(f),this._release(f),this._rebucket(g)}if(g._prev&&g._prev._free){let f=g._prev;f._size+=g._size,this._removeFromMainList(g),this._removeFromBucket(g),this._release(g),this._rebucket(f)}if(t._offset=r,s._size===i){let f=s._prev;this._removeFromMainList(s),this._removeFromBucket(s),this._release(s),this._insertAfterInMainList(t,f)}else s._offset+=i,s._size-=i,this._rebucket(s),this._insertAfterInMainList(t,s._prev)}}class Je{constructor(t,s,i){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new Ke(t),this._cooldownFrames=Math.max(0,s),this._onEvict=i}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(t){return this._blocks.has(t)}offset(t){return this._blocks.get(t)?.offset}allocate(t,s){let i=this._blocks.get(t);if(i)return i.offset;let r=this._allocator.allocate(s);if(!r){if(this._evictAllCooled(),r=this._allocator.allocate(s),!r)return null}return this._blocks.set(t,r),r.offset}pin(t,s){let i=this.allocate(t,s);if(i!==null)this._pinned.add(t);return i}free(t){if(this._pinned.has(t))return;let s=this._blocks.get(t);if(!s)return;this._allocator.free(s),this._blocks.delete(t),this._cooldown.delete(t)}compact(){let t=new Map;for(let[i,r]of Array.from(this._blocks))t.set(i,r.offset);this._allocator.defrag(0);let s=[];for(let[i,r]of Array.from(this._blocks)){let o=t.get(i);if(o!==r.offset)s.push({file:i,oldOffset:o,newOffset:r.offset,count:r.size})}return s}getResidentBlocks(){let t=[];for(let[s,i]of Array.from(this._blocks))t.push({file:s,offset:i.offset,count:i.size});return t}scheduleEviction(t){if(this._pinned.has(t)||!this._blocks.has(t))return;this._cooldown.set(t,this._cooldownFrames)}cancelEviction(t){this._cooldown.delete(t)}tick(){if(this._cooldown.size===0)return[];let t=[];for(let[s,i]of Array.from(this._cooldown))if(i<=1)t.push(s);else this._cooldown.set(s,i-1);for(let s of t)this._evict(s);return t}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let t=Array.from(this._cooldown.keys());for(let s of t)this._evict(s)}_evict(t){let s=this._blocks.get(t);if(s)this._allocator.free(s),this._blocks.delete(t);this._cooldown.delete(t),this._onEvict(t)}}var Ms=Math.tan(22.5*Math.PI/180),bs=-2,rs=-1,vs=84,et=new c,ws=new e,Rs=new e,os=new e,Ts=new e(0,0,1),as=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],ns=as.length*2,Oe=[new S(1,0.2,0.2,1),new S(1,0.6,0.1,1),new S(1,1,0.2,1),new S(0.3,1,0.3,1),new S(0.2,1,1,1),new S(0.4,0.5,1,1),new S(0.9,0.4,1,1),new S(1,1,1,1)];class xe extends es{static IsLODMetadata(t){if(typeof t!=="object"||t===null)return!1;let s=t;return typeof s.lodLevels==="number"&&Array.isArray(s.filenames)&&typeof s.tree==="object"&&s.tree!==null}constructor(t,s,i,r,o={}){super(t,null,r,!1);this._leafNodes=[],this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._frustumCulling=!0,this._frustumPlanes=[new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0)],this._cullViewProj=new c,this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPos=new e(1/0,1/0,1/0),this._forceLodUpdate=!1,this._boundsMin=new e(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new e(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=s,this._rootUrl=i,this._streamOptions=o,this._hostCompound=o.hostCompound??null,this._decodeSh=o.decodeSh??!0,this._needsRotationScale=o.needsRotationScale??!1;let g=Math.max(0,s.lodLevels-1);if(this._lodRangeMax=g,o.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,o.lodBaseDistance);if(o.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,o.lodMultiplier);if(o.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,o.lodBehindPenalty);if(o.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(o.lodRangeMin,g));if(o.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(o.lodRangeMax,g));if(o.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,o.maxDecodesPerFrame);if(o.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,o.lodCooldownFrames);if(o.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,o.lodUpdateInterval);if(o.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,o.lodUpdateDistance);if(o.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(o.maxDetailLod));if(o.frustumCulling!==void 0)this._frustumCulling=o.frustumCulling;if(o.debugLodSource)this._debugLodSource=o.debugLodSource;if(o.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(o.evictionCooldownFrames));if(o.maxResidentSplats!==void 0&&o.maxResidentSplats>0)this._maxResidentSplats=Math.floor(o.maxResidentSplats);if(o.memoryBudgetMb!==void 0&&o.memoryBudgetMb>0)this._memoryBudgetMb=o.memoryBudgetMb;if(this._downloadManager=new $e({maxConcurrent:o.maxConcurrentDownloads,maxRetries:o.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((y,b)=>{this._partReadyResolve=y,this._partReadyReject=b}),this._partReadyPromise.catch(()=>{});let f=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(f)}if(this._collectLodEntries(s.tree),o.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let f=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!f&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(f)=>{if(l.Error("GaussianSplattingStream: streaming failed: "+(f?.message??f)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(f?.message??f)),this._hostCompound&&!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(t=!1){if(this._hostCompound)return!0;return super.isReady(t)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(t){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(t))}async whenSettledAsync(t=3){if(this._disposed)return;this._forceLodUpdate=!0;let s=Math.max(1,t),i=this._scene,r=0,o=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++r>=s;return r=0,!1};if(i.getEngine().activeRenderLoops.length>0){await new Promise((y)=>{let b=null;b=i.onAfterRenderObservable.add(()=>{if(this._disposed||o()){if(b)i.onAfterRenderObservable.remove(b),b=null;y()}})});return}let g=i.getEngine(),f=globalThis.requestAnimationFrame;while(!this._disposed){if(g.beginFrame(),i.render(),g.endFrame(),o())return;await new Promise((y)=>{if(typeof f==="function")f(()=>y());else setTimeout(y,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(t){let s=Math.max(0,Math.floor(t));if(this._maxDetailLod===s)return;this._maxDetailLod=s,this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(t){if(this._frustumCulling===t)return;this._frustumCulling=t,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(t){if(this._debugDisplay===t)return;if(this._debugDisplay=t,t)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(t){if(this._debugLodSource===t)return;if(this._debugLodSource=t,this._debugDisplay)this._refreshDebugDisplay()}dispose(t){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(t)}_disposeAndReclaim(){let t=this._hostCompound,s=!!this._host&&!this._partReleasedByHost;if(this.dispose(),s&&t&&!t.isDisposed())t.compactAtlas()}_getEffectiveWorldMatrix(t){if(this._host)return this._host.proxy.computeWorldMatrix(t);return this.computeWorldMatrix(t)}evaluateOptimalLods(t=this._scene.activeCamera){if(!t||this._leafNodes.length===0)return;let s=Math.max(0,this._metadata.lodLevels-1),i=this._lodBaseDistance,r=this._lodMultiplier,o=this._lodBehindPenalty,g=this._lodRangeMin,f=this._lodRangeMax,y=this._scene.getEngine().getAspectRatio(t)||1,b=Math.tan(t.fov*0.5);if(t.fovMode===q.FOVMODE_HORIZONTAL_FIXED)b/=y;let R=b*y,v=Math.min(b,R)/Ms;this._getEffectiveWorldMatrix(!1).invertToRef(et);let A=e.TransformCoordinatesToRef(t.globalPosition,et,ws),{x:C,y:z,z:I}=A,V=0,W=0,T=0;if(o>1){t.getDirectionToRef(Ts,os);let B=e.TransformNormalToRef(os,et,Rs);B.normalize(),V=B.x,W=B.y,T=B.z}for(let B of this._leafNodes){let D=B.bound.min,O=B.bound.max,N=C<D[0]?D[0]:C>O[0]?O[0]:C,P=z<D[1]?D[1]:z>O[1]?O[1]:z,U=I<D[2]?D[2]:I>O[2]?O[2]:I,X=N-C,Q=P-z,te=U-I,Z=Math.sqrt(X*X+Q*Q+te*te),Y=Z;if(o>1&&Z>0.01){let J=(V*X+W*Q+T*te)/Z;if(J<0)Y=Z*(1+-J*(o-1))}let ie=Y*v,H;if(s===0||ie<i)H=0;else{H=s;while(H>1&&ie<i*Math.pow(r,H-1))H--}if(H<g)H=g;else if(H>f)H=f;if(this._frustumCulling&&B.inFrustum===!1)H=f;B.optimalLod=H}}_displayedLodLevel(t){if(this._debugLodSource==="optimal")return t.optimalLod??t.activeLod??0;return t.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let t=this._debugDisplay;if(t&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!t&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let t=[],s=[];for(let r of this._leafNodes){let o=Oe[this._displayedLodLevel(r)%Oe.length],g=r.bound.min,f=r.bound.max,y=[new e(g[0],g[1],g[2]),new e(f[0],g[1],g[2]),new e(f[0],f[1],g[2]),new e(g[0],f[1],g[2]),new e(g[0],g[1],f[2]),new e(f[0],g[1],f[2]),new e(f[0],f[1],f[2]),new e(g[0],f[1],f[2])];for(let b of as)t.push([y[b[0]],y[b[1]]]),s.push([o,o])}if(this._debugSignature=this._computeDebugSignature(),t.length===0)return;let i=Bs(this.name+"_lodDebug",{lines:t,colors:s,updatable:!0,useVertexAlpha:!1},this._scene);i.parent=this,i.isPickable=!1,i.doNotSerialize=!0,i.reservedDataStore={hidden:!0},this._debugMesh=i,this._debugColorData=new Float32Array(this._leafNodes.length*ns*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let t=this._debugColorData,s=0;for(let i of this._leafNodes){let r=Oe[this._displayedLodLevel(i)%Oe.length];for(let o=0;o<ns;o++)t[s++]=r.r,t[s++]=r.g,t[s++]=r.b,t[s++]=r.a}this._debugMesh.updateVerticesData(n.ColorKind,t),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let t=0;for(let s of this._leafNodes)t=t*31+this._displayedLodLevel(s)|0;return t}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(t){if(t.children){for(let i of t.children)this._collectLodEntries(i);return}if(!t.lods)return;let s=[];for(let i of Object.keys(t.lods)){let r=Number(i),o=t.lods[i];if(Number.isFinite(r)&&o&&o.count>0)s.push(r)}if(s.length===0)return;s.sort((i,r)=>i-r),t.availableLevels=s,t.baseLod=s[s.length-1],t.activeLod=void 0,t.lodCooldown=0,t.inFrustum=!0,t.cullBounds=new ii(e.FromArray(t.bound.min),e.FromArray(t.bound.max)),this._leafNodes.push(t)}async _streamAllAsync(){let t=this._collectAllFileIds(),s=await this._gatherCountsAsync(t);if(this._disposed)return;this._resolveResidentBudget();let i=1;if(s>0)i+=s;for(let g of t){let f=this._fileCounts.get(g);if(f!==void 0&&f>0)i+=f}if(i<=1)return;this._evictionEnabled=this._residentBudget>0&&this._residentBudget<i;let r=this._evictionEnabled?Math.max(this._residentBudget,1):i;if(this._residency=new Je(r,this._evictionCooldownFrames,(g)=>this._onFileEvicted(g)),this._residency.pin(bs,1),s>0){let g=this._residency.pin(rs,s);if(g!==null)this._environmentRange={offset:g,count:s};else l.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let g=c.Compose(new e(1,-1,1),d.RotationYawPitchRoll(0,-Math.PI/2,0),e.ZeroReadOnly),f=this._hostCompound.reserveStreamingPart(r,g,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=f,this._positionBase=f.base;let y=this._hostCompound,b=y.onPartRemovedObservable.add((C)=>{if(!this._disposed&&this._host&&C===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>y.onPartRemovedObservable.remove(b);let R=this._shTextureCount>0&&f.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:f.shMrtAtlas}:void 0,v=this._needsRotationScale&&f.rotMrtAtlas?{externalMrt:f.rotMrtAtlas}:void 0;this._workBuffer=new Ee(this._scene,f.capacity,{mrt:f.mrtAtlas,width:f.atlasWidth,baseOffset:f.base},R,v),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=f.splatPositions,this._vertexCount=r;let A=this._workBuffer;this._unsubBeforeRebuild=f.onBeforeAtlasRebuild(()=>{A.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=f.onAfterAtlasRebuild(()=>{if(f.mrtAtlas)A.rebindAtlas(f.mrtAtlas);if(A.rebindShAtlas(f.shMrtAtlas),A.rebindRotAtlas(f.rotMrtAtlas),this._positionBase=f.base,A.setBaseOffset(f.base),A.restoreRegion(),this._splatPositions=f.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),f.setActiveRanges([])}else{let g=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,f=this._needsRotationScale?{}:void 0;this._workBuffer=new Ee(this._scene,r,void 0,g,f),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let y=new Float32Array(r*4),b=this._workBuffer.textures,R=g?this._workBuffer.shTextures:void 0,v=f?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(b[0],b[1],b[2],b[3],y,r,R,this._streamShDegree,v),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;let o=new Set;for(let g of this._leafNodes){let f=g.lods[String(g.baseLod)];if(f&&this._fileCounts.has(f.file))o.add(f.file)}for(let g of Array.from(o)){if(this._disposed)return;await this._decodeFileAsync(g)}if(this._disposed)return;if(this._baseLayerReady=!0,!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame());this._resolvePartReady()}async _waitForCanBackupAsync(t){for(let s=0;s<600&&!this._disposed;s++){if(t.canBackup)return;await new Promise((i)=>this._scene.onBeforeRenderObservable.addOnce(()=>i()))}if(!this._disposed&&!t.canBackup)l.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(){let t=this._maxResidentSplats;if(this._memoryBudgetMb>0){let s=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48,i=vs+this._shTextureCount*16+(this._needsRotationScale?s:0),r=Math.floor(this._memoryBudgetMb*1024*1024/i);t=t>0?Math.min(t,r):r}this._residentBudget=t}_collectAllFileIds(){let t=new Set;for(let s of this._leafNodes)for(let i of s.availableLevels){let r=s.lods[String(i)];if(r)t.add(r.file)}return Array.from(t).sort((s,i)=>s-i)}async _gatherCountsAsync(t){let s=0,i=0,r=0,o=(g)=>{let f=xe._GetShInfo(g);if(f.degree>i)i=f.degree;if(f.coeffs>r)r=f.coeffs};if(this._metadata.environment)try{let g=this._rootUrl+this._metadata.environment,f=await this._downloadManager.loadFileAsync(g),y=await this._unzipAsync(new Uint8Array(f)),b=y.get("meta.json");if(b){let R=JSON.parse(new TextDecoder().decode(b));s=xe._GetSplatCount(R),o(R),this._environmentFiles=y}}catch(g){l.Warn("GaussianSplattingStream: failed to load environment: "+(g?.message??g))}await Promise.all(t.map(async(g)=>{let f=this._metadata.filenames[g];if(!f){l.Warn(`GaussianSplattingStream: missing filename for file index ${g}.`);return}try{let y=this._rootUrl+f,b=y.substring(0,y.lastIndexOf("/")+1),R=await this._downloadManager.loadFileAsync(y),v=JSON.parse(new TextDecoder().decode(new Uint8Array(R)));this._fileCounts.set(g,xe._GetSplatCount(v)),this._fileMeta.set(g,{sogData:v,subRootUrl:b})}catch(y){l.Warn(`GaussianSplattingStream: failed to load metadata for ${f}: ${y?.message??y}`)}}));for(let{sogData:g}of this._fileMeta.values())o(g);if(this._decodeSh&&i>0&&r>0)this._streamShDegree=i,this._shTextureCount=Math.ceil(r*3/16);return s}_enqueueDecode(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._fileMeta.has(t))return;if(this._decodeQueue.indexOf(t)===-1)this._decodeQueue.push(t)}_pumpDecodeQueue(){let t=0;while(this._decodeQueue.length>0&&t<this._maxDecodesPerFrame){let s=this._decodeQueue.shift();if(this._decodedFiles.has(s)||this._loadingFiles.has(s))continue;t++,this._decodeFileAsync(s).catch((i)=>{l.Warn("GaussianSplattingStream: decode failed: "+(i?.message??i))})}}_applyPositions(t,s,i){this._splatPositions.set(t,(this._positionBase+s)*4),this._updateBounds(t,i),this._sinkPostPositionsRange(s,i)}_sinkSetActiveRanges(t){if(this._host)this._host.setActiveRanges(t);else this.setSplatIndexRanges(t)}_sinkPostPositionsRange(t,s){if(this._host)this._host.postPositionsRange(t,s);else this._postWorkerPositionsRange(t,s)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(t,s,i){if(this._readbackProbed=!0,!this._workBuffer)return;let r=Math.min(s,1024),o=!1;try{let g=await this._workBuffer.readCentersRangeAsync(t,r);if(this._disposed)return;if(g&&g.length>=r*4){o=!0;for(let f=0;f<r&&o;f++)for(let y=0;y<3;y++){let b=g[f*4+y],R=i[f*4+y];if(Math.abs(b-R)>0.01*(1+Math.abs(R))){o=!1;break}}}}catch{o=!1}this._useGpuPositionReadback=o,l.Log(o?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(t,s,i){if(this._useGpuPositionReadback&&this._workBuffer){let o=await this._workBuffer.readCentersRangeAsync(s,i);if(this._disposed)return!1;if(o&&this._splatPositions)return this._applyPositions(o,s,i),!0}let r=t.positions.length>=i*4?t.positions.subarray(0,i*4):null;if(!r||!this._splatPositions)return!1;if(this._applyPositions(r,s,i),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(s,i,r);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let t=this._environmentRange;try{let i=(await Le(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!i)return;try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(i,t.offset),this._disposed)return;if(await this._applyDecodedPositionsAsync(i,t.offset,t.count),this._disposed)return;this._refreshActiveRanges()}finally{xe._DisposePack(i)}}catch(s){l.Warn("GaussianSplattingStream: failed to decode environment: "+(s?.message??s))}}async _decodeFileAsync(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._residency)return;let s=this._fileMeta.get(t),i=this._fileCounts.get(t);if(!s||i===void 0)return;this._loadingFiles.add(t),this._cancelledDecodes.delete(t);let r=!1;try{let g=(await Le(s.sogData,s.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,t)).sogTextures;if(!g)return;let f=await this._acquireDecodeGateAsync();try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;let y=this._residency.allocate(t,i);if(y===null)y=await this._relayoutAndAllocateAsync(t,i);if(y===null){if(!this._cancelledDecodes.has(t))l.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${t}.`);return}if(r=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;if(await this._workBuffer.decodeAsync(g,y),this._disposed||this._cancelledDecodes.has(t))return;if(await this._applyDecodedPositionsAsync(g,y,i),this._disposed)return;if(this._decodedFiles.add(t),this._applyDesiredLods())this._refreshActiveRanges()}finally{xe._DisposePack(g),f()}}catch(o){if(!this._cancelledDecodes.has(t))throw o}finally{if(r&&!this._decodedFiles.has(t))this._residency.free(t);this._loadingFiles.delete(t),this._cancelledDecodes.delete(t)}}async _acquireDecodeGateAsync(){let t=this._decodeGate,s;return this._decodeGate=new Promise((i)=>{s=i}),await t,s}async _relayoutAndAllocateAsync(t,s){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<s)return null;return await new Promise((i)=>{let r=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(t)){i(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(r);return}this._performRelayout(),i(this._residency.allocate(t,s))};this._scene.onBeforeRenderObservable.addOnce(r)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let t=this._relayoutOldOffsets;t.clear();for(let y of this._residency.getResidentBlocks())t.set(y.file,y.offset);if(this._residency.compact().length===0)return;let i=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==i)this._relayoutSrcIndex=new Float32Array(i);let r=this._relayoutSrcIndex;r.fill(-1);let o=this._residency.getResidentBlocks();for(let y of o){let b=t.get(y.file);for(let R=0;R<y.count;R++)r[y.offset+R]=b+R}this._workBuffer.relayoutSync(r);let g=this._splatPositions,f=this._positionBase;o.sort((y,b)=>y.offset-b.offset);for(let y of o){let b=t.get(y.file);if(b!==y.offset)g.copyWithin((f+y.offset)*4,(f+b)*4,(f+b+y.count)*4)}if(this._environmentRange){let y=this._residency.offset(rs);if(y!==void 0)this._environmentRange.offset=y}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(t){this._decodedFiles.delete(t)}_cappedLevelForNode(t,s){let i=t.availableLevels,r=this._maxDetailLod,o=-1,g=Number.POSITIVE_INFINITY;for(let f of i){if(f<r)continue;let y=Math.abs(f-s);if(y<g)o=f,g=y}return o<0?t.baseLod:o}_computeTargetLevels(){for(let t of this._leafNodes){let s=t.optimalLod??t.baseLod;t.targetLevel=this._cappedLevelForNode(t,s)}}_applyDesiredLods(){let t=!1;for(let s of this._leafNodes){if(s.lodCooldown&&s.lodCooldown>0)continue;let i=s.targetLevel??s.baseLod,r;if(i!==s.activeLod){let o=s.lods[String(i)];if(o)if(this._decodedFiles.has(o.file))this._switchActiveFile(s,o.file),s.activeLod=i,s.lodCooldown=this._lodCooldownFrames,t=!0;else r=o.file}if(s.pendingFile!==r){if(s.pendingFile!==void 0)this._releaseFileRef(s.pendingFile);if(r!==void 0)this._acquirePendingFile(r);s.pendingFile=r}}return t}_switchActiveFile(t,s){if(t.activeFile===s)return;if(t.activeFile!==void 0)this._releaseFileRef(t.activeFile);this._acquireFileRef(s),t.activeFile=s}_acquireFileRef(t){let s=(this._fileRefs.get(t)??0)+1;if(this._fileRefs.set(t,s),s===1)this._residency?.cancelEviction(t)}_acquirePendingFile(t){this._acquireFileRef(t),this._enqueueDecode(t)}_releaseFileRef(t){let s=(this._fileRefs.get(t)??0)-1;if(s>0){this._fileRefs.set(t,s);return}if(this._fileRefs.delete(t),this._decodedFiles.has(t)){if(this._evictionEnabled)this._residency?.scheduleEviction(t);return}let i=this._decodeQueue.indexOf(t);if(i!==-1)this._decodeQueue.splice(i,1);if(this._loadingFiles.has(t))this._cancelledDecodes.add(t),this._downloadManager.cancelGroup(t)}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;let t=!1;for(let r of this._leafNodes)if(r.lodCooldown&&r.lodCooldown>0){if(r.lodCooldown--,r.lodCooldown===0&&r.targetLevel!==void 0&&r.targetLevel!==r.activeLod)t=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let s=this._updateNodeFrustum(),i=this._forceLodUpdate||s||t;if(!i&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let r=this._scene.activeCamera,o=this._lodUpdateDistance;if(!r||e.DistanceSquared(r.globalPosition,this._lastLodCamPos)>=o*o){if(r)this._lastLodCamPos.copyFrom(r.globalPosition);i=!0}}if(i){if(this._forceLodUpdate=!1,this._framesSinceLodUpdate=0,this.evaluateOptimalLods(this._scene.activeCamera),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_updateNodeFrustum(){let t=this._scene.activeCamera,s=!1;if(!this._frustumCulling||!t){for(let r of this._leafNodes)if(r.inFrustum===!1)r.inFrustum=!0,s=!0;return s}let i=this._getEffectiveWorldMatrix(!1);t.getViewMatrix().multiplyToRef(t.getProjectionMatrix(),this._cullViewProj),Zr.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);for(let r of this._leafNodes){r.cullBounds.update(i);let o=r.cullBounds.isInFrustum(this._frustumPlanes);if(o!==r.inFrustum)r.inFrustum=o,s=!0}return s}static _GetSplatCount(t){return t.count??(Array.isArray(t.means.shape)?t.means.shape[0]:0)}static _GetShInfo(t){if(!t.shN)return{degree:0,coeffs:0};let s=4,i=0,r=t.shN.bands;if(typeof r==="number"&&Number.isFinite(r)&&r>0)i=Math.floor(r);else if(Array.isArray(t.shN.shape)&&Number.isFinite(t.shN.shape[1])&&t.shN.shape[1]>0){let o=Math.floor(t.shN.shape[1]/3);i=o>0?Math.round(Math.sqrt(o+1)-1):0}if(!(i>0))return{degree:0,coeffs:0};if(i>s)l.Warn(`GaussianSplattingStream: SH degree ${i} exceeds the maximum supported (${s}); clamping.`),i=s;return{degree:i,coeffs:(i+1)**2-1}}static _DisposePack(t){t.meansTextureL.dispose(),t.meansTextureU.dispose(),t.scalesTexture.dispose(),t.quatsTexture.dispose(),t.sh0Texture.dispose(),t.shCentroidsTexture?.dispose(),t.shLabelsTexture?.dispose(),t.codebookTexture?.dispose()}_updateBounds(t,s){let i=this._boundsMin,r=this._boundsMax;for(let o=0;o<s;o++){let g=t[o*4+0],f=t[o*4+1],y=t[o*4+2];i.minimizeInPlaceFromFloats(g,f,y),r.maximizeInPlaceFromFloats(g,f,y)}if(this._host)this._host.expandBounds(i,r);else this.setBoundingInfo(new ii(i,r))}_refreshActiveRanges(){let t=[];if(this._environmentRange)t.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let s of this._leafNodes){if(s.activeLod===void 0)continue;let i=s.lods[String(s.activeLod)];if(!i)continue;let r=this._residency?.offset(i.file);if(r===void 0)continue;t.push({offset:r+i.offset,count:i.count})}this._sinkSetActiveRanges(xe._CoalesceRanges(t))}static _CoalesceRanges(t){if(t.length<=1)return t;let s=t.slice().sort((r,o)=>r.offset-o.offset),i=[{offset:s[0].offset,count:s[0].count}];for(let r=1;r<s.length;r++){let o=i[i.length-1],g=s[r],f=o.offset+o.count;if(g.offset<=f){let y=Math.max(f,g.offset+g.count);o.count=y-o.offset}else i.push({offset:g.offset,count:g.count})}return i}async _unzipAsync(t){let s=this._streamOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let i=s.unzipSync(t),r=new Map;for(let[o,g]of Object.entries(i))r.set(o,g);return r}}class Ff{constructor(t,s,i,r,o){this.idx=0,this.color=new S(1,1,1,1),this.position=e.Zero(),this.rotation=e.Zero(),this.uv=new m(0,0),this.velocity=e.Zero(),this.pivot=e.Zero(),this.translateFromPivot=!1,this._pos=0,this._ind=0,this.groupId=0,this.idxInGroup=0,this._stillInvisible=!1,this._rotationMatrix=[1,0,0,0,1,0,0,0,1],this.parentId=null,this._globalPosition=e.Zero(),this.idx=t,this._group=s,this.groupId=i,this.idxInGroup=r,this._pcs=o}get size(){return this.size}set size(t){this.size=t}get quaternion(){return this.rotationQuaternion}set quaternion(t){this.rotationQuaternion=t}intersectsMesh(t,s){if(!t.hasBoundingInfo)return!1;if(!this._pcs.mesh)throw Error("Point Cloud System doesnt contain the Mesh");if(s)return t.getBoundingInfo().boundingSphere.intersectsPoint(this.position.add(this._pcs.mesh.position));let i=t.getBoundingInfo().boundingBox,r=i.maximumWorld.x,o=i.minimumWorld.x,g=i.maximumWorld.y,f=i.minimumWorld.y,y=i.maximumWorld.z,b=i.minimumWorld.z,R=this.position.x+this._pcs.mesh.position.x,v=this.position.y+this._pcs.mesh.position.y,A=this.position.z+this._pcs.mesh.position.z;return o<=R&&R<=r&&f<=v&&v<=g&&b<=A&&A<=y}getRotationMatrix(t){let s;if(this.rotationQuaternion)s=this.rotationQuaternion;else{s=a.Quaternion[0];let i=this.rotation;d.RotationYawPitchRollToRef(i.y,i.x,i.z,s)}s.toRotationMatrix(t)}}class fc{get groupID(){return this.groupId}set groupID(t){this.groupId=t}constructor(t,s){this.groupId=t,this._positionFunction=s}}var Qx={internalPickerForMesh:void 0};class ee{constructor(t,s,i=Number.MAX_VALUE,r=G){this.origin=t,this.direction=s,this.length=i,this.epsilon=r}clone(){return new ee(this.origin.clone(),this.direction.clone(),this.length)}intersectsBoxMinMax(t,s,i=0){let r=ee._TmpVector3[0].copyFromFloats(t.x-i,t.y-i,t.z-i),o=ee._TmpVector3[1].copyFromFloats(s.x+i,s.y+i,s.z+i),g=0,f=Number.MAX_VALUE,y,b,R,v;if(Math.abs(this.direction.x)<0.0000001){if(this.origin.x<r.x||this.origin.x>o.x)return!1}else{if(y=1/this.direction.x,b=(r.x-this.origin.x)*y,R=(o.x-this.origin.x)*y,R===-1/0)R=1/0;if(b>R)v=b,b=R,R=v;if(g=Math.max(b,g),f=Math.min(R,f),g>f)return!1}if(Math.abs(this.direction.y)<0.0000001){if(this.origin.y<r.y||this.origin.y>o.y)return!1}else{if(y=1/this.direction.y,b=(r.y-this.origin.y)*y,R=(o.y-this.origin.y)*y,R===-1/0)R=1/0;if(b>R)v=b,b=R,R=v;if(g=Math.max(b,g),f=Math.min(R,f),g>f)return!1}if(Math.abs(this.direction.z)<0.0000001){if(this.origin.z<r.z||this.origin.z>o.z)return!1}else{if(y=1/this.direction.z,b=(r.z-this.origin.z)*y,R=(o.z-this.origin.z)*y,R===-1/0)R=1/0;if(b>R)v=b,b=R,R=v;if(g=Math.max(b,g),f=Math.min(R,f),g>f)return!1}return!0}intersectsBox(t,s=0){return this.intersectsBoxMinMax(t.minimum,t.maximum,s)}intersectsSphere(t,s=0){let i=t.center.x-this.origin.x,r=t.center.y-this.origin.y,o=t.center.z-this.origin.z,g=i*i+r*r+o*o,f=t.radius+s,y=f*f;if(g<=y)return!0;let b=i*this.direction.x+r*this.direction.y+o*this.direction.z;if(b<0)return!1;return g-b*b<=y}intersectsTriangle(t,s,i){let r=ee._TmpVector3[0],o=ee._TmpVector3[1],g=ee._TmpVector3[2],f=ee._TmpVector3[3],y=ee._TmpVector3[4];s.subtractToRef(t,r),i.subtractToRef(t,o),e.CrossToRef(this.direction,o,g);let b=e.Dot(r,g);if(b===0)return null;let R=1/b;this.origin.subtractToRef(t,f);let v=e.Dot(f,g)*R;if(v<-this.epsilon||v>1+this.epsilon)return null;e.CrossToRef(f,r,y);let A=e.Dot(this.direction,y)*R;if(A<-this.epsilon||v+A>1+this.epsilon)return null;let C=e.Dot(o,y)*R;if(C>this.length||C<0)return null;return new Va(1-v-A,v,C)}intersectsPlane(t){let s,i=e.Dot(t.normal,this.direction);if(Math.abs(i)<0.000000999999997475243)return null;else{let r=e.Dot(t.normal,this.origin);if(s=(-t.d-r)/i,s<0)if(s<-0.000000999999997475243)return null;else return 0;return s}}intersectsAxis(t,s=0){switch(t){case"y":{let i=(this.origin.y-s)/this.direction.y;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,s,this.origin.z+this.direction.z*-i)}case"x":{let i=(this.origin.x-s)/this.direction.x;if(i>0)return null;return new e(s,this.origin.y+this.direction.y*-i,this.origin.z+this.direction.z*-i)}case"z":{let i=(this.origin.z-s)/this.direction.z;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,this.origin.y+this.direction.y*-i,s)}default:return null}}intersectsMesh(t,s,i,r=!1,o,g=!1){let f=a.Matrix[0];if(t.getWorldMatrix().invertToRef(f),this._tmpRay)ee.TransformToRef(this,f,this._tmpRay);else this._tmpRay=ee.Transform(this,f);return t.intersects(this._tmpRay,s,i,r,o,g)}intersectsMeshes(t,s,i){if(i)i.length=0;else i=[];for(let r=0;r<t.length;r++){let o=this.intersectsMesh(t[r],s);if(o.hit)i.push(o)}return i.sort(this._comparePickingInfo),i}_comparePickingInfo(t,s){if(t.distance<s.distance)return-1;else if(t.distance>s.distance)return 1;else return 0}intersectionSegment(t,s,i){let r=this.origin,o=a.Vector3[0],g=a.Vector3[1],f=a.Vector3[2],y=a.Vector3[3];s.subtractToRef(t,o),this.direction.scaleToRef(ee._Rayl,f),r.addToRef(f,g),t.subtractToRef(r,y);let b=e.Dot(o,o),R=e.Dot(o,f),v=e.Dot(f,f),A=e.Dot(o,y),C=e.Dot(f,y),z=b*v-R*R,I,V=z,W,T=z;if(z<ee._Smallnum)I=0,V=1,W=C,T=v;else if(I=R*C-v*A,W=b*C-R*A,I<0)I=0,W=C,T=v;else if(I>V)I=V,W=C+R,T=v;if(W<0)if(W=0,-A<0)I=0;else if(-A>b)I=V;else I=-A,V=b;else if(W>T)if(W=T,-A+R<0)I=0;else if(-A+R>b)I=V;else I=-A+R,V=b;let B=Math.abs(I)<ee._Smallnum?0:I/V,D=Math.abs(W)<ee._Smallnum?0:W/T,O=a.Vector3[4];f.scaleToRef(D,O);let N=a.Vector3[5];o.scaleToRef(B,N),N.addInPlace(y);let P=a.Vector3[6];if(N.subtractToRef(O,P),D>0&&D<=this.length&&P.lengthSquared()<i*i)return N.length();return-1}update(t,s,i,r,o,g,f,y=!1){if(y){if(!ee._RayDistant)ee._RayDistant=ee.Zero();ee._RayDistant.unprojectRayToRef(t,s,i,r,c.IdentityReadOnly,g,f);let b=a.Matrix[0];o.invertToRef(b),ee.TransformToRef(ee._RayDistant,b,this)}else this.unprojectRayToRef(t,s,i,r,o,g,f);return this}static Zero(){return new ee(e.Zero(),e.Zero())}static CreateNew(t,s,i,r,o,g,f){return ee.Zero().update(t,s,i,r,o,g,f)}static CreateNewFromTo(t,s,i=c.IdentityReadOnly){let r=new ee(new e(0,0,0),new e(0,0,0));return ee.CreateFromToToRef(t,s,r,i)}static CreateFromToToRef(t,s,i,r=c.IdentityReadOnly){i.origin.copyFrom(t);let o=s.subtractToRef(t,i.direction),g=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z);return i.length=g,i.direction.normalize(),ee.TransformToRef(i,r,i)}static Transform(t,s){let i=new ee(new e(0,0,0),new e(0,0,0));return ee.TransformToRef(t,s,i),i}static TransformToRef(t,s,i){e.TransformCoordinatesToRef(t.origin,s,i.origin),e.TransformNormalToRef(t.direction,s,i.direction),i.length=t.length,i.epsilon=t.epsilon;let r=i.direction,o=r.length();if(!(o===0||o===1)){let g=1/o;r.x*=g,r.y*=g,r.z*=g,i.length*=o}return i}unprojectRayToRef(t,s,i,r,o,g,f){let y=a.Matrix[0];o.multiplyToRef(g,y),y.multiplyToRef(f,y),y.invert();let b=E.LastCreatedEngine,R=a.Vector3[0];R.x=t/i*2-1,R.y=-(s/r*2-1),R.z=b?.useReverseDepthBuffer?1:b?.isNDCHalfZRange?0:-1;let v=a.Vector3[1].copyFromFloats(R.x,R.y,0.99999999),A=a.Vector3[2],C=a.Vector3[3];e.TransformCoordinatesToRef(R,y,A),e.TransformCoordinatesToRef(v,y,C),this.origin.copyFrom(A),C.subtractToRef(A,this.direction),this.direction.normalize()}}ee._TmpVector3=ar(6,e.Zero);ee._RayDistant=ee.Zero();ee._Smallnum=0.00000001;ee._Rayl=1e9;function gh(t,s,i,r,o,g=!1){let f=ee.Zero();return hc(t,s,i,r,f,o,g),f}function hc(t,s,i,r,o,g,f=!1,y=!1){let b=t.getEngine();if(!g&&!(g=t.activeCamera)&&!(g=t.cameraToUseForPointers))return t;let R=g.viewport,v=b.getRenderHeight(),{x:A,y:C,width:z,height:I}=R.toGlobal(b.getRenderWidth(),v),V=1/b.getHardwareScalingLevel();return s=s*V-A,i=i*V-(v-C-I),o.update(s,i,z,I,r?r:c.IdentityReadOnly,f?c.IdentityReadOnly:g.getViewMatrix(),g.getProjectionMatrix(),y),t}function _h(t,s,i,r){let o=ee.Zero();return Ml(t,s,i,o,r),o}function Ml(t,s,i,r,o){if(!mi)return t;let g=t.getEngine();if(!o&&!(o=t.activeCamera)&&!(o=t.cameraToUseForPointers))throw Error("Active camera not set");let f=o.viewport,y=g.getRenderHeight(),{x:b,y:R,width:v,height:A}=f.toGlobal(g.getRenderWidth(),y),C=c.Identity(),z=1/g.getHardwareScalingLevel();return s=s*z-b,i=i*z-(y-R-A),r.update(s,i,v,A,C,C,o.getProjectionMatrix()),t}function We(t,s,i,r,o,g,f,y){let b=s(r,i.enableDistantPicking);return tt(t,i,r,b,o,g,f,y)}function tt(t,s,i,r,o,g,f,y){let b=s.intersects(r,o,f,g,i,y);if(!b||!b.hit)return null;if(!o&&t!=null&&b.distance>=t.distance)return null;return b}function Cs(t,s){return t==="InstancedLinesMesh"||t==="LinesMesh"?s.intersectionThreshold:0}function ls(t){let s=t.getClassName();if(s==="GreasedLineMesh")return{rawBoundingInfo:null,intersectionThreshold:0};let i=t.rawBoundingInfo;return{rawBoundingInfo:i,intersectionThreshold:i?Cs(s,t):0}}function cs(t,s,i,r,o){let g=t(i,s.enableDistantPicking);if(!g.intersectsSphere(r.boundingSphere,o)||!g.intersectsBox(r.boundingBox,o))return null;return g}function st(t,s,i,r,o,g){let f=null,y=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),b=t.cameraToUseForPointers||t.activeCamera,R=Qx.internalPickerForMesh||We,v=R===We;for(let A=0;A<t.meshes.length;A++){let C=t.meshes[A];if(i){if(!i(C,-1))continue}else if(!C.isEnabled()||!C.isVisible||!C.isPickable)continue;let z=y&&C.isWorldMatrixCameraDependent(),I=C.computeWorldMatrix(z,b);if(C.hasThinInstances&&C.thinInstanceEnablePicking){let V=R(f,s,C,I,!0,!0,g);if(V){if(o)return V;let{rawBoundingInfo:W,intersectionThreshold:T}=ls(C),B=C._thinInstanceDataStorage.matrixData;if(B){let D=a.Matrix[0],O=a.Matrix[1],N=Math.min(C.thinInstanceCount,B.length>>4);for(let P=0;P<N;P++){if(i&&!i(C,P))continue;c.FromArrayToRef(B,P<<4,D),D.multiplyToRef(I,O);let U=v&&W?cs(s,C,O,W,T):null;if(v&&W&&!U)continue;let X=v&&U?tt(f,C,O,U,r,o,g,!0):R(f,s,C,O,r,o,g,!0);if(X){if(f=X,f.thinInstanceIndex=P,r)return f}}}}}else{let V=R(f,s,C,I,r,o,g);if(V){if(f=V,r)return f}}}return f||new mi}function us(t,s,i,r){if(!mi)return null;let o=[],g=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),f=t.cameraToUseForPointers||t.activeCamera,y=Qx.internalPickerForMesh||We,b=y===We;for(let R=0;R<t.meshes.length;R++){let v=t.meshes[R];if(i){if(!i(v,-1))continue}else if(!v.isEnabled()||!v.isVisible||!v.isPickable)continue;let A=g&&v.isWorldMatrixCameraDependent(),C=v.computeWorldMatrix(A,f);if(v.hasThinInstances&&v.thinInstanceEnablePicking){if(y(null,s,v,C,!0,!0,r)){let{rawBoundingInfo:I,intersectionThreshold:V}=ls(v),W=v._thinInstanceDataStorage.matrixData;if(W){let T=a.Matrix[0],B=a.Matrix[1],D=Math.min(v.thinInstanceCount,W.length>>4);for(let O=0;O<D;O++){if(i&&!i(v,O))continue;c.FromArrayToRef(W,O<<4,T),T.multiplyToRef(C,B);let N=b&&I?cs(s,v,B,I,V):null;if(b&&I&&!N)continue;let P=b&&N?tt(null,v,B,N,!1,!1,r,!0):y(null,s,v,B,!1,!1,r,!0);if(P)P.thinInstanceIndex=O,o.push(P)}}}}else{let z=y(null,s,v,C,!1,!1,r);if(z)o.push(z)}}return o}function qx(t,s,i,r,o,g){if(!mi)return null;let f=st(t,(y)=>{if(!t._tempPickingRay)t._tempPickingRay=ee.Zero();return hc(t,s,i,y,t._tempPickingRay,g||null),t._tempPickingRay},r,o,!0);if(f)f.ray=gh(t,s,i,c.Identity(),g||null);return f}function xh(t,s,i,r,o,g,f,y=!1){let b=st(t,(R,v)=>{if(!t._tempPickingRay)t._tempPickingRay=ee.Zero();return hc(t,s,i,R,t._tempPickingRay,g||null,!1,v),t._tempPickingRay},r,o,!1,f);if(b)b.ray=gh(t,s,i,c.Identity(),g||null);return b}function vh(t,s,i,r,o){let g=st(t,(f)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=c.Identity();if(f.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=ee.Zero();return ee.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r,!1,o);if(g)g.ray=s;return g}function Zx(t,s,i,r,o,g){return us(t,(f)=>gh(t,s,i,f,o||null),r,g)}function Kx(t,s,i,r){return us(t,(o)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=c.Identity();if(o.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=ee.Zero();return ee.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r)}function K1(t,s=100,i,r){return Nf(t,new ee(e.Zero(),e.Zero(),s),s,i,r)}function Nf(t,s,i=100,r,o){if(!r)r=t.getWorldMatrix();if(s.length=i,o)s.origin.copyFrom(o);else s.origin.copyFrom(t.position);let g=a.Vector3[2];g.set(0,0,t._scene.useRightHandedSystem?-1:1);let f=a.Vector3[3];return e.TransformNormalToRef(g,r,f),e.NormalizeToRef(f,s.direction),s}function Jx(t,s){if(s)s.prototype.getForwardRay=function(i=100,r,o){return Nf(this,new ee(e.Zero(),e.Zero(),i),i,r,o)},s.prototype.getForwardRayToRef=function(i,r=100,o,g){return Nf(this,i,r,o,g)};if(!t)return;eh._IsPickingAvailable=!0,t.prototype.createPickingRay=function(i,r,o,g,f=!1){return gh(this,i,r,o,g,f)}}var sv;(function(t){t[t.Color=2]="Color",t[t.UV=1]="UV",t[t.Random=0]="Random",t[t.Stated=3]="Stated"})(sv||(sv={}));class kf{get positions(){return this._positions32}get colors(){return this._colors32}get uvs(){return this._uvs32}constructor(t,s,i,r){if(this.particles=[],this.nbParticles=0,this.counter=0,this.vars={},this._promises=[],this._positions=[],this._indices=[],this._normals=[],this._colors=[],this._uvs=[],this._updatable=!0,this._isVisibilityBoxLocked=!1,this._alwaysVisible=!1,this._groups=[],this._groupCounter=0,this._computeParticleColor=!0,this._computeParticleTexture=!0,this._computeParticleRotation=!0,this._computeBoundingBox=!1,this._isReady=!1,this.name=t,this._size=s,this._scene=i||E.LastCreatedScene,r&&r.updatable!==void 0)this._updatable=r.updatable;else this._updatable=!0}async buildMeshAsync(t){return await Promise.all(this._promises),this._isReady=!0,await this._buildMeshAsync(t)}async _buildMeshAsync(t){if(this.nbParticles===0)this.addPoints(1);this._positions32=new Float32Array(this._positions),this._uvs32=new Float32Array(this._uvs),this._colors32=new Float32Array(this._colors);let s=new M;if(s.set(this._positions32,n.PositionKind),this._uvs32.length>0)s.set(this._uvs32,n.UVKind);let i=0;if(this._colors32.length>0)i=1,s.set(this._colors32,n.ColorKind);let r=new p(this.name,this._scene);if(s.applyToMesh(r,this._updatable),this.mesh=r,this._positions=null,this._uvs=null,this._colors=null,!this._updatable)this.particles.length=0;let o=t;if(!o)o=new L("point cloud material",this._scene),o.emissiveColor=new u(i,i,i),o.disableLighting=!0,o.pointsCloud=!0,o.pointSize=this._size;return r.material=o,r}_addParticle(t,s,i,r){let o=new Ff(t,s,i,r,this);return this.particles.push(o),o}_randomUnitVector(t){t.position=new e(Math.random(),Math.random(),Math.random()),t.color=new S(1,1,1,1)}_getColorIndicesForCoord(t,s,i,r){let o=t._groupImageData,g=i*(r*4)+s*4,f=[g,g+1,g+2,g+3],y=f[0],b=f[1],R=f[2],v=f[3],A=o[y],C=o[b],z=o[R],I=o[v];return new S(A/255,C/255,z/255,I)}_setPointsColorOrUV(t,s,i,r,o,g,f,y){if(y=y??0,i)t.updateFacetData();let R=2*t.getBoundingInfo().boundingSphere.radius,v=t.getVerticesData(n.PositionKind),A=t.getIndices(),C=t.getVerticesData(n.UVKind+(y?y+1:"")),z=t.getVerticesData(n.ColorKind),I=e.Zero();t.computeWorldMatrix();let V=t.getWorldMatrix();if(!V.isIdentity()){v=v.slice(0);for(let ue=0;ue<v.length/3;ue++)e.TransformCoordinatesFromFloatsToRef(v[3*ue],v[3*ue+1],v[3*ue+2],V,I),v[3*ue]=I.x,v[3*ue+1]=I.y,v[3*ue+2]=I.z}let W,T,B,D,O,N,P,U,X,Q,te,Z,Y,ie=e.Zero(),H=e.Zero(),J=e.Zero(),ne=e.Zero(),se=e.Zero(),le,oe,j,he,_e,ge,de=m.Zero(),re=m.Zero(),rt=m.Zero(),ot=m.Zero(),nt=m.Zero(),at,lt,ct,ut,ht,ft,dt,pt,_t,mt,gt,xt,De=w.Zero(),Ge=w.Zero(),yt=w.Zero(),St=w.Zero(),Mt=w.Zero(),ye,Fe;f=f?f:0;let Ae,qe,ae=new w(0,0,0,1),Ne,Xe,bt,ve,vt,wt,Rt,Pe=new ee(e.Zero(),new e(1,0,0)),He,ke;for(let ue=0;ue<A.length/3;ue++){if(T=A[3*ue],B=A[3*ue+1],D=A[3*ue+2],O=v[3*T],N=v[3*T+1],P=v[3*T+2],U=v[3*B],X=v[3*B+1],Q=v[3*B+2],te=v[3*D],Z=v[3*D+1],Y=v[3*D+2],ie.set(O,N,P),H.set(U,X,Q),J.set(te,Z,Y),H.subtractToRef(ie,ne),J.subtractToRef(H,se),C)le=C[2*T],oe=C[2*T+1],j=C[2*B],he=C[2*B+1],_e=C[2*D],ge=C[2*D+1],de.set(le,oe),re.set(j,he),rt.set(_e,ge),re.subtractToRef(de,ot),rt.subtractToRef(re,nt);if(z&&r)at=z[4*T],lt=z[4*T+1],ct=z[4*T+2],ut=z[4*T+3],ht=z[4*B],ft=z[4*B+1],dt=z[4*B+2],pt=z[4*B+3],_t=z[4*D],mt=z[4*D+1],gt=z[4*D+2],xt=z[4*D+3],De.set(at,lt,ct,ut),Ge.set(ht,ft,dt,pt),yt.set(_t,mt,gt,xt),Ge.subtractToRef(De,St),yt.subtractToRef(Ge,Mt);let Ze,Tt,Ct,Dt,At,we,Re,Be,Lt=new u(0,0,0),ze=new u(0,0,0),Te,pe;for(let je=0;je<s._groupDensity[ue];je++){if(W=this.particles.length,this._addParticle(W,s,this._groupCounter,ue+je),pe=this.particles[W],ye=Math.sqrt(F(0,1)),Fe=F(0,1),Ae=ie.add(ne.scale(ye)).add(se.scale(ye*Fe)),i){if(Ne=t.getFacetNormal(ue).normalize().scale(-1),Xe=ne.clone().normalize(),bt=e.Cross(Ne,Xe),ve=F(0,2*Math.PI),vt=Xe.scale(Math.cos(ve)).add(bt.scale(Math.sin(ve))),ve=F(0.1,Math.PI/2),ke=vt.scale(Math.cos(ve)).add(Ne.scale(Math.sin(ve))),Pe.origin=Ae.add(ke.scale(0.00001)),Pe.direction=ke,Pe.length=R,He=Pe.intersectsMesh(t),He.hit)Rt=He.pickedPoint.subtract(Ae).length(),wt=F(0,1)*Rt,Ae.addInPlace(ke.scale(wt))}if(pe.position=Ae.clone(),this._positions.push(pe.position.x,pe.position.y,pe.position.z),r!==void 0){if(C)if(qe=de.add(ot.scale(ye)).add(nt.scale(ye*Fe)),r)if(o&&s._groupImageData!==null)Ze=s._groupImgWidth,Tt=s._groupImgHeight,Te=this._getColorIndicesForCoord(s,Math.round(qe.x*Ze),Math.round(qe.y*Tt),Ze),pe.color=Te,this._colors.push(Te.r,Te.g,Te.b,Te.a);else if(z)ae=De.add(St.scale(ye)).add(Mt.scale(ye*Fe)),pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else ae=De.set(Math.random(),Math.random(),Math.random(),1),pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else pe.uv=qe.clone(),this._uvs.push(pe.uv.x,pe.uv.y)}else{if(g){if(Lt.set(g.r,g.g,g.b),Ct=F(-f,f),Dt=F(-f,f),Be=Lt.toHSV(),At=Be.r,we=Be.g+Ct,Re=Be.b+Dt,we<0)we=0;if(we>1)we=1;if(Re<0)Re=0;if(Re>1)Re=1;u.HSVtoRGBToRef(At,we,Re,ze),ae.set(ze.r,ze.g,ze.b,1)}else ae=De.set(Math.random(),Math.random(),Math.random(),1);pe.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w)}}}}_colorFromTexture(t,s,i){if(t.material===null){l.Warn(t.name+"has no material."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let o=t.material.getActiveTextures();if(o.length===0){l.Warn(t.name+"has no usable texture."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let g=t.clone();g.setEnabled(!1),this._promises.push(new Promise((f)=>{Ut.WhenAllReady(o,()=>{let y=s._textureNb;if(y<0)y=0;if(y>o.length-1)y=o.length-1;let b=()=>{s._groupImgWidth=o[y].getSize().width,s._groupImgHeight=o[y].getSize().height,this._setPointsColorOrUV(g,s,i,!0,!0,void 0,void 0,o[y].coordinatesIndex),g.dispose(),f()};s._groupImageData=null;let R=o[y].readPixels();if(!R)b();else R.then((v)=>{s._groupImageData=v,b()})})}))}_calculateDensity(t,s,i){let r,o,g,f,y,b,R,v,A,C,z,I,V=e.Zero(),W=e.Zero(),T=e.Zero(),B=e.Zero(),D=e.Zero(),O=e.Zero(),N,P=[],U=0,X=i.length/3;for(let Z=0;Z<X;Z++)r=i[3*Z],o=i[3*Z+1],g=i[3*Z+2],f=s[3*r],y=s[3*r+1],b=s[3*r+2],R=s[3*o],v=s[3*o+1],A=s[3*o+2],C=s[3*g],z=s[3*g+1],I=s[3*g+2],V.set(f,y,b),W.set(R,v,A),T.set(C,z,I),W.subtractToRef(V,B),T.subtractToRef(W,D),e.CrossToRef(B,D,O),N=0.5*O.length(),U+=N,P[Z]=U;let Q=Array(X),te=t;for(let Z=X-1;Z>0;Z--){let Y=P[Z];if(Y===0)Q[Z]=0;else{let H=(Y-P[Z-1])/Y*te,J=Math.floor(H),ne=H-J,se=Number(Math.random()<ne),le=J+se;Q[Z]=le,te-=le}}return Q[0]=te,Q}addPoints(t,s=this._randomUnitVector){let i=new fc(this._groupCounter,s),r,o=this.nbParticles;for(let g=0;g<t;g++){if(r=this._addParticle(o,i,this._groupCounter,g),i&&i._positionFunction)i._positionFunction(r,o,g);if(this._positions.push(r.position.x,r.position.y,r.position.z),r.color)this._colors.push(r.color.r,r.color.g,r.color.b,r.color.a);if(r.uv)this._uvs.push(r.uv.x,r.uv.y);o++}return this.nbParticles+=t,this._groupCounter++,this._groupCounter}addSurfacePoints(t,s,i,r,o){let g=i?i:0;if(isNaN(g)||g<0||g>3)g=0;let f=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let b=new fc(this._groupCounter,null);if(b._groupDensity=this._calculateDensity(s,f,y),g===2)b._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(g){case 2:this._colorFromTexture(t,b,!1);break;case 1:this._setPointsColorOrUV(t,b,!1,!1,!1);break;case 0:this._setPointsColorOrUV(t,b,!1);break;case 3:this._setPointsColorOrUV(t,b,!1,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}addVolumePoints(t,s,i,r,o){let g=i?i:0;if(isNaN(g)||g<0||g>3)g=0;let f=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let b=new fc(this._groupCounter,null);if(b._groupDensity=this._calculateDensity(s,f,y),g===2)b._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(g){case 2:this._colorFromTexture(t,b,!0);break;case 1:this._setPointsColorOrUV(t,b,!0,!1,!1);break;case 0:this._setPointsColorOrUV(t,b,!0);break;case 3:this._setPointsColorOrUV(t,b,!0,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}setParticles(t=0,s=this.nbParticles-1,i=!0){if(!this._updatable||!this._isReady)return this;this.beforeUpdateParticles(t,s,i);let r=a.Matrix[0],o=this.mesh,g=this._colors32,f=this._positions32,y=this._uvs32,b=a.Vector3,R=b[5].copyFromFloats(1,0,0),v=b[6].copyFromFloats(0,1,0),A=b[7].copyFromFloats(0,0,1),C=b[8].setAll(Number.MAX_VALUE),z=b[9].setAll(-Number.MAX_VALUE);c.IdentityToRef(r);let I;if(this.mesh?.isFacetDataEnabled)this._computeBoundingBox=!0;if(s=s>=this.nbParticles?this.nbParticles-1:s,this._computeBoundingBox){if(t!=0||s!=this.nbParticles-1){let B=this.mesh?.getBoundingInfo();if(B)C.copyFrom(B.minimum),z.copyFrom(B.maximum)}}let V,W,T;for(let B=t;B<=s;B++){let D=this.particles[B];I=D.idx,V=3*I,W=4*I,T=2*I,this.updateParticle(D);let{_rotationMatrix:O,position:N,_globalPosition:P}=D;if(this._computeParticleRotation)D.getRotationMatrix(r);if(D.parentId!==null){let oe=this.particles[D.parentId],{_rotationMatrix:j,_globalPosition:he}=oe,_e=N.x*j[1]+N.y*j[4]+N.z*j[7],ge=N.x*j[0]+N.y*j[3]+N.z*j[6],de=N.x*j[2]+N.y*j[5]+N.z*j[8];if(P.x=he.x+ge,P.y=he.y+_e,P.z=he.z+de,this._computeParticleRotation){let re=r.m;O[0]=re[0]*j[0]+re[1]*j[3]+re[2]*j[6],O[1]=re[0]*j[1]+re[1]*j[4]+re[2]*j[7],O[2]=re[0]*j[2]+re[1]*j[5]+re[2]*j[8],O[3]=re[4]*j[0]+re[5]*j[3]+re[6]*j[6],O[4]=re[4]*j[1]+re[5]*j[4]+re[6]*j[7],O[5]=re[4]*j[2]+re[5]*j[5]+re[6]*j[8],O[6]=re[8]*j[0]+re[9]*j[3]+re[10]*j[6],O[7]=re[8]*j[1]+re[9]*j[4]+re[10]*j[7],O[8]=re[8]*j[2]+re[9]*j[5]+re[10]*j[8]}}else if(P.x=0,P.y=0,P.z=0,this._computeParticleRotation){let oe=r.m;O[0]=oe[0],O[1]=oe[1],O[2]=oe[2],O[3]=oe[4],O[4]=oe[5],O[5]=oe[6],O[6]=oe[8],O[7]=oe[9],O[8]=oe[10]}let X=b[11];if(D.translateFromPivot)X.setAll(0);else X.copyFrom(D.pivot);let Q=b[0];Q.copyFrom(D.position);let te=Q.x-D.pivot.x,Z=Q.y-D.pivot.y,Y=Q.z-D.pivot.z,ie=te*O[0]+Z*O[3]+Y*O[6],H=te*O[1]+Z*O[4]+Y*O[7],J=te*O[2]+Z*O[5]+Y*O[8];ie+=X.x,H+=X.y,J+=X.z;let ne=f[V]=P.x+R.x*ie+v.x*H+A.x*J,se=f[V+1]=P.y+R.y*ie+v.y*H+A.y*J,le=f[V+2]=P.z+R.z*ie+v.z*H+A.z*J;if(this._computeBoundingBox)C.minimizeInPlaceFromFloats(ne,se,le),z.maximizeInPlaceFromFloats(ne,se,le);if(this._computeParticleColor&&D.color){let oe=D.color,j=this._colors32;j[W]=oe.r,j[W+1]=oe.g,j[W+2]=oe.b,j[W+3]=oe.a}if(this._computeParticleTexture&&D.uv){let oe=D.uv,j=this._uvs32;j[T]=oe.x,j[T+1]=oe.y}}if(o){if(i){if(this._computeParticleColor)o.updateVerticesData(n.ColorKind,g,!1,!1);if(this._computeParticleTexture)o.updateVerticesData(n.UVKind,y,!1,!1);o.updateVerticesData(n.PositionKind,f,!1,!1)}if(this._computeBoundingBox)if(o.hasBoundingInfo)o.getBoundingInfo().reConstruct(C,z,o._worldMatrix);else o.buildBoundingInfo(C,z,o._worldMatrix)}return this.afterUpdateParticles(t,s,i),this}dispose(){this.mesh?.dispose(),this.vars=null,this._positions=null,this._indices=null,this._normals=null,this._uvs=null,this._colors=null,this._indices32=null,this._positions32=null,this._uvs32=null,this._colors32=null}refreshVisibleSize(){if(!this._isVisibilityBoxLocked)this.mesh?.refreshBoundingInfo();return this}setVisibilityBox(t){if(!this.mesh)return;let s=t/2;this.mesh.buildBoundingInfo(new e(-s,-s,-s),new e(s,s,s))}get isAlwaysVisible(){return this._alwaysVisible}set isAlwaysVisible(t){if(!this.mesh)return;this._alwaysVisible=t,this.mesh.alwaysSelectAsActiveMesh=t}set computeParticleRotation(t){this._computeParticleRotation=t}set computeParticleColor(t){this._computeParticleColor=t}set computeParticleTexture(t){this._computeParticleTexture=t}get computeParticleColor(){return this._computeParticleColor}get computeParticleTexture(){return this._computeParticleTexture}set computeBoundingBox(t){this._computeBoundingBox=t}get computeBoundingBox(){return this._computeBoundingBox}initParticles(){}recycleParticle(t){return t}updateParticle(t){return t}beforeUpdateParticles(t,s,i){}afterUpdateParticles(t,s,i){}}var Ve=0;async function Sh(t,s){return await new Promise((i,r)=>{let o,g;if(Ci())o=window,g="window";else if(typeof self<"u")o=self,g="self";else{r(Error("Cannot load script module outside of a window or a worker"));return}if(!o._LoadScriptModuleResolve)o._LoadScriptModuleResolve={};o._LoadScriptModuleResolve[Ve]=i,t+=`
            ${g}._LoadScriptModuleResolve[${Ve}](returnedValue);
            ${g}._LoadScriptModuleResolve[${Ve}] = undefined;
        `,Ve++,x.LoadScript(t,void 0,(f,y)=>{r(y||Error(f))},s,!0)})}var Ds=32768,Ue=0.28209479177387814,it=null,hs=null;function ds(t,s,i){let r=new Uint8Array(t),o=new Uint32Array(t.slice(0,12)),g=o[2],f=r[12],y=r[13],b=r[14],R=r[15],v=o[1];if(R||o[0]!=1347635022||v<2||v>4)return new Promise((P)=>{P({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let C=new ArrayBuffer(32*g),z=1/(1<<y),I=new Int32Array(1),V=new Uint8Array(I.buffer),W=function(P,U){return V[0]=P[U+0],V[1]=P[U+1],V[2]=P[U+2],V[3]=P[U+2]&128?255:0,I[0]*z},T=16,B=new Float32Array(C),D=new Float32Array(C),O=new Uint8ClampedArray(C),N=new Uint8ClampedArray(C);for(let P=0;P<g;P++)B[P*8+0]=W(r,T+0),B[P*8+1]=W(r,T+3),B[P*8+2]=W(r,T+6),T+=9;for(let P=0;P<g;P++){for(let U=0;U<3;U++){let Q=(r[T+g+P*3+U]-127.5)/38.25;O[P*32+24+U]=nr.Clamp((0.5+Ue*Q)*255,0,255)}O[P*32+24+3]=r[T+P]}T+=g*4;for(let P=0;P<g;P++)D[P*8+3+0]=Math.exp(r[T+0]/16-10),D[P*8+3+1]=Math.exp(r[T+1]/16-10),D[P*8+3+2]=Math.exp(r[T+2]/16-10),T+=3;if(v>=3){let P=Math.SQRT1_2;for(let U=0;U<g;U++){let X=[r[T+0],r[T+1],r[T+2],r[T+3]],Q=X[0]+(X[1]<<8)+(X[2]<<16)+(X[3]<<24),te=511,Z=[],Y=Q>>>30,ie=Q,H=0;for(let se=3;se>=0;--se)if(se!==Y){let le=ie&511,oe=ie>>>9&1;if(ie=ie>>>10,Z[se]=P*(le/511),oe===1)Z[se]=-Z[se];H+=Z[se]*Z[se]}let J=1-H;Z[Y]=Math.sqrt(Math.max(J,0));let ne=[3,0,1,2];for(let se=0;se<4;se++)N[U*32+28+se]=Math.round(127.5+Z[ne[se]]*127.5);T+=4}}else for(let P=0;P<g;P++){let U=r[T+0],X=r[T+1],Q=r[T+2],te=U/127.5-1,Z=X/127.5-1,Y=Q/127.5-1;N[P*32+28+1]=U,N[P*32+28+2]=X,N[P*32+28+3]=Q;let ie=1-(te*te+Z*Z+Y*Y);N[P*32+28+0]=127.5+Math.sqrt(ie<0?0:ie)*127.5,T+=3}if(f){let U=((f+1)*(f+1)-1)*3,X=Math.ceil(U/16),Q=T,Z=s.getEngine().getCaps().maxTextureSize,Y=Math.ceil(g/Z),ie=Qs(X,Y*Z*4*4);for(let H=0;H<g;H++)for(let J=0;J<U;J++){let ne=r[Q++],se=Math.floor(J/16),le=ie[se],oe=J%16,j=H*16;le[oe+j]=ne}return new Promise((H)=>{H({mode:0,data:C,hasVertexColors:!1,sh:ie,shDegree:f,trainedWithAntialiasing:!!b})})}return new Promise((P)=>{P({mode:0,data:C,hasVertexColors:!1,trainedWithAntialiasing:!!b})})}async function ps(t){if(it&&hs===t)return await it;let s=Sh(`import createSpzModule from '${t}';
         const module = await createSpzModule();
         const returnedValue = module;`);return hs=t,it=s,await s}function*As(t,s,i=!1){let r=t.numPoints,o=32,g=new ArrayBuffer(32*r),f=new Float32Array(g),y=new Uint8Array(g),{positions:b,scales:R,colors:v,alphas:A,rotations:C}=t,z=null,I=t.shDegree,V=null,W=0,T=null,B=null,D=null;if(I>0&&t.sh.length>0){W=((I+1)*(I+1)-1)*3;let U=Math.ceil(W/16),Q=s.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/Q);z=Qs(U,te*Q*4*4),T=new Int32Array(U),B=new Int32Array(U);for(let Z=0;Z<U;Z++)T[Z]=Z*16,B[Z]=Math.min((Z+1)*16,W);D=z,V=t.sh}for(let P=0;P<r;P++){let U=P*8,X=P*32,Q=P*3,te=P*4;f[U+0]=b[Q+0],f[U+1]=b[Q+1],f[U+2]=b[Q+2],f[U+3]=Math.exp(R[Q+0]),f[U+4]=Math.exp(R[Q+1]),f[U+5]=Math.exp(R[Q+2]);let Z=(0.5+Ue*v[Q+0])*255,Y=(0.5+Ue*v[Q+1])*255,ie=(0.5+Ue*v[Q+2])*255;y[X+24]=Z<=0?0:Z>=255?255:Z+0.5|0,y[X+25]=Y<=0?0:Y>=255?255:Y+0.5|0,y[X+26]=ie<=0?0:ie>=255?255:ie+0.5|0,y[X+27]=1/(1+Math.exp(-A[P]))*255+0.5|0;let H=C[te+3]*127.5+127.5,J=C[te+0]*127.5+127.5,ne=C[te+1]*127.5+127.5,se=C[te+2]*127.5+127.5;if(y[X+28]=H<=0?0:H>=255?255:H+0.5|0,y[X+29]=J<=0?0:J>=255?255:J+0.5|0,y[X+30]=ne<=0?0:ne>=255?255:ne+0.5|0,y[X+31]=se<=0?0:se>=255?255:se+0.5|0,V&&D&&T&&B){let le=P*W,oe=P*16;for(let j=0;j<D.length;j++){let he=D[j],_e=T[j],ge=B[j];for(let de=_e;de<ge;de++){let re=V[le+de]*128+128;he[oe+de-_e]=re<=0?0:re>=255?255:re+0.5|0}}}if(P%Ds===0&&i)yield}let O,N;if(t.extensions)for(let P of t.extensions){let U=P;if(U.safeOrbitRadiusMin!==void 0){O=U.safeOrbitRadiusMin,N=[U.safeOrbitElevationMin,U.safeOrbitElevationMax];break}}return{mode:0,data:g,hasVertexColors:!1,sh:z!==null?z:void 0,shDegree:I>0?I:void 0,trainedWithAntialiasing:!!t.antialiased,safeOrbitCameraRadiusMin:O,safeOrbitCameraElevationMinMax:N}}async function _s(t,s){return await Zs(As(t,s,!0),fo())}class $n{constructor(t={}){this.name=Ie.name,this._assetContainer=null,this.extensions=Ie.extensions,this._loadingOptions={...$n._DefaultLoadingOptions,...t}}createPlugin(t){return new $n(t[Ie.name])}async importMeshAsync(t,s,i,r,o,g){let f=this._tryCreateLODStream(s,i,r);if(f)return{meshes:[f],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(t,s,i,r).then((y)=>({meshes:y,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(t,s,i){if(typeof s!=="string")return null;let r;try{r=JSON.parse(s)}catch{return null}if(!xe.IsLODMetadata(r))return null;let o=t._blockEntityCollection;t._blockEntityCollection=!!this._assetContainer;try{let g=new xe("GaussianSplattingStream",r,i,t,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return g._parentContainer=this._assetContainer,g}finally{t._blockEntityCollection=o}}static _BuildPointCloud(t,s){if(!s.byteLength)return!1;let i=new Uint8Array(s),r=new Float32Array(s),o=32,g=i.length/o,f=function(y,b){let R=r[8*b+0],v=r[8*b+1],A=r[8*b+2];y.position=new e(R,v,A);let C=i[o*b+24+0]/255,z=i[o*b+24+1]/255,I=i[o*b+24+2]/255;y.color=new S(C,z,I,1)};return t.addPoints(g,f),!0}static _BuildMesh(t,s){let i=new p("PLYMesh",t),r=new Uint8Array(s.data),o=new Float32Array(s.data),g=32,f=r.length/32,y=[],b=new M;for(let R=0;R<f;R++){let v=o[8*R+0],A=o[8*R+1],C=o[8*R+2];y.push(v,A,C)}if(s.hasVertexColors){let R=new Float32Array(f*4);for(let v=0;v<f;v++){let A=r[32*v+24+0]/255,C=r[32*v+24+1]/255,z=r[32*v+24+2]/255;R[v*4+0]=A,R[v*4+1]=C,R[v*4+2]=z,R[v*4+3]=1}b.colors=R}return b.positions=y,b.indices=s.faces,b.applyToMesh(i),i}async _unzipWithFFlateAsync(t){let s=this._loadingOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let{unzipSync:i}=s,r=i(t),o=new Map;for(let[g,f]of Object.entries(r))o.set(g,f);return o}_parseAsync(t,s,i,r){let o=[],g=(T)=>{s._blockEntityCollection=!!this._assetContainer;let B=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(B._parentContainer=this._assetContainer,o.push(B),T.sogTextures)B.setSogTextureData(T.sogTextures);else B.updateData(T.data,T.sh,{flipY:!1},void 0,T.shDegree);B.scaling.y*=-1,B.computeWorldMatrix(!0),B.safeOrbitCameraLimits=$n._ExtractSafeOrbitLimits(T),s._blockEntityCollection=!1},f=s.getEngine(),y=this._loadingOptions.useSogTextures;if(y&&!f.isWebGPU&&f.version<2)l.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),y=!1;let b=y?Le:zt;if(typeof i==="string"){let T=JSON.parse(i);if(T&&T.means&&T.scales&&T.quats&&T.sh0)return new Promise((B,D)=>{b(T,r,s).then((O)=>{g(O),B(o)}).catch((O)=>{D(Error("Failed to parse SOG data.",{cause:O}))})})}let R=i instanceof ArrayBuffer?new Uint8Array(i):i;if(R[0]===80&&R[1]===75)return new Promise((T,B)=>{this._unzipWithFFlateAsync(R).then((D)=>{b(D,r,s).then((O)=>{g(O),T(o)}).catch((O)=>{B(Error("Failed to parse SOG zip data.",{cause:O}))})})});let v=(T)=>{$n._ConvertPLYToSplat(i).then(async(B)=>{switch(s._blockEntityCollection=!!this._assetContainer,B.mode){case 0:{let D=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(D._parentContainer=this._assetContainer,o.push(D),D.updateData(B.data,B.sh,{flipY:!1},void 0,B.shDegree),D.scaling.y*=-1,B.chirality==="RightHanded")D.scaling.y*=-1;switch(B.upAxis){case"X":D.rotation=new e(0,0,Math.PI/2);break;case"Y":D.rotation=new e(0,0,Math.PI);break;case"Z":D.rotation=new e(-Math.PI/2,Math.PI,0);break}D.computeWorldMatrix(!0),D.safeOrbitCameraLimits=$n._ExtractSafeOrbitLimits(B)}break;case 1:{let D=new kf("PointCloud",1,s);if($n._BuildPointCloud(D,B.data))await D.buildMeshAsync().then((O)=>{o.push(O)});else D.dispose()}break;case 2:if(B.faces)o.push($n._BuildMesh(s,B));else throw Error("PLY mesh doesn't contain face informations.");break;default:throw Error("Unsupported Splat mode")}s._blockEntityCollection=!1,this.applyAutoCameraLimits($n._ExtractSafeOrbitLimits(B),s),T(o)})},A=R[0]===31&&R[1]===139,C=R[0]===78&&R[1]===71&&R[2]===83&&R[3]===80;if(!A&&!C)return new Promise((T)=>{v(T)});let z=(T,B)=>{s._blockEntityCollection=!!this._assetContainer;let D=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(T.trainedWithAntialiasing){let N=D.material;N.kernelSize=0.1,N.compensation=!0}if(D._parentContainer=this._assetContainer,o.push(D),D.updateData(T.data,T.sh,{flipY:!1},void 0,T.shDegree),!this._loadingOptions.flipY)D.scaling.y*=-1,D.computeWorldMatrix(!0);s._blockEntityCollection=!1;let O=$n._ExtractSafeOrbitLimits(T);D.safeOrbitCameraLimits=O,this.applyAutoCameraLimits(O,s),B(o)};if(this._loadingOptions.spzLibraryUrl)return ps(this._loadingOptions.spzLibraryUrl).then((T)=>{let B=T.loadSpzFromBuffer(new Uint8Array(i),{to:T.CoordinateSystem.RUB});return _s(B,s).then((D)=>new Promise((O)=>{z(D,O)}))});if(C)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let I=new ReadableStream({start(T){T.enqueue(new Uint8Array(i)),T.close()}}),V=new DecompressionStream("gzip"),W=I.pipeThrough(V);return new Promise((T)=>{new Response(W).arrayBuffer().then((B)=>{ds(B,s,this._loadingOptions).then((D)=>{z(D,T)})}).catch(()=>{v(T)})})}static _ExtractSafeOrbitLimits(t){if(t.safeOrbitCameraRadiusMin===void 0&&t.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:t.safeOrbitCameraRadiusMin,elevationMinMax:t.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(t,s){if(this._loadingOptions.disableAutoCameraLimits||!t)return;if(s.activeCamera?.getClassName()==="ArcRotateCamera"){let i=s.activeCamera;if(t.elevationMinMax)i.lowerBetaLimit=Math.PI*0.5-t.elevationMinMax[1],i.upperBetaLimit=Math.PI*0.5-t.elevationMinMax[0];if(t.radiusMin)i.lowerRadiusLimit=t.radiusMin}}loadAssetContainerAsync(t,s,i){let r=new Xr(t);return this._assetContainer=r,this.importMeshAsync(null,t,s,i).then((o)=>{for(let g of o.meshes)r.meshes.push(g);return this._assetContainer=null,r}).catch((o)=>{throw this._assetContainer=null,o})}loadAsync(t,s,i){return this.importMeshAsync(null,t,s,i).then(()=>{})}static _ConvertPLYToSplat(t){let s=new Uint8Array(t),i=new TextDecoder().decode(s.slice(0,10240)),r=`end_header
`,o=i.indexOf(`end_header
`);if(o<0||!i)return new Promise((N)=>{N({mode:0,data:t,rawSplat:!0})});let g=parseInt(/element vertex (\d+)\n/.exec(i)[1]),f=/element face (\d+)\n/.exec(i),y=0;if(f)y=parseInt(f[1]);let b=/element chunk (\d+)\n/.exec(i),R=0;if(b)R=parseInt(b[1]);let v=0,A=0,C={double:8,int:4,uint:4,float:4,short:2,ushort:2,uchar:1,list:0},z={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},I=z.Chunk,V=[],W=[],T=i.slice(0,o).split(`
`),B={};for(let N of T)if(N.startsWith("property ")){let[,P,U]=N.split(" ");if(I==z.Chunk)W.push({name:U,type:P,offset:A}),A+=C[P];else if(I==z.Vertex)V.push({name:U,type:P,offset:v}),v+=C[P];else if(I==z.SH)V.push({name:U,type:P,offset:v});else if(I==z.Float_Tuple){let X=new DataView(t,A,C.float*2);B.safeOrbitCameraElevationMinMax=[X.getFloat32(0,!0),X.getFloat32(4,!0)]}else if(I==z.Float){let X=new DataView(t,A,C.float);B.safeOrbitCameraRadiusMin=X.getFloat32(0,!0)}else if(I==z.Uchar){let X=new DataView(t,A,C.uchar);if(U=="up_axis")B.upAxis=X.getUint8(0)==0?"X":X.getUint8(0)==1?"Y":"Z";else if(U=="chirality")B.chirality=X.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!C[P])l.Warn(`Unsupported property type: ${P}.`)}else if(N.startsWith("element ")){let[,P]=N.split(" ");if(P=="chunk")I=z.Chunk;else if(P=="vertex")I=z.Vertex;else if(P=="sh")I=z.SH;else if(P=="safe_orbit_camera_elevation_min_max_radians")I=z.Float_Tuple;else if(P=="safe_orbit_camera_radius_min")I=z.Float;else if(P=="up_axis"||P=="chirality")I=z.Uchar}let D=v,O=A;return es.ConvertPLYWithSHToSplatAsync(t).then(async(N)=>{let P=new DataView(t,o+11),U=O*R+D*g,X=[];if(y)for(let J=0;J<y;J++){let ne=P.getUint8(U);if(ne!=3)continue;U+=1;for(let se=0;se<ne;se++){let le=P.getUint32(U+(2-se)*4,!0);X.push(le)}U+=12}if(R)return await new Promise((J)=>{J({mode:0,data:N.buffer,sh:N.sh,shDegree:N.shDegree,faces:X,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let Q=0,te=0,Z=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],Y=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let J=0;J<V.length;J++){let ne=V[J];if(Z.includes(ne.name))Q++;if(Y.includes(ne.name))te++}let ie=Q==Z.length&&te>=3,H=y?2:ie?0:1;return await new Promise((J)=>{J({...B,mode:H,data:N.buffer,sh:N.sh,shDegree:N.shDegree,faces:X,hasVertexColors:!!te,compressed:!1,rawSplat:!1})})})}}$n._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?"https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js":void 0};var ms=!1;function K0(){if(ms)return;ms=!0,kr(new $n)}var gs=!1;function ea(){if(gs)return;gs=!0,K.prototype.createDynamicTexture=function(t,s,i,r){let o=new me(this,4);if(o.baseWidth=t,o.baseHeight=s,i)t=this.needPOTTextures?Rr(t,this._caps.maxTextureSize):t,s=this.needPOTTextures?Rr(s,this._caps.maxTextureSize):s;return o.width=t,o.height=s,o.isReady=!1,o.generateMipMaps=i,o.samplingMode=r,this.updateTextureSamplingMode(r,o),this._internalTexturesCache.push(o),o},K.prototype.updateDynamicTexture=function(t,s,i,r=!1,o,g=!1,f=!1){if(!t)return;let y=this._gl,b=y.TEXTURE_2D,R=this._bindTextureDirectly(b,t,!0,g);if(this._unpackFlipY(i===void 0?t.invertY:i),r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);let v=this._getWebGLTextureType(t.type),A=this._getInternalFormat(o?o:t.format),C=this._getRGBABufferInternalSizedFormat(t.type,A);if(y.texImage2D(b,0,C,A,v,s),t.generateMipMaps)y.generateMipmap(b);if(!R)this._bindTextureDirectly(b,null);if(r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0);if(o)t.format=o;t._dynamicTextureSource=s,t._premulAlpha=r,t.invertY=i||!1,t.isReady=!0}}ea();K0();
export{Qx,ee,gh,hc,_h,Ml,qx,xh,vh,Zx,Kx,K1,Nf,Jx,ks,uc,ev,tv,iv,Bs,wr,bh,J1,rv,ea,Sh,Ff,fc,sv,kf,$n,K0};

//# debugId=DCC67A723E9FD12C64756E2164756E21
//# sourceMappingURL=site-qf5rf2by.js.map
