import{U}from"./site-3c7npywe.js";import{Z,Q}from"./site-vkghnj1s.js";var o="KHR_materials_dispersion";class $S{constructor(e){this.name=o,this.order=174,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,i){return U.LoadExtensionAsync(e,s,this.name,async(t,r)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,s,i)),n.push(this._loadDispersionPropertiesAsync(t,s,i,r)),await Promise.all(n).then(()=>{})})}_loadDispersionPropertiesAsync(e,s,i,t){let r=this._loader._getOrCreateMaterialAdapter(i);if(r.transmissionWeight==0||!t.dispersion)return Promise.resolve();return r.transmissionDispersionAbbeNumber=20,r.transmissionDispersionScale=t.dispersion,Promise.resolve()}}var a=!1;function YS(){if(a)return;a=!0,Q(o),Z(o,!0,(e)=>new $S(e))}YS();
export{$S,YS};

//# debugId=440ACEF902494FE864756E2164756E21
//# sourceMappingURL=site-nmqep0qf.js.map
