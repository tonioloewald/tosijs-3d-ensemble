import{zu as s}from"./site-s1smryc8.js";import{Pu as i}from"./site-y0mephjk.js";import{lF as e}from"./site-54y5gp1n.js";class u extends s{constructor(o){super(o);this.sound=this.registerDataInput("sound",i)}_execute(o,l){let t=this.sound.getValue(o);if(!t){this._reportError(o,"No sound provided"),this.out._activateSignal(o);return}t.stop(),this.out._activateSignal(o)}getClassName(){return"FlowGraphStopSoundBlock"}}var r=!1;function a(){if(r)return;r=!0,e("FlowGraphStopSoundBlock",u)}a();
export{u as cn,a as dn};

//# debugId=0FDEE708319D201E64756E2164756E21
//# sourceMappingURL=site-48gd9z8h.js.map
