import{A,Di}from"./site-pb29jqm8.js";import{Ri}from"./site-fvbgmb5e.js";import{o}from"./site-jv0cbgr5.js";class rm extends Ri{constructor(e){super(A,e);this.config=e,this.object=this.registerDataInput("object",A,e.object),this.propertyName=this.registerDataInput("propertyName",Di,e.propertyName),this.customGetFunction=this.registerDataInput("customGetFunction",A)}_doOperation(e){let p=this.customGetFunction.getValue(e),r;if(p)r=p(this.object.getValue(e),this.propertyName.getValue(e),e);else{let t=this.object.getValue(e),s=this.propertyName.getValue(e);r=t&&s?this._getPropertyValue(t,s):void 0}return r}_getPropertyValue(e,p){let r=p.split("."),t=e;for(let s of r)if(t=t[s],t===void 0)return;return t}getClassName(){return"FlowGraphGetPropertyBlock"}}var i=!1;function sm(){if(i)return;i=!0,o("FlowGraphGetPropertyBlock",rm)}sm();
export{rm,sm};

//# debugId=E29EC6BEFE95094D64756E2164756E21
//# sourceMappingURL=site-5wacmdrw.js.map
