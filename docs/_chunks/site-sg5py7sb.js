import{oe,U}from"./site-6kg77gna.js";import{q,Q}from"./site-gdmtwd3c.js";var t="KHR_texture_basisu";class TS{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,a)=>{let i=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,a.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{o(u)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var s=!1;function CS(){if(s)return;s=!0,Q(t),q(t,!0,(e)=>new TS(e))}CS();
export{TS,CS};

//# debugId=91953F50D24AF87964756E2164756E21
//# sourceMappingURL=site-sg5py7sb.js.map
