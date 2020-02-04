
var rocon=(function(){var re_rule=/\.rc(\d+)\b/,re_class=/\brc(\d+)\b/,re_shape_flag=/\brc-shape\b/,rule_prefix='rocon__',base_class='rocon',binded_props=[],result={update:function(){},bindProperties:function(){var id=1;return function(rule,bg,border_width){binded_props.push({'id':id++,'rule':rule,'bg':mapArray(expandProperty(bg),function(val){if(val.charAt(0)!='#')
val='#'+val;return convertColorToHex(val);}),'border_width':border_width||0});}}(),process:function(context){processRoundedElements(context);}},corners_ss=null,_corner_cache={},elem_classes=[],dom_ready_list=[],is_ready=false,readyBound=false,userAgent=navigator.userAgent.toLowerCase(),processed_rules={},browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)};function fireReady(){if(!is_ready){is_ready=true;if(dom_ready_list.length){for(var i=0;i<dom_ready_list.length;i++){dom_ready_list[i].call(document);}
dom_ready_list=null;}}}
function addDomReady(fn){dom_ready_list.push(fn);}
function bindReady(){if(readyBound)return;readyBound=true;if(document.addEventListener){document.addEventListener("DOMContentLoaded",function(){document.removeEventListener("DOMContentLoaded",arguments.callee,false);fireReady();},false);}else if(document.attachEvent){document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",arguments.callee);fireReady();}});if(document.documentElement.doScroll&&!window.frameElement)(function(){if(is_ready)return;try{document.documentElement.doScroll("left");}catch(error){setTimeout(arguments.callee,0);return;}
fireReady();})();}}
function walkArray(ar,fn,forward){if(forward){for(var i=0,len=ar.length;i<len;i++)
if(fn.call(ar[i],i)===false)
break;}else{for(var i=ar.length-1,result;i>=0;i--)
if(fn.call(ar[i],i)===false)
break;}}
function mapArray(elems,callback){var ret=[];for(var i=0,length=elems.length;i<length;i++){var value=callback(elems[i],i);if(value!=null)
ret[ret.length]=value;}
return ret.concat.apply([],ret);}
function addCorners(){return;};function convertColorToHex(color){var result;function s(num){var n=parseInt(num,10).toString(16);return(n.length==1)?n+n:n;}
function p(num){return s(Math.round(num*2.55));}
if(result=/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/.exec(color))
return'#'+s(result[1])+s(result[2])+s(result[3]);if(result=/rgb\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*\)/.exec(color))
return'#'+p(result[1])+p(result[2])+p(result[3]);if(result=/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/i.exec(color))
return'#'+result[1]+result[2]+result[3];if(result=/#([a-f0-9])([a-f0-9])([a-f0-9])/i.exec(color))
return'#'+result[1]+result[1]+result[2]+result[2]+result[3]+result[3];s=null;p=null;return color;}
function createElement(name,class_name){var elem=document.createElement(name);if(class_name){elem.className=class_name;}
return elem;}
function hasClass(elem,class_name){var re=new RegExp('\\b'+class_name+'\\b');return elem.nodeType==1&&re.test(elem.className||'');}
function getStyle(elem,name){var cs,result={},camel=function(str,p1){return p1.toUpperCase();};walkArray(name instanceof Array?name:[name],function(){var n=this,name_camel=n.replace(/\-(\w)/g,camel);if(elem.style[name_camel]){result[name_camel]=elem.style[name_camel];}
else if(browser.msie){result[name_camel]=elem.currentStyle[name_camel];}
else if(document.defaultView&&document.defaultView.getComputedStyle){if(!cs)
cs=document.defaultView.getComputedStyle(elem,"");result[name_camel]=cs&&cs.getPropertyValue(n);}});return name instanceof Array?result:result[name.replace(/\-(\w)/g,camel)];}
function expandProperty(prop){var chunks=(prop||'').split('_');switch(chunks.length){case 1:return[chunks[0],chunks[0],chunks[0],chunks[0]];case 2:return[chunks[0],chunks[1],chunks[0],chunks[1]];case 3:return[chunks[0],chunks[1],chunks[2],chunks[1]];case 4:return chunks;}
return null;}
var getBg=(function(){var session_elems=[],default_color='#ffffff';function mainLoopCache(elem){var c;do{if(elem.nodeType!=1)
break;if(elem.rocon_bg){return elem.rocon_bg;}else{session_elems.push(elem);c=getStyle(elem,'background-color');if(c!='transparent')
return convertColorToHex(c);}}while(elem=elem.parentNode);return default_color;}
function mainLoopNoCache(elem){var c;do{if(elem.nodeType!=1)
break;c=getStyle(elem,'background-color');if(c!='transparent')
return convertColorToHex(c);}while(elem=elem.parentNode);return default_color;}
return function(elem,use_shape){var cl=elem.className,bg=null;var bg_props=/\brcbg([a-f0-9_]+)\b/i.exec(cl);if(bg_props){bg=mapArray(expandProperty(bg_props[1]),function(el){return convertColorToHex('#'+el);});return bg;}
var elem_props=getBindedProperties(elem);if(elem_props){return elem_props.bg;}
if(!use_shape)
elem=elem.parentNode;if(getBg.use_cache){session_elems=[];bg=mainLoopCache(elem);walkArray(session_elems,function(){this.rocon_bg=bg;getBg.processed_elems.push(this);});session_elems=null;}else{bg=mainLoopNoCache(elem);}
return expandProperty(bg);}})();getBg.use_cache=true;getBg.processed_elems=[];function getBindedProperties(elem){var cl=elem.className,result=null;walkArray(binded_props,function(){if((typeof(this.rule)=='string'&&cl.indexOf(this.rule)!=-1)||cl.search(this.rule)!=-1){result=this;return false;}},true);return result;}
function addRule(selector,rules){corners_ss.insertRule(selector+' {'+rules+'}',corners_ss.cssRules.length);}
function findRules(addFunc){var match;walkArray(document.styleSheets,function(){walkArray(this.cssRules||this.rules,function(){if(match=re_rule.exec(this.selectorText))
addFunc(this,parseInt(match[1],10));});});}
function cleanUp(elem,add_class){var cl=(elem.className||'').replace(new RegExp('\\s*'+base_class+'[\-_].+?\\b','ig'),'');if(add_class){cl+=' '+add_class;}
elem.className=cl;return elem;}
function addRoundedProperties(rule,radius){elem_classes.push(rule.selectorText.substr(1));}
function createStylesheet(){if(!corners_ss){if(document.createStyleSheet){corners_ss=document.createStyleSheet();}else{var style=createElement('style');style.rel='rocon';document.getElementsByTagName('head')[0].appendChild(style);walkArray(document.styleSheets,function(){if(this.ownerNode.rel=='rocon'){corners_ss=this;return false;}});}}
return corners_ss;}
function getElementsToProcess(context){var elems=[],m;walkArray((context||document).getElementsByTagName('*'),function(){if(m=re_class.exec(this.className||'')){elems.push({node:this,radius:parseInt(m[1],10)});}});return elems;}
function processRoundedElements(context){var elems=getElementsToProcess(context);if(elems.length){createStylesheet();walkArray(elems,function(){addCorners(this.node,this.radius);});}}
function isProcessed(selector){return processed_rules[selector]?true:false;}
function getCornerParams(elem,radius){var cl=elem.className||'';radius=radius||parseInt(cl.match(re_class)[1],10);var use_shape=re_shape_flag.test(cl),props=getBindedProperties(elem);var border_color='';var border_width=props?props.border_width:(parseInt(getStyle(elem,'border-left-width'))||0);if(border_width){border_color=convertColorToHex(getStyle(elem,'border-left-color')||'#000');}
return{'radius':radius,'bg_color':getBg(elem,use_shape),'border_width':(border_width>radius)?radius:border_width,'real_border_width':border_width,'border_color':border_color,'use_shape':use_shape};}
function applyCornersToArgs(args,fn){walkArray(args,function(){walkArray((this instanceof Array)?this:[this],fn);});}
function copyObj(obj){var result={};for(var p in obj)
if(obj.hasOwnProperty(p))
result[p]=obj[p];return result;}
function adjustBox(elem,class_name,options){var elem_styles=getStyle(elem,['padding-top','padding-bottom','margin-top','margin-bottom']);function getProp(prop){return parseInt(elem_styles[prop],10)||0;}
var padding_top=Math.max(getProp('paddingTop')-options.radius+options.border_width,0),padding_bottom=Math.max(getProp('paddingBottom')-options.radius+options.border_width,0),margin_top=getProp('marginTop')+options.radius,margin_bottom=getProp('marginBottom')+options.radius,border_width=options.real_border_width-options.border_width;addRule('.'+class_name,'border-top-width:'+border_width+'px;'+'border-bottom-width:'+border_width+'px;'+'padding-top:'+padding_top+'px;'+'padding-bottom:'+padding_bottom+'px;'+'margin-top:'+margin_top+'px;'+'margin-bottom:'+margin_bottom+'px');}
addDomReady(processRoundedElements);addDomReady(function(){walkArray(getBg.processed_elems,function(){this.removeAttribute('rocon_bg');});getBg.use_cache=false;});bindReady();if(browser.safari){addCorners=function(elem,radius){var selector='.rc'+radius;if(!isProcessed(selector)){processed_rules[selector]=true;}}
result.update=function(){applyCornersToArgs(arguments,function(){var m=re_class.exec(this.className||'');if(m)
addCorners(this,parseInt(m[1]));});}}
if(browser.mozilla){addCorners=function(elem,radius){var selector='.rc'+radius;if(!isProcessed(selector)){processed_rules[selector]=true;}}
result.update=function(){applyCornersToArgs(arguments,function(){var m=re_class.exec(this.className||'');if(m)
addCorners(this,parseInt(m[1]));});}}
if(browser.msie){_corner_cache.ix=0;_corner_cache.created={};var css_text='',corner_types={tl:0,tr:1,br:2,bl:3};var vml_class='vml-'+base_class;try{if(!document.namespaces["v"])
document.namespaces.add("v","urn:schemas-microsoft-com:vml");}catch(e){}
createStylesheet();var dot_class='.'+base_class;corners_ss.cssText="."+vml_class+" {behavior:url(#default#VML);display:inline-block;position:absolute}"+
dot_class+"-init {position:relative;zoom:1;}"+
dot_class+" {position:absolute; display:inline-block; zoom: 1; overflow:hidden}"+
dot_class+"-tl ."+vml_class+"{flip: 'y'}"+
dot_class+"-tr ."+vml_class+"{rotation: 180;right:1px;}"+
dot_class+"-br ."+vml_class+"{flip: 'x'; right:1px;}";if(browser.version<7){corners_ss.cssText+=dot_class+'-tr, '+dot_class+'-br {margin-left: 100%;}';}
addRule=function(selector,rules){css_text+=selector+'{'+rules+'}';};function createCornerElementIE(options){var radius=options.radius,border_width=options.border_width,cache_key=radius+':'+border_width+':'+options.use_shape;if(!createCornerElementIE._cache[cache_key]){var multiplier=10;var cv=createElement('v:shape');cv.className=vml_class;cv.strokeweight=border_width+'px';cv.stroked=(border_width)?true:false;var stroke=createElement('v:stroke');stroke.className=vml_class;stroke.joinstyle='miter';cv.appendChild(stroke);var w=radius,h=w;cv.style.width=w+'px';cv.style.height=h+'px';radius-=border_width/2;radius*=multiplier;var bo=border_width/2*multiplier;var px=Math.round((radius+bo)/w);var rbo=radius+bo;cv.coordorigin=Math.round(px/2)+' '+Math.round(px/2);cv.coordsize=rbo+' '+rbo;var path='';var max_width=rbo+px;if(options.use_shape){max_width=2000*multiplier;path='m'+max_width+',0 ns l'+bo+',0  qy'+rbo+','+radius+' l'+max_width+','+radius+' e ';}else{path='m0,0 ns l'+bo+',0  qy'+rbo+','+radius+' l'+rbo+','+rbo+' l0,'+rbo+' e ';}
path+='m'+bo+','+(-px)+' nf l'+bo+',0 qy'+rbo+','+radius+' l '+(max_width)+','+radius+' e x';cv.path=path;createCornerElementIE._cache[cache_key]=cv;}
return createCornerElementIE._cache[cache_key].cloneNode(true);}
createCornerElementIE._cache={};function drawCornerIE(cparams,type){var cv=createCornerElementIE(cparams);cv.fillcolor=cparams.bg_color[corner_types[type]]||'#000';cv.strokecolor=cparams.border_color||'#000';var elem=createElement('span',base_class+' '+base_class+'-'+type);elem.appendChild(cv);return elem;}
function removeOldCorners(elem){walkArray(elem.childNodes,function(){if(hasClass(this,base_class)){elem.removeChild(this);}});cleanUp(elem);}
function getClassName(options){var key=options.radius+':'+(options.real_border_width||0)+':'+options.use_shape;if(!_corner_cache[key]){_corner_cache[key]=rule_prefix+_corner_cache.ix++;}
return _corner_cache[key];}
function createCSSRules(options,elem){var radius=options.radius,border_width=options.real_border_width||0,diff=(options.use_shape)?options.real_border_width-options.border_width:0;var class_name=getClassName(options);if(!_corner_cache.created[class_name]){var prefix=(browser.version<7)?'.'+class_name+' .'+base_class:'.'+class_name+'>.'+base_class;var offset_x=-border_width,offset_y=-1-border_width;addRule(prefix,'width:'+(radius+border_width+1)+'px;height:'+(radius+1)+'px');if(options.use_shape){offset_y=-radius-1-diff;var left_adjust=radius+options.border_width*2+diff;adjustBox(elem,class_name,options);var clip_size=Math.max(radius-border_width*2,0),pad_size=Math.min(radius-border_width*2,0)*-1;if(browser.version<7){pad_size+=parseInt(getStyle(elem,'padding-left')||0)+parseInt(getStyle(elem,'padding-right')||0);}
var css_rules='width:100%;clip:rect(auto auto auto '+clip_size+'px);padding-right:'+pad_size+'px;left:'+(-border_width-clip_size)+'px;';addRule(prefix+'-tl',css_rules+'top:'+offset_y+'px;');addRule(prefix+'-tl .'+vml_class,'left:'+clip_size+'px');addRule(prefix+'-bl',css_rules+'bottom:'+offset_y+'px;');addRule(prefix+'-bl .'+vml_class,'left:'+clip_size+'px');}else{addRule(prefix+'-tl','left:'+offset_x+'px;top:'+offset_y+'px;');addRule(prefix+'-bl','left:'+offset_x+'px;bottom:'+offset_y+'px;');}
if(browser.version<7){offset_x=-radius+(border_width?radius%2-border_width%2:-radius%2);addRule(prefix+'-tr','left:'+offset_x+'px;top:'+offset_y+'px;');addRule(prefix+'-br','left:'+offset_x+'px;bottom:'+offset_y+'px;');}else{addRule(prefix+'-tr','right:'+offset_x+'px;top:'+offset_y+'px;');addRule(prefix+'-br','right:'+offset_x+'px;bottom:'+offset_y+'px;');}
_corner_cache.created[class_name]=true;}}
addCorners=function(elem,radius){var cparams=getCornerParams(elem,radius);createCSSRules(cparams,elem);walkArray(['tl','tr','bl','br'],function(){elem.appendChild(drawCornerIE(cparams,this));});elem.className+=' '+getClassName(cparams)+' '+base_class+'-init';};result.update=function(){applyCornersToArgs(arguments,function(){removeOldCorners(this);addCorners(this);});};addDomReady(function(){corners_ss.cssText+=css_text;css_text='';addRule=corners_ss.addRule;});};return result;})();