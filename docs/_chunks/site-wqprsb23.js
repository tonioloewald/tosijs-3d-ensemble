import{Ye}from"./site-3s1j98fr.js";import{A}from"./site-2m9hnh4q.js";import{us}from"./site-tn6chfpn.js";import{o}from"./site-ny31phz1.js";class $m extends Ye{constructor(e){super(e);this.sound=this.registerDataInput("sound",A)}_execute(e,s){let t=us(e,this.sound.getValue(e));if(!t){this._reportError(e,"No sound provided"),this.out._activateSignal(e);return}if(t.state===5)t.resume();else if(t.state===2||t.state===3)t.pause();this.out._activateSignal(e)}getClassName(){return"FlowGraphPauseSoundBlock"}}var r=!1;function Ym(){if(r)return;r=!0,o("FlowGraphPauseSoundBlock",$m)}
export{$m,Ym};

//# debugId=F765286DAFB6098464756E2164756E21
//# sourceMappingURL=site-wqprsb23.js.map
