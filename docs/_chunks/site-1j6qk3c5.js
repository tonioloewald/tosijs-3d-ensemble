import{hi}from"./site-gh92gf7j.js";import{Di,N}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";var r="sceneTick";class Hm extends hi{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",N),this.deltaTime=this.registerDataOutput("deltaTime",N),this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function Xm(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",Hm)}Xm();
export{Hm,Xm};

//# debugId=7E42BFA8D2B520C164756E2164756E21
//# sourceMappingURL=site-1j6qk3c5.js.map
