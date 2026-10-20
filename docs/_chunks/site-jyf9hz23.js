import{Le,jt}from"./site-dkd9tveg.js";import{w}from"./site-jw81twe3.js";import{ye}from"./site-g5md7x77.js";import{o}from"./site-mkftt73g.js";class bp extends Le{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",w),this.index=this.registerDataInput("index",w,new ye(-1)),this.value=this.registerDataOutput("value",w)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=jt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function Sp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",bp)}Sp();
export{bp,Sp};

//# debugId=5D319E846E76C9BD64756E2164756E21
//# sourceMappingURL=site-jyf9hz23.js.map
