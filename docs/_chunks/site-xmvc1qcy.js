import{Fe}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{o}from"./site-jx9g7gwh.js";class am extends Fe{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function lm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",am)}lm();
export{am,lm};

//# debugId=56B9C449A73E19D764756E2164756E21
//# sourceMappingURL=site-xmvc1qcy.js.map
