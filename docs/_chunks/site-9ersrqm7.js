import{U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var o="KHR_materials_ior";class Zf{constructor(e){this.name=o,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,t){return U.LoadExtensionAsync(e,r,this.name,async(s,i)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,t)),n.push(this._loadIorPropertiesAsync(s,i,t)),await Promise.all(n).then(()=>{})})}_loadIorPropertiesAsync(e,r,t){let s=this._loader._getOrCreateMaterialAdapter(t),i=r.ior!==void 0?r.ior:Zf._DEFAULT_IOR;return s.specularIor=i,Promise.resolve()}}Zf._DEFAULT_IOR=1.5;var a=!1;function qS(){if(a)return;a=!0,Q(o),Z(o,!0,(e)=>new Zf(e))}qS();
export{Zf,qS};

//# debugId=AF0D90C217BE8EB264756E2164756E21
//# sourceMappingURL=site-9ersrqm7.js.map
