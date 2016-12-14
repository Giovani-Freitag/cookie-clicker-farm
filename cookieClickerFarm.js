/**
 * Main function
 * Can be used in console to force some game built-in functions
 *
 * @class      CookieClickerFarm (name)
 */
function CookieClickerFarm() {

    var self = this;
    var shimmerSpawner;

    /**
     * Insert Jquery script
     * Its used to codeless
     *
     * @return     {Promise}  When jquery loads
     */
    function insertJquery() {

        return new Promise(function(resolve, reject) {

            var jqueryScript = document.createElement('script');

            jqueryScript.onload = function() {

                resolve();
            };

            //Change if this link is no longer avaliable
            jqueryScript.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
            document.getElementsByTagName('head')[0].appendChild(jqueryScript);
        });
    };

    /**
     * Wait for game start running
     *
     * @return     {Promise}  When Game runs
     */
    function waitForGame() {

        return new Promise(function(resolve, reject) {

            var waitForGameInterval = setInterval(function() {

                if (Game.ready) {

                    clearWaitForGameInterval();
                    resolve();
                }
            }, 100);

            function clearWaitForGameInterval() {

                clearInterval(waitForGameInterval);
            }
        });
    };

    /**
     * Farmer needs game start running and jquery loads
     * to instantiate some mothods
     */
    Promise.all([insertJquery(), waitForGame()]).then(function() {

        self.bot = new CookieClickerBot(self);
        self.god = new CookieClickerGod(self);
        self.UI = new CookieClickerFarmUI(self);
    });



    /**
     * Unlocks the achievements.
     * Displays the achievements in the user's stats
     *
     * @param      {string}  achiev  The achievement name
     */
    this.unlockAchievements = function(achiev) {

        if (achiev) {

            Game.Win(achiev);
        } else {

            Object.keys(Game.Achievements).map(function(achiev) {

                Game.Win(achiev);
            });
        }
    };

    /**
     * Locks the achievements.
     * Removes the achievements from the user's stats
     * 
     * @param      {string}  achiev  The achievement name
     */
    this.lockAchievements = function(achiev) {

        if (achiev) {

            Game.RemoveAchiev(achiev);
        } else {

            Object.keys(Game.Achievements).map(function(achiev) {

                Game.RemoveAchiev(achiev);
            });
        }
    };

    /**
     * Unlocks the upgrades.
     * Allows player to buy the upgrade
     *
     * @param      {string}  upgrade  The upgrade name
     */
    this.unlockUpgrades = function(upgrade) {

        if (upgrade) {

            Game.Unlock(upgrade);

        } else {

            Object.keys(Game.Upgrades).map(function(upgrade) {

                Game.Unlock(upgrade);
            });
        }
    };

    /**
     * Locks the upgrades.
     * Disallows player to buy the upgrade
     *
     * @param      {string}  upgrade  The upgrade name
     */
    this.lockUpgrades = function(upgrade) {

        if (upgrade) {

            Game.Lock(upgrade);

        } else {

            Object.keys(Game.Upgrades).map(function(upgrade) {

                Game.Lock(upgrade);
            });
        }
    };

    /**
     * Earn the upgrades
     * Give player upgrade 
     *
     * @param      {string}  upgrade  The upgrade name
     */
    this.earnUpgrades = function(upgrade) {

        if (upgrade) {

            Game.Upgrades[upgrade].earn();

        } else {

            Object.keys(Game.Upgrades).map(function(upgrade) {

                Game.Upgrades[upgrade].earn();
            });
        }
    };

    /**
     * Lose the upgrades
     * Remove player upgrade
     *
     * @param      {string}  upgrade  The upgrade name
     */
    this.loseUpgrades = function(upgrade) {

        if (upgrade) {

            Game.Upgrades[upgrade].lose();

        } else {

            Object.keys(Game.Upgrades).map(function(upgrade) {

                Game.Upgrades[upgrade].lose();
            });
        }
    };

    /**
     * Buy the product
     * Gives player enough money and buy product amount
     *
     * @param      {integer}  amount   The amount
     * @param      {string}  product  The product
     */
    this.buyProducts = function(amount, product) {

        amount = !isNaN(amount) ? parseInt(amount) : 1;

        if (product) {

            var price = Game.Objects[product].getSumPrice(amount);
            Game.cookies += price;
            Game.Objects[product].buy(amount);

        } else {

            Object.keys(Game.Objects).map(function(product) {

                var price = Game.Objects[product].getSumPrice(amount);
                Game.cookies += price;
                Game.Objects[product].buy(amount);
            });
        }
    };

    /**
     * Sells the product
     * Sell product and remove earned money
     *
     * @param      {integer}  amount   The amount
     * @param      {string}  product  The product
     */
    this.sellProducts = function(amount, product) {

        amount = !isNaN(amount) ? parseInt(amount) : 1;

        if (product) {

            var price = Game.Objects[product].getReverseSumPrice(amount);
            Game.Objects[product].sell(amount, true);
            Game.cookies -= price;

        } else {

            Object.keys(Game.Objects).map(function(product) {

                var price = Game.Objects[product].getReverseSumPrice(amount);
                Game.Objects[product].sell(amount, true);
                Game.cookies -= price;
            });
        }
    };

    /**
     * Gets the products.
     * Give player product amount
     *
     * @param      {integer}  amount   The amount
     * @param      {string}   product  The product
     */
    this.getProducts = function(amount, product) {

        amount = !isNaN(amount) ? parseInt(amount) : 1;

        if (product) {

            Game.Objects[product].getFree(amount);

        } else {

            Object.keys(Game.Objects).map(function(product) {

                Game.Objects[product].getFree(amount);
            });
        }
    };

    /**
     * Removes products.
     * Remove player product amount
     *
     * @param      {integer}  amount   The amount
     * @param      {string}   product  The product
     */
    this.removeProducts = function(amount, product) {

        amount = !isNaN(amount) ? parseInt(amount) : 1;

        if (product) {

            Game.Objects[product].sacrifice(amount);

        } else {

            Object.keys(Game.Objects).map(function(product) {

                Game.Objects[product].sacrifice(amount);
            });
        }
    };

    /**
     * Starts the shimmer spawner.
     */
    this.startShimmerSpawner = function() {

        shimmerSpawner = setInterval(self.forceShimmer, 5);
    }

    /**
     * Stops the shimmer spawner.
     */
    this.stopShimmerSpawner = function() {

        clearInterval(shimmerSpawner);
        shimmerSpawner = null;
    }

    /**
     * Force a shimmer to spawn
     */
    this.forceShimmer = function() {

        Game.shimmerTypes.golden.maxTime = 2
        Game.shimmerTypes.golden.minTime = 1
    }

    /**
     * Sets the gaming time.
     *
     * @param      {number}  hours   The hours
     */
    this.setGamingTime = function(hours) {

        if (isNaN(hours)) {

            return;
        }
        var date = new Date().getTime() - (hours * 60 * 60 * 1000);

        Game.startDate = date;
        Game.fullDate = date;

        Game.UpdateMenu();
    }
}

var CCFarm = new CookieClickerFarm();






/**
 * Bot function
 *
 * @class      CookieClickerBot (name)
 */
function CookieClickerBot(Farmer) {

    var self = this;
    var $bigCookie;

    var props = {

        shimmerCollectorLoopDelay: 20,
        bigCookieAutoClickLoopDelay: .2,
        intentToBuyLoopDelay: 100,
        wrinklerCollectorLoopDelay: 100,

        enableShimmerCollector: true,
        enableBigCookieAutoClick: true,
        enableIntentToBuy: true,
        enableWrinklerCollector: true
    };

    var loopStack = {};
    var executionLoops = {};

    /**
     * Initial function
     * Calls another functions to do initial config
     */
    function init() {

        cacheElements();
        createLoops();

        self.start();
    }



    /**
     * Cache elements
     */
    function cacheElements() {

        $bigCookie = $('#bigCookie');
    };



    /**
     * Intent to buy something
     * Script calcs cost/benefits and buy the best option
     */
    function intentToBuy() {

        /**
         * Calculates the product cost/benefit.
         */
        function calcProductCostBenefit() {

            Object.keys(Game.ObjectsById).map(function(product) {

                Game.ObjectsById[product].costBenefit = (Game.ObjectsById[product].price / Game.ObjectsById[product].storedCps);
            });
        }

        /**
         * Gets the best product cost/benefit choice.
         *
         * @return     {Object}  The best product choice.
         */
        function getBestProductChoice() {

            function costBenefit(a, b) {
                if (a.costBenefit < b.costBenefit)
                    return -1;
                if (a.costBenefit > b.costBenefit)
                    return 1;
                return 0;
            }

            function canWaitToBuy(a) {

                var tolerance = Game.cookies + (Game.cookiesPs * 60 * 3);

                return a.price <= tolerance;
            }

            return Game.ObjectsById.filter(canWaitToBuy).sort(costBenefit)[0];
        }


        /**
         * Gets the best upgrade choice.
         *
         * @return     {Object}  The best upgrade choice.
         */
        function getBestUpgradeChoice() {

            //The game dont provide any relatioship between products and upgrades
            //Thinking of a better way to do it

            function canWaitToBuy(a) {

                var tolerance = Game.cookies + (Game.cookiesPs * 60 * 3);

                return (a.basePrice <= tolerance) && a.unlocked && !a.bought;
            }

            function validPool(a) {

                return !!~['', 'tech', 'cookie'].indexOf(a.pool);
            };

            function cheapest(a, b) {

                if (a.basePrice < b.basePrice)
                    return -1;
                if (a.basePrice > b.basePrice)
                    return 1;
                return 0;
            }

            return Object.values(Game.Upgrades).filter(canWaitToBuy).filter(validPool).sort(cheapest)[0];
        }

        /**
         * Buys the product
         *
         * @param      {Object}  product  The product
         */
        function buyProduct(product) {

            product.buy(1);
            calcProductCostBenefit();

            console.log('The Product ' + product.displayName + ' was bought for ' + product.price);
        }

        /**
         * Buys the upgrade
         *
         * @param      {Object}  upgrade  The upgrade
         */
        function buyUpgrade(upgrade) {

            if (upgrade.clickFunction) {

                upgrade.buy(true);
            } else {

                upgrade.buy();
            }

            console.log('The Upgrade ' + upgrade.name + ' was bought for ' + upgrade.basePrice);
        };

        /**
         * Choose between the best product and upgrade
         * Upgrade will have an advantage here
         *
         * @param      {Object}  product  The product
         * @param      {Object}  upgrade  The upgrade
         */
        function chooseProductVsUpgrade(product, upgrade) {

            //First buy upgrade if it can
            if (upgrade && (Game.cookies >= upgrade.basePrice)) {

                buyUpgrade(upgrade);
                return;
            }

            //If upgrande cant be purchased, buy the product if it can
            if (product && (Game.cookies >= bestProductChoice.price)) {

                buyProduct(product);
                return;
            }

            //Just for debug purposes
            //If nothing is purchased shows what is the intention to buy
            else {

                var nameStack = [];

                if (upgrade) nameStack.push(upgrade.name);
                if (product) nameStack.push(product.displayName);

                var str = 'Waiting for buy ' + nameStack.join(' or ');

                console.log(str);
            }
        }


        if (!Game.ObjectsById[0].costBenefit) {

            calcProductCostBenefit();
        }

        var bestProductChoice = getBestProductChoice();
        var bestUpgradeChoice = getBestUpgradeChoice();


        chooseProductVsUpgrade(bestProductChoice, bestUpgradeChoice);
    };

    /**
     * Collect shimmers
     * Its called by a programmable time loop
     */
    function shimmerCollectorLoop() {

        //Collect Shimmers
        if ($('.shimmer').length) {

            console.log('Shimmer colected!');
            $('.shimmer').trigger('click');
        }
    };

    /**
     * Try to buy something
     * Its called by a programmable time loop
     */
    function intentToBuyLoop() {

        //Try to buy something
        intentToBuy();
    }

    /**
     * Autoclicks big cookie
     * Its called by a programmable time loop
     */
    function bigCookieAutoClickLoop() {

        $bigCookie.trigger('click');
    }


    /**
     * Collect wrinklers
     * Its called by a programmable time loop
     */
    function wrinklerCollectorLoop() {

        //Checks if has some wrinkler close
        wrinklersToCollect = Game.wrinklers.filter(function(wrinkler) {

            return !!wrinkler.close;
        });

        if (wrinklersToCollect.length) {

            Game.CollectWrinklers();
        }
    }


    /**
     * Creates loops.
     * Its creates all loops with enable/disable methods
     */
    function createLoops() {

        loopStack = {
            'shimmerCollector': {

                enabled: props.enableShimmerCollector,
                enable: function() {

                    executionLoops['shimmerCollector'] = setInterval(shimmerCollectorLoop, props.shimmerCollectorLoopDelay);
                },
                disable: function() {

                    clearInterval(executionLoops['shimmerCollector']);
                    delete executionLoops['shimmerCollector'];
                }
            },
            'bigCookieAutoClick': {

                enabled: props.enableBigCookieAutoClick,
                enable: function() {

                    executionLoops['bigCookieAutoClickLoop'] = setInterval(bigCookieAutoClickLoop, props.bigCookieAutoClickLoopDelay);
                },
                disable: function() {

                    clearInterval(executionLoops['bigCookieAutoClickLoop']);
                    delete executionLoops['bigCookieAutoClickLoop'];
                }
            },
            'intentToBuy': {

                enabled: props.enableIntentToBuy,
                enable: function() {

                    executionLoops['intentToBuyLoop'] = setInterval(intentToBuyLoop, props.intentToBuyLoopDelay);
                },
                disable: function() {

                    clearInterval(executionLoops['intentToBuyLoop']);
                    delete executionLoops['intentToBuyLoop'];
                }
            },
            'wrinklerCollector': {

                enabled: props.enableWrinklerCollector,
                enable: function() {

                    executionLoops['wrinklerCollectorLoop'] = setInterval(wrinklerCollectorLoop, props.wrinklerCollectorLoopDelay);
                },
                disable: function() {

                    clearInterval(executionLoops['wrinklerCollectorLoop']);
                    delete executionLoops['wrinklerCollectorLoop'];
                }
            }
        }
    }




    /**
     * Starts all enabled loops
     */
    this.start = function() {

        Object.keys(loopStack).map(function(loop) {

            if (loopStack[loop].enabled) {

                loopStack[loop].enable();
            }
        })

    };

    /**
     * Stop all loops
     */
    this.stop = function() {

        Object.keys(executionLoops).map(function(loop) {

            clearInterval(executionLoops[loop]);
            delete executionLoops[loop];
        })
    };

    /**
     * Returns all bots
     *
     * @return     {Object}  The bots
     */
    this.bots = function() {

        return loopStack;
    }

    //Sets a external enable/disable method
    //for all bots
    this.enableBigCookieAutoClick = function() {

        loopStack['bigCookieAutoClick'].enabled = true;
        loopStack['bigCookieAutoClick'].enable();
    }
    this.disableBigCookieAutoClick = function() {

        loopStack['bigCookieAutoClick'].enabled = false;
        loopStack['bigCookieAutoClick'].disable();
    }

    this.enableShimmerCollector = function() {

        loopStack['shimmerCollector'].enabled = true;
        loopStack['shimmerCollector'].enable();
    }
    this.disableShimmerCollector = function() {

        loopStack['shimmerCollector'].enabled = false;
        loopStack['shimmerCollector'].disable();
    }

    this.enableIntentToBuy = function() {

        loopStack['intentToBuy'].enabled = true;
        loopStack['intentToBuy'].enable();
    }
    this.disableIntentToBuy = function() {

        loopStack['intentToBuy'].enabled = false;
        loopStack['intentToBuy'].disable();
    }

    this.enableWrinklerCollector = function() {

        loopStack['wrinklerCollector'].enabled = true;
        loopStack['wrinklerCollector'].enable();
    }
    this.disableWrinklerCollector = function() {

        loopStack['wrinklerCollector'].enabled = false;
        loopStack['wrinklerCollector'].disable();
    }

    init();
};










/**
 * God Mode (Need be finnished)
 *
 * @class      CookieClickerGod (name)
 */
function CookieClickerGod() {



    function listen() {

        $('.storeSection#products .product').removeClass('unlocked disabled');

        $('.storeSection#products .product').on('click', this, buyProduct);
    }

    function removeListen() {


    }



    function buyProduct(e) {

        var productId = parseInt($(e.target).prop('id').replace(/\D/g, ''));

        var product = Game.ObjectsById[productId];

        Game.Earn(product.price);

        product.buy(1);
    }

    this.start = function() {

        listen();

    }

    this.stop = function() {

    };
}







/**
 * A user interface to farmer
 *
 * @class      CookieClickerFarmUI (name)
 * @param      {Object}  Farmer  The farmer instance
 * @return     {<type>}  { description_of_the_return_value }
 */
function CookieClickerFarmUI(Farmer) {

    var self = this;


    var views = {
        box: {
            wrapper: '<div class="cookie-clicker-farm-wrapper"><div class="cookie-clicker-farm-box show"><div class="cookie-clicker-farm-content"><h1>CookieClickerFarmer</h1></div></div></div>',
            handle: '<div class="cookie-clicker-farm-handle"><i class="fa fa-cog fa-spin"></i></div>',
        },
        menu: '<div class="botTopMenu"><i class="fa fa-cog fa-spin"></i> CookieClickerFarmer</div>'
    };

    var elements = {};
    var buffer = null;

    /**
     * Initial function
     * Calls another functions to do initial config
     */
    function init() {

        insertStyles();

        renderMainView();
        renderTopMenu();
    };



    /**
     * Escape html string
     *
     * @param      {string}  string  The string
     * @return     {string}  Escaped string
     */
    function escapeHtml(string) {

        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };

        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    }

    /**
     * Insert some styles
     */
    function insertStyles() {

        //Font Awesome
        $('head').append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');

        //Self
        $('head').append('<link rel="stylesheet" type="text/css" href="https://rawgit.com/Giovani-Freitag/cookie-clicker-farm/master/style.css">');

    };

    /**
     * Render an item on top menu
     */
    function renderTopMenu() {

        $menu = $(views.menu);
        elements.$topMenu = $menu;
        $menu.on('click', this, function() {
            elements.$main.find('.cookie-clicker-farm-box').toggleClass('show');
        });

        $('#topBar').append($menu);
    }


    /**
     * Render the main view
     * It will contains the bot/hack options
     */
    function renderMainView() {

        var $box = $(views.box.wrapper);
        elements.$main = $box;
        var $handle = $(views.box.handle);
        $handle.on('click', this, function() {
            $box.find('.cookie-clicker-farm-box').toggleClass('show');
        });

        $box.find('.cookie-clicker-farm-box').prepend($handle);

        //insert inputs
        insertInputs($box);

        $('body #wrapper #game').append($box);
    }


    /**
     * Inserts inputs on main view
     *
     * @param      {Jquery Element}  $wrapper  The wrapper
     */
    function insertInputs($wrapper) {


        $wrapper.find('.cookie-clicker-farm-content').append([

            createBotInputs(),
            createHackInputs(),
        ]);
    }


    /**
    * Creates bot inputs.
    *
    * @return     {Jquery Element}  The inputs
    */
    function createBotInputs() {

        //Create section
        var $botSection = $('<section class="bot"><h1>Bot</h1></section>');

        var botInputStack = [];

        var enabledBots = Farmer.bot.bots();

        var $bigCookieAutoClick = $('<label><input type="checkbox"> Big Cookie AutoClick</label>');
        $bigCookieAutoClick.find('input').prop('checked', enabledBots.bigCookieAutoClick.enabled);
        $bigCookieAutoClick.on('change', this, changeBigCookieAutoClick);
        botInputStack.push($bigCookieAutoClick);


        var $shimmerCollector = $('<label><input type="checkbox"> Capture Golden Cookies</label>');
        $shimmerCollector.find('input').prop('checked', enabledBots.shimmerCollector.enabled);
        $shimmerCollector.on('change', this, changeShimmerCollector);
        botInputStack.push($shimmerCollector);


        var $intentToBuy = $('<label><input type="checkbox"> Buy Products and Upgrades</label>');
        $intentToBuy.find('input').prop('checked', enabledBots.intentToBuy.enabled);
        $intentToBuy.on('change', this, changeIntentToBuy);
        botInputStack.push($intentToBuy);


        var $collectWrinklers = $('<label><input type="checkbox"> Collect wrinklers</label>');
        $collectWrinklers.find('input').prop('checked', enabledBots.wrinklerCollector.enabled);
        $collectWrinklers.on('change', this, changeWrinklerCollector);
        botInputStack.push($collectWrinklers);

        //Appends all inputs to section
        $botSection.append(botInputStack);

        return $botSection;
    }


    /**
     * Creates hack inputs.
     *
     * @return     {Jquery Element}  The inputs
     */
    function createHackInputs() {

        //Create section
        var $hackSection = $('<section class="hack"><h1>Hack</h1><div class="button-wrapper"></div></section>');

        var $cookies = $('<label><span>Cookies</span><span class="input-group"><input type="number"><span><button>Set</button></span></span></label>');
        $cookies.find('button').on('click', this, setCookies);

        var $goldenCookies = $('<label><span>Golden Cookies</span><span class="input-group"><input type="number"><span><button>Set</button></span></span></label>');
        $goldenCookies.find('button').on('click', this, setGoldenCookies);

        var $ascensions = $('<label><span>Ascensions</span><span class="input-group"><input type="number"><span><button>Set</button></span></span></label>');
        $ascensions.find('button').on('click', this, setAscensions);

        var $prestige = $('<label><span>Prestige</span><span class="input-group"><input type="number"><span><button>Set</button></span></span></label>');
        $prestige.find('button').on('click', this, setPrestige);

        var $gamingHours = $('<label><span>Gaming Hours</span><span class="input-group"><input type="number"><span><button>Set</button></span></span></label>');
        $gamingHours.find('button').on('click', this, setGamingTime);

        //Buffer
        var $buffer = $('<label><span>Buffer</span><input type="range" min="0" max="99999999999999999"><div class="button-wrapper"><button>Start</button><button>Stop</button></div></label>');
        $buffer.find('input').on('change', this, changeBuffer);
        $buffer.find('button:nth-child(1)').on('click', this, startBuffer);
        $buffer.find('button:nth-child(2)').on('click', this, stopBuffer);

        //Shimmer
        var $shimmer = $('<label><span>Shimmer Spawner</span><div class="button-wrapper"><button>Start</button><button>Stop</button><button>Once</button></div></label>');
        $shimmer.find('button:nth-child(1)').on('click', this, startShimmerSpawner);
        $shimmer.find('button:nth-child(2)').on('click', this, stopShimmerSpawner);
        $shimmer.find('button:nth-child(3)').on('click', this, spawnOneShimmer);

        //Achievements
        var $achievements = $('<label><span>Achievements</span><select></select><div class="button-wrapper"><button>Unlock</button><button>Lock</button></div></label>');
        var achievementStack = Object.keys(Game.Achievements).sort().map(function(achiev) {
            return '<option value="' + escapeHtml(achiev) + '">' + escapeHtml(achiev) + '</option>';
        });
        achievementStack.unshift('<option value="">All</option>');
        $achievements.find('select').append(achievementStack);
        $achievements.find('button:nth-child(1)').on('click', this, earnAchievements);
        $achievements.find('button:nth-child(2)').on('click', this, removeAchievements);

        //Upgrades
        var $upgrades = $('<label><span>Upgrades</span><select></select><div class="button-wrapper"><button>Unlock</button><button>Lock</button><button>Earn</button><button>Remove</button></div></label>');
        var upgradesStack = Object.keys(Game.Upgrades).sort().map(function(update) {
            return '<option value="' + escapeHtml(update) + '">' + escapeHtml(update) + '</option>';
        });
        upgradesStack.unshift('<option value="">All</option>');
        $upgrades.find('select').append(upgradesStack);
        $upgrades.find('button:nth-child(1)').on('click', this, unlockUpgrades);
        $upgrades.find('button:nth-child(2)').on('click', this, lockUpgrades);
        $upgrades.find('button:nth-child(3)').on('click', this, earnUpgrades);
        $upgrades.find('button:nth-child(4)').on('click', this, loseUpgrades);


        //Products
        var $products = $('<label><span>Products</span><select></select><input type="number" placeholder="amount"><div class="button-wrapper"><button>Get</button><button>Remove</button><button>Buy</button><button>Sell</button></div></label>');
        var productStack = Object.keys(Game.Objects).sort().map(function(product) {
            return '<option value="' + escapeHtml(product) + '">' + escapeHtml(product) + '</option>';
        });
        productStack.unshift('<option value="">All</option>');
        $products.find('select').append(productStack);
        $products.find('button:nth-child(1)').on('click', this, getProducts);
        $products.find('button:nth-child(2)').on('click', this, removeProducts);
        $products.find('button:nth-child(3)').on('click', this, buyProducts);
        $products.find('button:nth-child(4)').on('click', this, sellProducts);

        $hackSection.append([$cookies, $goldenCookies, $ascensions, $prestige, $gamingHours, $buffer, $shimmer, $achievements, $upgrades, $products]);


        return $hackSection;
    }



    /**
     * Enable/Disable big cookie autoclick
     */
    function changeBigCookieAutoClick(e) {

        if ($(e.target).is(':checked')) {

            Farmer.bot.enableBigCookieAutoClick();

        } else {

            Farmer.bot.disableBigCookieAutoClick();
        }
    }

    /**
     * Enable/Disable shimmer collector
     */
    function changeShimmerCollector(e) {

        if ($(e.target).is(':checked')) {

            Farmer.bot.enableShimmerCollector();
        } else {

            Farmer.bot.disableShimmerCollector();
        }
    }

    /**
     * Enable/Disable product/upgrade buyer
     */
    function changeIntentToBuy(e) {

        if ($(e.target).is(':checked')) {

            Farmer.bot.enableIntentToBuy();
        } else {

            Farmer.bot.disableIntentToBuy();
        }
    }

    /**
     * Enable/Disable wrinkler collector
     */
    function changeWrinklerCollector(e) {

        if ($(e.target).is(':checked')) {

            Farmer.bot.enableWrinklerCollector();

        } else {

            Farmer.bot.disableWrinklerCollector();
        }
    }

    /**
     * Set player cookies amount
     */
    function setCookies(e) {

        var cookies = parseInt($(e.target).parent().siblings('input').val());
        Game.cookies = cookies;
    }

    /**
     * Set player golden cookies amount
     */
    function setGoldenCookies(e) {

        var goldenCookies = parseInt($(e.target).parent().siblings('input').val());
        Game.goldenClicks = goldenCookies;
        Game.UpdateMenu();
    }

    /**
     * Set gaming time
     */
    function setGamingTime(e) {

        var gamingTime = parseInt($(e.target).parent().siblings('input').val());
        Farmer.setGamingTime(gamingTime);
    }

    /**
     * Set game resets amount
     */
    function setAscensions(e) {

        var ascensions = parseInt($(e.target).parent().siblings('input').val());
        Game.resets = ascensions;
        Game.UpdateMenu();
    }

    /**
     * Set player prestige points amount
     */
    function setPrestige(e) {

        var prestige = parseInt($(e.target).parent().siblings('input').val());
        Game.prestige = prestige;
        Game.UpdateMenu();
    }


    function changeBuffer(e) {

        var pow = parseInt($(e.target).val());

        console.log(buffer, pow);

        if (buffer && buffer.multCpS) {

            buffer.multCpS = pow;
            buffer.multClick = pow;
        }
    }

    /**
     * Start a buffer
     */
    function startBuffer(e) {

        var time = 9999999999999999;
        var pow = parseInt($(e.target).parent().siblings('input').val());

        buffer = Game.setBuff({
            name: 'CookieClickerFarm',
            desc: 'Cookie production x' + pow + ' for ' + time + ' seconds!',
            icon: [10, 14],
            time: time,
            add: true,
            multCpS: pow,
            multClick: pow,
            aura: 1
        });
    }

    /**
     * Stop buffers
     */
    function stopBuffer(e) {

        Game.killBuffs();

        $('#buffs').empty();
    }

    /**
     * Start farmer shimmer spawner
     */
    function startShimmerSpawner(e) {

        Farmer.startShimmerSpawner();
    }

    /**
     * Stop farmer shimmer spawner
     */
    function stopShimmerSpawner(e) {

        Farmer.stopShimmerSpawner();
    }

    /**
     * Spawn a single shimmer
     */
    function spawnOneShimmer(e) {

        Farmer.forceShimmer();
    }

    /**
     * Give player achievement
     */
    function earnAchievements(e) {

        var achiev = $(e.target).parent().siblings('select').val();
        Farmer.unlockAchievements(achiev);
    }

    /**
     * Remove player achievement
     */
    function removeAchievements(e) {

        var achiev = $(e.target).parent().siblings('select').val();
        Farmer.lockAchievements(achiev);
    }

    /**
     * Unlock player upgrades
     */
    function unlockUpgrades(e) {

        var upgrade = $(e.target).parent().siblings('select').val();
        Farmer.unlockUpgrades(upgrade);
    }

    /**
     * Lock player upgrades
     */
    function lockUpgrades(e) {

        var upgrade = $(e.target).parent().siblings('select').val();
        Farmer.lockUpgrades(upgrade);
    }

    /**
     * Give player upgrades
     */
    function earnUpgrades(e) {

        var upgrade = $(e.target).parent().siblings('select').val();
        Farmer.earnUpgrades(upgrade);
    }

    /**
     * Remove player upgrades
     */
    function loseUpgrades(e) {

        var upgrade = $(e.target).parent().siblings('select').val();
        Farmer.loseUpgrades(upgrade);
    }

    /**
     * Give player products
     */
    function getProducts(e) {

        var product = $(e.target).parent().siblings('select').val();
        var amount = $(e.target).parent().siblings('input').val();

        Farmer.getProducts(amount, product);
    }

    /**
     * Remove player products
     */
    function removeProducts(e) {

        var product = $(e.target).parent().siblings('select').val();
        var amount = $(e.target).parent().siblings('input').val();

        Farmer.removeProducts(amount, product);
    }

    /**
     * Give player products
     */
    function buyProducts(e) {

        var product = $(e.target).parent().siblings('select').val();
        var amount = $(e.target).parent().siblings('input').val();

        Farmer.buyProducts(amount, product);
    }

    /**
     * Remove player products
     */
    function sellProducts(e) {

        var product = $(e.target).parent().siblings('select').val();
        var amount = $(e.target).parent().siblings('input').val();

        Farmer.sellProducts(amount, product);
    }
    
    init();
}

//Legacy setter
//handmake cookie setter
//Save Generator
//Bypass Mod to buy anything (click products, upgrades, achievments, remove buff)
//Buy chistmas and dragon, else sacrifice cookies for them
//