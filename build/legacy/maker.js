const width=1500;
const height=1000;

function room(x,y,width,height){
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
}

function add(){
	var parent=document.getElementById("lines");
	var element=document.createElement("p");
	var lineNum=parent.children.length+1;
	var innerHTML='<textarea id="line'+lineNum+'" placeholder="発言'+lineNum+'"></textarea>';
	element.innerHTML=innerHTML;
	parent.appendChild(element);
}

function check(){
	var lines=[];
	for(var i=1; i<=document.getElementById("lines").children.length; i++){
		if(!document.getElementById("line"+i).value==""){
			lines.push(document.getElementById("line"+i).value);
		}
	}
	if(lines.length==0){
		for(var i=0;i<20;i++){
			lines.push("発言を\n入力してください。");
		}
	}
	image(allocate(lines),lines);
}

function image(rooms,lines){
	var canvas=document.createElement("canvas");
	canvas.width=width;
	canvas.height=height;
	var ctx=canvas.getContext("2d");
	ctx.fillStyle="white";
	ctx.fillRect(0,0,width,height);
	ctx.fillStyle="gray";
	ctx.font="30px sans-serif";
	ctx.textAlign="end";
	ctx.textBaseline="bottom";
	ctx.fillText("発言まとめメーカー ",width,height);
	ctx.textAlign="start";
	ctx.textBaseline="top";
	ctx.fillStyle="black";
	for(var i=0; i<lines.length; i++){
		var rand=Math.random();
		var thickness="";
		if(rand>=0.3+0.05*i){
			thickness="bold ";
		}
		write(ctx,rooms[i],lines[i],thickness);
	}
	document.getElementById("image").innerHTML ='<img src="'+canvas.toDataURL("image/jpeg")+'">';
}

function allocate(lines){
	var rooms=[new room(0,0,width,height)];
	var num=lines.length;
	for(var i=num-1;i>0;){
		if(Math.random()<=0.75){
			divide(rooms,i);
			i=num-rooms.length;
		}else{
			idle(rooms);
		}
	}
	return rooms;
}

function divide(rooms,num){
	if(num==0){
		return 1;
	}else if(num==1){
		var rand=Math.floor(Math.random()*2);
		if(rand==0){
			rooms.push(
				new room(rooms[0].x, rooms[0].y, rooms[0].width/2, rooms[0].height), 
				new room(rooms[0].x+rooms[0].width/2, rooms[0].y, rooms[0].width/2, rooms[0].height)
				);
		}else if(rand==1){
			rooms.push(
				new room(rooms[0].x, rooms[0].y, rooms[0].width, rooms[0].height/2),
				new room(rooms[0].x, rooms[0].y+rooms[0].height/2, rooms[0].width, rooms[0].height/2)
				);
		}
	}else if(num>=2){
		var rand=Math.floor(Math.random()*3);
		if(rooms[0].width>=rooms[0].height){
			if(rand==0){
				rooms.push(
					new room(rooms[0].x,rooms[0].y,rooms[0].width/3,rooms[0].height),
					new room(rooms[0].x+rooms[0].width*2/3,rooms[0].y,rooms[0].width/3,rooms[0].height),
					new room(rooms[0].x+rooms[0].width/3,rooms[0].y,rooms[0].width/3,rooms[0].height)
					);
			}else if(rand==1){
				rooms.push(
					new room(rooms[0].x+rooms[0].width/3,rooms[0].y,rooms[0].width*2/3,rooms[0].height/2),
					new room(rooms[0].x,rooms[0].y,rooms[0].width/3,rooms[0].height),
					new room(rooms[0].x+rooms[0].width/3,rooms[0].y+rooms[0].height/2,rooms[0].width*2/3,rooms[0].height/2)
					);
			}else if(rand==2){
				rooms.push(
					new room(rooms[0].x,rooms[0].y,rooms[0].width*2/3,rooms[0].height/2),
					new room(rooms[0].x+rooms[0].width*2/3,rooms[0].y,rooms[0].width/3,rooms[0].height),
					new room(rooms[0].x,rooms[0].y+rooms[0].height/2,rooms[0].width*2/3,rooms[0].height/2)
					);
			}
		}else if(rooms[0].width<rooms[0].height){
			if(rand==0){
				rooms.push(
					new room(rooms[0].x,rooms[0].y,rooms[0].width,rooms[0].height/3),
					new room(rooms[0].x,rooms[0].y+rooms[0].height*2/3,rooms[0].width,rooms[0].height/3),
					new room(rooms[0].x,rooms[0].y+rooms[0].height/3,rooms[0].width,rooms[0].height/3)
					);
			}else if(rand==1){
				rooms.push(
					new room(rooms[0].x,rooms[0].y+rooms[0].height/3,rooms[0].width/2,rooms[0].height*2/3),
					new room(rooms[0].x,rooms[0].y,rooms[0].width,rooms[0].height/3),
					new room(rooms[0].x+rooms[0].width/2,rooms[0].y+rooms[0].height/3,rooms[0].width/2,rooms[0].height*2/3)
					);
			}else if(rand==2){
				rooms.push(
					new room(rooms[0].x,rooms[0].y,rooms[0].width/2,rooms[0].height*2/3),
					new room(rooms[0].x,rooms[0].y+rooms[0].height*2/3,rooms[0].width,rooms[0].height/3),
					new room(rooms[0].x+rooms[0].width/2,rooms[0].y,rooms[0].width/2,rooms[0].height*2/3)
					);
			}
		}
	}
	rooms.shift();
}

function idle(rooms){
	rooms.push(rooms[0]);
	rooms.shift();
}

function write(ctx,room,line,thickness){
	if(room.width>=room.height){
		horizontal(ctx,room,line,thickness);
	}else{
		vertical(ctx,room,line,thickness);
	}
}

function horizontal(ctx,room,line,thickness=""){
	var lineList=line.split("\n");
	var fontSize=Math.min(room.height/lineList.length,room.width/Math.max.apply(null,lineList.map(function(value){
	return value.length;
	})));
	ctx.font=thickness+fontSize+"px 'Yu Mincho', 'Hiragino Mincho ProN', serif";
	var charSize=ctx.measureText("あ").width;
	var x=room.x+Math.random()*5-2;
	var y=room.y+(room.height-charSize*lineList.length)/2+Math.random()*5-2;
	for(var i=0;i<lineList.length;i++){
		ctx.fillText(lineList[i],x,y+charSize*i);
	}
}

function vertical(ctx,room,line,thickness=""){
	line=line.replace(/\(/g,"︵");
	line=line.replace(/\)/g,"︶");
	line=line.replace(/（/g,"︵");
	line=line.replace(/）/g,"︶");
	line=line.replace(/「/g,"﹁");
	line=line.replace(/」/g,"﹂");
	line=line.replace(/『/g,"﹃");
	line=line.replace(/』/g,"﹄");
	line=line.replace(/,/g,"︐");
	line=line.replace(/、/g,"︑");
	line=line.replace(/。/g,"︒");
	line=line.replace(/…/g,"︙");
	line=line.replace(/ー/g,"丨");
	var lineList=line.split('\n');
	var fontSize=Math.min(room.width/lineList.length,room.height/Math.max.apply(null,lineList.map(function(value){
	return value.length;
	})));
	ctx.font=thickness+fontSize+"px 'Yu Mincho', 'Hiragino Mincho ProN', serif";
	var charSize=ctx.measureText("あ").width;
	var x=room.x+charSize*(lineList.length-1)+(room.width-charSize*lineList.length)/2+Math.random()*5-2;
	var y=room.y+Math.random()*5-2;
	for(var i=0;i<lineList.length;i++){
		for(var j=0;j<lineList[i].length;j++){
			ctx.fillText(lineList[i][j],x-charSize*i,y+charSize*j);
		}
	}
}