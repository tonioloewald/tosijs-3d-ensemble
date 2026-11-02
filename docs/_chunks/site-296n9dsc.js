import{U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var t="MSFT_minecraftMesh";class _S{constructor(r){this.name=t,this._loader=r,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(r,s,e){return U.LoadExtraAsync(r,s,this.name,async(o,n)=>{if(n){if(!this._loader._pbrMaterialImpls.get("pbr"))throw Error(`${o}: Material type not supported`);let p=this._loader.loadMaterialPropertiesAsync(r,s,e);if(e.needAlphaBlending())e.forceDepthWrite=!0,e.separateCullingPass=!0;return e.backFaceCulling=e.forceDepthWrite,e.twoSidedLighting=!0,await p}})}}var i=!1;function xS(){if(i)return;i=!0,Q(t),Z(t,!0,(r)=>new _S(r))}xS();
export{_S,xS};

//# debugId=16B2E8AF52D54AC064756E2164756E21
//# sourceMappingURL=site-296n9dsc.js.map
