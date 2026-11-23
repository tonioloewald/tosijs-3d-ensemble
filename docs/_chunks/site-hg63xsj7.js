import{z}from"./site-pjwjhf0g.js";import{X,W}from"./site-ejgpgj5p.js";import{m}from"./site-3rzc7ytb.js";var e="KHR_texture_transform";class M1{constructor(s){this.name=e,this._loader=s,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}loadTextureInfoAsync(s,o,i){return z.LoadExtensionAsync(s,o,this.name,async(a,t)=>await this._loader.loadTextureInfoAsync(s,o,(r)=>{if(!(r instanceof m))throw Error(`${a}: Texture type not supported`);if(t.offset)r.uOffset=t.offset[0],r.vOffset=t.offset[1];if(r.uRotationCenter=0,r.vRotationCenter=0,t.rotation)r.wAng=-t.rotation;if(t.scale)r.uScale=t.scale[0],r.vScale=t.scale[1];if(t.texCoord!=null)r.coordinatesIndex=t.texCoord;i(r)}))}}var f=!1;function Ub(){if(f)return;f=!0,W(e),X(e,!0,(s)=>new M1(s))}
export{M1,Ub};

//# debugId=5896E0D609DD7A0064756E2164756E21
//# sourceMappingURL=site-hg63xsj7.js.map
