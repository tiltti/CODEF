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

function grad(dst,params){
	this.dst=dst;
	this.params=params;
	
	this.drawH = function(){
		var tmp=this.dst.contex.fillStyle;
		var tmp2=this.dst.contex.globalAlpha;
		this.dst.contex.globalAlpha=1;
		var lingrad = this.dst.contex.createLinearGradient(0,0,0,this.dst.canvas.height);
		for(var j=0;j<this.params.length;j++){
			lingrad.addColorStop(this.params[j].offset, this.params[j].color);
		}
		this.dst.contex.fillStyle = lingrad;
		this.dst.contex.fillRect(0,0,this.dst.canvas.width,this.dst.canvas.height);
		this.dst.contex.fillStyle=tmp;
		this.dst.contex.globalAlpha=tmp2;
	}
	
	this.drawV = function(){
		var tmp=this.dst.contex.fillStyle;
		var tmp2=this.dst.contex.globalAlpha;
		this.dst.contex.globalAlpha=1;
		var lingrad = this.dst.contex.createLinearGradient(0,0,this.dst.canvas.width,0);
		for(var j=0;j<this.params.length;j++){
			lingrad.addColorStop(this.params[j].offset, this.params[j].color);
		}
		this.dst.contex.fillStyle = lingrad;
		this.dst.contex.fillRect(0,0,this.dst.canvas.width,this.dst.canvas.height);
		this.dst.contex.fillStyle=tmp;
		this.dst.contex.globalAlpha=tmp2;
	}
}
