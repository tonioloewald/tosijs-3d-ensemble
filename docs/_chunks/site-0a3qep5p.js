import{rs,ni}from"./site-bs4qmp9a.js";import{R,B}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Y_ extends ni{constructor(e){super(e);this.type="PointerOver",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshUnderPointer=this.registerDataOutput("meshUnderPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);this.meshUnderPointer.setValue(t.mesh,e);let i=t.out&&(t.out===r||rs(t.out,r));if(this.pointerId.setValue(t.pointerId,e),!i&&(t.mesh===r||rs(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOverEventBlock"}}var s=!1;function j_(){if(s)return;s=!0,o("FlowGraphPointerOverEventBlock",Y_)}
export{Y_,j_};

//# debugId=9104CD6F6784388B64756E2164756E21
//# sourceMappingURL=site-0a3qep5p.js.map
