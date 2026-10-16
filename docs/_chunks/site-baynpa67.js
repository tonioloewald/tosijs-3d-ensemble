import{zr,ci}from"./site-nac7rcp4.js";import{w,N}from"./site-vr02jwft.js";import{o}from"./site-hbscgnbb.js";class Zp extends ci{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",w,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",w)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&zr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||zr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=85F51A01E651837764756E2164756E21
//# sourceMappingURL=site-baynpa67.js.map
