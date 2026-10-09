import{ci}from"./site-228z8wgn.js";import{Pi,N}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";var r="sceneTick";class eg extends ci{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",N),this.deltaTime=this.registerDataOutput("deltaTime",N),this.eventRef=this.registerDataOutput("event",Pi)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function tg(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",eg)}tg();
export{eg,tg};

//# debugId=E37E63D51366C10164756E2164756E21
//# sourceMappingURL=site-pj2h2azz.js.map
