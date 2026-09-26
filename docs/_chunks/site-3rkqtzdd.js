import{Fe,qt}from"./site-e2p70xxb.js";import{A}from"./site-pb29jqm8.js";import{Ce}from"./site-9zkrtmwf.js";import{o}from"./site-jv0cbgr5.js";class gp extends Fe{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",A),this.index=this.registerDataInput("index",A,new Ce(-1)),this.value=this.registerDataOutput("value",A)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=qt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function xp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",gp)}xp();
export{gp,xp};

//# debugId=2D33085805B50A8D64756E2164756E21
//# sourceMappingURL=site-3rkqtzdd.js.map
