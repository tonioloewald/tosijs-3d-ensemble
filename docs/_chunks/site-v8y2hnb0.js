import{Le,vn,jt}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";import{o}from"./site-nky97gw9.js";class np extends Le{constructor(e){super(e);this.config=e,this._inputCases=new Map,this.case=this.registerDataInput("case",R,NaN),this.default=this.registerDataInput("default",R),this.value=this.registerDataOutput("value",R);let s=this.config.cases||[];for(let t of s){if(t=jt(t),this.config.treatCasesAsIntegers){if(t=t|0,this._inputCases.has(t))return}this._inputCases.set(t,this.registerDataInput(`in_${t}`,R))}}_updateOutputs(e){let s=this.case.getValue(e),t;if(vn(s))t=this._getOutputValueForCase(jt(s),e);if(!t)t=this.default.getValue(e);this.value.setValue(t,e)}_getOutputValueForCase(e,s){return this._inputCases.get(e)?.getValue(s)}getClassName(){return"FlowGraphDataSwitchBlock"}}var a=!1;function op(){if(a)return;a=!0,o("FlowGraphDataSwitchBlock",np)}op();
export{np,op};

//# debugId=8C6A07D5873CFA3D64756E2164756E21
//# sourceMappingURL=site-v8y2hnb0.js.map
