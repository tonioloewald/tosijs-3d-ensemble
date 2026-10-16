import{U}from"./site-ymz1rng2.js";import{q,Q}from"./site-xktd8pm8.js";var t="MSFT_minecraftMesh";class iS{constructor(r){this.name=t,this._loader=r,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(r,s,e){return U.LoadExtraAsync(r,s,this.name,async(o,n)=>{if(n){if(!this._loader._pbrMaterialImpls.get("pbr"))throw Error(`${o}: Material type not supported`);let p=this._loader.loadMaterialPropertiesAsync(r,s,e);if(e.needAlphaBlending())e.forceDepthWrite=!0,e.separateCullingPass=!0;return e.backFaceCulling=e.forceDepthWrite,e.twoSidedLighting=!0,await p}})}}var i=!1;function rS(){if(i)return;i=!0,Q(t),q(t,!0,(r)=>new iS(r))}rS();
export{iS,rS};

//# debugId=B815B160074F5CE764756E2164756E21
//# sourceMappingURL=site-ex5r7894.js.map
