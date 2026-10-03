import{oe,U}from"./site-nskct8et.js";import{j,Y}from"./site-13bwkmkh.js";var t="KHR_texture_basisu";class TS{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,a)=>{let i=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,a.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{o(u)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var s=!1;function CS(){if(s)return;s=!0,Y(t),j(t,!0,(e)=>new TS(e))}CS();
export{TS,CS};

//# debugId=084DB4652B6D68CD64756E2164756E21
//# sourceMappingURL=site-qtyjpmx7.js.map
