import{Ku as l}from"./site-18c2qzzn.js";import{Pu as t}from"./site-y0mephjk.js";import{lF as i}from"./site-54y5gp1n.js";class s extends l{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",t,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function o(){if(a)return;a=!0,i("FlowGraphGetVariableBlock",s)}o();
export{s as ao,o as bo};

//# debugId=68942C5B3F07A19764756E2164756E21
//# sourceMappingURL=site-cpxhc91d.js.map
