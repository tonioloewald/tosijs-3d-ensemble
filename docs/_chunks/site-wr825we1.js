import{Le}from"./site-enc8r1rf.js";import{w}from"./site-j2m5wc1b.js";import{o}from"./site-whc0p6f0.js";class dm extends Le{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",w,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function pm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",dm)}pm();
export{dm,pm};

//# debugId=63ED32EE5FE1910164756E2164756E21
//# sourceMappingURL=site-wr825we1.js.map
