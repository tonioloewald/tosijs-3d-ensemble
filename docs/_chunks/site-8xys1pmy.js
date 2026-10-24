import{Ur,ci}from"./site-7z4hmt54.js";import{w,k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Zp extends ci{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",k),this.targetMesh=this.registerDataInput("targetMesh",w,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",w)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&Ur(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||Ur(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=22C0BB2A4A13492164756E2164756E21
//# sourceMappingURL=site-8xys1pmy.js.map
