import{zr,ci}from"./site-228z8wgn.js";import{R,N}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class Jp extends ci{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",R,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",R)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&zr(e.mesh,r))&&(e.mesh===r||zr(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function em(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Jp)}em();
export{Jp,em};

//# debugId=C5E4FB79DD10A23F64756E2164756E21
//# sourceMappingURL=site-97gzmmr5.js.map
