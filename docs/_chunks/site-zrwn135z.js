import{zr,ci}from"./site-rzgrmjyd.js";import{w,N}from"./site-ws3bshz1.js";import{o}from"./site-pmpcb5qm.js";class Jp extends ci{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",w,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",w)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&zr(e.mesh,r))&&(e.mesh===r||zr(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function em(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Jp)}em();
export{Jp,em};

//# debugId=9D39619BA0C9130464756E2164756E21
//# sourceMappingURL=site-zrwn135z.js.map
