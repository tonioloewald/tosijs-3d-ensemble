import{ni}from"./site-bs4qmp9a.js";import{oi}from"./site-f6qdnbcs.js";import{o}from"./site-3cxcjhqf.js";var t="sceneReady";class Qv extends ni{get eventKey(){return t}constructor(){super();this.initPriority=-1,this.type="SceneReady",this.eventRef=this.registerDataOutput("event",oi)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(t),e)}_executeEvent(e,n){return this.eventRef.setValue(e.getEventReference(t),e),this._execute(e),!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}var r=!1;function qv(){if(r)return;r=!0,o("FlowGraphSceneReadyEventBlock",Qv)}
export{Qv,qv};

//# debugId=1D3DEE6A7B11C2CB64756E2164756E21
//# sourceMappingURL=site-x7xpma0h.js.map
