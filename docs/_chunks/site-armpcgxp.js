import{ni}from"./site-3s1j98fr.js";import{oi}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";var t="sceneReady";class Q0 extends ni{get eventKey(){return t}constructor(){super();this.initPriority=-1,this.type="SceneReady",this.eventRef=this.registerDataOutput("event",oi)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(t),e)}_executeEvent(e,n){return this.eventRef.setValue(e.getEventReference(t),e),this._execute(e),!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}var r=!1;function q0(){if(r)return;r=!0,o("FlowGraphSceneReadyEventBlock",Q0)}
export{Q0,q0};

//# debugId=D801E19E79673B9964756E2164756E21
//# sourceMappingURL=site-armpcgxp.js.map
