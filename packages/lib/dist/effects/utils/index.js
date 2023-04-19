import '../../chunk-SI7AN355.js';
import { a as a$2 } from '../../chunk-R2FKUAS3.js';
import { c, a, b } from '../../chunk-LBFLB5D3.js';
import '../../chunk-RM5BZPL6.js';
import '../../chunk-YI57HGPY.js';
import '../../chunk-7TAUG27C.js';
import '../../chunk-BW6TL2PK.js';
import '../../chunk-GJBY4KIL.js';
import '../../chunk-6LMX6XHW.js';
import { a as a$1, c as c$1 } from '../../chunk-JXTEU5XG.js';

var y=(e,a$1,r=a.Linear.None,i=b.Linear)=>{let o=new c;return o.onUpdate=n=>{e.alpha=n.alpha;},o.from({alpha:e.alpha}).to({alpha:1}).duration(a$1).easing(r).interpolation(i).start(),o},N=(e,a$1,r=a.Linear.None,i=b.Linear)=>{let o=new c;return o.onUpdate=n=>{e.alpha=n.alpha;},o.from({alpha:e.alpha}).to({alpha:0}).duration(a$1).easing(r).interpolation(i).start(),o},x=(e,a$1,r,i=a.Linear.None,o=b.Linear)=>{let n=new c;return n.onUpdate=p=>{e.alpha=p.alpha;},n.from({alpha:e.alpha}).to({alpha:a$1}).duration(r).yoyo(!0).easing(i).interpolation(o).start(),n},L=(e,a$2,r,i=a.Linear.None,o=b.Linear)=>{let n=new c;return n.onUpdate=p=>{e.position=new a$1(p.x,p.y);},n.from({x:e.position.x,y:e.position.y}).to(a$2).duration(r).easing(i).interpolation(o).start(),n},g=(e,a$1,r=!0,i=a.Linear.None,o=b.Linear)=>{let n=new c;return n.onUpdate=p=>{e.visible=!!Math.round(p.updateVisible);},n.from({updateVisible:0}).to({updateVisible:1}).duration(a$1).yoyo(r).easing(i).interpolation(o).start(),n},v=(e,a=0,r=1,i="sine",o=1,n=1,p=0,d=0)=>{let t=new a$2("");t.oscillatorNode.connect(t.volumeNode),t.volumeNode.connect(t.panNode),t.panNode.connect(t.audioContextDestination),t.volume=o,t.pan=n,t.oscillatorNode.type=i,d>0&&(e=c$1(e-d/2,e+d/2)),t.oscillatorNode.frequency.value=e,a>0&&t.fadeIn(t.volume,p),r>0&&t.fadeOut(t.volume,p),t.oscillatorNode.start(p);};

export { g as blink, y as fadeIn, N as fadeOut, v as playSfx, x as pulse, L as slide };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map