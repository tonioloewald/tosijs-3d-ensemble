import{Ac as l}from"./site-esgjeeef.js";import{cd as n,dd as c}from"./site-w8s4f5be.js";var o="MSFT_sRGBFactors";class p{constructor(e){this.name=o,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,t){return l.LoadExtraAsync(e,s,this.name,async(f,d)=>{if(d){let r=this._loader._getOrCreateMaterialAdapter(t),x=this._loader.loadMaterialPropertiesAsync(e,s,t),a=t.getScene().getEngine().useExactSrgbConversions;if(!r.baseColorTexture)r.baseColor.toLinearSpaceToRef(r.baseColor,a);if(!r.specularColorTexture)r.specularColor.toLinearSpaceToRef(r.specularColor,a);return await x}})}}var i=!1;function u(){if(i)return;i=!0,c(o),n(o,!0,(e)=>new p(e))}u();
export{p as ua,u as va};

//# debugId=CADDB5359EFDC27764756E2164756E21
//# sourceMappingURL=site-263sj4sa.js.map
