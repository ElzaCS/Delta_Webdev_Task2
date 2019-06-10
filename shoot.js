var a=20;
var myRocks = [];
var myBullets = [];
var myCannon;
var dx=3;
var dy=3;
var bounce=210;
var score=0;
var crashRock="";
var crashCannon="";
var play=true;
var sc=0;
var help = document.querySelector('.help');
var paus = document.querySelector('.paus');
paus.addEventListener("click",fpause);
function fpause() {
	if (play) {
    	play=false;
		myGameArea.stop(); }
    else {
    	play=true;
        myGameArea.start(); }      
}
var re = document.querySelector('.re');
re.addEventListener("click",refresh);
function refresh() {
	document.location.reload();
    clearInterval(interval);
 }

function init() {
    myGameArea.start();
    myCannon=new component(0,130,225);
  }
  
var myGameArea = {
  canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.canvas.style.cursor = "none";
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = 'rgb(128, 159, 255)'; //blue
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgb(153, 153, 102)'; //grey
      this.context.fillRect(0, 0, this.canvas.width, bounce);
            
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(draw, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
       		 })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
       		 })
        
     },
    stop : function() {
        clearInterval(this.interval);
     }, 
    clear : function() {
        this.context.clearRect(0, 0, 300, 300);
    }
  }
  
  function component(n,x,y) {
    this.n=n;
    this.nc=0;
    this.x=x;
    this.y=y;
    this.dx=3;
    this.dy=3; 
    this.c=0;
    this.drawRock = function() {
     ctx = myGameArea.context;
      ctx.fillStyle="#e62e00"; //red
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);  //top left corner
      ctx.lineTo( this.x+(a/2), this.y-(a/2) );
      ctx.lineTo( this.x+(a/2)+a, this.y-(a/2) );
      ctx.lineTo( this.x+(a/2)+a+(a/2), this.y ); //top quad 
      ctx.lineTo( this.x+(a/2)+a+(a/2), this.y+a );
      ctx.lineTo( this.x+(a/2)+a, this.y+(a/2)+a );    
      ctx.lineTo( this.x+(a/2), this.y+(a/2)+a );    
      ctx.lineTo( this.x, this.y+a);  // bottom quad 
      ctx.fill();
      ctx.font = "16px Arial";
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(this.n, this.x+(a/2), this.y+(a/2));
      
    }
    this.newPos = function() {
        this.x += this.c;
    }
    this.newSpeed = function() {
    	if( this.x<0 || this.x>260) this.dx=-this.dx; //bounce rocks
    	if( this.y<0 || this.y>210) this.dy=-this.dy;
        this.dy += 0.2;  //gravity-like force
        this.n -=this.nc;  //decrease rock strength
        this.x += this.dx;  // to move rocks
    	this.y += this.dy;
    }
    this.drawCannon = function() {
      ctx = myGameArea.context;
      ctx.beginPath();
	ctx.arc((this.x+10), this.y, 2, 0, 2 * Math.PI); //to mark bullet source
    ctx.arc((this.x+35), this.y, 2, 0, 2 * Math.PI);
	ctx.stroke();
      ctx.save();
      var img = new Image();
	  img.src = 'http://4.bp.blogspot.com/-cg1jtrxaZ8Y/Ufl5SmFUVaI/AAAAAAAAAzg/PAaekSVbZ0g/s1600/F5S4.png';
      h1=this.x;
      h2=this.y;
 		img.onload = function () {
		  ctx.drawImage(img, h1,h2 , img.width/4, img.height/5);  // cannon image
	   }
       ctx.restore();
	} 
    this.drawBullets = function() {
    	ctx.fillStyle = "white";
        ctx.fillRect(this.x+15, this.y-10, 3, 10) ; // 2 streams of bullets
        ctx.fillRect(this.x+25, this.y-10, 3, 10) ;
    }
  }
  function crashes() {
  ctx = myGameArea.context;
  crashRock="";
  crashCannon="";
  var cx1=myCannon.x+10;  //head of shooter
  var cx2=myCannon.x+35;
  var rx1,rx2;
  for (i = 0; i < myRocks.length; i += 1) 
  {
  	rx1=myRocks[i].x;
    rx2=myRocks[i].x+(2*a);
   if ( ((cx1>rx1)&&(cx1<rx2)) || ((cx2>rx1)&&(cx2<rx2)) ) {  //if rock hits cannon
    if ( (myRocks[i].y+(1.5*a))>(myCannon.y) ) {
    crashCannon="cannon";
          }}
   for (j=0;j<myBullets.length;j+=1)
   {
   	if ( (myRocks[i].x<=myBullets[j].x+15) && (myBullets[j].x+15<=myRocks[i].x+(2*a)) )   //if bullets hit rock
    {
      myRocks[i].nc=1;
      score=score+1;
      myBullets.splice(j,1);
      crashRock="rock";
    } 
   } 
  }
  	ctx.font = "16px Arial";
    ctx.fillStyle = 'rgb(179, 209, 255)';
    ctx.fillText("Score: "+score, 8, 25); 
    
   if (crashCannon=="cannon") {
  	return crashCannon; }
   else if (crashRock=="rock") {
  	return crashRock; }
  }
  
  function draw() {
  var x,y;
  myGameArea.clear();
  myGameArea.frameNo += 1;
   myGameArea.context.fillStyle = 'rgb(128, 159, 255)';
  myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  myGameArea.context.fillStyle = 'rgb(153, 153, 102)';
  myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, bounce+30);
 for (i = 0; i < myRocks.length; i += 1) {
 	myRocks[i].nc=0;
 }
  if (myGameArea.frameNo == 1 || everyinterval(100)) {
    y = Math.round(1000*Math.random());
    x = Math.round(1000*Math.random());
    n = Math.round(100*Math.random());
    if (x%2==0) 
    	x=0;
    else
    	x=259;

    if (y<0)
        y=-1*y;
    while ( y>(bounce-(3*a)) ) {
        y=y-(bounce-(3*a)); }
        
     if (n<0) n=-n;
  myRocks.push(new component(n,x,y));
  }
  myCannon.c=0;   //to control using arrow keys
  if (myGameArea.keys && myGameArea.keys[37]) {myCannon.c = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) {myCannon.c = 2; }
    myCannon.newPos();
    myCannon.drawCannon();
  if (crashes()=="rock")
    { for (i = 0; i < myRocks.length; i += 1) {
    	if (myRocks[i].n==0)
        	myRocks.splice(i,1); 
    	}
     }
  else if (crashes()=="cannon")
   {   myGameArea.stop();
    	ctx.fillStyle = "black";
       ctx.fillRect(55,125,190, 50) ;
       ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+score, 65, 160); 
   }  //final score
  for (i = 0; i < myRocks.length; i += 1) { //to change rocks' position
      myRocks[i].newSpeed();
      myRocks[i].drawRock();
  }
  
    myBullets.push(new component(n,myCannon.x,myCannon.y)); //stream of bullets
    for (i = 0; i < myBullets.length; i += 1) { 
    inc=0;
    sp=30;
    if (score<500)
    	myBullets[i].y -= 30;  //bullets move up
    else if (score>=500 && score<700)
    	myBullets[i].y -= 20; 
    else
    	myBullets[i].y -= 15;  // rate depends on score
        myBullets[i].drawBullets();
    }
    
  }
  
  function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
