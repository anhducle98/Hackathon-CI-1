class Controllers {
    constructor(x, y, spriteName, group, target, configs) {
        this.sprite = group.create(x, y, 'assets', spriteName);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width /= 2;
        this.sprite.height /= 2;
        this.sprite.anchor.setTo(0.5, 0.5);
        let radius = (this.sprite.width + this.sprite.height) / 5;
        this.sprite.body.setCircle(radius, this.sprite.width / 3 * 2, this.sprite.height / 3 * 2);
        this.velocity = new Phaser.Point(0, 0);

        this.configs = configs;
        this.target = target;

        this.WOBBLE_LIMIT = configs.WOBBLE_LIMIT; // degrees
        this.WOBBLE_SPEED = configs.WOBBLE_SPEED; // milliseconds
        this.wobble = this.WOBBLE_LIMIT;
        let tween = Global.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );
        Global.tweensContainer.push(tween);
    }

    update(shift) {
        var direction = new Phaser.Point(
            this.target.x - this.sprite.x,
            this.target.y - this.sprite.y
        );

        var currentAngle = Global.game.math.radToDeg(
            Global.game.math.angleBetween(
                0, 0,
                this.velocity.x, this.velocity.y
            )
        );

        var directionAngle = Global.game.math.radToDeg(
            Global.game.math.angleBetween(
                0, 0,
                direction.x, direction.y
            )
        );

        var delta = directionAngle - currentAngle;

        if(delta > 180) delta -= 360;
        if(delta < -180) delta += 360;

        var maxDelta = this.configs.turnRate * Global.game.time.physicsElapsed;
        if(delta > maxDelta) delta = maxDelta;
        if(delta < -maxDelta) delta = -maxDelta;

        var newAngle = currentAngle + delta;
        newAngle += this.wobble;

        var newDirection = new Phaser.Point(
            Math.cos(Global.game.math.degToRad(newAngle)),
            Math.sin(Global.game.math.degToRad(newAngle))
        );

        this.velocity = newDirection.setMagnitude(this.configs.speed);
        this.sprite.angle = Math.atan2(newDirection.x, -newDirection.y) * (180 / Math.PI);

        this.sprite.x += this.velocity.x;
        this.sprite.y += this.velocity.y;

        if (shift != null) {
            this.sprite.x += shift.x;
            this.sprite.y += shift.y;
        }
    }
}
