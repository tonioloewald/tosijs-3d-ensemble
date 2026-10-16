import{w,Di}from"./site-vr02jwft.js";import{Ri}from"./site-stzf3pkj.js";import{o}from"./site-hbscgnbb.js";class cm extends Ri{constructor(e){super(w,e);this.config=e,this.object=this.registerDataInput("object",w,e.object),this.propertyName=this.registerDataInput("propertyName",Di,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",w)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function hm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",cm)}hm();
export{cm,hm};

//# debugId=B21E704C7A3E15DF64756E2164756E21
//# sourceMappingURL=site-vxke7zxt.js.map
