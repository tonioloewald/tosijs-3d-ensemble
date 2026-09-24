import{Ac as o,yc as s}from"./site-8thwj7wd.js";import{cd as a,dd as i}from"./site-2hdvehdd.js";var t="KHR_texture_basisu";class l{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,m){return o.LoadExtensionAsync(e,r,this.name,async(f,_)=>{let d=r.sampler==null?o.DefaultSampler:s.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),p=s.Get(`${f}/source`,this._loader.gltf.images,_.source);return await this._loader._createTextureAsync(e,d,p,(c)=>{m(c)},r._textureInfo.nonColorData?{useRGBAIfASTCBC7NotAvailableWhenUASTC:!0}:void 0,!r._textureInfo.nonColorData)})}}var n=!1;function u(){if(n)return;n=!0,i(t),a(t,!0,(e)=>new l(e))}u();
export{l as Oa,u as Pa};

//# debugId=14BB0A2E52B1F7C564756E2164756E21
//# sourceMappingURL=site-vgk7tv5b.js.map
