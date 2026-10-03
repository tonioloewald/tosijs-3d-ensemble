import{He}from"./site-x7zr027n.js";import{R}from"./site-0860aw80.js";import{o}from"./site-j9pt9hg9.js";class Zd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",R)}_execute(t,i){let r=this.sound.getValue(t);if(!r){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}r.stop(),this.out._activateSignal(t)}getClassName(){return"FlowGraphStopSoundBlock"}}var e=!1;function Kd(){if(e)return;e=!0,o("FlowGraphStopSoundBlock",Zd)}Kd();
export{Zd,Kd};

//# debugId=5820D6B4BA05D9D464756E2164756E21
//# sourceMappingURL=site-jnm0fndb.js.map
