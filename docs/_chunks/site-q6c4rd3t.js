import{rs,ni}from"./site-3s1j98fr.js";import{A,k}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class Qg extends ni{constructor(e){super(e);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",k),this.targetMesh=this.registerDataInput("targetMesh",A,e?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",A)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);if(this.meshOutOfPointer.setValue(t.mesh,e),this.pointerId.setValue(t.pointerId,e),!(t.over&&(t.over===r||rs(t.over,r)))&&(t.mesh===r||rs(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function qg(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Qg)}
export{Qg,qg};

//# debugId=8072A84A61166C7064756E2164756E21
//# sourceMappingURL=site-q6c4rd3t.js.map
