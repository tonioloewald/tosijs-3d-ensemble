import{Le}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class dm extends Le{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function pm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",dm)}pm();
export{dm,pm};

//# debugId=FF508CDA4E9D92DF64756E2164756E21
//# sourceMappingURL=site-kbnbv8az.js.map
