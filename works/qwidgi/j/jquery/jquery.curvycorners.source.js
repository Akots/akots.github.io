 /****************************************************************
  *                                                              *
  *  JQuery Curvy Corners by Mike Jolley                         *
  *	 http://blue-anvil.com                                       *
  *  ------------                                                *
  *  Version 1.8                                                 *
  *                                                              *
  *  Origionaly by: Cameron Cooke and Tim Hutchison.             *
  *  Website: http://www.curvycorners.net                        *
  *                                                              *
  *  This library is free software; you can redistribute         *
  *  it and/or modify it under the terms of the GNU              *
  *  Lesser General Public License as published by the           *
  *  Free Software Foundation; either version 2.1 of the         *
  *  License, or (at your option) any later version.             *
  *                                                              *
  *  This library is distributed in the hope that it will        *
  *  be useful, but WITHOUT ANY WARRANTY; without even the       *
  *  implied warranty of MERCHANTABILITY or FITNESS FOR A        *
  *  PARTICULAR PURPOSE. See the GNU Lesser General Public       *
  *  License for more details.                                   *
  *                                                              *
  *  You should have received a copy of the GNU Lesser           *
  *  General Public License along with this library;             *
  *  Inc., 59 Temple Place, Suite 330, Boston,                   *
  *  MA 02111-1307 USA                                           *
  *                                                              *
  ****************************************************************/
(function($) {
$.fn.corner = function(options) {

	function BlendColour(Col1, Col2, Col1Fraction) {
		var red1 = parseInt(Col1.substr(1,2),16);
		var green1 = parseInt(Col1.substr(3,2),16);
		var blue1 = parseInt(Col1.substr(5,2),16);
		var red2 = parseInt(Col2.substr(1,2),16);
		var green2 = parseInt(Col2.substr(3,2),16);
		var blue2 = parseInt(Col2.substr(5,2),16);
		if(Col1Fraction > 1 || Col1Fraction < 0) Col1Fraction = 1;
		var endRed = Math.round((red1 * Col1Fraction) + (red2 * (1 - Col1Fraction)));
		if(endRed > 255) endRed = 255;
		if(endRed < 0) endRed = 0;
		var endGreen = Math.round((green1 * Col1Fraction) + (green2 * (1 - Col1Fraction)));
		if(endGreen > 255) endGreen = 255;
		if(endGreen < 0) endGreen = 0;
		var endBlue = Math.round((blue1 * Col1Fraction) + (blue2 * (1 - Col1Fraction)));
		if(endBlue > 255) endBlue = 255;
		if(endBlue < 0) endBlue = 0;
		return "#" + IntToHex(endRed)+ IntToHex(endGreen)+ IntToHex(endBlue);
	}
	
	function IntToHex(strNum) {
		base = strNum / 16;
		rem = strNum % 16;
		base = base - (rem / 16);
		baseS = MakeHex(base);
		remS = MakeHex(rem);
		return baseS + '' + remS;
	}
	
	function MakeHex(x) {
		if((x >= 0) && (x <= 9)) {
			return x; 
		} else {
			switch(x) {
				case 10: return "A";
				case 11: return "B";
				case 12: return "C";
				case 13: return "D";
				case 14: return "E";
				case 15: return "F";
			};
			return "F";
		};
	}
	
	function pixelFraction(x, y, r) {
		var pixelfraction = 0;
		var xvalues = new Array(1);
		var yvalues = new Array(1);
		var point = 0;
		var whatsides = "";
		var intersect = Math.sqrt((Math.pow(r,2) - Math.pow(x,2)));
		if ((intersect >= y) && (intersect < (y+1))) {
			whatsides = "Left";
			xvalues[point] = 0;
			yvalues[point] = intersect - y;
			point = point + 1;
		};
		var intersect = Math.sqrt((Math.pow(r,2) - Math.pow(y+1,2)));
		if ((intersect >= x) && (intersect < (x+1))) {
			whatsides = whatsides + "Top";
			xvalues[point] = intersect - x;
			yvalues[point] = 1;
			point = point + 1;
		};
		var intersect = Math.sqrt((Math.pow(r,2) - Math.pow(x+1,2)));
		if ((intersect >= y) && (intersect < (y+1))) {
			whatsides = whatsides + "Right";
			xvalues[point] = 1;
			yvalues[point] = intersect - y;
			point = point + 1;
		};
		var intersect = Math.sqrt((Math.pow(r,2) - Math.pow(y,2)));
		if ((intersect >= x) && (intersect < (x+1))) {
			whatsides = whatsides + "Bottom";
			xvalues[point] = intersect - x;
			yvalues[point] = 0;
		};
		switch (whatsides) {
			case "LeftRight":
			pixelfraction = Math.min(yvalues[0],yvalues[1]) + ((Math.max(yvalues[0],yvalues[1]) - Math.min(yvalues[0],yvalues[1]))/2);
			break;
			case "TopRight":
			pixelfraction = 1-(((1-xvalues[0])*(1-yvalues[1]))/2);
			break;
			case "TopBottom":
			pixelfraction = Math.min(xvalues[0],xvalues[1]) + ((Math.max(xvalues[0],xvalues[1]) - Math.min(xvalues[0],xvalues[1]))/2);
			break;
			case "LeftBottom":
			pixelfraction = (yvalues[0]*xvalues[1])/2;
			break;
			default:
			pixelfraction = 1;
		};
		return pixelfraction;
	}
	
	function rgb2Hex(rgbColour) {
		try {
			var rgbArray = rgb2Array(rgbColour);
			var red = parseInt(rgbArray[0]);
			var green = parseInt(rgbArray[1]);
			var blue = parseInt(rgbArray[2]);
			var hexColour = "#" + IntToHex(red) + IntToHex(green) + IntToHex(blue);
		} catch(e) {
			alert("There was an error converting the RGB value to Hexadecimal in function rgb2Hex");
		};
		return hexColour;
	}
	
	function rgb2Array(rgbColour) {
		var rgbValues = rgbColour.substring(4, rgbColour.indexOf(")"));
		var rgbArray = rgbValues.split(", ");
		return rgbArray;
	}
	
	function format_colour(colour) {
		var returnColour = "transparent";
		if(colour != "" && colour != "transparent")
		{
			if(colour.substr(0, 3) == "rgb")
			{
				returnColour = rgb2Hex(colour);
			}
			else if(colour.length == 4)
			{
				returnColour = "#" + colour.substring(1, 2) + colour.substring(1, 2) + colour.substring(2, 3) + colour.substring(2, 3) + colour.substring(3, 4) + colour.substring(3, 4);
			}
			else
			{
				returnColour = colour;
			};
		};
		return returnColour;
	};
	function strip_px(value) {
		return parseInt((( value != "auto" && value.indexOf("%") == -1 && value != "" && value.indexOf("px") !== -1)? value.slice(0, value.indexOf("px")) : 0))	
	}

    function drawPixel(box,intx, inty, colour, transAmount, height, newCorner, image, bgImage, cornerRadius, isBorder, borderWidth, boxWidth, settings) {
    	var $$ = $(box);
        var pixel = document.createElement("div");
        $(pixel).css({	height:height,width:"1px",position:"absolute","font-size":"1px",overflow:"hidden"	});
        //var topMaxRadius = Math.max(settings["tr"].radius, settings["tl"].radius);
        var topMaxRadius = Math.max(settings.tl ? settings.tl.radius : 0, settings.tr ? settings.tr.radius : 0);
        // Dont apply background image to border pixels
        if(image == -1 && bgImage != "") {
			if(topMaxRadius>0)
				$(pixel).css("background-position","-" + ((boxWidth - cornerRadius - borderWidth)+ intx) + "px -" + (($$.height() + topMaxRadius  - borderWidth )-inty) + "px");
			else 
				$(pixel).css("background-position","-" + ((boxWidth - cornerRadius - borderWidth)+ intx) + "px -" + (($$.height() )-inty) + "px");	
			$(pixel).css({
						 "background-image":bgImage,
						 "background-repeat":$$.css("background-repeat"),
						 "background-color":colour						 
			});
        }
        else
        {
			if (!isBorder) $(pixel).css("background-color",colour).addClass('hasBackgroundColor');
			else $(pixel).css("background-color",colour);
        };
        
        //if (transAmount != 100)
        	//$(pixel).css('opacity',transAmount/100);
		$(pixel).css({top:inty + "px",left:intx + "px"});
        return pixel;
    };
		
	// Apply the corners
	function applyCorners(box,settings) {
	
		var $$ = $(box); 

		// Get CSS of box and define vars
		var thebgImage 			= $$.css("backgroundImage");
		var topContainer = null;
		var bottomContainer = null;
		var masterCorners = new Array();
		var contentDIV = null;
		var boxHeight 			= strip_px($$.css("height")) ? strip_px($$.css("height")) : box.scrollHeight; 
		var boxWidth 			= strip_px($$.css("width")) ? strip_px($$.css("width")) : box.scrollWidth; 
		var borderWidth     	= strip_px($$.css("borderTopWidth")) ? strip_px($$.css("borderTopWidth")) : 0; 
		var boxPaddingTop 		= strip_px($$.css("paddingTop"));
		var boxPaddingBottom 	= strip_px($$.css("paddingBottom"));
		var boxPaddingLeft 	= strip_px($$.css("paddingLeft"));
		
		var boxPaddingRight 	= strip_px($$.css("paddingRight"));
		var boxColour 			= format_colour($$.css("backgroundColor"));
		var bgImage 			= (thebgImage != "none" && thebgImage!="initial") ? thebgImage : "";
		//var boxContent 		= $$.html();
		var borderColour 		= format_colour($$.css("borderTopColor")); 
		var borderString 		= borderWidth + "px" + " solid " + borderColour;
		
		var topMaxRadius = Math.max(settings.tl ? settings.tl.radius : 0, settings.tr ? settings.tr.radius : 0);
		var botMaxRadius = Math.max(settings.bl ? settings.bl.radius : 0, settings.br ? settings.br.radius : 0);
		
		$$.addClass('hasCorners').css({"padding":"0", "borderColor":box.style.borderColour, 'overflow':'visible'});
		if(box.style.position != "absolute") $$.css("position","relative");
		if(($.browser.msie)) {
			if($.browser.version==6 && box.style.width == "auto" && box.style.height == "auto") $$.css("width","100%");
			$$.css("zoom","1");
			$($$ +" *").css("zoom","normal");
		}		
		
		for(var t = 0;t < 2;t++) {
			switch(t) {
				case 0:
				if(settings.tl || settings.tr) {
					var newMainContainer 	= document.createElement("div");
					topContainer		= box.appendChild(newMainContainer);
					$(topContainer).css({ width:"100%", "font-size":"1px", overflow:"hidden", position:"absolute", "padding-left":borderWidth, "padding-right":borderWidth, height:topMaxRadius + "px",top:0 - topMaxRadius + "px",left:0 - borderWidth + "px"}).addClass('topContainer');
				};
				break;
				case 1:
				if(settings.bl || settings.br) {
					var newMainContainer 	= document.createElement("div");
					bottomContainer	= box.appendChild(newMainContainer);
					$(bottomContainer).css({ width:"100%", "font-size":"1px", overflow:"hidden", position:"absolute", "padding-left":borderWidth, "padding-right":borderWidth, height:botMaxRadius,bottom:0 - botMaxRadius + "px",left:0 - borderWidth + "px"}).addClass('bottomContainer');
				};
				break;
			};
		};
		
		if(settings.autoPad == true) {
			//$$.html("");
			var contentContainer = document.createElement("div");
			var contentContainer2 = document.createElement("div");
			var clearDiv = document.createElement("div");
			
			$(contentContainer2).css({ margin:"0","padding-bottom":boxPaddingBottom,"padding-top":boxPaddingTop,"padding-left":boxPaddingLeft,"padding-right":boxPaddingRight, 'overflow':'visible'}).addClass('hasBackgroundColor content_container');

			$(contentContainer).css({position:"relative", 'float':"left",width:"100%", "margin-top":"-" + (topMaxRadius-borderWidth) + "px", "margin-bottom":"-" + (botMaxRadius-borderWidth) + "px"}).addClass = "autoPadDiv";
			
			$(clearDiv).css("clear","both");

			contentContainer2.appendChild(contentContainer);
			contentContainer2.appendChild(clearDiv);
			$$.wrapInner(contentContainer2);
		};
		
		if(topContainer) $$.css("border-top",0);
		if(bottomContainer) $$.css("border-bottom",0);
		var corners = ["tr", "tl", "br", "bl"];
		for(var i in corners) {
			if(i > -1 < 4) {
				var cc = corners[i];
				if(!settings[cc]) {

					if(((cc == "tr" || cc == "tl") && topContainer != null) || ((cc == "br" || cc == "bl") && bottomContainer != null)) {
						var newCorner = document.createElement("div");
						$(newCorner).css({position:"relative","font-size":"1px", overflow:"hidden"});
						
						if(bgImage == "")
							$(newCorner).css("background-color",boxColour);
						else
							$(newCorner).css("background-image",bgImage).css("background-color",boxColour);;

						switch(cc)
						{
							case "tl":							
								$(newCorner).css({height:topMaxRadius - borderWidth,"margin-right":settings.tr.radius - (borderWidth*2), "border-left":borderString,"border-top":borderString,left:-borderWidth + "px", "background-repeat":$$.css("background-repeat"), "background-position":borderWidth + "px 0px"});
							break;
							case "tr":
								$(newCorner).css({height:topMaxRadius - borderWidth,"margin-left":settings.tl.radius - (borderWidth*2), "border-right":borderString,"border-top":borderString,left:borderWidth + "px", "background-repeat":$$.css("background-repeat"), "background-position":"-" + (topMaxRadius + borderWidth) + "px 0px"});
							break;
							case "bl":
								if(topMaxRadius>0)
									$(newCorner).css({height:botMaxRadius - borderWidth,"margin-right":settings.br.radius - (borderWidth*2), "border-left":borderString,"border-bottom":borderString,left:-borderWidth + "px", "background-repeat":$$.css("background-repeat"), "background-position":"0px -" + ($$.height() + topMaxRadius  - borderWidth +1) + "px" });
								else
									$(newCorner).css({height:botMaxRadius - borderWidth,"margin-right":settings.br.radius - (borderWidth*2), "border-left":borderString,"border-bottom":borderString,left:-borderWidth + "px", "background-repeat":$$.css("background-repeat"), "background-position":"0px -" + ($$.height()) + "px" });
							break;
							case "br":
								if(topMaxRadius>0)
									$(newCorner).css({height:botMaxRadius - borderWidth,"margin-left":settings.bl.radius - (borderWidth*2), "border-right":borderString,"border-bottom":borderString,left:borderWidth + "px", "background-repeat":$$.css("background-repeat"),  "background-position":"-" + settings.bl.radius + borderWidth + "px -" + ($$.height() + topMaxRadius  - borderWidth + 1) + "px" });
								else
									$(newCorner).css({height:botMaxRadius - borderWidth,"margin-left":settings.bl.radius - (borderWidth*2), "border-right":borderString,"border-bottom":borderString,left:borderWidth + "px", "background-repeat":$$.css("background-repeat"),  "background-position":"-" + settings.bl.radius + borderWidth + "px -" + ($$.height()) + "px" });
							break;
						};
					};
				} else {
					if(masterCorners[settings[cc].radius]) {
						var newCorner = masterCorners[settings[cc].radius].cloneNode(true);
					} else {
						var newCorner = document.createElement("DIV");
						$(newCorner).css({	height:settings[cc].radius,width:settings[cc].radius,position:"absolute","font-size":"1px",overflow:"hidden"	});
						var borderRadius = parseInt(settings[cc].radius - borderWidth);
						for(var intx = 0, j = settings[cc].radius; intx < j; intx++) {
							if((intx +1) >= borderRadius)
								var y1 = -1;
							else
								var y1 = (Math.floor(Math.sqrt(Math.pow(borderRadius, 2) - Math.pow((intx+1), 2))) - 1);
							if(borderRadius != j) {
								if((intx) >= borderRadius)
								var y2 = -1;
								else
								var y2 = Math.ceil(Math.sqrt(Math.pow(borderRadius,2) - Math.pow(intx, 2)));
								if((intx+1) >= j)
								var y3 = -1;
								else
								var y3 = (Math.floor(Math.sqrt(Math.pow(j ,2) - Math.pow((intx+1), 2))) - 1);
							};
							if((intx) >= j)
								var y4 = -1;
							else
								var y4 = Math.ceil(Math.sqrt(Math.pow(j ,2) - Math.pow(intx, 2)));
							if(y1 > -1) newCorner.appendChild(drawPixel(box,intx, 0, boxColour, 100, (y1+1), newCorner, -1, bgImage, settings[cc].radius, 0, borderWidth, boxWidth, settings));
							if(borderRadius != j) {
								for(var inty = (y1 + 1); inty < y2; inty++) {
									if(settings.antiAlias) {
										if(bgImage != "") {
											var borderFract = (pixelFraction(intx, inty, borderRadius) * 100);
											if(borderFract < 30) {
												newCorner.appendChild(drawPixel(box,intx, inty, borderColour, 100, 1, newCorner, 0, bgImage, settings[cc].radius, 1, borderWidth, boxWidth, settings));
											} else {
												newCorner.appendChild(drawPixel(box,intx, inty, borderColour, 100, 1, newCorner, -1, bgImage, settings[cc].radius, 1, borderWidth, boxWidth, settings));
											};
										} else {
											var pixelcolour = BlendColour(boxColour, borderColour, pixelFraction(intx, inty, borderRadius));
											newCorner.appendChild(drawPixel(box,intx, inty, pixelcolour, 100, 1, newCorner, 0, bgImage, settings[cc].radius, cc, 1, borderWidth, boxWidth, settings));
										};
									};
								};
								if(settings.antiAlias) {
									  if(y3 >= y2)
									  {
										 if (y2 == -1) y2 = 0;
										 newCorner.appendChild(drawPixel(box,intx, y2, borderColour, 100, (y3 - y2 + 1), newCorner, 0,bgImage, 0, 1, borderWidth, boxWidth, settings));
									  }
								} else {
									  if(y3 >= y1)
									  {
										  newCorner.appendChild(drawPixel(box,intx, (y1 + 1), borderColour, 100, (y3 - y1), newCorner, 0,bgImage, 0, 1, borderWidth, boxWidth, settings));
									  }
								};
								var outsideColour = borderColour;
							} else {
								var outsideColour = boxColour;
								var y3 = y1;
							};
							if(settings.antiAlias) {
								for(var inty = (y3 + 1); inty < y4; inty++) {
									newCorner.appendChild(drawPixel(box,intx, inty, outsideColour, (pixelFraction(intx, inty , j) * 100), 1, newCorner, ((borderWidth > 0)? 0 : -1),bgImage, settings[cc].radius, 1, borderWidth, boxWidth, settings));
								};                                
							};
						};
						masterCorners[settings[cc].radius] = newCorner.cloneNode(true);                                           
					};                    
					if(cc != "br") {
						for(var t = 0, k = newCorner.childNodes.length; t < k; t++) {
							var pixelBar 			= newCorner.childNodes[t];
							var pixelBarTop 		= strip_px($(pixelBar).css("top"));
							var pixelBarLeft 		= strip_px($(pixelBar).css("left"));
							var pixelBarHeight 		= strip_px($(pixelBar).css("height"));
							
							if(cc == "tl" || cc == "bl") {
								$(pixelBar).css("left",settings[cc].radius -pixelBarLeft -1 + "px");
							};
							
							if(cc == "tr" || cc == "tl") {
								$(pixelBar).css("top", settings[cc].radius -pixelBarHeight -pixelBarTop + "px");
							};
							
							switch(cc) {
								case "tr":
									$(pixelBar).css("background-position","-" + Math.abs((boxWidth - settings[cc].radius + borderWidth) + pixelBarLeft) + "px -" + Math.abs(settings[cc].radius -pixelBarHeight -pixelBarTop - borderWidth) + "px");
								break;
								case "tl":
									$(pixelBar).css("background-position","-" + Math.abs((settings[cc].radius -pixelBarLeft -1) - borderWidth) + "px -" + Math.abs(settings[cc].radius -pixelBarHeight -pixelBarTop - borderWidth) + "px");
								break;
								case "bl":
									if(topMaxRadius>0)
										$(pixelBar).css("background-position", "-" + Math.abs((settings[cc].radius -pixelBarLeft -1) - borderWidth) + "px -" + Math.abs(($$.height() + topMaxRadius - borderWidth + 1)) + "px");
									else
										$(pixelBar).css("background-position", "-" + Math.abs((settings[cc].radius -pixelBarLeft -1) - borderWidth) + "px -" + Math.abs(($$.height())) + "px");
								break;
							};
						};
					};
				};
				
				if(newCorner) {
					switch(cc) {
						case "tl":
						if($(newCorner).css("position") == "absolute") $(newCorner).css("top","0");
						if($(newCorner).css("position") == "absolute") $(newCorner).css("left","0");
						if(topContainer) topContainer.appendChild(newCorner);
						break;
						case "tr":
						if($(newCorner).css("position") == "absolute") $(newCorner).css("top","0");
						if($(newCorner).css("position") == "absolute") $(newCorner).css("right","0");
						if(topContainer) topContainer.appendChild(newCorner);
						break;
						case "bl":
						if($(newCorner).css("position") == "absolute") $(newCorner).css("bottom","0");
						if(newCorner.style.position == "absolute") $(newCorner).css("left","0");
						if(bottomContainer) bottomContainer.appendChild(newCorner);
						break;
						case "br":
						if($(newCorner).css("position") == "absolute") $(newCorner).css("bottom","0");
						if($(newCorner).css("position") == "absolute") $(newCorner).css("right","0");
						if(bottomContainer) bottomContainer.appendChild(newCorner);
						break;
					};                    
				};
			};
		};
		
		var radiusDiff = new Array();
		radiusDiff["t"] = Math.abs(settings.tl.radius - settings.tr.radius);
		radiusDiff["b"] = Math.abs(settings.bl.radius - settings.br.radius);
		for(z in radiusDiff) {
			if(z == "t" || z == "b") {
				if(radiusDiff[z]) {
					var smallerCornerType = ((settings[z + "l"].radius < settings[z + "r"].radius)? z +"l" : z +"r");
					var newFiller = document.createElement("div");
					$(newFiller).css({	height:radiusDiff[z],width:settings[smallerCornerType].radius+ "px",position:"absolute","font-size":"1px",overflow:"hidden","background-color":boxColour,"background-image":bgImage	});
				  switch(smallerCornerType)
				  {
					  case "tl":
						$(newFiller).css({"bottom":"0","left":"0","border-left":borderString,"background-position":"0px -" + (settings[smallerCornerType].radius - borderWidth )});
						topContainer.appendChild(newFiller);
						break;
	
					  case "tr":
						$(newFiller).css({"bottom":"0","right":"0","border-right":borderString,"background-position":"0px -" + (settings[smallerCornerType].radius - borderWidth ) + "px"});
						topContainer.appendChild(newFiller);
						break;
	
					  case "bl":
						$(newFiller).css({"top":"0","left":"0","border-left":borderString,"background-position":"0px -" + ($$.height() + settings[smallerCornerType].radius - borderWidth )});
						bottomContainer.appendChild(newFiller);
						break;
	
					  case "br":
						$(newFiller).css({"top":"0","right":"0","border-right":borderString,"background-position":"0px -" + ($$.height() + settings[smallerCornerType].radius - borderWidth )});
						bottomContainer.appendChild(newFiller);
						
						break;
				  }
			};
				
			var newFillerBar = document.createElement("div");
			$(newFillerBar).css({	position:"relative","font-size":"1px",overflow:"hidden","background-color":boxColour,"background-image":bgImage,"background-repeat":$$.css("background-repeat")});
			switch(z) {
					case "t":
					if(topContainer) {
						if(settings.tl.radius && settings.tr.radius) {
							$(newFillerBar).css({
												height:topMaxRadius - borderWidth + "px",
												"margin-left":settings.tl.radius - borderWidth  + "px",
												"margin-right":settings.tr.radius - borderWidth  + "px",
												"border-top":borderString
							}).addClass('hasBackgroundColor');
						
							if(bgImage != "")
								$(newFillerBar).css("background-position","-" + (topMaxRadius + borderWidth) + "px 0px");
							
							topContainer.appendChild(newFillerBar);
							
						}; 
						$$.css("background-position", "0px -" + (topMaxRadius - borderWidth +1) + "px"); 
					}; 
					break;
					case "b":
					if(bottomContainer) {
						if(settings.bl.radius && settings.br.radius) {
							$(newFillerBar).css({	
												height:botMaxRadius - borderWidth + "px",
												"margin-left":settings.bl.radius - borderWidth + "px",
												"margin-right":settings.br.radius - borderWidth + "px",
												"border-bottom":borderString
							});
						
							if(bgImage != "" && topMaxRadius>0)
								$(newFillerBar).css("background-position","-" + (settings.bl.radius - borderWidth) + "px -" + ($$.height() + topMaxRadius - borderWidth + 1) + "px");
							else
								$(newFillerBar).css("background-position","-" + (settings.bl.radius - borderWidth) + "px -" + ($$.height() ) + "px").addClass('hasBackgroundColor');
							
							bottomContainer.appendChild(newFillerBar);
						};
					};
					break;
				};
			};
		};
		$$.prepend(topContainer);
		$$.prepend(bottomContainer);
	}

	var settings = {
	  tl: { radius: 8 },
	  tr: { radius: 8 },
	  bl: { radius: 8 },
	  br: { radius: 8 },
	  antiAlias: true,
	  autoPad: true,
	  validTags: ["div"] };
	if ( options && typeof(options) != 'string' )
		$.extend(settings, options);
            
	return this.each(function() {
		if (!$(this).is('.hasCorners')) {
			applyCorners(this, settings);				
		}
		
	}); 
			
};
})(jQuery);