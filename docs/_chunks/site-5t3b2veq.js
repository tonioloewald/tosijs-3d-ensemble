import{be}from"./site-3s1j98fr.js";import{A,ai}from"./site-2m9hnh4q.js";import{ge}from"./site-2t7svfbg.js";import{o}from"./site-ny31phz1.js";class jm extends be{constructor(e){super(e);this.config=e,this.object=this.registerDataInput("object",A),this.array=this.registerDataInput("array",A),this.index=this.registerDataOutput("index",ai,new ge(-1))}_updateOutputs(e){let i=this.object.getValue(e),t=this.array.getValue(e);if(t)this.index.setValue(new ge(t.indexOf(i)),e)}serialize(e){super.serialize(e)}getClassName(){return"FlowGraphIndexOfBlock"}}var r=!1;function Qm(){if(r)return;r=!0,o("FlowGraphIndexOfBlock",jm)}
export{jm,Qm};

//# debugId=E82C262109CEFB4E64756E2164756E21
//# sourceMappingURL=site-5t3b2veq.js.map
