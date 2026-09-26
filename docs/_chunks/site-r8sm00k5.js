import{oe,U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";var t="EXT_texture_avif";class oy{constructor(e){this.name=t,this._loader=e,this.enabled=e.isExtensionUsed(t)}dispose(){this._loader=null}_loadTextureAsync(e,r,o){return U.LoadExtensionAsync(e,r,this.name,async(i,n)=>{let a=r.sampler==null?U.DefaultSampler:oe.Get(`${e}/sampler`,this._loader.gltf.samplers,r.sampler),l=oe.Get(`${i}/source`,this._loader.gltf.images,n.source);return await this._loader._createTextureAsync(e,a,l,(m)=>{o(m)},void 0,!r._textureInfo.nonColorData)})}}var s=!1;function ay(){if(s)return;s=!0,Y(t),j(t,!0,(e)=>new oy(e))}ay();
export{oy,ay};

//# debugId=7496073F15E1437D64756E2164756E21
//# sourceMappingURL=site-r8sm00k5.js.map
