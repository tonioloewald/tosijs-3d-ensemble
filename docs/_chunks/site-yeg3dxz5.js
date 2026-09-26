import{Fe}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class am extends Fe{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",A,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function lm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",am)}lm();
export{am,lm};

//# debugId=36D63A326B6B0BA464756E2164756E21
//# sourceMappingURL=site-yeg3dxz5.js.map
