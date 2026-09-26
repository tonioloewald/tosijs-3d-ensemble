import{He}from"./site-e2p70xxb.js";import{A,N,Ye}from"./site-pb29jqm8.js";import{o}from"./site-jv0cbgr5.js";class Hd extends He{constructor(t){super(t);this.sound=this.registerDataInput("sound",A),this.volume=this.registerDataInput("volume",N,1),this.startOffset=this.registerDataInput("startOffset",N,0),this.loop=this.registerDataInput("loop",Ye,!1)}_execute(t,i){let e=this.sound.getValue(t);if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function Xd(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Hd)}Xd();
export{Hd,Xd};

//# debugId=CF24B891813415CF64756E2164756E21
//# sourceMappingURL=site-5ma5mhap.js.map
