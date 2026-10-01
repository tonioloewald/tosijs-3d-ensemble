import{hi}from"./site-gh92gf7j.js";import{Di}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";var t="sceneReady";class j_ extends hi{constructor(){super();this.initPriority=-1,this.type="SceneReady",this.eventRef=this.registerDataOutput("event",Di)}_updateOutputs(e){this.eventRef.setValue(e.getEventReference(t),e)}_executeEvent(e,n){return this.eventRef.setValue(e.getEventReference(t),e),this._execute(e),!0}_preparePendingTasks(e){}_cancelPendingTasks(e){}getClassName(){return"FlowGraphSceneReadyEventBlock"}}var r=!1;function Q_(){if(r)return;r=!0,o("FlowGraphSceneReadyEventBlock",j_)}Q_();
export{j_,Q_};

//# debugId=520ECF7C5B0D4F3464756E2164756E21
//# sourceMappingURL=site-vcaba7ry.js.map
