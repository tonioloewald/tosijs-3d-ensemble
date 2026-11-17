import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var o="KHR_materials_dispersion";class $C{constructor(e){this.name=o,this.order=174,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,i){return z.LoadExtensionAsync(e,r,this.name,async(t,s)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,i)),n.push(this._loadDispersionPropertiesAsync(t,r,i,s)),await Promise.all(n).then(()=>{})})}_loadDispersionPropertiesAsync(e,r,i,t){let s=this._loader._getOrCreateMaterialAdapter(i);if(s.transmissionWeight==0||!t.dispersion)return Promise.resolve();return s.transmissionDispersionAbbeNumber=20,s.transmissionDispersionScale=t.dispersion,Promise.resolve()}}var a=!1;function cS(){if(a)return;a=!0,W(o),X(o,!0,(e)=>new $C(e))}
export{$C,cS};

//# debugId=9613B7D7DC33657364756E2164756E21
//# sourceMappingURL=site-f46z2pg0.js.map
