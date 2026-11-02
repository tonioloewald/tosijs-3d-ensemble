import{oe,U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var t="EXT_texture_webp";class Dy{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,i)=>{let a=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,i.source);return await this._loader._createTextureAsync(e,a,l,(m)=>{o(m)},void 0,!r._textureInfo.nonColorData)})}}var s=!1;function Ly(){if(s)return;s=!0,Q(t),Z(t,!0,(e)=>new Dy(e))}Ly();
export{Dy,Ly};

//# debugId=3C433B359173367F64756E2164756E21
//# sourceMappingURL=site-j6016r5h.js.map
