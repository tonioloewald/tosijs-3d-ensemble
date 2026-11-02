import{U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var r="KHR_materials_emissive_strength";class jS{constructor(e){this.name=r,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(r)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,t,s){return U.LoadExtensionAsync(e,t,this.name,async(i,n)=>(await this._loader.loadMaterialPropertiesAsync(e,t,s),this._loadEmissiveProperties(i,n,s),await Promise.resolve()))}_loadEmissiveProperties(e,t,s){if(t.emissiveStrength!==void 0){let i=this._loader._getOrCreateMaterialAdapter(s);i.emissionLuminance=t.emissiveStrength}}}var o=!1;function QS(){if(o)return;o=!0,Q(r),Z(r,!0,(e)=>new jS(e))}QS();
export{jS,QS};

//# debugId=838E617E39AB399B64756E2164756E21
//# sourceMappingURL=site-kzm5kq36.js.map
