import{Ac as n}from"./site-esgjeeef.js";import{cd as a,dd as d}from"./site-w8s4f5be.js";import{lx as i}from"./site-1g28dxhq.js";var e="KHR_texture_transform";class c{constructor(o){this.name=e,this._loader=o,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(o,s,p){return n.LoadExtensionAsync(o,s,this.name,async(u,r)=>await this._loader.loadTextureInfoAsync(o,s,(t)=>{if(!(t instanceof i))throw Error(`${u}: Texture type not supported`);if(r.offset)t.uOffset=r.offset[0],t.vOffset=r.offset[1];if(t.uRotationCenter=0,t.vRotationCenter=0,r.rotation)t.wAng=-r.rotation;if(r.scale)t.uScale=r.scale[0],t.vScale=r.scale[1];if(r.texCoord!=null)t.coordinatesIndex=r.texCoord;p(t)}))}}var f=!1;function m(){if(f)return;f=!0,d(e),a(e,!0,(o)=>new c(o))}m();
export{c as _,m as $};

//# debugId=8096E122AF063A6364756E2164756E21
//# sourceMappingURL=site-x2mzt827.js.map
