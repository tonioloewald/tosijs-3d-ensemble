import{U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";var r="KHR_materials_emissive_strength";class A0{constructor(e){this.name=r,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(r)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,t,s){return U.LoadExtensionAsync(e,t,this.name,async(i,n)=>(await this._loader.loadMaterialPropertiesAsync(e,t,s),this._loadEmissiveProperties(i,n,s),await Promise.resolve()))}_loadEmissiveProperties(e,t,s){if(t.emissiveStrength!==void 0){let i=this._loader._getOrCreateMaterialAdapter(s);i.emissionLuminance=t.emissiveStrength}}}var o=!1;function I0(){if(o)return;o=!0,Y(r),j(r,!0,(e)=>new A0(e))}I0();
export{A0,I0};

//# debugId=7E7C9219511BCD7F64756E2164756E21
//# sourceMappingURL=site-8w0k3tc3.js.map
