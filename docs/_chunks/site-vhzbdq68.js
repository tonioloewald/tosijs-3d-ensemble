import{Le,jt}from"./site-228z8wgn.js";import{R}from"./site-qrpgd9aj.js";import{ye}from"./site-x5hpt1ja.js";import{o}from"./site-nky97gw9.js";class bp extends Le{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new ye(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=jt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function Sp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",bp)}Sp();
export{bp,Sp};

//# debugId=97E70C9725DF154964756E2164756E21
//# sourceMappingURL=site-vhzbdq68.js.map
