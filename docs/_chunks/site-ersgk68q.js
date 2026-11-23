import{be,si}from"./site-bs4qmp9a.js";import{R}from"./site-f6qdnbcs.js";import{_e}from"./site-hh88thkx.js";import{o}from"./site-3cxcjhqf.js";class __ extends be{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new _e(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let i=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let a=e.decodeIndexReference(r,this.config.referenceCollection);if(a===void 0){this.value.setValue(null,e);return}t=a}else t=si(r);if(i&&t>=0&&t<i.length)this.value.setValue(i[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function g_(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",__)}
export{__,g_};

//# debugId=5AE1AD3D05C1E3E464756E2164756E21
//# sourceMappingURL=site-ersgk68q.js.map
