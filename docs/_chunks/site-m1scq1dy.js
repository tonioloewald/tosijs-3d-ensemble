import{xu as s}from"./site-gx4ww0cp.js";import{Nu as i}from"./site-p0rrvqfa.js";import{jF as e}from"./site-6873nq4n.js";class u extends s{constructor(o){super(o);this.sound=this.registerDataInput("sound",i)}_execute(o,l){let t=this.sound.getValue(o);if(!t){this._reportError(o,"No sound provided"),this.out._activateSignal(o);return}t.stop(),this.out._activateSignal(o)}getClassName(){return"FlowGraphStopSoundBlock"}}var r=!1;function a(){if(r)return;r=!0,e("FlowGraphStopSoundBlock",u)}a();
export{u as an,a as bn};

//# debugId=3F49776D780362F164756E2164756E21
//# sourceMappingURL=site-m1scq1dy.js.map
