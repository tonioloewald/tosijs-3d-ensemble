import{U}from"./site-0asxfjsk.js";import{j,Y}from"./site-13bwkmkh.js";var o="MSFT_sRGBFactors";class K0{constructor(e){this.name=o,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return U.LoadExtraAsync(e,s,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(t),c=this._loader.loadMaterialPropertiesAsync(e,s,t),a=t.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function J0(){if(i)return;i=!0,Y(o),j(o,!0,(e)=>new K0(e))}J0();
export{K0,J0};

//# debugId=426FDF7074C9DC9F64756E2164756E21
//# sourceMappingURL=site-e4rw1tdw.js.map
