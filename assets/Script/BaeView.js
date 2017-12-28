var Defined=require('Defined');
cc.Class({
    extends: cc.Component,

    properties: {
        m_Hero: {
            default: null,
            type: cc.Node
        },
        btnRoll: {
            default: null,
            type: cc.Node
        },
        back1: {
            default: [],
            type: [cc.Node]
        },
        heroPosX: 0,
        heroPosY: 0
    },
    onLoad: function () {
        this.m_Hero.x = this.heroPosX;
        this.m_Hero.y = this.heroPosY;
        this.animCtrl = this.m_Hero.getComponent(cc.Animation);
        this.animCtrl.play("Run");
        this.btnRoll.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.btnRoll.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        var _that = this;
        for (var i = 0; i < this.back1.length; i++) {
            var width = this.back1[i].width - 3;
            this.back1[i].setPosition(i * (width), 0);
            var move = cc.moveTo(Defined.MoveTimeEnd * (i + 1), cc.p(-width, 0));
            var seq = cc.sequence(move, cc.callFunc(this.backMoveEnd, this));
            this.back1[i].runAction(seq);
        }

    },
    backMoveEnd: function (target) {
        var width=target.width-3;
        target.setPosition(width, 0);
        var move = cc.moveTo(Defined.MoveTimeEnd*2, cc.p(-width, 0));
        var seq = cc.sequence(move, cc.callFunc(this.backMoveEnd, this));
        target.runAction(seq);
    },

    // update (dt) {},

    onAnimationChange: function (target, data) {
        if (data === 'Jump' && this.isCanChangeClip('Jump')) {
            this.animCtrl.play(data);
            var moveUp = cc.moveTo(0.3, this.heroPosX, 10).easing(cc.easeCubicActionOut());
            var moveDown = cc.moveTo(0.3, this.heroPosX, this.heroPosY).easing(cc.easeCubicActionIn());
            var callBack = cc.callFunc(this.callbackDownOver.bind(this), this.m_Hero, this);
            var seq = cc.sequence(moveUp, moveDown, callBack);
            this.m_Hero.runAction(seq);
        }
    },
    callbackDownOver: function () {
        this.animCtrl.play('Run');
    },
    touchStart: function () {
        this.callback = function () {
            if (this.animCtrl.currentClip.name === 'Jump') {
                return;
            }
            this.m_Hero.y = this.heroPosY - 10;
            this.animCtrl.play('Roll');
            this.unschedule(this.callback);
        };
        this.schedule(this.callback, 0.1);

    },
    touchEnd: function () {
        this.unschedule(this.callback);
        if (this.animCtrl.currentClip.name === 'Jump') {
            return;
        }
        this.m_Hero.y = this.heroPosY;
        this.animCtrl.play('Run');
    },
    isCanChangeClip: function (playName) {
        var currentClipName = this.animCtrl.currentClip.name;
        if (playName === 'Roll') {
            if (currentClipName === "Jump") {
                return false;
            } else if (currentClipName === "Run") {
                return true;
            }
        } else if (playName === 'Jump') {
            return currentClipName === 'Run';

        }
        return true;
    }
});
