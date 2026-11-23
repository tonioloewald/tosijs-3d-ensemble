import{z}from"./site-pjwjhf0g.js";import{X,W}from"./site-ejgpgj5p.js";var i="KHR_materials_emissive_strength";class Y1{constructor(e){this.name=i,this.order=170,this._loader=e,this.enabled=this._loader.isExtensionUsed(i)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return z.LoadExtensionAsync(e,s,this.name,async(r,o)=>(await this._loader.loadMaterialPropertiesAsync(e,s,t),this._loadEmissiveProperties(r,o,t),await Promise.resolve()))}_loadEmissiveProperties(e,s,t){if(s.emissiveStrength!==void 0){let r=this._loader._getOrCreateMaterialAdapter(t);r.emissionLuminance=s.emissiveStrength}}}var n=!1;function uS(){if(n)return;n=!0,W(i),X(i,!0,(e)=>new Y1(e))}
export{Y1,uS};

//# debugId=6F57B4FEA6D9107564756E2164756E21
//# sourceMappingURL=site-sqrmfrxy.js.map
