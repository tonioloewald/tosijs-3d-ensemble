import{xu as i}from"./site-gx4ww0cp.js";import{Nu as a,Pu as e,Qu as l}from"./site-p0rrvqfa.js";import{jF as r}from"./site-6873nq4n.js";class u extends i{constructor(t){super(t);this.sound=this.registerDataInput("sound",a),this.volume=this.registerDataInput("volume",e,1),this.startOffset=this.registerDataInput("startOffset",e,0),this.loop=this.registerDataInput("loop",l,!1)}_execute(t,g){let o=this.sound.getValue(t);if(!o){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let n=this.volume.getValue(t),h=this.startOffset.getValue(t),f=this.loop.getValue(t);o.play({volume:n,startOffset:h,loop:f}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function p(){if(s)return;s=!0,r("FlowGraphPlaySoundBlock",u)}p();
export{u as _m,p as $m};

//# debugId=4F132E68284AF15864756E2164756E21
//# sourceMappingURL=site-1cnq0h6g.js.map
