{
	id:2,
	name:"Tetris",
	frameRate:8,
	WIDTH:12,
	HEIGHT:18,
	map:[],
	score:0,
	shapes:[[4,0,4,1,5,1,6,1],[4,1,5,1,6,1,6,0],[4,0,5,0,5,1,6,1],[4,1,5,0,5,1,6,0],[5,0,4,1,5,1,6,1],[4,0,5,0,6,0,7,0],[5,0,6,0,5,1,6,1]],
	isRunning:false,
	isOver:false,
	util:{
		randBetween:function(a,b){
			return Math.round(a+Math.random()*(b-a));
		},
		copyObject:function(object){
			return JSON.parse(JSON.stringify(object));
		}
	},
	currentShape:{
		model:null,
		move:function(x,y){
			y = y||0;
			for(var i =0;i<this.model.length;i+=2){
				this.model[i]+=x;
				this.model[i+1]+=y;
			}
		},
		transform:function(){
			var m =this.model,l = m.length,c = 4,x = m[c],y = m[c+1],min = 0,max = 0;
			if(Math.abs(m[2]-m[4])==1 && Math.abs(m[3]-m[5])==1) return;	
			for (var i=0;i<l;i=i+2){
				if(i == c) continue;
				var mx = m[i]- x,
				my = m[i+1] - y,
				nx = -my,
				ny = mx;
				m[i]=x+nx;
				m[i+1]=y+ny;
				max=Math.max(m[i]-11,max);
				min=Math.min(m[i],min);
			}
			for (var i=0;i<l;i=i+2){
				m[i]-=min;
				m[i]-=max;
			}
		}
	},
	nextShape:null,
	fullRowCheck:function(){
		for(var i = 0,l = this.map.length;i<l;i++){
			if(Math.min.apply(null,this.map[i])==1){
				this.map.splice(i,1);
				this.score+=1;
				this.map.unshift([0,0,0,0,0,0,0,0,00,0,0]);
			}
		}
	},
	init:function(){
		this.map = [];
		for(var i = 0;i<this.HEIGHT;i++){
			var single = [];
			for(var j = 0;j<this.WIDTH;j++){
				single.push(0);
			}
			this.map.push(single);
		}
	},
	act:function(){
		if(!this.isRunning||this.map==undefined){
			
			return;
		};
		
		var isEnd = false,isOver = false;
		for(var i = 0,sl = this.currentShape.model.length;i<sl;i+=2){
			var x = this.currentShape.model[i];
			var y = this.currentShape.model[i+1];
			if(y>=17){
				isEnd = true;
				break;
			}
			if(this.map[y+1][x]==1){
				isEnd = true;
				if(y<=1) isOver = true;
				break;
			}
		}
		if(isEnd){
			for(var i = 0;i<this.currentShape.model.length;i+=2){
				this.map[this.currentShape.model[i+1]][this.currentShape.model[i]] = 1;
			}
			this.fullRowCheck();
			this.currentShape.model = JSON.parse(JSON.stringify(this.nextShape));
			this.nextShape = this.util.copyObject(this.shapes[this.util.randBetween(0,6)]);
			
		}else{
			this.currentShape.move(0,1); 
		}
		if(isOver){
			this.isOver = true;
		}
	},
	
	
	start:function(){
		this.init();
		App.log("I","初始化完成");
		this.currentShape.model = this.util.copyObject(this.shapes[this.util.randBetween(0,6)]);
		this.nextShape = this.util.copyObject(this.shapes[this.util.randBetween(0,6)]);
	},
	timer:0,
	drawGui:function(canvas,paint){
		if(!this.isRunning){
			canvas.drawText("Start",14,15,paint);
			return;
		}else{
			if(this.isOver){
				canvas.drawText("Again",13,15,paint);
				return;
			}
		}
		this.timer++;

		if(this.timer==2){
			this.act();
			this.timer = 0;
		}
		
		canvas.drawLine(12,4,12,this.HEIGHT+4,paint);
		canvas.drawLine(this.WIDTH+13,4,this.WIDTH+13,this.HEIGHT+4,paint);
		canvas.drawLine(12,this.HEIGHT+4,this.WIDTH+14,this.HEIGHT+4,paint);
		canvas.drawLine(12,3,this.WIDTH+14,3,paint);
		
		for(var i = 0;i<this.HEIGHT;i++)
		for(var j = 0;j<this.WIDTH;j++){
			if(this.map[i][j]==1){
				canvas.drawPoint(j+13,i+4,paint);
			}
		}
		for(var i = 0;i< this.currentShape.model.length;i+=2){
			var x = this.currentShape.model[i];
			var y = this.currentShape.model[i+1];
			canvas.drawPoint(x+13,y+4,paint);
		}
		
		for(var i = 0;i<this.nextShape.length;i+=2){
			var x = this.nextShape[i];
			var y = this.nextShape[i+1];
			canvas.drawPoint(this.WIDTH+x+12,6+y,paint);
		}
		
		canvas.drawText(this.score,this.WIDTH+16,16,paint);
	},
	keyEvent:function(keyWord){
		switch(keyWord){
			case "Debug":
				break;
			case "Enter":
				this.isRunning = true;
				if(this.isOver){
					this.isOver = false;
					this.score = 0;
					this.start();
				}
				break;
			case "Back":
				App.startApplication("Home.js");
				break;
			case "Space":
				this.currentShape.transform();
				break;
			case "←":
				var over = false,model = this.currentShape.model;
				for(var i = 0,l = model.length;i<l;i+=2){
					if(model[i]<=0||this.map[model[i+1]][model[i]-1]==1){
						over = true;
						break;
					}
				}
				if(!over) this.currentShape.move(-1,0);
				break;
			case "→":
				var over = false,model = this.currentShape.model;
				for(var i = 0;i< model.length;i+=2){
					if(model[i]>=11||this.map[model[i+1]][model[i]+1]==1){
						over = true;
						break;
					}
				}
				if(!over) this.currentShape.move(1,0);
				break;
		}
	},
	end:function(){
		this.start = null;
		this.drawGui = null;
		this.keyEvent = null;
		this.currentShape = null;
		this.util = null;
		this.init = null;
	}
}