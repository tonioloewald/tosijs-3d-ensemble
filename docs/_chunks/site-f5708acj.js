import{ci}from"./site-3q4gqkf5.js";import{Di,N}from"./site-9g37ftzw.js";import{o}from"./site-16qs5rck.js";var r="sceneTick";class eg extends ci{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",N),this.deltaTime=this.registerDataOutput("deltaTime",N),this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function tg(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",eg)}tg();
export{eg,tg};

//# debugId=595F722AD502B78364756E2164756E21
//# sourceMappingURL=site-f5708acj.js.map
