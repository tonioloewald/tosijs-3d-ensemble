import{Fe,qt}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";import{Ee}from"./site-0fa9tw7q.js";import{o}from"./site-j9pt9hg9.js";class bp extends Fe{constructor(e){super(e);this.config=e,this.array=this.registerDataInput("array",R),this.index=this.registerDataInput("index",R,new Ee(-1)),this.value=this.registerDataOutput("value",R)}_updateOutputs(e){let a=this.array.getValue(e),r=this.index.getValue(e);if(r===void 0||r===null){this.value.setValue(null,e);return}let t;if(typeof r==="string"){let i=e.decodeIndexReference(r);if(i===void 0){this.value.setValue(null,e);return}t=i}else t=qt(r);if(a&&t>=0&&t<a.length)this.value.setValue(a[t],e);else this.value.setValue(null,e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphArrayIndexBlock"}}var s=!1;function Sp(){if(s)return;s=!0,o("FlowGraphArrayIndexBlock",bp)}Sp();
export{bp,Sp};

//# debugId=4659EA027DE2F62864756E2164756E21
//# sourceMappingURL=site-0xrm4wng.js.map
