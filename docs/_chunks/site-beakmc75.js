import{Yt}from"./site-3s1j98fr.js";import{He}from"./site-2m9hnh4q.js";import{o}from"./site-ny31phz1.js";class L_ extends Yt{constructor(e){super(e);this.condition=this.registerDataInput("condition",He),this.onTrue=this._registerSignalOutput("onTrue"),this.onFalse=this._registerSignalOutput("onFalse")}_execute(e){if(this.condition.getValue(e))this.onTrue._activateSignal(e);else this.onFalse._activateSignal(e)}getClassName(){return"FlowGraphBranchBlock"}}var t=!1;function N_(){if(t)return;t=!0,o("FlowGraphBranchBlock",L_)}
export{L_,N_};

//# debugId=7440796EB342357D64756E2164756E21
//# sourceMappingURL=site-beakmc75.js.map
