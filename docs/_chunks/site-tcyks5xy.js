import{Gs as c}from"./site-gs6exbj3.js";import{Qu as a,Ru as t}from"./site-y0mephjk.js";import{lF as n}from"./site-54y5gp1n.js";var i="sceneTick";class u extends c{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",t),this.deltaTime=this.registerDataOutput("deltaTime",t),this.eventRef=this.registerDataOutput("event",a)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(i),e)}_preparePendingTasks(e){}_executeEvent(e,r){return this.timeSinceStart.setValue(r.timeSinceStart,e),this.deltaTime.setValue(r.deltaTime,e),this.eventRef.setValue(e.getEventReference(i),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var s=!1;function l(){if(s)return;s=!0,n("FlowGraphSceneTickEventBlock",u)}l();
export{u as es,l as fs};

//# debugId=6900542FFA22BFE964756E2164756E21
//# sourceMappingURL=site-tcyks5xy.js.map
