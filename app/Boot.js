{
	id:0,
	name:"Boot",
	frameRate:5,//帧率
	start:function(){
		
	},
	timer:0,
	drawGui:function(canvas,paint){
		if(this.timer<18){
			paint.setStyle(Paint.Style.STROKE);
			canvas.drawRect(12,12,36,14,paint);
			canvas.drawLine(12,13,this.timer+12,13,paint);
		}
		else{
			OS.startApplication("Home.js")
		}
		this.timer++;
	},
	keyEvent:function(keyWord){
		
	},
	end:function(){
		this.start = null;
		this.drawGui = null;
		this.keyEvent = null;
	}
}