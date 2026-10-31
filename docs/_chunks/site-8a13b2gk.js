import{Ur,ci}from"./site-td3n9zy5.js";import{R,k}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class Zp extends ci{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",k),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&Ur(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||Ur(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=D9F4E4874D0557BC64756E2164756E21
//# sourceMappingURL=site-8a13b2gk.js.map
