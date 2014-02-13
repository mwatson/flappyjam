App.init = function() {

        App.Game = new App.Objects.Game();
        
        var settings = {

                // drawing/canvas settings
                draw: {
                        // all canvases must be the same width/height
                        width: 640, 
                        height: 480, 

                        // available ids: background, entity, hud, menu
                        canvases: [
                        { 
                                id: 'background', 
                                origin: 'dynamic', 
                                parallax: { x: 0.75, y: 0.75 },
                                style: { 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        backgroundColor: '#000', 
                                        marginLeft: '-320px', 
                                        marginTop: '-240px'
                                }
                        }, 
                        { 
                                id: 'entity', 
                                origin: 'dynamic', 
                                style: { 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        marginLeft: '-320px', 
                                        marginTop: '-240px'
                                }
                        }, 
                        {
                                id: 'hud', 
                                origin: 'fixed', 
                                style: { 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        marginLeft: '-320px', 
                                        marginTop: '-240px'
                                }
                        }, 
                        {
                                id: 'transitions', 
                                origin: 'fixed', 
                                style: { 
                                        position: 'absolute', 
                                        top: '50%', 
                                        left: '50%', 
                                        marginLeft: '-320px', 
                                        marginTop: '-240px'
                                }
                        }], 
                }, 

                // game default settings/options
                game: {

                        local: 'en', 
                        
                        debug: {
                                font: 'bold 12px Courier New', 
                                fps: true, 
                                boundingBoxes: false, 
                                fishInfo: false, 
                                showQuadTree: false, 
                                showDMap: false, 
                                drawTextMap: false, 

                                nwAllowInspector: true
                        }, 
                        fpscap: 60,
                        updatecap: 20, 

                        hud: {
                                titleFont: 'bold 150px AlphaBeta', 
                                largeFont: 'bold 120px AlphaBeta', 
                                bigFont: 'bold 96px AlphaBeta', 
                                medFont: 'bold 86px AlphaBeta', 
                                smallFont: 'bold 72px AlphaBeta', 
                                smallFontNoBold: '72px AlphaBeta', 
                                tinyFont: 'bold 54px AlphaBeta'
                        }, 

                        // for lazy lookups
                        fontHeights: {
                                'bold 150px AlphaBeta': 150, 
                                'bold 120px AlphaBeta': 120, 
                                'bold 96px AlphaBeta': 96, 
                                'bold 86px AlphaBeta': 86, 
                                'bold 72px AlphaBeta': 72, 
                                '72px AlphaBeta': 72, 
                                'bold 54px AlphaBeta': 54, 
                                'bold 24px Courier New': 24
                        }, 

                        menus: [
                        ], 

                        sound: {
                                sfxVolume: 0.8, 
                                musicVolume: 0.7
                        }, 

                        video: {
                                width: 640, 
                                height: 480, 
                                upscale: false
                        }
                }, 

                // player defaults
                player: {
                        maxOxygen: 100, 
                        maxEnergy: 200, 
                        movementDepleteMultiplier: 5, 
                        depthPenalty: 10, 
                        lockedPages: [ false, false, true ], 
                        oxygenDepleteRate: 5, 
                        money: 0, 
                        day: 1, 
                        depth: 0, 
                        equipped: [ false, false, false, false, false ], 

                        skins: {
                                m: true, 
                                f: true, 
                                gm: false,
                                gf: false, 
                                am: false, 
                                af: false
                        }
                }, 

                // the maps
                world: [{

                        tileSize: 64, 
                        width: 32, 
                        height: 9, 

                        mapSize: 1000, 
                        
                        playerStart: {
                                x: 8 * 64, 
                                y: 4 * 64
                        }, 

                        // define the colors of the bg tiles
                        rows: [
                                { depth: 0,  fgColor: '#A8BDED', bgColor: '#C5CFE6' }, 
                        ], 

                        colors: {
                                main: '#2573B3'
                        }, 

                        enemies: {
                                max: 2, 
                                min: 1
                        }, 

                        blockers: [], 

                        bounds: {}, 

                        loaded: function() {
                                App.Draw.forceOrigin(0, 0);
                        }
                }], 
        };

        App.Game.init(settings);
};

document.addEventListener("DOMContentLoaded", function() {
        document.removeEventListener("DOMContentLoaded", arguments.callee, false);
        App.init();
});
