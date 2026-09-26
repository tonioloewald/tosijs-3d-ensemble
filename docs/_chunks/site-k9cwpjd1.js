import{Gr,ui}from"./site-e2p70xxb.js";import{A,N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Yp extends ui{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",A,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",A)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&Gr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||Gr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function jp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Yp)}jp();
export{Yp,jp};

//# debugId=7C13369707D38E7564756E2164756E21
//# sourceMappingURL=site-k9cwpjd1.js.map
