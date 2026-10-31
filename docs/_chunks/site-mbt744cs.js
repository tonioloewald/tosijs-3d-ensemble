import{Le,jt}from"./site-td3n9zy5.js";import{R}from"./site-zgpxnm1e.js";import{ye}from"./site-qjmja4h8.js";import{o}from"./site-8ek23vdm.js";class bp extends Le{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new ye(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=jt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function Sp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",bp)}Sp();
export{bp,Sp};

//# debugId=97E70C9725DF154964756E2164756E21
//# sourceMappingURL=site-mbt744cs.js.map
