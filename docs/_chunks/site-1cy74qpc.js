import{U}from"./site-114p2m2q.js";import{Q,Y}from"./site-74rc84n6.js";var o="KHR_materials_ior";class Yf{constructor(e){this.name=o,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(o)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,t){return U.LoadExtensionAsync(e,r,this.name,async(s,i)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,t)),n.push(this._loadIorPropertiesAsync(s,i,t)),await Promise.all(n).then(()=>{})})}_loadIorPropertiesAsync(e,r,t){let s=this._loader._getOrCreateMaterialAdapter(t),i=r.ior!==void 0?r.ior:Yf._DEFAULT_IOR;return s.specularIor=i,Promise.resolve()}}Yf._DEFAULT_IOR=1.5;var a=!1;function NS(){if(a)return;a=!0,Y(o),Q(o,!0,(e)=>new Yf(e))}NS();
export{Yf,NS};

//# debugId=EF24FAABF639AE8364756E2164756E21
//# sourceMappingURL=site-1cy74qpc.js.map
