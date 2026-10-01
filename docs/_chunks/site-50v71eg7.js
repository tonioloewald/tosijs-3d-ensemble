import{U}from"./site-0asxfjsk.js";import{j,Y}from"./site-13bwkmkh.js";var r="KHR_materials_emissive_strength";class RS{constructor(e){this.name=r,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(r)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,t,s){return U.LoadExtensionAsync(e,t,this.name,async(i,n)=>(await this._loader.loadMaterialPropertiesAsync(e,t,s),this._loadEmissiveProperties(i,n,s),await Promise.resolve()))}_loadEmissiveProperties(e,t,s){if(t.emissiveStrength!==void 0){let i=this._loader._getOrCreateMaterialAdapter(s);i.emissionLuminance=t.emissiveStrength}}}var o=!1;function wS(){if(o)return;o=!0,Y(r),j(r,!0,(e)=>new RS(e))}wS();
export{RS,wS};

//# debugId=65DB002731256A4B64756E2164756E21
//# sourceMappingURL=site-50v71eg7.js.map
