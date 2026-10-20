import{Ia,Le}from"./site-0215gf70.js";import{ed}from"./site-afz29jnp.js";import{o}from"./site-ky7rmxkt.js";class rm extends Le{constructor(t){super(t);this.config=t,this.output=this.registerDataOutput("output",ed(t.value))}_updateOutputs(t){this.output.setValue(this.config.value,t)}getClassName(){return"FlowGraphConstantBlock"}serialize(t={},r=Ia){super.serialize(t),r("value",this.config.value,t.config)}}var e=!1;function sm(){if(e)return;e=!0,o("FlowGraphConstantBlock",rm)}sm();
export{rm,sm};

//# debugId=D6F6B07FA62CFBF764756E2164756E21
//# sourceMappingURL=site-cyztvmx6.js.map
