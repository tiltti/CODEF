/*------------------------------------------------------------------------------
Copyright (c) 2011 Antoine Santo Aka NoNameNo

This File is part of the CODEF project. (https://github.com/N0NameN0/CODEF)

More info : http://codef.santo.fr
Demo gallery http://www.wab.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
------------------------------------------------------------------------------*/

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     || 
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();

function canvas(w, h, divname){
	this.width=w;
	this.height=h;
	this.canvas;
	this.contex;
	this.canvas = document.createElement("canvas");
	if(divname) document.getElementById(divname).appendChild(this.canvas);
	this.canvas.setAttribute('width', w);
	this.canvas.setAttribute('height', h);
	this.contex = this.canvas.getContext('2d');
	
	this.handlex=0;
        this.handley=0;
	this.midhandled=false;
	this.tilew=0;
	this.tileh=0;
	this.tilestart=0;
	
	this.fill = function(color){
		var tmp = this.contex.fillStyle;
		var tmp2= this.contex.globalAlpha;
		this.contex.globalAlpha=1;
		this.contex.fillStyle = color;
		this.contex.fillRect (0, 0, this.canvas.width, this.canvas.height);
		this.contex.fillStyle = tmp
		this.contex.globalAlpha=tmp2;
	}
 
	this.clear = function(){
		this.contex.clearRect (0, 0, this.canvas.width, this.canvas.height);
	}
	
	this.plot = function(x,y,width,color){
		this.quad(x,y,x+width,y,x+width,y+width,x,y+width,color);
	}
	
	this.line = function(x1,y1,x2,y2,width,color){
		var tmp=this.contex.strokeStyle;
		this.contex.strokeStyle=color;
		this.contex.lineWidth=width;
		this.contex.beginPath();
		this.contex.moveTo(x1,y1);
		this.contex.lineTo(x2,y2);
		this.contex.stroke();
		this.contex.closePath();
		this.contex.strokeStyle=tmp;
	}
	
	this.triangle = function(x1,y1,x2,y2,x3,y3,color){
		this.contex.beginPath();
		this.contex.moveTo(x1,y1);
		this.contex.lineTo(x2,y2);
		this.contex.lineTo(x3,y3);
		this.contex.closePath();
		this.contex.fillStyle=color;
		this.contex.fill();
	}

	this.quad = function(x1,y1,x2,y2,x3,y3,x4,y4,color){
		this.contex.beginPath();
		
		if(arguments.length==5){
			this.contex.moveTo(x1,y1);
			this.contex.lineTo(x1+x2,y1);
			this.contex.lineTo(x1+x2,y1+y2);
			this.contex.lineTo(x1,y1+y2);
			this.contex.closePath();
			this.contex.fillStyle=x3;
			
		}
		else{
			this.contex.moveTo(x1,y1);
			this.contex.lineTo(x2,y2);
			this.contex.lineTo(x3,y3);
			this.contex.lineTo(x4,y4);
			this.contex.closePath();
			this.contex.fillStyle=color;
			
		}
		this.contex.fill();
	}
	
	this.initTile=function(tilew,tileh, tilestart){
		this.tileh=tileh;
		this.tilew=tilew;
		if(typeof(tilestart)!='undefined')
			this.tilestart=tilestart;
	}
	
        this.draw = function(dst,x,y,alpha, rot,w,h){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==3 || arguments.length==4)
                        dst.contex.drawImage(this.canvas, x-this.handlex,y-this.handley);
		else if(arguments.length==5){
			dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.canvas, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                        dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.scale(w,h);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.canvas, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
        this.drawTile = function(dst, nb, x, y, alpha, rot, w, h){
		var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                this.drawPart(dst,x,y,Math.floor((nb%(this.canvas.width/this.tilew)))*this.tilew,Math.floor(nb/(this.canvas.width/this.tilew))*this.tileh,this.tilew,this.tileh,alpha, rot, w, h);
		dst.contex.globalAlpha=tmp;

	}
        
        this.drawPart = function(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==7 || arguments.length==8){
                       	dst.contex.translate(x,y);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
		else if(arguments.length==9){
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			dst.contex.scale(zx,zy);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.canvas,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
	
	this.setmidhandle=function(){
                this.handlex=parseInt(this.canvas.width/2);
                this.handley=parseInt(this.canvas.height/2);
		this.midhandled=true;
        }

        this.sethandle=function(x,y){
                this.handlex=x;
                this.handley=y;
		this.midhandled=false;
        }
        
        this.print=function(dst, str, x, y, alpha, rot, w, h){
		for(var i=0; i<str.length; i++){
			if(typeof(w)!='undefined')
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew*w,y,alpha,rot,w,h);
			else
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew,y,alpha,rot,w,h);
		}
	}

	
	return this;
	
}

function image(img){
	this.img = new Image();
	this.img.src=img;
        this.handlex=0;
        this.handley=0;
	this.midhandled=false;
	this.tilew=0;
	this.tileh=0;
	this.tilestart=0;
	
	this.initTile=function(tilew,tileh,tilestart){
		this.tileh=tileh;
		this.tilew=tilew;
		if(typeof(tilestart)!='undefined')
			this.tilestart=tilestart;
			
	}


        this.draw = function(dst,x,y,alpha, rot,w,h){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==3 || arguments.length==4)
                        dst.contex.drawImage(this.img, x-this.handlex,y-this.handley);
		else if(arguments.length==5){
			dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.img, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                        dst.contex.translate(x,y);
                        dst.contex.rotate(rot*Math.PI/180);
                        dst.contex.scale(w,h);
                        dst.contex.translate(-this.handlex,-this.handley);
                        dst.contex.drawImage(this.img, 0,0);
                        dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
        this.drawTile = function(dst, nb, x, y, alpha, rot, w, h){
		var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                this.drawPart(dst,x,y,Math.floor((nb%(this.img.width/this.tilew)))*this.tilew,Math.floor(nb/(this.img.width/this.tilew))*this.tileh,this.tilew,this.tileh,alpha, rot, w, h);
		dst.contex.globalAlpha=tmp;

	}
        
        this.drawPart = function(dst,x,y,partx,party,partw,parth,alpha, rot,zx,zy){
                var tmp=dst.contex.globalAlpha;
		if(typeof(alpha)=='undefined') alpha=1;
                dst.contex.globalAlpha=alpha;
                if(arguments.length==7 || arguments.length==8){
                       	dst.contex.translate(x,y);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
		else if(arguments.length==9){
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
		}
                else{
                       	dst.contex.translate(x,y);
			dst.contex.rotate(rot*Math.PI/180);
			dst.contex.scale(zx,zy);
			if(this.midhandled==true) dst.contex.translate(-partw/2,-parth/2); else dst.contex.translate(-this.handlex,-this.handley);
			dst.contex.drawImage(this.img,partx,party,partw,parth,null,null,partw,parth);
			dst.contex.setTransform(1, 0, 0, 1, 0, 0);
                }
                dst.contex.globalAlpha=tmp;
        }
        
        
	
	this.setmidhandle=function(){
                this.handlex=parseInt(this.img.width/2);
                this.handley=parseInt(this.img.height/2);
		this.midhandled=true;
        }

        this.sethandle=function(x,y){
                this.handlex=x;
                this.handley=y;
		this.midhandled=false;
        }
        
        this.print=function(dst, str, x, y, alpha, rot, w, h){
		for(var i=0; i<str.length; i++){
			if(typeof(w)!='undefined')
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew*w,y,alpha,rot,w,h);
			else
				this.drawTile(dst, str[i].charCodeAt(0)-this.tilestart,x+i*this.tilew,y,alpha,rot,w,h);
		}
	}

	return this;
}
