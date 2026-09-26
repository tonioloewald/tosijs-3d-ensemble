import{ui}from"./site-e2p70xxb.js";import{Di,N}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";var r="sceneTick";class Hm extends ui{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",N),this.deltaTime=this.registerDataOutput("deltaTime",N),this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function Xm(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",Hm)}Xm();
export{Hm,Xm};

//# debugId=D47C1BFE3015560B64756E2164756E21
//# sourceMappingURL=site-2576kydh.js.map
