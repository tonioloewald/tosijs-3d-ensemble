import{Ur,ci}from"./site-7z4hmt54.js";import{w,k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";class Jp extends ci{constructor(t){super(t);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",k),this.targetMesh=this.registerDataInput("targetMesh",w,t?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",w)}_executeEvent(t,e){let r=this.targetMesh.getValue(t);if(this.meshOutOfPointer.setValue(e.mesh,t),this.pointerId.setValue(e.pointerId,t),!(e.over&&Ur(e.mesh,r))&&(e.mesh===r||Ur(e.mesh,r)))return this._execute(t),!this.config?.stopPropagation;return!0}_preparePendingTasks(t){}_cancelPendingTasks(t){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function em(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Jp)}em();
export{Jp,em};

//# debugId=A51271CAB4B8BF8364756E2164756E21
//# sourceMappingURL=site-trt2ypng.js.map
