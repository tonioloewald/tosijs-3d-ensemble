import{zr,hi}from"./site-x7zr027n.js";import{R,N}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Zp extends hi{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&zr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||zr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function Kp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Zp)}Kp();
export{Zp,Kp};

//# debugId=14174F2FD78B730564756E2164756E21
//# sourceMappingURL=site-pa4v37t3.js.map
