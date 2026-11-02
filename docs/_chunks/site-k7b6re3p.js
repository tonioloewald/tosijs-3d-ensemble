import{oe,U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var t="KHR_texture_basisu";class FS{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,a)=>{let i=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,a.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{o(u)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var s=!1;function VS(){if(s)return;s=!0,Q(t),Z(t,!0,(e)=>new FS(e))}VS();
export{FS,VS};

//# debugId=D6504A158C2778DB64756E2164756E21
//# sourceMappingURL=site-k7b6re3p.js.map
