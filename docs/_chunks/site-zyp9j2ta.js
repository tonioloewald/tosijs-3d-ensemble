import{zr,hi}from"./site-gh92gf7j.js";import{R,N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class Yp extends hi{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",N),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&zr(t.out,r);if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||zr(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function jp(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Yp)}jp();
export{Yp,jp};

//# debugId=D8EDB8AED7FCF85864756E2164756E21
//# sourceMappingURL=site-zyp9j2ta.js.map
