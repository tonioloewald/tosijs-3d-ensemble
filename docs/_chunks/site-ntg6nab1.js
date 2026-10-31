import{R,Di}from"./site-zgpxnm1e.js";import{wi}from"./site-v3d6k5we.js";import{o}from"./site-8ek23vdm.js";class cm extends wi{constructor(e){super(R,e);this.config=e,this.object=this.registerDataInput("object",R,e.object),this.propertyName=this.registerDataInput("propertyName",Di,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",R)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function hm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",cm)}hm();
export{cm,hm};

//# debugId=ACB27BC8731759CA64756E2164756E21
//# sourceMappingURL=site-ntg6nab1.js.map
