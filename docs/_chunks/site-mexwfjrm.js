import{Ur,hi}from"./site-4mctpt5x.js";import{R,B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class tm extends hi{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&Ur(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||Ur(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function im(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",tm)}im();
export{tm,im};

//# debugId=3F7A8C30F3E639B964756E2164756E21
//# sourceMappingURL=site-mexwfjrm.js.map
