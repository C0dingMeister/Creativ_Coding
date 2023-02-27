const myImage = document.getElementById('myImage')


myImage.addEventListener('load' ,function(){
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 706;
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0.1, 'black')
    gradient.addColorStop(0.4, 'red')
    gradient.addColorStop(0.1, 'wheat')
    gradient.addColorStop(0.1, 'grey')
    context.drawImage(myImage, 0, 0, canvas.width, canvas.height) 
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height) 
    const letters = ['K','A','L'];
    let swithcer = 1;
    let counter = 0;
    setInterval(()=>{
        counter++;
        if(counter%12 === 0){
            swithcer *= -1;
        }

    },600)
    let particlesArray = [];
    const numberOfParticles = 2000;


    let mappedImage = [];
    for(let y = 0; y < canvas.height; y++){
        let row = [];
        for (let x = 0; x < canvas.width; x++){
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
            const brightness = calculateRelativeBrightness(red, green, blue);
            const cell = [
                cellBrightness = brightness,
                cellColor = 'rgb(' + red + ',' + green + ',' + blue + ')' 
            ];
            row.push(cell);
        }
        mappedImage.push(row);
    }

    function calculateRelativeBrightness(red, green, blue){
        return Math.sqrt(
            (red* red) * 0.299 +
            (green *green) * 0.587 +
            (blue * blue) * 0.114
        )/100;
    }
    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = 0
            this.speed = 0;
            this.velocity = Math.random() * 0.5;
            this.size = Math.random() * 1.5 + 1;
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.angle = 0;
            this.letter = letters[Math.floor(Math.random() * letters.length)]
            this.random = Math.random();
        }
        update(){
            this.position1 = Math.floor(this.y)
            this.position2 = Math.floor(this.x)
            if((mappedImage[this.position1])&&(mappedImage[this.position1][this.position2])){
                this.speed = mappedImage[this.position1][this.position2][0];
            }
            let movement = ((2.5-this.speed) + this.velocity);
            this.angle+=this.speed * 2
            this.size = this.speed * 1.0

            if(swithcer === 1){
                context.globalCompositeOperation = 'source-atop'
            }else{
                context.globalCompositeOperation = 'screen'
            }
            // if(counter % 10 === 0){
            //     this.y = 0;
            //     this.x = Math.random() * canvas.width;
            // }
            this.y+= movement + Math.sin(this.angle)
            // this.x+= movement + Math.cos(this.angle)
            if(this.y >= canvas.height){
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
            if(this.x >= canvas.width){
                this.x = 0;
                this.y = Math.random() * canvas.height;
            }
        }
        draw(){
            context.beginPath();
            if((mappedImage[this.position1])&&(mappedImage[this.position1][this.position2])){
                context.fillStyle = mappedImage[this.position1][this.position2][1]
                context.strokeStyle = mappedImage[this.position1][this.position2][1]
            }
            // context.fillStyle = gradient
            // context.fillStyle = 'white'
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // context.strokeRect(this.x, this.y, this.size, this.size)
            // if(this.random < 0.1){
            //     context.fillText(this.letter, this.x, this.y);
            // }else{
            //     context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // }
            context.fill()
        }
    }
    function init(){
        for (let index = 0; index < numberOfParticles; index++) {
            particlesArray.push(new Particle())
            
        }
    }
    init();
    function animate(){
        context.globalAlpha = 0.04;
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect(0,0,canvas.width, canvas.height);
        context.globalAlpha = 0.2;
        for (let i= 0; i < particlesArray.length; i++){
            particlesArray[i].update();
            context.globalAlpha =  particlesArray[i].speed * 2
            // context.globalAlpha = 1;
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate)
    }
    animate()
});
    

