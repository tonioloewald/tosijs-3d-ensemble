import{oe,U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var t="EXT_texture_avif";class Oy{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(i,n)=>{let a=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${i}/source`,this._loader.gltf.images,n.source);return await this._loader._createTextureAsync(e,a,l,(m)=>{o(m)},void 0,!r._textureInfo.nonColorData)})}}var s=!1;function Py(){if(s)return;s=!0,Q(t),Z(t,!0,(e)=>new Oy(e))}Py();
export{Oy,Py};

//# debugId=BD08C97F5BA3A36464756E2164756E21
//# sourceMappingURL=site-2a6ztk36.js.map
