import{zu as i}from"./site-s1smryc8.js";import{Pu as a,Ru as e,Su as l}from"./site-y0mephjk.js";import{lF as r}from"./site-54y5gp1n.js";class u extends i{constructor(t){super(t);this.sound=this.registerDataInput("sound",a),this.volume=this.registerDataInput("volume",e,1),this.startOffset=this.registerDataInput("startOffset",e,0),this.loop=this.registerDataInput("loop",l,!1)}_execute(t,g){let o=this.sound.getValue(t);if(!o){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let n=this.volume.getValue(t),h=this.startOffset.getValue(t),f=this.loop.getValue(t);o.play({volume:n,startOffset:h,loop:f}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function p(){if(s)return;s=!0,r("FlowGraphPlaySoundBlock",u)}p();
export{u as an,p as bn};

//# debugId=956F30B857EA496964756E2164756E21
//# sourceMappingURL=site-vsacmt28.js.map
