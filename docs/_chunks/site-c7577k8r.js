import{Fe,qt}from"./site-gh92gf7j.js";import{R}from"./site-j8hq6r34.js";import{Ee}from"./site-n6f5fqea.js";import{o}from"./site-jx9g7gwh.js";class _p extends Fe{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new Ee(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=qt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function xp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",_p)}xp();
export{_p,xp};

//# debugId=DF0A86667631DB4664756E2164756E21
//# sourceMappingURL=site-c7577k8r.js.map
