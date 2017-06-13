class WarningsContainer {
    constructor() {
        this.warnings = [];
        this.borders = [
            new Phaser.Line(0, 0, 0, Global.game.height),
            new Phaser.Line(0, 0, Global.game.width, 0),
            new Phaser.Line(Global.game.width, 0, Global.game.width, Global.game.height),
            new Phaser.Line(0, Global.game.height, Global.game.width, Global.game.height)
        ];
    }

    putWarning(item) {
        for (let i in this.borders) {
            let border = this.borders[i];
            let lineToTarget = new Phaser.Line(Global.player.sprite.x, Global.player.sprite.y, item.x, item.y);
            let point = lineToTarget.intersects(border, true);
            {
                let fileName = item.itemType == "Star" ? "WarningType2.png" : "WarningType1.png";
                if (item.itemType == "Missile") fileName = "ButtonPlay.png";

                let sprite = Global.warningsGroup.create(point ? point.x : 10, point ? point.y : 10, 'assets', fileName);
                sprite.anchor.setTo(0.5, 0.5);
                sprite.width = 30; sprite.height = 30;
                sprite.angle += i * 90;
                if (item.itemType == "Missile") sprite.angle += 180;
                sprite.AB = lineToTarget;
                sprite.CD = border;
                sprite.item = item;
                this.warnings.push(sprite);
                if (point == null) {
                    sprite.visible = false;
                }
            }
        }
    }

    intersect(sprite) {
        sprite.AB = new Phaser.Line(Global.player.sprite.x, Global.player.sprite.y, sprite.item.x, sprite.item.y);
        let point = sprite.AB.intersects(sprite.CD, true);
        return point;
    }

    insideMap(item) {
        return item.x >= 0 && item.y >= 0 && item.x <= Global.game.width && item.y <= Global.game.height;
    }

    update() {
        let new_warnings = [];
        for (let sprite of this.warnings) {
            let point = this.intersect(sprite);
            if (!sprite.item.alive || (sprite.item.itemType == "Missile" && this.insideMap(sprite.item))) {
                sprite.destroy();
                continue;
            }
            if (point) {
                sprite.x = point.x;
                sprite.y = point.y;
                if (sprite.x - sprite.width <= 0) sprite.x += sprite.width / 2;
                if (sprite.y - sprite.height <= 0) sprite.y += sprite.height / 2;
                if (sprite.x + sprite.width >= Global.game.width) sprite.x -= sprite.width / 2;
                if (sprite.y + sprite.height >= Global.game.height) sprite.y -= sprite.height / 2;
            }
            if (point == null)
                sprite.visible = false;
            else
                sprite.visible = true;
            new_warnings.push(sprite);
        }
        this.warnings = new_warnings;
    }
}
