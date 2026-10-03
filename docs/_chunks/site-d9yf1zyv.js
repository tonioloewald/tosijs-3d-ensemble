import{Fe}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class dm extends Fe{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function pm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",dm)}pm();
export{dm,pm};

//# debugId=0595B9145F955A8164756E2164756E21
//# sourceMappingURL=site-d9yf1zyv.js.map
