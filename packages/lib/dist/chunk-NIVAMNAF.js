import { a, b, c, d, g } from './chunk-6LMX6XHW.js';

var n=class extends g{_graphics;constructor(t,e,i){super(),this.width=e,this.height=i,this._graphics=t.getContext("2d");}get graphics(){return this._graphics}updateChildren(t){for(let e=t.length-1;e>=0;e--){let i=t[e];if(i.update&&i.update(),i.children&&i.children.length>0){this.updateChildren(i.children);continue}}}update(){this.updateChildren(this.children);}};var o=class{_engine;_helpers={};start(t){let e=t.getViewportSize();this._engine=t,this._helpers.stage=new n(this._engine.canvas,e.width,e.height);}get stage(){return this._helpers.stage}update(){this.stage.update();}destroy(){a.length=0,b.length=0,c.length=0,d.length=0;}};

export { o as a };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-NIVAMNAF.js.map