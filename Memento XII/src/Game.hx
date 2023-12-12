typedef Hotspot = {
	var i : h2d.Interactive;
	var spr : Null<HSprite>;
	var name : String;
	var act : Map<String, Dynamic>;
}

class Game extends dn.Process {//}
	public static var ME : Game;

	static var SHOW_COLLISIONS = false;
	static var INAMES : Map<String,String> = [
		"picture" => "Old picture",
		"picPart1" => "Ripped photo (1/3)",
		"picPart2" => "Ripped photo (2/3)",
		"picPart3" => "Ripped photo (3/3)",
		"chestKey" => "Small copper key",
		"knife" => "Blunt knife",
		"ring" => "Wedding ring",
		"cupKey" => "Large iron key",
		"broom" => "Broom",
		"finalLetter" => "A letter",
	];
	static var EXTENDED = true;

	static final LOOK = "Look";
	static final PICK = "Take";
	static final USE = "Use";
	static final ITEM = "Inventory";
	static final OPEN = "Open";
	static final CLOSE = "Close";
	static final REMEMBER = "Remember";
	static final HELP = "I'm stuck!";
	static final ABOUT = "About";

	public var wrapper : h2d.Layers;
	var world		: World;
	var player		: Entity;
	var distort : DistortFilter;

	var onArrive	: Null<Void->Void>;
	var afterPop	: Null<Void->Void>;
	var inventory	: List<String>;
	var triggers	: Map<String,Int>;
	var actions		: List<h2d.Text>;
	var pending		: Null<String>;

	var footStep = 0.;
	var walkAnimSpd = 0.75;

	var snapshotTex : h3d.mat.Texture;
	var popUp		: Null<h2d.Flow>;
	var curName		: Null<h2d.Text>;
	var roomBg		: HSprite;
	var invCont		: h2d.Flow;
	var invSep1		: HSprite;
	var invSep2		: HSprite;
	var actionsWrapper : h2d.Object;
	var miscWrapper : h2d.Flow;
	var heroFade	: HSprite;

	var popQueue	: List<String>;
	var hotSpots	: Array<Hotspot>;
	var lastSpot	: Null<Hotspot>;

	var uiInteractives : Array<h2d.Interactive> = [];

	var playerPath	: Array<{cx:Int, cy:Int}>;
	var playerTarget: Null<{cx:Int, cy:Int}>;

	var fl_pause	: Bool;
	var fl_lockControls	: Bool;
	var fl_ending	: Bool;
	var skipClick	: Bool;

	var room		: String;

	var pathFinder : dn.pathfinder.AStar<{cx:Int, cy:Int}>;

	public function new() {
		super(Main.ME);


		createRoot(Main.ME.root);
		ME = this;
		new h2d.Bitmap( h2d.Tile.fromColor(#if debug 0x151515 #else Const.BG_COLOR #end, Const.WID, Const.HEI), root );

		actions = new List();
		fl_pause = false;
		fl_lockControls = false;
		fl_ending = false;
		skipClick = false;
		hotSpots = new Array();
		playerPath = new Array();
		inventory = new List();
		triggers = new Map();
		popQueue = new List();

		pathFinder = new dn.pathfinder.AStar( (x,y)->{ cx:x, cy:y } );

		room = "cell";

		// #if debug
		// room = "park";
		// //inventory.add("picPart1");
		// triggers.set("phoneDropped",1);
		// triggers.set("letterPop",1);
		// //triggers.set("sinkClean",1);
		// //inventory.add("broom");
		// //inventory.add("knife");
		// inventory.add("ring");
		// inventory.add("chestKey");
		// triggers.set("framed",1);
		// triggers.set("foundChest",1);
		// //triggers.set("sinkClean",1);
		// //triggers.set("sinkOpen",1);
		// #end

		wrapper = new h2d.Layers(root);
		wrapper.x = Std.int( Const.WID*0.5 - Const.GAMEZONE_WID*0.5 );

		snapshotTex = new h3d.mat.Texture(w(),h(), [Target]);

		distort = new DistortFilter(2,32,4);
		distort.intensity = 0;
		root.filter = distort;

		initWorld();

		player = new Entity(world, Assets.tiles.h_get("player"));
		player.spr.setCenterRatio(0.5, 0.95);
		player.moveTo(10,5);
		wrapper.add(player.spr, 5);
		player.spr.anim.registerStateAnim("walkUp", 1, walkAnimSpd, ()->player.dirY==-1 && player.isMoving() && !isGameLocked() );
		player.spr.anim.registerStateAnim("walkDown", 1, walkAnimSpd, ()->player.dirY==1 && player.isMoving() && !isGameLocked() );
		player.spr.anim.registerStateAnim("standDown", 0, ()->player.dirY==1);
		player.spr.anim.registerStateAnim("standUp", 0, ()->player.dirY==-1);

		invSep1 = Assets.tiles.h_get("separator", 0);
		wrapper.add(invSep1, 3);
		invSep1.setCenterRatio(0,0.7);
		invSep1.alpha = 0;

		invSep2 = Assets.tiles.h_get("separator", 1);
		wrapper.add(invSep2, 3);
		invSep2.setCenterRatio(0,0.3);
		invSep2.alpha = 0;


		Boot.ME.s2d.addEventListener(onEvent);

		heroFade = Assets.tiles.h_get("heroFade");
		heroFade.setCenterRatio(0.5, 0.5);
		heroFade.visible = false;
		wrapper.add(heroFade, 5);

		// Attach actions
		var x = 0;
		var y = 0;
		actionsWrapper = new h2d.Object();
		wrapper.add(actionsWrapper, 1);
		miscWrapper = new h2d.Flow();
		wrapper.add(miscWrapper, 1);
		miscWrapper.minWidth = Const.GAMEZONE_WID;
		miscWrapper.horizontalAlign = Middle;
		miscWrapper.horizontalSpacing = 16;
		miscWrapper.y = 108;

		var alist = [LOOK, REMEMBER, USE, PICK, OPEN, CLOSE, HELP];
		if( EXTENDED )
			alist.push(ABOUT);
		for(a in alist) {
			var tf = makeText(a);
			switch a {
				case ABOUT:
					miscWrapper.addChild(tf);

				case HELP:
					miscWrapper.addChild(tf);

				case _:
					var w = 40;
					tf.x = Std.int( -1 + x*w + w*0.5-tf.textWidth*0.5 );
					tf.y = 85 + y*10;
					actionsWrapper.addChild(tf);
			}
			if( a==ABOUT ) {
				tf.y+= 17;
				tf.x+=45;
				tf.textColor = 0x668275;
			}
			if( a==HELP ) {
				tf.y+= 17;
				if( EXTENDED )
					tf.x+=45;
				else
					tf.x+=92;
				tf.textColor = 0x668275;
			}
			tf.alpha = 0.6;
			addInteractive(tf, {
				over: ()->{
					if( !fl_lockControls && tf.text!=pending )
						tf.alpha = 0.7;
				},
				out: ()->{
					if( tf.text!=pending )
						tf.alpha = 0.48;
				},
				click: ()->{
					if( !fl_lockControls )
						setPending(a);
				},
			});
			x++;
			if( x>=3 ) {
				x = 0;
				y++;
			}
			actions.add(tf);
		}

		setPending();

		initHotSpots();
		updateInventory();

		Assets.SOUNDS.ambiant().play(true);

		// Intro
		#if !debug
		root.alpha = 0;
		tw.createMs(root.alpha, 1, 2000);
		distort.intensity = 0.5;
		tw.createMs(distort.intensity, 0, TEaseOut, 5000);
		player.spr.anim.playAndLoop("wakeWait");
		player.moveTo(10,4);
		player.update(tmod);
		pop("Day 4380");
		pop("!...12 years today.");
		pop("And still many to go in this cell.");
		pop("My cozy little world.");
		afterPop = function() {
			fl_pause = true;
			player.spr.anim.play("wakeUp", 1);
			var a = tw.createMs(player.yr, 1, 300);
			a.onUpdate = function() {
				// DSprite.updateAll();
				player.update(tmod);
			}
			a.onEnd = function() {
				resumeGame();
				Assets.SOUNDS.footstep1(1);
				player.moveTo(10,5);
				player.yr = 0;
				player.update(tmod);
			}
		}
		#end

		dn.Process.resizeAll();
	}


	override function onResize() {
		super.onResize();
		root.x = Std.int( w()*0.5 - Const.WID*0.5*Const.SCALE );
		root.setScale(Const.SCALE);
		snapshotTex.resize(w(), h());
	}

	override function onDispose() {
		super.onDispose();
		Boot.ME.s2d.removeEventListener(onEvent);
	}

	function onEvent(ev:hxd.Event) {
		switch ev.kind {
			case EPush:
				onMouseDown(ev);

			case ERelease:
				onMouseUp(ev);

			case EMove:
			case EOver:
			case EOut:
			case EWheel:
			case EFocus:
			case EFocusLost:
			case EKeyDown:
			case EKeyUp:
			case EReleaseOutside:
			case ETextInput:
			case ECheck:
		}
	}

	function onMouseDown(ev:hxd.Event) {
		if( skipClick || fl_ending )
			return;

		if( fl_pause ) {
			resumeGame();
			closePop();
			return;
		}

		if( fl_lockControls )
			return;

		onArrive = null;
		var m = getMouse();
		movePlayer(m.cx,m.cy);
	}

	function onMouseUp(ev:hxd.Event) {
		if( fl_pause )
			return;
	}

	function addInteractive(o:h2d.Object, events:{ ?over:Void->Void, ?out:Void->Void, ?click:Void->Void }) {
		// Create interactive
		var b = o.getBounds(wrapper);
		var i = new h2d.Interactive(b.width,b.height,wrapper);
		i.setPosition(b.x, b.y);
		uiInteractives.push(i);

		// Bind events
		if( events.click!=null ) i.onClick = (_)->events.click();
		if( events.over!=null ) i.onOver = (_)->events.over();
		if( events.out!=null ) i.onOut = (_)->events.out();

		// Track object & refresh
		var p = createChildProcess();
		p.onUpdateCb = ()->{
			if( o.parent==null ) {
				p.destroy();
				i.remove();
				uiInteractives.remove(i);
				return;
			}
			o.getBounds(wrapper, b);
			i.setPosition(b.x, b.y);
			i.width = b.width;
			i.height = b.height;
		}
	}


	function makeText(str:String, multiline=false) {
		var tf = new h2d.Text(Assets.font);
		tf.text = str;
		tf.filter = new dn.heaps.filter.PixelOutline();
		if( multiline )
			tf.maxWidth = Const.GAMEZONE_WID-15;
		return tf;
	}

	function resumeGame() {
		fl_pause = false;
		lockControls(false);
		if( curName!=null )
			curName.visible = true;
	}

	inline function isGameLocked() {
		return destroyed || fl_pause || fl_lockControls || fl_ending;
	}

	function lockControls(l) {
		fl_lockControls = l;
		actionsWrapper.alpha = l ? 0.3 : 1;

		applyInteractiveVisibility();
		hideName();
		updateInventory();
	}

	function applyInteractiveVisibility() {
		for(hs in hotSpots)
			hs.i.visible = !fl_lockControls;

		for(i in uiInteractives)
			i.visible = !fl_lockControls;

	}


	function setPending(?a:String) {
		for( tf in actions ) {
			tf.filter = null;
			tf.alpha = 0.48;
		}

		if( a==HELP ) {
			getTip();
			return;
		}

		if( a==ABOUT ) {
			Assets.SOUNDS.select(1);
			pop("@This game was made by Sebastien \"deepnight\" Benard in 48h for the Ludum Dare 23 game jam (theme: \"Tiny World\").");
			pop("@The first version being in Flash, it was ported to WebGL and DirectX on December 2020.");
			pop("@Visit DEEPNIGHT.NET for more games :)");
			return;
		}
		if( a!=pending )
			Assets.SOUNDS.select(1);

		if( a==null )
			a = LOOK;

		pending = a;
		for(tf in actions)
			if( tf.text==a ) {
				tf.alpha = 1;
				tf.filter = new dn.heaps.filter.PixelOutline(0x404b63);
			}
	}

	function movePlayer(cx,cy) {
		var pt = getClosest(cx,cy);
		if( pt==null || pt.x==player.cx && pt.y==player.cy )
			return false;

		playerPath = getPath(player.cx, player.cy, pt.x, pt.y);
		playerTarget = {cx:cx, cy:cy}

		return playerPath.length>0;
	}

	function setTrigger(k, ?n=1) {
		triggers.set(k,n);
		refreshWorld();
		if( k=="kitchenLeftOpen" || k=="kitchenRightOpen" )
			Assets.SOUNDS.door(1);
	}
	function getTrigger(k) {
		return if( triggers.exists(k) ) triggers.get(k) else 0;
	}
	function hasTrigger(k) {
		return getTrigger(k)!=0;
	}
	function hasTriggerSet(k) {
		if( getTrigger(k)!=0 )
			return true;
		else {
			setTrigger(k);
			return false;
		}
	}

	function hasItem(k) {
		for(i in inventory)
			if(i==k)
				return true;
		return false;
	}

	function removeItem(k:String) {
		inventory.remove(k);
		updateInventory();
	}

	function addItem(k:String) {
		Assets.SOUNDS.pick(1);
		inventory.add(k);
		refreshWorld();
		if( hasItem("picPart1") && hasItem("picPart2") && hasItem("picPart3") && !hasTrigger("gotPicture") ) {
			removeItem("picPart1");
			removeItem("picPart2");
			removeItem("picPart3");
			addItem("picture");
			setTrigger("gotPicture");
			Assets.SOUNDS.success(1);
			pop("!You assembled the 3 parts and now have restored the PICTURE.");
		}
		updateInventory();
	}

	function updateInventory() {
		var old = if( invCont!=null ) invCont.alpha else 0;
		if( invCont!=null )
			invCont.remove();

		invCont = new h2d.Flow();
		invCont.layout = Vertical;
		invCont.x = 2;
		invCont.y = 132;
		invCont.minWidth = Const.GAMEZONE_WID;
		invCont.minHeight = 4;
		invCont.horizontalAlign = Middle;
		invCont.verticalSpacing = 1;
		invCont.alpha = old;
		wrapper.add(invCont, 1);

		var a = if( inventory.length==0 ) 0 else 1;
		tw.createMs(invCont.alpha, a);
		tw.createMs(invSep1.alpha, a);
		tw.createMs(invSep2.alpha, a);

		var n = 1;
		for(i in inventory) {
			var name = INAMES.get(i);
			var tf = makeText( name!=null ? name : "!!"+i+"!!" );
			tf.textColor = 0x957E51;
			invCont.addChild(tf);
			addInteractive(tf, { click:()->pop("@You don't need to select items in your inventory to use them. Just choose the USE action above.")});
			n++;
		}

		invSep1.x = invCont.x-8;
		invSep1.y = invCont.y;

		invSep2.x = invCont.x-8;
		invSep2.y = invCont.y + invCont.outerHeight;
	}

	function getMouse() {
		var x = Std.int( ( Boot.ME.s2d.mouseX - root.x) / Const.SCALE - wrapper.x );
		var y = Std.int( Boot.ME.s2d.mouseY / Const.SCALE - wrapper.y );
		var cx = Std.int( x/Const.GRID );
		var cy = Std.int( y/Const.GRID );

		return {
			x: x,
			y: y,
			cx: cx,
			cy: cy,
		}
	}

	function runPending(hs:Hotspot) {
		if( fl_pause || fl_lockControls || pending==null )
			return;

		var a = pending;

		if( !hs.act.exists(a) )
			a = "all";

		if( hs.act.exists(a) ) {
			var resolve = function() {
				var r = hs.act.get(a);
				switch Type.typeof(r) {
					case TFunction: r();
					case TClass(String): pop(r);
					case _: throw "Unknown action type: "+Type.typeof(r);
				}
			}

			skipClick = true;
			var m = getMouse();
			if( movePlayer(m.cx, m.cy) )
				onArrive = resolve;
			else
				resolve();
		}
		else {
			switch(pending) {
				case LOOK : pop("Not much to say.");
				case PICK : pop("I don't think I need that.");
				case OPEN : pop("This can't be opened.");
				case CLOSE : pop("What?");
				case USE : pop("I have no use for that.");
				case REMEMBER : pop("I... I don't remember anything about that...");

			}
		}
	}

	function getClosest(cx,cy) {
		if( !world.collide(cx,cy) )
			return { x:cx, y:cy }

		var all = dn.Bresenham.getDisc(cx,cy, 3);
		var dh = new dn.DecisionHelper(all);
		dh.remove( (pt)->world.collide(pt.x, pt.y) );
		dh.score( (pt)->pt.x==cx && pt.y-cy<=2 ? 1 : 0 ); // below
		dh.score( (pt)->M.fabs(pt.x-cx)<=1 && pt.y==cy ? 1 : 0 ); // left or right
		dh.score( (pt)->-M.dist(cx,cy, pt.x, pt.y) ); // close to requested pt
		dh.score( (pt)->-M.dist(pt.x, pt.y, player.cx, player.cy)*0.1 ); // close to player
		return dh.getBest();
	}

	public function getPath(x:Int,y:Int, tx:Int,ty:Int) {
		if ( world.collide(x,y) || world.collide(tx,ty) )
			return [];
		else
			return pathFinder.getPath(x,y, tx,ty);
	}


	function initHotSpots() {
		// Cleanup
		for(hs in hotSpots) {
			hs.i.remove();
			if( hs.spr!=null )
				hs.spr.remove();
		}
		hotSpots = new Array();


		if( room!="hell" ) {
			addSpot(16,27,26,7, "A rusty pipe");
			setAction(LOOK, "It brings me my daily water ration.");
			setAction(REMEMBER, "For as long I remember, water has always seeped out of this pipe.");
			setAction(USE, "It's useless, I can't fix it.");

			addSpot(9,39,7,17, "Iron door");
			setAction(LOOK,"12 years already... Once a day, they serve my food in a metal tray.");
			setAction(OPEN,"Guess what? It's locked.");
			setAction(CLOSE,"This door seems to be intended to remain closed for the rest of eternity.");
			setAction(PICK, "What?");
			setAction(REMEMBER,"This door was locked 12 years ago. Only once. Never opened since then. I can't even remember the color of the corridor walls behind.");

			addSpot(73,26,21,14, "My bed");
			setAction(LOOK, "It is almost as hard as the concrete ground.");
			setAction(USE, "No, I just woke up. ");
			if( room=="cell" )
				setAction(REMEMBER, "4380 nights spent in this bed.");
			else {
				setAction(REMEMBER, function() {
					changeRoom("cell");
				});
			}
		}

		if( room=="cell" ) {
			addSpot(49,25,14,14, "Steel table");
			setAction(LOOK, "Despite its aspect, this table isn't very stable.|But as everything down here, with time, you get used to it.");
			setAction(REMEMBER, "They gave me this table 2 or 3 years ago.|Before that, I used to lay on the floor or on my bed.");

			addSpot(51,28,6,4, "A pen");
			setAction(LOOK, "A simple black pen.");
			setAction(REMEMBER, "I didn't use it often...|Actually, I only wrote a letter or something...|Can't remember, but it was kind of... IMPORTANT.");
			setAction(PICK, "I don't think I will need it.");
			setAction(USE, "I don't have anything to write on.");

			if( !hasItem("picPart1") && !hasTrigger("gotPicture") ) {
				addSpot(57,24,6,7, "A ripped pîcture");
				setSprite( Assets.tiles.h_get("picPart1") );
				setAction(LOOK, "An old picture, totally torn...");
				setAction(REMEMBER, "I don't remember anything about this picture... I should look for the other parts.");
				setAction(PICK, function() {
					pop("You pick it up. The picture is incomplete (probably 3 parts).");
					addItem("picPart1");
				});
			}

			if( !hasTrigger("framed") ) {
				addSpot(52,22,5,6, "Empty frame");
				if( hasTrigger("gotPicture") )
					setAction(USE, function() {
						pop("You put the picture back in its frame. It fits perfectly.");
						setTrigger("framed");
						Assets.SOUNDS.success(1);
						removeItem("picture");
					});
				else
					setAction(USE, "I don't have anything to put inside.");
				setAction(LOOK, "This frame is empty.|!Hmm... Where is the picture?");
				setAction(REMEMBER, "I can't remember if I removed the frame content myself...");
				setAction(OPEN, "Nothing inside.");
			}
			else {
				addSpot(52,22,5,6, "A very old picture");
				setSprite( Assets.tiles.h_get("framed") );
				setAction(LOOK, "The picture is very old and damaged. The character on the picture is barely recognizable.|A woman?|@You can use REMEMBER to recall important details about things around you.");
				setAction(PICK, "No, this picture is in its place.");
				setAction(REMEMBER, function() {
					if( !hasTriggerSet("firstMemory") ) {
						pop("The picture is very old and damaged. The character on the picture is barely recognizable. A woman?|...|!Lydia?");
						afterPop = changeRoom.bind("kitchen");
					}
					else
						changeRoom("kitchen");
				});
			}

			addSpot(20,32,20,19, "Stagnant water");
			setAction(LOOK, "The water slowly seeps through cracks into my world.");
			setAction(CLOSE, "I can't do anything to stop it.");
			setAction(PICK, "I will have plenty of water here soon enough.");

			addSpot(70,51,16,14, "Ray of light");
			setAction(LOOK, "A cold light falls upon my little world.");
			setAction(REMEMBER, "I won't feel anymore the sea breeze in my hairs.");
			setAction(PICK, "What?");

			if( !hasTrigger("calendar") ) {
				addSpot(40,20,8,9, "An old calendar");
				setSprite( Assets.tiles.h_get("calendar") );
				setAction(LOOK, "This calendar is from other times... Even the year print has almost completely disappeared.|!...Hey, is there some kind of hole behind it?");
				setAction(REMEMBER, "I think SOMEONE bought me this calendar when I was sent in here.");
				var f = function() {
					setTrigger("calendar");
					Assets.SOUNDS.smallHit(1);
					pop("As you pull the calendar, you reveal a hole hidden behind it...");
				}
				setAction(USE, f);
				setAction(OPEN, f);
			}
			else {
				addSpot(37,20,8,9, "Hidden hole");
				if( !hasItem("picPart2") && !hasTrigger("gotPicture")  )
					setAction(LOOK, function() {
						pop("You found the fragment of a ripped picture.");
						addItem("picPart2");
					});
				else
					setAction(LOOK, "This holes is empty.");
				setAction(CLOSE, "The calendar won't stay.");
				setAction(REMEMBER, "Did I make this hole? I can't remember.");
			}

			addSpot(59,61,21,13, "Unused bed base");
			setAction(LOOK, "It was never used. No one never got transfered in this cell, except me.");
			setAction(USE, "From time to time, I switch my beds. Just for a pleasant change.");
			setAction(REMEMBER, "I think it was already here when I was brought here.");

			if( !hasItem("picPart3") && !hasTrigger("gotPicture") ) {
				addSpot(88,25,5,6, "Some sort of paper");
				setSprite( Assets.tiles.h_get("picPart3") );
				setAction(LOOK, "The fragment of a ripped picture is hidden under the bolster.");
				setAction(REMEMBER, "How did it get there?");
				setAction(PICK, function() {
					pop("It's a fragment of a ripped picture.");
					addItem("picPart3");
				});
			}

			addSpot(56,39,7,9, "Chair");
			setAction(LOOK, "Rusted.");
			setAction(USE, "There is nothing to wait.");

			addSpot(14,64,8,12, "Sink");
			if( hasTrigger("sinkOpen") ) {
				var s = Assets.tiles.h_get("flow");
				setSprite(s);
				s.x+=1;
				s.y+=3;
				s.anim.playAndLoop("flow");
			}
			if( !hasTrigger("sinkClean") ) {
				setAction(PICK, "I need a tool or something.");
				setAction(LOOK, "A basic sink with an old faucet.|!Something is blocking the pipe.");
				setAction(REMEMBER, "I remember something important felt in the pipe.|!...Wasn't it a KEY?");
				setAction(OPEN, "!No, something is stuck inside the pipe.");
			}
			else {
				if( !hasTrigger("sinkOpen") )
					setAction(LOOK, "I try to keep it as clean as possible.");
				else
					setAction(LOOK, "The water is not exactly clear.");
				setAction(OPEN, function() {
					setTrigger("sinkOpen");
					Assets.SOUNDS.robinet(1);
				});
				setAction(CLOSE, function() {
					setTrigger("sinkOpen",0);
					Assets.SOUNDS.robinet(1);
				});
			}
			if( !hasTrigger("sinkOpen") )
				if( !hasTrigger("sinkClean") )
					setAction(USE, "!Something is stuck in the pipe: I need a tool or something.");
				else
					setAction(USE, "I need to open the water first.");
			if( hasTrigger("sinkClean") && hasTrigger("sinkOpen") ) {
				if( hasItem("cupKey") && !hasTrigger("washedKey") )
					setAction(USE, function() {
						pop("You wash the key, fussy ol'man.");
						setTrigger("washedKey");
					});
				else
					setAction(USE, "The water feels refreshing.");
			}
			else if( hasItem("knife") && !hasTrigger("sinkClean") )
				setAction(USE, function() {
					pop("Using the knife, you manage to remove the thing blocking the sink.");
					pop("You take out lots of dirt. Trapped inside, you find a KEY.");
					setTrigger("sinkClean");
					Assets.SOUNDS.success(1);
					addItem("cupKey");
				});

			addSpot(89,41,6,6, "Small wooden case");
			if( hasTrigger("ringBack") ) {
				var s = setSprite( Assets.tiles.h_get("ringBack") );
				s.x+=1;
				s.y+=1;
				setAction(REMEMBER, changeRoom.bind("park"));
			}
			else
				setAction(REMEMBER, "I'm pretty sure it was not normally empty.|There is a thin slot in a soft cushion inside of the box.|!But what should go in there?");
			if( !hasTrigger("ringBack") )
				setAction(LOOK, "It looks like some kind of jewel case. It is empty.");
			else
				setAction(LOOK, "Lydia's ring is back in its box. Why did I hide it?");
			setAction(PICK, "I prefer to let it here.");
			if( hasItem("ring") )
				setAction(USE, function() {
					pop("You put Lydia's ring back in its case.");
					Assets.SOUNDS.success(1);
					removeItem("ring");
					setTrigger("ringBack");
				});
		}


		if( room=="kitchen" ) {
			addSpot(49,20,5,6, "Old picture of a woman");
			setAction(LOOK, "A young and beautiful smiles at you, radiant with joy.");
			setAction(PICK, "No, this picture is in its place.");
			setAction(REMEMBER, function() {
				pop("Lydia...|As beautiful as in my memories.");
				if( EXTENDED )
					afterPop = changeRoom.bind("cell");
			});

			addSpot(42,29,8,6, "Sideboard left door");
			if( hasTrigger("kitchenLeftOpen") ) {
				setSprite( Assets.tiles.h_get("kitchenDoor") );
				setAction(LOOK, "All kind of silverware, plates and things like that.");
				setAction(REMEMBER, "I used to be the chef of the house...");
			}
			setAction(OPEN, function() setTrigger("kitchenLeftOpen",1));
			setAction(CLOSE, function() setTrigger("kitchenLeftOpen",0));

			addSpot(70,51,12,13, "Warm ray of light");
			setAction(LOOK, "The warm feeling if pleasant and reassuring.");
			setAction(REMEMBER, "The kitchen used to be a room bathed in light.|I guess it's summer outside.");
			setAction(PICK, "What?");

			addSpot(51,29,8,6, "Sideboard right door");
			if( hasTrigger("kitchenRightOpen") ) {
				setSprite( Assets.tiles.h_get("kitchenDoor") );
				if( !hasTrigger("foundChest") ) {
					setAction(LOOK, function() {
						pop("Cups, thousands of spoons and a tea set.|!You also found a STEEL CHEST inside the sideboard.");
						afterPop = function() {
							setTrigger("foundChest");
							Assets.SOUNDS.hit(1);
						}
					});
				}
				else
					setAction(LOOK, "Cups, thousands of spoons and a tea set.");
				setAction(REMEMBER, "Lydia was really fond of tea...");
			}
			setAction(OPEN, function() setTrigger("kitchenRightOpen",1));
			setAction(CLOSE, function() setTrigger("kitchenRightOpen",0));

			addSpot(42,47,6,13, "My chair");
			setAction(LOOK, "My good old chair.");
			setAction(REMEMBER, "Years ago, I used to sit here, and wait for...|Well. something... I don'k know.|!But nothing ever happened.");
			setAction(USE, "Nah, I've spent too much time on this chair, at home...");

			addSpot(25,45,16,22, "Kitchen table");
			setAction(LOOK, "My sturdy kitchen table.|It will last longer than me.");
			setAction(REMEMBER, "Years ago, I used to sit here, and wait for...|Well. something... I don'k know.|!But nothing ever happened.");

			addSpot(18,24,8,14, "Lydia's chair");
			setAction(LOOK, "Nice chair");
			setAction(REMEMBER, "After Lydia's death, this chair stood in the corner of my kitchen.");

			if( !hasTrigger("rememberTable") ) {
				addSpot(31,48,10,13, "Tablecloth");
				setSprite( Assets.tiles.h_get("kitchenTable", 0) );
				setAction(LOOK, "Very old. And completely stained.|!As you touch the surface, you feel something underneath...");
				setAction(REMEMBER, "It's so old that I think Lydia even bought it before we met.|!I remember she had the habit to hide... SOMETHING underneath...");
				var f = function() {
					pop("You remove the tablecloth...");
					afterPop = function() {
						Assets.SOUNDS.smallHit(1);
						pop("...revealing a small key.");
						//setTrigger("foundKey");
						setTrigger("rememberTable");
						//afterPop = function() {
							//setTrigger("foundKey",0);
						//}
					}
				};
				setAction(USE, f);
				if( EXTENDED ) {
					setAction(PICK, f);
					setAction(OPEN, f);
				}
			}
			else {
				if( !hasTrigger("foundKey") ) {
					addSpot(34,47,6,6, "Small key");
					setSprite( Assets.tiles.h_get("kitchenTable", 1) );
					setAction(LOOK, "A small ornamented key is laying on the table. Probably made of copper.");
					setAction(REMEMBER, "I used to play for long hours with this key.|What was it used for?");
					setAction(PICK, function() {
						pop("You pick the ornamented key.");
						setTrigger("foundKey");
						addItem("chestKey");
					});
				}
			}

			if( hasTrigger("foundChest") ) {
				addSpot(40,34,13,11, "A steel chest");
				setSprite( Assets.tiles.h_get("kitchenChest", hasTrigger("openChest") ? 1 : 0) );
				if( !hasTrigger("openChest") )
					setAction(LOOK, "It seems sturdy. And it's locked.");
				else {
					if( hasTrigger("foundRing") )
						setAction(LOOK, "Completely empty.");
					else {
						setAction(LOOK, function() {
							pop("There is a single GOLD RING in it.|It's really beautiful.|There is \"L\" engraved in it.|You pick it up.");
							addItem("ring");
							setTrigger("foundRing");
						});
					}
					setAction(CLOSE, function() {
						setTrigger("openChest",0);
						Assets.SOUNDS.hit(1);
					});
				}
				setAction(REMEMBER, "I put something important in it...|And I wanted it to stay away from me.");
				if( hasTrigger("unlockedChest") )
					setAction(OPEN, function() {
						Assets.SOUNDS.smallHit(1);
						setTrigger("openChest");
					});
				else if( !hasItem("chestKey") )
					setAction(OPEN, "It's locked.");
				else {
					setAction(OPEN, function() {
						pop("You use the copper key...|It clicks and opens.");
						Assets.SOUNDS.smallHit(1);
						removeItem("chestKey");
						setTrigger("openChest");
						setTrigger("unlockedChest");
					});
				}
			}

			addSpot(23,54,10,8, "Food tray");
			setAction(LOOK, "Probably as old as me...|And as empty as me.");
			setAction(REMEMBER, "Once a day, they serve my meal in it.");
			addSpot(33,56,3,5, "Fork");
			setAction(LOOK, "It only has one prong left.");
			addSpot(31,50,4,4, "Spoon");
			setAction(LOOK, "Surprisingly, it's in a good state.");

			if( !hasItem("knife") ) {
				addSpot(25,48,6,6, "Knife");
				setSprite( Assets.tiles.h_get("kitchenKnife") );
				setAction(LOOK, "A basic steel knife. The edge became (or got) blunt.|Might be useful.");
				setAction(USE, "This won't cut anything... But it might become handy.");
				setAction(PICK, function() {
					pop("You pick it up.");
					addItem("knife");
				});
			}

			addSpot(86,53,12,25, "Cupboard");
			if( hasTrigger("openCup") ) {
				setSprite( Assets.tiles.h_get("cupDoors") ).x-=4;
				if( !hasItem("broom") )
					setAction(LOOK, function() {
						pop("The cupboard contains various chemicals and upkeep products.");
						pop("You find a medium sized broom in a corner, you take it.");
						addItem("broom");
					});
				else
					setAction(LOOK, "The cupboard contains various chemicals and upkeep products.");
			}
			else
				setAction(LOOK, "A large wooden cupboard with two doors.");
			setAction(REMEMBER, "It contains everything usefull to keep a kitchen tidy.|Lydia knew more about this stuff than me.");
			if( !hasTrigger("unlockedCup") && !hasItem("cupKey") )
				if( hasItem("chestKey") )
					setAction(OPEN, "!My key is too small for this lock.");
				else
					setAction(OPEN, "!It's locked.");
			else {
				if( !hasTrigger("unlockedCup") ) {
					setAction(OPEN, function() {
						setTrigger("openCup");
						Assets.SOUNDS.door(1);
						setTrigger("unlockedCup");
						removeItem("cupKey");
						pop("The key fits perfectly and the cupboard opens creaking.");
					});
				}
				else {
					setAction(OPEN, function() {
						setTrigger("openCup");
						Assets.SOUNDS.door(1);
					});
					setAction(CLOSE, function() {
						setTrigger("openCup",0);
						Assets.SOUNDS.door(1);
					});
				}
			}
		}

		if( room=="park" ) {
			addSpot(2,8,41,26, "Leaves");
			setAction(LOOK, "A peaceful leafy tree...");
			setAction(REMEMBER, "I wish I could hear the gentle sound of the wind passing through the leaves...|!But there is no wind here.");

			addSpot(50,23,23,14, "Wooden bench");
			setAction(LOOK, "Even if it seems as old as the trees, this bench looks welcoming.");
			setAction(REMEMBER, "Isn't that...|..the bench where I met Lydia?");
			setAction(USE, "!I.. don't feel comfortable with sitting on it.|I can't do it.");

			addSpot(71,50,14,14, "Pale ray of light");
			setAction(LOOK, "It feels surprisingly cold.");
			setAction(REMEMBER, "!This light is not exactly pleasant.|I guess it's winter outside.");

			addSpot(16,32,8,25, "Tree trunk");
			setAction(LOOK, "Things are engraved in it.|\"Forever\"|\"L & D\"|\"With love\"|...");
			setAction(REMEMBER, "I think I've written most of these words.");
			setAction(USE, "I could shake the branches, but the trunk won't move.");

			if( hasTrigger("letterPop") && !hasItem("finalLetter") ) {
				addSpot(69,41,7,7, "A letter");
				setSprite( Assets.tiles.h_get("finalLetter") );
				setAction(LOOK, "A letter.|The writing seems to be... mine.");
				setAction(REMEMBER, "Did I write this letter ?");
				var f = function() {
					addItem("finalLetter");
					heroFade.visible = true;
					heroFade.alpha = 0;
					tw.createMs(heroFade.alpha, 0.5, TEaseIn, 1500);
					pop("You take the letter and start to read it.");
					player.spr.anim.stopWithStateAnims();
					player.spr.anim.playAndLoop("read");
					pop("@Dear myself,");
					afterPop = function() {
						changeRoom("cell");
					}
				}
				setAction(PICK, f);
				setAction(USE, f);
				setAction(OPEN, f);
			}

			if( !hasTrigger("phoneDropped") ) {
				addSpot(18,25,7,6, "???");
				setSprite( Assets.tiles.h_get("phone") );
				setAction(LOOK, "There is SOMETHING in the leaves.");
				setAction(REMEMBER, "!I can't see what it is from here.");
				if( !hasItem("broom") )
					setAction("all", "It's out of my reach.");
				else {
					var f = function() {
						setTrigger("phoneDropped");
						Assets.SOUNDS.hit(1);
						pop("Using your BROOM, you reach the object and push it to the ground.");
					}
					setAction(USE, f);
					setAction(PICK, f);
				}
			}
			else {
				addSpot(20,49,6,6, "Cellphone");
				setSprite( Assets.tiles.h_get("phone") );
				setAction(LOOK, "It's a cellphone, a quite common model.");
				setAction(REMEMBER, "It's mine.");
				setAction(PICK, "!No.|For some reason... I don't want to keep it...");
				setAction(OPEN, "No, I'm not much into technical things.");
				if( !hasTrigger("phoneCalled") )
					setAction(USE, function() {
						pop("As you press the WAKE button on the cellphone, a voice comes from it.");
						pop("It seems that someone is on the line...");
						pop("@Mr Belmont? .. Daniel Belmont?");
						pop("@Dr Prowell speaking...");
						pop("@...Is your wife Mme Lydia Belmont?...");
						pop("!I'm really sorry sir... but she...");
						pop("The cellphone abruptly cease to function.");
						setTrigger("phoneCalled");
						afterPop = changeRoom.bind("hell");
					});
				else
					setAction(USE, "!It seems broken or something.");
			}
		}
	}

	function addSpot(x,y,w,h, name:String) : Hotspot {
		// Create interactive
		var i = new h2d.Interactive(w,h);
		wrapper.add(i, 99);
		i.setPosition(x,y);

		// Register
		var hs : Hotspot = {
			i: i,
			spr: null,
			name: name,
			act: new Map(),
		}
		hotSpots.push(hs);
		lastSpot = hs;

		// Events
		i.onClick = (_)->{
			runPending(hs);
		}
		i.onOver = (_)->{
			i.alpha = 1;
			showName(i, name);
		}
		i.onOut = (_)->{
			i.alpha = 0.6;
			hideName();
		}
		i.alpha = 0.6;
		return hs;
	}


	function getTip() {
		Assets.SOUNDS.help(1);
		if( !hasTriggerSet("usedTip") )
			pop("@This action will provide some useful tips if you get stuck in the game.");

		if( !hasTrigger("framed") && !hasItem("picture") )
			pop("You should first concentrate on finding the 3 photo fragments.");
		else if( EXTENDED && !hasTrigger("framed") && hasItem("picture") )
			pop("Put the photograph back in its frame.|!To do this, select USE, then click on the EMPTY FRAME (you never need to click on the inventory).");
		else if( !hasTrigger("goKitchen") )
			pop("You can use REMEMBER on things to dive in past memories, or get important story details.");
		else if( !hasTrigger("rememberTable") )
			pop("You should check the table in the kitchen...");
		else if( !hasTrigger("foundRing") )
			pop("You must find something PRECIOUS hidden in the kitchen.");
		else if( EXTENDED && !hasTrigger("teleportedBackCell") )
			pop("To come back to your cell, you can use REMEMBER on your bed or on the photograph.");
		else if( EXTENDED && !hasTrigger("sinkClean") && !hasItem("cupKey") && !hasItem("knife") )
			pop("You forgot something else on the kitchen table.");
		else if( !hasTrigger("sinkClean") && !hasItem("cupKey") )
			pop("You should pay attention to the sink in your cell.");
		else if( !hasItem("broom") )
			pop("You need to use your KEY somewhere.");
		else if( EXTENDED && !hasTrigger("goPark") )
			pop("You need to use the RING somewhere. I remember there was a small wooden case near my bed...");
		else if( !hasTrigger("phoneDropped") )
			pop("You should take advantage of the length of the BROOM in the park...");
		else if( EXTENDED && !hasTrigger("phoneCalled") )
			pop("Now you reached the thing in the leaves, you should USE it.");
		else if( EXTENDED && !hasItem("finalLetter") )
			pop("I saw a letter in the park. It wasn't there at the beginning, was it?");
		else
			pop("!I can't help you right now, sorry. It's up to you!");
	}


	function changeRoom(k:String) {
		var from = room;
		var d = #if debug 1000; #else 4000; #end

		hideName();

		// Draw current view to texture
		root.drawTo(snapshotTex);

		// Display old view in front of current & fade it away
		var snapshot = new h2d.Bitmap();
		root.add(snapshot, 99);
		snapshot.x = -root.x/Const.SCALE;
		snapshot.tile = h2d.Tile.fromTexture( snapshotTex );
		snapshot.setScale(1/Const.SCALE);
		tw.createMs(snapshot.alpha, 0, TEaseIn, d*0.8);
		delayer.addMs(()->{
			snapshot.remove();
		}, d);

		var onTeleport = null;
		room = k;
		switch( k ) {
			case "cell" :
				setTrigger("teleportedBackCell");
				player.moveTo(10,5);
				if( hasItem("finalLetter") && !hasTriggerSet("finalMonologue") )
					onTeleport = function() {
						pop("@I write this letter while I'm still conscious and sane.");
						pop("@Lydia used to say that, getting older, I was becoming more and more scatterbrain.");
						pop("!She was damn right.");
						pop("@My memories are fading away. And with them, my guilt for the things that led me into this cell.");
						pop("!But I will also forget Lydia.");
						pop("@My tender and beloved Lydia... This can't possibly happen. I must cherish her memory.");
						pop("@I must remember the pain. Cry for her... Again and again...");
						pop("@That's why I set up all of this paper chase for you. For me.");
						pop("@I'm losing my mind. I'm seeing things, places.");
						pop("@That's not the first time you discover this letter. And it won't be the last one.");
						pop("@We must remember Lydia.");
						pop("@Set everything up for us,  when you will forget again.");
						pop("@Make sure that Lydia will always live in our tiny world.");
						pop("@- Daniel.");
						afterPop = function() {
							lockControls(true);
							fl_pause = true;
							fl_ending = true;
							actionsWrapper.visible = false;
							invCont.visible = false;
							tw.createMs(heroFade.alpha, 1, TEase, 5000);
							player.spr.anim.play("cry",1).chain("afterCry",9999);
							delayer.addS(()->{
								tw.terminateWithoutCallbacks(heroFade.alpha);
								tw.createMs(heroFade.alpha, 0.7, TEaseOut, 500);
								delayer.addS(()->{
									tw.createMs(root.alpha, 0, TEaseIn, 1000).onEnd = credits;
								}, 2);
							}, 7);
						}
					}
			case "kitchen" :
				player.moveTo(5,5);
				if( !hasTriggerSet("goKitchen") )
					onTeleport = function() {
						pop("My kitchen. Exactly like I left it.");
					}
			case "park" :
				if( from!="hell" )
					player.moveTo(10,5);
				else
					player.moveTo(player.cx,5);
				if( !hasTriggerSet("goPark") )
					onTeleport = function() {
						pop("...|!The Arthur park.");
					}
			case "hell" :
				player.moveTo(10,6);
		}

		Assets.SOUNDS.teleport(1);
		initWorld();
		player.world = world;
		playerPath = new Array();
		playerTarget = null;
		onArrive = null;
		lockControls(true);

		tw.createMs(distort.intensity, 1, TEaseIn, d*0.6).onEnd = function() {
			tw.createMs(distort.intensity, 0.1, TEaseOut, d*0.4).onEnd = function() {
				tw.createMs(distort.intensity, 0, TEaseIn, #if debug 500 #else 6000 #end);
				lockControls(false);
				if( onTeleport!=null )
					onTeleport();
			}
		}
	}

	function credits() {
		invCont.visible = actionsWrapper.visible = miscWrapper.visible = false;
		root.alpha = 1;
		uiInteractives = [];
		wrapper.removeChildren();
		var list = [
			"\"Memento XII\"",
			"A 48h Ludum Dare game",
			"by Sebastien Benard",
			"",
			"Thank you for playing!",
			"Please visit DEEPNIGHT.NET",
			"",
			":)",
		];
		var n = 0;
		for(t in list) {
			var tf = makeText(t);
			root.addChild(tf);
			tf.x = 20;
			tf.y = 20 + 11*n;
			tf.alpha = 0;
			tw.createMs(tf.alpha, n==0 ? 1 : 0.5, TEaseIn, 1000).delayMs(1500*n);
			n++;
		}
	}

	function setSprite(s:HSprite) {
		lastSpot.spr = s;
		wrapper.add(s,2);
		s.setPos(lastSpot.i.x, lastSpot.i.y);
		// var pt = buffer.globalToLocal(lastSpot.hit.x, lastSpot.hit.y);
		// s.x = pt.x;
		// s.y = pt.y;
		return s;
	}

	function setAction(a:String, effect:Dynamic) {
		lastSpot.act.set(a, effect);
	}

	function initWorld() {
		world = new World();
		world.removeRectangle(2,4, 10,6);
		var frame = 0;
		switch(room) {
			case "cell" :
				frame = 0;
				world.addCollision(6,4, 2,1);
				world.addCollision(7,5);
				world.addCollision(11,5, 1,2);

				world.addCollision(9,4, 3,1);

				world.addCollision(2,7, 1,3);
				world.addCollision(7,8, 3,2);

			case "kitchen" :
				frame = 1;
				world.addCollision(2,4);
				world.addCollision(5,4, 3,1);
				world.addCollision(9,4, 3,1);
				world.addCollision(3,6, 2,2);
				world.addCollision(5,6);
				world.addCollision(11,7, 1,3);
				// world.addCollision(11,6);

			case "park" :
				frame = 2;
				world.addCollision(9,4, 3,1);
				world.addCollision(2,4, 2,1);
				world.addCollision(2,5, 1,2);
				world.addCollision(2,7);

			case "hell" :
				frame = 3;
				world.addCollision(9,4, 3,1);
		}

		if( roomBg!=null )
			roomBg.remove();
		roomBg = Assets.tiles.h_get("cell", frame);
		if( room=="cell" ) {
			var r = Assets.tiles.h_get("reflections");
			roomBg.addChild(r);
			r.alpha = 0;
			r.x = 24;
			r.y = 32;
			var loop = null;
			loop = function() {
				tw.createMs(r.alpha, 1, TLinear, 1000).onEnd = function() {
					tw.createMs(r.alpha, 0, TLinear, 1000).onEnd = loop;
				}
			}
			loop();
		}
		wrapper.add( roomBg, 1 );
		for(x in 0...world.wid)
			for(y in 0...world.hei) {
				#if debug
				if( SHOW_COLLISIONS && world.collide(x,y) ) {
					var s = Assets.tiles.h_get("collision");
					wrapper.add(s, 10);
					s.x = x*Const.GRID;
					s.y = y*Const.GRID;
					s.alpha = 0.2;
				}
				#end
			}
		refreshWorld();
		pathFinder.init(world.wid, world.hei, world.collide);
	}

	function refreshWorld() {
		initHotSpots();
		applyInteractiveVisibility();
	}


	function hideName() {
		if( curName!=null )
			curName.parent.removeChild(curName);
		curName = null;
	}

	function showName(i:h2d.Interactive, str:String) {
		hideName();
		var tf = makeText(str);
		wrapper.add(tf,10);
		tf.textColor = 0xB8BAC9;
		// if( i.x<=Const.GAMEZONE_WID*0.5 )
		// 	tf.x = Std.int( i.x + i.width + 3 );
		// else
		// 	tf.x = Std.int( i.x - tf.textWidth - 3 );
		// tf.y = Std.int( i.y + i.height*0.5 );
		tf.x = Std.int( i.x+i.width*0.5 - tf.textWidth*0.5 );
		tf.y = i.y-tf.textHeight;
		// if( i.y<=30)
		tf.alpha = 0;
		tw.createMs(tf.alpha, 1, TEaseOut, 400);

		curName = tf;
		curName.visible = !fl_pause && !fl_lockControls;
	}

	function closePop(?nextQueue=true) {
		if( popUp!=null ) {
			popUp.parent.removeChild(popUp);
			popUp = null;
		}
		if( nextQueue && popQueue.length==0 && afterPop!=null )  {
			var cb = afterPop;
			afterPop = null;
			cb();
		}
		else
			if( nextQueue && popQueue.length>0 )
				pop( popQueue.pop() );
	}

	function pop(str:String) {
		if( popUp!=null ) {
			popQueue.add(str);
			return;
		}

		// Parse format
		if( str.indexOf("|")>0 ) {
			var parts = str.split("|");
			str = parts[0];
			for(i in 1...parts.length)
				popQueue.add(parts[i]);
		}
		var col = 0x4F58C8;
		var tcol = 0xFFFFFF;
		if( str.charAt(0)=="!" ) {
			col = 0x9E0C0C;
			str = str.substr(1);
		}
		if( str.charAt(0)=="@" ) {
			col = 0x4B5F56;
			tcol = 0xA7BAB1;
			str = str.substr(1);
		}

		skipClick = true;
		lockControls(true);
		if( curName!=null )
			curName.visible = false;
		closePop(false);

		// Create pop-up
		var f = new h2d.Flow();
		wrapper.add(f,10);

		var tf = makeText(str, true);
		tf.filter = new h2d.filter.DropShadow(1, M.PIHALF, 0x0, 0.4, true);
		tf.textColor = tcol;
		tf.x+= 10;
		tf.y+= 10;
		f.addChild(tf);

		f.padding = 4;
		f.paddingTop--;

		var bg = new h2d.Bitmap( h2d.Tile.fromColor(col, f.outerWidth, f.outerHeight) );
		f.addChildAt(bg,0);
		f.getProperties(bg).isAbsolute = true;
		bg.filter = new h2d.filter.Group([
			new dn.heaps.filter.PixelOutline(0xffffff),
			new dn.heaps.filter.PixelOutline(0x0),
		]);

		f.x = -50 + Std.random(100) + 16*2;
		f.x = M.fclamp( f.x, 5, Const.WID-wrapper.x-f.outerWidth-5 );

		f.y = if( player.cy>=6 ) Std.random(30)+20 else Std.random(30) + Const.GRID*6;
		if( f.y<5 ) f.y = 5;
		if( f.y+f.outerHeight+5>=h()) f.y = h()-f.outerHeight-5;

		fl_pause = true;
		popUp = f;
	}

	override function preUpdate() {
		super.preUpdate();
		skipClick = false;
	}

	var interactiveDebug = false;
	override function update() {
		super.update();

		// Distorsion effect
		// if( dispScale==0 )
		// 	buffer.postFilters = [];
		// else {
		// 	var spd = 0.1; // * (1-dispScale);
		// 	displace.perlinNoise(50,30, 3, 0, true, false, 7, true, [new flash.geom.Point(-spd*UNIQ++,-spd*UNIQ), new flash.geom.Point(-spd*UNIQ++,-2*spd*UNIQ), new flash.geom.Point(0.5*spd*UNIQ++,1.5*spd*UNIQ)]);
		// 	buffer.postFilters = [
		// 		new flash.filters.DisplacementMapFilter(displace, new flash.geom.Point(0,0), 1, 1, dispScale*13,dispScale*15, flash.filters.DisplacementMapFilterMode.WRAP, 0, 1)
		// 	];
		// 	var recal = dispScale<0.2 ? 0. : (dispScale-0.2)/0.8;
		// 	buffer.render.x = -13*recal;
		// 	buffer.render.y = -15*recal;
		// }


		if( K.isPressed(K.D) && K.isDown(K.CTRL) && K.isDown(K.SHIFT) ) {
			interactiveDebug = !interactiveDebug;
			for(i in uiInteractives)
				i.backgroundColor = interactiveDebug ? 0x66ff00ff : null;
			for(h in hotSpots)
				h.i.backgroundColor = interactiveDebug ? 0x66ff00ff : null;
		}

		#if debug
		if( K.isPressed(K.C) ) {
			credits();
		}
		#end


		if( !fl_pause && !fl_ending ) {

			// Follow path
			var s = 0.047;
			// var sx = 0.15;
			// var sy = 0.1;
			// #if debug
			// sx*=2.5;
			// sy*=2.5;
			// #end
			if( playerPath.length>0 ) {
				var tx = ( playerPath[0].cx+0.5 ) * Const.GRID;
				var ty = ( playerPath[0].cy+0.5 ) * Const.GRID;

				var a = Math.atan2( ty-player.y, tx-player.x );
				player.dx += Math.cos(a) * s * tmod;
				player.dy += Math.sin(a) * s * tmod;
				// if( player.cx<t.cx ) player.dx = sx;
				// else if( player.cx>t.cx ) player.dx = -sx;
				// if( player.cy<t.cy ) player.dy = sy;
				// else if( player.cy>t.cy ) player.dy = -sy;

				if( M.dist(player.x, player.y, tx, ty)<=3 )
					playerPath.shift();

				if( playerPath.length==0 && onArrive!=null ) {
					onArrive();
					onArrive = null;
					if( playerTarget!=null )
						player.lookAt(playerTarget.cx, playerTarget.cy);
					playerTarget = null;
				}
			}

			// Center in cell
			// if( player.dx==0 && player.xr<0.5-sx)
			// 	player.dx = sx*1.25;
			// if( player.dx==0 && player.xr>0.5+sx)
			// 	player.dx = -sx*1.25;

			// if( player.dy==0 && player.yr<0.5-sy )
			// 	player.dy = sy;
			// if( player.dy==0 && player.yr>0.5+sy )
			// 	player.dy = -sy;

			if( !player.isMoving() && playerPath.length==0 ) {
				if( player.spr.anim.isPlaying("walkUp") || player.spr.anim.isPlaying("walkDown") )
					footStep = 0;
			}
			else {
				// Foot steps sounds
				footStep-=tmod * walkAnimSpd;
				if( footStep<=0 ) {
					if( Std.random(3)==0 )
						Assets.SOUNDS.footstep1(1);
					else
						Assets.SOUNDS.footstep2(1);
					footStep = 6;
				}
			}

			// Actions shortcuts
			var idx = 0;
			for(a in [LOOK, REMEMBER, USE, PICK, OPEN, CLOSE, HELP]) {
				if( K.isPressed( a.charCodeAt(0) ) || K.isPressed(K.NUMBER_1+(idx++)) )
					setPending(a);
			}

			if( K.isPressed(K.R) && K.isDown(K.SHIFT) ) {
				Main.ME.startGame();
				return;
			}


			if( room=="hell" && player.cx<=6 ) {
				pop("!Lydia!!!");
				setTrigger("letterPop");
				afterPop = changeRoom.bind("park");
			}

			player.update(tmod);
		}

		heroFade.x = player.spr.x;
		heroFade.y = player.spr.y-4;
	}
}
