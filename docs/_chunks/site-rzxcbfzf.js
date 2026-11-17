import{be}from"./site-3s1j98fr.js";import{A,oi}from"./site-2m9hnh4q.js";function xp(e,c){let t=c;while(t){let r=e.getObjectReference(t,"nodes");if(r?.startsWith("/nodes/"))return r;t=t.parent}return""}class xw extends be{constructor(e){super(e);this.object=this.registerDataInput("object",A),this.value=this.registerDataOutput("value",oi,"")}_updateOutputs(e){this.value.setValue(xp(e,this.object.getValue(e)),e)}getClassName(){return"FlowGraphObjectReferenceBlock"}}
export{xp,xw};

//# debugId=80AC7E8DC6D5C8D064756E2164756E21
//# sourceMappingURL=site-rzxcbfzf.js.map
