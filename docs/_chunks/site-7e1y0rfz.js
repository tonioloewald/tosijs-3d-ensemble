import{ci}from"./site-7z4hmt54.js";import{Di,k}from"./site-169k801a.js";import{o}from"./site-g2k0zkaa.js";var r="sceneTick";class eg extends ci{constructor(){super();this.type="SceneBeforeRender",this.timeSinceStart=this.registerDataOutput("timeSinceStart",k),this.deltaTime=this.registerDataOutput("deltaTime",k),this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(r),e)}_preparePendingTasks(e){}_executeEvent(e,t){return this.timeSinceStart.setValue(t.timeSinceStart,e),this.deltaTime.setValue(t.deltaTime,e),this.eventRef.setValue(e.getEventReference(r),e),this._execute(e),!0}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneTickEventBlock"}}var i=!1;function tg(){if(i)return;i=!0,o("FlowGraphSceneTickEventBlock",eg)}tg();
export{eg,tg};

//# debugId=C936C0E53A15F4F864756E2164756E21
//# sourceMappingURL=site-7e1y0rfz.js.map
