const container = document.querySelector('.container');
const numBalls = 20; // 小球数量
const balls = [];
const ballCountElement = document.getElementById('ballCount');
const demonCircle = document.querySelector('.demon-circle');
let demonCircleX = 0;
let demonCircleY = 0;
let isDragging = false; // 标识是否正在拖动
let offsetX, offsetY;

// 创建小球的函数
function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ball.size = 20;
    ball.x = Math.random() * (container.clientWidth - ball.size);
    ball.y = Math.random() * (container.clientHeight - ball.size);
    ball.velocityX = (Math.random() * 4) + 1;
    ball.velocityY = (Math.random() * 4) + 1;
    balls.push(ball);
    container.appendChild(ball);
}

// 初始化小球
for (let i = 0; i < numBalls; i++) {
    createBall();
}

// 更新小球数量显示
function updateBallCount() {
    ballCountElement.textContent = balls.length;
}

// 碰撞检测函数
function checkCollision(ball) {
    const dx = ball.x - (demonCircleX + demonCircle.offsetWidth / 2);
    const dy = ball.y - (demonCircleY + demonCircle.offsetHeight / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果小球与恶魔圈的距离小于半径之和，则小球被吃掉
    if (distance < (ball.size / 2 + demonCircle.offsetWidth / 2)) {
        container.removeChild(ball);
        balls.splice(balls.indexOf(ball), 1);
        updateBallCount();
    }
}

// 碰撞检测两个小球的函数
function checkBallCollision(ballA, ballB) {
    const dx = ballA.x - ballB.x;
    const dy = ballA.y - ballB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 如果碰撞发生
    if (distance < (ballA.size / 2 + ballB.size / 2)) {
        
        const angle = Math.atan2(dy, dx);
        
        
        const speedA = Math.sqrt(ballA.velocityX ** 2 + ballA.velocityY ** 2);
        const speedB = Math.sqrt(ballB.velocityX ** 2 + ballB.velocityY ** 2);
        
        
        ballA.velocityX = speedB * Math.cos(angle);
        ballA.velocityY = speedB * Math.sin(angle);
        ballB.velocityX = speedA * Math.cos(angle + Math.PI);
        ballB.velocityY = speedA * Math.sin(angle + Math.PI);

        
        const overlap = (ballA.size / 2 + ballB.size / 2) - distance;
        ballA.x += (overlap / 2) * Math.cos(angle);
        ballA.y += (overlap / 2) * Math.sin(angle);
        ballB.x -= (overlap / 2) * Math.cos(angle);
        ballB.y -= (overlap / 2) * Math.sin(angle);

        
        ballA.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ballB.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
}

// 动画循环
function animate() {
    balls.forEach(ball => {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // 碰撞检测边界
        if (ball.x <= 0) {
            ball.x = 0;
            ball.velocityX = -ball.velocityX;
        }
        if (ball.x >= container.clientWidth - ball.size) {
            ball.x = container.clientWidth - ball.size;
            ball.velocityX = -ball.velocityX;
        }
        if (ball.y <= 0) {
            ball.y = 0;
            ball.velocityY = -ball.velocityY;
        }
        if (ball.y >= container.clientHeight - ball.size) {
            ball.y = container.clientHeight - ball.size;
            ball.velocityY = -ball.velocityY;
        }

        // 更新小球位置
        ball.style.left = ball.x + 'px';
        ball.style.top = ball.y + 'px';

        // 检查小球与恶魔圈的碰撞
        checkCollision(ball);
    });

    // 检查小球之间的碰撞
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            checkBallCollision(balls[i], balls[j]);
        }
    }

    requestAnimationFrame(animate);
}

// 鼠标左键按下事件
demonCircle.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // 检查是否为左键
        event.preventDefault(); // 防止右键菜单出现
        isDragging = true;
        offsetX = event.clientX - demonCircle.getBoundingClientRect().left;
        offsetY = event.clientY - demonCircle.getBoundingClientRect().top;
    }
});

// 鼠标移动事件
container.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = container.getBoundingClientRect();
        demonCircleX = event.clientX - rect.left - offsetX; // 更新X坐标
        demonCircleY = event.clientY - rect.top - offsetY; // 更新Y坐标

        // 更新恶魔圈的位置
        demonCircle.style.left = `${demonCircleX}px`;
        demonCircle.style.top = `${demonCircleY}px`;
    }
});

// 鼠标左键释放事件
document.addEventListener('mouseup', (event) => {
    if (event.button === 0) { // 检查是否为左键
        isDragging = false;
    }
});

// 禁用右键菜单
container.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

updateBallCount();
animate();
