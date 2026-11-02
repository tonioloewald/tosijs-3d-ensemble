import{Ur,hi}from"./site-4mctpt5x.js";import{R,B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class rm extends hi{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",R)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&Ur(e.mesh,r))&&(e.mesh===r||Ur(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function sm(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",rm)}sm();
export{rm,sm};

//# debugId=42E1159920EC0FAE64756E2164756E21
//# sourceMappingURL=site-04616hcf.js.map
