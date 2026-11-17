import{Ye}from"./site-3s1j98fr.js";import{ai}from"./site-2m9hnh4q.js";import{ge}from"./site-2t7svfbg.js";import{o}from"./site-ny31phz1.js";class $_ extends Ye{constructor(t={}){super(t);this.config=t,this.config.startIndex=t.startIndex??new ge(0),this.reset=this._registerSignalInput("reset"),this.maxExecutions=this.registerDataInput("maxExecutions",ai),this.executionCount=this.registerDataOutput("executionCount",ai,new ge(0))}_execute(t,s){if(s===this.reset)this.executionCount.setValue(this.config.startIndex,t);else{let e=this.executionCount.getValue(t);if(e.value<this.maxExecutions.getValue(t).value)this.executionCount.setValue(new ge(e.value+1),t),this.out._activateSignal(t)}}getClassName(){return"FlowGraphDoNBlock"}}var i=!1;function Y_(){if(i)return;i=!0,o("FlowGraphDoNBlock",$_)}
export{$_,Y_};

//# debugId=BF3DF436888790E864756E2164756E21
//# sourceMappingURL=site-q1hjyjsd.js.map
