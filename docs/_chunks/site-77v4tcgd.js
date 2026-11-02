import{U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var o="MSFT_sRGBFactors";class vS{constructor(e){this.name=o,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return U.LoadExtraAsync(e,s,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(t),c=this._loader.loadMaterialPropertiesAsync(e,s,t),a=t.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function bS(){if(i)return;i=!0,Q(o),Z(o,!0,(e)=>new vS(e))}bS();
export{vS,bS};

//# debugId=EBA8E1B7889BFBD864756E2164756E21
//# sourceMappingURL=site-77v4tcgd.js.map
