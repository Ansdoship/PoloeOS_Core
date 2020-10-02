{
	id:1,
	name:"Home",
	frameRate:5,
	commandStr:"",
	commandResult:"",
	date:new java.util.Date(),
	timer:0,
	start:function(){
		App.toast("Home has been started");
		App.playSound("os.start",30,12);
		
		this.commandStr = "";
		this.commandResult = "";
	},
	drawGui:function(canvas,paint){
		paint.setStyle(Paint.Style.FILL);
		
		canvas.drawPoint(4,3,paint);
		canvas.drawLine(3,4,6,4,paint);
		canvas.drawLine(2,5,7,5,paint);
		canvas.drawRect(3,6,6,8,paint);
		
		canvas.drawText((new java.text.SimpleDateFormat("HH:mm")).format(this.date),10,8,paint);
		
		if(this.timer==5){
			this.date = new java.util.Date();
			canvas.drawRect(34,6,36,8,paint);
			this.timer = 0;
		}
		this.timer++;
		
		var textWidth = paint.measureText(this.commandStr+"_");
		if(textWidth>=OS.SCREEN_WIDTH){
			canvas.drawText(this.commandStr+"_",OS.SCREEN_WIDTH-textWidth,25,paint);
		}
		else{
			canvas.drawText(this.commandStr+"_",0,25,paint);
		}
		canvas.drawText(this.commandResult,0,15,paint);
		canvas.drawLine(0,17,OS.SCREEN_WIDTH,17,paint);
	},
	keyEvent:function(keyWord){
		if(keyWord=="Back"){
			if(this.commandStr.length>1)
				this.commandStr = this.commandStr.substr(0,this.commandStr.length-1);
			else
				this.commandStr = "";
		}
		else if(keyWord=="Enter"){
			App.log("I","指令:"+this.commandStr);			
			var cmd = this.commandStr.split(" ");
			var result = this.event.command(cmd);
			App.log("I","结果:"+result);
			this.commandStr = "";
			this.commandResult = result;
		}
		else if(keyWord=="Space"){
			this.commandStr+=" ";
		}
		else if(keyWord=="F"||keyWord=="Q"){
			return;
		}
		else{
			this.commandStr+=keyWord;
		}
	},
	end:function(){
		this.date = null;
		this.start = null;
		this.drawGui = null;
		this.keyEvent = null;
		this.event = null;
	},
	event:{
		command:function(cmd){
			if(cmd[0]=="run"){
				App.startApplication(cmd[1]);
				return "ok";
			}
			else{
				return "err";
			}
		}
	}
}