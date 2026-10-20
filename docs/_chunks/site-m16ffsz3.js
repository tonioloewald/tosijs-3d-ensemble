import{ci}from"./site-0215gf70.js";import{Di}from"./site-afz29jnp.js";import{o}from"./site-ky7rmxkt.js";var t="sceneReady";class Km extends ci{constructor(){super();this.initPriority=-1,this.type="SceneReady",this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(t),e)}_executeEvent(e,n){return this.eventRef.setValue(e.getEventReference(t),e),this._execute(e),!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}var r=!1;function Jm(){if(r)return;r=!0,o("FlowGraphSceneReadyEventBlock",Km)}Jm();
export{Km,Jm};

//# debugId=F5C356EF8751B9D764756E2164756E21
//# sourceMappingURL=site-m16ffsz3.js.map
