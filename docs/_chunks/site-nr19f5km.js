import{Ye}from"./site-3s1j98fr.js";import{A,k,He}from"./site-2m9hnh4q.js";import{us}from"./site-tn6chfpn.js";import{o}from"./site-ny31phz1.js";class Um extends Ye{constructor(t){super(t);this.sound=this.registerDataInput("sound",A),this.volume=this.registerDataInput("volume",k,1),this.startOffset=this.registerDataInput("startOffset",k,0),this.loop=this.registerDataInput("loop",He,!1)}_execute(t,i){let e=us(t,this.sound.getValue(t));if(!e){this._reportError(t,"No sound provided"),this.out._activateSignal(t);return}let r=this.volume.getValue(t),a=this.startOffset.getValue(t),l=this.loop.getValue(t);e.play({volume:r,startOffset:a,loop:l}),this.out._activateSignal(t)}getClassName(){return"FlowGraphPlaySoundBlock"}}var s=!1;function Wm(){if(s)return;s=!0,o("FlowGraphPlaySoundBlock",Um)}
export{Um,Wm};

//# debugId=D334E28B189F4B6064756E2164756E21
//# sourceMappingURL=site-nr19f5km.js.map
