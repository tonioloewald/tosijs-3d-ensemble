import{U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";import{_}from"./site-tfszv73y.js";var e="KHR_texture_transform";class v0{constructor(o){this.name=e,this._loader=o,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(o,s,i){return U.LoadExtensionAsync(o,s,this.name,async(a,r)=>await this._loader.loadTextureInfoAsync(o,s,(t)=>{if(!(t instanceof _))throw Error(`${a}: Texture type not supported`);if(r.offset)t.uOffset=r.offset[0],t.vOffset=r.offset[1];if(t.uRotationCenter=0,t.vRotationCenter=0,r.rotation)t.wAng=-r.rotation;if(r.scale)t.uScale=r.scale[0],t.vScale=r.scale[1];if(r.texCoord!=null)t.coordinatesIndex=r.texCoord;i(t)}))}}var f=!1;function b0(){if(f)return;f=!0,Y(e),j(e,!0,(o)=>new v0(o))}b0();
export{v0,b0};

//# debugId=6409A2C9A081E5F064756E2164756E21
//# sourceMappingURL=site-380d66v4.js.map
