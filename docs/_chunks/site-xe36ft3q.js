import{zr,hi}from"./site-gh92gf7j.js";import{R,N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Qp extends hi{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",R,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",R)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&zr(e.mesh,r))&&(e.mesh===r||zr(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function qp(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Qp)}qp();
export{Qp,qp};

//# debugId=3A5884902DE222A764756E2164756E21
//# sourceMappingURL=site-xe36ft3q.js.map
