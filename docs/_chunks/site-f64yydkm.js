import{zr,ci}from"./site-228z8wgn.js";import{R,N}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Zp extends ci{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&zr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||zr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=C5F4780CF38B1F3564756E2164756E21
//# sourceMappingURL=site-f64yydkm.js.map
