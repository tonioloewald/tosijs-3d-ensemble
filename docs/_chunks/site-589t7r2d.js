import{Le,vn,jt}from"./site-403rb1zc.js";import{w}from"./site-1yfx1bcx.js";import{o}from"./site-wmfzbjvy.js";class np extends Le{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",w,NaN),this.default=this.registerDataInput("default",w),this.value=this.registerDataOutput("value",w);let s=this.config.cases||[];for(let t of s){if(t=jt(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,w))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(vn(s))t=this._getOutputValueForCase(jt(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function op(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",np)}op();
export{np,op};

//# debugId=7A73C4E85E8641BF64756E2164756E21
//# sourceMappingURL=site-589t7r2d.js.map
