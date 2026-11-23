import{be}from"./site-bs4qmp9a.js";import{R,oi}from"./site-f6qdnbcs.js";function xp(e,c){let t=c;while(t){let r=e.getObjectReference(t,"nodes");if(r?.startsWith("/nodes/"))return r;t=t.parent}return""}class xA extends be{constructor(e){super(e);this.object=this.registerDataInput("object",R),this.value=this.registerDataOutput("value",oi,"")}_updateOutputs(e){this.value.setValue(xp(e,this.object.getValue(e)),e)}getClassName(){return"FlowGraphObjectReferenceBlock"}}
export{xp,xA};

//# debugId=C90088CB594B26FF64756E2164756E21
//# sourceMappingURL=site-n64ymae8.js.map
