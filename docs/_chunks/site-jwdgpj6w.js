import{X,W}from"./site-ejgpgj5p.js";var e="KHR_xmp_json_ld";class O1{constructor(t){this.name=e,this.order=100,this._loader=t,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}onLoading(){if(this._loader.rootBabylonMesh===null)return;let t=this._loader.gltf.extensions?.KHR_xmp_json_ld,s=this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;if(t&&s){let o=+s.packet;if(t.packets&&o<t.packets.length)this._loader.rootBabylonMesh.metadata=this._loader.rootBabylonMesh.metadata||{},this._loader.rootBabylonMesh.metadata.xmp=t.packets[o]}}}var n=!1;function Wb(){if(n)return;n=!0,W(e),X(e,!0,(t)=>new O1(t))}
export{O1,Wb};

//# debugId=D63ACE5FB6110F5D64756E2164756E21
//# sourceMappingURL=site-jwdgpj6w.js.map
