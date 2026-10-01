import{U}from"./site-0asxfjsk.js";import{j,Y}from"./site-13bwkmkh.js";var t="MSFT_minecraftMesh";class q0{constructor(r){this.name=t,this._loader=r,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(r,s,e){return U.LoadExtraAsync(r,s,this.name,async(o,n)=>{if(n){if(!this._loader._pbrMaterialImpls.get("pbr"))throw Error(`${o}: Material type not supported`);let p=this._loader.loadMaterialPropertiesAsync(r,s,e);if(e.needAlphaBlending())e.forceDepthWrite=!0,e.separateCullingPass=!0;return e.backFaceCulling=e.forceDepthWrite,e.twoSidedLighting=!0,await p}})}}var i=!1;function Z0(){if(i)return;i=!0,Y(t),j(t,!0,(r)=>new q0(r))}Z0();
export{q0,Z0};

//# debugId=D824A7CA13E7B2E064756E2164756E21
//# sourceMappingURL=site-pwk5d9r7.js.map
