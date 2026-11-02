import{Ne}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class _m extends Ne{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",R,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function xm(){if(a)return;a=!0,o("FlowGraphGetVariableBlock",_m)}xm();
export{_m,xm};

//# debugId=12FBA70CC6412DD064756E2164756E21
//# sourceMappingURL=site-a5g7sjcq.js.map
