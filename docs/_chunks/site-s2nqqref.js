import{oe,U}from"./site-114p2m2q.js";import{Q,Y}from"./site-74rc84n6.js";var t="KHR_texture_basisu";class TS{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,a)=>{let i=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,a.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{o(u)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var s=!1;function CS(){if(s)return;s=!0,Y(t),Q(t,!0,(e)=>new TS(e))}CS();
export{TS,CS};

//# debugId=D3062B8260E53A4764756E2164756E21
//# sourceMappingURL=site-s2nqqref.js.map
