/**
 * Created by ghousepashas on 08-10-2015.
 */
(function () {
    var module = angular
        .module('templates', [])
    'use strict';
    var gameWidth = 1024,
        gameHeight = 720;
    var getGame = function (type, imageWidth, imageHeight, level, src, image, isShuffle) {
        var Game = function () {
            this.sideLength;
            this.irregularExcess;
            this.positions = [];
            this.pieces = [];
            this.type = type;
            this.imageWidth = imageWidth;
            this.imageHeight = imageHeight;
            this.masks = [];
            this.bmps = [];
            this.numberOfPieces = 4;
            this.orignalPoints;
            this.combinedSprites;
            this.isShuffled = false;
            this.points = [];
        };
        Game.prototype = {
            preload: function () {
                this.numberOfPieces = 2 + level;
                this.sideLength = this.imageWidth / this.numberOfPieces;


                if (type == "square") {
                    this.cache.addSpriteSheet('puzzle', src, image, this.sideLength, this.sideLength);

                }
                if (type == "jigsaw") {
                    this.cache.addImage('mainImg', src, image);
                }

            },
            create: function () {
                if (type == "square") {
                    var piecesGroup = this.game.add.group();
                    var rows = this.imageWidth / this.sideLength;
                    var counter = 0;
                    for (var i = 0; i < rows; i++) {
                        for (var j = 0; j < rows; j++) {
                            var position = {
                                x: j * this.sideLength,
                                y: i * this.sideLength
                            };
                            var piece = piecesGroup.create(position.x, position.y,
                                "puzzle", counter++);
                            piece.inputEnabled = true;
                            piece.input.enableDrag();
                            piece.events.onDragUpdate.add(this.onDrag, this);
                            piece.events.onDragStop.add(this.stopDrag, this);
                            piece.index = counter - 1;
                            this.pieces.push(piece);
                            this.positions.push(position);
                        }
                    }
                } else if (type == "jigsaw") {
                    this.createPath();
                    this.justifyHeapPositions();
                    this.drawPaths();
                    this.drawCanvas();
                }
                if (isShuffle) {
                    this.shuffle();
                }
            },
            calDist: function (x1, y1, x2, y2) {
                var xCoeff = x2 - x1, yCoeff = y2 - y1;
                return Math.sqrt(xCoeff * xCoeff + yCoeff * yCoeff);
            },
            getTheDistance: function (spriteA, spriteB, type) {
                var x1, y1, x2, y2, dist, point = {};
                var irregularExcess = this.irregularExcess;
                var sideLength = this.sideLength;
                switch (type) {
                    case "top":
                        if (this.type == "jigsaw") {
                            x1 = spriteA.x + irregularExcess;
                            y1 = spriteA.y + irregularExcess;
                            x2 = spriteB.x + irregularExcess;
                            y2 = spriteB.y + irregularExcess + sideLength;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2 - irregularExcess;
                                point.y = y2 - irregularExcess;
                            }

                        } else if (this.type == "square") {
                            x1 = spriteA.x;
                            y1 = spriteA.y;
                            x2 = spriteB.x;
                            y2 = spriteB.y + this.sideLength;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2;
                                point.y = y2;
                                //  console.log("dist is", dist);
                            }
                        }
                        if (dist > 10) {
                            point = null;
                        }

                        break;
                    case "bottom":
                        if (this.type == "jigsaw") {
                            x1 = spriteA.x + irregularExcess;
                            y1 = spriteA.y + irregularExcess + sideLength;
                            x2 = spriteB.x + irregularExcess;
                            y2 = spriteB.y + irregularExcess;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2 - irregularExcess;
                                point.y = y2 - irregularExcess - sideLength;
                            }
                        } else if (this.type == "square") {
                            x1 = spriteA.x;
                            y1 = spriteA.y + this.sideLength;
                            x2 = spriteB.x;
                            y2 = spriteB.y;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2;
                                point.y = y2 - this.sideLength;
                                // console.log("dist is", dist);
                            }
                        }
                        if (dist > 10) {
                            point = null;
                        }
                        break;
                    case "left":
                        if (this.type == "jigsaw") {
                            x1 = spriteA.x + irregularExcess;
                            y1 = spriteA.y + irregularExcess;
                            x2 = spriteB.x + irregularExcess + sideLength;
                            y2 = spriteB.y + irregularExcess;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2 - irregularExcess;
                                point.y = y2 - irregularExcess;
                            }
                        } else if (this.type == "square") {
                            x1 = spriteA.x;
                            y1 = spriteA.y;
                            x2 = spriteB.x + this.sideLength;
                            y2 = spriteB.y;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2;
                                point.y = y2;
                                // console.log("dist is", dist);
                            }
                        }
                        if (dist > 10) {
                            point = null;
                        }
                        break;
                    case "right":
                        if (this.type == "jigsaw") {
                            x1 = spriteA.x + irregularExcess + sideLength;
                            y1 = spriteA.y + irregularExcess;
                            x2 = spriteB.x + irregularExcess;
                            y2 = spriteB.y + irregularExcess;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2 - sideLength - irregularExcess;
                                point.y = y2 - irregularExcess;
                            }
                        } else if (this.type == "square") {
                            x1 = spriteA.x + this.sideLength;
                            y1 = spriteA.y;
                            x2 = spriteB.x;
                            y2 = spriteB.y;
                            dist = this.calDist(x1, y1, x2, y2);
                            if (dist <= 10) {
                                point.x = x2 - this.sideLength;
                                point.y = y2;
                                // console.log("dist is", dist);
                            }
                        }
                        if (dist > 10) {
                            point = null;
                        }
                        break;
                }
                if (point && !point.x) {
                    debugger;
                }
                return point;
            },
            findSpriteAdjuscents: function (sprite) {
                var sprites = this.pieces;
                // console.log("length is",sprites.length);
                var numberOfPieces = this.numberOfPieces;

                var topIndex, bottomIndex, leftIndex, rightIndex;
                topIndex = (sprite.index - numberOfPieces) >= 0 ? sprite.index - numberOfPieces : null;
                bottomIndex = (sprite.index + numberOfPieces) < sprites.length ? sprite.index + numberOfPieces : null;
                leftIndex = sprite.index % numberOfPieces !== 0 ? sprite.index - 1 : null;
                rightIndex = (sprite.index + 1) % numberOfPieces !== 0 ? sprite.index + 1 : null;
                if (topIndex !== null) {

                    var point = this.getTheDistance(sprite, sprites[topIndex], "top");
                    if (point) {

                        sprite.x = point.x;
                        sprite.y = point.y;
                        sprite.topSprite = sprites[topIndex];
                        sprite.topSprite.bottomSprite = sprite;
                        console.log(point.x, point.y)
                    }
                }
                if (bottomIndex !== null) {
                    var point = this.getTheDistance(sprite, sprites[bottomIndex], "bottom");
                    if (point) {

                        sprite.x = point.x;
                        sprite.y = point.y;

                        sprite.bottomSprite = sprites[bottomIndex];
                        sprite.bottomSprite.topSprite = sprite;

                        console.log(point.x, point.y)
                    }
                }
                if (leftIndex != null) {
                    var point = this.getTheDistance(sprite, sprites[leftIndex], "left");
                    if (point) {
                        sprite.x = point.x;
                        sprite.y = point.y;
                        sprite.leftSprite = sprites[leftIndex];
                        sprite.leftSprite.rightSprite = sprite;
                        console.log(point.x, point.y)
                    }
                }
                if (rightIndex != null) {
                    var point = this.getTheDistance(sprite, sprites[rightIndex], "right");
                    if (point) {
                        sprite.x = point.x;
                        sprite.y = point.y;
                        sprite.rightSprite = sprites[rightIndex];
                        sprite.rightSprite.leftSprite = sprite;
                        console.log(point.x, point.y)
                    }
                }
                this.dfs(sprite, this.pieces);
            },

            dfs: function (sprite) {
                var nodes = [], sideLength = this.sideLength;
                nodes.push(sprite);
                var counter = 0;
                while (nodes.length) {
                    var node = nodes.pop();
                    if (!node.visited) {
                        if (node.topSprite) {
                            node.topSprite.bringToTop();
                            nodes.push(node.topSprite);
                            node.topSprite.x = node.x;
                            node.topSprite.y = node.y - sideLength;
                        }
                        if (node.bottomSprite) {
                            node.bottomSprite.bringToTop();
                            nodes.push(node.bottomSprite);
                            node.bottomSprite.x = node.x;
                            node.bottomSprite.y = node.y + sideLength;
                        }
                        if (node.leftSprite) {
                            node.leftSprite.bringToTop();
                            nodes.push(node.leftSprite);
                            node.leftSprite.x = node.x - sideLength;
                            node.leftSprite.y = node.y;
                        }
                        if (node.rightSprite) {
                            node.rightSprite.bringToTop();
                            nodes.push(node.rightSprite);
                            node.rightSprite.x = node.x + sideLength;
                            node.rightSprite.y = node.y;
                        }
                        node.visited = true;
                        counter++;
                    }
                }

                if (counter == this.pieces.length) {
                    console.log("finished");
                }
                this.setFlagToSprites();
            },
            setFlagToSprites: function () {
                this.pieces.forEach(function (sprite) {
                    sprite.visited = false;
                })
            },
            onDrag: function (piece) {
                var _this = this;
                // console.log("piece is",piece);
                piece.bringToTop();
                if (isShuffle) {
                    _this.findSpriteAdjuscents(piece);
                }


            },
            stopDrag: function () {

            },
            update: function () {

            },
            shuffle: function () {
                var pieces = this.pieces;
                var x = 0, y = 0;
                var length = pieces.length;
                var indexes = [];
                for (var i = 0; i < length; i++) {
                    indexes.push(i);
                }
                Phaser.ArrayUtils.shuffle(indexes);
                var x = 0;
                var that = this;
                indexes.forEach(function (item, index) {
                    var piece = that.pieces[item];
                    piece.x = x;
                    piece.y = y;
                    x += that.sideLength + 20;
                    if (x > gameWidth - that.sideLength) {
                        x = 0;
                        y += y + that.sideLength + 20
                    }
                })
            },
            /* jigsaw puzzle code from here*/
            createPath: function () {

                this.irregularExcess = this.sideLength / 4;
                var offset = new Phaser.Point(0, 0);
                for (var i = 0; i < this.numberOfPieces; i++) {
                    for (var j = 0; j < this.numberOfPieces; j++) {
                        var pointCollection = this.getCurvePoint(offset);
                        this.points.push(pointCollection);
                        offset.x += this.sideLength;
                        if (offset.x >= this.imageWidth) {
                            offset.x = 0;
                            offset.y += this.sideLength;
                        }
                    }

                }
            },
            justifyHeapPositions: function () {
                var points = this.points, imageWidth = this.imageWidth, imageHeight = this.imageHeight;
                for (var i = 0; i < points.length; i++) {
                    var top = 1, left = 1;
                    var point = points[i];

                    if (i < this.numberOfPieces) {
                        top = null;
                        points[i].top = 0;
                    }
                    if (points[i].topRight.x >= imageWidth) {
                        points[i].right = 0;
                    }
                    if (points[i].bottomRight.y >= imageHeight) {
                        points[i].bottom = 0;
                    }
                    if (i % this.numberOfPieces == 0) {
                        left = null;
                        points[i].left = 0;
                    }
                    if (top !== null) {
                        top = points[i - this.numberOfPieces];

                        var addition = point.top + top.bottom;
                        if (addition != 0) {
                            point.top += -addition;
                        }

                    }
                    if (left !== null) {
                        left = points[i - 1];
                        var addition = point.left + left.right;
                        if (addition != 0) {
                            point.left += -addition;
                        }
                    }

                }
            },
            drawPaths: function () {
                var points = this.points,
                    sideLength = this.sideLength,
                    irregularExcess = this.irregularExcess,
                    pointCollection = this.points;
                var _this = this;
                _this.orignalPoints = [];
                points.forEach(function (pointCollection, index) {
                    pointCollection = _this.getCubicPoints(pointCollection, sideLength, irregularExcess);
                    var bmp = _this.game.make.bitmapData(sideLength + 2 * irregularExcess, sideLength + 2 * irregularExcess);
                    var rectangle = new Phaser.Rectangle(pointCollection.topLeftExcess.x, pointCollection.topLeftExcess.y,
                        sideLength + 2 * irregularExcess, sideLength + 2 * irregularExcess);

                    bmp.copyRect('mainImg', rectangle, 0, 0);
                    bmp.pointCollection = pointCollection;
                    _this.bmps.push(bmp);
                    _this.orignalPoints.push(pointCollection);
                });
            },
            drawCanvas: function () {
                var offset = this.getOffset();
                var sideLength = this.sideLength,
                    irregularExcess = this.irregularExcess,
                    orignalPoints = this.orignalPoints;
                var _this = this;
                this.game.world.removeAll();
                var ids = [];
                _this.pieces = [];
                _this.bmps.forEach(function (bmp, index) {
                    var point = _this.getCurvePoint(new Phaser.Point(irregularExcess, irregularExcess), orignalPoints[index]);
                    point = _this.getCubicPoints(point, sideLength, irregularExcess);
                    var context = bmp.canvas.getContext("2d");
                    _this.getMask(point, context);
                    var dataURI = bmp.canvas.toDataURL("image/png");
                    var data = new Image();
                    data.src = dataURI;
                    var id = "myImage" + index;
                    _this.game.cache.addImage(id, dataURI, data);
                    var sprite = _this.game.add.sprite(orignalPoints[index].topLeftExcess.x + offset.x, orignalPoints[index].topLeftExcess.y + offset.y, id);
                    var text = _this.game.add.text(point.x, point.y, index+1, {font: "20px Arial", fill: '#fff'});
                    text.x=sprite.width/2;
                    text.y=sprite.height/2;
                    sprite.addChild(text)
                    sprite.originalPoint = point;
                    sprite.inputEnabled = true;
                    sprite.index = index;
                    sprite.input.pixelPerfectOver = true;
                    sprite.input.enableDrag();
                    sprite.events.onDragUpdate.add(_this.onDrag, _this);
                    // sprite.events.onDragStop.add(_this.stopDrag, this);
                    _this.pieces.push(sprite);
                });
            },
            getMask: function (pointCollection, mask) {
                // mask.globalAlpha = 0.7;
                mask.save();
                mask.beginPath();
                mask.fillStyle = "blue";
                mask.rect(0, 0, 225, 225);


                mask.globalCompositeOperation = "destination-in";
                mask.lineWidth = 10;
                mask.strokeStyle = 'blue';
                mask.beginPath();
                mask.moveTo(pointCollection.topLeft.x, pointCollection.topLeft.y);
                if (!!pointCollection.top) {
                    mask.lineTo(pointCollection.top_bezier_1.x, pointCollection.top_bezier_1.y);
                    mask.bezierCurveTo(pointCollection.top_bezier_1_control_1.x, pointCollection.top_bezier_1_control_1.y,
                        pointCollection.top_bezier_1_control_2.x, pointCollection.top_bezier_1_control_2.y,
                        pointCollection.top_bezier_peak.x, pointCollection.top_bezier_peak.y);
                    mask.bezierCurveTo(pointCollection.top_bezier_2_control_1.x, pointCollection.top_bezier_2_control_1.y,
                        pointCollection.top_bezier_2_control_2.x, pointCollection.top_bezier_2_control_2.y,
                        pointCollection.top_bezier_2.x, pointCollection.top_bezier_2.y);
                }
                mask.lineTo(pointCollection.topRight.x, pointCollection.topRight.y);
                if (!!pointCollection.right) {
                    mask.lineTo(pointCollection.right_bezier_1.x, pointCollection.right_bezier_1.y);
                    mask.bezierCurveTo(pointCollection.right_bezier_1_control_1.x, pointCollection.right_bezier_1_control_1.y,
                        pointCollection.right_bezier_1_control_2.x, pointCollection.right_bezier_1_control_2.y,
                        pointCollection.right_bezier_peak.x, pointCollection.right_bezier_peak.y);
                    mask.bezierCurveTo(pointCollection.right_bezier_2_control_1.x, pointCollection.right_bezier_2_control_1.y,
                        pointCollection.right_bezier_2_control_2.x, pointCollection.right_bezier_2_control_2.y,
                        pointCollection.right_bezier_2.x, pointCollection.right_bezier_2.y);
                }
                mask.lineTo(pointCollection.bottomRight.x, pointCollection.bottomRight.y);

                if (!!pointCollection.bottom) {
                    mask.lineTo(pointCollection.bottom_bezier_1.x, pointCollection.bottom_bezier_1.y);
                    mask.bezierCurveTo(pointCollection.bottom_bezier_1_control_1.x, pointCollection.bottom_bezier_1_control_1.y,
                        pointCollection.bottom_bezier_1_control_2.x, pointCollection.bottom_bezier_1_control_2.y,
                        pointCollection.bottom_bezier_peak.x, pointCollection.bottom_bezier_peak.y);
                    mask.bezierCurveTo(pointCollection.bottom_bezier_2_control_1.x, pointCollection.bottom_bezier_2_control_1.y,
                        pointCollection.bottom_bezier_2_control_2.x, pointCollection.bottom_bezier_2_control_2.y,
                        pointCollection.bottom_bezier_2.x, pointCollection.bottom_bezier_2.y);

                }
                mask.lineTo(pointCollection.bottomLeft.x, pointCollection.bottomLeft.y);

                if (!!pointCollection.left) {
                    mask.lineTo(pointCollection.left_bezier_1.x, pointCollection.left_bezier_1.y);
                    mask.bezierCurveTo(pointCollection.left_bezier_1_control_1.x, pointCollection.left_bezier_1_control_1.y,
                        pointCollection.left_bezier_1_control_2.x, pointCollection.left_bezier_1_control_2.y,
                        pointCollection.left_bezier_peak.x, pointCollection.left_bezier_peak.y);
                    mask.bezierCurveTo(pointCollection.left_bezier_2_control_1.x, pointCollection.left_bezier_2_control_1.y,
                        pointCollection.left_bezier_2_control_2.x, pointCollection.left_bezier_2_control_2.y,
                        pointCollection.left_bezier_2.x, pointCollection.left_bezier_2.y);

                }

                mask.lineTo(pointCollection.topLeft.x, pointCollection.topLeft.y);
                mask.fill();
                //mask.stroke();
                mask.restore();
            },
            getOffset: function () {
                var offset = {
                    x: (gameWidth - this.imageWidth) / 2,
                    y: (gameHeight - this.imageHeight) / 2
                }
                return offset;
            },
            getCurvePoint: function (offset, compute) {
                var randomGenerator = this.generateRandom(0, 2);
                var sideLength = this.sideLength;
                var irregularExcess = this.irregularExcess;
                var pointCollection = {
                    topLeft: new Phaser.Point(offset.x, offset.y),
                    topRight: Phaser.Point.add(offset, new Phaser.Point(sideLength, 0)),
                    bottomRight: Phaser.Point.add(offset, new Phaser.Point(sideLength, sideLength)),
                    bottomLeft: Phaser.Point.add(offset, new Phaser.Point(0, sideLength)),
                    topLeftExcess: '',
                    topRightExcess: '',
                    bottomRightExcess: '',
                    bottomLeftExcess: '',
                    top_bezier_1: null,
                    top_bezier_2: null,
                    top_bezier_1_control_1: null,
                    top_bezier_1_control_2: null,
                    top_bezier_2_control_1: null,
                    top_bezier_2_control_2: null,
                    top_bezier_peak: null,
                    right_bezier_1: null,
                    right_bezier_2: null,
                    right_bezier_1_control_1: null,
                    right_bezier_1_control_2: null,
                    right_bezier_2_control_1: null,
                    right_bezier_2_control_2: null,
                    right_bezier_peak: null,
                    bottom_bezier_1: null,
                    bottom_bezier_2: null,
                    bottom_bezier_1_control_1: null,
                    bottom_bezier_1_control_2: null,
                    bottom_bezier_2_control_1: null,
                    bottom_bezier_2_control_2: null,
                    bottom_bezier_peak: null,
                    left_bezier_1: null,
                    left_bezier_2: null,
                    left_bezier_1_control_1: null,
                    left_bezier_1_control_2: null,
                    left_bezier_2_control_1: null,
                    left_bezier_2_control_2: null,
                    left_bezier_peak: null,
                    top: compute ? compute.top : randomGenerator(),
                    bottom: compute ? compute.bottom : randomGenerator(),
                    right: compute ? compute.right : randomGenerator(),
                    left: compute ? compute.left : randomGenerator()
                };
                pointCollection.topLeftExcess = Phaser.Point.subtract(pointCollection.topLeft, new Phaser.Point(irregularExcess, irregularExcess));
                pointCollection.topRightExcess = Phaser.Point.subtract(pointCollection.topRight, new Phaser.Point(-irregularExcess, irregularExcess));
                pointCollection.bottomRightExcess = Phaser.Point.add(pointCollection.bottomRight, new Phaser.Point(irregularExcess, irregularExcess));
                pointCollection.bottomLeftExcess = Phaser.Point.add(pointCollection.bottomLeft, new Phaser.Point(-irregularExcess, irregularExcess));
                return pointCollection;
            },
            getCubicPoints: function (pointCollection) {
                var sideLength = this.sideLength, irregularExcess = this.irregularExcess;
                var bezier1Delta = sideLength / 3;
                var bezier2Delta = 2 * sideLength / 3;


                if (!!pointCollection.top) {
                    pointCollection.top_bezier_1 = new Phaser.Point(pointCollection.topLeft.x + bezier1Delta, pointCollection.topLeft.y);
                    pointCollection.top_bezier_2 = new Phaser.Point(pointCollection.topLeft.x + bezier2Delta, pointCollection.topLeft.y);
                    pointCollection.top_bezier_1_control_1 = Phaser.Point.add(pointCollection.top_bezier_1, new Phaser.Point(irregularExcess, 0));
                    pointCollection.top_bezier_2_control_2 = Phaser.Point.subtract(pointCollection.top_bezier_2, new Phaser.Point(irregularExcess, 0));

                    pointCollection.top_bezier_peak = Phaser.Point.centroid([pointCollection.topLeft, pointCollection.topRight]);
                    pointCollection.top_bezier_1_control_2 = pointCollection.top == 1 ? Phaser.Point.subtract(pointCollection.topLeft, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.add(pointCollection.topLeft, new Phaser.Point(0, irregularExcess));
                    pointCollection.top_bezier_2_control_1 = pointCollection.top == 1 ? Phaser.Point.subtract(pointCollection.topRight, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.add(pointCollection.topRight, new Phaser.Point(0, irregularExcess));
                    pointCollection.top_bezier_peak = pointCollection.top == 1 ? Phaser.Point.subtract(pointCollection.top_bezier_peak, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.add(pointCollection.top_bezier_peak, new Phaser.Point(0, irregularExcess));
                }
                if (!!pointCollection.bottom) {
                    pointCollection.bottom_bezier_1 = new Phaser.Point(pointCollection.bottomRight.x - bezier1Delta, pointCollection.bottomRight.y);
                    pointCollection.bottom_bezier_2 = new Phaser.Point(pointCollection.bottomRight.x - bezier2Delta, pointCollection.bottomRight.y);
                    pointCollection.bottom_bezier_1_control_1 = Phaser.Point.subtract(pointCollection.bottom_bezier_1, new Phaser.Point(irregularExcess, 0));
                    pointCollection.bottom_bezier_2_control_2 = Phaser.Point.add(pointCollection.bottom_bezier_2, new Phaser.Point(irregularExcess, 0));

                    pointCollection.bottom_bezier_peak = Phaser.Point.centroid([pointCollection.bottomRight, pointCollection.bottomLeft]);
                    pointCollection.bottom_bezier_1_control_2 = pointCollection.bottom == 1 ? Phaser.Point.add(pointCollection.bottomRight, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.subtract(pointCollection.bottomRight, new Phaser.Point(0, irregularExcess));
                    pointCollection.bottom_bezier_2_control_1 = pointCollection.bottom == 1 ? Phaser.Point.add(pointCollection.bottomLeft, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.subtract(pointCollection.bottomLeft, new Phaser.Point(0, irregularExcess));
                    pointCollection.bottom_bezier_peak = pointCollection.bottom == 1 ? Phaser.Point.add(pointCollection.bottom_bezier_peak, new Phaser.Point(0, irregularExcess))
                        : Phaser.Point.subtract(pointCollection.bottom_bezier_peak, new Phaser.Point(0, irregularExcess))
                }

                if (!!pointCollection.right) {
                    pointCollection.right_bezier_1 = new Phaser.Point(pointCollection.bottomRight.x, pointCollection.bottomRight.y - bezier2Delta);
                    pointCollection.right_bezier_2 = new Phaser.Point(pointCollection.bottomRight.x, pointCollection.bottomRight.y - bezier1Delta);
                    pointCollection.right_bezier_1_control_1 = Phaser.Point.add(pointCollection.right_bezier_1, new Phaser.Point(0, irregularExcess));
                    pointCollection.right_bezier_2_control_2 = Phaser.Point.subtract(pointCollection.right_bezier_2, new Phaser.Point(0, irregularExcess));

                    pointCollection.right_bezier_peak = Phaser.Point.centroid([pointCollection.topRight, pointCollection.bottomRight]);
                    pointCollection.right_bezier_1_control_2 = pointCollection.right == 1 ? Phaser.Point.add(pointCollection.topRight, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.subtract(pointCollection.topRight, new Phaser.Point(irregularExcess, 0));
                    pointCollection.right_bezier_2_control_1 = pointCollection.right == 1 ? Phaser.Point.add(pointCollection.bottomRight, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.subtract(pointCollection.bottomRight, new Phaser.Point(irregularExcess, 0));
                    pointCollection.right_bezier_peak = pointCollection.right == 1 ? Phaser.Point.add(pointCollection.right_bezier_peak, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.subtract(pointCollection.right_bezier_peak, new Phaser.Point(irregularExcess, 0));
                }
                if (!!pointCollection.left) {
                    pointCollection.left_bezier_1 = new Phaser.Point(pointCollection.bottomLeft.x, pointCollection.bottomLeft.y - bezier1Delta);
                    pointCollection.left_bezier_2 = new Phaser.Point(pointCollection.bottomLeft.x, pointCollection.bottomLeft.y - bezier2Delta);
                    pointCollection.left_bezier_1_control_1 = Phaser.Point.subtract(pointCollection.left_bezier_1, new Phaser.Point(0, irregularExcess));
                    pointCollection.left_bezier_2_control_2 = Phaser.Point.add(pointCollection.left_bezier_2, new Phaser.Point(0, irregularExcess));

                    pointCollection.left_bezier_peak = Phaser.Point.centroid([pointCollection.bottomLeft, pointCollection.topLeft]);
                    pointCollection.left_bezier_1_control_2 = pointCollection.left == 1 ? Phaser.Point.subtract(pointCollection.bottomLeft, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.add(pointCollection.bottomLeft, new Phaser.Point(irregularExcess, 0));
                    pointCollection.left_bezier_2_control_1 = pointCollection.left == 1 ? Phaser.Point.subtract(pointCollection.topLeft, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.add(pointCollection.topLeft, new Phaser.Point(irregularExcess, 0));
                    pointCollection.left_bezier_peak = pointCollection.left == 1 ? Phaser.Point.subtract(pointCollection.left_bezier_peak, new Phaser.Point(irregularExcess, 0))
                        : Phaser.Point.add(pointCollection.left_bezier_peak, new Phaser.Point(irregularExcess, 0));
                }

                return pointCollection;

            },
            generateRandom: function (min, max) {
                var heap = [0, 1, -1];
                var randomGen = new Phaser.RandomDataGenerator();
                return function () {
                    return heap[randomGen.between(min, max)];
                }
            }
        };


        return Game;
    };

    angular
        .module('templates')
        .directive('puzzle', function () {
            return {
                restrict: 'E',
                templateUrl: 'src/puzzle.html',
                scope: {
                    url: "=",
                    isJigsaw: "=",
                    level: "="
                },
                link: function (scope, element, attr) {
                    if (scope.isJigsaw) {
                        scope.type = "jigsaw";
                    } else {
                        scope.type = "square";
                    }

                    if(scope.url){
                        readImage(scope.url)
                    }else{
                        alert("please give the url bro");
                    }

                    var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, element.find('.canvas-area'));
                    element.find('.choose').change(function (e) {
                        if (this.disabled) return alert('File upload not supported!');
                        var F = this.files;
                        if (F && F[0]) for (var i = 0; i < F.length; i++) readImage(F[i]);
                    });
                    function readImage(file) {

                        var reader = new FileReader();
                        var image = new Image();

                        //reader.readAsDataURL(file);
                        //reader.onload = function (_file) {
                            image.src = scope.url;              // url.createObjectURL(file);
                            image.onload = function () {
                                var w = this.width,
                                    h = this.height,
                                    t = file.type,                           // ext only: // file.type.split('/')[1],
                                    n = file.name,
                                    s = ~~(file.size / 1024) + 'KB';
                                if (w !== h) {
                                    alert("width and height must be equal");
                                }
                                if (h != w) {
                                    alert("image width and height must be equal");
                                    return;
                                }
                                gameOb = {
                                    w: w,
                                    h: h,
                                    level: 1,
                                    src: this.src,
                                    image: image
                                };
                                renderGame();
                            };
                            image.onerror = function () {
                                alert('Invalid file type: ' + file.type);
                            };
                      //  };

                    }

                    var gameOb;

                    function renderGame(isShuffle) {
                        if (!gameOb) {
                            alert("choose image file");
                        }
                        if(game.world){
                            game.world.removeAll();
                        }

                        var Game = getGame(scope.type, gameOb.w, gameOb.h, parseInt(scope.level), gameOb.src, gameOb.image, isShuffle);
                        game.state.add('Game', Game);
                        game.state.start('Game');
                    }

                    scope.shuffle = function () {
                        renderGame(true)
                    };
                    scope.changeGame = function () {
                        renderGame();
                    };

                }
            }
        });
})();
