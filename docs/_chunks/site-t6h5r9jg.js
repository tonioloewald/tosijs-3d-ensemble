import{U}from"./site-0asxfjsk.js";import{j,Y}from"./site-13bwkmkh.js";var o="KHR_materials_ior";class $f{constructor(e){this.name=o,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,t){return U.LoadExtensionAsync(e,r,this.name,async(s,i)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,t)),n.push(this._loadIorPropertiesAsync(s,i,t)),await Promise.all(n).then(()=>{})})}_loadIorPropertiesAsync(e,r,t){let s=this._loader._getOrCreateMaterialAdapter(t),i=r.ior!==void 0?r.ior:$f._DEFAULT_IOR;return s.specularIor=i,Promise.resolve()}}$f._DEFAULT_IOR=1.5;var a=!1;function IS(){if(a)return;a=!0,Y(o),j(o,!0,(e)=>new $f(e))}IS();
export{$f,IS};

//# debugId=EC7CDF7503ADF9A364756E2164756E21
//# sourceMappingURL=site-t6h5r9jg.js.map
