import{oe,U}from"./site-nskct8et.js";import{j,Y}from"./site-13bwkmkh.js";var t="EXT_texture_avif";class gy{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(i,n)=>{let a=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${i}/source`,this._loader.gltf.images,n.source);return await this._loader._createTextureAsync(e,a,l,(m)=>{o(m)},void 0,!r._textureInfo.nonColorData)})}}var s=!1;function _y(){if(s)return;s=!0,Y(t),j(t,!0,(e)=>new gy(e))}_y();
export{gy,_y};

//# debugId=BDBD690846740E1B64756E2164756E21
//# sourceMappingURL=site-va0p4ynr.js.map
