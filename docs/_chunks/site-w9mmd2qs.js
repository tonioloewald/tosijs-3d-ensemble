import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var t="MSFT_sRGBFactors";class yC{constructor(e){this.name=t,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,o,s){return z.LoadExtraAsync(e,o,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(s),c=this._loader.loadMaterialPropertiesAsync(e,o,s),a=s.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function Db(){if(i)return;i=!0,W(t),X(t,!0,(e)=>new yC(e))}
export{yC,Db};

//# debugId=C279240EEB85D1DD64756E2164756E21
//# sourceMappingURL=site-w9mmd2qs.js.map
