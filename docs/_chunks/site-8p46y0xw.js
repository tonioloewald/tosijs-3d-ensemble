import{ne,z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var s="EXT_texture_avif";class gE{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}dispose(){this._loader=null}_loadTextureAsync(e,r,n){return z.LoadExtensionAsync(e,r,this.name,async(a,i)=>{let o=r.sampler==null?z.DefaultSampler:ne.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=ne.Get(`${a}/source`,this._loader.gltf.images,i.source);return await this._loader._createTextureAsync(e,o,l,(d)=>{n(d)},void 0,!r._textureInfo.nonColorData,r)})}}var t=!1;function $S(){if(t)return;t=!0,W(s),X(s,!0,(e)=>new gE(e))}
export{gE,$S};

//# debugId=B2D5F3E91FFCF81C64756E2164756E21
//# sourceMappingURL=site-8p46y0xw.js.map
