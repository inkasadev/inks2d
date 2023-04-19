import { g } from './chunk-6LMX6XHW.js';

var r=class extends g{_size;family="verdana";weight="normal";style="normal";align={v:"center",h:"center"};content;color;leading=0;constructor(t="Inks2D!",n=16,i="red"){super(),this._size=`${n}px`,this.content=t,this.color=i;}getProperties(){return `${this.style} ${this.weight} ${this._size} ${this.family}`}get size(){return parseInt(this._size)}set size(t){this._size=`${t}px`;}render(t){let n=this.align.v==="center"?"middle":this.align.v;t.font=this.getProperties(),t.strokeStyle=this.strokeStyle,t.lineWidth=this.lineWidth,t.fillStyle=this.color,t.textBaseline=n,t.textAlign=this.align.h,this.content=`${this.content}`;let i=this.content.split(`
`),s=Math.floor(t.measureText("M").width);this.height+=this.leading*(i.length-1),t.save(),t.translate(-this.width*this.pivot.x+this.width/2,-this.height*this.pivot.y+s/2),this.height=0;for(let e=0;e<i.length;e++){let h=i[e],l=Math.floor(t.measureText(h).width);l>this.width&&(this.width=l),this.height+=s+this.leading,t.fillText(h,0,e*(s+this.leading)),this.lineWidth!==0&&t.strokeText(h,0,e*(s+this.leading));}this.height-=this.leading,t.restore();}};

export { r as a };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-QQ527P2G.js.map