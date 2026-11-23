import{z}from"./site-pjwjhf0g.js";import{X,W}from"./site-ejgpgj5p.js";var t="MSFT_sRGBFactors";class y1{constructor(e){this.name=t,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,o,s){return z.LoadExtraAsync(e,o,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(s),c=this._loader.loadMaterialPropertiesAsync(e,o,s),a=s.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function Db(){if(i)return;i=!0,W(t),X(t,!0,(e)=>new y1(e))}
export{y1,Db};

//# debugId=E413124B6F83FFA364756E2164756E21
//# sourceMappingURL=site-2b9eshtq.js.map
