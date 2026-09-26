import{ui}from"./site-e2p70xxb.js";import{Di}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";var t="sceneReady";class jg extends ui{constructor(){super();this.initPriority=-1,this.type="SceneReady",this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(t),e)}_executeEvent(e,n){return this.eventRef.setValue(e.getEventReference(t),e),this._execute(e),!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}var r=!1;function Qg(){if(r)return;r=!0,o("FlowGraphSceneReadyEventBlock",jg)}Qg();
export{jg,Qg};

//# debugId=9F202E3642C172B864756E2164756E21
//# sourceMappingURL=site-1qwzr464.js.map
