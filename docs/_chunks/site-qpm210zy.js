import{z}from"./site-gstx9y5a.js";import{X,W}from"./site-ejgpgj5p.js";var t="KHR_materials_ior";class Dp{constructor(e){this.name=t,this.order=180,this._loader=e,this.enabled=this._loader.isExtensionUsed(t)}dispose(){this._loader=null}loadMaterialPropertiesAsync(e,r,s){return z.LoadExtensionAsync(e,r,this.name,async(o,i)=>{let n=[];return n.push(this._loader.loadMaterialPropertiesAsync(e,r,s)),n.push(this._loadIorPropertiesAsync(o,i,s)),await Promise.all(n).then(()=>{})})}_loadIorPropertiesAsync(e,r,s){let o=this._loader._getOrCreateMaterialAdapter(s),i=r.ior!==void 0?r.ior:Dp._DEFAULT_IOR;return o.specularIor=i,Promise.resolve()}}Dp._DEFAULT_IOR=1.5;var a=!1;function Yb(){if(a)return;a=!0,W(t),X(t,!0,(e)=>new Dp(e))}
export{Dp,Yb};

//# debugId=C2BAE00F1BD07F3364756E2164756E21
//# sourceMappingURL=site-qpm210zy.js.map
