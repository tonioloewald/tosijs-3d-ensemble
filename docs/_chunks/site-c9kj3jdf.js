import{rs,ni}from"./site-bs4qmp9a.js";import{R,B}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";class Q_ extends ni{constructor(e){super(e);this.type="PointerOut",this.pointerId=this.registerDataOutput("pointerId",B),this.targetMesh=this.registerDataInput("targetMesh",R,e?.targetMesh),this.meshOutOfPointer=this.registerDataOutput("meshOutOfPointer",R)}_executeEvent(e,t){let r=this.targetMesh.getValue(e);if(this.meshOutOfPointer.setValue(t.mesh,e),this.pointerId.setValue(t.pointerId,e),!(t.over&&(t.over===r||rs(t.over,r)))&&(t.mesh===r||rs(t.mesh,r)))return this._execute(e),!this.config?.stopPropagation;return!0}_getReferencedMesh(e){return this.targetMesh.getValue(e)}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphPointerOutEventBlock"}}var s=!1;function q_(){if(s)return;s=!0,o("FlowGraphPointerOutEventBlock",Q_)}
export{Q_,q_};

//# debugId=DC684B508566505564756E2164756E21
//# sourceMappingURL=site-c9kj3jdf.js.map
