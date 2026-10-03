import{hi}from"./site-x7zr027n.js";import{Di,N}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";var r="sceneTick";class eg extends hi{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",N),this.deltaTime=this.registerDataOutput("deltaTime",N),this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function tg(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",eg)}tg();
export{eg,tg};

//# debugId=5C0C16A384A5677C64756E2164756E21
//# sourceMappingURL=site-jgydh18d.js.map
