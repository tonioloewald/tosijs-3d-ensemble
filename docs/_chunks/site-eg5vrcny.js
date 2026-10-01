import{U}from"./site-0asxfjsk.js";import{j,Y}from"./site-13bwkmkh.js";import{g}from"./site-nj3q12mn.js";var e="KHR_texture_transform";class vS{constructor(o){this.name=e,this._loader=o,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(o,s,i){return U.LoadExtensionAsync(o,s,this.name,async(a,r)=>await this._loader.loadTextureInfoAsync(o,s,(t)=>{if(!(t instanceof g))throw Error(`${a}: Texture type not supported`);if(r.offset)t.uOffset=r.offset[0],t.vOffset=r.offset[1];if(t.uRotationCenter=0,t.vRotationCenter=0,r.rotation)t.wAng=-r.rotation;if(r.scale)t.uScale=r.scale[0],t.vScale=r.scale[1];if(r.texCoord!=null)t.coordinatesIndex=r.texCoord;i(t)}))}}var f=!1;function bS(){if(f)return;f=!0,Y(e),j(e,!0,(o)=>new vS(o))}bS();
export{vS,bS};

//# debugId=A84C325E6F6A033364756E2164756E21
//# sourceMappingURL=site-eg5vrcny.js.map
