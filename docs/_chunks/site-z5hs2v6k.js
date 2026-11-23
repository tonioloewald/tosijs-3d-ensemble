import{ne,z}from"./site-pjwjhf0g.js";import{X,W}from"./site-ejgpgj5p.js";var r="KHR_texture_basisu";class P1{constructor(e){this.name=r,this._loader=e,this.enabled=e.isExtensionUsed(r)}dispose(){this._loader=null}_loadTextureAsync(e,s,n){return z.LoadExtensionAsync(e,s,this.name,async(a,o)=>{let i=s.sampler==null?z.DefaultSampler:ne.Get(`${e}/sampler`,this._loader.gltf.samplers,s.sampler),l=ne.Get(`${a}/source`,this._loader.gltf.images,o.source);return await this._loader._createTextureAsync(e,i,l,(u)=>{n(u)},s._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!s._textureInfo.nonColorData,s)})}}var t=!1;function Gb(){if(t)return;t=!0,W(r),X(r,!0,(e)=>new P1(e))}
export{P1,Gb};

//# debugId=6955D95A0EDCA6E364756E2164756E21
//# sourceMappingURL=site-z5hs2v6k.js.map
