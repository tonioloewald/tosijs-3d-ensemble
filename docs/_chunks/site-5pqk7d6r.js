import{U}from"./site-114p2m2q.js";import{Q,Y}from"./site-74rc84n6.js";var o="MSFT_sRGBFactors";class sS{constructor(e){this.name=o,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return U.LoadExtraAsync(e,s,this.name,async(l,n)=>{if(n){let r=this._loader._getOrCreateMaterialAdapter(t),c=this._loader.loadMaterialPropertiesAsync(e,s,t),a=t.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await c}})}}var i=!1;function nS(){if(i)return;i=!0,Y(o),Q(o,!0,(e)=>new sS(e))}nS();
export{sS,nS};

//# debugId=122FB7CFC0C4969D64756E2164756E21
//# sourceMappingURL=site-5pqk7d6r.js.map
