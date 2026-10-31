import{Le}from"./site-td3n9zy5.js";import{R}from"./site-zgpxnm1e.js";import{o}from"./site-8ek23vdm.js";class dm extends Le{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function pm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",dm)}pm();
export{dm,pm};

//# debugId=FF508CDA4E9D92DF64756E2164756E21
//# sourceMappingURL=site-6en5hfcc.js.map
