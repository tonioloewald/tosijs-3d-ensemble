import{be,si}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{ge}from"./site-2t7svfbg.js";import{o}from"./site-ny31phz1.js";class gg extends be{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",A),this.index=this.registerDataInput("index",A,new ge(-1)),this.value=this.registerDataOutput("value",A)}_updateOutputs(e){let i=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let a=e.decodeIndexReference(r,this.config.referenceCollection);if(a===void 0){this.value.setValue(null,e);return}t=a}else t=si(r);if(i&&t>=0&&t<i.length)this.value.setValue(i[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function _g(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",gg)}
export{gg,_g};

//# debugId=5A74C8D2300C589B64756E2164756E21
//# sourceMappingURL=site-s24654cd.js.map
