import{Gr,ui}from"./site-e2p70xxb.js";import{A,N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Qp extends ui{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",A,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",A)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&Gr(e.mesh,r))&&(e.mesh===r||Gr(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function qp(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Qp)}qp();
export{Qp,qp};

//# debugId=C8188526EBBF264F64756E2164756E21
//# sourceMappingURL=site-dsasp0sh.js.map
