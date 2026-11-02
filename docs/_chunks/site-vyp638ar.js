import{hi}from"./site-4mctpt5x.js";import{Li,B}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";var r="sceneTick";class sg extends hi{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",B),this.deltaTime=this.registerDataOutput("deltaTime",B),this.eventRef=this.registerDataOutput("event",Li)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function ng(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",sg)}ng();
export{sg,ng};

//# debugId=B60DDC9FB84781B564756E2164756E21
//# sourceMappingURL=site-vyp638ar.js.map
