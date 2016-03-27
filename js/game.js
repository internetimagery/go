(function(){var t,e,n,r=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};n=function(t,e,n,r,s){return this.setAttribute("style","margin-left:"+t+"%;margin-top:"+e+"%;width:"+n+"%;height:"+r+"%;"+s)},e=function(t,e){var r;return r=document.createElement("div"),r.setAttribute("class",t),r.resize=n,e.appendChild(r),r},t=function(){function t(t,n){var r,s,i,o,u,a,h,l,c,p,d,f,g,m,v,_,y,w,b,z,A,k,x,M;if(this.size=n,this.callbacks=[],this.stone_class=["empty","stone set black","stone set white","empty-black","empty-white"],this.board_state=[],this.size<2)throw"Board size not big enough.";for(o=100/(this.size-1),M=.9*o,k=.2*M,a=e("grid",t),h=.6*M,l=100-2*h,a.resize(h,h,l,l,"position:relative;"),t.appendChild(a),b=u=0,m=this.size;m>=0?m>u:u>m;b=m>=0?++u:--u)e("line-horiz",a).setAttribute("style","top:"+b*o+"%;");for(s=c=0,v=this.size;v>=0?v>c:c>v;s=v>=0?++c:--c)e("line-vert",a).setAttribute("style","left:"+s*o+"%;");for(this.sockets=[],x=[],this.size%2===1&&(r=Math.floor(this.size/2),x.push([r,r])),7<(_=this.size)&&13>_&&(x.push([2,2]),x.push([2,this.size-3]),x.push([this.size-3,2]),x.push([this.size-3,this.size-3])),13<=this.size&&(x.push([3,3]),x.push([3,this.size-4]),x.push([this.size-4,3]),x.push([this.size-4,this.size-4])),s=p=0,y=this.size;y>=0?y>p:p>y;s=y>=0?++p:--p)for(i=function(t){return function(){var e;return e=t.sockets.length,z.onclick=function(n){return t.placement_event(e)}}}(this),b=d=0,w=this.size;w>=0?w>d:d>w;b=w>=0?++d:--d){for(g=0,f=x.length;f>g;g++)A=x[g],A[0]===b&&A[1]===s&&(A=e("star",a),A.resize(b*o-.5*k,s*o-.5*k,k,k,"position:absolute;"));z=e("empty",a),z.player=0,z.resize(b*o-.5*M,s*o-.5*M,M,M,"position:absolute;"),i(),this.sockets.push(z),this.board_state.push(0)}}return t.prototype.register=function(t){return this.callbacks.push(t)},t.prototype.placement_event=function(t){var e,n,r,s,i;for(s=this.callbacks,i=[],n=0,r=s.length;r>n;n++)e=s[n],i.push(e(t));return i},t.prototype.place=function(t,e){if(t>Math.pow(this.size,2))throw"Requested position not within board size.";return this.board_state[t]=e},t.prototype.dump_state=function(){return this.board_state.slice(0)},t.prototype.load_state=function(t){if(t.length!==Math.pow(this.size,2))throw"Invalid State Size";return this.board_state=t.slice(0)},t.prototype.update=function(t){var e,n,r,s;for(s=[],n=e=0,r=this.sockets.length;r>=0?r>e:e>r;n=r>=0?++e:--e)this.board_state[n]!==this.sockets[n].player&&(this.sockets[n].setAttribute("class",this.stone_class[this.board_state[n]]),this.sockets[n].player=this.board_state[n]),0===this.sockets[n].player?s.push(this.sockets[n].setAttribute("class",this.stone_class[t+2])):s.push(void 0);return s},t.prototype.get_player=function(t){if(t>Math.pow(this.size,2))throw"Requested position not within board size.";return this.board_state[t]},t.prototype.get_surroundings=function(t){var e,n,r;return r={},e=t-1,n=e%this.size,n!==this.size-1&&n>=0&&(r.left=e),e=t+1,n=e%this.size,0!==n&&n<=this.size&&(r.right=e),e=t-this.size,e>=0&&(r.up=e),e=t+this.size,e<Math.pow(this.size,2)&&(r.down=e),r},t.prototype.get_connected_stones=function(t){var e,n,s,i,o,u;for(s=[t],i=this.get_player(t),u=[t];u.length>0;){t=u.pop(),o=this.get_surroundings(t);for(e in o)n=o[e],this.get_player(n)===i&&r.call(s,n)<0&&(s.push(n),u.push(n))}return s},t.prototype.get_liberties=function(t){var e,n,s,i,o,u,a;for(o=[],s=0,i=t.length;i>s;s++){u=t[s],a=this.get_surroundings(u);for(e in a)n=a[e],0===this.get_player(n)&&r.call(o,n)<0&&o.push(n)}return o},t.prototype.is_surrounded=function(t){var e,n,r;return r=this.get_player(t),0!==r?(e=this.get_connected_stones(t),n=this.get_liberties(e),!(n.length>0)):!1},t}(),this.Board=t}).call(this),function(){var t,e,n;e=document.getElementById("container"),n=function(){var t,n,r;return r=window.innerWidth||document.body.clientWidth,t=window.innerHeight||document.body.clientHeight,n=Math.min(r,t),e.setAttribute("style","width:"+.8*n+"px;")},window.onresize=n,n(),t=function(){function t(t){var e,n,r,s;this.handle=t,this.wrapper=this.handle.parentNode,this.set_segment_count(1),e=0,n=!1,r=0,s=0,this.handle_pos=0,this.curr_pos=0,this.handle.onmousedown=function(t){return function(e){var i;return 1===e.buttons?(r=e.clientX,n=!0,i=t.wrapper.getBoundingClientRect().width,s=i?1/i:0):void 0}}(this),document.onmouseup=function(t){return function(e){return n=!1,t.handle_pos=t.curr_pos}}(this),document.onmousemove=function(t){return function(i){var o,u,a,h,l;return n&&1===i.buttons&&(u=(i.clientX-r)*s,t.curr_pos=t.handle_pos+u,t.curr_pos<=0&&(t.curr_pos=0),t.curr_pos>=1&&(t.curr_pos=1),t.handle.setAttribute("style","left:"+100*t.curr_pos+"%;"),t.segments&&(l=function(){var t,e,n,r;for(n=this.seg_range,r=[],t=0,e=n.length;e>t;t++)a=n[t],r.push(Math.abs(a-this.curr_pos));return r}.call(t),h=l.reduce(function(t,e){return Math.min(t,e)}),o=l.indexOf(h),e!==o))?(e=o,"function"==typeof t.callback?t.callback(e):void 0):void 0}}(this)}return t.prototype.set_segment_count=function(t){var e,n;return this.segments=t,e=1<this.segments?1/(this.segments-1):0,this.seg_range=function(){var t,r,s;for(s=[],n=t=0,r=this.segments;r>=0?r>t:t>r;n=r>=0?++t:--t)s.push(e*n);return s}.call(this)},t.prototype.set_pos=function(t){return null!=this.seg_range?(this.handle.setAttribute("style","left:"+100*this.seg_range[t]+"%;"),this.handle_pos=this.seg_range[t],this.curr_pos=this.handle_pos):void 0},t}(),this.Slider=t}.call(this),function(){var t,e,n,r,s,i,o;o=function(){var t;return t=document.getElementById("short-link"),t.href="https://tinyurl.com/api-create.php?url="+encodeURIComponent(window.location.href)},n=function(t){var e,n,r,s;for(n=[document.getElementById("player-black"),document.getElementById("player-white")],r=0,s=n.length;s>r;r++)e=n[r],e.setAttribute("style","");return n[t].setAttribute("style","box-shadow: 0px 0px 3px 3px yellow;")},t=function(){function t(t,e,n){this.player=t,this.state=e,this.url=n}return t}(),e=function(t,e){var n,r,s,i;if(0!==e.get_player(t)){for(n=e.get_connected_stones(t),i=[],r=0,s=n.length;s>r;r++)t=n[r],i.push(e.place(t,0));return i}},i=function(t,n,r){var s,i,o,u;if(o=r.dump_state(),null===n)return o;r.place(n,t),i=r.get_surroundings(n);for(s in i)u=i[s],r.get_player(u)!==t&&r.is_surrounded(u)&&e(u,r);return r.is_surrounded(n)&&r.place(n,0),r.dump_state()},s=function(t,n,r,s){var i,o,u,a,h,l,c,p,d;if(null===n)return r.dump_state();if(0!==r.get_player(n))throw"Illegal Move: Space occupied.";r.place(n,t),i=!1,c=r.get_surroundings(n);for(o in c)d=c[o],r.get_player(d)!==t&&r.is_surrounded(d)&&(e(d,r),i=!0);if(l=r.dump_state(),i&&s){for(h=!0,u=a=0,p=l.length;p>=0?p>a:a>p;u=p>=0?++a:--a)if(l[u]!==s[u]){h=!1;break}if(h)throw"Illegal Move: Ko."}if(r.is_surrounded(n))throw"Illegal Move: Suicide.";return l},r=function(){var e,r,u,a,h,l,c,p,d,f,g,m,v,_,y,w,b,z,A,k,x,M,I;for(u=new Game_Data,a=[],I=window.location.href.split("#"),2===I.length&&I[1]?(console.log("!! LOADING GAME !!"),u.read_id(decodeURIComponent(I[1]))):(console.log("!! NEW GAME !!"),history.replaceState(0,"start",I[0]+"#"+u.write_id()),o()),k=new Slider(document.getElementById("slider-handle")),e=new Board(document.getElementById("board"),u.board_size),y=document.getElementById("pass"),w=u.moves,h=0,p=w.length;p>h;h++){if(v=w[h],null===v)x=0===a.length?e.dump_state():a[a.length-2];else if(Array.isArray(v)){for(b=v[0]||[],l=0,d=b.length;d>l;l++)m=b[l],e.place(m,1);for(z=v[1]||[],c=0,f=z.length;f>c;c++)m=z[c],e.place(m,2);for(A=v[2]||[],_=0,g=A.length;g>_;_++)m=A[_],e.place(m,0);x=e.dump_state()}else x=i(a.length%2+1,v,e);u.current=a.length+1,M=I[0]+"#"+u.write_id(),a.push(new t(a.length%2,x,M)),window.document.title="Move "+a.length,o()}return e.update(a.length%2+1),n(a.length%2),k.set_segment_count(a.length),k.set_pos(a.length-1),e.register(function(r){var i,h,l,c,p;if(u.current!==a.length)return alert("Cannot add move. The game has progressed past this point.");i=0===a.length?e.dump_state():a[a.length-1];try{return i=s(u.current%2+1,r,e,a[a.length-2]),u.current=a.length+1,h=new t(u.current%2,i,I[0]+"#"+u.write_id()),a.push(h),k.set_segment_count(a.length),k.set_pos(a.length-1),u.add_move(r),window.location.replace(h.url),e.load_state(i),p=u.current%2,e.update(p+1),window.document.title="Move "+a.length,n(p),o()}catch(c){return l=c,e.load_state(i),alert(l)}}),y.onclick=function(t){return e.placement_event(null)},document.addEventListener("keypress",function(t){return"p"===t.key?e.placement_event(null):void 0}),k.callback=function(t){var r;return v=t+1,console.log("Viewing move "+v+"."),u.current=v,r=a[t],e.load_state(r.state),e.update(r.player+1),window.document.title="Move "+v,window.location.replace(r.url),n(r.player),o()},r=document.getElementById("dropzone"),r.addEventListener("dragover",function(t){return t.stopPropagation(),t.preventDefault(),t.dataTransfer.dropEffect="copy"}),r.addEventListener("drop",function(t){var e,n;return t.stopPropagation(),t.preventDefault(),e=t.dataTransfer.files,e[0]?(n=new FileReader,n.onload=function(t){var e,n,r;e=t.target.result;try{return u.load_sgf(e),window.location.assign(I[0]+"#"+u.write_id()),location.reload(!0)}catch(r){return n=r,alert("There was a problem loading the SGF."),console.error(n)}},n.readAsText(e[0])):void 0})},this.main=r}.call(this),function(){var t,e,n,r,s,i;i=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],s=function(t){var e,n,r,s,i,o,u;for(u=[],r=0,i=t.length;i>r;r++)for(e=t[r],s=0,o=e.length;o>s;s++)n=e[s],u.push(n);return u},r=function(t){var e,n,r,s,o,u,a,h,l,c,p;if(5===t.length&&":"===t[2]){for(e=[i.indexOf(t[0]),i.indexOf(t[3])],c=[i.indexOf(t[1]),i.indexOf(t[4])],o=[],n=r=u=e[0],a=e[1];a>=u?a>=r:r>=a;n=a>=u?++r:--r)for(p=s=h=c[0],l=c[1];l>=h?l>=s:s>=l;p=l>=h?++s:--s)o.push(""+i[n]+i[p]);return o}return[t]},e=function(t,e){var n,r;if("[]"===t)return null;if(r=i.indexOf(t[0])*e,n=i.indexOf(t[1]),-1===r||-1===n)throw"Bad Move "+t+".";return r+n},n=function(t,e){var n,r;return null===t?"[]":(r=i[Math.floor(t/e)],n=i[t%e],r.concat(n))},t=function(){function t(){this.mode=0,this.board_size=9,this.moves=[],this.current=0}return t.prototype.add_move=function(t){if(null!==t&&t>Math.pow(this.board_size,2))throw"Move is too large to fit on the board";return this.moves.push(t)},t.prototype.write_id=function(){var t,e,r,s,i,o,u,a,h,l;for(r=this.board_size,l=("00"+r).slice(-2),u=[],s=i=0,h=this.current;h>=0?h>i:i>h;s=h>=0?++i:--i)o=this.moves[s],Array.isArray(o)?(a=function(){var s,i,u;for(u=[],s=0,i=o.length;i>s;s++)t=o[s],u.push(function(){var s,i,o;for(o=[],s=0,i=t.length;i>s;s++)e=t[s],o.push(n(e,r));return o}().join(""));return u}(),u.push("("+a.join(n(null,r))+")")):u.push(n(o,r));return this.mode+l+u.join("")},t.prototype.read_id=function(t){var n,r,s,o,u,a,h,l,c,p,d,f,g,m,v,_;if(t.length>=3){if(console.log("Validating game data..."),c=parseInt(t[0]),isNaN(c))throw"Invalid Game Mode";if(n=parseInt(t.slice(1,3)),isNaN(n)||3>n||n>i.length)throw"Invalid Board Size. Sizes must be between 3 and "+i.length+".";if(_=t.slice(3),_.length%2!==0)throw"Possible corrupt game data...";for(_.length/2>973&&console.warn("Turn limit of 973 exceeded. Urls may not work on some browsers."),s=Math.pow(n,2),p=[],r=[],d=[],f=[],g=!1,o=h=0,m=_.length;m>=0?m>h:h>m;o=m>=0?++h:--h)if("("===_[o])g=!0,d=[],f=[];else if(")"===_[o]){for(g=!1,d.push(f),a=l=0,v=3-d.length;v>=0?v>l:l>v;a=v>=0?++l:--l)d.push([]);p.push(d)}else if(r.push(_[o]),2===r.length){if(u=e(r.join(""),n),r=[],isNaN(u)||null!==u&&u>s)throw"Invalid Turn @ "+p.length+".";g?null===u?(d.push(f),f=[]):f.push(u):p.push(u)}return this.mode=c,this.board_size=n,this.moves=p,this.current=p.length,console.log("Valid!")}},t.prototype.load_sgf=function(t){var n,i,o,u,a,h,l,c,p,d,f,g,m,v,_,y;if(l=smartgamer(sgf_parse(t)),p=l.getGameInfo(),a=["B","W"],"1"!==p.GM)throw"Game file is not a game of GO.";for(g="0",u=parseInt(p.SZ),v=[],l.first(),c=d=0,y=l.totalMoves();y>=0?y>=d:d>=y;c=y>=0?++d:--d)_=l.node(),(_.AB||_.AW||_.AE)&&(n=s(function(){var t,e,n,s;for(n=Array.concat(_.AB||[]),s=[],t=0,e=n.length;e>t;t++)f=n[t],s.push(r(f));return s}()),o=s(function(){var t,e,n,s;for(n=Array.concat(_.AW||[]),s=[],t=0,e=n.length;e>t;t++)f=n[t],s.push(r(f));return s}()),i=s(function(){var t,e,n,s;for(n=Array.concat(_.AE||[]),s=[],t=0,e=n.length;e>t;t++)f=n[t],s.push(r(f));return s}()),h=[function(){var t,r,s;for(s=[],t=0,r=n.length;r>t;t++)f=n[t],s.push(e(f,u));return s}(),function(){var t,n,r;for(r=[],t=0,n=o.length;n>t;t++)f=o[t],r.push(e(f,u));return r}(),function(){var t,n,r;for(r=[],t=0,n=i.length;n>t;t++)f=i[t],r.push(e(f,u));return r}()],v.push(h)),(_.W||_.B)&&(m=_[a[v.length%2]],m||(v.push(null),m=_[a[v.length%2]]),"[tt]"===m&&(m="[]"),v.push(e(m,u))),l.next();return this.mode=g,this.board_size=u,this.moves=v,this.current=v.length},t}(),this.Game_Data=t}.call(this),function(){this.sgf_parse=function(t){"use strict";var e,n,r,s,i,o;return s=void 0,i=void 0,e={},o=void 0,r=void 0,n=void 0,i={beginSequence:function(t){var n,r;return n="sequences",o||(o=e,n="gameTrees"),o.gameTrees&&(n="gameTrees"),r={parent:o},o[n]=o[n]||[],o[n].push(r),o=r,s(t.substring(1))},endSequence:function(t){return o=o.parent?o.parent:null,s(t.substring(1))},node:function(t){return r={},o.nodes=o.nodes||[],o.nodes.push(r),s(t.substring(1))},property:function(t){var e,i,o,u,a;if(o=void 0,e=t.match(/([^\\\]]|\\(.|\n|\r))*\]/),!e.length)throw new Error("malformed sgf");return e=e[0].length,a=t.substring(0,e),u=a.indexOf("["),i=a.substring(0,u),i||(i=n,Array.isArray(r[i])||(r[i]=[r[i]])),n=i,o=a.substring(u+1,a.length-1),i.length>2&&console.warn("SGF PropIdents should be no longer than two characters:",i),Array.isArray(r[i])?r[i].push(o):r[i]=o,s(t.substring(e))},unrecognized:function(t){return s(t.substring(1))}},(s=function(t){var n,r;return n=t.substring(0,1),r=void 0,n?(r="("===n?"beginSequence":")"===n?"endSequence":";"===n?"node":-1!==n.search(/[A-Z\[]/)?"property":"unrecognized",i[r](t)):e})(t)},this.generate=function(t){var e;return(e=function(t){var n;return n="",t.forEach(function(t){n+="(",t.nodes&&t.nodes.forEach(function(t){var e,r,s;e=";";for(s in t)t.hasOwnProperty(s)&&(r=t[s],Array.isArray(r)&&(r=r.join("][")),e+=s+"["+r+"]");n+=e}),t.sequences&&(n+=e(t.sequences)),n+=")"}),n})(t.gameTrees)}}.call(this),function(){this.smartgamer=function(t){"use strict";var e,n,r;return r=void 0,n=void 0,e=function(){this.init()},e.prototype={init:function(){t&&(this.game=t.gameTrees[0],this.reset())},load:function(e){t=e,this.init()},games:function(){return t.gameTrees},selectGame:function(e){if(!(e<t.gameTrees.length))throw new Error("the collection doesn't contain that many games");return this.game=t.gameTrees[e],this.reset(),this},reset:function(){return r=this.game,n=r.nodes[0],this.path={m:0},this},getSmartgame:function(){return t},variations:function(){var t,e;return r&&(e=r.nodes,t=e?e.indexOf(n):null,e)?t===e.length-1?r.sequences||[]:[]:void 0},next:function(t){var e,s;if(t=t||0,s=r.nodes,e=s?s.indexOf(n):null,null===e||e>=s.length-1){if(!r.sequences)return this;r=r.sequences[t]?r.sequences[t]:r.sequences[0],n=r.nodes[0],this.path[this.path.m]=t,this.path.m+=1}else n=s[e+1],this.path.m+=1;return this},previous:function(){var t,e;if(e=r.nodes,t=e?e.indexOf(n):null,delete this.path[this.path.m],t&&0!==t)n=e[t-1],this.path.m-=1;else{if(!r.parent||r.parent.gameTrees)return this;r=r.parent,r.nodes?(n=r.nodes[r.nodes.length-1],this.path.m-=1):n=null}return this},last:function(){var t;for(t=this.totalMoves();this.path.m<t;)this.next();return this},first:function(){return this.reset(),this},goTo:function(t){var e,r,s;for("string"==typeof t?t=this.pathTransform(t,"object"):"number"==typeof t&&(t={m:t}),this.reset(),r=n,e=0;e<t.m&&r;)s=t[e]||0,r=this.next(s),e+=1;return this},getGameInfo:function(){return this.game.nodes[0]},node:function(){return n},totalMoves:function(){var t,e;for(t=this.game,e=0;t;)e+=t.nodes.length,t=t.sequences?t.sequences[0]:null;return e-1},comment:function(t){return"undefined"==typeof t?n.C?n.C.replace(/\\([\\:\]])/g,"$1"):"":void(n.C=t.replace(/[\\:\]]/g,"\\$&"))},translateCoordinates:function(t){var e,n;return e="abcdefghijklmnopqrst",n=[],n[0]=e.indexOf(t.substring(0,1)),n[1]=e.indexOf(t.substring(1,2)),n},pathTransform:function(t,e,n){var r,s,i;return r=void 0,i=function(t){var e,s;if("string"==typeof t)return t;if(!t)return"";r=t.m,s=[];for(e in t)t.hasOwnProperty(e)&&"m"!==e&&t[e]>0&&(n?s.push(", variation "+t[e]+" at move "+e):s.push("-"+e+":"+t[e]));return r+=s.join("")},s=function(t){var e;return"object"==typeof t&&(t=i(t)),t?(e=t.split("-"),r={m:Number(e.shift())},e.length&&e.forEach(function(t,e){t=t.split(":"),r[Number(t[0])]=t[1]}),r):{m:0}},"undefined"==typeof e&&(e="string"==typeof t?"object":"string"),r="string"===e?i(t):"object"===e?s(t):void 0}},new e}}.call(this);