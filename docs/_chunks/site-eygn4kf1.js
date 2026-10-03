import{U}from"./site-nskct8et.js";import{j,Y}from"./site-13bwkmkh.js";import{g}from"./site-51k6gm7f.js";var e="KHR_texture_transform";class ES{constructor(o){this.name=e,this._loader=o,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(o,s,i){return U.LoadExtensionAsync(o,s,this.name,async(a,r)=>await this._loader.loadTextureInfoAsync(o,s,(t)=>{if(!(t instanceof g))throw Error(`${a}: Texture type not supported`);if(r.offset)t.uOffset=r.offset[0],t.vOffset=r.offset[1];if(t.uRotationCenter=0,t.vRotationCenter=0,r.rotation)t.wAng=-r.rotation;if(r.scale)t.uScale=r.scale[0],t.vScale=r.scale[1];if(r.texCoord!=null)t.coordinatesIndex=r.texCoord;i(t)}))}}var f=!1;function AS(){if(f)return;f=!0,Y(e),j(e,!0,(o)=>new ES(o))}AS();
export{ES,AS};

//# debugId=079053412AD2DE5564756E2164756E21
//# sourceMappingURL=site-eygn4kf1.js.map
