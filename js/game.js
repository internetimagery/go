(function(){var t,e,n,r=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};n=function(t,e,n,r,i){return this.setAttribute("style","margin-left:"+t+"%;margin-top:"+e+"%;width:"+n+"%;height:"+r+"%;"+i)},e=function(t,e){var r;return r=document.createElement("div"),r.setAttribute("class",t),r.resize=n,e.appendChild(r),r},t=function(){function t(t,n){var r,i,s,o,a,u,h,l,c,d,f,p,g,m,v,y,_,w,b,z,A,M,x,I;if(this.size=n,this.callbacks=[],this.stone_class=["empty","stone set black","stone set white","empty-black","empty-white"],this.board_state=[],this.size<2)throw"Board size not big enough.";for(o=100/(this.size-1),I=.9*o,M=.2*I,u=e("grid",t),h=.6*I,l=100-2*h,u.resize(h,h,l,l,"position:relative;"),t.appendChild(u),b=a=0,m=this.size;m>=0?m>a:a>m;b=m>=0?++a:--a)e("line-horiz",u).setAttribute("style","top:"+b*o+"%;");for(i=c=0,v=this.size;v>=0?v>c:c>v;i=v>=0?++c:--c)e("line-vert",u).setAttribute("style","left:"+i*o+"%;");for(this.sockets=[],x=[],this.size%2===1&&(r=Math.floor(this.size/2),x.push([r,r])),7<(y=this.size)&&13>y&&(x.push([2,2]),x.push([2,this.size-3]),x.push([this.size-3,2]),x.push([this.size-3,this.size-3])),13<=this.size&&(x.push([3,3]),x.push([3,this.size-4]),x.push([this.size-4,3]),x.push([this.size-4,this.size-4])),i=d=0,_=this.size;_>=0?_>d:d>_;i=_>=0?++d:--d)for(s=function(t){return function(){var e;return e=t.sockets.length,z.onclick=function(n){return t.placement_event(e)}}}(this),b=f=0,w=this.size;w>=0?w>f:f>w;b=w>=0?++f:--f){for(g=0,p=x.length;p>g;g++)A=x[g],A[0]===b&&A[1]===i&&(A=e("star",u),A.resize(b*o-.5*M,i*o-.5*M,M,M,"position:absolute;"));z=e("empty",u),z.player=0,z.resize(b*o-.5*I,i*o-.5*I,I,I,"position:absolute;"),s(),this.sockets.push(z),this.board_state.push(0)}}return t.prototype.register=function(t){return this.callbacks.push(t)},t.prototype.placement_event=function(t){var e,n,r,i,s;for(i=this.callbacks,s=[],n=0,r=i.length;r>n;n++)e=i[n],s.push(e(t));return s},t.prototype.place=function(t,e){if(t>Math.pow(this.size,2))throw"Requested position not within board size.";return this.board_state[t]=e},t.prototype.dump_state=function(){return this.board_state.slice(0)},t.prototype.load_state=function(t){if(t.length!==Math.pow(this.size,2))throw"Invalid State Size";return this.board_state=t.slice(0)},t.prototype.update=function(t){var e,n,r,i;for(i=[],n=e=0,r=this.sockets.length;r>=0?r>e:e>r;n=r>=0?++e:--e)this.board_state[n]!==this.sockets[n].player&&(this.sockets[n].setAttribute("class",this.stone_class[this.board_state[n]]),this.sockets[n].player=this.board_state[n]),0===this.sockets[n].player?i.push(this.sockets[n].setAttribute("class",this.stone_class[t+2])):i.push(void 0);return i},t.prototype.get_player=function(t){if(t>Math.pow(this.size,2))throw"Requested position not within board size.";return this.board_state[t]},t.prototype.get_surroundings=function(t){var e,n,r;return r={},e=t-1,n=e%this.size,n!==this.size-1&&n>=0&&(r.left=e),e=t+1,n=e%this.size,0!==n&&n<=this.size&&(r.right=e),e=t-this.size,e>=0&&(r.up=e),e=t+this.size,e<Math.pow(this.size,2)&&(r.down=e),r},t.prototype.get_connected_stones=function(t){var e,n,i,s,o,a;for(i=[t],s=this.get_player(t),a=[t];a.length>0;){t=a.pop(),o=this.get_surroundings(t);for(e in o)n=o[e],this.get_player(n)===s&&r.call(i,n)<0&&(i.push(n),a.push(n))}return i},t.prototype.get_liberties=function(t){var e,n,i,s,o,a,u;for(o=[],i=0,s=t.length;s>i;i++){a=t[i],u=this.get_surroundings(a);for(e in u)n=u[e],0===this.get_player(n)&&r.call(o,n)<0&&o.push(n)}return o},t.prototype.is_surrounded=function(t){var e,n,r;return r=this.get_player(t),0!==r?(e=this.get_connected_stones(t),n=this.get_liberties(e),!(n.length>0)):!1},t}(),this.Board=t}).call(this),function(){var t,e;t=document.getElementById("container"),e=function(){var e,n,r;return r=window.innerWidth||document.body.clientWidth,e=window.innerHeight||document.body.clientHeight,n=Math.min(r,e),t.setAttribute("style","width:"+.9*n+"px;"),console.log(e)},window.onresize=e,e()}.call(this),function(){var t,e,n,r,i,s;s=function(){var t;return t=document.getElementById("short-link"),t.href="https://tinyurl.com/api-create.php?url="+encodeURIComponent(window.location.href)},e=function(t){var e,n,r,i;for(n=[document.getElementById("player-black"),document.getElementById("player-white")],r=0,i=n.length;i>r;r++)e=n[r],e.setAttribute("style","");return n[t].setAttribute("style","box-shadow: 0px 0px 3px 3px yellow;")},t=function(t,e){var n,r,i,s;if(0!==e.get_player(t)){for(n=e.get_connected_stones(t),s=[],r=0,i=n.length;i>r;r++)t=n[r],s.push(e.place(t,0));return s}},i=function(e,n,r){var i,s,o,a;if(o=r.dump_state(),null===n)return o;r.place(n,e),s=r.get_surroundings(n);for(i in s)a=s[i],r.get_player(a)!==e&&r.is_surrounded(a)&&t(a,r);return r.is_surrounded(n)&&r.place(n,0),r.dump_state()},r=function(e,n,r,i){var s,o,a,u,h,l,c,d,f;if(null===n)return r.dump_state();if(0!==r.get_player(n))throw"Illegal Move: Space occupied.";r.place(n,e),s=!1,c=r.get_surroundings(n);for(o in c)f=c[o],r.get_player(f)!==e&&r.is_surrounded(f)&&(t(f,r),s=!0);if(l=r.dump_state(),s&&i){for(h=!0,a=u=0,d=l.length;d>=0?d>u:u>d;a=d>=0?++u:--u)if(l[a]!==i[a]){h=!1;break}if(h)throw"Illegal Move: Ko."}if(r.is_surrounded(n))throw"Illegal Move: Suicide.";return l},n=function(){var t,n,o,a,u,h,l,c,d,f,p,g,m,v,y,_,w,b,z,A,M,x;for(o=new Game_Data,a=[],x=window.location.href.split("#"),2===x.length&&x[1]?(console.log("!! LOADING GAME !!"),o.read_id(decodeURIComponent(x[1]))):(console.log("!! NEW GAME !!"),history.replaceState(0,"start",x[0]+"#"+o.write_id()),s()),t=new Board(document.getElementById("board"),o.board_size),y=document.getElementById("pass"),_=o.moves,u=0,c=_.length;c>u;u++){if(m=_[u],null===m)A=0===a.length?t.dump_state():a[a.length-2];else if(Array.isArray(m)){for(w=m[0]||[],h=0,d=w.length;d>h;h++)g=w[h],t.place(g,1);for(b=m[1]||[],l=0,f=b.length;f>l;l++)g=b[l],t.place(g,2);for(z=m[2]||[],v=0,p=z.length;p>v;v++)g=z[v],t.place(g,0);A=t.dump_state()}else A=i(a.length%2+1,m,t);a.push(A),window.document.title="Move "+a.length,o.current=a.length,M=x[0]+"#"+o.write_id(),0===o.current?history.replaceState(a.length,"Start",M):history.pushState(a.length,"Move "+o.current,M),s()}return t.update(a.length%2+1),e(a.length%2),t.register(function(n){var i,u,h,l;if(o.current!==a.length)return alert("Cannot add move. The game has progressed past this point.");i=0===a.length?t.dump_state():a[a.length-1];try{return i=r(o.current%2+1,n,t,a[a.length-2]),a.push(i),o.current=a.length,o.add_move(n),history.pushState(a.length,"Move "+a.length,x[0]+"#"+o.write_id()),t.load_state(i),l=o.current%2,t.update(l+1),window.document.title="Move "+a.length,e(l),s()}catch(h){return u=h,t.load_state(i),alert(u)}}),y.onclick=function(e){return t.placement_event(null)},document.addEventListener("keypress",function(e){return"p"===e.key?t.placement_event(null):void 0}),window.addEventListener("popstate",function(n){if(m=parseInt(n.state),isNaN(m))throw"Invalid game state!";return console.log("Loaded game state "+m+"."),o.current=m,t.load_state(a[m-1]),t.update(m%2+1),window.document.title="Move "+m,e(m%2),s()}),n=document.getElementById("dropzone"),n.addEventListener("dragover",function(t){return t.stopPropagation(),t.preventDefault(),t.dataTransfer.dropEffect="copy"}),n.addEventListener("drop",function(t){var e,n;return t.stopPropagation(),t.preventDefault(),e=t.dataTransfer.files,e[0]?(n=new FileReader,n.onload=function(t){var e,n,r;e=t.target.result;try{return o.load_sgf(e),window.location.assign(x[0]+"#"+o.write_id()),location.reload(!0)}catch(r){return n=r,alert("There was a problem loading the SGF."),console.error(n)}},n.readAsText(e[0])):void 0})},this.main=n}.call(this),function(){var t,e,n,r,i,s;s=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],i=function(t){var e,n,r,i,s,o,a;for(a=[],r=0,s=t.length;s>r;r++)for(e=t[r],i=0,o=e.length;o>i;i++)n=e[i],a.push(n);return a},r=function(t){var e,n,r,i,o,a,u,h,l,c,d;if(5===t.length&&":"===t[2]){for(e=[s.indexOf(t[0]),s.indexOf(t[3])],c=[s.indexOf(t[1]),s.indexOf(t[4])],o=[],n=r=a=e[0],u=e[1];u>=a?u>=r:r>=u;n=u>=a?++r:--r)for(d=i=h=c[0],l=c[1];l>=h?l>=i:i>=l;d=l>=h?++i:--i)o.push(""+s[n]+s[d]);return o}return[t]},e=function(t,e){var n,r;if("[]"===t)return null;if(r=s.indexOf(t[0])*e,n=s.indexOf(t[1]),-1===r||-1===n)throw"Bad Move "+t+".";return r+n},n=function(t,e){var n,r;return null===t?"[]":(r=s[Math.floor(t/e)],n=s[t%e],r.concat(n))},t=function(){function t(){this.mode=0,this.board_size=9,this.moves=[],this.current=0}return t.prototype.add_move=function(t){if(null!==t&&t>Math.pow(this.board_size,2))throw"Move is too large to fit on the board";return this.moves.push(t)},t.prototype.write_id=function(){var t,e,r,i,s,o,a,u,h,l;for(r=this.board_size,l=("00"+r).slice(-2),a=[],i=s=0,h=this.current;h>=0?h>s:s>h;i=h>=0?++s:--s)o=this.moves[i],Array.isArray(o)?(u=function(){var i,s,a;for(a=[],i=0,s=o.length;s>i;i++)t=o[i],a.push(function(){var i,s,o;for(o=[],i=0,s=t.length;s>i;i++)e=t[i],o.push(n(e,r));return o}().join(""));return a}(),a.push("("+u.join(n(null,r))+")")):a.push(n(o,r));return this.mode+l+a.join("")},t.prototype.read_id=function(t){var n,r,i,o,a,u,h,l,c,d,f,p,g,m,v,y;if(t.length>=3){if(console.log("Validating game data..."),c=parseInt(t[0]),isNaN(c))throw"Invalid Game Mode";if(n=parseInt(t.slice(1,3)),isNaN(n)||3>n||n>s.length)throw"Invalid Board Size. Sizes must be between 3 and "+s.length+".";if(y=t.slice(3),y.length%2!==0)throw"Possible corrupt game data...";for(y.length/2>973&&console.warn("Turn limit of 973 exceeded. Urls may not work on some browsers."),i=Math.pow(n,2),d=[],r=[],f=[],p=[],g=!1,o=h=0,m=y.length;m>=0?m>h:h>m;o=m>=0?++h:--h)if("("===y[o])g=!0,f=[],p=[];else if(")"===y[o]){for(g=!1,f.push(p),u=l=0,v=3-f.length;v>=0?v>l:l>v;u=v>=0?++l:--l)f.push([]);d.push(f)}else if(r.push(y[o]),2===r.length){if(a=e(r.join(""),n),r=[],isNaN(a)||null!==a&&a>i)throw"Invalid Turn @ "+d.length+".";g?null===a?(f.push(p),p=[]):p.push(a):d.push(a)}return this.mode=c,this.board_size=n,this.moves=d,this.current=d.length,console.log("Valid!")}},t.prototype.load_sgf=function(t){var n,s,o,a,u,h,l,c,d,f,p,g,m,v,y,_;if(l=smartgamer(sgf_parse(t)),d=l.getGameInfo(),u=["B","W"],"1"!==d.GM)throw"Game file is not a game of GO.";for(g="0",a=parseInt(d.SZ),v=[],l.first(),c=f=0,_=l.totalMoves();_>=0?_>=f:f>=_;c=_>=0?++f:--f)y=l.node(),(y.AB||y.AW||y.AE)&&(n=i(function(){var t,e,n,i;for(n=Array.concat(y.AB||[]),i=[],t=0,e=n.length;e>t;t++)p=n[t],i.push(r(p));return i}()),o=i(function(){var t,e,n,i;for(n=Array.concat(y.AW||[]),i=[],t=0,e=n.length;e>t;t++)p=n[t],i.push(r(p));return i}()),s=i(function(){var t,e,n,i;for(n=Array.concat(y.AE||[]),i=[],t=0,e=n.length;e>t;t++)p=n[t],i.push(r(p));return i}()),h=[function(){var t,r,i;for(i=[],t=0,r=n.length;r>t;t++)p=n[t],i.push(e(p,a));return i}(),function(){var t,n,r;for(r=[],t=0,n=o.length;n>t;t++)p=o[t],r.push(e(p,a));return r}(),function(){var t,n,r;for(r=[],t=0,n=s.length;n>t;t++)p=s[t],r.push(e(p,a));return r}()],v.push(h)),(y.W||y.B)&&(m=y[u[c%2]],m||(v.push(null),m=y[u[(c+1)%2]]),"[tt]"===m&&(m="[]"),v.push(e(m,a))),l.next();return this.mode=g,this.board_size=a,this.moves=v,this.current=v.length},t}(),this.Game_Data=t}.call(this),function(){this.sgf_parse=function(t){"use strict";var e,n,r,i,s,o;return i=void 0,s=void 0,e={},o=void 0,r=void 0,n=void 0,s={beginSequence:function(t){var n,r;return n="sequences",o||(o=e,n="gameTrees"),o.gameTrees&&(n="gameTrees"),r={parent:o},o[n]=o[n]||[],o[n].push(r),o=r,i(t.substring(1))},endSequence:function(t){return o=o.parent?o.parent:null,i(t.substring(1))},node:function(t){return r={},o.nodes=o.nodes||[],o.nodes.push(r),i(t.substring(1))},property:function(t){var e,s,o,a,u;if(o=void 0,e=t.match(/([^\\\]]|\\(.|\n|\r))*\]/),!e.length)throw new Error("malformed sgf");return e=e[0].length,u=t.substring(0,e),a=u.indexOf("["),s=u.substring(0,a),s||(s=n,Array.isArray(r[s])||(r[s]=[r[s]])),n=s,o=u.substring(a+1,u.length-1),s.length>2&&console.warn("SGF PropIdents should be no longer than two characters:",s),Array.isArray(r[s])?r[s].push(o):r[s]=o,i(t.substring(e))},unrecognized:function(t){return i(t.substring(1))}},(i=function(t){var n,r;return n=t.substring(0,1),r=void 0,n?(r="("===n?"beginSequence":")"===n?"endSequence":";"===n?"node":-1!==n.search(/[A-Z\[]/)?"property":"unrecognized",s[r](t)):e})(t)},this.generate=function(t){var e;return(e=function(t){var n;return n="",t.forEach(function(t){n+="(",t.nodes&&t.nodes.forEach(function(t){var e,r,i;e=";";for(i in t)t.hasOwnProperty(i)&&(r=t[i],Array.isArray(r)&&(r=r.join("][")),e+=i+"["+r+"]");n+=e}),t.sequences&&(n+=e(t.sequences)),n+=")"}),n})(t.gameTrees)}}.call(this),function(){this.smartgamer=function(t){"use strict";var e,n,r;return r=void 0,n=void 0,e=function(){this.init()},e.prototype={init:function(){t&&(this.game=t.gameTrees[0],this.reset())},load:function(e){t=e,this.init()},games:function(){return t.gameTrees},selectGame:function(e){if(!(e<t.gameTrees.length))throw new Error("the collection doesn't contain that many games");return this.game=t.gameTrees[e],this.reset(),this},reset:function(){return r=this.game,n=r.nodes[0],this.path={m:0},this},getSmartgame:function(){return t},variations:function(){var t,e;return r&&(e=r.nodes,t=e?e.indexOf(n):null,e)?t===e.length-1?r.sequences||[]:[]:void 0},next:function(t){var e,i;if(t=t||0,i=r.nodes,e=i?i.indexOf(n):null,null===e||e>=i.length-1){if(!r.sequences)return this;r=r.sequences[t]?r.sequences[t]:r.sequences[0],n=r.nodes[0],this.path[this.path.m]=t,this.path.m+=1}else n=i[e+1],this.path.m+=1;return this},previous:function(){var t,e;if(e=r.nodes,t=e?e.indexOf(n):null,delete this.path[this.path.m],t&&0!==t)n=e[t-1],this.path.m-=1;else{if(!r.parent||r.parent.gameTrees)return this;r=r.parent,r.nodes?(n=r.nodes[r.nodes.length-1],this.path.m-=1):n=null}return this},last:function(){var t;for(t=this.totalMoves();this.path.m<t;)this.next();return this},first:function(){return this.reset(),this},goTo:function(t){var e,r,i;for("string"==typeof t?t=this.pathTransform(t,"object"):"number"==typeof t&&(t={m:t}),this.reset(),r=n,e=0;e<t.m&&r;)i=t[e]||0,r=this.next(i),e+=1;return this},getGameInfo:function(){return this.game.nodes[0]},node:function(){return n},totalMoves:function(){var t,e;for(t=this.game,e=0;t;)e+=t.nodes.length,t=t.sequences?t.sequences[0]:null;return e-1},comment:function(t){return"undefined"==typeof t?n.C?n.C.replace(/\\([\\:\]])/g,"$1"):"":void(n.C=t.replace(/[\\:\]]/g,"\\$&"))},translateCoordinates:function(t){var e,n;return e="abcdefghijklmnopqrst",n=[],n[0]=e.indexOf(t.substring(0,1)),n[1]=e.indexOf(t.substring(1,2)),n},pathTransform:function(t,e,n){var r,i,s;return r=void 0,s=function(t){var e,i;if("string"==typeof t)return t;if(!t)return"";r=t.m,i=[];for(e in t)t.hasOwnProperty(e)&&"m"!==e&&t[e]>0&&(n?i.push(", variation "+t[e]+" at move "+e):i.push("-"+e+":"+t[e]));return r+=i.join("")},i=function(t){var e;return"object"==typeof t&&(t=s(t)),t?(e=t.split("-"),r={m:Number(e.shift())},e.length&&e.forEach(function(t,e){t=t.split(":"),r[Number(t[0])]=t[1]}),r):{m:0}},"undefined"==typeof e&&(e="string"==typeof t?"object":"string"),r="string"===e?s(t):"object"===e?i(t):void 0}},new e}}.call(this);
