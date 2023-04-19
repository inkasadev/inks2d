import { g } from './chunk-6LMX6XHW.js';

var r=class extends g{_resize=!1;constructor(...e){super(),this.add(...e);}get dynamicSize(){return this._resize}set dynamicSize(e){this._resize=e,e&&this.calculateSize();}calculateSize(){if(this.children.length>0){let e=0,t=0;this.children.forEach(i=>{i.position.x+i.width>e&&(e=i.position.x+i.width),i.position.y+i.height>t&&(t=i.position.y+i.height);}),this.width=e,this.height=t;}}addChild(e){super.addChild(e),this.calculateSize();}removeChild(e){let t=super.removeChild(e);return t&&this.calculateSize(),t}};var n=class extends r{constructor(e=0,t=0,i=32,p=32,m=!1,a=0,l=0,y,h){super();let f=e*t;for(let s=0;s<f;s++){let d=s%e*i,c=Math.floor(s/e)*p,o=y();this.addChild(o),m?(o.position.x=d+i/2+a,o.position.y=c+p/2+l):(o.position.x=d+a,o.position.y=c+l),h?.(o);}}};

export { r as a, n as b };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-7TAUG27C.js.map