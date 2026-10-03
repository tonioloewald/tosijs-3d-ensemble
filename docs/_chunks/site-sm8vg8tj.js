import{U}from"./site-nskct8et.js";import{j,Y}from"./site-13bwkmkh.js";var r="KHR_materials_emissive_strength";class DS{constructor(e){this.name=r,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(r)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,t,s){return U.LoadExtensionAsync(e,t,this.name,async(i,n)=>(await this._loader.loadMaterialPropertiesAsync(e,t,s),this._loadEmissiveProperties(i,n,s),await Promise.resolve()))}_loadEmissiveProperties(e,t,s){if(t.emissiveStrength!==void 0){let i=this._loader._getOrCreateMaterialAdapter(s);i.emissionLuminance=t.emissiveStrength}}}var o=!1;function LS(){if(o)return;o=!0,Y(r),j(r,!0,(e)=>new DS(e))}LS();
export{DS,LS};

//# debugId=61415E189CA8949C64756E2164756E21
//# sourceMappingURL=site-sm8vg8tj.js.map
