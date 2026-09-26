import{U}from"./site-qtfy1560.js";import{j,Y}from"./site-52743f9s.js";var o="MSFT_sRGBFactors";class KS{constructor(e){this.name=o,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return U.LoadExtraAsync(e,s,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(t),c=this._loader.loadMaterialPropertiesAsync(e,s,t),a=t.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function JS(){if(i)return;i=!0,Y(o),j(o,!0,(e)=>new KS(e))}JS();
export{KS,JS};

//# debugId=2A10907AF65E7CE064756E2164756E21
//# sourceMappingURL=site-3f08s7ya.js.map
