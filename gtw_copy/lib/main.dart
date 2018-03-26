import 'package:flutter/material.dart';
import 'package:firebase_database/firebase_database.dart'; //new
import 'package:firebase_database/ui/firebase_animated_list.dart'; //new
import 'dart:io';
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

final reference = FirebaseDatabase.instance.reference().child('gameInstance');
//final FirebaseApp app = new FirebaseApp(
//  name: 'gtwthegame',
//  options: Platform.isIOS
//      ? const FirebaseOptions(
//    googleAppID: '1:58827652319:ios:95fac827d69149a2',
//    gcmSenderID: '58827652319',
//    databaseURL: 'https://gtwthegame.firebaseio.com',
//  )
//      : const FirebaseOptions(
//    googleAppID: '1:58827652319:android:95fac827d69149a2',
//    apiKey: 'AIzaSyCoG0SCkdYyS_6ah9OUlTVdajp-QsMKfi8',
//    databaseURL: 'https://gtwthegame.firebaseio.com',
//  ),
//);

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      title: 'Flutter Demo',
      theme: new ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or press Run > Flutter Hot Reload in IntelliJ). Notice that the
        // counter didn't reset back to zero; the application is not restarted.
        cardColor: Colors.grey[900],
        primaryColor: Colors.grey[800],
        scaffoldBackgroundColor: Colors.black,
        accentColor: Colors.green,
        dividerColor: Colors.lightGreen,
        textTheme: Theme.of(context).textTheme.apply(
            bodyColor: Colors.green,
            displayColor: Colors.green,
            fontFamily: "R"),
      ),
      home: new LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  @override
  _LoginPageState createState() => new _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final formKey = new GlobalKey<FormState>();



  String _username;
  String _password;

  void _submit() {
    final form = formKey.currentState;

    if (form.validate()) {
      form.save();

      // Email & password matched our validation rules
      // and are saved to _email and _password fields.
      _performLogin();
    }
  }

  void _performLogin() {
    // This is just a demo, so no actual login here.
    final snackbar = new SnackBar(
      content: new Text('Email: $_username, password: $_password'),
    );
    var url = "https://gtnwthegame.com/api/login";
    http.post(url, body: { 'username': '$_username', 'password': '$_password', })
    .then((response) {
      var statusCode = response.statusCode;
      var user = response.body;
      if (statusCode == 200) {
        print(user);
    Navigator.push(
        context,
        new MaterialPageRoute(
            builder: (BuildContext context) => new JoinGamePage(username: _username)));
      } else {
        scaffoldKey.currentState.showSnackBar(snackbar);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      backgroundColor: Colors.grey[900],
      key: scaffoldKey,
      appBar: new AppBar(
        title: new Text('Global Thermonuclear War'),
      ),
      body: new Padding(
        padding: const EdgeInsets.all(16.0),
        child: new Form(
          key: formKey,
          child: new Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              new TextFormField(
                decoration: new InputDecoration(
                    labelText: 'username',
                    labelStyle: const TextStyle(color: Colors.green)),
                validator: (val) =>
                    val.length < 2 ? 'Not a valid username.' : null,
                onSaved: (val) => _username = val,
              ),
              new TextFormField(
                decoration: new InputDecoration(
                    labelText: 'Password',
                    labelStyle: const TextStyle(color: Colors.green)),
                validator: (val) =>
                    val.length < 6 ? 'Password too short.' : null,
                onSaved: (val) => _password = val,
                obscureText: true,
              ),
              new RaisedButton(
                onPressed: _submit,
                child: new Text('Login'),
                color: Colors.green,
              ),
              new RaisedButton(
                onPressed: _submit,
                child: new Text('Play as Guest'),
                color: Colors.green,
              ),
              new FlatButton(
                onPressed: _submit,
                child: new Text('Sign Up'),
                color: Colors.green,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class JoinGamePage extends StatefulWidget {
  var username;
  JoinGamePage({Key key, this.title, this.username}) : super(key: key);
  final String title;
  @override
  JoinGamePageState createState() => new JoinGamePageState();
}

class JoinGamePageState extends State<JoinGamePage> {

//  joinGamePage({this.title});

  // Fields in a Widget subclass are always marked "final".

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final formKey = new GlobalKey<FormState>();

//  final Widget title;
  String _gameId;

//void buyUnit(unit,continent, player) {
//  http.put('peacetime/deploy$unit', body: { 'gameID': _gameId.toLowerCase(), 'playerID': widget.username, 'quantity': 'location': continentA})
//      .then((response) {
//    var statusCode = response.statusCode;
//  });
//}
  var testGameObj;
  getGameObj()  {
    reference
        .child(_gameId)
        .onValue
        .listen((Event event) async {
      testGameObj = event.snapshot.value;
    });
  }

  void _changeRoute() {

    final form = formKey.currentState;
    form.save();
    var url = "https://gtnwthegame.com/api/pregame/joingame";
    http.put(url, body: { 'gameID': _gameId, 'playerID': widget.username, })
    .then((response) {
      var statusCode = response.statusCode;
      print('$_gameId');
      print(statusCode);
      if (statusCode == 200) {
        Navigator.push(
            context,
            new MaterialPageRoute(
                builder: (BuildContext context) =>
                new AwaitingPeaceTime(username: widget.username, gameID: _gameId)));
  print(widget.username);
          } else {
        print('u fucked up');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: const Text('ExpansionTile'),
      ),
      backgroundColor: Colors.grey[900],
      body: new Padding(
        padding: const EdgeInsets.all(16.0),
        child: new Form(
          key: formKey,
          child: new Column(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              new TextFormField(
                decoration: new InputDecoration(
                    labelText: 'Nuclear Access Code',
                    labelStyle: const TextStyle(color: Colors.green)),
                validator: (val) =>
                val.length < 2 ? 'Not a valid acces code.' : null,
                onSaved: (val) => _gameId = val,
              ),
              new RaisedButton(
                onPressed: _changeRoute,
                child: new Text('Enter'),
                color: Colors.green,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class AwaitingPeaceTime extends StatefulWidget {
  var username;
  var gameID;
  final String title;
  AwaitingPeaceTime({Key key, this.title, this.username, this.gameID}) : super(key: key);

  @override
  awaitingPeaceTimeState createState() => new awaitingPeaceTimeState();
}

class awaitingPeaceTimeState extends State<AwaitingPeaceTime> {
  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final errorMessage = new SnackBar(
    content: new Text('Peacetime is not engaged'),
  );
  void _changeRoute() {
    if (testGameObj['peacetime'] != false) {
      Navigator.push(
          context,
      new MaterialPageRoute(
          builder: (BuildContext context) =>
          new MyHomePage(username: widget.username, gameID: widget.gameID, gameObj: testGameObj)));
    } else {
      scaffoldKey.currentState.showSnackBar(errorMessage);
      }
  }
  var testGameObj;
  getGameObj()  {
    reference
        .child(widget.gameID)
        .onValue
        .listen((Event event) async {
      testGameObj = event.snapshot.value;
    });
  }
  @override
  Widget build(BuildContext context) {
    getGameObj();
    return new Scaffold(
      key: scaffoldKey,
      appBar: new AppBar(
        title: const Text('ExpansionTile'),
      ),
      backgroundColor: Colors.grey[900],
      body: new Padding(
        padding: const EdgeInsets.all(16.0),
        child: new Column(
          children: <Widget>[
            new RaisedButton(
              onPressed: _changeRoute,
              child: new Text('Enter'),
              color: Colors.green,
            ),
          ],
        ),
      ),
    );
  }
}


class MyHomePage extends StatefulWidget {
  var username;
  var gameID;
  var gameObj;
  MyHomePage({Key key, this.title, this.username, this.gameID, this.gameObj}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => new _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
//  double _value = 50.0;

  double _discreteValueSpending = 0.0;
//  double _budget = 2400.0;
  double _discreteValue = 50.0;
  int pacificDeclaredCounter = 0;

  int atlanticDeclaredCounter = 0;

  int indianDeclaredCounter = 0;
  int _indianSubsScrappedCounter = 0;
  int _continentiBmberCounter = 0;
  int _continentiDeclaredBmberCounter = 0;
  int _continentiBmberScrappedCounter = 0;
  int _continentiIcbmCounter = 0;
  int _continentiIcbmDeclaredCounter = 0;
  int _continentiIcbmScrappedCounter = 0;
  int _continentiiBmberCounter = 0;
  int _continentiiDeclaredBmberCounter = 0;
  int _continentiiBmberScrappedCounter = 0;
  int _continentiiIcbmCounter = 0;
  int _continentiiIcbmDeclaredCounter = 0;
  int _continentiiIcbmScrappedCounter = 0;
  var username;
  var gameID;
  var testGameObj;
  var year;
  var budget;
  var butt;
  var continents;
  var continentA;
  var continentB;
  var continentC;
  var continentaBombers=0;
  var continentaDecBombers=0;
  var continentaIcbms=0;
  var continentaDecIcbms=0;
  var continentbBombers=0;
  var continentbDecBombers=0;
  var continentbIcbms=0;
  var continentbDecIcbms=0;
  var atlanticSubsTotal = 0;
  var atlanticSubsDeclared;
  var indianSubsTotal = 0;
  var pacificSubsTotal = 0;
  var oceans;
  var playerOceans = new Set();
  var speedRnD;
  var damageRnD;
  var newSpeedRnD=0;
  var newDamageRnD=0;
  var rndmult;
  var initBudget;
  void buyUnit(unit,location) {
    print(unit.toString());
    http.put('https://gtnwthegame.com/api/peacetime/deploy$unit', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({ 'gameID': 'game8928', 'playerID': widget.username , 'quantity':1, 'location': location}))
        .then((response) {
      print(response.statusCode);
    });
  }
  void declareUnit(unit,location) {
    http.put('https://gtnwthegame.com/api/peacetime/declare$unit', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({ 'gameID': 'game8928', 'playerID': widget.username , 'quantity':1, 'location': location}))
        .then((response) {
      print(response.statusCode);
    });
  }
  void scrapUnit(unit,location) {
    http.put('https://gtnwthegame.com/api/peacetime/disarm$unit', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({'gameID': 'game8928', 'playerID': widget.username , 'quantity':1, 'location': location}))
        .then((response) {
      print(response.statusCode);
    });
  }
  void getRndValues() {
    rndmult = _discreteValue/100;
    newSpeedRnD = (_discreteValueSpending.floor() * rndmult).floor();
    newDamageRnD = (_discreteValueSpending.floor() - newSpeedRnD).floor();
    print(rndmult);
    print(newSpeedRnD);
    print(newDamageRnD);
  }
  void rnd(type, amount) {
    http.put('https://gtnwthegame.com/api/peacetime/spendrnd', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({'gameID': 'game8928', 'playerID':widget.username, 'quantity': amount.toString(), 'type': type}))
        .then((response) {
      print(response.statusCode);
    });
  }
  void endTurn() {
    rnd('speed', newSpeedRnD);
    rnd('damage', newDamageRnD);
    http.post('https://gtnwthegame.com/api/peacetime/yearcomplete', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({ 'gameID': 'game8928' , 'playerID': widget.username}))
        .then((response) {
      print(response.statusCode);
    });
  }
  void buyBomber(cont) {
    if ((budget - 50) >= 0) {
      setState(() {
        cont++;
        budget = budget - 50;
      });
    }
  }

  updateYear() {
    if (testGameObj != null) {
      if (year != testGameObj['year']) {
        setState(() {
          year = testGameObj['year'];
          updateContinents();
          updateBudget();
        });
      }
    }

  }
  updateBudget() {
    if (testGameObj != null) {
      if (budget != testGameObj['players'][widget.username]['currentBudget']) {
        setState(() {
          budget = testGameObj['players'][widget.username]['currentBudget'];
          initBudget = testGameObj['players'][widget.username]['currentBudget'];
        });
      }
    }
  }
  updateContinents()  {
//    print(testGameObj['players']['test0']['continents'].keys);
// print(testGameObj['players'][widget.username]['continents']);
//  print(widget.username);
//  print(testGameObj);
  print(widget.gameObj);
//  if (testGameObj != null) {
//    print(testGameObj['players'][(widget.username)]);
//    if (testGameObj['players'][widget.username] != null) {
    if (testGameObj != null){
if (testGameObj['players'][widget.username]['continents'] != true) {
  continents = testGameObj['players'][widget.username]['continents'].keys;
}} else { continents= ['undefined','undefined'];}
//    }
//  }
//print(testGameObj['players'][widget.username]['oceans']) ;
if (testGameObj != null) {
      if (testGameObj['players'][widget.username]['oceans'] != true)
  oceans = (testGameObj['players'][widget.username]['oceans'].keys).toList();
} else { oceans= ['Atlantic','Pacific', 'Indian'];}

  butt = continents.toList();
  continentA = butt[0];
  continentB = butt[1];
  continentaBombers = testGameObj['continents'][continentA
      .toString()]['forces']['bombers']['total'];
  continentaDecBombers = testGameObj['continents'][continentA
      .toString()]['forces']['bombers']['declared'];
  continentaIcbms =
  testGameObj['continents'][continentA.toString()]['forces']['icbms']['total'];
  continentaDecIcbms = testGameObj['continents'][continentA
      .toString()]['forces']['icbms']['declared'];
  continentbBombers = testGameObj['continents'][continentB
      .toString()]['forces']['bombers']['total'];
  continentbDecBombers = testGameObj['continents'][continentB
      .toString()]['forces']['bombers']['declared'];
  continentbIcbms =
  testGameObj['continents'][continentB.toString()]['forces']['icbms']['total'];
  continentbDecIcbms = testGameObj['continents'][continentB
      .toString()]['forces']['icbms']['declared'];
  speedRnD = testGameObj['players'][widget.username]['rnd']['speed'];
  damageRnD = testGameObj['players'][widget.username]['rnd']['damage'];
//  print(speedRnD);
//  print(damageRnD);


    if (testGameObj['players'][widget.username]['oceans']['atlantic'] == true) {
      atlanticSubsTotal =
      testGameObj['oceans']['atlantic']['subs'][widget.username]['total'];
    }
    if (testGameObj['players'][widget.username]['oceans']['pacific'] == true) {
      pacificSubsTotal =
      testGameObj['oceans']['pacific']['subs'][widget.username]['total'];
    }
    if (testGameObj['players'][widget.username]['oceans']['indian'] == true) {
      indianSubsTotal =
      testGameObj['oceans']['indian']['subs'][widget.username]['total'];
    }

//    print((atlanticSubsTotal+pacificSubsTotal+indianSubsTotal).toString());

    if (butt.length == 3) {
      continentC = butt[2];
    } else {
      continentC = 'For 2 Player Mode';
    }
//    print(butt);
//    for (var continent in continents) {
//      print(continent);
//    }
//    if (testGameObj != null) {
//      if (continents != testGameObj['players']['test0']['continents']) {
//        setState(() {
//          continents = testGameObj['players']['test0']['continents'];
//        });
//      }
//    }
//    print(continents);
//    return continents;
  }

  getGameObj()  {
      reference
          .child('game8928')
          .onValue
          .listen((Event event) {
        testGameObj = event.snapshot.value;
         updateYear();
      });
  }



//  void initState() {
//    reference
//        .child('game9048')
//        .onValue
//        .listen((Event event) {
//          testGameObj = event.snapshot.value;
//          print('current year');
//          print(testGameObj[year]);
////          return event.snapshot.value;
//    });
//  }
//void _getGameObj() {
//  reference
//      .child(widget.gameID)
//      .onValue
//      .listen((Event event) {
//    var gameObj = event.snapshot.value;
//    print(gameObj);
//
//  });
//};


//

  @override
  Widget build(BuildContext context) {
      getGameObj();
      if (continents == null) {
        updateContinents();
        updateBudget();
      }


//      void getGameObj() {
//        reference
//            .child('game9048')
//            .onValue
//            .listen((Event event) {
//          testGameObj = event.snapshot.value;
//          year = testGameObj['year'];
//          print('current year');
//          print(year);
////          return event.snapshot.value;
//        });
//      }

//    setState(() {
//      _getGameObj();
//    });
//    var gameObj = () {initState();};
//    print(gameObj.toString());
    return new Scaffold(
      appBar: new AppBar(
        title: new Text(widget.gameID),
      ),
      body: new CustomScrollView(
        shrinkWrap: true,
        slivers: <Widget>[
          new SliverPadding(
            padding: const EdgeInsets.all(1.0),
            sliver: new SliverList(
              delegate: new SliverChildListDelegate(
                <Widget>[
                  new Center(
                    child: new Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        new Card(
                          child: new Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ListTile(
                                      leading: const Icon(
                                        Icons.calendar_today,
                                        color: Colors.green,
                                      ),
//                                      title: new Text(gameObj.toString()),
                                      subtitle:new Text(year.toString()),
                                    ),
                                  ),
                                  new Expanded(
                                    child: new ListTile(
                                      leading: const Icon(
                                        Icons.monetization_on,
                                        color: Colors.green,
                                      ),
                                      title: new Text('Current Budget'),
                                      subtitle: new Text( budget.toString()),
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new SizedBox(
                                      width: 40.0,
                                      child: new ListTile(
                                        leading: const Text('Total Units'),
                                        subtitle: new Text(((indianSubsTotal+pacificSubsTotal+atlanticSubsTotal)+(continentaBombers+continentbBombers)+(continentaIcbms+continentbIcbms)).toString()),
                                      ),
                                    ),
                                  ),
                                  new Expanded(
                                    child: new ListTile(
                                      title: const Text('Subs'),
                                      subtitle: new Text((indianSubsTotal+pacificSubsTotal+atlanticSubsTotal).toString()),
                                    ),
                                  ),
                                  new Expanded(
                                    child: new ListTile(
                                      title: const Text('Missles'),
                                      subtitle: new Text((continentaIcbms+continentbIcbms).toString()),
                                    ),
                                  ),
                                  new Expanded(
                                    child: new ListTile(
                                      title: const Text('Bombers'),
                                      subtitle: new Text((continentaBombers+continentbBombers).toString()),
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                            ],
                          ),
                        ),
                        new Card(
                          child: new Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ListTile(
                                      leading: const Icon(
                                        Icons.public,
                                        color: Colors.green,
                                      ),
                                      title: new Text('Continents'),
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Divider(),
//    for (var i = 0; i < firebaseobject.continents.length; i++) {} do what follows
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
                                      title: new Text(continentA.toString()),
                                      children: [
                                        new Center(
                                          child: new Row(
                                            children: <Widget>[
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child:
                                                        const Text('BUY ICBM'),
                                                    onPressed: () {
                                                      if ((budget - 100) >= 0) {
                                                        buyUnit('icbm', continentA);
                                                        setState(() {
                                                          continentaIcbms++;
                                                          budget = budget - 100;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP ICBM'),
                                                    onPressed: () {
                                                      if (continentaIcbms > 0) {
                                                        scrapUnit('icbm', continentA);
                                                        setState(() {
                                                          continentaIcbms--;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE ICBM'),
                                                    onPressed: () {
                                                      if (continentaIcbms>continentbDecIcbms) {
                                                        declareUnit('icbm', continentA);
                                                        setState(() {
                                                          continentaDecIcbms++;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                ],
                                              ),
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'BUY BOMBER'),
                                                    onPressed: () {
                                                      if ((budget - 50) >= 0) {
                                                        buyUnit('bomber', continentA);
                                                        setState(() {
                                                          continentaBombers++;
                                                          budget = budget - 50;
                                                        });
                                                      }
                                                    }
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP BOMBER'),
                                                    onPressed: () {
                                                      if (continentaBombers > 0) {
                                                        scrapUnit('bomber', continentA);
                                                        setState(() {
                                                          continentaBombers--;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE BOMBER'),
                                                    onPressed: () {
                                                      if (continentaBombers > continentaDecBombers) {
                                                        setState(() {
                                                          continentaDecBombers++;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
                                      title: new Text(continentB),
                                      children: [
                                        new Center(
                                          child: new Row(
                                            children: <Widget>[
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child:
                                                        const Text('BUY ICBM'),
                                                    onPressed: () {
                                                      if ((budget - 100) >= 0) {
                                                        buyUnit('icbm', continentB);
                                                        setState(() {
                                                          continentbIcbms++;
                                                          budget = budget - 100;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP ICBM'),
                                                    onPressed: () {
                                                      if (continentbIcbms > 0) {
                                                        setState(() {
                                                          continentbIcbms--;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE ICBM'),
                                                    onPressed: () {
                                                      if(continentbIcbms > continentbDecIcbms) {
                                                        setState(() {
                                                          continentbDecIcbms++;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                ],
                                              ),
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'BUY BOMBER'),
                                                    onPressed: () {
                                                      if ((budget - 50) >= 0) {
                                                        buyUnit('bomber', continentB);
                                                        setState(() {
                                                          continentbBombers++;
                                                          budget = budget - 50;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP BOMBER'),
                                                    onPressed: () {
                                                      if (continentbBombers > 0) {
                                                        scrapUnit('bomber', continentB);
                                                        setState(() {
                                                          continentbBombers--;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE BOMBER'),
                                                    onPressed: () {
                                                      if (continentbBombers>continentbDecBombers) {
                                                        declareUnit('bomber', continentB);
                                                        setState(() {
                                                          continentbDecBombers++;
                                                        });
                                                      }
                                                    },
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
                                      title: new Text(continentC),
                                      children: [
                                        new Center(
                                          child: new Row(
                                            children: <Widget>[
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child:
                                                    const Text('BUY ICBM'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiIcbmCounter++;
//                                            icbms + 1 if budget allows and budget -200 else error
                                                      });
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP ICBM'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiIcbmScrappedCounter++;
                                                      });
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE ICBM'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiIcbmDeclaredCounter++;
                                                      });
                                                    },
                                                  ),
                                                ],
                                              ),
                                              new Column(
                                                children: <Widget>[
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'BUY BOMBER'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiBmberCounter++;
                                                      });
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'SCRAP BOMBER'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiBmberScrappedCounter++;
                                                      });
                                                    },
                                                  ),
                                                  new FlatButton(
                                                    textColor: Colors.green,
                                                    child: const Text(
                                                        'DECLARE BOMBER'),
                                                    onPressed: () {
                                                      setState(() {
                                                        _continentiDeclaredBmberCounter++;
                                                      });
                                                    },
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                            ],
                          ),
                        ),
                        new Card(
                          child: new Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: const ListTile(
                                      leading: const Icon(
                                        Icons.directions_boat,
                                        color: Colors.green,
                                      ),
                                      title: const Text('Naval Fleet'),
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Divider(),
//    for (var i = 0; i < firebaseobject.continents.length; i++) {} do what follows
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
//                          enabled: true,
                                      title: new Text('Pacific Ocean'),
                                      children: <Widget>[
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('BUY SUB'),
                                          onPressed: () {
                                            if (budget-200 >= 0 ) {
                                              buyUnit('sub', 'pacific');
                                              setState(() {
                                                pacificSubsTotal++;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('SCRAP SUB'),
                                          onPressed: () {
                                            if (pacificSubsTotal>0) {
                                              scrapUnit('sub', 'pacific');
                                              setState(() {
                                                pacificSubsTotal--;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('DECLARE SUB'),
                                          onPressed: () {
                                            if (pacificSubsTotal>pacificDeclaredCounter) {
                                              declareUnit('sub', 'pacific');
                                              setState(() {
                                                pacificDeclaredCounter++;
                                              });
                                            }
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
//                          enabled: true,
                                      title: new Text('Atlantic Ocean'),
                                      children: <Widget>[
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('BUY SUB'),
                                          onPressed: () {
                                            if (budget-200 >= 0 ) {
                                              buyUnit('sub', 'atlantic');
                                              setState(() {
                                                atlanticSubsTotal++;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('SCRAP SUB'),
                                          onPressed: () {
                                            if (atlanticSubsTotal>0) {
                                              setState(() {
                                                atlanticSubsTotal--;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('DECLARE SUB'),
                                          onPressed: () {
                                            if (atlanticSubsDeclared >
                                                atlanticSubsTotal) {
                                              setState(() {
                                                atlanticDeclaredCounter++;
                                              });
                                            }
                                          }
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new ExpansionTile(
//                          enabled: true,
                                      title: new Text('Indian Ocean'),
                                      children: <Widget>[
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('BUY SUB'),
                                          onPressed: () {
                                            if (budget-200 >= 0 ) {
                                              buyUnit('sub', 'indian');
                                              setState(() {
                                                indianSubsTotal++;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('SCRAP SUB'),
                                          onPressed: () {
                                            if (indianSubsTotal>0) {
                                              setState(() {
                                                indianSubsTotal--;
                                              });
                                            }
                                          },
                                        ),
                                        new FlatButton(
                                          textColor: Colors.green,
                                          child: const Text('DECLARE SUB'),
                                          onPressed: () {
                                            if(indianSubsTotal>indianDeclaredCounter) {
                                              setState(() {
                                                indianDeclaredCounter++;
                                              });
                                            };
                                          },
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                            ],
                          ),
                        ),
                        new Card(
                          child: new Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: const ListTile(
                                      leading: const Icon(
                                        Icons.lightbulb_outline,
                                        color: Colors.green,
                                      ),
                                      title:
                                          const Text('Research & Development'),
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Divider(),
//    for (var i = 0; i < firebaseobject.continents.length; i++) {} do what follows
                              new Row(
                                children: <Widget>[
                                  new Text('Annual funding'),
                                  new Expanded(
                                    child: new Slider(
                                        label: ('\$' + (_discreteValueSpending.truncate()).toString()),
                                        value: _discreteValueSpending.truncateToDouble(),
                                        max: initBudget.toDouble(),
                                        min: 0.0,
                                        onChanged: (double value) {
                                          getRndValues();
                                          setState(() {
                                            _discreteValueSpending = value;
                                            budget = initBudget - _discreteValueSpending.floor();
                                          });
                                        }),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Row(
                                children: <Widget>[
                                  new Text('Speed/Damage'),
                                  new Expanded(
                                    child: new Slider(
                                        label: ((_discreteValue.truncate()).toString()+'%'),
                                        value: _discreteValue,
                                        max: 100.0,
                                        min: 0.0,
                                        onChanged: (double value) {
                                          getRndValues();
                                          setState(() {
                                            _discreteValue = value;
                                          });
                                        }),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                            ],
                          ),
                        ),
                        new Card(
                          child: new Column(
                            mainAxisSize: MainAxisSize.min,
                            children: <Widget>[
//    for (var i = 0; i < firebaseobject.continents.length; i++) {} do what follows
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new RaisedButton(
                                      color: Colors.grey[900],
                                      elevation: 50.0,
                                      textColor: Colors.green,
                                      child: new Text('End Turn'),
                                      onPressed: () {
                                        endTurn();
                                        print('butthead');
                                      },
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Divider(),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new RaisedButton(
                                      color: Colors.grey[900],
                                      elevation: 50.0,
                                      textColor: Colors.green,
                                      child: new Text('United Nations'),
                                      onPressed: () {
                                        setState(() {
                                          print('current year by button');
                                        });
                                      },
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                              new Divider(),
                              new Row(
                                children: <Widget>[
                                  new Expanded(
                                    child: new RaisedButton(
                                      color: Colors.grey[900],
                                      elevation: 50.0,
                                      textColor: Colors.red,
                                      child:
                                          new Text('ACCESS NUCLEAR FOOTBALL'),
                                      onPressed: () {
                                        Navigator.push(
                                        context,
                                        new MaterialPageRoute(
                                        builder: (BuildContext context) =>
                                        new NuclearFootball(username: widget.username, gameID: widget.gameID)));
                                      },
                                    ),
                                  ),
                                ],
                                mainAxisSize: MainAxisSize.min,
                              ),
                            ],
                          ),
                        ),
//            new ListView.builder(
//              shrinkWrap: true,
//              itemBuilder: (BuildContext context, int index) => new EntryItem(data[index]),
//              itemCount: data.length,
//            ),
//    boobies
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );

  }
}

class NuclearFootball extends StatefulWidget {
  var username;
  var gameID;
  NuclearFootball({Key key, this.title, this.username, this.gameID}) : super(key: key);
  final String title;
  @override
  _NuclearFootballState createState() => new _NuclearFootballState();
}

class _NuclearFootballState extends State<NuclearFootball> {

//  joinGamePage({this.title});

  // Fields in a Widget subclass are always marked "final".

  final scaffoldKey = new GlobalKey<ScaffoldState>();
  final formKey = new GlobalKey<FormState>();

//  final Widget title;
  String _gameId;

//void buyUnit(unit,continent, player) {
//  http.put('peacetime/deploy$unit', body: { 'gameID': _gameId.toLowerCase(), 'playerID': widget.username, 'quantity': 'location': continentA})
//      .then((response) {
//    var statusCode = response.statusCode;
//  });
//}

  void _changeRoute() {

//    var url = "http://10.8.83.203:3000/api/pregame/joingame";
//    http.put(url, body: { 'gameID': _gameId.toLowerCase(), 'playerID': widget.username, })
//    .then((response) {
//      var statusCode = response.statusCode;
//      print('$_gameId');
//      if (statusCode == 200) {
//  print(widget.username);
    Navigator.push(
        context,
        new MaterialPageRoute(
            builder: (BuildContext context) =>
            new MyHomePage(username: widget.username, gameID: _gameId)));
//          } else {
//        print('u fucked up');
//      }
//    });
  }
  void strike() {
    http.post('https://gtnwthegame.com/api/peacetime/declarewar', headers: {'Content-type': 'application/json'}, body: JSON.encoder.convert({ 'gameID': _gameId}))
        .then((response) {
      print(response.statusCode);
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: const Text('ExpansionTile'),
      ),
      backgroundColor: Colors.grey[900],
      body: new Center(
            child: new RaisedButton(
            onPressed: (){
                strike();
            },
              color: Colors.black,
            disabledColor: Colors.red,
            child: new Text("Launch Strike"),
        )
      )
    );
  }
}

// One entry in the multilevel list displayed by this app.
//class Entry {
//  Entry(this.title, [this.children = const <Entry>[]]);
//  final String title;
//  final List<Entry> children;
//}
//
//// The entire multilevel list displayed by this app.
//final List<Entry> data = <Entry>[
//
//  new Entry('Continents',
//    <Entry>[
//      new Entry('Continent A',
//        <Entry>[
//          new Entry('Bombers'),
//          new Entry('ICBM\'s'),
//        ],
//      ),
//      new Entry('Continent B'),
//      new Entry('Continent C'),
//    ],
//  ),
//  new Entry('Naval Fleet',
//    <Entry>[
//      new Entry('Pacific Ocean'),
//      new Entry('Atlantic Ocean'),
//      new Entry('Indian Ocean'),
//    ],
//  ),
//  new Entry('Research Department',
//    <Entry>[
//      new Entry('Section C0'),
//    ],
//  ),
//];
//
//// Displays one Entry. If the entry has children then it's displayed
//// with an ExpansionTile.
//class EntryItem extends StatelessWidget {
//
//  const EntryItem(this.entry);
//
//  final Entry entry;
//
//  Widget _buildTiles(Entry root) {
//    if (root.children.isEmpty)
//      return new ListTile(title: new Text(root.title, style: new TextStyle(fontSize: 14.0),), dense: false);
//    return new Transform(
//      child: new ExpansionTile(
//        key: new PageStorageKey<Entry>(root),
//        title: new Text(root.title, style: new TextStyle(fontSize: 17.0)),
//        children: root.children.map(_buildTiles).toList(),
//      ),
//      alignment: Alignment.center,
//      transform: new Matrix4.identity()
//        ..scale(1.0),
//    );
//  }
//
//  @override
//  Widget build(BuildContext context) {
//    return _buildTiles(entry);
//  }
//}
