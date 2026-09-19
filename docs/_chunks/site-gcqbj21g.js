import{Ac as c}from"./site-esgjeeef.js";import{cd as l,dd as p}from"./site-w8s4f5be.js";var o="KHR_materials_ior";class s{constructor(e){this.name=o,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,t){return c.LoadExtensionAsync(e,r,this.name,async(i,n)=>{let a=[];return a.push(this._loader.loadMaterialPropertiesAsync(e,r,t)),a.push(this._loadIorPropertiesAsync(i,n,t)),await Promise.all(a).then(()=>{})})}_loadIorPropertiesAsync(e,r,t){let i=this._loader._getOrCreateMaterialAdapter(t),n=r.ior!==void 0?r.ior:s._DEFAULT_IOR;return i.specularIor=n,Promise.resolve()}}s._DEFAULT_IOR=1.5;var d=!1;function _(){if(d)return;d=!0,p(o),l(o,!0,(e)=>new s(e))}_();
export{s as $a,_ as ab};

//# debugId=B5E06C59F2FAE4BC64756E2164756E21
//# sourceMappingURL=site-gcqbj21g.js.map
