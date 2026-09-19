import{Ac as m}from"./site-esgjeeef.js";import{cd as n,dd as a}from"./site-w8s4f5be.js";var r="KHR_materials_emissive_strength";class d{constructor(e){this.name=r,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(r)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,t,s){return m.LoadExtensionAsync(e,t,this.name,async(i,_)=>(await this._loader.loadMaterialPropertiesAsync(e,t,s),this._loadEmissiveProperties(i,_,s),await Promise.resolve()))}_loadEmissiveProperties(e,t,s){if(t.emissiveStrength!==void 0){let i=this._loader._getOrCreateMaterialAdapter(s);i.emissionLuminance=t.emissiveStrength}}}var o=!1;function l(){if(o)return;o=!0,a(r),n(r,!0,(e)=>new d(e))}l();
export{d as Za,l as _a};

//# debugId=F1E249E69AAEDC8264756E2164756E21
//# sourceMappingURL=site-jgjf1g9z.js.map
