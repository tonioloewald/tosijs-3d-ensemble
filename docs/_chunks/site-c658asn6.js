import{U}from"./site-114p2m2q.js";import{Q,Y}from"./site-74rc84n6.js";var o="KHR_materials_dispersion";class MS{constructor(e){this.name=o,this.order=174,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,s,i){return U.LoadExtensionAsync(e,s,this.name,async(t,r)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,s,i)),n.push(this._loadDispersionPropertiesAsync(t,s,i,r)),await Promise.all(n).then(()=>{})})}_loadDispersionPropertiesAsync(e,s,i,t){let r=this._loader._getOrCreateMaterialAdapter(i);if(r.transmissionWeight==0||!t.dispersion)return Promise.resolve();return r.transmissionDispersionAbbeNumber=20,r.transmissionDispersionScale=t.dispersion,Promise.resolve()}}var a=!1;function PS(){if(a)return;a=!0,Y(o),Q(o,!0,(e)=>new MS(e))}PS();
export{MS,PS};

//# debugId=72EF242312FDB88764756E2164756E21
//# sourceMappingURL=site-c658asn6.js.map
