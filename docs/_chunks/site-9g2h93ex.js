import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var i="KHR_materials_emissive_strength";class YC{constructor(e){this.name=i,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(i)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return z.LoadExtensionAsync(e,s,this.name,async(r,o)=>(await this._loader.loadMaterialPropertiesAsync(e,s,t),this._loadEmissiveProperties(r,o,t),await Promise.resolve()))}_loadEmissiveProperties(e,s,t){if(s.emissiveStrength!==void 0){let r=this._loader._getOrCreateMaterialAdapter(t);r.emissionLuminance=s.emissiveStrength}}}var n=!1;function hS(){if(n)return;n=!0,W(i),X(i,!0,(e)=>new YC(e))}
export{YC,hS};

//# debugId=317F95C4182044D164756E2164756E21
//# sourceMappingURL=site-9g2h93ex.js.map
