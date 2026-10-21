import{Le}from"./site-g4m6yns1.js";import{w}from"./site-4xj1x7pw.js";import{o}from"./site-w5qxkse6.js";class dm extends Le{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",w,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function pm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",dm)}pm();
export{dm,pm};

//# debugId=63ED32EE5FE1910164756E2164756E21
//# sourceMappingURL=site-zdcr7k7c.js.map
