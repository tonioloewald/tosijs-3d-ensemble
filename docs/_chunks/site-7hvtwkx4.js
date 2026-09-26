import{He}from"./site-e2p70xxb.js";import{At}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class $m extends He{constructor(e){super(e);this.config=e;for(let n in this.config.eventData){let t=this.config.eventData[n],i=typeof t.type==="string"?t.type:t.type?.typeName,r=typeof t.type?.serialize==="function"?t.type:At(i);t.type=r,this.registerDataInput(n,r,t.value)}}_execute(e){let n=this.config.eventId,t={};for(let i of this.dataInputs)t[i.name]=i.getValue(e);e.configuration.coordinator.notifyCustomEvent(n,t),this.out._activateSignal(e)}serialize(e={}){super.serialize(e);let n={};for(let t in this.config.eventData){let i=this.config.eventData[t];if(n[t]={type:i.type.typeName},i.value!==void 0)n[t].value=i.value}e.config.eventData=n}getClassName(){return"FlowGraphSendCustomEventBlock"}}var a=!1;function Ym(){if(a)return;a=!0,o("FlowGraphSendCustomEventBlock",$m)}Ym();
export{$m,Ym};

//# debugId=87E06D9BE87180D164756E2164756E21
//# sourceMappingURL=site-7hvtwkx4.js.map
