import{oe,U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";var t="EXT_texture_webp";class ly{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(n,i)=>{let a=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${n}/source`,this._loader.gltf.images,i.source);return await this._loader._createTextureAsync(e,a,l,(m)=>{o(m)},void 0,!r._textureInfo.nonColorData)})}}var s=!1;function cy(){if(s)return;s=!0,Y(t),j(t,!0,(e)=>new ly(e))}cy();
export{ly,cy};

//# debugId=601CD2ED5F84A75F64756E2164756E21
//# sourceMappingURL=site-qn827cmp.js.map
