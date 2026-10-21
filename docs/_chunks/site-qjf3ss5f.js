import{Gr,ci}from"./site-g4m6yns1.js";import{w,N}from"./site-4xj1x7pw.js";import{o}from"./site-w5qxkse6.js";class Jp extends ci{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",w,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",w)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&Gr(e.mesh,r))&&(e.mesh===r||Gr(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function em(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Jp)}em();
export{Jp,em};

//# debugId=2B1447034E9E56D964756E2164756E21
//# sourceMappingURL=site-qjf3ss5f.js.map
