import{Ne,jt}from"./site-4mctpt5x.js";import{R}from"./site-pddhyj91.js";import{Te}from"./site-vr8xgfg5.js";import{o}from"./site-8nsc0rx2.js";class Cp extends Ne{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new Te(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=jt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function Ap(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",Cp)}Ap();
export{Cp,Ap};

//# debugId=334CECEB616C933664756E2164756E21
//# sourceMappingURL=site-esft6kbd.js.map
