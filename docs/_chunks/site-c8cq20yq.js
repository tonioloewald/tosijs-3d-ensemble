import{Ne,bn,jt}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{o}from"./site-8nsc0rx2.js";class cp extends Ne{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",R,NaN),this.default=this.registerDataInput("default",R),this.value=this.registerDataOutput("value",R);let s=this.config.cases||[];for(let t of s){if(t=jt(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,R))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(bn(s))t=this._getOutputValueForCase(jt(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function hp(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",cp)}hp();
export{cp,hp};

//# debugId=93C98BEF5F1F20EF64756E2164756E21
//# sourceMappingURL=site-c8cq20yq.js.map
