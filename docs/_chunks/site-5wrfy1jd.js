import{Z,Q}from"./site-vkghnj1s.js";var e="KHR_xmp_json_ld";class US{constructor(t){this.name=e,this.order=100,this._loader=t,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}onLoading(){if(this._loader.rootBabylonMesh===null)return;let t=this._loader.gltf.extensions?.KHR_xmp_json_ld,o=this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;if(t&&o){let s=+o.packet;if(t.packets&&s<t.packets.length)this._loader.rootBabylonMesh.metadata=this._loader.rootBabylonMesh.metadata||{},this._loader.rootBabylonMesh.metadata.xmp=t.packets[s]}}}var r=!1;function WS(){if(r)return;r=!0,Q(e),Z(e,!0,(t)=>new US(t))}WS();
export{US,WS};

//# debugId=8AD6A6C953C255B564756E2164756E21
//# sourceMappingURL=site-5wrfy1jd.js.map
