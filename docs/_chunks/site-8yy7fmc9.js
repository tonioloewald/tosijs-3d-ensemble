import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var t="MSFT_minecraftMesh";class SC{constructor(r){this.name=t,this._loader=r,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(r,s,e){return z.LoadExtraAsync(r,s,this.name,async(n,o)=>{if(o){if(!this._loader._pbrMaterialImpls.get("pbr"))throw Error(`${n}: Material type not supported`);let p=this._loader.loadMaterialPropertiesAsync(r,s,e);if(e.needAlphaBlending())e.forceDepthWrite=!0,e.separateCullingPass=!0;return e.backFaceCulling=e.forceDepthWrite,e.twoSidedLighting=!0,await p}})}}var i=!1;function Pb(){if(i)return;i=!0,W(t),X(t,!0,(r)=>new SC(r))}
export{SC,Pb};

//# debugId=6A4F534FFEB38D1264756E2164756E21
//# sourceMappingURL=site-8yy7fmc9.js.map
