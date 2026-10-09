import{Q,Y}from"./site-74rc84n6.js";var e="KHR_xmp_json_ld";class RS{constructor(t){this.name=e,this.order=100,this._loader=t,this.enabled=this._loader.isExtensionUsed(e)}dispose(){this._loader=null}onLoading(){if(this._loader.rootBabylonMesh===null)return;let t=this._loader.gltf.extensions?.KHR_xmp_json_ld,o=this._loader.gltf.asset?.extensions?.KHR_xmp_json_ld;if(t&&o){let s=+o.packet;if(t.packets&&s<t.packets.length)this._loader.rootBabylonMesh.metadata=this._loader.rootBabylonMesh.metadata||{},this._loader.rootBabylonMesh.metadata.xmp=t.packets[s]}}}var r=!1;function wS(){if(r)return;r=!0,Y(e),Q(e,!0,(t)=>new RS(t))}wS();
export{RS,wS};

//# debugId=8958876CB2C987E964756E2164756E21
//# sourceMappingURL=site-1j21arze.js.map
