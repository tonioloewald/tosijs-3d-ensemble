import{ne,z}from"./site-pjwjhf0g.js";import{X,W}from"./site-ejgpgj5p.js";var s="EXT_texture_avif";class _E{constructor(e){this.name=s,this._loader=e,this.enabled=e.isExtensionUsed(s)}dispose(){this._loader=null}_loadTextureAsync(e,r,n){return z.LoadExtensionAsync(e,r,this.name,async(a,i)=>{let o=r.sampler==null?z.DefaultSampler:ne.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=ne.Get(`${a}/source`,this._loader.gltf.images,i.source);return await this._loader._createTextureAsync(e,o,l,(d)=>{n(d)},void 0,!r._textureInfo.nonColorData,r)})}}var t=!1;function $S(){if(t)return;t=!0,W(s),X(s,!0,(e)=>new _E(e))}
export{_E,$S};

//# debugId=627777F5A9FBBCEE64756E2164756E21
//# sourceMappingURL=site-y81sa2we.js.map
