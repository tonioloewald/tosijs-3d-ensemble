import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";import{m}from"./site-s3146e1w.js";var e="KHR_texture_transform";class OC{constructor(s){this.name=e,this._loader=s,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(s,o,i){return z.LoadExtensionAsync(s,o,this.name,async(a,t)=>await this._loader.loadTextureInfoAsync(s,o,(r)=>{if(!(r instanceof m))throw Error(`${a}: Texture type not supported`);if(t.offset)r.uOffset=t.offset[0],r.vOffset=t.offset[1];if(r.uRotationCenter=0,r.vRotationCenter=0,t.rotation)r.wAng=-t.rotation;if(t.scale)r.uScale=t.scale[0],r.vScale=t.scale[1];if(t.texCoord!=null)r.coordinatesIndex=t.texCoord;i(r)}))}}var f=!1;function Ub(){if(f)return;f=!0,W(e),X(e,!0,(s)=>new OC(s))}
export{OC,Ub};

//# debugId=AABAF16500FD9B8964756E2164756E21
//# sourceMappingURL=site-kdf1fk24.js.map
