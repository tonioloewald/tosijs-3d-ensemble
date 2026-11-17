import{Ye}from"./site-3s1j98fr.js";import{k}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class z_ extends Ye{constructor(t){super(t);this.count=this.registerDataOutput("count",k),this.reset=this._registerSignalInput("reset")}_execute(t,i){if(i===this.reset){t._setExecutionVariable(this,"count",0),this.count.setValue(0,t);return}let e=t._getExecutionVariable(this,"count",0)+1;t._setExecutionVariable(this,"count",e),this.count.setValue(e,t),this.out._activateSignal(t)}getClassName(){return"FlowGraphCallCounterBlock"}}var r=!1;function G_(){if(r)return;r=!0,o("FlowGraphCallCounterBlock",z_)}
export{z_,G_};

//# debugId=69705B6A14BFFDAD64756E2164756E21
//# sourceMappingURL=site-er3jj68n.js.map
