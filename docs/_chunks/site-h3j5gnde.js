import{R,Pi}from"./site-qrpgd9aj.js";import{Ai}from"./site-ejnpm1xv.js";import{o}from"./site-nky97gw9.js";class cm extends Ai{constructor(e){super(R,e);this.config=e,this.object=this.registerDataInput("object",R,e.object),this.propertyName=this.registerDataInput("propertyName",Pi,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",R)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function hm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",cm)}hm();
export{cm,hm};

//# debugId=87F8AE9E49AD193464756E2164756E21
//# sourceMappingURL=site-h3j5gnde.js.map
