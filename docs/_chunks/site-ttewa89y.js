import{ne,z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var s="EXT_texture_webp";class jC{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}dispose(){this._loader=null}_loadTextureAsync(e,r,n){return z.LoadExtensionAsync(e,r,this.name,async(a,o)=>{let i=r.sampler==null?z.DefaultSampler:ne.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=ne.Get(`${a}/source`,this._loader.gltf.images,o.source);return await this._loader._createTextureAsync(e,i,l,(d)=>{n(d)},void 0,!r._textureInfo.nonColorData,r)})}}var t=!1;function uS(){if(t)return;t=!0,W(s),X(s,!0,(e)=>new jC(e))}
export{jC,uS};

//# debugId=B9DFDB43821944AF64756E2164756E21
//# sourceMappingURL=site-ttewa89y.js.map
