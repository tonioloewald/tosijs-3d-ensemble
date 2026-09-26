import{L}from"./site-mjgjmm3m.js";import{Ae,od,lr,sr,Qs,Oy,es,ad}from"./site-2awxzy1m.js";import{ho,Zs,Va,ti,M,Q,kc,B,Hl,p,fs,Xr,Br}from"./site-f2jm8sge.js";import{fe}from"./site-z2kkxbwr.js";import{g}from"./site-9rktww7x.js";import{K,n,mi,Jc,Jr}from"./site-gdtc9mmf.js";import{zt}from"./site-tfszv73y.js";import{de}from"./site-dr7h2tmh.js";import{u,G,or,E,F,m,e,I,d,c,a,f,S,ce,Ci,Rr,x,Kt}from"./site-jv0cbgr5.js";import{l}from"./site-sqgademg.js";var Ie={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};Oy();ad();kc();var Ft,qt;class Bs extends p{_isShaderMaterial(t){if(!t)return!1;return t.getClassName()==="ShaderMaterial"}constructor(t,s=null,i=null,r=null,o,_,h,y){super(t,s,i,r,o);if(this.useVertexColor=_,this.useVertexAlpha=h,this.color=new f(1,1,1),this.alpha=1,this._shaderLanguage=0,this._ownsMaterial=!1,r)this.color=r.color.clone(),this.alpha=r.alpha,this.useVertexColor=r.useVertexColor,this.useVertexAlpha=r.useVertexAlpha;this.intersectionThreshold=0.1;let b=[],w={attributes:[n.PositionKind],uniforms:["world","viewProjection"],needAlphaBlending:!0,defines:b,useClipPlane:null,shaderLanguage:0};if(!this.useVertexAlpha)w.needAlphaBlending=!1;else w.defines.push("#define VERTEXALPHA");if(!this.useVertexColor)w.uniforms.push("color"),this._color4=new S;else w.defines.push("#define VERTEXCOLOR"),w.attributes.push(n.ColorKind);if(y)this.material=y;else{if(this.getScene().getEngine().isWebGPU&&!Bs.ForceGLSL)this._shaderLanguage=1;w.shaderLanguage=this._shaderLanguage,w.extraInitializationsAsync=async()=>{if(this._shaderLanguage===1)await Promise.all([(u("pe872zjh"),import("./color.vertex-pe872zjh.js")),(u("cmz55wcr"),import("./color.fragment-cmz55wcr.js"))]);else await Promise.all([(u("1rghqpj7"),import("./color.vertex-1rghqpj7.js")),(u("gg3c9p2d"),import("./color.fragment-gg3c9p2d.js"))])};let D=new Ae("colorShader",this.getScene(),"color",w,!1);D.doNotSerialize=!0,this._ownsMaterial=!0,this._setInternalMaterial(D)}}getClassName(){return"LinesMesh"}get material(){return this._internalAbstractMeshDataInfo._material}set material(t){let s=this.material;if(s===t)return;let i=s&&this._ownsMaterial;if(this._ownsMaterial=!1,this._setInternalMaterial(t),i)s?.dispose()}_setInternalMaterial(t){if(this._setMaterial(t),this.material)this.material.fillMode=B.LineListDrawMode,this.material.disableLighting=!0}get checkCollisions(){return!1}set checkCollisions(t){}_bind(t,s){if(!this._geometry)return this;let i=this.isUnIndexed?null:this._geometry.getIndexBuffer();if(!this._userInstancedBuffersStorage||this.hasThinInstances)this._geometry._bind(s,i);else this._geometry._bind(s,i,this._userInstancedBuffersStorage.vertexBuffers,this._userInstancedBuffersStorage.vertexArrayObjects);if(!this.useVertexColor&&this._isShaderMaterial(this.material)){let{r,g:o,b:_}=this.color;this._color4.set(r,o,_,this.alpha),this.material.setColor4("color",this._color4)}return this}_draw(t,s,i){if(!this._geometry||!this._geometry.getVertexBuffers()||!this._unIndexed&&!this._geometry.getIndexBuffer())return this;let r=this.getScene().getEngine();if(this._unIndexed)r.drawArraysType(B.LineListDrawMode,t.verticesStart,t.verticesCount,i);else r.drawElementsType(B.LineListDrawMode,t.indexStart,t.indexCount,i);return this}dispose(t,s=!1,i){if(!i){if(this._ownsMaterial)this.material?.dispose(!1,!1,!0);else if(s)this.material?.dispose(!1,!1,!0)}super.dispose(t)}clone(t,s=null,i){if(s&&s._addToSceneRootNodes===void 0){let r=s;return r.source=this,new Bs(t,this.getScene(),r.parent,r.source,r.doNotCloneChildren)}return new Bs(t,this.getScene(),s,this,i)}createInstance(t){let s=new hc(t,this);if(this.instancedBuffers){s.instancedBuffers={};for(let i in this.instancedBuffers)s.instancedBuffers[i]=this.instancedBuffers[i]}return s}serialize(t){super.serialize(t),t.color=this.color.asArray(),t.alpha=this.alpha}static Parse(t,s){let i=new Bs(t.name,s);return i.color=f.FromArray(t.color),i.alpha=t.alpha,i}}Bs.ForceGLSL=!1;class hc extends fs{constructor(t,s){super(t,s);this.intersectionThreshold=s.intersectionThreshold}getClassName(){return"InstancedLinesMesh"}}var Pt=!1;function Kx(){if(Pt)return;Pt=!0,p._LinesMeshParser=(t,s)=>Bs.Parse(t,s)}(Ft=Bs.prototype).enableEdgesRendering??(Ft.enableEdgesRendering=ce("LinesMesh","enableEdgesRendering"));(qt=hc.prototype).enableEdgesRendering??(qt.enableEdgesRendering=ce("InstancedLinesMesh","enableEdgesRendering"));function Jx(t){let s=[],i=[],{lines:r,colors:o}=t,_=[],h=0;for(let b=0;b<r.length;b++){let w=r[b];for(let v=0;v<w.length;v++){let{x:D,y:T,z:P}=w[v];if(i.push(D,T,P),o){let k=o[b],{r:W,g:O,b:R,a:q}=k[v];_.push(W,O,R,q)}if(v>0)s.push(h-1),s.push(h);h++}}let y=new M;if(y.indices=s,y.positions=i,o)y.colors=_;return y}function ev(t){let s=t.dashSize||3,i=t.gapSize||1,r=t.dashNb||200,o=t.points,_=[],h=[],y=e.Zero(),b=0,w,v,D=0,T;for(T=0;T<o.length-1;T++)o[T+1].subtractToRef(o[T],y),b+=y.length();let P=b/r,k=s*P/(s+i);for(T=0;T<o.length-1;T++){o[T+1].subtractToRef(o[T],y),w=Math.floor(y.length()/P),y.normalize();for(let O=0;O<w;O++)v=P*O,_.push(o[T].x+v*y.x,o[T].y+v*y.y,o[T].z+v*y.z),_.push(o[T].x+(v+k)*y.x,o[T].y+(v+k)*y.y,o[T].z+(v+k)*y.z),h.push(D,D+1),D+=2}let W=new M;return W.positions=_,W.indices=h,W}function ks(t,s,i=null){let{instance:r,lines:o,colors:_}=s;if(r){let w=r.getVerticesData(n.PositionKind),v,D;if(_)v=r.getVerticesData(n.ColorKind);let T=0,P=0;for(let k=0;k<o.length;k++){let W=o[k];for(let O=0;O<W.length;O++){if(w[T]=W[O].x,w[T+1]=W[O].y,w[T+2]=W[O].z,_&&v)D=_[k],v[P]=D[O].r,v[P+1]=D[O].g,v[P+2]=D[O].b,v[P+3]=D[O].a,P+=4;T+=3}}if(r.updateVerticesData(n.PositionKind,w,!1,!1),_&&v)r.updateVerticesData(n.ColorKind,v,!1,!1);return r.refreshBoundingInfo(),r}let y=new Bs(t,i,null,void 0,void 0,_?!0:!1,s.useVertexAlpha,s.material);return Jx(s).applyToMesh(y,s.updatable),y}function Ar(t,s,i=null){let r=s.colors?[s.colors]:null;return ks(t,{lines:[s.points],updatable:s.updatable,instance:s.instance,colors:r,useVertexAlpha:s.useVertexAlpha,material:s.material},i)}function bu(t,s,i=null){let{points:r,instance:o}=s,_=s.gapSize||1,h=s.dashSize||3;if(o){let w=(v)=>{let D=e.Zero(),T=v.length/6,P=0,k,W,O=0,R,q;for(R=0;R<r.length-1;R++)r[R+1].subtractToRef(r[R],D),P+=D.length();let C=P/T,z=o._creationDataStorage.dashSize,U=o._creationDataStorage.gapSize,A=z*C/(z+U);for(R=0;R<r.length-1;R++){r[R+1].subtractToRef(r[R],D),k=Math.floor(D.length()/C),D.normalize(),q=0;while(q<k&&O<v.length)W=C*q,v[O]=r[R].x+W*D.x,v[O+1]=r[R].y+W*D.y,v[O+2]=r[R].z+W*D.z,v[O+3]=r[R].x+(W+A)*D.x,v[O+4]=r[R].y+(W+A)*D.y,v[O+5]=r[R].z+(W+A)*D.z,O+=6,q++}while(O<v.length)v[O]=r[R].x,v[O+1]=r[R].y,v[O+2]=r[R].z,O+=3};if(s.dashNb||s.dashSize||s.gapSize||s.useVertexAlpha||s.material)l.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return o.updateMeshPositions(w,!1),o}let y=new Bs(t,i,null,void 0,void 0,void 0,s.useVertexAlpha,s.material);return ev(s).applyToMesh(y,s.updatable),y._creationDataStorage=new Hl,y._creationDataStorage.dashSize=h,y._creationDataStorage.gapSize=_,y}var jA={CreateDashedLines:bu,CreateLineSystem:ks,CreateLines:Ar},kt=!1;function tv(){if(kt)return;kt=!0,M.CreateLineSystem=Jx,M.CreateDashedLines=ev,p.CreateLines=(t,s,i=null,r=!1,o=null)=>Ar(t,{points:s,updatable:r,instance:o},i),p.CreateDashedLines=(t,s,i,r,o,_=null,h,y)=>bu(t,{points:s,dashSize:i,gapSize:r,dashNb:o,updatable:h,instance:y},_)}tv();var Bt=0.28209479177387814;async function Te(t,s,i){return await new Promise((o,_)=>{let h=i.createCanvasImage();if(!h)throw Error("Failed to create ImageBitmap");h.onload=()=>{try{let b=i.createCanvas(h.width,h.height);if(!b)throw Error("Failed to create canvas");let w=b.getContext("2d");if(!w)throw Error("Failed to get 2D context");w.drawImage(h,0,0);let v=w.getImageData(0,0,b.width,b.height);o({bits:new Uint8Array(v.data.buffer),width:v.width,height:v.height})}catch(b){_(`Error loading image ${h.src} with exception: ${b}`)}},h.onerror=(b)=>{_(`Error loading image ${h.src} with exception: ${b}`)},h.crossOrigin="anonymous";let y;if(typeof t==="string"){if(!s)throw Error("filename is required when using a URL");h.src=t+s}else{let b=new Blob([t],{type:"image/webp"});y=URL.createObjectURL(b),h.src=y}})}async function xs(t,s,i){let r=t.count?t.count:t.means.shape[0],o=32,_=new ArrayBuffer(32*r),h=new Float32Array(_),y=new Float32Array(_),b=new Uint8ClampedArray(_),w=new Uint8ClampedArray(_),v=(R)=>Math.sign(R)*(Math.exp(Math.abs(R))-1),D=s[0].bits,T=s[1].bits;if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");for(let R=0;R<r;R++){let q=R*4;for(let C=0;C<3;C++){let z=t.means.mins[C],U=t.means.maxs[C],A=T[q+C],V=D[q+C],N=A<<8|V,Y=sr.Lerp(z,U,N/65535);h[R*8+C]=v(Y)}}let P=s[2].bits;if(t.version===2){if(!t.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let R=0;R<r;R++){let q=R*4;for(let C=0;C<3;C++){let z=t.scales.codebook[P[q+C]],U=Math.exp(z);y[R*8+3+C]=U}}}else{if(!Array.isArray(t.scales.mins)||!Array.isArray(t.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let R=0;R<r;R++){let q=R*4;for(let C=0;C<3;C++){let z=P[q+C],U=sr.Lerp(t.scales.mins[C],t.scales.maxs[C],z/255),A=Math.exp(U);y[R*8+3+C]=A}}}let k=s[4].bits;if(t.version===2){if(!t.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let R=0;R<r;R++){let q=R*4;for(let C=0;C<3;C++){let z=0.5+t.sh0.codebook[k[q+C]]*Bt;b[R*32+24+C]=Math.max(0,Math.min(255,Math.round(255*z)))}b[R*32+24+3]=k[q+3]}}else{if(!Array.isArray(t.sh0.mins)||!Array.isArray(t.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let R=0;R<r;R++){let q=R*4;for(let C=0;C<4;C++){let z=t.sh0.mins[C],U=t.sh0.maxs[C],A=k[q+C],V=sr.Lerp(z,U,A/255),N;if(C<3)N=0.5+V*Bt;else N=1/(1+Math.exp(-V));b[R*32+24+C]=Math.max(0,Math.min(255,Math.round(255*N)))}}}let W=(R)=>(R/255-0.5)*2/Math.SQRT2,O=s[3].bits;for(let R=0;R<r;R++){let q=O[R*4+0],C=O[R*4+1],z=O[R*4+2],U=O[R*4+3],A=W(q),V=W(C),N=W(z),Y=U-252,te=A*A+V*V+N*N,H=Math.sqrt(Math.max(0,1-te)),j;switch(Y){case 0:j=[H,A,V,N];break;case 1:j=[A,H,V,N];break;case 2:j=[A,V,H,N];break;case 3:j=[A,V,N,H];break;default:throw Error("Invalid quaternion mode")}w[R*32+28+0]=j[0]*127.5+127.5,w[R*32+28+1]=j[1]*127.5+127.5,w[R*32+28+2]=j[2]*127.5+127.5,w[R*32+28+3]=j[3]*127.5+127.5}if(t.shN){let R=t.shN.bands?(t.shN.bands+1)**2-1:t.shN.shape[1]/3,q=t.shN.bands!==void 0&&t.shN.bands!==null?t.shN.bands:Math.round(Math.sqrt(R+1)-1),C=s[5].bits,z=s[6].bits,U=s[5].width,A=R*3,V=Math.ceil(A/16),Y=i.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/Y),H=Qs(V,te*Y*4*4);if(t.version===2){if(!t.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let j=0;j<r;j++){let ie=z[j*4+0]+(z[j*4+1]<<8),X=ie%64*R,J=Math.floor(ie/64);for(let ne=0;ne<R;ne++)for(let se=0;se<3;se++){let le=ne*3+se,oe=Math.floor(le/16),Z=H[oe],he=le%16,me=j*16,ge=t.shN.codebook[C[(X+ne)*4+se+J*U*4]]*127.5+127.5;Z[he+me]=Math.max(0,Math.min(255,ge))}}}else for(let j=0;j<r;j++){let ie=z[j*4+0]+(z[j*4+1]<<8),X=ie%64*R,J=Math.floor(ie/64),ne=t.shN.mins,se=t.shN.maxs;for(let le=0;le<3;le++)for(let oe=0;oe<R/3;oe++){let Z=oe*3+le,he=Math.floor(Z/16),me=H[he],ge=Z%16,pe=j*16,re=sr.Lerp(ne,se,C[(X+oe)*4+le+J*U*4]/255)*127.5+127.5;me[ge+pe]=Math.max(0,Math.min(255,re))}}return await new Promise((j)=>{j({mode:0,data:_,hasVertexColors:!1,sh:H,shDegree:q})})}return await new Promise((R)=>{R({mode:0,data:_,hasVertexColors:!1})})}async function It(t,s,i){let r,o;if(t instanceof Map){o=t;let y=o.get("meta.json");if(!y)throw Error("meta.json not found in files Map");r=JSON.parse(new TextDecoder().decode(y))}else r=t;let _=[...r.means.files,...r.scales.files,...r.quats.files,...r.sh0.files];if(r.shN)_.push(...r.shN.files);let h=await Promise.all(_.map(async(y)=>{if(o&&o.has(y)){let b=o.get(y);return await Te(b,y,i.getEngine())}else return await Te(s,y,i.getEngine())}));return await xs(r,h,i)}function ys(t,s,i,r){let o=new fe(s,i,r,g.TEXTUREFORMAT_RGBA,t,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_UNSIGNED_BYTE);return o.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,o.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE,o}function Qe(t,s){return ys(t,s.bits,s.width,s.height)}async function Ye(t,s,i){let r=i.getEngine();if(typeof createImageBitmap==="function")try{let _=s.toLowerCase().endsWith(".png")?"image/png":"image/webp",h;if(typeof t==="string"){let b=await x.LoadFileAsync(t+s,!0);h=new Blob([b],{type:_})}else h=new Blob([t],{type:_});let y=await createImageBitmap(h,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let b=new fe(null,y.width,y.height,g.TEXTUREFORMAT_RGBA,i,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_UNSIGNED_BYTE);b.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,b.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE;let w=b.getInternalTexture();if(w)r.updateDynamicTexture(w,y,!1,!1);return b}finally{y.close()}}catch{}let o=await Te(t,s,r);return Qe(i,o)}function Ss(t,s,i,r){let o=(h)=>Math.sign(h)*(Math.exp(Math.abs(h))-1);if(!Array.isArray(t.means.mins)||!Array.isArray(t.means.maxs))throw Error("Missing arrays in SOG data.");let _=new Float32Array(r*4);for(let h=0;h<r;h++){let y=h*4;for(let b=0;b<3;b++){let w=i[y+b]<<8|s[y+b],v=sr.Lerp(t.means.mins[b],t.means.maxs[b],w/65535);_[h*4+b]=o(v)}_[h*4+3]=1}return _}async function Le(t,s,i,r=!0,o,_){let h,y;if(t instanceof Map){y=t;let X=y.get("meta.json");if(!X)throw Error("meta.json not found in files Map");h=JSON.parse(new TextDecoder().decode(X))}else h=t;let b=async(X)=>{if(y&&y.has(X))return await Te(y.get(X),X,i.getEngine());if(o){let J=new Uint8Array(await o.loadFileAsync(s+X,_));return await Te(J,X,i.getEngine())}return await Te(s,X,i.getEngine())},w=async(X)=>{if(y&&y.has(X))return await Ye(y.get(X),X,i);if(o){let J=new Uint8Array(await o.loadFileAsync(s+X,_));return await Ye(J,X,i)}return await Ye(s,X,i)},v=[...h.scales.files,...h.quats.files,...h.sh0.files,...h.shN?.files??[]],D,T,P,k,W=null,O;if(r){let[X,J]=await Promise.all([Promise.all(h.means.files.map(b)),Promise.all(v.map(w))]);W=[X[0],X[1]],O=J,D=Qe(i,X[0]),T=Qe(i,X[1]),P=X[0].width,k=X[0].height}else{let[X,J]=await Promise.all([Promise.all(h.means.files.map(w)),Promise.all(v.map(w))]);O=J,D=X[0],T=X[1];let ne=D.getSize();P=ne.width,k=ne.height}let R=h.count??h.means.shape[0],q=P*k;if(q<R)throw Error(`SOG texture contains ${q} texels, but metadata references ${R} splats.`);let C=O[0],z=O[1],U=O[2],A,V,N=0,Y=0;if(h.shN&&O.length>=5)A=O[3],V=O[4],N=h.shN.bands?(h.shN.bands+1)**2-1:h.shN.shape[1]/3,Y=h.shN.bands??Math.round(Math.sqrt(N+1)-1);let te;if(h.version===2){let J=new Float32Array(768);if(h.scales.codebook)J.set(h.scales.codebook.slice(0,256),0);if(h.sh0.codebook)J.set(h.sh0.codebook.slice(0,256),256);if(h.shN?.codebook)J.set(h.shN.codebook.slice(0,256),512);te=new fe(J,768,1,g.TEXTUREFORMAT_R,i,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_FLOAT),te.wrapU=g.TEXTURE_CLAMP_ADDRESSMODE,te.wrapV=g.TEXTURE_CLAMP_ADDRESSMODE}let H=h.means.mins,j=h.means.maxs,ie={version:h.version===2?2:1,splatCount:R,shDegree:Y,meansTextureL:D,meansTextureU:T,scalesTexture:C,quatsTexture:z,sh0Texture:U,shCentroidsTexture:A,shLabelsTexture:V,codebookTexture:te,meansMin:[H[0],H[1],H[2]],meansMax:[j[0],j[1],j[2]],scalesMin:Array.isArray(h.scales.mins)?[h.scales.mins[0],h.scales.mins[1],h.scales.mins[2]]:void 0,scalesMax:Array.isArray(h.scales.maxs)?[h.scales.maxs[0],h.scales.maxs[1],h.scales.maxs[2]]:void 0,sh0Min:Array.isArray(h.sh0.mins)?[h.sh0.mins[0],h.sh0.mins[1],h.sh0.mins[2],h.sh0.mins[3]]:void 0,sh0Max:Array.isArray(h.sh0.maxs)?[h.sh0.maxs[0],h.sh0.maxs[1],h.sh0.maxs[2],h.sh0.maxs[3]]:void 0,shnMin:typeof h.shN?.mins==="number"?h.shN.mins:void 0,shnMax:typeof h.shN?.maxs==="number"?h.shN.maxs:void 0,shCoeffCount:N,positions:W?Ss(h,W[0].bits,W[1].bits,R):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:Y,sogTextures:ie}}od();var Se=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Et=`precision highp float;
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
`,Me=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,Ot=`
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
`,Wt="gsSogRotDecodeToWorkBuffer",Vt=`precision highp float;
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
`,Ut=`
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
`;class Ee{get supportsAsyncCentersReadback(){let t=this._scene.getEngine();if(t.isWebGPU)return!0;let s=t;return!!s._gl&&typeof s._readPixelsAsync==="function"&&(s.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((t)=>t.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(t,s,i,r,o){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=t,this._shaderLanguage=t.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,s),i)this._mrt=i.mrt,this._textureSize=i.width,this._baseOffset=i.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,s)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(r&&r.textureCount>0){if(r.externalMrts)this._shMrts=r.externalMrts.slice(0,r.textureCount),this._ownsShMrts=!1;else{for(let _=0;_<r.textureCount;_++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${_}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(o){if(o.externalMrt)this._rotMrt=o.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(t){if(!this._ownsMrt)this._mrt=t}rebindShAtlas(t){if(!this._ownsShMrts&&t&&this._shMrts.length)this._shMrts=t.slice(0,this._shMrts.length)}rebindRotAtlas(t){if(!this._ownsRotMrt&&t&&this._rotMrt)this._rotMrt=t}setBaseOffset(t){if(!this._ownsMrt)this._baseOffset=t}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){l.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,t,s);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,t,t,0,-i),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((r,o)=>this._createShMrt(`gsShAtlasBackup${o}`,!1,t,s));for(let r=0;r<this._shMrts.length;r++)this._renderShCopyPass(this._backupShMrts[r],this._shMrts[r].textures[0],this._mrt.textures[0],0,t,t,0,-i)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,t,s);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,t,t,0,-i)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let t=this._textureSize,s=Math.max(1,Math.floor(this._capacity/t)),i=Math.floor(this._baseOffset/t),r=this._scene.getEngine();r.enableScissor(0,i,t,s);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,t,t,0,i),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let o=0;o<this._shMrts.length&&o<this._backupShMrts.length;o++)this._renderShCopyPass(this._shMrts[o],this._backupShMrts[o].textures[0],this._mrt.textures[0],0,t,t,0,i);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,t,t,0,i)}finally{r.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let o of this._backupShMrts)o.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?g.TEXTURETYPE_HALF_FLOAT:g.TEXTURETYPE_FLOAT,_=new lr(t,{width:i,height:r},4,this._scene,{types:[g.TEXTURETYPE_FLOAT,o,o,g.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE],formats:[g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}Centers`,`${t}CovA`,`${t}CovB`,`${t}Colors`]);if(_.clearColor=new S(0,0,0,0),_.renderList=[],s)_.onClearObservable.add(()=>{});return _}_createShMrt(t,s,i=this._textureSize,r=this._textureSize){let o=new lr(t,{width:i,height:r},1,this._scene,{types:[g.TEXTURETYPE_UNSIGNED_INTEGER],formats:[g.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[t]);if(o.clearColor=new S(0,0,0,0),o.renderList=[],s)o.onClearObservable.add(()=>{});return o}_createRotMrt(t,s,i=this._textureSize,r=this._textureSize){let o=this._scene.getEngine()._caps.textureHalfFloatRender?g.TEXTURETYPE_HALF_FLOAT:g.TEXTURETYPE_FLOAT,_=new lr(t,{width:i,height:r},3,this._scene,{types:[o,o,o],formats:[g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA,g.TEXTUREFORMAT_RGBA],samplingModes:[g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${t}A`,`${t}B`,`${t}Scale`]);if(_.clearColor=new S(0,0,0,0),_.renderList=[],s)_.onClearObservable.add(()=>{});return _}async decodeAsync(t,s){if(this._disposed)return;this._applyPack(t);let i=this._shMaterial!==null&&this._shMrts.length>0;if(i)this._applyShPack(t);let r=this._rotMaterial!==null&&this._rotMrt!==null;if(r)this._applyRotPack(t);await new Promise((o)=>{let _=()=>{if(this._disposed){o();return}if(!this._material.isReady(this._quad)||i&&!this._shMaterial.isReady(this._quad)||r&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(_);return}let h=this._textureSize,y=this._baseOffset+s;if(this._material.setInt("uOffset",y),i)this._shMaterial.setInt("uOffset",y);if(r)this._rotMaterial.setInt("uOffset",y);let b=Math.floor(y/h),w=Math.max(1,Math.ceil((y+t.splatCount)/h)-b),v=this._scene.getEngine();v.enableScissor(0,b,h,w);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),i){for(let D=0;D<this._shMrts.length;D++)this._shMaterial.setInt("uShTextureIndex",D),this._quad.material=this._shMaterial,this._shMrts[D].renderList=[this._quad],this._shMrts[D].render();this._quad.material=this._material}if(r)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{v.disableScissor()}o()};this._scene.onBeforeRenderObservable.addOnce(_)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let t=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),s=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&t&&s}_bindCopyMaterialsToAtlas(){let t=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",t[0]),this._copyMaterial.setTexture("uSrc0",t[0]),this._copyMaterial.setTexture("uSrc1",t[1]),this._copyMaterial.setTexture("uSrc2",t[2]),this._copyMaterial.setTexture("uSrc3",t[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",t[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let s=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",t[0]),this._rotCopyMaterial.setTexture("uSrc0",s[0]),this._rotCopyMaterial.setTexture("uSrc1",s[1]),this._rotCopyMaterial.setTexture("uSrc2",s[2])}}relayoutSync(t){if(this._disposed||!this._copyMaterial)return;let s=this._textureSize,i=s,r=this._ownsMrt?s:Math.max(1,Math.floor(this._capacity/s));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(i*r);let o=this._relayoutMapData;if(o.fill(-1),o.set(t.subarray(0,Math.min(t.length,o.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new fe(o,i,r,g.TEXTUREFORMAT_R,this._scene,!1,!1,g.TEXTURE_NEAREST_SAMPLINGMODE,g.TEXTURETYPE_FLOAT);else this._relayoutMapTexture.update(o);let _=this._relayoutMapTexture;if(this._ownsMrt){let T=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(T,this._mrt.textures,_,1),this._renderRelayoutPass(this._mrt,T.textures,_,0)}finally{T.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let P=0;P<this._shMrts.length;P++){let k=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(k,this._shMrts[P].textures[0],_,1),this._renderShCopyPass(this._shMrts[P],k.textures[0],_,0)}finally{k.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let P=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(P,this._rotMrt.textures,_,1),this._renderRotCopyPass(this._rotMrt,P.textures,_,0)}finally{P.dispose()}}this._quad.material=this._material;return}let h=Math.floor(this._baseOffset/s),y=r,b=this._scene.getEngine(),w=this._createMrt("gsRelayoutTemp",!1,s,y),v=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((T,P)=>this._createShMrt(`gsShRelayoutTemp${P}`,!1,s,y)):[],D=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,s,y):null;try{this._renderRelayoutPass(w,this._mrt.textures,_,1,s,s,this._baseOffset,0);for(let T=0;T<v.length;T++)this._renderShCopyPass(v[T],this._shMrts[T].textures[0],_,1,s,s,this._baseOffset,0);if(D)this._renderRotCopyPass(D,this._rotMrt.textures,_,1,s,s,this._baseOffset,0);b.enableScissor(0,h,s,y);try{this._renderRelayoutPass(this._mrt,w.textures,_,0,s,s,0,h);for(let T=0;T<v.length;T++)this._renderShCopyPass(this._shMrts[T],v[T].textures[0],_,0,s,s,0,h);if(D)this._renderRotCopyPass(this._rotMrt,D.textures,_,0,s,s,0,h)}finally{b.disableScissor()}}finally{w.dispose();for(let T of v)T.dispose();D?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(t,s,i,r,o=this._textureSize,_=this._textureSize,h=0,y=0){let b=this._copyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrc0",s[0]),b.setTexture("uSrc1",s[1]),b.setTexture("uSrc2",s[2]),b.setTexture("uSrc3",s[3]),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",_),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",h),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createCopyMaterial(){let t=this._shaderLanguage===1,s=new Ae(Ht,this._scene,{vertexSource:t?Me:Se,fragmentSource:t?ss:Zt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderShCopyPass(t,s,i,r,o=this._textureSize,_=this._textureSize,h=0,y=0){let b=this._shCopyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrcSh",s),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",_),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",h),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createShCopyMaterial(){let t=this._shaderLanguage===1,s=new Ae(jt,this._scene,{vertexSource:t?Me:Se,fragmentSource:t?Qt:Yt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_renderRotCopyPass(t,s,i,r,o=this._textureSize,_=this._textureSize,h=0,y=0){let b=this._rotCopyMaterial;b.setTexture("uMapTex",i),b.setTexture("uSrc0",s[0]),b.setTexture("uSrc1",s[1]),b.setTexture("uSrc2",s[2]),b.setInt("uDstWidth",o),b.setInt("uSrcWidth",_),b.setInt("uUseMap",r),b.setInt("uSrcBaseOffset",h),b.setInt("uDstBaseRow",y),this._quad.material=b,t.renderList=[this._quad],t.render()}_createRotCopyMaterial(){let t=this._shaderLanguage===1,s=new Ae($t,this._scene,{vertexSource:t?Me:Se,fragmentSource:t?ts:Jt},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}async readCentersRangeAsync(t,s){if(this._disposed||s<=0||!this.supportsAsyncCentersReadback)return null;let i=this._textureSize,r=this._baseOffset+t,o=Math.floor(r/i),h=Math.ceil((r+s)/i)-o,y=(r-o*i)*4,b=y+s*4,w=this._mrt.textures[0],v=this._scene.getEngine();if(v.isWebGPU){let R=await w.readPixels(0,0,null,!0,!0,0,o,i,h);if(this._disposed||!R)return null;let q=R instanceof Float32Array?R:new Float32Array(R.buffer,R.byteOffset,R.byteLength/4);return q.length>=b?q.subarray(y,b):null}let D=v,T=D._gl,P=w.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!P)return null;let k=new Float32Array(i*h*4);if(!this._readFbo)this._readFbo=T.createFramebuffer();let W=D._currentFramebuffer;T.bindFramebuffer(T.FRAMEBUFFER,this._readFbo),T.framebufferTexture2D(T.FRAMEBUFFER,T.COLOR_ATTACHMENT0,T.TEXTURE_2D,P,0),T.readBuffer(T.COLOR_ATTACHMENT0);let O=D._readPixelsAsync(0,o,i,h,T.RGBA,T.FLOAT,k);if(T.bindFramebuffer(T.FRAMEBUFFER,W),!W)T.readBuffer(T.BACK);if(!O)return null;if(await O,this._disposed||k.length<b)return null;return k.subarray(y,b)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let t of this._backupShMrts)t.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let t of this._shMrts)t.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let t=new p("gsWorkBufferQuad",this._scene),s=new M;return s.positions=[-1,-1,0,3,-1,0,-1,3,0],s.indices=[0,1,2],s.applyToMesh(t),this._scene.removeMesh(t),t}_createMaterial(){let t=this._shaderLanguage===1,s=new Ae("gsSogDecode",this._scene,{vertexSource:t?Me:Se,fragmentSource:t?Ot:Et},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyPack(t){let s=this._material,i=t.meansTextureL.getSize().width;s.setTexture("sogMeansLTex",t.meansTextureL),s.setTexture("sogMeansUTex",t.meansTextureU),s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogSh0Tex",t.sh0Texture),s.setTexture("sogCodebookTex",t.codebookTexture??t.sh0Texture),s.setVector3("sogMeansMin",new e(t.meansMin[0],t.meansMin[1],t.meansMin[2])),s.setVector3("sogMeansMax",new e(t.meansMax[0],t.meansMax[1],t.meansMax[2]));let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2]));let _=t.sh0Min??[0,0,0,0],h=t.sh0Max??[0,0,0,0];s.setVector4("sogSh0Min",new I(_[0],_[1],_[2],_[3])),s.setVector4("sogSh0Max",new I(h[0],h[1],h[2],h[3])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}_createShMaterial(){let t=this._shaderLanguage===1,s=new Ae(Gt,this._scene,{vertexSource:t?Me:Se,fragmentSource:t?Xt:Nt},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyShPack(t){let s=this._shMaterial,i=!!t.shLabelsTexture&&!!t.shCentroidsTexture,r=t.shLabelsTexture??t.sh0Texture,o=t.shCentroidsTexture??t.sh0Texture;s.setTexture("sogShLabelsTex",r),s.setTexture("sogShCentroidsTex",o),s.setTexture("sogCodebookTex",t.codebookTexture??r),s.setFloat("sogShnMin",t.shnMin??0),s.setFloat("sogShnMax",t.shnMax??0),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",r.getSize().width),s.setInt("uCoeffs",i?t.shCoeffCount:0)}_createRotMaterial(){let t=this._shaderLanguage===1,s=new Ae(Wt,this._scene,{vertexSource:t?Me:Se,fragmentSource:t?Ut:Vt},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return s.backFaceCulling=!1,s.disableDepthWrite=!0,s}_applyRotPack(t){let s=this._rotMaterial,i=t.scalesTexture.getSize().width;s.setTexture("sogScalesTex",t.scalesTexture),s.setTexture("sogQuatsTex",t.quatsTexture),s.setTexture("sogCodebookTex",t.codebookTexture??t.scalesTexture);let r=t.scalesMin??[0,0,0],o=t.scalesMax??[0,0,0];s.setVector3("sogScalesMin",new e(r[0],r[1],r[2])),s.setVector3("sogScalesMax",new e(o[0],o[1],o[2])),s.setInt("uVersion",t.version),s.setInt("uCount",t.splatCount),s.setInt("uDestWidth",this._textureSize),s.setInt("uSrcWidth",i)}}class $e{constructor(t){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,t?.maxConcurrent??2),this.maxRetries=Math.max(0,t?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(t,s){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let i=this._pending.get(t);if(i)return await i.promise;let r={url:t,groupId:s,settled:!1,cancelled:!1,started:!1,slotReleased:!1};if(r.promise=new Promise((o,_)=>{r.resolve=o,r.reject=_}),this._pending.set(t,r),s!==void 0){let o=this._groups.get(s);if(!o)o=new Set,this._groups.set(s,o);o.add(t)}return this._queue.push(r),this._pump(),await r.promise}cancel(t){let s=this._pending.get(t);if(!s)return;this._abort(s,Error(`GaussianSplattingDownloadManager: download cancelled (${t}).`))}cancelGroup(t){let s=this._groups.get(t);if(!s)return;for(let i of Array.from(s))this.cancel(i);this._groups.delete(t)}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let t of Array.from(this._pending.values()))this._abort(t,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(t,s){if(t.settled)return;t.cancelled=!0;let i=this._queue.indexOf(t);if(i!==-1)this._queue.splice(i,1);if(t.request?.abort(),t.cancelAttempt?.(s),this._settle(t,()=>t.reject(s)),t.started)this._releaseSlot(t)}_settle(t,s){if(t.settled)return;if(t.settled=!0,this._pending.delete(t.url),t.groupId!==void 0){let i=this._groups.get(t.groupId);if(i){if(i.delete(t.url),i.size===0)this._groups.delete(t.groupId)}}s()}_releaseSlot(t){if(t.slotReleased)return;t.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let t=this._queue.shift();if(t.settled)continue;t.started=!0,this._activeCount++,this._runTaskAsync(t).finally(()=>{this._releaseSlot(t)})}}async _runTaskAsync(t){let s;for(let i=0;i<=this.maxRetries;i++){if(this._disposed||t.cancelled)return;try{let r=await this._downloadAttemptAsync(t);this._settle(t,()=>t.resolve(r));return}catch(r){if(t.cancelAttempt=void 0,this._disposed||t.cancelled)return;s=r}}this._settle(t,()=>t.reject(s))}async _downloadAttemptAsync(t){return await new Promise((s,i)=>{t.cancelAttempt=i,t.request=x.LoadFile(t.url,(r)=>s(r),void 0,void 0,!0,(r,o)=>i(o instanceof Error?o:Error(`GaussianSplattingDownloadManager: failed to load ${t.url}.`)))})}}class is{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class Ke{constructor(t=0,s=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=s,t>0){this._capacity=t,this._freeSize=t;let i=this._obtain(0,t,!0);this._headAll=i,this._tailAll=i,this._addToBucket(i)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(t){if(t<=0)return null;let s=this._findFreeBlock(t);if(!s)return null;if(this._usedSize+=t,this._freeSize-=t,s._size===t)return s._free=!1,this._removeFromBucket(s),s;let i=this._obtain(s._offset,t,!1);return s._offset+=t,s._size-=t,this._rebucket(s),this._insertAfterInMainList(i,s._prev),i}free(t){if(!t||t._free)return;t._free=!0,this._usedSize-=t._size,this._freeSize+=t._size;let{_prev:s,_next:i}=t,r=s&&s._free,o=i&&i._free;if(r&&o)s._size+=t._size+i._size,this._removeFromMainList(t),this._removeFromMainList(i),this._removeFromBucket(i),this._release(t),this._release(i),this._rebucket(s);else if(r)s._size+=t._size,this._removeFromMainList(t),this._release(t),this._rebucket(s);else if(o)t._size+=i._size,this._removeFromMainList(i),this._removeFromBucket(i),this._release(i),this._addToBucket(t);else this._addToBucket(t)}grow(t){if(t<=this._capacity)return;let s=t-this._capacity;if(this._capacity=t,this._freeSize+=s,this._tailAll&&this._tailAll._free)this._tailAll._size+=s,this._rebucket(this._tailAll);else{let i=this._obtain(this._capacity-s,s,!0);this._insertAfterInMainList(i,this._tailAll),this._addToBucket(i)}}defrag(t=0,s=new Set){if(s.clear(),this._freeRegionCount===0)return s;if(t===0)this._defragFull(s);else this._defragIncremental(t,s);return s}updateAllocation(t,s){for(let i=0;i<t.length;i++)this.free(t[i]);for(let i=0;i<s.length;i++){let r=s[i],o=this.allocate(r);if(o)s[i]=o;else{let _=r;for(let b=i+1;b<s.length;b++)_+=s[b];let h=this._usedSize+_,y=Math.ceil(h*this._growMultiplier);if(y>this._capacity)this.grow(y);this.defrag(0);for(let b=i;b<s.length;b++)s[b]=this.allocate(s[b]);return!0}}return!1}_bucketFor(t){return 31-Math.clz32(t)}_addToBucket(t){let s=this._bucketFor(t._size);t._bucket=s;while(s>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(t._prevFree=null,t._nextFree=this._freeBucketHeads[s],this._freeBucketHeads[s])this._freeBucketHeads[s]._prevFree=t;this._freeBucketHeads[s]=t,this._freeRegionCount++}_removeFromBucket(t){let s=t._bucket;if(t._prevFree)t._prevFree._nextFree=t._nextFree;else this._freeBucketHeads[s]=t._nextFree;if(t._nextFree)t._nextFree._prevFree=t._prevFree;t._prevFree=null,t._nextFree=null,t._bucket=-1,this._freeRegionCount--}_rebucket(t){if(this._bucketFor(t._size)!==t._bucket)this._removeFromBucket(t),this._addToBucket(t)}_obtain(t,s,i){let r=this._pool.length>0?this._pool.pop():new is;return r._offset=t,r._size=s,r._free=i,r._prev=null,r._next=null,r._prevFree=null,r._nextFree=null,r._bucket=-1,r}_release(t){t._prev=null,t._next=null,t._prevFree=null,t._nextFree=null,t._bucket=-1,this._pool.push(t)}_insertAfterInMainList(t,s){if(s===null){if(t._prev=null,t._next=this._headAll,this._headAll)this._headAll._prev=t;if(this._headAll=t,!this._tailAll)this._tailAll=t}else{if(t._prev=s,t._next=s._next,s._next)s._next._prev=t;if(s._next=t,this._tailAll===s)this._tailAll=t}}_removeFromMainList(t){if(t._prev)t._prev._next=t._next;else this._headAll=t._next;if(t._next)t._next._prev=t._prev;else this._tailAll=t._prev;t._prev=null,t._next=null}_findFreeBlock(t){let s=this._bucketFor(t),i=this._freeBucketHeads.length;if(s<i){let r=null,o=this._freeBucketHeads[s];while(o){if(o._size>=t){if(!r||o._size<r._size){if(r=o,o._size===t)break}}o=o._nextFree}if(r)return r}for(let r=s+1;r<i;r++)if(this._freeBucketHeads[r])return this._freeBucketHeads[r];return null}_defragFull(t){for(let o=0;o<this._freeBucketHeads.length;o++){let _=this._freeBucketHeads[o];while(_){let h=_._nextFree;this._removeFromMainList(_),_._prevFree=null,_._nextFree=null,_._bucket=-1,this._pool.push(_),_=h}this._freeBucketHeads[o]=null}this._freeRegionCount=0;let s=0,i=this._headAll;while(i){if(i._offset!==s)i._offset=s,t.add(i);s+=i._size,i=i._next}let r=this._capacity-s;if(r>0){let o=this._obtain(s,r,!0);this._insertAfterInMainList(o,this._tailAll),this._addToBucket(o)}}_defragIncremental(t,s){let i=Math.ceil(t/2),r=t-i;for(let _=0;_<i;_++){let h=this._tailAll;while(h&&h._free)h=h._prev;if(!h)break;let y=this._findFreeBlock(h._size);if(!y||y._offset>=h._offset)break;this._moveBlock(h,y),s.add(h)}let o=this._headAll;for(let _=0;_<r&&o;){let h=o._next;if(o._free&&h&&!h._free){let y=h,b=o;y._offset=b._offset,b._offset=y._offset+y._size;let w=b._prev,v=y._next;if(y._prev=w,y._next=b,b._prev=y,b._next=v,w)w._next=y;else this._headAll=y;if(v)v._prev=b;else this._tailAll=b;if(b._next&&b._next._free){let D=b._next;b._size+=D._size,this._removeFromMainList(D),this._removeFromBucket(D),this._release(D),this._rebucket(b)}s.add(y),_++,o=b._next}else o=h}}_moveBlock(t,s){let i=t._size,r=s._offset,o=t._prev;this._removeFromMainList(t);let _=this._obtain(t._offset,i,!0);if(this._insertAfterInMainList(_,o),this._addToBucket(_),_._next&&_._next._free){let h=_._next;_._size+=h._size,this._removeFromMainList(h),this._removeFromBucket(h),this._release(h),this._rebucket(_)}if(_._prev&&_._prev._free){let h=_._prev;h._size+=_._size,this._removeFromMainList(_),this._removeFromBucket(_),this._release(_),this._rebucket(h)}if(t._offset=r,s._size===i){let h=s._prev;this._removeFromMainList(s),this._removeFromBucket(s),this._release(s),this._insertAfterInMainList(t,h)}else s._offset+=i,s._size-=i,this._rebucket(s),this._insertAfterInMainList(t,s._prev)}}class Je{constructor(t,s,i){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new Ke(t),this._cooldownFrames=Math.max(0,s),this._onEvict=i}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(t){return this._blocks.has(t)}offset(t){return this._blocks.get(t)?.offset}allocate(t,s){let i=this._blocks.get(t);if(i)return i.offset;let r=this._allocator.allocate(s);if(!r){if(this._evictAllCooled(),r=this._allocator.allocate(s),!r)return null}return this._blocks.set(t,r),r.offset}pin(t,s){let i=this.allocate(t,s);if(i!==null)this._pinned.add(t);return i}free(t){if(this._pinned.has(t))return;let s=this._blocks.get(t);if(!s)return;this._allocator.free(s),this._blocks.delete(t),this._cooldown.delete(t)}compact(){let t=new Map;for(let[i,r]of Array.from(this._blocks))t.set(i,r.offset);this._allocator.defrag(0);let s=[];for(let[i,r]of Array.from(this._blocks)){let o=t.get(i);if(o!==r.offset)s.push({file:i,oldOffset:o,newOffset:r.offset,count:r.size})}return s}getResidentBlocks(){let t=[];for(let[s,i]of Array.from(this._blocks))t.push({file:s,offset:i.offset,count:i.size});return t}scheduleEviction(t){if(this._pinned.has(t)||!this._blocks.has(t))return;this._cooldown.set(t,this._cooldownFrames)}cancelEviction(t){this._cooldown.delete(t)}tick(){if(this._cooldown.size===0)return[];let t=[];for(let[s,i]of Array.from(this._cooldown))if(i<=1)t.push(s);else this._cooldown.set(s,i-1);for(let s of t)this._evict(s);return t}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let t=Array.from(this._cooldown.keys());for(let s of t)this._evict(s)}_evict(t){let s=this._blocks.get(t);if(s)this._allocator.free(s),this._blocks.delete(t);this._cooldown.delete(t),this._onEvict(t)}}var Ms=Math.tan(22.5*Math.PI/180),bs=-2,rs=-1,vs=84,et=new c,ws=new e,Rs=new e,os=new e,Ts=new e(0,0,1),as=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],ns=as.length*2,Oe=[new S(1,0.2,0.2,1),new S(1,0.6,0.1,1),new S(1,1,0.2,1),new S(0.3,1,0.3,1),new S(0.2,1,1,1),new S(0.4,0.5,1,1),new S(0.9,0.4,1,1),new S(1,1,1,1)];class xe extends es{static IsLODMetadata(t){if(typeof t!=="object"||t===null)return!1;let s=t;return typeof s.lodLevels==="number"&&Array.isArray(s.filenames)&&typeof s.tree==="object"&&s.tree!==null}constructor(t,s,i,r,o={}){super(t,null,r,!1);this._leafNodes=[],this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._frustumCulling=!0,this._frustumPlanes=[new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0),new Kt(0,0,0,0)],this._cullViewProj=new c,this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPos=new e(1/0,1/0,1/0),this._forceLodUpdate=!1,this._boundsMin=new e(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new e(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=s,this._rootUrl=i,this._streamOptions=o,this._hostCompound=o.hostCompound??null,this._decodeSh=o.decodeSh??!0,this._needsRotationScale=o.needsRotationScale??!1;let _=Math.max(0,s.lodLevels-1);if(this._lodRangeMax=_,o.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,o.lodBaseDistance);if(o.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,o.lodMultiplier);if(o.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,o.lodBehindPenalty);if(o.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(o.lodRangeMin,_));if(o.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(o.lodRangeMax,_));if(o.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,o.maxDecodesPerFrame);if(o.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,o.lodCooldownFrames);if(o.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,o.lodUpdateInterval);if(o.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,o.lodUpdateDistance);if(o.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(o.maxDetailLod));if(o.frustumCulling!==void 0)this._frustumCulling=o.frustumCulling;if(o.debugLodSource)this._debugLodSource=o.debugLodSource;if(o.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(o.evictionCooldownFrames));if(o.maxResidentSplats!==void 0&&o.maxResidentSplats>0)this._maxResidentSplats=Math.floor(o.maxResidentSplats);if(o.memoryBudgetMb!==void 0&&o.memoryBudgetMb>0)this._memoryBudgetMb=o.memoryBudgetMb;if(this._downloadManager=new $e({maxConcurrent:o.maxConcurrentDownloads,maxRetries:o.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((y,b)=>{this._partReadyResolve=y,this._partReadyReject=b}),this._partReadyPromise.catch(()=>{});let h=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(h)}if(this._collectLodEntries(s.tree),o.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let h=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!h&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(h)=>{if(l.Error("GaussianSplattingStream: streaming failed: "+(h?.message??h)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(h?.message??h)),this._hostCompound&&!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(t=!1){if(this._hostCompound)return!0;return super.isReady(t)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(t){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(t))}async whenSettledAsync(t=3){if(this._disposed)return;this._forceLodUpdate=!0;let s=Math.max(1,t),i=this._scene,r=0,o=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++r>=s;return r=0,!1};if(i.getEngine().activeRenderLoops.length>0){await new Promise((y)=>{let b=null;b=i.onAfterRenderObservable.add(()=>{if(this._disposed||o()){if(b)i.onAfterRenderObservable.remove(b),b=null;y()}})});return}let _=i.getEngine(),h=globalThis.requestAnimationFrame;while(!this._disposed){if(_.beginFrame(),i.render(),_.endFrame(),o())return;await new Promise((y)=>{if(typeof h==="function")h(()=>y());else setTimeout(y,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(t){let s=Math.max(0,Math.floor(t));if(this._maxDetailLod===s)return;this._maxDetailLod=s,this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(t){if(this._frustumCulling===t)return;this._frustumCulling=t,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(t){if(this._debugDisplay===t)return;if(this._debugDisplay=t,t)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(t){if(this._debugLodSource===t)return;if(this._debugLodSource=t,this._debugDisplay)this._refreshDebugDisplay()}dispose(t){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(t)}_disposeAndReclaim(){let t=this._hostCompound,s=!!this._host&&!this._partReleasedByHost;if(this.dispose(),s&&t&&!t.isDisposed())t.compactAtlas()}_getEffectiveWorldMatrix(t){if(this._host)return this._host.proxy.computeWorldMatrix(t);return this.computeWorldMatrix(t)}evaluateOptimalLods(t=this._scene.activeCamera){if(!t||this._leafNodes.length===0)return;let s=Math.max(0,this._metadata.lodLevels-1),i=this._lodBaseDistance,r=this._lodMultiplier,o=this._lodBehindPenalty,_=this._lodRangeMin,h=this._lodRangeMax,y=this._scene.getEngine().getAspectRatio(t)||1,b=Math.tan(t.fov*0.5);if(t.fovMode===Q.FOVMODE_HORIZONTAL_FIXED)b/=y;let w=b*y,v=Math.min(b,w)/Ms;this._getEffectiveWorldMatrix(!1).invertToRef(et);let D=e.TransformCoordinatesToRef(t.globalPosition,et,ws),{x:T,y:P,z:k}=D,W=0,O=0,R=0;if(o>1){t.getDirectionToRef(Ts,os);let q=e.TransformNormalToRef(os,et,Rs);q.normalize(),W=q.x,O=q.y,R=q.z}for(let q of this._leafNodes){let C=q.bound.min,z=q.bound.max,U=T<C[0]?C[0]:T>z[0]?z[0]:T,A=P<C[1]?C[1]:P>z[1]?z[1]:P,V=k<C[2]?C[2]:k>z[2]?z[2]:k,N=U-T,Y=A-P,te=V-k,H=Math.sqrt(N*N+Y*Y+te*te),j=H;if(o>1&&H>0.01){let J=(W*N+O*Y+R*te)/H;if(J<0)j=H*(1+-J*(o-1))}let ie=j*v,X;if(s===0||ie<i)X=0;else{X=s;while(X>1&&ie<i*Math.pow(r,X-1))X--}if(X<_)X=_;else if(X>h)X=h;if(this._frustumCulling&&q.inFrustum===!1)X=h;q.optimalLod=X}}_displayedLodLevel(t){if(this._debugLodSource==="optimal")return t.optimalLod??t.activeLod??0;return t.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let t=this._debugDisplay;if(t&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!t&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let t=[],s=[];for(let r of this._leafNodes){let o=Oe[this._displayedLodLevel(r)%Oe.length],_=r.bound.min,h=r.bound.max,y=[new e(_[0],_[1],_[2]),new e(h[0],_[1],_[2]),new e(h[0],h[1],_[2]),new e(_[0],h[1],_[2]),new e(_[0],_[1],h[2]),new e(h[0],_[1],h[2]),new e(h[0],h[1],h[2]),new e(_[0],h[1],h[2])];for(let b of as)t.push([y[b[0]],y[b[1]]]),s.push([o,o])}if(this._debugSignature=this._computeDebugSignature(),t.length===0)return;let i=ks(this.name+"_lodDebug",{lines:t,colors:s,updatable:!0,useVertexAlpha:!1},this._scene);i.parent=this,i.isPickable=!1,i.doNotSerialize=!0,i.reservedDataStore={hidden:!0},this._debugMesh=i,this._debugColorData=new Float32Array(this._leafNodes.length*ns*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let t=this._debugColorData,s=0;for(let i of this._leafNodes){let r=Oe[this._displayedLodLevel(i)%Oe.length];for(let o=0;o<ns;o++)t[s++]=r.r,t[s++]=r.g,t[s++]=r.b,t[s++]=r.a}this._debugMesh.updateVerticesData(n.ColorKind,t),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let t=0;for(let s of this._leafNodes)t=t*31+this._displayedLodLevel(s)|0;return t}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(t){if(t.children){for(let i of t.children)this._collectLodEntries(i);return}if(!t.lods)return;let s=[];for(let i of Object.keys(t.lods)){let r=Number(i),o=t.lods[i];if(Number.isFinite(r)&&o&&o.count>0)s.push(r)}if(s.length===0)return;s.sort((i,r)=>i-r),t.availableLevels=s,t.baseLod=s[s.length-1],t.activeLod=void 0,t.lodCooldown=0,t.inFrustum=!0,t.cullBounds=new ti(e.FromArray(t.bound.min),e.FromArray(t.bound.max)),this._leafNodes.push(t)}async _streamAllAsync(){let t=this._collectAllFileIds(),s=await this._gatherCountsAsync(t);if(this._disposed)return;this._resolveResidentBudget();let i=1;if(s>0)i+=s;for(let _ of t){let h=this._fileCounts.get(_);if(h!==void 0&&h>0)i+=h}if(i<=1)return;this._evictionEnabled=this._residentBudget>0&&this._residentBudget<i;let r=this._evictionEnabled?Math.max(this._residentBudget,1):i;if(this._residency=new Je(r,this._evictionCooldownFrames,(_)=>this._onFileEvicted(_)),this._residency.pin(bs,1),s>0){let _=this._residency.pin(rs,s);if(_!==null)this._environmentRange={offset:_,count:s};else l.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let _=c.Compose(new e(1,-1,1),d.RotationYawPitchRoll(0,-Math.PI/2,0),e.ZeroReadOnly),h=this._hostCompound.reserveStreamingPart(r,_,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=h,this._positionBase=h.base;let y=this._hostCompound,b=y.onPartRemovedObservable.add((T)=>{if(!this._disposed&&this._host&&T===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>y.onPartRemovedObservable.remove(b);let w=this._shTextureCount>0&&h.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:h.shMrtAtlas}:void 0,v=this._needsRotationScale&&h.rotMrtAtlas?{externalMrt:h.rotMrtAtlas}:void 0;this._workBuffer=new Ee(this._scene,h.capacity,{mrt:h.mrtAtlas,width:h.atlasWidth,baseOffset:h.base},w,v),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=h.splatPositions,this._vertexCount=r;let D=this._workBuffer;this._unsubBeforeRebuild=h.onBeforeAtlasRebuild(()=>{D.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=h.onAfterAtlasRebuild(()=>{if(h.mrtAtlas)D.rebindAtlas(h.mrtAtlas);if(D.rebindShAtlas(h.shMrtAtlas),D.rebindRotAtlas(h.rotMrtAtlas),this._positionBase=h.base,D.setBaseOffset(h.base),D.restoreRegion(),this._splatPositions=h.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),h.setActiveRanges([])}else{let _=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,h=this._needsRotationScale?{}:void 0;this._workBuffer=new Ee(this._scene,r,void 0,_,h),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let y=new Float32Array(r*4),b=this._workBuffer.textures,w=_?this._workBuffer.shTextures:void 0,v=h?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(b[0],b[1],b[2],b[3],y,r,w,this._streamShDegree,v),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;let o=new Set;for(let _ of this._leafNodes){let h=_.lods[String(_.baseLod)];if(h&&this._fileCounts.has(h.file))o.add(h.file)}for(let _ of Array.from(o)){if(this._disposed)return;await this._decodeFileAsync(_)}if(this._disposed)return;if(this._baseLayerReady=!0,!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame());this._resolvePartReady()}async _waitForCanBackupAsync(t){for(let s=0;s<600&&!this._disposed;s++){if(t.canBackup)return;await new Promise((i)=>this._scene.onBeforeRenderObservable.addOnce(()=>i()))}if(!this._disposed&&!t.canBackup)l.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(){let t=this._maxResidentSplats;if(this._memoryBudgetMb>0){let s=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48,i=vs+this._shTextureCount*16+(this._needsRotationScale?s:0),r=Math.floor(this._memoryBudgetMb*1024*1024/i);t=t>0?Math.min(t,r):r}this._residentBudget=t}_collectAllFileIds(){let t=new Set;for(let s of this._leafNodes)for(let i of s.availableLevels){let r=s.lods[String(i)];if(r)t.add(r.file)}return Array.from(t).sort((s,i)=>s-i)}async _gatherCountsAsync(t){let s=0,i=0,r=0,o=(_)=>{let h=xe._GetShInfo(_);if(h.degree>i)i=h.degree;if(h.coeffs>r)r=h.coeffs};if(this._metadata.environment)try{let _=this._rootUrl+this._metadata.environment,h=await this._downloadManager.loadFileAsync(_),y=await this._unzipAsync(new Uint8Array(h)),b=y.get("meta.json");if(b){let w=JSON.parse(new TextDecoder().decode(b));s=xe._GetSplatCount(w),o(w),this._environmentFiles=y}}catch(_){l.Warn("GaussianSplattingStream: failed to load environment: "+(_?.message??_))}await Promise.all(t.map(async(_)=>{let h=this._metadata.filenames[_];if(!h){l.Warn(`GaussianSplattingStream: missing filename for file index ${_}.`);return}try{let y=this._rootUrl+h,b=y.substring(0,y.lastIndexOf("/")+1),w=await this._downloadManager.loadFileAsync(y),v=JSON.parse(new TextDecoder().decode(new Uint8Array(w)));this._fileCounts.set(_,xe._GetSplatCount(v)),this._fileMeta.set(_,{sogData:v,subRootUrl:b})}catch(y){l.Warn(`GaussianSplattingStream: failed to load metadata for ${h}: ${y?.message??y}`)}}));for(let{sogData:_}of this._fileMeta.values())o(_);if(this._decodeSh&&i>0&&r>0)this._streamShDegree=i,this._shTextureCount=Math.ceil(r*3/16);return s}_enqueueDecode(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._fileMeta.has(t))return;if(this._decodeQueue.indexOf(t)===-1)this._decodeQueue.push(t)}_pumpDecodeQueue(){let t=0;while(this._decodeQueue.length>0&&t<this._maxDecodesPerFrame){let s=this._decodeQueue.shift();if(this._decodedFiles.has(s)||this._loadingFiles.has(s))continue;t++,this._decodeFileAsync(s).catch((i)=>{l.Warn("GaussianSplattingStream: decode failed: "+(i?.message??i))})}}_applyPositions(t,s,i){this._splatPositions.set(t,(this._positionBase+s)*4),this._updateBounds(t,i),this._sinkPostPositionsRange(s,i)}_sinkSetActiveRanges(t){if(this._host)this._host.setActiveRanges(t);else this.setSplatIndexRanges(t)}_sinkPostPositionsRange(t,s){if(this._host)this._host.postPositionsRange(t,s);else this._postWorkerPositionsRange(t,s)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(t,s,i){if(this._readbackProbed=!0,!this._workBuffer)return;let r=Math.min(s,1024),o=!1;try{let _=await this._workBuffer.readCentersRangeAsync(t,r);if(this._disposed)return;if(_&&_.length>=r*4){o=!0;for(let h=0;h<r&&o;h++)for(let y=0;y<3;y++){let b=_[h*4+y],w=i[h*4+y];if(Math.abs(b-w)>0.01*(1+Math.abs(w))){o=!1;break}}}}catch{o=!1}this._useGpuPositionReadback=o,l.Log(o?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(t,s,i){if(this._useGpuPositionReadback&&this._workBuffer){let o=await this._workBuffer.readCentersRangeAsync(s,i);if(this._disposed)return!1;if(o&&this._splatPositions)return this._applyPositions(o,s,i),!0}let r=t.positions.length>=i*4?t.positions.subarray(0,i*4):null;if(!r||!this._splatPositions)return!1;if(this._applyPositions(r,s,i),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(s,i,r);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let t=this._environmentRange;try{let i=(await Le(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!i)return;try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(i,t.offset),this._disposed)return;if(await this._applyDecodedPositionsAsync(i,t.offset,t.count),this._disposed)return;this._refreshActiveRanges()}finally{xe._DisposePack(i)}}catch(s){l.Warn("GaussianSplattingStream: failed to decode environment: "+(s?.message??s))}}async _decodeFileAsync(t){if(this._decodedFiles.has(t)||this._loadingFiles.has(t)||!this._residency)return;let s=this._fileMeta.get(t),i=this._fileCounts.get(t);if(!s||i===void 0)return;this._loadingFiles.add(t),this._cancelledDecodes.delete(t);let r=!1;try{let _=(await Le(s.sogData,s.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,t)).sogTextures;if(!_)return;let h=await this._acquireDecodeGateAsync();try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;let y=this._residency.allocate(t,i);if(y===null)y=await this._relayoutAndAllocateAsync(t,i);if(y===null){if(!this._cancelledDecodes.has(t))l.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${t}.`);return}if(r=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(t))return;if(await this._workBuffer.decodeAsync(_,y),this._disposed||this._cancelledDecodes.has(t))return;if(await this._applyDecodedPositionsAsync(_,y,i),this._disposed)return;if(this._decodedFiles.add(t),this._applyDesiredLods())this._refreshActiveRanges()}finally{xe._DisposePack(_),h()}}catch(o){if(!this._cancelledDecodes.has(t))throw o}finally{if(r&&!this._decodedFiles.has(t))this._residency.free(t);this._loadingFiles.delete(t),this._cancelledDecodes.delete(t)}}async _acquireDecodeGateAsync(){let t=this._decodeGate,s;return this._decodeGate=new Promise((i)=>{s=i}),await t,s}async _relayoutAndAllocateAsync(t,s){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<s)return null;return await new Promise((i)=>{let r=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(t)){i(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(r);return}this._performRelayout(),i(this._residency.allocate(t,s))};this._scene.onBeforeRenderObservable.addOnce(r)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let t=this._relayoutOldOffsets;t.clear();for(let y of this._residency.getResidentBlocks())t.set(y.file,y.offset);if(this._residency.compact().length===0)return;let i=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==i)this._relayoutSrcIndex=new Float32Array(i);let r=this._relayoutSrcIndex;r.fill(-1);let o=this._residency.getResidentBlocks();for(let y of o){let b=t.get(y.file);for(let w=0;w<y.count;w++)r[y.offset+w]=b+w}this._workBuffer.relayoutSync(r);let _=this._splatPositions,h=this._positionBase;o.sort((y,b)=>y.offset-b.offset);for(let y of o){let b=t.get(y.file);if(b!==y.offset)_.copyWithin((h+y.offset)*4,(h+b)*4,(h+b+y.count)*4)}if(this._environmentRange){let y=this._residency.offset(rs);if(y!==void 0)this._environmentRange.offset=y}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(t){this._decodedFiles.delete(t)}_cappedLevelForNode(t,s){let i=t.availableLevels,r=this._maxDetailLod,o=-1,_=Number.POSITIVE_INFINITY;for(let h of i){if(h<r)continue;let y=Math.abs(h-s);if(y<_)o=h,_=y}return o<0?t.baseLod:o}_computeTargetLevels(){for(let t of this._leafNodes){let s=t.optimalLod??t.baseLod;t.targetLevel=this._cappedLevelForNode(t,s)}}_applyDesiredLods(){let t=!1;for(let s of this._leafNodes){if(s.lodCooldown&&s.lodCooldown>0)continue;let i=s.targetLevel??s.baseLod,r;if(i!==s.activeLod){let o=s.lods[String(i)];if(o)if(this._decodedFiles.has(o.file))this._switchActiveFile(s,o.file),s.activeLod=i,s.lodCooldown=this._lodCooldownFrames,t=!0;else r=o.file}if(s.pendingFile!==r){if(s.pendingFile!==void 0)this._releaseFileRef(s.pendingFile);if(r!==void 0)this._acquirePendingFile(r);s.pendingFile=r}}return t}_switchActiveFile(t,s){if(t.activeFile===s)return;if(t.activeFile!==void 0)this._releaseFileRef(t.activeFile);this._acquireFileRef(s),t.activeFile=s}_acquireFileRef(t){let s=(this._fileRefs.get(t)??0)+1;if(this._fileRefs.set(t,s),s===1)this._residency?.cancelEviction(t)}_acquirePendingFile(t){this._acquireFileRef(t),this._enqueueDecode(t)}_releaseFileRef(t){let s=(this._fileRefs.get(t)??0)-1;if(s>0){this._fileRefs.set(t,s);return}if(this._fileRefs.delete(t),this._decodedFiles.has(t)){if(this._evictionEnabled)this._residency?.scheduleEviction(t);return}let i=this._decodeQueue.indexOf(t);if(i!==-1)this._decodeQueue.splice(i,1);if(this._loadingFiles.has(t))this._cancelledDecodes.add(t),this._downloadManager.cancelGroup(t)}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;let t=!1;for(let r of this._leafNodes)if(r.lodCooldown&&r.lodCooldown>0){if(r.lodCooldown--,r.lodCooldown===0&&r.targetLevel!==void 0&&r.targetLevel!==r.activeLod)t=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let s=this._updateNodeFrustum(),i=this._forceLodUpdate||s||t;if(!i&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let r=this._scene.activeCamera,o=this._lodUpdateDistance;if(!r||e.DistanceSquared(r.globalPosition,this._lastLodCamPos)>=o*o){if(r)this._lastLodCamPos.copyFrom(r.globalPosition);i=!0}}if(i){if(this._forceLodUpdate=!1,this._framesSinceLodUpdate=0,this.evaluateOptimalLods(this._scene.activeCamera),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_updateNodeFrustum(){let t=this._scene.activeCamera,s=!1;if(!this._frustumCulling||!t){for(let r of this._leafNodes)if(r.inFrustum===!1)r.inFrustum=!0,s=!0;return s}let i=this._getEffectiveWorldMatrix(!1);t.getViewMatrix().multiplyToRef(t.getProjectionMatrix(),this._cullViewProj),Jr.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);for(let r of this._leafNodes){r.cullBounds.update(i);let o=r.cullBounds.isInFrustum(this._frustumPlanes);if(o!==r.inFrustum)r.inFrustum=o,s=!0}return s}static _GetSplatCount(t){return t.count??(Array.isArray(t.means.shape)?t.means.shape[0]:0)}static _GetShInfo(t){if(!t.shN)return{degree:0,coeffs:0};let s=4,i=0,r=t.shN.bands;if(typeof r==="number"&&Number.isFinite(r)&&r>0)i=Math.floor(r);else if(Array.isArray(t.shN.shape)&&Number.isFinite(t.shN.shape[1])&&t.shN.shape[1]>0){let o=Math.floor(t.shN.shape[1]/3);i=o>0?Math.round(Math.sqrt(o+1)-1):0}if(!(i>0))return{degree:0,coeffs:0};if(i>s)l.Warn(`GaussianSplattingStream: SH degree ${i} exceeds the maximum supported (${s}); clamping.`),i=s;return{degree:i,coeffs:(i+1)**2-1}}static _DisposePack(t){t.meansTextureL.dispose(),t.meansTextureU.dispose(),t.scalesTexture.dispose(),t.quatsTexture.dispose(),t.sh0Texture.dispose(),t.shCentroidsTexture?.dispose(),t.shLabelsTexture?.dispose(),t.codebookTexture?.dispose()}_updateBounds(t,s){let i=this._boundsMin,r=this._boundsMax;for(let o=0;o<s;o++){let _=t[o*4+0],h=t[o*4+1],y=t[o*4+2];i.minimizeInPlaceFromFloats(_,h,y),r.maximizeInPlaceFromFloats(_,h,y)}if(this._host)this._host.expandBounds(i,r);else this.setBoundingInfo(new ti(i,r))}_refreshActiveRanges(){let t=[];if(this._environmentRange)t.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let s of this._leafNodes){if(s.activeLod===void 0)continue;let i=s.lods[String(s.activeLod)];if(!i)continue;let r=this._residency?.offset(i.file);if(r===void 0)continue;t.push({offset:r+i.offset,count:i.count})}this._sinkSetActiveRanges(xe._CoalesceRanges(t))}static _CoalesceRanges(t){if(t.length<=1)return t;let s=t.slice().sort((r,o)=>r.offset-o.offset),i=[{offset:s[0].offset,count:s[0].count}];for(let r=1;r<s.length;r++){let o=i[i.length-1],_=s[r],h=o.offset+o.count;if(_.offset<=h){let y=Math.max(h,_.offset+_.count);o.count=y-o.offset}else i.push({offset:_.offset,count:_.count})}return i}async _unzipAsync(t){let s=this._streamOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let i=s.unzipSync(t),r=new Map;for(let[o,_]of Object.entries(i))r.set(o,_);return r}}class Nf{constructor(t,s,i,r,o){this.idx=0,this.color=new S(1,1,1,1),this.position=e.Zero(),this.rotation=e.Zero(),this.uv=new m(0,0),this.velocity=e.Zero(),this.pivot=e.Zero(),this.translateFromPivot=!1,this._pos=0,this._ind=0,this.groupId=0,this.idxInGroup=0,this._stillInvisible=!1,this._rotationMatrix=[1,0,0,0,1,0,0,0,1],this.parentId=null,this._globalPosition=e.Zero(),this.idx=t,this._group=s,this.groupId=i,this.idxInGroup=r,this._pcs=o}get size(){return this.size}set size(t){this.size=t}get quaternion(){return this.rotationQuaternion}set quaternion(t){this.rotationQuaternion=t}intersectsMesh(t,s){if(!t.hasBoundingInfo)return!1;if(!this._pcs.mesh)throw Error("Point Cloud System doesnt contain the Mesh");if(s)return t.getBoundingInfo().boundingSphere.intersectsPoint(this.position.add(this._pcs.mesh.position));let i=t.getBoundingInfo().boundingBox,r=i.maximumWorld.x,o=i.minimumWorld.x,_=i.maximumWorld.y,h=i.minimumWorld.y,y=i.maximumWorld.z,b=i.minimumWorld.z,w=this.position.x+this._pcs.mesh.position.x,v=this.position.y+this._pcs.mesh.position.y,D=this.position.z+this._pcs.mesh.position.z;return o<=w&&w<=r&&h<=v&&v<=_&&b<=D&&D<=y}getRotationMatrix(t){let s;if(this.rotationQuaternion)s=this.rotationQuaternion;else{s=a.Quaternion[0];let i=this.rotation;d.RotationYawPitchRollToRef(i.y,i.x,i.z,s)}s.toRotationMatrix(t)}}class fc{get groupID(){return this.groupId}set groupID(t){this.groupId=t}constructor(t,s){this.groupId=t,this._positionFunction=s}}var Yx={internalPickerForMesh:void 0};class ee{constructor(t,s,i=Number.MAX_VALUE,r=G){this.origin=t,this.direction=s,this.length=i,this.epsilon=r}clone(){return new ee(this.origin.clone(),this.direction.clone(),this.length)}intersectsBoxMinMax(t,s,i=0){let r=ee._TmpVector3[0].copyFromFloats(t.x-i,t.y-i,t.z-i),o=ee._TmpVector3[1].copyFromFloats(s.x+i,s.y+i,s.z+i),_=0,h=Number.MAX_VALUE,y,b,w,v;if(Math.abs(this.direction.x)<0.0000001){if(this.origin.x<r.x||this.origin.x>o.x)return!1}else{if(y=1/this.direction.x,b=(r.x-this.origin.x)*y,w=(o.x-this.origin.x)*y,w===-1/0)w=1/0;if(b>w)v=b,b=w,w=v;if(_=Math.max(b,_),h=Math.min(w,h),_>h)return!1}if(Math.abs(this.direction.y)<0.0000001){if(this.origin.y<r.y||this.origin.y>o.y)return!1}else{if(y=1/this.direction.y,b=(r.y-this.origin.y)*y,w=(o.y-this.origin.y)*y,w===-1/0)w=1/0;if(b>w)v=b,b=w,w=v;if(_=Math.max(b,_),h=Math.min(w,h),_>h)return!1}if(Math.abs(this.direction.z)<0.0000001){if(this.origin.z<r.z||this.origin.z>o.z)return!1}else{if(y=1/this.direction.z,b=(r.z-this.origin.z)*y,w=(o.z-this.origin.z)*y,w===-1/0)w=1/0;if(b>w)v=b,b=w,w=v;if(_=Math.max(b,_),h=Math.min(w,h),_>h)return!1}return!0}intersectsBox(t,s=0){return this.intersectsBoxMinMax(t.minimum,t.maximum,s)}intersectsSphere(t,s=0){let i=t.center.x-this.origin.x,r=t.center.y-this.origin.y,o=t.center.z-this.origin.z,_=i*i+r*r+o*o,h=t.radius+s,y=h*h;if(_<=y)return!0;let b=i*this.direction.x+r*this.direction.y+o*this.direction.z;if(b<0)return!1;return _-b*b<=y}intersectsTriangle(t,s,i){let r=ee._TmpVector3[0],o=ee._TmpVector3[1],_=ee._TmpVector3[2],h=ee._TmpVector3[3],y=ee._TmpVector3[4];s.subtractToRef(t,r),i.subtractToRef(t,o),e.CrossToRef(this.direction,o,_);let b=e.Dot(r,_);if(b===0)return null;let w=1/b;this.origin.subtractToRef(t,h);let v=e.Dot(h,_)*w;if(v<-this.epsilon||v>1+this.epsilon)return null;e.CrossToRef(h,r,y);let D=e.Dot(this.direction,y)*w;if(D<-this.epsilon||v+D>1+this.epsilon)return null;let T=e.Dot(o,y)*w;if(T>this.length||T<0)return null;return new Va(1-v-D,v,T)}intersectsPlane(t){let s,i=e.Dot(t.normal,this.direction);if(Math.abs(i)<0.000000999999997475243)return null;else{let r=e.Dot(t.normal,this.origin);if(s=(-t.d-r)/i,s<0)if(s<-0.000000999999997475243)return null;else return 0;return s}}intersectsAxis(t,s=0){switch(t){case"y":{let i=(this.origin.y-s)/this.direction.y;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,s,this.origin.z+this.direction.z*-i)}case"x":{let i=(this.origin.x-s)/this.direction.x;if(i>0)return null;return new e(s,this.origin.y+this.direction.y*-i,this.origin.z+this.direction.z*-i)}case"z":{let i=(this.origin.z-s)/this.direction.z;if(i>0)return null;return new e(this.origin.x+this.direction.x*-i,this.origin.y+this.direction.y*-i,s)}default:return null}}intersectsMesh(t,s,i,r=!1,o,_=!1){let h=a.Matrix[0];if(t.getWorldMatrix().invertToRef(h),this._tmpRay)ee.TransformToRef(this,h,this._tmpRay);else this._tmpRay=ee.Transform(this,h);return t.intersects(this._tmpRay,s,i,r,o,_)}intersectsMeshes(t,s,i){if(i)i.length=0;else i=[];for(let r=0;r<t.length;r++){let o=this.intersectsMesh(t[r],s);if(o.hit)i.push(o)}return i.sort(this._comparePickingInfo),i}_comparePickingInfo(t,s){if(t.distance<s.distance)return-1;else if(t.distance>s.distance)return 1;else return 0}intersectionSegment(t,s,i){let r=this.origin,o=a.Vector3[0],_=a.Vector3[1],h=a.Vector3[2],y=a.Vector3[3];s.subtractToRef(t,o),this.direction.scaleToRef(ee._Rayl,h),r.addToRef(h,_),t.subtractToRef(r,y);let b=e.Dot(o,o),w=e.Dot(o,h),v=e.Dot(h,h),D=e.Dot(o,y),T=e.Dot(h,y),P=b*v-w*w,k,W=P,O,R=P;if(P<ee._Smallnum)k=0,W=1,O=T,R=v;else if(k=w*T-v*D,O=b*T-w*D,k<0)k=0,O=T,R=v;else if(k>W)k=W,O=T+w,R=v;if(O<0)if(O=0,-D<0)k=0;else if(-D>b)k=W;else k=-D,W=b;else if(O>R)if(O=R,-D+w<0)k=0;else if(-D+w>b)k=W;else k=-D+w,W=b;let q=Math.abs(k)<ee._Smallnum?0:k/W,C=Math.abs(O)<ee._Smallnum?0:O/R,z=a.Vector3[4];h.scaleToRef(C,z);let U=a.Vector3[5];o.scaleToRef(q,U),U.addInPlace(y);let A=a.Vector3[6];if(U.subtractToRef(z,A),C>0&&C<=this.length&&A.lengthSquared()<i*i)return U.length();return-1}update(t,s,i,r,o,_,h,y=!1){if(y){if(!ee._RayDistant)ee._RayDistant=ee.Zero();ee._RayDistant.unprojectRayToRef(t,s,i,r,c.IdentityReadOnly,_,h);let b=a.Matrix[0];o.invertToRef(b),ee.TransformToRef(ee._RayDistant,b,this)}else this.unprojectRayToRef(t,s,i,r,o,_,h);return this}static Zero(){return new ee(e.Zero(),e.Zero())}static CreateNew(t,s,i,r,o,_,h){return ee.Zero().update(t,s,i,r,o,_,h)}static CreateNewFromTo(t,s,i=c.IdentityReadOnly){let r=new ee(new e(0,0,0),new e(0,0,0));return ee.CreateFromToToRef(t,s,r,i)}static CreateFromToToRef(t,s,i,r=c.IdentityReadOnly){i.origin.copyFrom(t);let o=s.subtractToRef(t,i.direction),_=Math.sqrt(o.x*o.x+o.y*o.y+o.z*o.z);return i.length=_,i.direction.normalize(),ee.TransformToRef(i,r,i)}static Transform(t,s){let i=new ee(new e(0,0,0),new e(0,0,0));return ee.TransformToRef(t,s,i),i}static TransformToRef(t,s,i){e.TransformCoordinatesToRef(t.origin,s,i.origin),e.TransformNormalToRef(t.direction,s,i.direction),i.length=t.length,i.epsilon=t.epsilon;let r=i.direction,o=r.length();if(!(o===0||o===1)){let _=1/o;r.x*=_,r.y*=_,r.z*=_,i.length*=o}return i}unprojectRayToRef(t,s,i,r,o,_,h){let y=a.Matrix[0];o.multiplyToRef(_,y),y.multiplyToRef(h,y),y.invert();let b=E.LastCreatedEngine,w=a.Vector3[0];w.x=t/i*2-1,w.y=-(s/r*2-1),w.z=b?.useReverseDepthBuffer?1:b?.isNDCHalfZRange?0:-1;let v=a.Vector3[1].copyFromFloats(w.x,w.y,0.99999999),D=a.Vector3[2],T=a.Vector3[3];e.TransformCoordinatesToRef(w,y,D),e.TransformCoordinatesToRef(v,y,T),this.origin.copyFrom(D),T.subtractToRef(D,this.direction),this.direction.normalize()}}ee._TmpVector3=or(6,e.Zero);ee._RayDistant=ee.Zero();ee._Smallnum=0.00000001;ee._Rayl=1e9;function _u(t,s,i,r,o,_=!1){let h=ee.Zero();return uc(t,s,i,r,h,o,_),h}function uc(t,s,i,r,o,_,h=!1,y=!1){let b=t.getEngine();if(!_&&!(_=t.activeCamera)&&!(_=t.cameraToUseForPointers))return t;let w=_.viewport,v=b.getRenderHeight(),{x:D,y:T,width:P,height:k}=w.toGlobal(b.getRenderWidth(),v),W=1/b.getHardwareScalingLevel();return s=s*W-D,i=i*W-(v-T-k),o.update(s,i,P,k,r?r:c.IdentityReadOnly,h?c.IdentityReadOnly:_.getViewMatrix(),_.getProjectionMatrix(),y),t}function gu(t,s,i,r){let o=ee.Zero();return Ml(t,s,i,o,r),o}function Ml(t,s,i,r,o){if(!mi)return t;let _=t.getEngine();if(!o&&!(o=t.activeCamera)&&!(o=t.cameraToUseForPointers))throw Error("Active camera not set");let h=o.viewport,y=_.getRenderHeight(),{x:b,y:w,width:v,height:D}=h.toGlobal(_.getRenderWidth(),y),T=c.Identity(),P=1/_.getHardwareScalingLevel();return s=s*P-b,i=i*P-(y-w-D),r.update(s,i,v,D,T,T,o.getProjectionMatrix()),t}function We(t,s,i,r,o,_,h,y){let b=s(r,i.enableDistantPicking);return tt(t,i,r,b,o,_,h,y)}function tt(t,s,i,r,o,_,h,y){let b=s.intersects(r,o,h,_,i,y);if(!b||!b.hit)return null;if(!o&&t!=null&&b.distance>=t.distance)return null;return b}function Cs(t,s){return t==="InstancedLinesMesh"||t==="LinesMesh"?s.intersectionThreshold:0}function ls(t){let s=t.getClassName();if(s==="GreasedLineMesh")return{rawBoundingInfo:null,intersectionThreshold:0};let i=t.rawBoundingInfo;return{rawBoundingInfo:i,intersectionThreshold:i?Cs(s,t):0}}function cs(t,s,i,r,o){let _=t(i,s.enableDistantPicking);if(!_.intersectsSphere(r.boundingSphere,o)||!_.intersectsBox(r.boundingBox,o))return null;return _}function st(t,s,i,r,o,_){let h=null,y=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),b=t.cameraToUseForPointers||t.activeCamera,w=Yx.internalPickerForMesh||We,v=w===We;for(let D=0;D<t.meshes.length;D++){let T=t.meshes[D];if(i){if(!i(T,-1))continue}else if(!T.isEnabled()||!T.isVisible||!T.isPickable)continue;let P=y&&T.isWorldMatrixCameraDependent(),k=T.computeWorldMatrix(P,b);if(T.hasThinInstances&&T.thinInstanceEnablePicking){let W=w(h,s,T,k,!0,!0,_);if(W){if(o)return W;let{rawBoundingInfo:O,intersectionThreshold:R}=ls(T),q=T._thinInstanceDataStorage.matrixData;if(q){let C=a.Matrix[0],z=a.Matrix[1],U=Math.min(T.thinInstanceCount,q.length>>4);for(let A=0;A<U;A++){if(i&&!i(T,A))continue;c.FromArrayToRef(q,A<<4,C),C.multiplyToRef(k,z);let V=v&&O?cs(s,T,z,O,R):null;if(v&&O&&!V)continue;let N=v&&V?tt(h,T,z,V,r,o,_,!0):w(h,s,T,z,r,o,_,!0);if(N){if(h=N,h.thinInstanceIndex=A,r)return h}}}}}else{let W=w(h,s,T,k,r,o,_);if(W){if(h=W,r)return h}}}return h||new mi}function us(t,s,i,r){if(!mi)return null;let o=[],_=!!(t.activeCameras&&t.activeCameras.length>1&&t.cameraToUseForPointers!==t.activeCamera),h=t.cameraToUseForPointers||t.activeCamera,y=Yx.internalPickerForMesh||We,b=y===We;for(let w=0;w<t.meshes.length;w++){let v=t.meshes[w];if(i){if(!i(v,-1))continue}else if(!v.isEnabled()||!v.isVisible||!v.isPickable)continue;let D=_&&v.isWorldMatrixCameraDependent(),T=v.computeWorldMatrix(D,h);if(v.hasThinInstances&&v.thinInstanceEnablePicking){if(y(null,s,v,T,!0,!0,r)){let{rawBoundingInfo:k,intersectionThreshold:W}=ls(v),O=v._thinInstanceDataStorage.matrixData;if(O){let R=a.Matrix[0],q=a.Matrix[1],C=Math.min(v.thinInstanceCount,O.length>>4);for(let z=0;z<C;z++){if(i&&!i(v,z))continue;c.FromArrayToRef(O,z<<4,R),R.multiplyToRef(T,q);let U=b&&k?cs(s,v,q,k,W):null;if(b&&k&&!U)continue;let A=b&&U?tt(null,v,q,U,!1,!1,r,!0):y(null,s,v,q,!1,!1,r,!0);if(A)A.thinInstanceIndex=z,o.push(A)}}}}else{let P=y(null,s,v,T,!1,!1,r);if(P)o.push(P)}}return o}function jx(t,s,i,r,o,_){if(!mi)return null;let h=st(t,(y)=>{if(!t._tempPickingRay)t._tempPickingRay=ee.Zero();return uc(t,s,i,y,t._tempPickingRay,_||null),t._tempPickingRay},r,o,!0);if(h)h.ray=_u(t,s,i,c.Identity(),_||null);return h}function xu(t,s,i,r,o,_,h,y=!1){let b=st(t,(w,v)=>{if(!t._tempPickingRay)t._tempPickingRay=ee.Zero();return uc(t,s,i,w,t._tempPickingRay,_||null,!1,v),t._tempPickingRay},r,o,!1,h);if(b)b.ray=_u(t,s,i,c.Identity(),_||null);return b}function vu(t,s,i,r,o){let _=st(t,(h)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=c.Identity();if(h.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=ee.Zero();return ee.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r,!1,o);if(_)_.ray=s;return _}function Qx(t,s,i,r,o,_){return us(t,(h)=>_u(t,s,i,h,o||null),r,_)}function qx(t,s,i,r){return us(t,(o)=>{if(!t._pickWithRayInverseMatrix)t._pickWithRayInverseMatrix=c.Identity();if(o.invertToRef(t._pickWithRayInverseMatrix),!t._cachedRayForTransform)t._cachedRayForTransform=ee.Zero();return ee.TransformToRef(s,t._pickWithRayInverseMatrix,t._cachedRayForTransform),t._cachedRayForTransform},i,r)}function YA(t,s=100,i,r){return Lf(t,new ee(e.Zero(),e.Zero(),s),s,i,r)}function Lf(t,s,i=100,r,o){if(!r)r=t.getWorldMatrix();if(s.length=i,o)s.origin.copyFrom(o);else s.origin.copyFrom(t.position);let _=a.Vector3[2];_.set(0,0,t._scene.useRightHandedSystem?-1:1);let h=a.Vector3[3];return e.TransformNormalToRef(_,r,h),e.NormalizeToRef(h,s.direction),s}function Zx(t,s){if(s)s.prototype.getForwardRay=function(i=100,r,o){return Lf(this,new ee(e.Zero(),e.Zero(),i),i,r,o)},s.prototype.getForwardRayToRef=function(i,r=100,o,_){return Lf(this,i,r,o,_)};if(!t)return;Jc._IsPickingAvailable=!0,t.prototype.createPickingRay=function(i,r,o,_,h=!1){return _u(this,i,r,o,_,h)}}var iv;(function(t){t[t.Color=2]="Color",t[t.UV=1]="UV",t[t.Random=0]="Random",t[t.Stated=3]="Stated"})(iv||(iv={}));class Ff{get positions(){return this._positions32}get colors(){return this._colors32}get uvs(){return this._uvs32}constructor(t,s,i,r){if(this.particles=[],this.nbParticles=0,this.counter=0,this.vars={},this._promises=[],this._positions=[],this._indices=[],this._normals=[],this._colors=[],this._uvs=[],this._updatable=!0,this._isVisibilityBoxLocked=!1,this._alwaysVisible=!1,this._groups=[],this._groupCounter=0,this._computeParticleColor=!0,this._computeParticleTexture=!0,this._computeParticleRotation=!0,this._computeBoundingBox=!1,this._isReady=!1,this.name=t,this._size=s,this._scene=i||E.LastCreatedScene,r&&r.updatable!==void 0)this._updatable=r.updatable;else this._updatable=!0}async buildMeshAsync(t){return await Promise.all(this._promises),this._isReady=!0,await this._buildMeshAsync(t)}async _buildMeshAsync(t){if(this.nbParticles===0)this.addPoints(1);this._positions32=new Float32Array(this._positions),this._uvs32=new Float32Array(this._uvs),this._colors32=new Float32Array(this._colors);let s=new M;if(s.set(this._positions32,n.PositionKind),this._uvs32.length>0)s.set(this._uvs32,n.UVKind);let i=0;if(this._colors32.length>0)i=1,s.set(this._colors32,n.ColorKind);let r=new p(this.name,this._scene);if(s.applyToMesh(r,this._updatable),this.mesh=r,this._positions=null,this._uvs=null,this._colors=null,!this._updatable)this.particles.length=0;let o=t;if(!o)o=new L("point cloud material",this._scene),o.emissiveColor=new f(i,i,i),o.disableLighting=!0,o.pointsCloud=!0,o.pointSize=this._size;return r.material=o,r}_addParticle(t,s,i,r){let o=new Nf(t,s,i,r,this);return this.particles.push(o),o}_randomUnitVector(t){t.position=new e(Math.random(),Math.random(),Math.random()),t.color=new S(1,1,1,1)}_getColorIndicesForCoord(t,s,i,r){let o=t._groupImageData,_=i*(r*4)+s*4,h=[_,_+1,_+2,_+3],y=h[0],b=h[1],w=h[2],v=h[3],D=o[y],T=o[b],P=o[w],k=o[v];return new S(D/255,T/255,P/255,k)}_setPointsColorOrUV(t,s,i,r,o,_,h,y){if(y=y??0,i)t.updateFacetData();let w=2*t.getBoundingInfo().boundingSphere.radius,v=t.getVerticesData(n.PositionKind),D=t.getIndices(),T=t.getVerticesData(n.UVKind+(y?y+1:"")),P=t.getVerticesData(n.ColorKind),k=e.Zero();t.computeWorldMatrix();let W=t.getWorldMatrix();if(!W.isIdentity()){v=v.slice(0);for(let ue=0;ue<v.length/3;ue++)e.TransformCoordinatesFromFloatsToRef(v[3*ue],v[3*ue+1],v[3*ue+2],W,k),v[3*ue]=k.x,v[3*ue+1]=k.y,v[3*ue+2]=k.z}let O,R,q,C,z,U,A,V,N,Y,te,H,j,ie=e.Zero(),X=e.Zero(),J=e.Zero(),ne=e.Zero(),se=e.Zero(),le,oe,Z,he,me,ge,pe=m.Zero(),re=m.Zero(),rt=m.Zero(),ot=m.Zero(),nt=m.Zero(),at,lt,ct,ut,ht,ft,dt,pt,_t,mt,gt,xt,Ce=I.Zero(),Ge=I.Zero(),yt=I.Zero(),St=I.Zero(),Mt=I.Zero(),ye,Fe;h=h?h:0;let De,qe,ae=new I(0,0,0,1),Ne,Xe,bt,be,vt,wt,Rt,Pe=new ee(e.Zero(),new e(1,0,0)),He,ke;for(let ue=0;ue<D.length/3;ue++){if(R=D[3*ue],q=D[3*ue+1],C=D[3*ue+2],z=v[3*R],U=v[3*R+1],A=v[3*R+2],V=v[3*q],N=v[3*q+1],Y=v[3*q+2],te=v[3*C],H=v[3*C+1],j=v[3*C+2],ie.set(z,U,A),X.set(V,N,Y),J.set(te,H,j),X.subtractToRef(ie,ne),J.subtractToRef(X,se),T)le=T[2*R],oe=T[2*R+1],Z=T[2*q],he=T[2*q+1],me=T[2*C],ge=T[2*C+1],pe.set(le,oe),re.set(Z,he),rt.set(me,ge),re.subtractToRef(pe,ot),rt.subtractToRef(re,nt);if(P&&r)at=P[4*R],lt=P[4*R+1],ct=P[4*R+2],ut=P[4*R+3],ht=P[4*q],ft=P[4*q+1],dt=P[4*q+2],pt=P[4*q+3],_t=P[4*C],mt=P[4*C+1],gt=P[4*C+2],xt=P[4*C+3],Ce.set(at,lt,ct,ut),Ge.set(ht,ft,dt,pt),yt.set(_t,mt,gt,xt),Ge.subtractToRef(Ce,St),yt.subtractToRef(Ge,Mt);let Ze,Tt,Ct,Dt,At,ve,we,Be,Lt=new f(0,0,0),ze=new f(0,0,0),Re,_e;for(let je=0;je<s._groupDensity[ue];je++){if(O=this.particles.length,this._addParticle(O,s,this._groupCounter,ue+je),_e=this.particles[O],ye=Math.sqrt(F(0,1)),Fe=F(0,1),De=ie.add(ne.scale(ye)).add(se.scale(ye*Fe)),i){if(Ne=t.getFacetNormal(ue).normalize().scale(-1),Xe=ne.clone().normalize(),bt=e.Cross(Ne,Xe),be=F(0,2*Math.PI),vt=Xe.scale(Math.cos(be)).add(bt.scale(Math.sin(be))),be=F(0.1,Math.PI/2),ke=vt.scale(Math.cos(be)).add(Ne.scale(Math.sin(be))),Pe.origin=De.add(ke.scale(0.00001)),Pe.direction=ke,Pe.length=w,He=Pe.intersectsMesh(t),He.hit)Rt=He.pickedPoint.subtract(De).length(),wt=F(0,1)*Rt,De.addInPlace(ke.scale(wt))}if(_e.position=De.clone(),this._positions.push(_e.position.x,_e.position.y,_e.position.z),r!==void 0){if(T)if(qe=pe.add(ot.scale(ye)).add(nt.scale(ye*Fe)),r)if(o&&s._groupImageData!==null)Ze=s._groupImgWidth,Tt=s._groupImgHeight,Re=this._getColorIndicesForCoord(s,Math.round(qe.x*Ze),Math.round(qe.y*Tt),Ze),_e.color=Re,this._colors.push(Re.r,Re.g,Re.b,Re.a);else if(P)ae=Ce.add(St.scale(ye)).add(Mt.scale(ye*Fe)),_e.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else ae=Ce.set(Math.random(),Math.random(),Math.random(),1),_e.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w);else _e.uv=qe.clone(),this._uvs.push(_e.uv.x,_e.uv.y)}else{if(_){if(Lt.set(_.r,_.g,_.b),Ct=F(-h,h),Dt=F(-h,h),Be=Lt.toHSV(),At=Be.r,ve=Be.g+Ct,we=Be.b+Dt,ve<0)ve=0;if(ve>1)ve=1;if(we<0)we=0;if(we>1)we=1;f.HSVtoRGBToRef(At,ve,we,ze),ae.set(ze.r,ze.g,ze.b,1)}else ae=Ce.set(Math.random(),Math.random(),Math.random(),1);_e.color=new S(ae.x,ae.y,ae.z,ae.w),this._colors.push(ae.x,ae.y,ae.z,ae.w)}}}}_colorFromTexture(t,s,i){if(t.material===null){l.Warn(t.name+"has no material."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let o=t.material.getActiveTextures();if(o.length===0){l.Warn(t.name+"has no usable texture."),s._groupImageData=null,this._setPointsColorOrUV(t,s,i,!0,!1);return}let _=t.clone();_.setEnabled(!1),this._promises.push(new Promise((h)=>{zt.WhenAllReady(o,()=>{let y=s._textureNb;if(y<0)y=0;if(y>o.length-1)y=o.length-1;let b=()=>{s._groupImgWidth=o[y].getSize().width,s._groupImgHeight=o[y].getSize().height,this._setPointsColorOrUV(_,s,i,!0,!0,void 0,void 0,o[y].coordinatesIndex),_.dispose(),h()};s._groupImageData=null;let w=o[y].readPixels();if(!w)b();else w.then((v)=>{s._groupImageData=v,b()})})}))}_calculateDensity(t,s,i){let r,o,_,h,y,b,w,v,D,T,P,k,W=e.Zero(),O=e.Zero(),R=e.Zero(),q=e.Zero(),C=e.Zero(),z=e.Zero(),U,A=[],V=0,N=i.length/3;for(let H=0;H<N;H++)r=i[3*H],o=i[3*H+1],_=i[3*H+2],h=s[3*r],y=s[3*r+1],b=s[3*r+2],w=s[3*o],v=s[3*o+1],D=s[3*o+2],T=s[3*_],P=s[3*_+1],k=s[3*_+2],W.set(h,y,b),O.set(w,v,D),R.set(T,P,k),O.subtractToRef(W,q),R.subtractToRef(O,C),e.CrossToRef(q,C,z),U=0.5*z.length(),V+=U,A[H]=V;let Y=Array(N),te=t;for(let H=N-1;H>0;H--){let j=A[H];if(j===0)Y[H]=0;else{let X=(j-A[H-1])/j*te,J=Math.floor(X),ne=X-J,se=Number(Math.random()<ne),le=J+se;Y[H]=le,te-=le}}return Y[0]=te,Y}addPoints(t,s=this._randomUnitVector){let i=new fc(this._groupCounter,s),r,o=this.nbParticles;for(let _=0;_<t;_++){if(r=this._addParticle(o,i,this._groupCounter,_),i&&i._positionFunction)i._positionFunction(r,o,_);if(this._positions.push(r.position.x,r.position.y,r.position.z),r.color)this._colors.push(r.color.r,r.color.g,r.color.b,r.color.a);if(r.uv)this._uvs.push(r.uv.x,r.uv.y);o++}return this.nbParticles+=t,this._groupCounter++,this._groupCounter}addSurfacePoints(t,s,i,r,o){let _=i?i:0;if(isNaN(_)||_<0||_>3)_=0;let h=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let b=new fc(this._groupCounter,null);if(b._groupDensity=this._calculateDensity(s,h,y),_===2)b._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(_){case 2:this._colorFromTexture(t,b,!1);break;case 1:this._setPointsColorOrUV(t,b,!1,!1,!1);break;case 0:this._setPointsColorOrUV(t,b,!1);break;case 3:this._setPointsColorOrUV(t,b,!1,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}addVolumePoints(t,s,i,r,o){let _=i?i:0;if(isNaN(_)||_<0||_>3)_=0;let h=t.getVerticesData(n.PositionKind),y=t.getIndices();this._groups.push(this._groupCounter);let b=new fc(this._groupCounter,null);if(b._groupDensity=this._calculateDensity(s,h,y),_===2)b._textureNb=r?r:0;else r=r?r:new S(1,1,1,1);switch(_){case 2:this._colorFromTexture(t,b,!0);break;case 1:this._setPointsColorOrUV(t,b,!0,!1,!1);break;case 0:this._setPointsColorOrUV(t,b,!0);break;case 3:this._setPointsColorOrUV(t,b,!0,void 0,void 0,r,o);break}return this.nbParticles+=s,this._groupCounter++,this._groupCounter-1}setParticles(t=0,s=this.nbParticles-1,i=!0){if(!this._updatable||!this._isReady)return this;this.beforeUpdateParticles(t,s,i);let r=a.Matrix[0],o=this.mesh,_=this._colors32,h=this._positions32,y=this._uvs32,b=a.Vector3,w=b[5].copyFromFloats(1,0,0),v=b[6].copyFromFloats(0,1,0),D=b[7].copyFromFloats(0,0,1),T=b[8].setAll(Number.MAX_VALUE),P=b[9].setAll(-Number.MAX_VALUE);c.IdentityToRef(r);let k;if(this.mesh?.isFacetDataEnabled)this._computeBoundingBox=!0;if(s=s>=this.nbParticles?this.nbParticles-1:s,this._computeBoundingBox){if(t!=0||s!=this.nbParticles-1){let q=this.mesh?.getBoundingInfo();if(q)T.copyFrom(q.minimum),P.copyFrom(q.maximum)}}let W,O,R;for(let q=t;q<=s;q++){let C=this.particles[q];k=C.idx,W=3*k,O=4*k,R=2*k,this.updateParticle(C);let{_rotationMatrix:z,position:U,_globalPosition:A}=C;if(this._computeParticleRotation)C.getRotationMatrix(r);if(C.parentId!==null){let oe=this.particles[C.parentId],{_rotationMatrix:Z,_globalPosition:he}=oe,me=U.x*Z[1]+U.y*Z[4]+U.z*Z[7],ge=U.x*Z[0]+U.y*Z[3]+U.z*Z[6],pe=U.x*Z[2]+U.y*Z[5]+U.z*Z[8];if(A.x=he.x+ge,A.y=he.y+me,A.z=he.z+pe,this._computeParticleRotation){let re=r.m;z[0]=re[0]*Z[0]+re[1]*Z[3]+re[2]*Z[6],z[1]=re[0]*Z[1]+re[1]*Z[4]+re[2]*Z[7],z[2]=re[0]*Z[2]+re[1]*Z[5]+re[2]*Z[8],z[3]=re[4]*Z[0]+re[5]*Z[3]+re[6]*Z[6],z[4]=re[4]*Z[1]+re[5]*Z[4]+re[6]*Z[7],z[5]=re[4]*Z[2]+re[5]*Z[5]+re[6]*Z[8],z[6]=re[8]*Z[0]+re[9]*Z[3]+re[10]*Z[6],z[7]=re[8]*Z[1]+re[9]*Z[4]+re[10]*Z[7],z[8]=re[8]*Z[2]+re[9]*Z[5]+re[10]*Z[8]}}else if(A.x=0,A.y=0,A.z=0,this._computeParticleRotation){let oe=r.m;z[0]=oe[0],z[1]=oe[1],z[2]=oe[2],z[3]=oe[4],z[4]=oe[5],z[5]=oe[6],z[6]=oe[8],z[7]=oe[9],z[8]=oe[10]}let N=b[11];if(C.translateFromPivot)N.setAll(0);else N.copyFrom(C.pivot);let Y=b[0];Y.copyFrom(C.position);let te=Y.x-C.pivot.x,H=Y.y-C.pivot.y,j=Y.z-C.pivot.z,ie=te*z[0]+H*z[3]+j*z[6],X=te*z[1]+H*z[4]+j*z[7],J=te*z[2]+H*z[5]+j*z[8];ie+=N.x,X+=N.y,J+=N.z;let ne=h[W]=A.x+w.x*ie+v.x*X+D.x*J,se=h[W+1]=A.y+w.y*ie+v.y*X+D.y*J,le=h[W+2]=A.z+w.z*ie+v.z*X+D.z*J;if(this._computeBoundingBox)T.minimizeInPlaceFromFloats(ne,se,le),P.maximizeInPlaceFromFloats(ne,se,le);if(this._computeParticleColor&&C.color){let oe=C.color,Z=this._colors32;Z[O]=oe.r,Z[O+1]=oe.g,Z[O+2]=oe.b,Z[O+3]=oe.a}if(this._computeParticleTexture&&C.uv){let oe=C.uv,Z=this._uvs32;Z[R]=oe.x,Z[R+1]=oe.y}}if(o){if(i){if(this._computeParticleColor)o.updateVerticesData(n.ColorKind,_,!1,!1);if(this._computeParticleTexture)o.updateVerticesData(n.UVKind,y,!1,!1);o.updateVerticesData(n.PositionKind,h,!1,!1)}if(this._computeBoundingBox)if(o.hasBoundingInfo)o.getBoundingInfo().reConstruct(T,P,o._worldMatrix);else o.buildBoundingInfo(T,P,o._worldMatrix)}return this.afterUpdateParticles(t,s,i),this}dispose(){this.mesh?.dispose(),this.vars=null,this._positions=null,this._indices=null,this._normals=null,this._uvs=null,this._colors=null,this._indices32=null,this._positions32=null,this._uvs32=null,this._colors32=null}refreshVisibleSize(){if(!this._isVisibilityBoxLocked)this.mesh?.refreshBoundingInfo();return this}setVisibilityBox(t){if(!this.mesh)return;let s=t/2;this.mesh.buildBoundingInfo(new e(-s,-s,-s),new e(s,s,s))}get isAlwaysVisible(){return this._alwaysVisible}set isAlwaysVisible(t){if(!this.mesh)return;this._alwaysVisible=t,this.mesh.alwaysSelectAsActiveMesh=t}set computeParticleRotation(t){this._computeParticleRotation=t}set computeParticleColor(t){this._computeParticleColor=t}set computeParticleTexture(t){this._computeParticleTexture=t}get computeParticleColor(){return this._computeParticleColor}get computeParticleTexture(){return this._computeParticleTexture}set computeBoundingBox(t){this._computeBoundingBox=t}get computeBoundingBox(){return this._computeBoundingBox}initParticles(){}recycleParticle(t){return t}updateParticle(t){return t}beforeUpdateParticles(t,s,i){}afterUpdateParticles(t,s,i){}}var Ve=0;async function Su(t,s){return await new Promise((i,r)=>{let o,_;if(Ci())o=window,_="window";else if(typeof self<"u")o=self,_="self";else{r(Error("Cannot load script module outside of a window or a worker"));return}if(!o._LoadScriptModuleResolve)o._LoadScriptModuleResolve={};o._LoadScriptModuleResolve[Ve]=i,t+=`
            ${_}._LoadScriptModuleResolve[${Ve}](returnedValue);
            ${_}._LoadScriptModuleResolve[${Ve}] = undefined;
        `,Ve++,x.LoadScript(t,void 0,(h,y)=>{r(y||Error(h))},s,!0)})}var Ds=32768,Ue=0.28209479177387814,it=null,hs=null;function ds(t,s,i){let r=new Uint8Array(t),o=new Uint32Array(t.slice(0,12)),_=o[2],h=r[12],y=r[13],b=r[14],w=r[15],v=o[1];if(w||o[0]!=1347635022||v<2||v>4)return new Promise((A)=>{A({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let T=new ArrayBuffer(32*_),P=1/(1<<y),k=new Int32Array(1),W=new Uint8Array(k.buffer),O=function(A,V){return W[0]=A[V+0],W[1]=A[V+1],W[2]=A[V+2],W[3]=A[V+2]&128?255:0,k[0]*P},R=16,q=new Float32Array(T),C=new Float32Array(T),z=new Uint8ClampedArray(T),U=new Uint8ClampedArray(T);for(let A=0;A<_;A++)q[A*8+0]=O(r,R+0),q[A*8+1]=O(r,R+3),q[A*8+2]=O(r,R+6),R+=9;for(let A=0;A<_;A++){for(let V=0;V<3;V++){let Y=(r[R+_+A*3+V]-127.5)/38.25;z[A*32+24+V]=sr.Clamp((0.5+Ue*Y)*255,0,255)}z[A*32+24+3]=r[R+A]}R+=_*4;for(let A=0;A<_;A++)C[A*8+3+0]=Math.exp(r[R+0]/16-10),C[A*8+3+1]=Math.exp(r[R+1]/16-10),C[A*8+3+2]=Math.exp(r[R+2]/16-10),R+=3;if(v>=3){let A=Math.SQRT1_2;for(let V=0;V<_;V++){let N=[r[R+0],r[R+1],r[R+2],r[R+3]],Y=N[0]+(N[1]<<8)+(N[2]<<16)+(N[3]<<24),te=511,H=[],j=Y>>>30,ie=Y,X=0;for(let se=3;se>=0;--se)if(se!==j){let le=ie&511,oe=ie>>>9&1;if(ie=ie>>>10,H[se]=A*(le/511),oe===1)H[se]=-H[se];X+=H[se]*H[se]}let J=1-X;H[j]=Math.sqrt(Math.max(J,0));let ne=[3,0,1,2];for(let se=0;se<4;se++)U[V*32+28+se]=Math.round(127.5+H[ne[se]]*127.5);R+=4}}else for(let A=0;A<_;A++){let V=r[R+0],N=r[R+1],Y=r[R+2],te=V/127.5-1,H=N/127.5-1,j=Y/127.5-1;U[A*32+28+1]=V,U[A*32+28+2]=N,U[A*32+28+3]=Y;let ie=1-(te*te+H*H+j*j);U[A*32+28+0]=127.5+Math.sqrt(ie<0?0:ie)*127.5,R+=3}if(h){let V=((h+1)*(h+1)-1)*3,N=Math.ceil(V/16),Y=R,H=s.getEngine().getCaps().maxTextureSize,j=Math.ceil(_/H),ie=Qs(N,j*H*4*4);for(let X=0;X<_;X++)for(let J=0;J<V;J++){let ne=r[Y++],se=Math.floor(J/16),le=ie[se],oe=J%16,Z=X*16;le[oe+Z]=ne}return new Promise((X)=>{X({mode:0,data:T,hasVertexColors:!1,sh:ie,shDegree:h,trainedWithAntialiasing:!!b})})}return new Promise((A)=>{A({mode:0,data:T,hasVertexColors:!1,trainedWithAntialiasing:!!b})})}async function ps(t){if(it&&hs===t)return await it;let s=Su(`import createSpzModule from '${t}';
         const module = await createSpzModule();
         const returnedValue = module;`);return hs=t,it=s,await s}function*As(t,s,i=!1){let r=t.numPoints,o=32,_=new ArrayBuffer(32*r),h=new Float32Array(_),y=new Uint8Array(_),{positions:b,scales:w,colors:v,alphas:D,rotations:T}=t,P=null,k=t.shDegree,W=null,O=0,R=null,q=null,C=null;if(k>0&&t.sh.length>0){O=((k+1)*(k+1)-1)*3;let V=Math.ceil(O/16),Y=s.getEngine().getCaps().maxTextureSize,te=Math.ceil(r/Y);P=Qs(V,te*Y*4*4),R=new Int32Array(V),q=new Int32Array(V);for(let H=0;H<V;H++)R[H]=H*16,q[H]=Math.min((H+1)*16,O);C=P,W=t.sh}for(let A=0;A<r;A++){let V=A*8,N=A*32,Y=A*3,te=A*4;h[V+0]=b[Y+0],h[V+1]=b[Y+1],h[V+2]=b[Y+2],h[V+3]=Math.exp(w[Y+0]),h[V+4]=Math.exp(w[Y+1]),h[V+5]=Math.exp(w[Y+2]);let H=(0.5+Ue*v[Y+0])*255,j=(0.5+Ue*v[Y+1])*255,ie=(0.5+Ue*v[Y+2])*255;y[N+24]=H<=0?0:H>=255?255:H+0.5|0,y[N+25]=j<=0?0:j>=255?255:j+0.5|0,y[N+26]=ie<=0?0:ie>=255?255:ie+0.5|0,y[N+27]=1/(1+Math.exp(-D[A]))*255+0.5|0;let X=T[te+3]*127.5+127.5,J=T[te+0]*127.5+127.5,ne=T[te+1]*127.5+127.5,se=T[te+2]*127.5+127.5;if(y[N+28]=X<=0?0:X>=255?255:X+0.5|0,y[N+29]=J<=0?0:J>=255?255:J+0.5|0,y[N+30]=ne<=0?0:ne>=255?255:ne+0.5|0,y[N+31]=se<=0?0:se>=255?255:se+0.5|0,W&&C&&R&&q){let le=A*O,oe=A*16;for(let Z=0;Z<C.length;Z++){let he=C[Z],me=R[Z],ge=q[Z];for(let pe=me;pe<ge;pe++){let re=W[le+pe]*128+128;he[oe+pe-me]=re<=0?0:re>=255?255:re+0.5|0}}}if(A%Ds===0&&i)yield}let z,U;if(t.extensions)for(let A of t.extensions){let V=A;if(V.safeOrbitRadiusMin!==void 0){z=V.safeOrbitRadiusMin,U=[V.safeOrbitElevationMin,V.safeOrbitElevationMax];break}}return{mode:0,data:_,hasVertexColors:!1,sh:P!==null?P:void 0,shDegree:k>0?k:void 0,trainedWithAntialiasing:!!t.antialiased,safeOrbitCameraRadiusMin:z,safeOrbitCameraElevationMinMax:U}}async function _s(t,s){return await Zs(As(t,s,!0),ho())}class Xn{constructor(t={}){this.name=Ie.name,this._assetContainer=null,this.extensions=Ie.extensions,this._loadingOptions={...Xn._DefaultLoadingOptions,...t}}createPlugin(t){return new Xn(t[Ie.name])}async importMeshAsync(t,s,i,r,o,_){let h=this._tryCreateLODStream(s,i,r);if(h)return{meshes:[h],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(t,s,i,r).then((y)=>({meshes:y,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(t,s,i){if(typeof s!=="string")return null;let r;try{r=JSON.parse(s)}catch{return null}if(!xe.IsLODMetadata(r))return null;let o=t._blockEntityCollection;t._blockEntityCollection=!!this._assetContainer;try{let _=new xe("GaussianSplattingStream",r,i,t,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return _._parentContainer=this._assetContainer,_}finally{t._blockEntityCollection=o}}static _BuildPointCloud(t,s){if(!s.byteLength)return!1;let i=new Uint8Array(s),r=new Float32Array(s),o=32,_=i.length/o,h=function(y,b){let w=r[8*b+0],v=r[8*b+1],D=r[8*b+2];y.position=new e(w,v,D);let T=i[o*b+24+0]/255,P=i[o*b+24+1]/255,k=i[o*b+24+2]/255;y.color=new S(T,P,k,1)};return t.addPoints(_,h),!0}static _BuildMesh(t,s){let i=new p("PLYMesh",t),r=new Uint8Array(s.data),o=new Float32Array(s.data),_=32,h=r.length/32,y=[],b=new M;for(let w=0;w<h;w++){let v=o[8*w+0],D=o[8*w+1],T=o[8*w+2];y.push(v,D,T)}if(s.hasVertexColors){let w=new Float32Array(h*4);for(let v=0;v<h;v++){let D=r[32*v+24+0]/255,T=r[32*v+24+1]/255,P=r[32*v+24+2]/255;w[v*4+0]=D,w[v*4+1]=T,w[v*4+2]=P,w[v*4+3]=1}b.colors=w}return b.positions=y,b.indices=s.faces,b.applyToMesh(i),i}async _unzipWithFFlateAsync(t){let s=this._loadingOptions.fflate;if(!s){if(typeof window.fflate>"u")await x.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");s=window.fflate}let{unzipSync:i}=s,r=i(t),o=new Map;for(let[_,h]of Object.entries(r))o.set(_,h);return o}_parseAsync(t,s,i,r){let o=[],_=(R)=>{s._blockEntityCollection=!!this._assetContainer;let q=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(q._parentContainer=this._assetContainer,o.push(q),R.sogTextures)q.setSogTextureData(R.sogTextures);else q.updateData(R.data,R.sh,{flipY:!1},void 0,R.shDegree);q.scaling.y*=-1,q.computeWorldMatrix(!0),q.safeOrbitCameraLimits=Xn._ExtractSafeOrbitLimits(R),s._blockEntityCollection=!1},h=s.getEngine(),y=this._loadingOptions.useSogTextures;if(y&&!h.isWebGPU&&h.version<2)l.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),y=!1;let b=y?Le:It;if(typeof i==="string"){let R=JSON.parse(i);if(R&&R.means&&R.scales&&R.quats&&R.sh0)return new Promise((q,C)=>{b(R,r,s).then((z)=>{_(z),q(o)}).catch((z)=>{C(Error("Failed to parse SOG data.",{cause:z}))})})}let w=i instanceof ArrayBuffer?new Uint8Array(i):i;if(w[0]===80&&w[1]===75)return new Promise((R,q)=>{this._unzipWithFFlateAsync(w).then((C)=>{b(C,r,s).then((z)=>{_(z),R(o)}).catch((z)=>{q(Error("Failed to parse SOG zip data.",{cause:z}))})})});let v=(R)=>{Xn._ConvertPLYToSplat(i).then(async(q)=>{switch(s._blockEntityCollection=!!this._assetContainer,q.mode){case 0:{let C=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(C._parentContainer=this._assetContainer,o.push(C),C.updateData(q.data,q.sh,{flipY:!1},void 0,q.shDegree),C.scaling.y*=-1,q.chirality==="RightHanded")C.scaling.y*=-1;switch(q.upAxis){case"X":C.rotation=new e(0,0,Math.PI/2);break;case"Y":C.rotation=new e(0,0,Math.PI);break;case"Z":C.rotation=new e(-Math.PI/2,Math.PI,0);break}C.computeWorldMatrix(!0),C.safeOrbitCameraLimits=Xn._ExtractSafeOrbitLimits(q)}break;case 1:{let C=new Ff("PointCloud",1,s);if(Xn._BuildPointCloud(C,q.data))await C.buildMeshAsync().then((z)=>{o.push(z)});else C.dispose()}break;case 2:if(q.faces)o.push(Xn._BuildMesh(s,q));else throw Error("PLY mesh doesn't contain face informations.");break;default:throw Error("Unsupported Splat mode")}s._blockEntityCollection=!1,this.applyAutoCameraLimits(Xn._ExtractSafeOrbitLimits(q),s),R(o)})},D=w[0]===31&&w[1]===139,T=w[0]===78&&w[1]===71&&w[2]===83&&w[3]===80;if(!D&&!T)return new Promise((R)=>{v(R)});let P=(R,q)=>{s._blockEntityCollection=!!this._assetContainer;let C=this._loadingOptions.gaussianSplattingMesh??new es("GaussianSplatting",null,s,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(R.trainedWithAntialiasing){let U=C.material;U.kernelSize=0.1,U.compensation=!0}if(C._parentContainer=this._assetContainer,o.push(C),C.updateData(R.data,R.sh,{flipY:!1},void 0,R.shDegree),!this._loadingOptions.flipY)C.scaling.y*=-1,C.computeWorldMatrix(!0);s._blockEntityCollection=!1;let z=Xn._ExtractSafeOrbitLimits(R);C.safeOrbitCameraLimits=z,this.applyAutoCameraLimits(z,s),q(o)};if(this._loadingOptions.spzLibraryUrl)return ps(this._loadingOptions.spzLibraryUrl).then((R)=>{let q=R.loadSpzFromBuffer(new Uint8Array(i),{to:R.CoordinateSystem.RUB});return _s(q,s).then((C)=>new Promise((z)=>{P(C,z)}))});if(T)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let k=new ReadableStream({start(R){R.enqueue(new Uint8Array(i)),R.close()}}),W=new DecompressionStream("gzip"),O=k.pipeThrough(W);return new Promise((R)=>{new Response(O).arrayBuffer().then((q)=>{ds(q,s,this._loadingOptions).then((C)=>{P(C,R)})}).catch(()=>{v(R)})})}static _ExtractSafeOrbitLimits(t){if(t.safeOrbitCameraRadiusMin===void 0&&t.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:t.safeOrbitCameraRadiusMin,elevationMinMax:t.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(t,s){if(this._loadingOptions.disableAutoCameraLimits||!t)return;if(s.activeCamera?.getClassName()==="ArcRotateCamera"){let i=s.activeCamera;if(t.elevationMinMax)i.lowerBetaLimit=Math.PI*0.5-t.elevationMinMax[1],i.upperBetaLimit=Math.PI*0.5-t.elevationMinMax[0];if(t.radiusMin)i.lowerRadiusLimit=t.radiusMin}}loadAssetContainerAsync(t,s,i){let r=new Xr(t);return this._assetContainer=r,this.importMeshAsync(null,t,s,i).then((o)=>{for(let _ of o.meshes)r.meshes.push(_);return this._assetContainer=null,r}).catch((o)=>{throw this._assetContainer=null,o})}loadAsync(t,s,i){return this.importMeshAsync(null,t,s,i).then(()=>{})}static _ConvertPLYToSplat(t){let s=new Uint8Array(t),i=new TextDecoder().decode(s.slice(0,10240)),r=`end_header
`,o=i.indexOf(`end_header
`);if(o<0||!i)return new Promise((U)=>{U({mode:0,data:t,rawSplat:!0})});let _=parseInt(/element vertex (\d+)\n/.exec(i)[1]),h=/element face (\d+)\n/.exec(i),y=0;if(h)y=parseInt(h[1]);let b=/element chunk (\d+)\n/.exec(i),w=0;if(b)w=parseInt(b[1]);let v=0,D=0,T={double:8,int:4,uint:4,float:4,short:2,ushort:2,uchar:1,list:0},P={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},k=P.Chunk,W=[],O=[],R=i.slice(0,o).split(`
`),q={};for(let U of R)if(U.startsWith("property ")){let[,A,V]=U.split(" ");if(k==P.Chunk)O.push({name:V,type:A,offset:D}),D+=T[A];else if(k==P.Vertex)W.push({name:V,type:A,offset:v}),v+=T[A];else if(k==P.SH)W.push({name:V,type:A,offset:v});else if(k==P.Float_Tuple){let N=new DataView(t,D,T.float*2);q.safeOrbitCameraElevationMinMax=[N.getFloat32(0,!0),N.getFloat32(4,!0)]}else if(k==P.Float){let N=new DataView(t,D,T.float);q.safeOrbitCameraRadiusMin=N.getFloat32(0,!0)}else if(k==P.Uchar){let N=new DataView(t,D,T.uchar);if(V=="up_axis")q.upAxis=N.getUint8(0)==0?"X":N.getUint8(0)==1?"Y":"Z";else if(V=="chirality")q.chirality=N.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!T[A])l.Warn(`Unsupported property type: ${A}.`)}else if(U.startsWith("element ")){let[,A]=U.split(" ");if(A=="chunk")k=P.Chunk;else if(A=="vertex")k=P.Vertex;else if(A=="sh")k=P.SH;else if(A=="safe_orbit_camera_elevation_min_max_radians")k=P.Float_Tuple;else if(A=="safe_orbit_camera_radius_min")k=P.Float;else if(A=="up_axis"||A=="chirality")k=P.Uchar}let C=v,z=D;return es.ConvertPLYWithSHToSplatAsync(t).then(async(U)=>{let A=new DataView(t,o+11),V=z*w+C*_,N=[];if(y)for(let J=0;J<y;J++){let ne=A.getUint8(V);if(ne!=3)continue;V+=1;for(let se=0;se<ne;se++){let le=A.getUint32(V+(2-se)*4,!0);N.push(le)}V+=12}if(w)return await new Promise((J)=>{J({mode:0,data:U.buffer,sh:U.sh,shDegree:U.shDegree,faces:N,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let Y=0,te=0,H=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],j=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let J=0;J<W.length;J++){let ne=W[J];if(H.includes(ne.name))Y++;if(j.includes(ne.name))te++}let ie=Y==H.length&&te>=3,X=y?2:ie?0:1;return await new Promise((J)=>{J({...q,mode:X,data:U.buffer,sh:U.sh,shDegree:U.shDegree,faces:N,hasVertexColors:!!te,compressed:!1,rawSplat:!1})})})}}Xn._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?"https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js":void 0};var ms=!1;function jS(){if(ms)return;ms=!0,Br(new Xn)}var gs=!1;function Jo(){if(gs)return;gs=!0,K.prototype.createDynamicTexture=function(t,s,i,r){let o=new de(this,4);if(o.baseWidth=t,o.baseHeight=s,i)t=this.needPOTTextures?Rr(t,this._caps.maxTextureSize):t,s=this.needPOTTextures?Rr(s,this._caps.maxTextureSize):s;return o.width=t,o.height=s,o.isReady=!1,o.generateMipMaps=i,o.samplingMode=r,this.updateTextureSamplingMode(r,o),this._internalTexturesCache.push(o),o},K.prototype.updateDynamicTexture=function(t,s,i,r=!1,o,_=!1,h=!1){if(!t)return;let y=this._gl,b=y.TEXTURE_2D,w=this._bindTextureDirectly(b,t,!0,_);if(this._unpackFlipY(i===void 0?t.invertY:i),r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);let v=this._getWebGLTextureType(t.type),D=this._getInternalFormat(o?o:t.format),T=this._getRGBABufferInternalSizedFormat(t.type,D);if(y.texImage2D(b,0,T,D,v,s),t.generateMipMaps)y.generateMipmap(b);if(!w)this._bindTextureDirectly(b,null);if(r)y.pixelStorei(y.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0);if(o)t.format=o;t._dynamicTextureSource=s,t._premulAlpha=r,t.invertY=i||!1,t.isReady=!0}}Jo();jS();
export{Yx,ee,_u,uc,gu,Ml,jx,xu,vu,Qx,qx,YA,Lf,Zx,Bs,hc,Kx,Jx,ev,ks,Ar,bu,jA,tv,Jo,Su,Nf,fc,iv,Ff,Xn,jS};

//# debugId=8834AFF4CA5AA2CD64756E2164756E21
//# sourceMappingURL=site-12x3ftge.js.map
