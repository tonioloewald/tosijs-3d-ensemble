import{Iu as l}from"./site-rab9t16m.js";import{Nu as t}from"./site-p0rrvqfa.js";import{jF as i}from"./site-6873nq4n.js";class s extends l{constructor(e){super(e);this.config=e,this.value=this.registerDataOutput("value",t,e.initialValue)}_updateOutputs(e){let r=this.config.variable;if(e.hasVariable(r))this.value.setValue(e.getVariable(r),e)}serialize(e){super.serialize(e),e.config.variable=this.config.variable}getClassName(){return"FlowGraphGetVariableBlock"}}var a=!1;function o(){if(a)return;a=!0,i("FlowGraphGetVariableBlock",s)}o();
export{s as _n,o as $n};

//# debugId=CAB150327AFAE4EC64756E2164756E21
//# sourceMappingURL=site-yn32zkz3.js.map
