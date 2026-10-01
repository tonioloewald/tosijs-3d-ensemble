import{R,Di}from"./site-j8hq6r34.js";import{Ai}from"./site-a3xs0a1x.js";import{o}from"./site-jx9g7gwh.js";class rm extends Ai{constructor(e){super(R,e);this.config=e,this.object=this.registerDataInput("object",R,e.object),this.propertyName=this.registerDataInput("propertyName",Di,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",R)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function sm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",rm)}sm();
export{rm,sm};

//# debugId=63C79264F497A07B64756E2164756E21
//# sourceMappingURL=site-m0hp101q.js.map
