import{Es as c}from"./site-r11vn21v.js";import{Ou as a,Pu as t}from"./site-p0rrvqfa.js";import{jF as n}from"./site-6873nq4n.js";var i="sceneTick";class u extends c{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",t),this.deltaTime=this.registerDataOutput("deltaTime",t),this.eventRef=this.registerDataOutput("event",a)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(i),e)}_preparePendingTasks(e){}_executeEvent(e,r){return this.timeSinceStart.setValue(r.timeSinceStart,e),this.deltaTime.setValue(r.deltaTime,e),this.eventRef.setValue(e.getEventReference(i),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var s=!1;function l(){if(s)return;s=!0,n("FlowGraphSceneTickEventBlock",u)}l();
export{u as cs,l as ds};

//# debugId=462A8A2416DD034E64756E2164756E21
//# sourceMappingURL=site-9yjbb7y5.js.map
