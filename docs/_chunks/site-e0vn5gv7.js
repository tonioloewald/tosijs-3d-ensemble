import{oe,U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";var t="KHR_texture_basisu";class g0{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,a)=>{let i=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,a.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{o(u)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var s=!1;function x0(){if(s)return;s=!0,Y(t),j(t,!0,(e)=>new g0(e))}x0();
export{g0,x0};

//# debugId=A9128FCE4B35D58264756E2164756E21
//# sourceMappingURL=site-e0vn5gv7.js.map
