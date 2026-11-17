import{rs,ni}from"./site-3s1j98fr.js";import{A,k}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class Yg extends ni{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",k),this.targetMesh=this.registerDataInput("targetMesh",A,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",A)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&(t.out===r||rs(t.out,r));if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||rs(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function jg(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Yg)}
export{Yg,jg};

//# debugId=E2F47863D1B0B0C664756E2164756E21
//# sourceMappingURL=site-g100qsn5.js.map
