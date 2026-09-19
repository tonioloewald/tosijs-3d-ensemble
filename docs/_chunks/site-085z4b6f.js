import{Y as Ks}from"./site-m4t05vcy.js";import{Vc as es,_c as li}from"./site-dzrtkxd1.js";import{sd as q}from"./site-pt5p0wk7.js";import{Cd as le,Hd as us,Jd as Ve,Pd as ue,Rd as Te,Sd as jt,Td as ge,Vd as Yt}from"./site-b7gzyf2c.js";import{Wd as ve}from"./site-62mkrnaq.js";import{$d as si,ce as ii,ge as se,ke as Xe,me as Qt,te as ss,ve as K,ye as ci}from"./site-12bb7meq.js";import{Tf as Is,Wf as ht,Zf as Oe}from"./site-fa0kz5e5.js";import{Yv as Ae,iw as zs,jw as Ps,lw as ae}from"./site-7fy7xy18.js";import{gx as $s}from"./site-1g28dxhq.js";import{qx as me}from"./site-69p8f7zb.js";import{vx as ce,wx as V}from"./site-wmyx2vvd.js";import{EB as N}from"./site-f0mnszbz.js";import{qC as St}from"./site-a1deyge1.js";import{NC as fi}from"./site-9qfrrh4g.js";import{ZD as re}from"./site-kzjqtxtv.js";import{uE as yt}from"./site-jgc8qq28.js";import{wE as it}from"./site-t9p8g1b7.js";import{QE as ks,RE as Bs,cF as he,dF as S,eF as oe,fF as Ne,gF as H,hF as U}from"./site-tqamgz2t.js";import{pF as fe}from"./site-0a3qjmsp.js";import{NF as Js}from"./site-v65c4n4n.js";import{SF as Ze}from"./site-hbs6e08d.js";import{kG as X}from"./site-jh68drj2.js";import{mG as Ee}from"./site-dmc53f0j.js";var Ie={name:"splat",extensions:{".splat":{isBinary:!0},".ply":{isBinary:!0},".spz":{isBinary:!0},".json":{isBinary:!1},".sog":{isBinary:!0}}};jt();Yt();Qt();var $t,Kt;class te extends K{_isShaderMaterial(e){if(!e)return!1;return e.getClassName()==="ShaderMaterial"}constructor(e,t=null,s=null,i=null,r,n,o,a){super(e,t,s,i,r);if(this.useVertexColor=n,this.useVertexAlpha=o,this.color=new ce(1,1,1),this.alpha=1,this._shaderLanguage=0,this._ownsMaterial=!1,i)this.color=i.color.clone(),this.alpha=i.alpha,this.useVertexColor=i.useVertexColor,this.useVertexAlpha=i.useVertexAlpha;this.intersectionThreshold=0.1;let l=[],u={attributes:[N.PositionKind],uniforms:["world","viewProjection"],needAlphaBlending:!0,defines:l,useClipPlane:null,shaderLanguage:0};if(!this.useVertexAlpha)u.needAlphaBlending=!1;else u.defines.push("#define VERTEXALPHA");if(!this.useVertexColor)u.uniforms.push("color"),this._color4=new V;else u.defines.push("#define VERTEXCOLOR"),u.attributes.push(N.ColorKind);if(a)this.material=a;else{if(this.getScene().getEngine().isWebGPU&&!te.ForceGLSL)this._shaderLanguage=1;u.shaderLanguage=this._shaderLanguage,u.extraInitializationsAsync=async()=>{if(this._shaderLanguage===1)await Promise.all([import("./color.vertex-esaxmq5c.js"),import("./color.fragment-nsgmwv8g.js")]);else await Promise.all([import("./color.vertex-qdqs3mxg.js"),import("./color.fragment-et2cxdvr.js")])};let p=new le("colorShader",this.getScene(),"color",u,!1);p.doNotSerialize=!0,this._ownsMaterial=!0,this._setInternalMaterial(p)}}getClassName(){return"LinesMesh"}get material(){return this._internalAbstractMeshDataInfo._material}set material(e){let t=this.material;if(t===e)return;let s=t&&this._ownsMaterial;if(this._ownsMaterial=!1,this._setInternalMaterial(e),s)t?.dispose()}_setInternalMaterial(e){if(this._setMaterial(e),this.material)this.material.fillMode=Oe.LineListDrawMode,this.material.disableLighting=!0}get checkCollisions(){return!1}set checkCollisions(e){}_bind(e,t){if(!this._geometry)return this;let s=this.isUnIndexed?null:this._geometry.getIndexBuffer();if(!this._userInstancedBuffersStorage||this.hasThinInstances)this._geometry._bind(t,s);else this._geometry._bind(t,s,this._userInstancedBuffersStorage.vertexBuffers,this._userInstancedBuffersStorage.vertexArrayObjects);if(!this.useVertexColor&&this._isShaderMaterial(this.material)){let{r:i,g:r,b:n}=this.color;this._color4.set(i,r,n,this.alpha),this.material.setColor4("color",this._color4)}return this}_draw(e,t,s){if(!this._geometry||!this._geometry.getVertexBuffers()||!this._unIndexed&&!this._geometry.getIndexBuffer())return this;let i=this.getScene().getEngine();if(this._unIndexed)i.drawArraysType(Oe.LineListDrawMode,e.verticesStart,e.verticesCount,s);else i.drawElementsType(Oe.LineListDrawMode,e.indexStart,e.indexCount,s);return this}dispose(e,t=!1,s){if(!s){if(this._ownsMaterial)this.material?.dispose(!1,!1,!0);else if(t)this.material?.dispose(!1,!1,!0)}super.dispose(e)}clone(e,t=null,s){if(t&&t._addToSceneRootNodes===void 0){let i=t;return i.source=this,new te(e,this.getScene(),i.parent,i.source,i.doNotCloneChildren)}return new te(e,this.getScene(),t,this,s)}createInstance(e){let t=new rt(e,this);if(this.instancedBuffers){t.instancedBuffers={};for(let s in this.instancedBuffers)t.instancedBuffers[s]=this.instancedBuffers[s]}return t}serialize(e){super.serialize(e),e.color=this.color.asArray(),e.alpha=this.alpha}static Parse(e,t){let s=new te(e.name,t);return s.color=ce.FromArray(e.color),s.alpha=e.alpha,s}}te.ForceGLSL=!1;class rt extends es{constructor(e,t){super(e,t);this.intersectionThreshold=t.intersectionThreshold}getClassName(){return"InstancedLinesMesh"}}var Jt=!1;function Xi(){if(Jt)return;Jt=!0,K._LinesMeshParser=(e,t)=>te.Parse(e,t)}($t=te.prototype).enableEdgesRendering??($t.enableEdgesRendering=it("LinesMesh","enableEdgesRendering"));(Kt=rt.prototype).enableEdgesRendering??(Kt.enableEdgesRendering=it("InstancedLinesMesh","enableEdgesRendering"));function is(e){let t=[],s=[],i=e.lines,r=e.colors,n=[],o=0;for(let l=0;l<i.length;l++){let u=i[l];for(let c=0;c<u.length;c++){let{x:p,y:f,z:g}=u[c];if(s.push(p,f,g),r){let x=r[l],{r:b,g:M,b:h,a:m}=x[c];n.push(b,M,h,m)}if(c>0)t.push(o-1),t.push(o);o++}}let a=new se;if(a.indices=t,a.positions=s,r)a.colors=n;return a}function rs(e){let t=e.dashSize||3,s=e.gapSize||1,i=e.dashNb||200,r=e.points,n=[],o=[],a=S.Zero(),l=0,u,c,p=0,f;for(f=0;f<r.length-1;f++)r[f+1].subtractToRef(r[f],a),l+=a.length();let g=l/i,x=t*g/(t+s);for(f=0;f<r.length-1;f++){r[f+1].subtractToRef(r[f],a),u=Math.floor(a.length()/g),a.normalize();for(let M=0;M<u;M++)c=g*M,n.push(r[f].x+c*a.x,r[f].y+c*a.y,r[f].z+c*a.z),n.push(r[f].x+(c+x)*a.x,r[f].y+(c+x)*a.y,r[f].z+(c+x)*a.z),o.push(p,p+1),p+=2}let b=new se;return b.positions=n,b.indices=o,b}function We(e,t,s=null){let{instance:i,lines:r,colors:n}=t;if(i){let u=i.getVerticesData(N.PositionKind),c,p;if(n)c=i.getVerticesData(N.ColorKind);let f=0,g=0;for(let x=0;x<r.length;x++){let b=r[x];for(let M=0;M<b.length;M++){if(u[f]=b[M].x,u[f+1]=b[M].y,u[f+2]=b[M].z,n&&c)p=n[x],c[g]=p[M].r,c[g+1]=p[M].g,c[g+2]=p[M].b,c[g+3]=p[M].a,g+=4;f+=3}}if(i.updateVerticesData(N.PositionKind,u,!1,!1),n&&c)i.updateVerticesData(N.ColorKind,c,!1,!1);return i.refreshBoundingInfo(),i}let a=new te(e,s,null,void 0,void 0,n?!0:!1,t.useVertexAlpha,t.material);return is(t).applyToMesh(a,t.updatable),a}function os(e,t,s=null){let i=t.colors?[t.colors]:null;return We(e,{lines:[t.points],updatable:t.updatable,instance:t.instance,colors:i,useVertexAlpha:t.useVertexAlpha,material:t.material},s)}function ns(e,t,s=null){let{points:i,instance:r}=t,n=t.gapSize||1,o=t.dashSize||3;if(r){let u=(c)=>{let p=S.Zero(),f=c.length/6,g=0,x,b,M=0,h,m;for(h=0;h<i.length-1;h++)i[h+1].subtractToRef(i[h],p),g+=p.length();let d=g/f,y=r._creationDataStorage.dashSize,w=r._creationDataStorage.gapSize,_=y*d/(y+w);for(h=0;h<i.length-1;h++){i[h+1].subtractToRef(i[h],p),x=Math.floor(p.length()/d),p.normalize(),m=0;while(m<x&&M<c.length)b=d*m,c[M]=i[h].x+b*p.x,c[M+1]=i[h].y+b*p.y,c[M+2]=i[h].z+b*p.z,c[M+3]=i[h].x+(b+_)*p.x,c[M+4]=i[h].y+(b+_)*p.y,c[M+5]=i[h].z+(b+_)*p.z,M+=6,m++}while(M<c.length)c[M]=i[h].x,c[M+1]=i[h].y,c[M+2]=i[h].z,M+=3};if(t.dashNb||t.dashSize||t.gapSize||t.useVertexAlpha||t.material)X.Warn("You have used an option other than points with the instance option. Please be aware that these other options will be ignored.");return r.updateMeshPositions(u,!1),r}let a=new te(e,s,null,void 0,void 0,void 0,t.useVertexAlpha,t.material);return rs(t).applyToMesh(a,t.updatable),a._creationDataStorage=new ss,a._creationDataStorage.dashSize=o,a._creationDataStorage.gapSize=n,a}var er={CreateDashedLines:ns,CreateLineSystem:We,CreateLines:os},ts=!1;function as(){if(ts)return;ts=!0,se.CreateLineSystem=is,se.CreateDashedLines=rs,K.CreateLines=(e,t,s=null,i=!1,r=null)=>os(e,{points:t,updatable:i,instance:r},s),K.CreateDashedLines=(e,t,s,i,r,n=null,o,a)=>ns(e,{points:t,dashSize:s,gapSize:i,dashNb:r,updatable:o,instance:a},n)}as();var ls=0.28209479177387814;async function be(e,t,s){return await new Promise((r,n)=>{let o=s.createCanvasImage();if(!o)throw Error("Failed to create ImageBitmap");o.onload=()=>{try{let l=s.createCanvas(o.width,o.height);if(!l)throw Error("Failed to create canvas");let u=l.getContext("2d");if(!u)throw Error("Failed to get 2D context");u.drawImage(o,0,0);let c=u.getImageData(0,0,l.width,l.height);r({bits:new Uint8Array(c.data.buffer),width:c.width,height:c.height})}catch(l){n(`Error loading image ${o.src} with exception: ${l}`)}},o.onerror=(l)=>{n(`Error loading image ${o.src} with exception: ${l}`)},o.crossOrigin="anonymous";let a;if(typeof e==="string"){if(!t)throw Error("filename is required when using a URL");o.src=e+t}else{let l=new Blob([e],{type:"image/webp"});a=URL.createObjectURL(l),o.src=a}})}async function pi(e,t,s){let i=e.count?e.count:e.means.shape[0],r=32,n=new ArrayBuffer(32*i),o=new Float32Array(n),a=new Float32Array(n),l=new Uint8ClampedArray(n),u=new Uint8ClampedArray(n),c=(h)=>Math.sign(h)*(Math.exp(Math.abs(h))-1),p=t[0].bits,f=t[1].bits;if(!Array.isArray(e.means.mins)||!Array.isArray(e.means.maxs))throw Error("Missing arrays in SOG data.");for(let h=0;h<i;h++){let m=h*4;for(let d=0;d<3;d++){let y=e.means.mins[d],w=e.means.maxs[d],_=f[m+d],v=p[m+d],R=_<<8|v,L=ue.Lerp(y,w,R/65535);o[h*8+d]=c(L)}}let g=t[2].bits;if(e.version===2){if(!e.scales.codebook)throw Error("Missing codebook in SOG version 2 scales data.");for(let h=0;h<i;h++){let m=h*4;for(let d=0;d<3;d++){let y=e.scales.codebook[g[m+d]],w=Math.exp(y);a[h*8+3+d]=w}}}else{if(!Array.isArray(e.scales.mins)||!Array.isArray(e.scales.maxs))throw Error("Missing arrays in SOG scales data.");for(let h=0;h<i;h++){let m=h*4;for(let d=0;d<3;d++){let y=g[m+d],w=ue.Lerp(e.scales.mins[d],e.scales.maxs[d],y/255),_=Math.exp(w);a[h*8+3+d]=_}}}let x=t[4].bits;if(e.version===2){if(!e.sh0.codebook)throw Error("Missing codebook in SOG version 2 sh0 data.");for(let h=0;h<i;h++){let m=h*4;for(let d=0;d<3;d++){let y=0.5+e.sh0.codebook[x[m+d]]*ls;l[h*32+24+d]=Math.max(0,Math.min(255,Math.round(255*y)))}l[h*32+24+3]=x[m+3]}}else{if(!Array.isArray(e.sh0.mins)||!Array.isArray(e.sh0.maxs))throw Error("Missing arrays in SOG sh0 data.");for(let h=0;h<i;h++){let m=h*4;for(let d=0;d<4;d++){let y=e.sh0.mins[d],w=e.sh0.maxs[d],_=x[m+d],v=ue.Lerp(y,w,_/255),R;if(d<3)R=0.5+v*ls;else R=1/(1+Math.exp(-v));l[h*32+24+d]=Math.max(0,Math.min(255,Math.round(255*R)))}}}let b=(h)=>(h/255-0.5)*2/Math.SQRT2,M=t[3].bits;for(let h=0;h<i;h++){let m=M[h*4+0],d=M[h*4+1],y=M[h*4+2],w=M[h*4+3],_=b(m),v=b(d),R=b(y),L=w-252,k=_*_+v*v+R*R,C=Math.sqrt(Math.max(0,1-k)),A;switch(L){case 0:A=[C,_,v,R];break;case 1:A=[_,C,v,R];break;case 2:A=[_,v,C,R];break;case 3:A=[_,v,R,C];break;default:throw Error("Invalid quaternion mode")}u[h*32+28+0]=A[0]*127.5+127.5,u[h*32+28+1]=A[1]*127.5+127.5,u[h*32+28+2]=A[2]*127.5+127.5,u[h*32+28+3]=A[3]*127.5+127.5}if(e.shN){let h=e.shN.bands?(e.shN.bands+1)**2-1:e.shN.shape[1]/3,m=e.shN.bands!==void 0&&e.shN.bands!==null?e.shN.bands:Math.round(Math.sqrt(h+1)-1),d=t[5].bits,y=t[6].bits,w=t[5].width,_=h*3,v=Math.ceil(_/16),L=s.getEngine().getCaps().maxTextureSize,k=Math.ceil(i/L),C=Te(v,k*L*4*4);if(e.version===2){if(!e.shN.codebook)throw Error("Missing codebook in SOG version 2 shN data.");for(let A=0;A<i;A++){let z=y[A*4+0]+(y[A*4+1]<<8),T=z%64*h,F=Math.floor(z/64);for(let O=0;O<h;O++)for(let B=0;B<3;B++){let G=O*3+B,E=Math.floor(G/16),D=C[E],j=G%16,ee=A*16,ie=e.shN.codebook[d[(T+O)*4+B+F*w*4]]*127.5+127.5;D[j+ee]=Math.max(0,Math.min(255,ie))}}}else for(let A=0;A<i;A++){let z=y[A*4+0]+(y[A*4+1]<<8),T=z%64*h,F=Math.floor(z/64),O=e.shN.mins,B=e.shN.maxs;for(let G=0;G<3;G++)for(let E=0;E<h/3;E++){let D=E*3+G,j=Math.floor(D/16),ee=C[j],ie=D%16,Y=A*16,I=ue.Lerp(O,B,d[(T+E)*4+G+F*w*4]/255)*127.5+127.5;ee[ie+Y]=Math.max(0,Math.min(255,I))}}return await new Promise((A)=>{A({mode:0,data:n,hasVertexColors:!1,sh:C,shDegree:m})})}return await new Promise((h)=>{h({mode:0,data:n,hasVertexColors:!1})})}async function cs(e,t,s){let i,r;if(e instanceof Map){r=e;let a=r.get("meta.json");if(!a)throw Error("meta.json not found in files Map");i=JSON.parse(new TextDecoder().decode(a))}else i=e;let n=[...i.means.files,...i.scales.files,...i.quats.files,...i.sh0.files];if(i.shN)n.push(...i.shN.files);let o=await Promise.all(n.map(async(a)=>{if(r&&r.has(a)){let l=r.get(a);return await be(l,a,s.getEngine())}else return await be(t,a,s.getEngine())}));return await pi(i,o,s)}function _i(e,t,s,i){let r=new ve(t,s,i,q.TEXTUREFORMAT_RGBA,e,!1,!1,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURETYPE_UNSIGNED_BYTE);return r.wrapU=q.TEXTURE_CLAMP_ADDRESSMODE,r.wrapV=q.TEXTURE_CLAMP_ADDRESSMODE,r}function nt(e,t){return _i(e,t.bits,t.width,t.height)}async function ot(e,t,s){let i=s.getEngine();if(typeof createImageBitmap==="function")try{let n=t.toLowerCase().endsWith(".png")?"image/png":"image/webp",o;if(typeof e==="string"){let l=await re.LoadFileAsync(e+t,!0);o=new Blob([l],{type:n})}else o=new Blob([e],{type:n});let a=await createImageBitmap(o,{premultiplyAlpha:"none",colorSpaceConversion:"none"});try{let l=new ve(null,a.width,a.height,q.TEXTUREFORMAT_RGBA,s,!1,!1,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURETYPE_UNSIGNED_BYTE);l.wrapU=q.TEXTURE_CLAMP_ADDRESSMODE,l.wrapV=q.TEXTURE_CLAMP_ADDRESSMODE;let u=l.getInternalTexture();if(u)i.updateDynamicTexture(u,a,!1,!1);return l}finally{a.close()}}catch{}let r=await be(e,t,i);return nt(s,r)}function mi(e,t,s,i){let r=(o)=>Math.sign(o)*(Math.exp(Math.abs(o))-1);if(!Array.isArray(e.means.mins)||!Array.isArray(e.means.maxs))throw Error("Missing arrays in SOG data.");let n=new Float32Array(i*4);for(let o=0;o<i;o++){let a=o*4;for(let l=0;l<3;l++){let u=s[a+l]<<8|t[a+l],c=ue.Lerp(e.means.mins[l],e.means.maxs[l],u/65535);n[o*4+l]=r(c)}n[o*4+3]=1}return n}async function Ce(e,t,s,i=!0,r,n){let o,a;if(e instanceof Map){a=e;let T=a.get("meta.json");if(!T)throw Error("meta.json not found in files Map");o=JSON.parse(new TextDecoder().decode(T))}else o=e;let l=async(T)=>{if(a&&a.has(T))return await be(a.get(T),T,s.getEngine());if(r){let F=new Uint8Array(await r.loadFileAsync(t+T,n));return await be(F,T,s.getEngine())}return await be(t,T,s.getEngine())},u=async(T)=>{if(a&&a.has(T))return await ot(a.get(T),T,s);if(r){let F=new Uint8Array(await r.loadFileAsync(t+T,n));return await ot(F,T,s)}return await ot(t,T,s)},c=[...o.scales.files,...o.quats.files,...o.sh0.files,...o.shN?.files??[]],p,f,g,x,b=null,M;if(i){let[T,F]=await Promise.all([Promise.all(o.means.files.map(l)),Promise.all(c.map(u))]);b=[T[0],T[1]],M=F,p=nt(s,T[0]),f=nt(s,T[1]),g=T[0].width,x=T[0].height}else{let[T,F]=await Promise.all([Promise.all(o.means.files.map(u)),Promise.all(c.map(u))]);M=F,p=T[0],f=T[1];let O=p.getSize();g=O.width,x=O.height}let h=o.count??o.means.shape[0],m=g*x;if(m<h)throw Error(`SOG texture contains ${m} texels, but metadata references ${h} splats.`);let d=M[0],y=M[1],w=M[2],_,v,R=0,L=0;if(o.shN&&M.length>=5)_=M[3],v=M[4],R=o.shN.bands?(o.shN.bands+1)**2-1:o.shN.shape[1]/3,L=o.shN.bands??Math.round(Math.sqrt(R+1)-1);let k;if(o.version===2){let F=new Float32Array(768);if(o.scales.codebook)F.set(o.scales.codebook.slice(0,256),0);if(o.sh0.codebook)F.set(o.sh0.codebook.slice(0,256),256);if(o.shN?.codebook)F.set(o.shN.codebook.slice(0,256),512);k=new ve(F,768,1,q.TEXTUREFORMAT_R,s,!1,!1,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURETYPE_FLOAT),k.wrapU=q.TEXTURE_CLAMP_ADDRESSMODE,k.wrapV=q.TEXTURE_CLAMP_ADDRESSMODE}let C=o.means.mins,A=o.means.maxs,z={version:o.version===2?2:1,splatCount:h,shDegree:L,meansTextureL:p,meansTextureU:f,scalesTexture:d,quatsTexture:y,sh0Texture:w,shCentroidsTexture:_,shLabelsTexture:v,codebookTexture:k,meansMin:[C[0],C[1],C[2]],meansMax:[A[0],A[1],A[2]],scalesMin:Array.isArray(o.scales.mins)?[o.scales.mins[0],o.scales.mins[1],o.scales.mins[2]]:void 0,scalesMax:Array.isArray(o.scales.maxs)?[o.scales.maxs[0],o.scales.maxs[1],o.scales.maxs[2]]:void 0,sh0Min:Array.isArray(o.sh0.mins)?[o.sh0.mins[0],o.sh0.mins[1],o.sh0.mins[2],o.sh0.mins[3]]:void 0,sh0Max:Array.isArray(o.sh0.maxs)?[o.sh0.maxs[0],o.sh0.maxs[1],o.sh0.maxs[2],o.sh0.maxs[3]]:void 0,shnMin:typeof o.shN?.mins==="number"?o.shN.mins:void 0,shnMax:typeof o.shN?.maxs==="number"?o.shN.maxs:void 0,shCoeffCount:R,positions:b?mi(o,b[0].bits,b[1].bits,h):new Float32Array(0)};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:L,sogTextures:z}}us();var pe=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,hs=`precision highp float;
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
`,_e=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,fs=`
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
`,ds="gsSogRotDecodeToWorkBuffer",ps=`precision highp float;
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
`,_s=`
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
`,ms="gsSogShDecodeToWorkBuffer",gs=`precision highp float;
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
`,xs=`
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
`,ys="gsWorkBufferRelayout",Ss=`precision highp float;
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
`,Ms="gsWorkBufferShCopy",bs=`precision highp float;
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
`,vs=`
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
`,ws="gsWorkBufferRotCopy",Rs=`precision highp float;
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
`,Ts=`
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
`,Cs=`
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
`;class Ue{get supportsAsyncCentersReadback(){let e=this._scene.getEngine();if(e.isWebGPU)return!0;let t=e;return!!t._gl&&typeof t._readPixelsAsync==="function"&&(t.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map((e)=>e.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(e,t,s,i,r){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=e,this._shaderLanguage=e.getEngine().isWebGPU?1:0,this._capacity=Math.max(1,t),s)this._mrt=s.mrt,this._textureSize=s.width,this._baseOffset=s.baseOffset,this._ownsMrt=!1;else this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,t)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt("gsWorkBuffer",!0);if(i&&i.textureCount>0){if(i.externalMrts)this._shMrts=i.externalMrts.slice(0,i.textureCount),this._ownsShMrts=!1;else{for(let n=0;n<i.textureCount;n++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${n}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}if(r){if(r.externalMrt)this._rotMrt=r.externalMrt,this._ownsRotMrt=!1;else this._rotMrt=this._createRotMrt("gsWorkBufferRot",!0),this._ownsRotMrt=!0;this._rotMaterial=this._createRotMaterial()}if(this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,!this._ownsMrt)this.isRelayoutReady()}rebindAtlas(e){if(!this._ownsMrt)this._mrt=e}rebindShAtlas(e){if(!this._ownsShMrts&&e&&this._shMrts.length)this._shMrts=e.slice(0,this._shMrts.length)}rebindRotAtlas(e){if(!this._ownsRotMrt&&e&&this._rotMrt)this._rotMrt=e}setBaseOffset(e){if(!this._ownsMrt)this._baseOffset=e}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){X.Warn("GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.");return}let e=this._textureSize,t=Math.max(1,Math.floor(this._capacity/e)),s=Math.floor(this._baseOffset/e);if(!this._backupMrt)this._backupMrt=this._createMrt("gsAtlasBackup",!1,e,t);if(this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,e,e,0,-s),this._shMrts.length&&this._shCopyMaterial){if(!this._backupShMrts)this._backupShMrts=this._shMrts.map((i,r)=>this._createShMrt(`gsShAtlasBackup${r}`,!1,e,t));for(let i=0;i<this._shMrts.length;i++)this._renderShCopyPass(this._backupShMrts[i],this._shMrts[i].textures[0],this._mrt.textures[0],0,e,e,0,-s)}if(this._rotMrt&&this._rotCopyMaterial){if(!this._backupRotMrt)this._backupRotMrt=this._createRotMrt("gsRotAtlasBackup",!1,e,t);this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,e,e,0,-s)}this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let e=this._textureSize,t=Math.max(1,Math.floor(this._capacity/e)),s=Math.floor(this._baseOffset/e),i=this._scene.getEngine();i.enableScissor(0,s,e,t);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,e,e,0,s),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let r=0;r<this._shMrts.length&&r<this._backupShMrts.length;r++)this._renderShCopyPass(this._shMrts[r],this._backupShMrts[r].textures[0],this._mrt.textures[0],0,e,e,0,s);if(this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial)this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,e,e,0,s)}finally{i.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let r of this._backupShMrts)r.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(e,t,s=this._textureSize,i=this._textureSize){let r=this._scene.getEngine()._caps.textureHalfFloatRender?q.TEXTURETYPE_HALF_FLOAT:q.TEXTURETYPE_FLOAT,n=new Ve(e,{width:s,height:i},4,this._scene,{types:[q.TEXTURETYPE_FLOAT,r,r,q.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURE_NEAREST_SAMPLINGMODE],formats:[q.TEXTUREFORMAT_RGBA,q.TEXTUREFORMAT_RGBA,q.TEXTUREFORMAT_RGBA,q.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${e}Centers`,`${e}CovA`,`${e}CovB`,`${e}Colors`]);if(n.clearColor=new V(0,0,0,0),n.renderList=[],t)n.onClearObservable.add(()=>{});return n}_createShMrt(e,t,s=this._textureSize,i=this._textureSize){let r=new Ve(e,{width:s,height:i},1,this._scene,{types:[q.TEXTURETYPE_UNSIGNED_INTEGER],formats:[q.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[q.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[e]);if(r.clearColor=new V(0,0,0,0),r.renderList=[],t)r.onClearObservable.add(()=>{});return r}_createRotMrt(e,t,s=this._textureSize,i=this._textureSize){let r=this._scene.getEngine()._caps.textureHalfFloatRender?q.TEXTURETYPE_HALF_FLOAT:q.TEXTURETYPE_FLOAT,n=new Ve(e,{width:s,height:i},3,this._scene,{types:[r,r,r],formats:[q.TEXTUREFORMAT_RGBA,q.TEXTUREFORMAT_RGBA,q.TEXTUREFORMAT_RGBA],samplingModes:[q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${e}A`,`${e}B`,`${e}Scale`]);if(n.clearColor=new V(0,0,0,0),n.renderList=[],t)n.onClearObservable.add(()=>{});return n}async decodeAsync(e,t){if(this._disposed)return;this._applyPack(e);let s=this._shMaterial!==null&&this._shMrts.length>0;if(s)this._applyShPack(e);let i=this._rotMaterial!==null&&this._rotMrt!==null;if(i)this._applyRotPack(e);await new Promise((r)=>{let n=()=>{if(this._disposed){r();return}if(!this._material.isReady(this._quad)||s&&!this._shMaterial.isReady(this._quad)||i&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(n);return}let o=this._textureSize,a=this._baseOffset+t;if(this._material.setInt("uOffset",a),s)this._shMaterial.setInt("uOffset",a);if(i)this._rotMaterial.setInt("uOffset",a);let l=Math.floor(a/o),u=Math.max(1,Math.ceil((a+e.splatCount)/o)-l),c=this._scene.getEngine();c.enableScissor(0,l,o,u);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),s){for(let p=0;p<this._shMrts.length;p++)this._shMaterial.setInt("uShTextureIndex",p),this._quad.material=this._shMaterial,this._shMrts[p].renderList=[this._quad],this._shMrts[p].render();this._quad.material=this._material}if(i)this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material}finally{c.disableScissor()}r()};this._scene.onBeforeRenderObservable.addOnce(n)})}isRelayoutReady(){if(this._disposed)return!1;if(!this._copyMaterial)this._copyMaterial=this._createCopyMaterial();if(this._shMrts.length&&!this._shCopyMaterial)this._shCopyMaterial=this._createShCopyMaterial();if(this._rotMrt&&!this._rotCopyMaterial)this._rotCopyMaterial=this._createRotCopyMaterial();this._bindCopyMaterialsToAtlas();let e=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),t=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&e&&t}_bindCopyMaterialsToAtlas(){let e=this._mrt.textures;if(this._copyMaterial)this._copyMaterial.setTexture("uMapTex",e[0]),this._copyMaterial.setTexture("uSrc0",e[0]),this._copyMaterial.setTexture("uSrc1",e[1]),this._copyMaterial.setTexture("uSrc2",e[2]),this._copyMaterial.setTexture("uSrc3",e[3]);if(this._shCopyMaterial&&this._shMrts.length)this._shCopyMaterial.setTexture("uMapTex",e[0]),this._shCopyMaterial.setTexture("uSrcSh",this._shMrts[0].textures[0]);if(this._rotCopyMaterial&&this._rotMrt){let t=this._rotMrt.textures;this._rotCopyMaterial.setTexture("uMapTex",e[0]),this._rotCopyMaterial.setTexture("uSrc0",t[0]),this._rotCopyMaterial.setTexture("uSrc1",t[1]),this._rotCopyMaterial.setTexture("uSrc2",t[2])}}relayoutSync(e){if(this._disposed||!this._copyMaterial)return;let t=this._textureSize,s=t,i=this._ownsMrt?t:Math.max(1,Math.floor(this._capacity/t));if(!this._relayoutMapData)this._relayoutMapData=new Float32Array(s*i);let r=this._relayoutMapData;if(r.fill(-1),r.set(e.subarray(0,Math.min(e.length,r.length))),!this._relayoutMapTexture)this._relayoutMapTexture=new ve(r,s,i,q.TEXTUREFORMAT_R,this._scene,!1,!1,q.TEXTURE_NEAREST_SAMPLINGMODE,q.TEXTURETYPE_FLOAT);else this._relayoutMapTexture.update(r);let n=this._relayoutMapTexture;if(this._ownsMrt){let f=this._createMrt("gsRelayoutTemp",!1);try{this._renderRelayoutPass(f,this._mrt.textures,n,1),this._renderRelayoutPass(this._mrt,f.textures,n,0)}finally{f.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let g=0;g<this._shMrts.length;g++){let x=this._createShMrt("gsShRelayoutTemp",!1);try{this._renderShCopyPass(x,this._shMrts[g].textures[0],n,1),this._renderShCopyPass(this._shMrts[g],x.textures[0],n,0)}finally{x.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let g=this._createRotMrt("gsRotRelayoutTemp",!1);try{this._renderRotCopyPass(g,this._rotMrt.textures,n,1),this._renderRotCopyPass(this._rotMrt,g.textures,n,0)}finally{g.dispose()}}this._quad.material=this._material;return}let o=Math.floor(this._baseOffset/t),a=i,l=this._scene.getEngine(),u=this._createMrt("gsRelayoutTemp",!1,t,a),c=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((f,g)=>this._createShMrt(`gsShRelayoutTemp${g}`,!1,t,a)):[],p=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt("gsRotRelayoutTemp",!1,t,a):null;try{this._renderRelayoutPass(u,this._mrt.textures,n,1,t,t,this._baseOffset,0);for(let f=0;f<c.length;f++)this._renderShCopyPass(c[f],this._shMrts[f].textures[0],n,1,t,t,this._baseOffset,0);if(p)this._renderRotCopyPass(p,this._rotMrt.textures,n,1,t,t,this._baseOffset,0);l.enableScissor(0,o,t,a);try{this._renderRelayoutPass(this._mrt,u.textures,n,0,t,t,0,o);for(let f=0;f<c.length;f++)this._renderShCopyPass(this._shMrts[f],c[f].textures[0],n,0,t,t,0,o);if(p)this._renderRotCopyPass(this._rotMrt,p.textures,n,0,t,t,0,o)}finally{l.disableScissor()}}finally{u.dispose();for(let f of c)f.dispose();p?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(e,t,s,i,r=this._textureSize,n=this._textureSize,o=0,a=0){let l=this._copyMaterial;l.setTexture("uMapTex",s),l.setTexture("uSrc0",t[0]),l.setTexture("uSrc1",t[1]),l.setTexture("uSrc2",t[2]),l.setTexture("uSrc3",t[3]),l.setInt("uDstWidth",r),l.setInt("uSrcWidth",n),l.setInt("uUseMap",i),l.setInt("uSrcBaseOffset",o),l.setInt("uDstBaseRow",a),this._quad.material=l,e.renderList=[this._quad],e.render()}_createCopyMaterial(){let e=this._shaderLanguage===1,t=new le(ys,this._scene,{vertexSource:e?_e:pe,fragmentSource:e?Cs:Ss},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2","uSrc3"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}_renderShCopyPass(e,t,s,i,r=this._textureSize,n=this._textureSize,o=0,a=0){let l=this._shCopyMaterial;l.setTexture("uMapTex",s),l.setTexture("uSrcSh",t),l.setInt("uDstWidth",r),l.setInt("uSrcWidth",n),l.setInt("uUseMap",i),l.setInt("uSrcBaseOffset",o),l.setInt("uDstBaseRow",a),this._quad.material=l,e.renderList=[this._quad],e.render()}_createShCopyMaterial(){let e=this._shaderLanguage===1,t=new le(Ms,this._scene,{vertexSource:e?_e:pe,fragmentSource:e?vs:bs},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrcSh"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}_renderRotCopyPass(e,t,s,i,r=this._textureSize,n=this._textureSize,o=0,a=0){let l=this._rotCopyMaterial;l.setTexture("uMapTex",s),l.setTexture("uSrc0",t[0]),l.setTexture("uSrc1",t[1]),l.setTexture("uSrc2",t[2]),l.setInt("uDstWidth",r),l.setInt("uSrcWidth",n),l.setInt("uUseMap",i),l.setInt("uSrcBaseOffset",o),l.setInt("uDstBaseRow",a),this._quad.material=l,e.renderList=[this._quad],e.render()}_createRotCopyMaterial(){let e=this._shaderLanguage===1,t=new le(ws,this._scene,{vertexSource:e?_e:pe,fragmentSource:e?Ts:Rs},{attributes:["position"],uniforms:["uDstWidth","uSrcWidth","uUseMap","uSrcBaseOffset","uDstBaseRow"],samplers:["uMapTex","uSrc0","uSrc1","uSrc2"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}async readCentersRangeAsync(e,t){if(this._disposed||t<=0||!this.supportsAsyncCentersReadback)return null;let s=this._textureSize,i=this._baseOffset+e,r=Math.floor(i/s),o=Math.ceil((i+t)/s)-r,a=(i-r*s)*4,l=a+t*4,u=this._mrt.textures[0],c=this._scene.getEngine();if(c.isWebGPU){let h=await u.readPixels(0,0,null,!0,!0,0,r,s,o);if(this._disposed||!h)return null;let m=h instanceof Float32Array?h:new Float32Array(h.buffer,h.byteOffset,h.byteLength/4);return m.length>=l?m.subarray(a,l):null}let p=c,f=p._gl,g=u.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!g)return null;let x=new Float32Array(s*o*4);if(!this._readFbo)this._readFbo=f.createFramebuffer();let b=p._currentFramebuffer;f.bindFramebuffer(f.FRAMEBUFFER,this._readFbo),f.framebufferTexture2D(f.FRAMEBUFFER,f.COLOR_ATTACHMENT0,f.TEXTURE_2D,g,0),f.readBuffer(f.COLOR_ATTACHMENT0);let M=p._readPixelsAsync(0,r,s,o,f.RGBA,f.FLOAT,x);if(f.bindFramebuffer(f.FRAMEBUFFER,b),!b)f.readBuffer(f.BACK);if(!M)return null;if(await M,this._disposed||x.length<l)return null;return x.subarray(a,l)}dispose(){if(this._disposed=!0,this._readFbo)this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),this._readFbo=null;if(this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let e of this._backupShMrts)e.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt)this._mrt.dispose();if(this._ownsShMrts)for(let e of this._shMrts)e.dispose();if(this._shMrts=[],this._ownsRotMrt)this._rotMrt?.dispose();this._rotMrt=null}_createQuad(){let e=new K("gsWorkBufferQuad",this._scene),t=new se;return t.positions=[-1,-1,0,3,-1,0,-1,3,0],t.indices=[0,1,2],t.applyToMesh(e),this._scene.removeMesh(e),e}_createMaterial(){let e=this._shaderLanguage===1,t=new le("gsSogDecode",this._scene,{vertexSource:e?_e:pe,fragmentSource:e?fs:hs},{attributes:["position"],uniforms:["sogMeansMin","sogMeansMax","sogScalesMin","sogScalesMax","sogSh0Min","sogSh0Max","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogMeansLTex","sogMeansUTex","sogScalesTex","sogQuatsTex","sogSh0Tex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}_applyPack(e){let t=this._material,s=e.meansTextureL.getSize().width;t.setTexture("sogMeansLTex",e.meansTextureL),t.setTexture("sogMeansUTex",e.meansTextureU),t.setTexture("sogScalesTex",e.scalesTexture),t.setTexture("sogQuatsTex",e.quatsTexture),t.setTexture("sogSh0Tex",e.sh0Texture),t.setTexture("sogCodebookTex",e.codebookTexture??e.sh0Texture),t.setVector3("sogMeansMin",new S(e.meansMin[0],e.meansMin[1],e.meansMin[2])),t.setVector3("sogMeansMax",new S(e.meansMax[0],e.meansMax[1],e.meansMax[2]));let i=e.scalesMin??[0,0,0],r=e.scalesMax??[0,0,0];t.setVector3("sogScalesMin",new S(i[0],i[1],i[2])),t.setVector3("sogScalesMax",new S(r[0],r[1],r[2]));let n=e.sh0Min??[0,0,0,0],o=e.sh0Max??[0,0,0,0];t.setVector4("sogSh0Min",new oe(n[0],n[1],n[2],n[3])),t.setVector4("sogSh0Max",new oe(o[0],o[1],o[2],o[3])),t.setInt("uVersion",e.version),t.setInt("uCount",e.splatCount),t.setInt("uDestWidth",this._textureSize),t.setInt("uSrcWidth",s)}_createShMaterial(){let e=this._shaderLanguage===1,t=new le(ms,this._scene,{vertexSource:e?_e:pe,fragmentSource:e?xs:gs},{attributes:["position"],uniforms:["sogShnMin","sogShnMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth","uCoeffs","uShTextureIndex"],samplers:["sogShLabelsTex","sogShCentroidsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}_applyShPack(e){let t=this._shMaterial,s=!!e.shLabelsTexture&&!!e.shCentroidsTexture,i=e.shLabelsTexture??e.sh0Texture,r=e.shCentroidsTexture??e.sh0Texture;t.setTexture("sogShLabelsTex",i),t.setTexture("sogShCentroidsTex",r),t.setTexture("sogCodebookTex",e.codebookTexture??i),t.setFloat("sogShnMin",e.shnMin??0),t.setFloat("sogShnMax",e.shnMax??0),t.setInt("uVersion",e.version),t.setInt("uCount",e.splatCount),t.setInt("uDestWidth",this._textureSize),t.setInt("uSrcWidth",i.getSize().width),t.setInt("uCoeffs",s?e.shCoeffCount:0)}_createRotMaterial(){let e=this._shaderLanguage===1,t=new le(ds,this._scene,{vertexSource:e?_e:pe,fragmentSource:e?_s:ps},{attributes:["position"],uniforms:["sogScalesMin","sogScalesMax","uVersion","uOffset","uCount","uDestWidth","uSrcWidth"],samplers:["sogScalesTex","sogQuatsTex","sogCodebookTex"],shaderLanguage:this._shaderLanguage});return t.backFaceCulling=!1,t.disableDepthWrite=!0,t}_applyRotPack(e){let t=this._rotMaterial,s=e.scalesTexture.getSize().width;t.setTexture("sogScalesTex",e.scalesTexture),t.setTexture("sogQuatsTex",e.quatsTexture),t.setTexture("sogCodebookTex",e.codebookTexture??e.scalesTexture);let i=e.scalesMin??[0,0,0],r=e.scalesMax??[0,0,0];t.setVector3("sogScalesMin",new S(i[0],i[1],i[2])),t.setVector3("sogScalesMax",new S(r[0],r[1],r[2])),t.setInt("uVersion",e.version),t.setInt("uCount",e.splatCount),t.setInt("uDestWidth",this._textureSize),t.setInt("uSrcWidth",s)}}class at{constructor(e){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,e?.maxConcurrent??2),this.maxRetries=Math.max(0,e?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(e,t){if(this._disposed)throw Error("GaussianSplattingDownloadManager has been disposed.");let s=this._pending.get(e);if(s)return await s.promise;let i={url:e,groupId:t,settled:!1,cancelled:!1,started:!1,slotReleased:!1};if(i.promise=new Promise((r,n)=>{i.resolve=r,i.reject=n}),this._pending.set(e,i),t!==void 0){let r=this._groups.get(t);if(!r)r=new Set,this._groups.set(t,r);r.add(e)}return this._queue.push(i),this._pump(),await i.promise}cancel(e){let t=this._pending.get(e);if(!t)return;this._abort(t,Error(`GaussianSplattingDownloadManager: download cancelled (${e}).`))}cancelGroup(e){let t=this._groups.get(e);if(!t)return;for(let s of Array.from(t))this.cancel(s);this._groups.delete(e)}dispose(){if(this._disposed)return;this._disposed=!0,this._queue.length=0;for(let e of Array.from(this._pending.values()))this._abort(e,Error("GaussianSplattingDownloadManager has been disposed."))}_abort(e,t){if(e.settled)return;e.cancelled=!0;let s=this._queue.indexOf(e);if(s!==-1)this._queue.splice(s,1);if(e.request?.abort(),e.cancelAttempt?.(t),this._settle(e,()=>e.reject(t)),e.started)this._releaseSlot(e)}_settle(e,t){if(e.settled)return;if(e.settled=!0,this._pending.delete(e.url),e.groupId!==void 0){let s=this._groups.get(e.groupId);if(s){if(s.delete(e.url),s.size===0)this._groups.delete(e.groupId)}}t()}_releaseSlot(e){if(e.slotReleased)return;e.slotReleased=!0,this._activeCount--,this._pump()}_pump(){while(!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0){let e=this._queue.shift();if(e.settled)continue;e.started=!0,this._activeCount++,this._runTaskAsync(e).finally(()=>{this._releaseSlot(e)})}}async _runTaskAsync(e){let t;for(let s=0;s<=this.maxRetries;s++){if(this._disposed||e.cancelled)return;try{let i=await this._downloadAttemptAsync(e);this._settle(e,()=>e.resolve(i));return}catch(i){if(e.cancelAttempt=void 0,this._disposed||e.cancelled)return;t=i}}this._settle(e,()=>e.reject(t))}async _downloadAttemptAsync(e){return await new Promise((t,s)=>{e.cancelAttempt=s,e.request=re.LoadFile(e.url,(i)=>t(i),void 0,void 0,!0,(i,r)=>s(r instanceof Error?r:Error(`GaussianSplattingDownloadManager: failed to load ${e.url}.`)))})}}class Ds{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}}class lt{constructor(e=0,t=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=t,e>0){this._capacity=e,this._freeSize=e;let s=this._obtain(0,e,!0);this._headAll=s,this._tailAll=s,this._addToBucket(s)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(e){if(e<=0)return null;let t=this._findFreeBlock(e);if(!t)return null;if(this._usedSize+=e,this._freeSize-=e,t._size===e)return t._free=!1,this._removeFromBucket(t),t;let s=this._obtain(t._offset,e,!1);return t._offset+=e,t._size-=e,this._rebucket(t),this._insertAfterInMainList(s,t._prev),s}free(e){if(!e||e._free)return;e._free=!0,this._usedSize-=e._size,this._freeSize+=e._size;let{_prev:t,_next:s}=e,i=t&&t._free,r=s&&s._free;if(i&&r)t._size+=e._size+s._size,this._removeFromMainList(e),this._removeFromMainList(s),this._removeFromBucket(s),this._release(e),this._release(s),this._rebucket(t);else if(i)t._size+=e._size,this._removeFromMainList(e),this._release(e),this._rebucket(t);else if(r)e._size+=s._size,this._removeFromMainList(s),this._removeFromBucket(s),this._release(s),this._addToBucket(e);else this._addToBucket(e)}grow(e){if(e<=this._capacity)return;let t=e-this._capacity;if(this._capacity=e,this._freeSize+=t,this._tailAll&&this._tailAll._free)this._tailAll._size+=t,this._rebucket(this._tailAll);else{let s=this._obtain(this._capacity-t,t,!0);this._insertAfterInMainList(s,this._tailAll),this._addToBucket(s)}}defrag(e=0,t=new Set){if(t.clear(),this._freeRegionCount===0)return t;if(e===0)this._defragFull(t);else this._defragIncremental(e,t);return t}updateAllocation(e,t){for(let s=0;s<e.length;s++)this.free(e[s]);for(let s=0;s<t.length;s++){let i=t[s],r=this.allocate(i);if(r)t[s]=r;else{let n=i;for(let l=s+1;l<t.length;l++)n+=t[l];let o=this._usedSize+n,a=Math.ceil(o*this._growMultiplier);if(a>this._capacity)this.grow(a);this.defrag(0);for(let l=s;l<t.length;l++)t[l]=this.allocate(t[l]);return!0}}return!1}_bucketFor(e){return 31-Math.clz32(e)}_addToBucket(e){let t=this._bucketFor(e._size);e._bucket=t;while(t>=this._freeBucketHeads.length)this._freeBucketHeads.push(null);if(e._prevFree=null,e._nextFree=this._freeBucketHeads[t],this._freeBucketHeads[t])this._freeBucketHeads[t]._prevFree=e;this._freeBucketHeads[t]=e,this._freeRegionCount++}_removeFromBucket(e){let t=e._bucket;if(e._prevFree)e._prevFree._nextFree=e._nextFree;else this._freeBucketHeads[t]=e._nextFree;if(e._nextFree)e._nextFree._prevFree=e._prevFree;e._prevFree=null,e._nextFree=null,e._bucket=-1,this._freeRegionCount--}_rebucket(e){if(this._bucketFor(e._size)!==e._bucket)this._removeFromBucket(e),this._addToBucket(e)}_obtain(e,t,s){let i=this._pool.length>0?this._pool.pop():new Ds;return i._offset=e,i._size=t,i._free=s,i._prev=null,i._next=null,i._prevFree=null,i._nextFree=null,i._bucket=-1,i}_release(e){e._prev=null,e._next=null,e._prevFree=null,e._nextFree=null,e._bucket=-1,this._pool.push(e)}_insertAfterInMainList(e,t){if(t===null){if(e._prev=null,e._next=this._headAll,this._headAll)this._headAll._prev=e;if(this._headAll=e,!this._tailAll)this._tailAll=e}else{if(e._prev=t,e._next=t._next,t._next)t._next._prev=e;if(t._next=e,this._tailAll===t)this._tailAll=e}}_removeFromMainList(e){if(e._prev)e._prev._next=e._next;else this._headAll=e._next;if(e._next)e._next._prev=e._prev;else this._tailAll=e._prev;e._prev=null,e._next=null}_findFreeBlock(e){let t=this._bucketFor(e),s=this._freeBucketHeads.length;if(t<s){let i=null,r=this._freeBucketHeads[t];while(r){if(r._size>=e){if(!i||r._size<i._size){if(i=r,r._size===e)break}}r=r._nextFree}if(i)return i}for(let i=t+1;i<s;i++)if(this._freeBucketHeads[i])return this._freeBucketHeads[i];return null}_defragFull(e){for(let r=0;r<this._freeBucketHeads.length;r++){let n=this._freeBucketHeads[r];while(n){let o=n._nextFree;this._removeFromMainList(n),n._prevFree=null,n._nextFree=null,n._bucket=-1,this._pool.push(n),n=o}this._freeBucketHeads[r]=null}this._freeRegionCount=0;let t=0,s=this._headAll;while(s){if(s._offset!==t)s._offset=t,e.add(s);t+=s._size,s=s._next}let i=this._capacity-t;if(i>0){let r=this._obtain(t,i,!0);this._insertAfterInMainList(r,this._tailAll),this._addToBucket(r)}}_defragIncremental(e,t){let s=Math.ceil(e/2),i=e-s;for(let n=0;n<s;n++){let o=this._tailAll;while(o&&o._free)o=o._prev;if(!o)break;let a=this._findFreeBlock(o._size);if(!a||a._offset>=o._offset)break;this._moveBlock(o,a),t.add(o)}let r=this._headAll;for(let n=0;n<i&&r;){let o=r._next;if(r._free&&o&&!o._free){let a=o,l=r;a._offset=l._offset,l._offset=a._offset+a._size;let u=l._prev,c=a._next;if(a._prev=u,a._next=l,l._prev=a,l._next=c,u)u._next=a;else this._headAll=a;if(c)c._prev=l;else this._tailAll=l;if(l._next&&l._next._free){let p=l._next;l._size+=p._size,this._removeFromMainList(p),this._removeFromBucket(p),this._release(p),this._rebucket(l)}t.add(a),n++,r=l._next}else r=o}}_moveBlock(e,t){let s=e._size,i=t._offset,r=e._prev;this._removeFromMainList(e);let n=this._obtain(e._offset,s,!0);if(this._insertAfterInMainList(n,r),this._addToBucket(n),n._next&&n._next._free){let o=n._next;n._size+=o._size,this._removeFromMainList(o),this._removeFromBucket(o),this._release(o),this._rebucket(n)}if(n._prev&&n._prev._free){let o=n._prev;o._size+=n._size,this._removeFromMainList(n),this._removeFromBucket(n),this._release(n),this._rebucket(o)}if(e._offset=i,t._size===s){let o=t._prev;this._removeFromMainList(t),this._removeFromBucket(t),this._release(t),this._insertAfterInMainList(e,o)}else t._offset+=s,t._size-=s,this._rebucket(t),this._insertAfterInMainList(e,t._prev)}}class ct{constructor(e,t,s){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new lt(e),this._cooldownFrames=Math.max(0,t),this._onEvict=s}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(e){return this._blocks.has(e)}offset(e){return this._blocks.get(e)?.offset}allocate(e,t){let s=this._blocks.get(e);if(s)return s.offset;let i=this._allocator.allocate(t);if(!i){if(this._evictAllCooled(),i=this._allocator.allocate(t),!i)return null}return this._blocks.set(e,i),i.offset}pin(e,t){let s=this.allocate(e,t);if(s!==null)this._pinned.add(e);return s}free(e){if(this._pinned.has(e))return;let t=this._blocks.get(e);if(!t)return;this._allocator.free(t),this._blocks.delete(e),this._cooldown.delete(e)}compact(){let e=new Map;for(let[s,i]of Array.from(this._blocks))e.set(s,i.offset);this._allocator.defrag(0);let t=[];for(let[s,i]of Array.from(this._blocks)){let r=e.get(s);if(r!==i.offset)t.push({file:s,oldOffset:r,newOffset:i.offset,count:i.size})}return t}getResidentBlocks(){let e=[];for(let[t,s]of Array.from(this._blocks))e.push({file:t,offset:s.offset,count:s.size});return e}scheduleEviction(e){if(this._pinned.has(e)||!this._blocks.has(e))return;this._cooldown.set(e,this._cooldownFrames)}cancelEviction(e){this._cooldown.delete(e)}tick(){if(this._cooldown.size===0)return[];let e=[];for(let[t,s]of Array.from(this._cooldown))if(s<=1)e.push(t);else this._cooldown.set(t,s-1);for(let t of e)this._evict(t);return e}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let e=Array.from(this._cooldown.keys());for(let t of e)this._evict(t)}_evict(e){let t=this._blocks.get(e);if(t)this._allocator.free(t),this._blocks.delete(e);this._cooldown.delete(e),this._onEvict(e)}}var gi=Math.tan(22.5*Math.PI/180),xi=-2,As=-1,yi=84,ut=new H,Si=new S,Mi=new S,Ls=new S,bi=new S(0,0,1),qs=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],Fs=qs.length*2,Ge=[new V(1,0.2,0.2,1),new V(1,0.6,0.1,1),new V(1,1,0.2,1),new V(0.3,1,0.3,1),new V(0.2,1,1,1),new V(0.4,0.5,1,1),new V(0.9,0.4,1,1),new V(1,1,1,1)];class ne extends ge{static IsLODMetadata(e){if(typeof e!=="object"||e===null)return!1;let t=e;return typeof t.lodLevels==="number"&&Array.isArray(t.filenames)&&typeof t.tree==="object"&&t.tree!==null}constructor(e,t,s,i,r={}){super(e,null,i,!1);this._leafNodes=[],this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=0.5,this._maxDetailLod=0,this._frustumCulling=!0,this._frustumPlanes=[new me(0,0,0,0),new me(0,0,0,0),new me(0,0,0,0),new me(0,0,0,0),new me(0,0,0,0),new me(0,0,0,0)],this._cullViewProj=new H,this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPos=new S(1/0,1/0,1/0),this._forceLodUpdate=!1,this._boundsMin=new S(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new S(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource="optimal",this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=t,this._rootUrl=s,this._streamOptions=r,this._hostCompound=r.hostCompound??null,this._decodeSh=r.decodeSh??!0,this._needsRotationScale=r.needsRotationScale??!1;let n=Math.max(0,t.lodLevels-1);if(this._lodRangeMax=n,r.lodBaseDistance!==void 0)this._lodBaseDistance=Math.max(0.1,r.lodBaseDistance);if(r.lodMultiplier!==void 0)this._lodMultiplier=Math.max(1.2,r.lodMultiplier);if(r.lodBehindPenalty!==void 0)this._lodBehindPenalty=Math.max(1,r.lodBehindPenalty);if(r.lodRangeMin!==void 0)this._lodRangeMin=Math.max(0,Math.min(r.lodRangeMin,n));if(r.lodRangeMax!==void 0)this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(r.lodRangeMax,n));if(r.maxDecodesPerFrame!==void 0)this._maxDecodesPerFrame=Math.max(1,r.maxDecodesPerFrame);if(r.lodCooldownFrames!==void 0)this._lodCooldownFrames=Math.max(0,r.lodCooldownFrames);if(r.lodUpdateInterval!==void 0)this._lodUpdateInterval=Math.max(1,r.lodUpdateInterval);if(r.lodUpdateDistance!==void 0)this._lodUpdateDistance=Math.max(0,r.lodUpdateDistance);if(r.maxDetailLod!==void 0)this._maxDetailLod=Math.max(0,Math.floor(r.maxDetailLod));if(r.frustumCulling!==void 0)this._frustumCulling=r.frustumCulling;if(r.debugLodSource)this._debugLodSource=r.debugLodSource;if(r.evictionCooldownFrames!==void 0)this._evictionCooldownFrames=Math.max(0,Math.floor(r.evictionCooldownFrames));if(r.maxResidentSplats!==void 0&&r.maxResidentSplats>0)this._maxResidentSplats=Math.floor(r.maxResidentSplats);if(r.memoryBudgetMb!==void 0&&r.memoryBudgetMb>0)this._memoryBudgetMb=r.memoryBudgetMb;if(this._downloadManager=new at({maxConcurrent:r.maxConcurrentDownloads,maxRetries:r.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((a,l)=>{this._partReadyResolve=a,this._partReadyReject=l}),this._partReadyPromise.catch(()=>{});let o=this._hostCompound.onDisposeObservable.add(()=>{if(!this._disposed)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(o)}if(this._collectLodEntries(t.tree),r.debugDisplay)this.debugDisplay=!0;this._streamAllAsync().then(()=>{let o=this._partReadySettled;if(this._rejectPartReady("GaussianSplattingStream: stream produced no splats."),!o&&this._hostCompound&&!this._disposed)this._disposeAndReclaim()},(o)=>{if(X.Error("GaussianSplattingStream: streaming failed: "+(o?.message??o)),this._rejectPartReady("GaussianSplattingStream: streaming failed: "+(o?.message??o)),this._hostCompound&&!this._disposed)this._disposeAndReclaim()})}getClassName(){return"GaussianSplattingStream"}isReady(e=!1){if(this._hostCompound)return!0;return super.isReady(e)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyResolve?.()}_rejectPartReady(e){if(this._partReadySettled)return;this._partReadySettled=!0,this._partReadyReject?.(Error(e))}async whenSettledAsync(e=3){if(this._disposed)return;this._forceLodUpdate=!0;let t=Math.max(1,e),s=this._scene,i=0,r=()=>{if(this._isLoadingIdle()&&this._sinkIsDepthSortSettled)return++i>=t;return i=0,!1};if(s.getEngine().activeRenderLoops.length>0){await new Promise((a)=>{let l=null;l=s.onAfterRenderObservable.add(()=>{if(this._disposed||r()){if(l)s.onAfterRenderObservable.remove(l),l=null;a()}})});return}let n=s.getEngine(),o=globalThis.requestAnimationFrame;while(!this._disposed){if(n.beginFrame(),s.render(),n.endFrame(),r())return;await new Promise((a)=>{if(typeof o==="function")o(()=>a());else setTimeout(a,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(e){let t=Math.max(0,Math.floor(e));if(this._maxDetailLod===t)return;this._maxDetailLod=t,this._forceLodUpdate=!0}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(e){if(this._frustumCulling===e)return;this._frustumCulling=e,this._forceLodUpdate=!0}get debugDisplay(){return this._debugDisplay}set debugDisplay(e){if(this._debugDisplay===e)return;if(this._debugDisplay=e,e)this._refreshDebugDisplay();else this._clearDebugDisplay()}get debugLodSource(){return this._debugLodSource}set debugLodSource(e){if(this._debugLodSource===e)return;if(this._debugLodSource=e,this._debugDisplay)this._refreshDebugDisplay()}dispose(e){if(this._disposed)return;if(this._disposed=!0,this._rejectPartReady("GaussianSplattingStream: disposed before the part was ready."),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed())this._hostCompound.removePart(this._host.partIndex);if(this._host=null,this._lodObserver)this._scene.onBeforeRenderObservable.remove(this._lodObserver),this._lodObserver=null;this._clearDebugDisplay(),this._downloadManager.dispose(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(e)}_disposeAndReclaim(){let e=this._hostCompound,t=!!this._host&&!this._partReleasedByHost;if(this.dispose(),t&&e&&!e.isDisposed())e.compactAtlas()}_getEffectiveWorldMatrix(e){if(this._host)return this._host.proxy.computeWorldMatrix(e);return this.computeWorldMatrix(e)}evaluateOptimalLods(e=this._scene.activeCamera){if(!e||this._leafNodes.length===0)return;let t=Math.max(0,this._metadata.lodLevels-1),s=this._lodBaseDistance,i=this._lodMultiplier,r=this._lodBehindPenalty,n=this._lodRangeMin,o=this._lodRangeMax,a=this._scene.getEngine().getAspectRatio(e)||1,l=Math.tan(e.fov*0.5);if(e.fovMode===Xe.FOVMODE_HORIZONTAL_FIXED)l/=a;let u=l*a,c=Math.min(l,u)/gi;this._getEffectiveWorldMatrix(!1).invertToRef(ut);let p=S.TransformCoordinatesToRef(e.globalPosition,ut,Si),f=p.x,g=p.y,x=p.z,b=0,M=0,h=0;if(r>1){e.getDirectionToRef(bi,Ls);let m=S.TransformNormalToRef(Ls,ut,Mi);m.normalize(),b=m.x,M=m.y,h=m.z}for(let m of this._leafNodes){let d=m.bound.min,y=m.bound.max,w=f<d[0]?d[0]:f>y[0]?y[0]:f,_=g<d[1]?d[1]:g>y[1]?y[1]:g,v=x<d[2]?d[2]:x>y[2]?y[2]:x,R=w-f,L=_-g,k=v-x,C=Math.sqrt(R*R+L*L+k*k),A=C;if(r>1&&C>0.01){let F=(b*R+M*L+h*k)/C;if(F<0)A=C*(1+-F*(r-1))}let z=A*c,T;if(t===0||z<s)T=0;else{T=t;while(T>1&&z<s*Math.pow(i,T-1))T--}if(T<n)T=n;else if(T>o)T=o;if(this._frustumCulling&&m.inFrustum===!1)T=o;m.optimalLod=T}}_displayedLodLevel(e){if(this._debugLodSource==="optimal")return e.optimalLod??e.activeLod??0;return e.activeLod??0}_refreshDebugDisplay(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();this._buildDebugMesh();let e=this._debugDisplay;if(e&&!this._debugObserver)this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame());else if(!e&&this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null}_onDebugFrame(){if(this._debugLodSource==="optimal")this.evaluateOptimalLods();if(this._computeDebugSignature()!==this._debugSignature)this._updateDebugColors()}_buildDebugMesh(){if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null;let e=[],t=[];for(let i of this._leafNodes){let r=Ge[this._displayedLodLevel(i)%Ge.length],n=i.bound.min,o=i.bound.max,a=[new S(n[0],n[1],n[2]),new S(o[0],n[1],n[2]),new S(o[0],o[1],n[2]),new S(n[0],o[1],n[2]),new S(n[0],n[1],o[2]),new S(o[0],n[1],o[2]),new S(o[0],o[1],o[2]),new S(n[0],o[1],o[2])];for(let l of qs)e.push([a[l[0]],a[l[1]]]),t.push([r,r])}if(this._debugSignature=this._computeDebugSignature(),e.length===0)return;let s=We(this.name+"_lodDebug",{lines:e,colors:t,updatable:!0,useVertexAlpha:!1},this._scene);s.parent=this,s.isPickable=!1,s.doNotSerialize=!0,s.reservedDataStore={hidden:!0},this._debugMesh=s,this._debugColorData=new Float32Array(this._leafNodes.length*Fs*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let e=this._debugColorData,t=0;for(let s of this._leafNodes){let i=Ge[this._displayedLodLevel(s)%Ge.length];for(let r=0;r<Fs;r++)e[t++]=i.r,e[t++]=i.g,e[t++]=i.b,e[t++]=i.a}this._debugMesh.updateVerticesData(N.ColorKind,e),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let e=0;for(let t of this._leafNodes)e=e*31+this._displayedLodLevel(t)|0;return e}_clearDebugDisplay(){if(this._debugObserver)this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null;if(this._debugMesh)this._debugMesh.dispose(),this._debugMesh=null;this._debugColorData=null,this._debugSignature=0}_collectLodEntries(e){if(e.children){for(let s of e.children)this._collectLodEntries(s);return}if(!e.lods)return;let t=[];for(let s of Object.keys(e.lods)){let i=Number(s),r=e.lods[s];if(Number.isFinite(i)&&r&&r.count>0)t.push(i)}if(t.length===0)return;t.sort((s,i)=>s-i),e.availableLevels=t,e.baseLod=t[t.length-1],e.activeLod=void 0,e.lodCooldown=0,e.inFrustum=!0,e.cullBounds=new ht(S.FromArray(e.bound.min),S.FromArray(e.bound.max)),this._leafNodes.push(e)}async _streamAllAsync(){let e=this._collectAllFileIds(),t=await this._gatherCountsAsync(e);if(this._disposed)return;this._resolveResidentBudget();let s=1;if(t>0)s+=t;for(let n of e){let o=this._fileCounts.get(n);if(o!==void 0&&o>0)s+=o}if(s<=1)return;this._evictionEnabled=this._residentBudget>0&&this._residentBudget<s;let i=this._evictionEnabled?Math.max(this._residentBudget,1):s;if(this._residency=new ct(i,this._evictionCooldownFrames,(n)=>this._onFileEvicted(n)),this._residency.pin(xi,1),t>0){let n=this._residency.pin(As,t);if(n!==null)this._environmentRange={offset:n,count:t};else X.Warn("GaussianSplattingStream: environment does not fit the memory budget; skipping it."),this._environmentFiles=null}if(this._hostCompound){let n=H.Compose(new S(1,-1,1),Ne.RotationYawPitchRoll(0,-Math.PI/2,0),S.ZeroReadOnly),o=this._hostCompound.reserveStreamingPart(i,n,this.name+"_part",this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=o,this._positionBase=o.base;let a=this._hostCompound,l=a.onPartRemovedObservable.add((f)=>{if(!this._disposed&&this._host&&f===this._host.partIndex)this._partReleasedByHost=!0,this.dispose()});this._hostUnsubRemove=()=>a.onPartRemovedObservable.remove(l);let u=this._shTextureCount>0&&o.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:o.shMrtAtlas}:void 0,c=this._needsRotationScale&&o.rotMrtAtlas?{externalMrt:o.rotMrtAtlas}:void 0;this._workBuffer=new Ue(this._scene,o.capacity,{mrt:o.mrtAtlas,width:o.atlasWidth,baseOffset:o.base},u,c),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=o.splatPositions,this._vertexCount=i;let p=this._workBuffer;this._unsubBeforeRebuild=o.onBeforeAtlasRebuild(()=>{p.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=o.onAfterAtlasRebuild(()=>{if(o.mrtAtlas)p.rebindAtlas(o.mrtAtlas);if(p.rebindShAtlas(o.shMrtAtlas),p.rebindRotAtlas(o.rotMrtAtlas),this._positionBase=o.base,p.setBaseOffset(o.base),p.restoreRegion(),this._splatPositions=o.splatPositions,this._positionSnapshot&&this._splatPositions)this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null}),o.setActiveRanges([])}else{let n=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,o=this._needsRotationScale?{}:void 0;this._workBuffer=new Ue(this._scene,i,void 0,n,o),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let a=new Float32Array(i*4),l=this._workBuffer.textures,u=n?this._workBuffer.shTextures:void 0,c=o?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(l[0],l[1],l[2],l[3],a,i,u,this._streamShDegree,c),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer){if(await this._waitForCanBackupAsync(this._workBuffer),this._disposed)return}if(this._environmentRange&&this._environmentFiles)await this._decodeEnvironmentAsync();this._environmentFiles=null;let r=new Set;for(let n of this._leafNodes){let o=n.lods[String(n.baseLod)];if(o&&this._fileCounts.has(o.file))r.add(o.file)}for(let n of Array.from(r)){if(this._disposed)return;await this._decodeFileAsync(n)}if(this._disposed)return;if(this._baseLayerReady=!0,!this._lodObserver)this._lodObserver=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame());this._resolvePartReady()}async _waitForCanBackupAsync(e){for(let t=0;t<600&&!this._disposed;t++){if(e.canBackup)return;await new Promise((s)=>this._scene.onBeforeRenderObservable.addOnce(()=>s()))}if(!this._disposed&&!e.canBackup)X.Warn("GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.")}_resolveResidentBudget(){let e=this._maxResidentSplats;if(this._memoryBudgetMb>0){let t=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48,s=yi+this._shTextureCount*16+(this._needsRotationScale?t:0),i=Math.floor(this._memoryBudgetMb*1024*1024/s);e=e>0?Math.min(e,i):i}this._residentBudget=e}_collectAllFileIds(){let e=new Set;for(let t of this._leafNodes)for(let s of t.availableLevels){let i=t.lods[String(s)];if(i)e.add(i.file)}return Array.from(e).sort((t,s)=>t-s)}async _gatherCountsAsync(e){let t=0,s=0,i=0,r=(n)=>{let o=ne._GetShInfo(n);if(o.degree>s)s=o.degree;if(o.coeffs>i)i=o.coeffs};if(this._metadata.environment)try{let n=this._rootUrl+this._metadata.environment,o=await this._downloadManager.loadFileAsync(n),a=await this._unzipAsync(new Uint8Array(o)),l=a.get("meta.json");if(l){let u=JSON.parse(new TextDecoder().decode(l));t=ne._GetSplatCount(u),r(u),this._environmentFiles=a}}catch(n){X.Warn("GaussianSplattingStream: failed to load environment: "+(n?.message??n))}await Promise.all(e.map(async(n)=>{let o=this._metadata.filenames[n];if(!o){X.Warn(`GaussianSplattingStream: missing filename for file index ${n}.`);return}try{let a=this._rootUrl+o,l=a.substring(0,a.lastIndexOf("/")+1),u=await this._downloadManager.loadFileAsync(a),c=JSON.parse(new TextDecoder().decode(new Uint8Array(u)));this._fileCounts.set(n,ne._GetSplatCount(c)),this._fileMeta.set(n,{sogData:c,subRootUrl:l})}catch(a){X.Warn(`GaussianSplattingStream: failed to load metadata for ${o}: ${a?.message??a}`)}}));for(let{sogData:n}of this._fileMeta.values())r(n);if(this._decodeSh&&s>0&&i>0)this._streamShDegree=s,this._shTextureCount=Math.ceil(i*3/16);return t}_enqueueDecode(e){if(this._decodedFiles.has(e)||this._loadingFiles.has(e)||!this._fileMeta.has(e))return;if(this._decodeQueue.indexOf(e)===-1)this._decodeQueue.push(e)}_pumpDecodeQueue(){let e=0;while(this._decodeQueue.length>0&&e<this._maxDecodesPerFrame){let t=this._decodeQueue.shift();if(this._decodedFiles.has(t)||this._loadingFiles.has(t))continue;e++,this._decodeFileAsync(t).catch((s)=>{X.Warn("GaussianSplattingStream: decode failed: "+(s?.message??s))})}}_applyPositions(e,t,s){this._splatPositions.set(e,(this._positionBase+t)*4),this._updateBounds(e,s),this._sinkPostPositionsRange(t,s)}_sinkSetActiveRanges(e){if(this._host)this._host.setActiveRanges(e);else this.setSplatIndexRanges(e)}_sinkPostPositionsRange(e,t){if(this._host)this._host.postPositionsRange(e,t);else this._postWorkerPositionsRange(e,t)}_sinkNotifyDataChanged(){if(this._host)this._host.notifyDataChanged();else this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(e,t,s){if(this._readbackProbed=!0,!this._workBuffer)return;let i=Math.min(t,1024),r=!1;try{let n=await this._workBuffer.readCentersRangeAsync(e,i);if(this._disposed)return;if(n&&n.length>=i*4){r=!0;for(let o=0;o<i&&r;o++)for(let a=0;a<3;a++){let l=n[o*4+a],u=s[o*4+a];if(Math.abs(l-u)>0.01*(1+Math.abs(u))){r=!1;break}}}}catch{r=!1}this._useGpuPositionReadback=r,X.Log(r?"GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.":"GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.")}async _applyDecodedPositionsAsync(e,t,s){if(this._useGpuPositionReadback&&this._workBuffer){let r=await this._workBuffer.readCentersRangeAsync(t,s);if(this._disposed)return!1;if(r&&this._splatPositions)return this._applyPositions(r,t,s),!0}let i=e.positions.length>=s*4?e.positions.subarray(0,s*4):null;if(!i||!this._splatPositions)return!1;if(this._applyPositions(i,t,s),!this._readbackProbed&&this._readbackCandidate)await this._probeReadbackAsync(t,s,i);return!0}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let e=this._environmentRange;try{let s=(await Ce(this._environmentFiles,"",this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!s)return;try{if(this._disposed||!this._workBuffer)return;if(await this._workBuffer.decodeAsync(s,e.offset),this._disposed)return;if(await this._applyDecodedPositionsAsync(s,e.offset,e.count),this._disposed)return;this._refreshActiveRanges()}finally{ne._DisposePack(s)}}catch(t){X.Warn("GaussianSplattingStream: failed to decode environment: "+(t?.message??t))}}async _decodeFileAsync(e){if(this._decodedFiles.has(e)||this._loadingFiles.has(e)||!this._residency)return;let t=this._fileMeta.get(e),s=this._fileCounts.get(e);if(!t||s===void 0)return;this._loadingFiles.add(e),this._cancelledDecodes.delete(e);let i=!1;try{let n=(await Ce(t.sogData,t.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,e)).sogTextures;if(!n)return;let o=await this._acquireDecodeGateAsync();try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(e))return;let a=this._residency.allocate(e,s);if(a===null)a=await this._relayoutAndAllocateAsync(e,s);if(a===null){if(!this._cancelledDecodes.has(e))X.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${e}.`);return}if(i=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(e))return;if(await this._workBuffer.decodeAsync(n,a),this._disposed||this._cancelledDecodes.has(e))return;if(await this._applyDecodedPositionsAsync(n,a,s),this._disposed)return;if(this._decodedFiles.add(e),this._applyDesiredLods())this._refreshActiveRanges()}finally{ne._DisposePack(n),o()}}catch(r){if(!this._cancelledDecodes.has(e))throw r}finally{if(i&&!this._decodedFiles.has(e))this._residency.free(e);this._loadingFiles.delete(e),this._cancelledDecodes.delete(e)}}async _acquireDecodeGateAsync(){let e=this._decodeGate,t;return this._decodeGate=new Promise((s)=>{t=s}),await e,t}async _relayoutAndAllocateAsync(e,t){if(!this._residency||!this._workBuffer)return null;if(this._residency.freeSize<t)return null;return await new Promise((s)=>{let i=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(e)){s(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(i);return}this._performRelayout(),s(this._residency.allocate(e,t))};this._scene.onBeforeRenderObservable.addOnce(i)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let e=this._relayoutOldOffsets;e.clear();for(let a of this._residency.getResidentBlocks())e.set(a.file,a.offset);if(this._residency.compact().length===0)return;let s=this._residency.capacity;if(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==s)this._relayoutSrcIndex=new Float32Array(s);let i=this._relayoutSrcIndex;i.fill(-1);let r=this._residency.getResidentBlocks();for(let a of r){let l=e.get(a.file);for(let u=0;u<a.count;u++)i[a.offset+u]=l+u}this._workBuffer.relayoutSync(i);let n=this._splatPositions,o=this._positionBase;r.sort((a,l)=>a.offset-l.offset);for(let a of r){let l=e.get(a.file);if(l!==a.offset)n.copyWithin((o+a.offset)*4,(o+l)*4,(o+l+a.count)*4)}if(this._environmentRange){let a=this._residency.offset(As);if(a!==void 0)this._environmentRange.offset=a}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(e){this._decodedFiles.delete(e)}_cappedLevelForNode(e,t){let s=e.availableLevels,i=this._maxDetailLod,r=-1,n=Number.POSITIVE_INFINITY;for(let o of s){if(o<i)continue;let a=Math.abs(o-t);if(a<n)r=o,n=a}return r<0?e.baseLod:r}_computeTargetLevels(){for(let e of this._leafNodes){let t=e.optimalLod??e.baseLod;e.targetLevel=this._cappedLevelForNode(e,t)}}_applyDesiredLods(){let e=!1;for(let t of this._leafNodes){if(t.lodCooldown&&t.lodCooldown>0)continue;let s=t.targetLevel??t.baseLod,i;if(s!==t.activeLod){let r=t.lods[String(s)];if(r)if(this._decodedFiles.has(r.file))this._switchActiveFile(t,r.file),t.activeLod=s,t.lodCooldown=this._lodCooldownFrames,e=!0;else i=r.file}if(t.pendingFile!==i){if(t.pendingFile!==void 0)this._releaseFileRef(t.pendingFile);if(i!==void 0)this._acquirePendingFile(i);t.pendingFile=i}}return e}_switchActiveFile(e,t){if(e.activeFile===t)return;if(e.activeFile!==void 0)this._releaseFileRef(e.activeFile);this._acquireFileRef(t),e.activeFile=t}_acquireFileRef(e){let t=(this._fileRefs.get(e)??0)+1;if(this._fileRefs.set(e,t),t===1)this._residency?.cancelEviction(e)}_acquirePendingFile(e){this._acquireFileRef(e),this._enqueueDecode(e)}_releaseFileRef(e){let t=(this._fileRefs.get(e)??0)-1;if(t>0){this._fileRefs.set(e,t);return}if(this._fileRefs.delete(e),this._decodedFiles.has(e)){if(this._evictionEnabled)this._residency?.scheduleEviction(e);return}let s=this._decodeQueue.indexOf(e);if(s!==-1)this._decodeQueue.splice(s,1);if(this._loadingFiles.has(e))this._cancelledDecodes.add(e),this._downloadManager.cancelGroup(e)}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;let e=!1;for(let i of this._leafNodes)if(i.lodCooldown&&i.lodCooldown>0){if(i.lodCooldown--,i.lodCooldown===0&&i.targetLevel!==void 0&&i.targetLevel!==i.activeLod)e=!0}if(this._evictionEnabled)this._residency?.tick();this._pumpDecodeQueue();let t=this._updateNodeFrustum(),s=this._forceLodUpdate||t||e;if(!s&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let i=this._scene.activeCamera,r=this._lodUpdateDistance;if(!i||S.DistanceSquared(i.globalPosition,this._lastLodCamPos)>=r*r){if(i)this._lastLodCamPos.copyFrom(i.globalPosition);s=!0}}if(s){if(this._forceLodUpdate=!1,this._framesSinceLodUpdate=0,this.evaluateOptimalLods(this._scene.activeCamera),this._computeTargetLevels(),this._applyDesiredLods())this._refreshActiveRanges()}}_updateNodeFrustum(){let e=this._scene.activeCamera,t=!1;if(!this._frustumCulling||!e){for(let i of this._leafNodes)if(i.inFrustum===!1)i.inFrustum=!0,t=!0;return t}let s=this._getEffectiveWorldMatrix(!1);e.getViewMatrix().multiplyToRef(e.getProjectionMatrix(),this._cullViewProj),Ps.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);for(let i of this._leafNodes){i.cullBounds.update(s);let r=i.cullBounds.isInFrustum(this._frustumPlanes);if(r!==i.inFrustum)i.inFrustum=r,t=!0}return t}static _GetSplatCount(e){return e.count??(Array.isArray(e.means.shape)?e.means.shape[0]:0)}static _GetShInfo(e){if(!e.shN)return{degree:0,coeffs:0};let t=4,s=0,i=e.shN.bands;if(typeof i==="number"&&Number.isFinite(i)&&i>0)s=Math.floor(i);else if(Array.isArray(e.shN.shape)&&Number.isFinite(e.shN.shape[1])&&e.shN.shape[1]>0){let r=Math.floor(e.shN.shape[1]/3);s=r>0?Math.round(Math.sqrt(r+1)-1):0}if(!(s>0))return{degree:0,coeffs:0};if(s>t)X.Warn(`GaussianSplattingStream: SH degree ${s} exceeds the maximum supported (${t}); clamping.`),s=t;return{degree:s,coeffs:(s+1)**2-1}}static _DisposePack(e){e.meansTextureL.dispose(),e.meansTextureU.dispose(),e.scalesTexture.dispose(),e.quatsTexture.dispose(),e.sh0Texture.dispose(),e.shCentroidsTexture?.dispose(),e.shLabelsTexture?.dispose(),e.codebookTexture?.dispose()}_updateBounds(e,t){let s=this._boundsMin,i=this._boundsMax;for(let r=0;r<t;r++){let n=e[r*4+0],o=e[r*4+1],a=e[r*4+2];s.minimizeInPlaceFromFloats(n,o,a),i.maximizeInPlaceFromFloats(n,o,a)}if(this._host)this._host.expandBounds(s,i);else this.setBoundingInfo(new ht(s,i))}_refreshActiveRanges(){let e=[];if(this._environmentRange)e.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let t of this._leafNodes){if(t.activeLod===void 0)continue;let s=t.lods[String(t.activeLod)];if(!s)continue;let i=this._residency?.offset(s.file);if(i===void 0)continue;e.push({offset:i+s.offset,count:s.count})}this._sinkSetActiveRanges(ne._CoalesceRanges(e))}static _CoalesceRanges(e){if(e.length<=1)return e;let t=e.slice().sort((i,r)=>i.offset-r.offset),s=[{offset:t[0].offset,count:t[0].count}];for(let i=1;i<t.length;i++){let r=s[s.length-1],n=t[i],o=r.offset+r.count;if(n.offset<=o){let a=Math.max(o,n.offset+n.count);r.count=a-r.offset}else s.push({offset:n.offset,count:n.count})}return s}async _unzipAsync(e){let t=this._streamOptions.fflate;if(!t){if(typeof window.fflate>"u")await re.LoadScriptAsync(this._streamOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");t=window.fflate}let s=t.unzipSync(e),i=new Map;for(let[r,n]of Object.entries(s))i.set(r,n);return i}}class ft{constructor(e,t,s,i,r){this.idx=0,this.color=new V(1,1,1,1),this.position=S.Zero(),this.rotation=S.Zero(),this.uv=new he(0,0),this.velocity=S.Zero(),this.pivot=S.Zero(),this.translateFromPivot=!1,this._pos=0,this._ind=0,this.groupId=0,this.idxInGroup=0,this._stillInvisible=!1,this._rotationMatrix=[1,0,0,0,1,0,0,0,1],this.parentId=null,this._globalPosition=S.Zero(),this.idx=e,this._group=t,this.groupId=s,this.idxInGroup=i,this._pcs=r}get size(){return this.size}set size(e){this.size=e}get quaternion(){return this.rotationQuaternion}set quaternion(e){this.rotationQuaternion=e}intersectsMesh(e,t){if(!e.hasBoundingInfo)return!1;if(!this._pcs.mesh)throw Error("Point Cloud System doesnt contain the Mesh");if(t)return e.getBoundingInfo().boundingSphere.intersectsPoint(this.position.add(this._pcs.mesh.position));let s=e.getBoundingInfo().boundingBox,i=s.maximumWorld.x,r=s.minimumWorld.x,n=s.maximumWorld.y,o=s.minimumWorld.y,a=s.maximumWorld.z,l=s.minimumWorld.z,u=this.position.x+this._pcs.mesh.position.x,c=this.position.y+this._pcs.mesh.position.y,p=this.position.z+this._pcs.mesh.position.z;return r<=u&&u<=i&&o<=c&&c<=n&&l<=p&&p<=a}getRotationMatrix(e){let t;if(this.rotationQuaternion)t=this.rotationQuaternion;else{t=U.Quaternion[0];let s=this.rotation;Ne.RotationYawPitchRollToRef(s.y,s.x,s.z,t)}t.toRotationMatrix(e)}}class De{get groupID(){return this.groupId}set groupID(e){this.groupId=e}constructor(e,t){this.groupId=e,this._positionFunction=t}}var Es={internalPickerForMesh:void 0};class P{constructor(e,t,s=Number.MAX_VALUE,i=ks){this.origin=e,this.direction=t,this.length=s,this.epsilon=i}clone(){return new P(this.origin.clone(),this.direction.clone(),this.length)}intersectsBoxMinMax(e,t,s=0){let i=P._TmpVector3[0].copyFromFloats(e.x-s,e.y-s,e.z-s),r=P._TmpVector3[1].copyFromFloats(t.x+s,t.y+s,t.z+s),n=0,o=Number.MAX_VALUE,a,l,u,c;if(Math.abs(this.direction.x)<0.0000001){if(this.origin.x<i.x||this.origin.x>r.x)return!1}else{if(a=1/this.direction.x,l=(i.x-this.origin.x)*a,u=(r.x-this.origin.x)*a,u===-1/0)u=1/0;if(l>u)c=l,l=u,u=c;if(n=Math.max(l,n),o=Math.min(u,o),n>o)return!1}if(Math.abs(this.direction.y)<0.0000001){if(this.origin.y<i.y||this.origin.y>r.y)return!1}else{if(a=1/this.direction.y,l=(i.y-this.origin.y)*a,u=(r.y-this.origin.y)*a,u===-1/0)u=1/0;if(l>u)c=l,l=u,u=c;if(n=Math.max(l,n),o=Math.min(u,o),n>o)return!1}if(Math.abs(this.direction.z)<0.0000001){if(this.origin.z<i.z||this.origin.z>r.z)return!1}else{if(a=1/this.direction.z,l=(i.z-this.origin.z)*a,u=(r.z-this.origin.z)*a,u===-1/0)u=1/0;if(l>u)c=l,l=u,u=c;if(n=Math.max(l,n),o=Math.min(u,o),n>o)return!1}return!0}intersectsBox(e,t=0){return this.intersectsBoxMinMax(e.minimum,e.maximum,t)}intersectsSphere(e,t=0){let s=e.center.x-this.origin.x,i=e.center.y-this.origin.y,r=e.center.z-this.origin.z,n=s*s+i*i+r*r,o=e.radius+t,a=o*o;if(n<=a)return!0;let l=s*this.direction.x+i*this.direction.y+r*this.direction.z;if(l<0)return!1;return n-l*l<=a}intersectsTriangle(e,t,s){let i=P._TmpVector3[0],r=P._TmpVector3[1],n=P._TmpVector3[2],o=P._TmpVector3[3],a=P._TmpVector3[4];t.subtractToRef(e,i),s.subtractToRef(e,r),S.CrossToRef(this.direction,r,n);let l=S.Dot(i,n);if(l===0)return null;let u=1/l;this.origin.subtractToRef(e,o);let c=S.Dot(o,n)*u;if(c<-this.epsilon||c>1+this.epsilon)return null;S.CrossToRef(o,i,a);let p=S.Dot(this.direction,a)*u;if(p<-this.epsilon||c+p>1+this.epsilon)return null;let f=S.Dot(r,a)*u;if(f>this.length||f<0)return null;return new Is(1-c-p,c,f)}intersectsPlane(e){let t,s=S.Dot(e.normal,this.direction);if(Math.abs(s)<0.000000999999997475243)return null;else{let i=S.Dot(e.normal,this.origin);if(t=(-e.d-i)/s,t<0)if(t<-0.000000999999997475243)return null;else return 0;return t}}intersectsAxis(e,t=0){switch(e){case"y":{let s=(this.origin.y-t)/this.direction.y;if(s>0)return null;return new S(this.origin.x+this.direction.x*-s,t,this.origin.z+this.direction.z*-s)}case"x":{let s=(this.origin.x-t)/this.direction.x;if(s>0)return null;return new S(t,this.origin.y+this.direction.y*-s,this.origin.z+this.direction.z*-s)}case"z":{let s=(this.origin.z-t)/this.direction.z;if(s>0)return null;return new S(this.origin.x+this.direction.x*-s,this.origin.y+this.direction.y*-s,t)}default:return null}}intersectsMesh(e,t,s,i=!1,r,n=!1){let o=U.Matrix[0];if(e.getWorldMatrix().invertToRef(o),this._tmpRay)P.TransformToRef(this,o,this._tmpRay);else this._tmpRay=P.Transform(this,o);return e.intersects(this._tmpRay,t,s,i,r,n)}intersectsMeshes(e,t,s){if(s)s.length=0;else s=[];for(let i=0;i<e.length;i++){let r=this.intersectsMesh(e[i],t);if(r.hit)s.push(r)}return s.sort(this._comparePickingInfo),s}_comparePickingInfo(e,t){if(e.distance<t.distance)return-1;else if(e.distance>t.distance)return 1;else return 0}intersectionSegment(e,t,s){let i=this.origin,r=U.Vector3[0],n=U.Vector3[1],o=U.Vector3[2],a=U.Vector3[3];t.subtractToRef(e,r),this.direction.scaleToRef(P._Rayl,o),i.addToRef(o,n),e.subtractToRef(i,a);let l=S.Dot(r,r),u=S.Dot(r,o),c=S.Dot(o,o),p=S.Dot(r,a),f=S.Dot(o,a),g=l*c-u*u,x,b=g,M,h=g;if(g<P._Smallnum)x=0,b=1,M=f,h=c;else if(x=u*f-c*p,M=l*f-u*p,x<0)x=0,M=f,h=c;else if(x>b)x=b,M=f+u,h=c;if(M<0)if(M=0,-p<0)x=0;else if(-p>l)x=b;else x=-p,b=l;else if(M>h)if(M=h,-p+u<0)x=0;else if(-p+u>l)x=b;else x=-p+u,b=l;let m=Math.abs(x)<P._Smallnum?0:x/b,d=Math.abs(M)<P._Smallnum?0:M/h,y=U.Vector3[4];o.scaleToRef(d,y);let w=U.Vector3[5];r.scaleToRef(m,w),w.addInPlace(a);let _=U.Vector3[6];if(w.subtractToRef(y,_),d>0&&d<=this.length&&_.lengthSquared()<s*s)return w.length();return-1}update(e,t,s,i,r,n,o,a=!1){if(a){if(!P._RayDistant)P._RayDistant=P.Zero();P._RayDistant.unprojectRayToRef(e,t,s,i,H.IdentityReadOnly,n,o);let l=U.Matrix[0];r.invertToRef(l),P.TransformToRef(P._RayDistant,l,this)}else this.unprojectRayToRef(e,t,s,i,r,n,o);return this}static Zero(){return new P(S.Zero(),S.Zero())}static CreateNew(e,t,s,i,r,n,o){return P.Zero().update(e,t,s,i,r,n,o)}static CreateNewFromTo(e,t,s=H.IdentityReadOnly){let i=new P(new S(0,0,0),new S(0,0,0));return P.CreateFromToToRef(e,t,i,s)}static CreateFromToToRef(e,t,s,i=H.IdentityReadOnly){s.origin.copyFrom(e);let r=t.subtractToRef(e,s.direction),n=Math.sqrt(r.x*r.x+r.y*r.y+r.z*r.z);return s.length=n,s.direction.normalize(),P.TransformToRef(s,i,s)}static Transform(e,t){let s=new P(new S(0,0,0),new S(0,0,0));return P.TransformToRef(e,t,s),s}static TransformToRef(e,t,s){S.TransformCoordinatesToRef(e.origin,t,s.origin),S.TransformNormalToRef(e.direction,t,s.direction),s.length=e.length,s.epsilon=e.epsilon;let i=s.direction,r=i.length();if(!(r===0||r===1)){let n=1/r;i.x*=n,i.y*=n,i.z*=n,s.length*=r}return s}unprojectRayToRef(e,t,s,i,r,n,o){let a=U.Matrix[0];r.multiplyToRef(n,a),a.multiplyToRef(o,a),a.invert();let l=Ze.LastCreatedEngine,u=U.Vector3[0];u.x=e/s*2-1,u.y=-(t/i*2-1),u.z=l?.useReverseDepthBuffer?1:l?.isNDCHalfZRange?0:-1;let c=U.Vector3[1].copyFromFloats(u.x,u.y,0.99999999),p=U.Vector3[2],f=U.Vector3[3];S.TransformCoordinatesToRef(u,a,p),S.TransformCoordinatesToRef(c,a,f),this.origin.copyFrom(p),f.subtractToRef(p,this.direction),this.direction.normalize()}}P._TmpVector3=Bs(6,S.Zero);P._RayDistant=P.Zero();P._Smallnum=0.00000001;P._Rayl=1e9;function je(e,t,s,i,r,n=!1){let o=P.Zero();return Le(e,t,s,i,o,r,n),o}function Le(e,t,s,i,r,n,o=!1,a=!1){let l=e.getEngine();if(!n&&!(n=e.activeCamera)&&!(n=e.cameraToUseForPointers))return e;let u=n.viewport,c=l.getRenderHeight(),{x:p,y:f,width:g,height:x}=u.toGlobal(l.getRenderWidth(),c),b=1/l.getHardwareScalingLevel();return t=t*b-p,s=s*b-(c-f-x),r.update(t,s,g,x,i?i:H.IdentityReadOnly,o?H.IdentityReadOnly:n.getViewMatrix(),n.getProjectionMatrix(),a),e}function Os(e,t,s,i){let r=P.Zero();return pt(e,t,s,r,i),r}function pt(e,t,s,i,r){if(!Ae)return e;let n=e.getEngine();if(!r&&!(r=e.activeCamera)&&!(r=e.cameraToUseForPointers))throw Error("Active camera not set");let o=r.viewport,a=n.getRenderHeight(),{x:l,y:u,width:c,height:p}=o.toGlobal(n.getRenderWidth(),a),f=H.Identity(),g=1/n.getHardwareScalingLevel();return t=t*g-l,s=s*g-(a-u-p),i.update(t,s,c,p,f,f,r.getProjectionMatrix()),e}function He(e,t,s,i,r,n,o,a){let l=t(i,s.enableDistantPicking);return _t(e,s,i,l,r,n,o,a)}function _t(e,t,s,i,r,n,o,a){let l=t.intersects(i,r,o,n,s,a);if(!l||!l.hit)return null;if(!r&&e!=null&&l.distance>=e.distance)return null;return l}function vi(e,t){return e==="InstancedLinesMesh"||e==="LinesMesh"?t.intersectionThreshold:0}function Ws(e){let t=e.getClassName();if(t==="GreasedLineMesh")return{rawBoundingInfo:null,intersectionThreshold:0};let s=e.rawBoundingInfo;return{rawBoundingInfo:s,intersectionThreshold:s?vi(t,e):0}}function Vs(e,t,s,i,r){let n=e(s,t.enableDistantPicking);if(!n.intersectsSphere(i.boundingSphere,r)||!n.intersectsBox(i.boundingBox,r))return null;return n}function mt(e,t,s,i,r,n){let o=null,a=!!(e.activeCameras&&e.activeCameras.length>1&&e.cameraToUseForPointers!==e.activeCamera),l=e.cameraToUseForPointers||e.activeCamera,u=Es.internalPickerForMesh||He,c=u===He;for(let p=0;p<e.meshes.length;p++){let f=e.meshes[p];if(s){if(!s(f,-1))continue}else if(!f.isEnabled()||!f.isVisible||!f.isPickable)continue;let g=a&&f.isWorldMatrixCameraDependent(),x=f.computeWorldMatrix(g,l);if(f.hasThinInstances&&f.thinInstanceEnablePicking){let b=u(o,t,f,x,!0,!0,n);if(b){if(r)return b;let{rawBoundingInfo:M,intersectionThreshold:h}=Ws(f),m=f._thinInstanceDataStorage.matrixData;if(m){let d=U.Matrix[0],y=U.Matrix[1],w=Math.min(f.thinInstanceCount,m.length>>4);for(let _=0;_<w;_++){if(s&&!s(f,_))continue;H.FromArrayToRef(m,_<<4,d),d.multiplyToRef(x,y);let v=c&&M?Vs(t,f,y,M,h):null;if(c&&M&&!v)continue;let R=c&&v?_t(o,f,y,v,i,r,n,!0):u(o,t,f,y,i,r,n,!0);if(R){if(o=R,o.thinInstanceIndex=_,i)return o}}}}}else{let b=u(o,t,f,x,i,r,n);if(b){if(o=b,i)return o}}}return o||new Ae}function Us(e,t,s,i){if(!Ae)return null;let r=[],n=!!(e.activeCameras&&e.activeCameras.length>1&&e.cameraToUseForPointers!==e.activeCamera),o=e.cameraToUseForPointers||e.activeCamera,a=Es.internalPickerForMesh||He,l=a===He;for(let u=0;u<e.meshes.length;u++){let c=e.meshes[u];if(s){if(!s(c,-1))continue}else if(!c.isEnabled()||!c.isVisible||!c.isPickable)continue;let p=n&&c.isWorldMatrixCameraDependent(),f=c.computeWorldMatrix(p,o);if(c.hasThinInstances&&c.thinInstanceEnablePicking){if(a(null,t,c,f,!0,!0,i)){let{rawBoundingInfo:x,intersectionThreshold:b}=Ws(c),M=c._thinInstanceDataStorage.matrixData;if(M){let h=U.Matrix[0],m=U.Matrix[1],d=Math.min(c.thinInstanceCount,M.length>>4);for(let y=0;y<d;y++){if(s&&!s(c,y))continue;H.FromArrayToRef(M,y<<4,h),h.multiplyToRef(f,m);let w=l&&x?Vs(t,c,m,x,b):null;if(l&&x&&!w)continue;let _=l&&w?_t(null,c,m,w,!1,!1,i,!0):a(null,t,c,m,!1,!1,i,!0);if(_)_.thinInstanceIndex=y,r.push(_)}}}}else{let g=a(null,t,c,f,!1,!1,i);if(g)r.push(g)}}return r}function Gs(e,t,s,i,r,n){if(!Ae)return null;let o=mt(e,(a)=>{if(!e._tempPickingRay)e._tempPickingRay=P.Zero();return Le(e,t,s,a,e._tempPickingRay,n||null),e._tempPickingRay},i,r,!0);if(o)o.ray=je(e,t,s,H.Identity(),n||null);return o}function Ns(e,t,s,i,r,n,o,a=!1){let l=mt(e,(u,c)=>{if(!e._tempPickingRay)e._tempPickingRay=P.Zero();return Le(e,t,s,u,e._tempPickingRay,n||null,!1,c),e._tempPickingRay},i,r,!1,o);if(l)l.ray=je(e,t,s,H.Identity(),n||null);return l}function Xs(e,t,s,i,r){let n=mt(e,(o)=>{if(!e._pickWithRayInverseMatrix)e._pickWithRayInverseMatrix=H.Identity();if(o.invertToRef(e._pickWithRayInverseMatrix),!e._cachedRayForTransform)e._cachedRayForTransform=P.Zero();return P.TransformToRef(t,e._pickWithRayInverseMatrix,e._cachedRayForTransform),e._cachedRayForTransform},s,i,!1,r);if(n)n.ray=t;return n}function Hs(e,t,s,i,r,n){return Us(e,(o)=>je(e,t,s,o,r||null),i,n)}function Zs(e,t,s,i){return Us(e,(r)=>{if(!e._pickWithRayInverseMatrix)e._pickWithRayInverseMatrix=H.Identity();if(r.invertToRef(e._pickWithRayInverseMatrix),!e._cachedRayForTransform)e._cachedRayForTransform=P.Zero();return P.TransformToRef(t,e._pickWithRayInverseMatrix,e._cachedRayForTransform),e._cachedRayForTransform},s,i)}function io(e,t=100,s,i){return dt(e,new P(S.Zero(),S.Zero(),t),t,s,i)}function dt(e,t,s=100,i,r){if(!i)i=e.getWorldMatrix();if(t.length=s,r)t.origin.copyFrom(r);else t.origin.copyFrom(e.position);let n=U.Vector3[2];n.set(0,0,e._scene.useRightHandedSystem?-1:1);let o=U.Vector3[3];return S.TransformNormalToRef(n,i,o),S.NormalizeToRef(o,t.direction),t}function js(e,t){if(t)t.prototype.getForwardRay=function(s=100,i,r){return dt(this,new P(S.Zero(),S.Zero(),s),s,i,r)},t.prototype.getForwardRayToRef=function(s,i=100,r,n){return dt(this,s,i,r,n)};if(!e)return;zs._IsPickingAvailable=!0,e.prototype.createPickingRay=function(s,i,r,n,o=!1){return je(this,s,i,r,n,o)}}var Ys=!1;function lo(){if(Ys)return;Ys=!0,js(ae,Xe),ae.prototype.createPickingRayToRef=function(e,t,s,i,r,n=!1,o=!1){return Le(this,e,t,s,i,r,n,o)},ae.prototype.createPickingRayInCameraSpace=function(e,t,s){return Os(this,e,t,s)},ae.prototype.createPickingRayInCameraSpaceToRef=function(e,t,s,i){return pt(this,e,t,s,i)},ae.prototype.pickWithBoundingInfo=function(e,t,s,i,r){return Gs(this,e,t,s,i,r)},ae.prototype.pick=function(e,t,s,i,r,n,o=!1){return Ns(this,e,t,s,i,r,n,o)},ae.prototype.pickWithRay=function(e,t,s,i){return Xs(this,e,t,s,i)},ae.prototype.multiPick=function(e,t,s,i,r){return Hs(this,e,t,s,i,r)},ae.prototype.multiPickWithRay=function(e,t,s){return Zs(this,e,t,s)}}var Qs;(function(e){e[e.Color=2]="Color",e[e.UV=1]="UV",e[e.Random=0]="Random",e[e.Stated=3]="Stated"})(Qs||(Qs={}));class gt{get positions(){return this._positions32}get colors(){return this._colors32}get uvs(){return this._uvs32}constructor(e,t,s,i){if(this.particles=[],this.nbParticles=0,this.counter=0,this.vars={},this._promises=[],this._positions=[],this._indices=[],this._normals=[],this._colors=[],this._uvs=[],this._updatable=!0,this._isVisibilityBoxLocked=!1,this._alwaysVisible=!1,this._groups=[],this._groupCounter=0,this._computeParticleColor=!0,this._computeParticleTexture=!0,this._computeParticleRotation=!0,this._computeBoundingBox=!1,this._isReady=!1,this.name=e,this._size=t,this._scene=s||Ze.LastCreatedScene,i&&i.updatable!==void 0)this._updatable=i.updatable;else this._updatable=!0}async buildMeshAsync(e){return await Promise.all(this._promises),this._isReady=!0,await this._buildMeshAsync(e)}async _buildMeshAsync(e){if(this.nbParticles===0)this.addPoints(1);this._positions32=new Float32Array(this._positions),this._uvs32=new Float32Array(this._uvs),this._colors32=new Float32Array(this._colors);let t=new se;if(t.set(this._positions32,N.PositionKind),this._uvs32.length>0)t.set(this._uvs32,N.UVKind);let s=0;if(this._colors32.length>0)s=1,t.set(this._colors32,N.ColorKind);let i=new K(this.name,this._scene);if(t.applyToMesh(i,this._updatable),this.mesh=i,this._positions=null,this._uvs=null,this._colors=null,!this._updatable)this.particles.length=0;let r=e;if(!r)r=new Ks("point cloud material",this._scene),r.emissiveColor=new ce(s,s,s),r.disableLighting=!0,r.pointsCloud=!0,r.pointSize=this._size;return i.material=r,i}_addParticle(e,t,s,i){let r=new ft(e,t,s,i,this);return this.particles.push(r),r}_randomUnitVector(e){e.position=new S(Math.random(),Math.random(),Math.random()),e.color=new V(1,1,1,1)}_getColorIndicesForCoord(e,t,s,i){let r=e._groupImageData,n=s*(i*4)+t*4,o=[n,n+1,n+2,n+3],a=o[0],l=o[1],u=o[2],c=o[3],p=r[a],f=r[l],g=r[u],x=r[c];return new V(p/255,f/255,g/255,x)}_setPointsColorOrUV(e,t,s,i,r,n,o,a){if(a=a??0,s)e.updateFacetData();let u=2*e.getBoundingInfo().boundingSphere.radius,c=e.getVerticesData(N.PositionKind),p=e.getIndices(),f=e.getVerticesData(N.UVKind+(a?a+1:"")),g=e.getVerticesData(N.ColorKind),x=S.Zero();e.computeWorldMatrix();let b=e.getWorldMatrix();if(!b.isIdentity()){c=c.slice(0);for(let Z=0;Z<c.length/3;Z++)S.TransformCoordinatesFromFloatsToRef(c[3*Z],c[3*Z+1],c[3*Z+2],b,x),c[3*Z]=x.x,c[3*Z+1]=x.y,c[3*Z+2]=x.z}let M,h,m,d,y,w,_,v,R,L,k,C,A,z=S.Zero(),T=S.Zero(),F=S.Zero(),O=S.Zero(),B=S.Zero(),G,E,D,j,ee,ie,Y=he.Zero(),I=he.Zero(),Mt=he.Zero(),bt=he.Zero(),vt=he.Zero(),wt,Rt,Tt,Ct,Dt,At,Lt,Ft,Pt,qt,kt,Bt,we=oe.Zero(),$e=oe.Zero(),zt=oe.Zero(),It=oe.Zero(),Et=oe.Zero(),de,Fe;o=o?o:0;let Re,Pe,W=new oe(0,0,0,1),Ke,Je,Ot,xe,Wt,Vt,Ut,qe=new P(S.Zero(),new S(1,0,0)),et,ke;for(let Z=0;Z<p.length/3;Z++){if(h=p[3*Z],m=p[3*Z+1],d=p[3*Z+2],y=c[3*h],w=c[3*h+1],_=c[3*h+2],v=c[3*m],R=c[3*m+1],L=c[3*m+2],k=c[3*d],C=c[3*d+1],A=c[3*d+2],z.set(y,w,_),T.set(v,R,L),F.set(k,C,A),T.subtractToRef(z,O),F.subtractToRef(T,B),f)G=f[2*h],E=f[2*h+1],D=f[2*m],j=f[2*m+1],ee=f[2*d],ie=f[2*d+1],Y.set(G,E),I.set(D,j),Mt.set(ee,ie),I.subtractToRef(Y,bt),Mt.subtractToRef(I,vt);if(g&&i)wt=g[4*h],Rt=g[4*h+1],Tt=g[4*h+2],Ct=g[4*h+3],Dt=g[4*m],At=g[4*m+1],Lt=g[4*m+2],Ft=g[4*m+3],Pt=g[4*d],qt=g[4*d+1],kt=g[4*d+2],Bt=g[4*d+3],we.set(wt,Rt,Tt,Ct),$e.set(Dt,At,Lt,Ft),zt.set(Pt,qt,kt,Bt),$e.subtractToRef(we,It),zt.subtractToRef($e,Et);let tt,Gt,Nt,Xt,Ht,ye,Se,Be,Zt=new ce(0,0,0),ze=new ce(0,0,0),Me,Q;for(let st=0;st<t._groupDensity[Z];st++){if(M=this.particles.length,this._addParticle(M,t,this._groupCounter,Z+st),Q=this.particles[M],de=Math.sqrt(fe(0,1)),Fe=fe(0,1),Re=z.add(O.scale(de)).add(B.scale(de*Fe)),s){if(Ke=e.getFacetNormal(Z).normalize().scale(-1),Je=O.clone().normalize(),Ot=S.Cross(Ke,Je),xe=fe(0,2*Math.PI),Wt=Je.scale(Math.cos(xe)).add(Ot.scale(Math.sin(xe))),xe=fe(0.1,Math.PI/2),ke=Wt.scale(Math.cos(xe)).add(Ke.scale(Math.sin(xe))),qe.origin=Re.add(ke.scale(0.00001)),qe.direction=ke,qe.length=u,et=qe.intersectsMesh(e),et.hit)Ut=et.pickedPoint.subtract(Re).length(),Vt=fe(0,1)*Ut,Re.addInPlace(ke.scale(Vt))}if(Q.position=Re.clone(),this._positions.push(Q.position.x,Q.position.y,Q.position.z),i!==void 0){if(f)if(Pe=Y.add(bt.scale(de)).add(vt.scale(de*Fe)),i)if(r&&t._groupImageData!==null)tt=t._groupImgWidth,Gt=t._groupImgHeight,Me=this._getColorIndicesForCoord(t,Math.round(Pe.x*tt),Math.round(Pe.y*Gt),tt),Q.color=Me,this._colors.push(Me.r,Me.g,Me.b,Me.a);else if(g)W=we.add(It.scale(de)).add(Et.scale(de*Fe)),Q.color=new V(W.x,W.y,W.z,W.w),this._colors.push(W.x,W.y,W.z,W.w);else W=we.set(Math.random(),Math.random(),Math.random(),1),Q.color=new V(W.x,W.y,W.z,W.w),this._colors.push(W.x,W.y,W.z,W.w);else Q.uv=Pe.clone(),this._uvs.push(Q.uv.x,Q.uv.y)}else{if(n){if(Zt.set(n.r,n.g,n.b),Nt=fe(-o,o),Xt=fe(-o,o),Be=Zt.toHSV(),Ht=Be.r,ye=Be.g+Nt,Se=Be.b+Xt,ye<0)ye=0;if(ye>1)ye=1;if(Se<0)Se=0;if(Se>1)Se=1;ce.HSVtoRGBToRef(Ht,ye,Se,ze),W.set(ze.r,ze.g,ze.b,1)}else W=we.set(Math.random(),Math.random(),Math.random(),1);Q.color=new V(W.x,W.y,W.z,W.w),this._colors.push(W.x,W.y,W.z,W.w)}}}}_colorFromTexture(e,t,s){if(e.material===null){X.Warn(e.name+"has no material."),t._groupImageData=null,this._setPointsColorOrUV(e,t,s,!0,!1);return}let r=e.material.getActiveTextures();if(r.length===0){X.Warn(e.name+"has no usable texture."),t._groupImageData=null,this._setPointsColorOrUV(e,t,s,!0,!1);return}let n=e.clone();n.setEnabled(!1),this._promises.push(new Promise((o)=>{$s.WhenAllReady(r,()=>{let a=t._textureNb;if(a<0)a=0;if(a>r.length-1)a=r.length-1;let l=()=>{t._groupImgWidth=r[a].getSize().width,t._groupImgHeight=r[a].getSize().height,this._setPointsColorOrUV(n,t,s,!0,!0,void 0,void 0,r[a].coordinatesIndex),n.dispose(),o()};t._groupImageData=null;let u=r[a].readPixels();if(!u)l();else u.then((c)=>{t._groupImageData=c,l()})})}))}_calculateDensity(e,t,s){let i,r,n,o,a,l,u,c,p,f,g,x,b=S.Zero(),M=S.Zero(),h=S.Zero(),m=S.Zero(),d=S.Zero(),y=S.Zero(),w,_=[],v=0,R=s.length/3;for(let C=0;C<R;C++)i=s[3*C],r=s[3*C+1],n=s[3*C+2],o=t[3*i],a=t[3*i+1],l=t[3*i+2],u=t[3*r],c=t[3*r+1],p=t[3*r+2],f=t[3*n],g=t[3*n+1],x=t[3*n+2],b.set(o,a,l),M.set(u,c,p),h.set(f,g,x),M.subtractToRef(b,m),h.subtractToRef(M,d),S.CrossToRef(m,d,y),w=0.5*y.length(),v+=w,_[C]=v;let L=Array(R),k=e;for(let C=R-1;C>0;C--){let A=_[C];if(A===0)L[C]=0;else{let T=(A-_[C-1])/A*k,F=Math.floor(T),O=T-F,B=Number(Math.random()<O),G=F+B;L[C]=G,k-=G}}return L[0]=k,L}addPoints(e,t=this._randomUnitVector){let s=new De(this._groupCounter,t),i,r=this.nbParticles;for(let n=0;n<e;n++){if(i=this._addParticle(r,s,this._groupCounter,n),s&&s._positionFunction)s._positionFunction(i,r,n);if(this._positions.push(i.position.x,i.position.y,i.position.z),i.color)this._colors.push(i.color.r,i.color.g,i.color.b,i.color.a);if(i.uv)this._uvs.push(i.uv.x,i.uv.y);r++}return this.nbParticles+=e,this._groupCounter++,this._groupCounter}addSurfacePoints(e,t,s,i,r){let n=s?s:0;if(isNaN(n)||n<0||n>3)n=0;let o=e.getVerticesData(N.PositionKind),a=e.getIndices();this._groups.push(this._groupCounter);let l=new De(this._groupCounter,null);if(l._groupDensity=this._calculateDensity(t,o,a),n===2)l._textureNb=i?i:0;else i=i?i:new V(1,1,1,1);switch(n){case 2:this._colorFromTexture(e,l,!1);break;case 1:this._setPointsColorOrUV(e,l,!1,!1,!1);break;case 0:this._setPointsColorOrUV(e,l,!1);break;case 3:this._setPointsColorOrUV(e,l,!1,void 0,void 0,i,r);break}return this.nbParticles+=t,this._groupCounter++,this._groupCounter-1}addVolumePoints(e,t,s,i,r){let n=s?s:0;if(isNaN(n)||n<0||n>3)n=0;let o=e.getVerticesData(N.PositionKind),a=e.getIndices();this._groups.push(this._groupCounter);let l=new De(this._groupCounter,null);if(l._groupDensity=this._calculateDensity(t,o,a),n===2)l._textureNb=i?i:0;else i=i?i:new V(1,1,1,1);switch(n){case 2:this._colorFromTexture(e,l,!0);break;case 1:this._setPointsColorOrUV(e,l,!0,!1,!1);break;case 0:this._setPointsColorOrUV(e,l,!0);break;case 3:this._setPointsColorOrUV(e,l,!0,void 0,void 0,i,r);break}return this.nbParticles+=t,this._groupCounter++,this._groupCounter-1}setParticles(e=0,t=this.nbParticles-1,s=!0){if(!this._updatable||!this._isReady)return this;this.beforeUpdateParticles(e,t,s);let i=U.Matrix[0],r=this.mesh,n=this._colors32,o=this._positions32,a=this._uvs32,l=U.Vector3,u=l[5].copyFromFloats(1,0,0),c=l[6].copyFromFloats(0,1,0),p=l[7].copyFromFloats(0,0,1),f=l[8].setAll(Number.MAX_VALUE),g=l[9].setAll(-Number.MAX_VALUE);H.IdentityToRef(i);let x;if(this.mesh?.isFacetDataEnabled)this._computeBoundingBox=!0;if(t=t>=this.nbParticles?this.nbParticles-1:t,this._computeBoundingBox){if(e!=0||t!=this.nbParticles-1){let m=this.mesh?.getBoundingInfo();if(m)f.copyFrom(m.minimum),g.copyFrom(m.maximum)}}let b,M,h;for(let m=e;m<=t;m++){let d=this.particles[m];x=d.idx,b=3*x,M=4*x,h=2*x,this.updateParticle(d);let{_rotationMatrix:y,position:w,_globalPosition:_}=d;if(this._computeParticleRotation)d.getRotationMatrix(i);if(d.parentId!==null){let E=this.particles[d.parentId],D=E._rotationMatrix,j=E._globalPosition,ee=w.x*D[1]+w.y*D[4]+w.z*D[7],ie=w.x*D[0]+w.y*D[3]+w.z*D[6],Y=w.x*D[2]+w.y*D[5]+w.z*D[8];if(_.x=j.x+ie,_.y=j.y+ee,_.z=j.z+Y,this._computeParticleRotation){let I=i.m;y[0]=I[0]*D[0]+I[1]*D[3]+I[2]*D[6],y[1]=I[0]*D[1]+I[1]*D[4]+I[2]*D[7],y[2]=I[0]*D[2]+I[1]*D[5]+I[2]*D[8],y[3]=I[4]*D[0]+I[5]*D[3]+I[6]*D[6],y[4]=I[4]*D[1]+I[5]*D[4]+I[6]*D[7],y[5]=I[4]*D[2]+I[5]*D[5]+I[6]*D[8],y[6]=I[8]*D[0]+I[9]*D[3]+I[10]*D[6],y[7]=I[8]*D[1]+I[9]*D[4]+I[10]*D[7],y[8]=I[8]*D[2]+I[9]*D[5]+I[10]*D[8]}}else if(_.x=0,_.y=0,_.z=0,this._computeParticleRotation){let E=i.m;y[0]=E[0],y[1]=E[1],y[2]=E[2],y[3]=E[4],y[4]=E[5],y[5]=E[6],y[6]=E[8],y[7]=E[9],y[8]=E[10]}let R=l[11];if(d.translateFromPivot)R.setAll(0);else R.copyFrom(d.pivot);let L=l[0];L.copyFrom(d.position);let k=L.x-d.pivot.x,C=L.y-d.pivot.y,A=L.z-d.pivot.z,z=k*y[0]+C*y[3]+A*y[6],T=k*y[1]+C*y[4]+A*y[7],F=k*y[2]+C*y[5]+A*y[8];z+=R.x,T+=R.y,F+=R.z;let O=o[b]=_.x+u.x*z+c.x*T+p.x*F,B=o[b+1]=_.y+u.y*z+c.y*T+p.y*F,G=o[b+2]=_.z+u.z*z+c.z*T+p.z*F;if(this._computeBoundingBox)f.minimizeInPlaceFromFloats(O,B,G),g.maximizeInPlaceFromFloats(O,B,G);if(this._computeParticleColor&&d.color){let E=d.color,D=this._colors32;D[M]=E.r,D[M+1]=E.g,D[M+2]=E.b,D[M+3]=E.a}if(this._computeParticleTexture&&d.uv){let E=d.uv,D=this._uvs32;D[h]=E.x,D[h+1]=E.y}}if(r){if(s){if(this._computeParticleColor)r.updateVerticesData(N.ColorKind,n,!1,!1);if(this._computeParticleTexture)r.updateVerticesData(N.UVKind,a,!1,!1);r.updateVerticesData(N.PositionKind,o,!1,!1)}if(this._computeBoundingBox)if(r.hasBoundingInfo)r.getBoundingInfo().reConstruct(f,g,r._worldMatrix);else r.buildBoundingInfo(f,g,r._worldMatrix)}return this.afterUpdateParticles(e,t,s),this}dispose(){this.mesh?.dispose(),this.vars=null,this._positions=null,this._indices=null,this._normals=null,this._uvs=null,this._colors=null,this._indices32=null,this._positions32=null,this._uvs32=null,this._colors32=null}refreshVisibleSize(){if(!this._isVisibilityBoxLocked)this.mesh?.refreshBoundingInfo();return this}setVisibilityBox(e){if(!this.mesh)return;let t=e/2;this.mesh.buildBoundingInfo(new S(-t,-t,-t),new S(t,t,t))}get isAlwaysVisible(){return this._alwaysVisible}set isAlwaysVisible(e){if(!this.mesh)return;this._alwaysVisible=e,this.mesh.alwaysSelectAsActiveMesh=e}set computeParticleRotation(e){this._computeParticleRotation=e}set computeParticleColor(e){this._computeParticleColor=e}set computeParticleTexture(e){this._computeParticleTexture=e}get computeParticleColor(){return this._computeParticleColor}get computeParticleTexture(){return this._computeParticleTexture}set computeBoundingBox(e){this._computeBoundingBox=e}get computeBoundingBox(){return this._computeBoundingBox}initParticles(){}recycleParticle(e){return e}updateParticle(e){return e}beforeUpdateParticles(e,t,s){}afterUpdateParticles(e,t,s){}}var Ye=0;async function ei(e,t){return await new Promise((s,i)=>{let r,n;if(Js())r=window,n="window";else if(typeof self<"u")r=self,n="self";else{i(Error("Cannot load script module outside of a window or a worker"));return}if(!r._LoadScriptModuleResolve)r._LoadScriptModuleResolve={};r._LoadScriptModuleResolve[Ye]=s,e+=`
            ${n}._LoadScriptModuleResolve[${Ye}](returnedValue);
            ${n}._LoadScriptModuleResolve[${Ye}] = undefined;
        `,Ye++,re.LoadScript(e,void 0,(o,a)=>{i(a||Error(o))},t,!0)})}var wi=32768,Qe=0.28209479177387814,xt=null,ti=null;function ri(e,t,s){let i=new Uint8Array(e),r=new Uint32Array(e.slice(0,12)),n=r[2],o=i[12],a=i[13],l=i[14],u=i[15],c=r[1];if(u||r[0]!=1347635022||c<2||c>4)return new Promise((_)=>{_({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let f=new ArrayBuffer(32*n),g=1/(1<<a),x=new Int32Array(1),b=new Uint8Array(x.buffer),M=function(_,v){return b[0]=_[v+0],b[1]=_[v+1],b[2]=_[v+2],b[3]=_[v+2]&128?255:0,x[0]*g},h=16,m=new Float32Array(f),d=new Float32Array(f),y=new Uint8ClampedArray(f),w=new Uint8ClampedArray(f);for(let _=0;_<n;_++)m[_*8+0]=M(i,h+0),m[_*8+1]=M(i,h+3),m[_*8+2]=M(i,h+6),h+=9;for(let _=0;_<n;_++){for(let v=0;v<3;v++){let L=(i[h+n+_*3+v]-127.5)/38.25;y[_*32+24+v]=ue.Clamp((0.5+Qe*L)*255,0,255)}y[_*32+24+3]=i[h+_]}h+=n*4;for(let _=0;_<n;_++)d[_*8+3+0]=Math.exp(i[h+0]/16-10),d[_*8+3+1]=Math.exp(i[h+1]/16-10),d[_*8+3+2]=Math.exp(i[h+2]/16-10),h+=3;if(c>=3){let _=Math.SQRT1_2;for(let v=0;v<n;v++){let R=[i[h+0],i[h+1],i[h+2],i[h+3]],L=R[0]+(R[1]<<8)+(R[2]<<16)+(R[3]<<24),k=511,C=[],A=L>>>30,z=L,T=0;for(let B=3;B>=0;--B)if(B!==A){let G=z&511,E=z>>>9&1;if(z=z>>>10,C[B]=_*(G/511),E===1)C[B]=-C[B];T+=C[B]*C[B]}let F=1-T;C[A]=Math.sqrt(Math.max(F,0));let O=[3,0,1,2];for(let B=0;B<4;B++)w[v*32+28+B]=Math.round(127.5+C[O[B]]*127.5);h+=4}}else for(let _=0;_<n;_++){let v=i[h+0],R=i[h+1],L=i[h+2],k=v/127.5-1,C=R/127.5-1,A=L/127.5-1;w[_*32+28+1]=v,w[_*32+28+2]=R,w[_*32+28+3]=L;let z=1-(k*k+C*C+A*A);w[_*32+28+0]=127.5+Math.sqrt(z<0?0:z)*127.5,h+=3}if(o){let v=((o+1)*(o+1)-1)*3,R=Math.ceil(v/16),L=h,C=t.getEngine().getCaps().maxTextureSize,A=Math.ceil(n/C),z=Te(R,A*C*4*4);for(let T=0;T<n;T++)for(let F=0;F<v;F++){let O=i[L++],B=Math.floor(F/16),G=z[B],E=F%16,D=T*16;G[E+D]=O}return new Promise((T)=>{T({mode:0,data:f,hasVertexColors:!1,sh:z,shDegree:o,trainedWithAntialiasing:!!l})})}return new Promise((_)=>{_({mode:0,data:f,hasVertexColors:!1,trainedWithAntialiasing:!!l})})}async function oi(e){if(xt&&ti===e)return await xt;let t=ei(`import createSpzModule from '${e}';
         const module = await createSpzModule();
         const returnedValue = module;`);return ti=e,xt=t,await t}function*Ri(e,t,s=!1){let i=e.numPoints,r=32,n=new ArrayBuffer(32*i),o=new Float32Array(n),a=new Uint8Array(n),l=e.positions,u=e.scales,c=e.colors,p=e.alphas,f=e.rotations,g=null,x=e.shDegree,b=null,M=0,h=null,m=null,d=null;if(x>0&&e.sh.length>0){M=((x+1)*(x+1)-1)*3;let v=Math.ceil(M/16),L=t.getEngine().getCaps().maxTextureSize,k=Math.ceil(i/L);g=Te(v,k*L*4*4),h=new Int32Array(v),m=new Int32Array(v);for(let C=0;C<v;C++)h[C]=C*16,m[C]=Math.min((C+1)*16,M);d=g,b=e.sh}for(let _=0;_<i;_++){let v=_*8,R=_*32,L=_*3,k=_*4;o[v+0]=l[L+0],o[v+1]=l[L+1],o[v+2]=l[L+2],o[v+3]=Math.exp(u[L+0]),o[v+4]=Math.exp(u[L+1]),o[v+5]=Math.exp(u[L+2]);let C=(0.5+Qe*c[L+0])*255,A=(0.5+Qe*c[L+1])*255,z=(0.5+Qe*c[L+2])*255;a[R+24]=C<=0?0:C>=255?255:C+0.5|0,a[R+25]=A<=0?0:A>=255?255:A+0.5|0,a[R+26]=z<=0?0:z>=255?255:z+0.5|0,a[R+27]=1/(1+Math.exp(-p[_]))*255+0.5|0;let T=f[k+3]*127.5+127.5,F=f[k+0]*127.5+127.5,O=f[k+1]*127.5+127.5,B=f[k+2]*127.5+127.5;if(a[R+28]=T<=0?0:T>=255?255:T+0.5|0,a[R+29]=F<=0?0:F>=255?255:F+0.5|0,a[R+30]=O<=0?0:O>=255?255:O+0.5|0,a[R+31]=B<=0?0:B>=255?255:B+0.5|0,b&&d&&h&&m){let G=_*M,E=_*16;for(let D=0;D<d.length;D++){let j=d[D],ee=h[D],ie=m[D];for(let Y=ee;Y<ie;Y++){let I=b[G+Y]*128+128;j[E+Y-ee]=I<=0?0:I>=255?255:I+0.5|0}}}if(_%wi===0&&s)yield}let y,w;if(e.extensions)for(let _ of e.extensions){let v=_;if(v.safeOrbitRadiusMin!==void 0){y=v.safeOrbitRadiusMin,w=[v.safeOrbitElevationMin,v.safeOrbitElevationMax];break}}return{mode:0,data:n,hasVertexColors:!1,sh:g!==null?g:void 0,shDegree:x>0?x:void 0,trainedWithAntialiasing:!!e.antialiased,safeOrbitCameraRadiusMin:y,safeOrbitCameraElevationMinMax:w}}async function ni(e,t){return await ii(Ri(e,t,!0),si())}class J{constructor(e={}){this.name=Ie.name,this._assetContainer=null,this.extensions=Ie.extensions,this._loadingOptions={...J._DefaultLoadingOptions,...e}}createPlugin(e){return new J(e[Ie.name])}async importMeshAsync(e,t,s,i,r,n){let o=this._tryCreateLODStream(t,s,i);if(o)return{meshes:[o],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]};return await this._parseAsync(e,t,s,i).then((a)=>({meshes:a,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(e,t,s){if(typeof t!=="string")return null;let i;try{i=JSON.parse(t)}catch{return null}if(!ne.IsLODMetadata(i))return null;let r=e._blockEntityCollection;e._blockEntityCollection=!!this._assetContainer;try{let n=new ne("GaussianSplattingStream",i,s,e,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return n._parentContainer=this._assetContainer,n}finally{e._blockEntityCollection=r}}static _BuildPointCloud(e,t){if(!t.byteLength)return!1;let s=new Uint8Array(t),i=new Float32Array(t),r=32,n=s.length/r,o=function(a,l){let u=i[8*l+0],c=i[8*l+1],p=i[8*l+2];a.position=new S(u,c,p);let f=s[r*l+24+0]/255,g=s[r*l+24+1]/255,x=s[r*l+24+2]/255;a.color=new V(f,g,x,1)};return e.addPoints(n,o),!0}static _BuildMesh(e,t){let s=new K("PLYMesh",e),i=new Uint8Array(t.data),r=new Float32Array(t.data),n=32,o=i.length/32,a=[],l=new se;for(let u=0;u<o;u++){let c=r[8*u+0],p=r[8*u+1],f=r[8*u+2];a.push(c,p,f)}if(t.hasVertexColors){let u=new Float32Array(o*4);for(let c=0;c<o;c++){let p=i[32*c+24+0]/255,f=i[32*c+24+1]/255,g=i[32*c+24+2]/255;u[c*4+0]=p,u[c*4+1]=f,u[c*4+2]=g,u[c*4+3]=1}l.colors=u}return l.positions=a,l.indices=t.faces,l.applyToMesh(s),s}async _unzipWithFFlateAsync(e){let t=this._loadingOptions.fflate;if(!t){if(typeof window.fflate>"u")await re.LoadScriptAsync(this._loadingOptions.deflateURL??"https://unpkg.com/fflate/umd/index.js");t=window.fflate}let{unzipSync:s}=t,i=s(e),r=new Map;for(let[n,o]of Object.entries(i))r.set(n,o);return r}_parseAsync(e,t,s,i){let r=[],n=(h)=>{t._blockEntityCollection=!!this._assetContainer;let m=this._loadingOptions.gaussianSplattingMesh??new ge("GaussianSplatting",null,t,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(m._parentContainer=this._assetContainer,r.push(m),h.sogTextures)m.setSogTextureData(h.sogTextures);else m.updateData(h.data,h.sh,{flipY:!1},void 0,h.shDegree);m.scaling.y*=-1,m.computeWorldMatrix(!0),m.safeOrbitCameraLimits=J._ExtractSafeOrbitLimits(h),t._blockEntityCollection=!1},o=t.getEngine(),a=this._loadingOptions.useSogTextures;if(a&&!o.isWebGPU&&o.version<2)X.Warn("SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path."),a=!1;let l=a?Ce:cs;if(typeof s==="string"){let h=JSON.parse(s);if(h&&h.means&&h.scales&&h.quats&&h.sh0)return new Promise((m,d)=>{l(h,i,t).then((y)=>{n(y),m(r)}).catch((y)=>{d(Error("Failed to parse SOG data.",{cause:y}))})})}let u=s instanceof ArrayBuffer?new Uint8Array(s):s;if(u[0]===80&&u[1]===75)return new Promise((h,m)=>{this._unzipWithFFlateAsync(u).then((d)=>{l(d,i,t).then((y)=>{n(y),h(r)}).catch((y)=>{m(Error("Failed to parse SOG zip data.",{cause:y}))})})});let c=(h)=>{J._ConvertPLYToSplat(s).then(async(m)=>{switch(t._blockEntityCollection=!!this._assetContainer,m.mode){case 0:{let d=this._loadingOptions.gaussianSplattingMesh??new ge("GaussianSplatting",null,t,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(d._parentContainer=this._assetContainer,r.push(d),d.updateData(m.data,m.sh,{flipY:!1},void 0,m.shDegree),d.scaling.y*=-1,m.chirality==="RightHanded")d.scaling.y*=-1;switch(m.upAxis){case"X":d.rotation=new S(0,0,Math.PI/2);break;case"Y":d.rotation=new S(0,0,Math.PI);break;case"Z":d.rotation=new S(-Math.PI/2,Math.PI,0);break}d.computeWorldMatrix(!0),d.safeOrbitCameraLimits=J._ExtractSafeOrbitLimits(m)}break;case 1:{let d=new gt("PointCloud",1,t);if(J._BuildPointCloud(d,m.data))await d.buildMeshAsync().then((y)=>{r.push(y)});else d.dispose()}break;case 2:if(m.faces)r.push(J._BuildMesh(t,m));else throw Error("PLY mesh doesn't contain face informations.");break;default:throw Error("Unsupported Splat mode")}t._blockEntityCollection=!1,this.applyAutoCameraLimits(J._ExtractSafeOrbitLimits(m),t),h(r)})},p=u[0]===31&&u[1]===139,f=u[0]===78&&u[1]===71&&u[2]===83&&u[3]===80;if(!p&&!f)return new Promise((h)=>{c(h)});let g=(h,m)=>{t._blockEntityCollection=!!this._assetContainer;let d=this._loadingOptions.gaussianSplattingMesh??new ge("GaussianSplatting",null,t,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(h.trainedWithAntialiasing){let w=d.material;w.kernelSize=0.1,w.compensation=!0}if(d._parentContainer=this._assetContainer,r.push(d),d.updateData(h.data,h.sh,{flipY:!1},void 0,h.shDegree),!this._loadingOptions.flipY)d.scaling.y*=-1,d.computeWorldMatrix(!0);t._blockEntityCollection=!1;let y=J._ExtractSafeOrbitLimits(h);d.safeOrbitCameraLimits=y,this.applyAutoCameraLimits(y,t),m(r)};if(this._loadingOptions.spzLibraryUrl)return oi(this._loadingOptions.spzLibraryUrl).then((h)=>{let m=h.loadSpzFromBuffer(new Uint8Array(s),{to:h.CoordinateSystem.RUB});return ni(m,t).then((d)=>new Promise((y)=>{g(d,y)}))});if(f)return Promise.reject(Error("SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment."));let x=new ReadableStream({start(h){h.enqueue(new Uint8Array(s)),h.close()}}),b=new DecompressionStream("gzip"),M=x.pipeThrough(b);return new Promise((h)=>{new Response(M).arrayBuffer().then((m)=>{ri(m,t,this._loadingOptions).then((d)=>{g(d,h)})}).catch(()=>{c(h)})})}static _ExtractSafeOrbitLimits(e){if(e.safeOrbitCameraRadiusMin===void 0&&e.safeOrbitCameraElevationMinMax===void 0)return null;return{radiusMin:e.safeOrbitCameraRadiusMin,elevationMinMax:e.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(e,t){if(this._loadingOptions.disableAutoCameraLimits||!e)return;if(t.activeCamera?.getClassName()==="ArcRotateCamera"){let s=t.activeCamera;if(e.elevationMinMax)s.lowerBetaLimit=Math.PI*0.5-e.elevationMinMax[1],s.upperBetaLimit=Math.PI*0.5-e.elevationMinMax[0];if(e.radiusMin)s.lowerRadiusLimit=e.radiusMin}}loadAssetContainerAsync(e,t,s){let i=new li(e);return this._assetContainer=i,this.importMeshAsync(null,e,t,s).then((r)=>{for(let n of r.meshes)i.meshes.push(n);return this._assetContainer=null,i}).catch((r)=>{throw this._assetContainer=null,r})}loadAsync(e,t,s){return this.importMeshAsync(null,e,t,s).then(()=>{})}static _ConvertPLYToSplat(e){let t=new Uint8Array(e),s=new TextDecoder().decode(t.slice(0,10240)),i=`end_header
`,r=s.indexOf(`end_header
`);if(r<0||!s)return new Promise((w)=>{w({mode:0,data:e,rawSplat:!0})});let n=parseInt(/element vertex (\d+)\n/.exec(s)[1]),o=/element face (\d+)\n/.exec(s),a=0;if(o)a=parseInt(o[1]);let l=/element chunk (\d+)\n/.exec(s),u=0;if(l)u=parseInt(l[1]);let c=0,p=0,f={double:8,int:4,uint:4,float:4,short:2,ushort:2,uchar:1,list:0},g={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},x=g.Chunk,b=[],M=[],h=s.slice(0,r).split(`
`),m={};for(let w of h)if(w.startsWith("property ")){let[,_,v]=w.split(" ");if(x==g.Chunk)M.push({name:v,type:_,offset:p}),p+=f[_];else if(x==g.Vertex)b.push({name:v,type:_,offset:c}),c+=f[_];else if(x==g.SH)b.push({name:v,type:_,offset:c});else if(x==g.Float_Tuple){let R=new DataView(e,p,f.float*2);m.safeOrbitCameraElevationMinMax=[R.getFloat32(0,!0),R.getFloat32(4,!0)]}else if(x==g.Float){let R=new DataView(e,p,f.float);m.safeOrbitCameraRadiusMin=R.getFloat32(0,!0)}else if(x==g.Uchar){let R=new DataView(e,p,f.uchar);if(v=="up_axis")m.upAxis=R.getUint8(0)==0?"X":R.getUint8(0)==1?"Y":"Z";else if(v=="chirality")m.chirality=R.getUint8(0)==0?"LeftHanded":"RightHanded"}if(!f[_])X.Warn(`Unsupported property type: ${_}.`)}else if(w.startsWith("element ")){let[,_]=w.split(" ");if(_=="chunk")x=g.Chunk;else if(_=="vertex")x=g.Vertex;else if(_=="sh")x=g.SH;else if(_=="safe_orbit_camera_elevation_min_max_radians")x=g.Float_Tuple;else if(_=="safe_orbit_camera_radius_min")x=g.Float;else if(_=="up_axis"||_=="chirality")x=g.Uchar}let d=c,y=p;return ge.ConvertPLYWithSHToSplatAsync(e).then(async(w)=>{let _=new DataView(e,r+11),v=y*u+d*n,R=[];if(a)for(let F=0;F<a;F++){let O=_.getUint8(v);if(O!=3)continue;v+=1;for(let B=0;B<O;B++){let G=_.getUint32(v+(2-B)*4,!0);R.push(G)}v+=12}if(u)return await new Promise((F)=>{F({mode:0,data:w.buffer,sh:w.sh,shDegree:w.shDegree,faces:R,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let L=0,k=0,C=["x","y","z","scale_0","scale_1","scale_2","opacity","rot_0","rot_1","rot_2","rot_3"],A=["red","green","blue","f_dc_0","f_dc_1","f_dc_2"];for(let F=0;F<b.length;F++){let O=b[F];if(C.includes(O.name))L++;if(A.includes(O.name))k++}let z=L==C.length&&k>=3,T=a?2:z?0:1;return await new Promise((F)=>{F({...m,mode:T,data:w.buffer,sh:w.sh,shDegree:w.shDegree,faces:R,hasVertexColors:!!k,compressed:!1,rawSplat:!1})})})}}J._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==="object"?"https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js":void 0};var ai=!1;function ui(){if(ai)return;ai=!0,ci(new J)}var hi=!1;function di(){if(hi)return;hi=!0,St.prototype.createDynamicTexture=function(e,t,s,i){let r=new fi(this,4);if(r.baseWidth=e,r.baseHeight=t,s)e=this.needPOTTextures?yt(e,this._caps.maxTextureSize):e,t=this.needPOTTextures?yt(t,this._caps.maxTextureSize):t;return r.width=e,r.height=t,r.isReady=!1,r.generateMipMaps=s,r.samplingMode=i,this.updateTextureSamplingMode(i,r),this._internalTexturesCache.push(r),r},St.prototype.updateDynamicTexture=function(e,t,s,i=!1,r,n=!1,o=!1){if(!e)return;let a=this._gl,l=a.TEXTURE_2D,u=this._bindTextureDirectly(l,e,!0,n);if(this._unpackFlipY(s===void 0?e.invertY:s),i)a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1);let c=this._getWebGLTextureType(e.type),p=this._getInternalFormat(r?r:e.format),f=this._getRGBABufferInternalSizedFormat(e.type,p);if(a.texImage2D(l,0,f,p,c,t),e.generateMipMaps)a.generateMipmap(l);if(!u)this._bindTextureDirectly(l,null);if(i)a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0);if(r)e.format=r;e._dynamicTextureSource=t,e._premulAlpha=i,e.invertY=s||!1,e.isReady=!0}}di();ui();
export{Es as a,P as b,je as c,Le as d,Os as e,pt as f,Gs as g,Ns as h,Xs as i,Hs as j,Zs as k,io as l,dt as m,js as n,lo as o,te as p,rt as q,Xi as r,is as s,rs as t,We as u,os as v,ns as w,er as x,as as y,di as z,ei as A,ft as B,De as C,Qs as D,gt as E,J as F,ui as G};

//# debugId=DA08941EB3AD751164756E2164756E21
//# sourceMappingURL=site-085z4b6f.js.map
