/* -----------------------------------------

    GLOBALS

-------------------------------------------*/


var serverurl = "http://192.168.0.187:5000"

/* -----------------------------------------

    SONG

-------------------------------------------*/

var Song = function(meta) {
    this.meta = meta;
    this.id = meta.id;
    this.title = meta.title;
    this.artist = meta.artist;
    this.album = meta.album;
    this.url = meta.url;
}

Song.prototype.get_long_title = function() {
    return this.artist + " - " + this.title;
}

Song.prototype.render_li = function() {
    var thishtml = '<button class="btn btn-outline-default song"';
    thishtml += ' id=' + this.id;
    thishtml += ' onmouseover=player.highlightSong(' + this.id + ')';
    thishtml += ' onmouseout=player.unhighlightSong(' + this.id + ')';
    thishtml += ' onclick="player.play_by_id(' + this.id + ')"';
    thishtml += ">";
    thishtml += this.id + ". ";
    thishtml += this.get_long_title();
    thishtml += "</button>";
    return thishtml 
}

Song.onClick = function() {
    player.play_by_id(this.id);
}

/* -----------------------------------------

    PLAYER

-------------------------------------------*/

var Player = function() {
    // what is displayed
    this.songs = [];
    // what is cached
    this._songs = [];
    this.playing = null;
    this.visualizer = new Visualizer();
    this.searcher = new Searcher();
}

// Clear the list of songs
/*
Player.prototype.clear = function() {
    this.songs = [];
}
*/

// Add each song to the internal list
Player.prototype.addsong = function(songmeta) {
    this.songs.push(new Song(songmeta));
    this._songs.push(new Song(songmeta));
}

// Make html'ified list of songs
Player.prototype.render_songlist = function() {
    var songlist = "";
    //var songlist = "<ul>";
    for (i=0; i<this.songs.length; i++) {
        songlist += this.songs[i].render_li();
    }
    //songlist += "</ul>";
    return songlist;
}

Player.prototype.play_by_id = function(songid) {
    var thissong = null;
    for (i=0; i<this.songs.length; i++) {
        if (this.songs[i].id === songid) {
            thissong = this.songs[i];
        }
    }
    this.playing = thissong.id;
    console.log("Playing " + thissong.artist + " - " + thissong.title);
    this.visualizer.set_current_title(thissong.get_long_title());
    this.visualizer.create_controller(thissong);
}

Player.prototype.search = function() {

    var phraseobj = document.getElementById("searchphrase");
    console.log(phraseobj);
    var phrase = phraseobj.value;
    console.log("searching for: " + phrase);

    if (phrase === null || phrase === "") {
        this.populate();
    } else {
        //this.populate();
        results = this.searcher.search(this._songs, phrase);
        this.songs = results;
        $("#songlist").html(player.render_songlist());
    }
}

Player.prototype.populate = function() {

    // scoping inside then() is wonky ...
    var parent = this;

    //this.searcher.render_search_box();

    if (parent._songs.length > 0) {
        parent.songs = parent._songs;
        $("#songlist").html(parent.render_songlist());
        return;
    }
    
    var songlist = fetch(serverurl + '/api/songs', {
        //mode: "no-cors",
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    })
    .then(
        function(response) {
            if (response.status !== 200) {
                console.log("ERROR:" + response.status);
                return;
            };
            return response.json();
        }
    ).then(
        function(data) {
            console.log(data);
            //parent.clear();
            parent.songs = [];
            parent._songs = [];
            for (i=0; i<data.length; i++) {
                parent.addsong(data[i]);
            };
            $("#songlist").html(parent.render_songlist());
        }
    );
}


Player.prototype.highlightSong = function(songid) {
    songli = document.getElementById(songid);
    songli.style.color = "red";
}

Player.prototype.unhighlightSong = function(songid) {
    songli = document.getElementById(songid);
    songli.style.color = "black";
}


/* -----------------------------------------

    VISUALIZER

-------------------------------------------*/

var Visualizer = function() {
    this.current_title = null;
}

Visualizer.prototype.set_current_title = function(newtitle) {
    this.current_title = newtitle;
    this.render();
}

Visualizer.prototype.render = function() {
    var html = "<div>" + this.current_title + "</div>";
    //return html
    $("#visualizer").html(html);
}

Visualizer.prototype.create_controller = function(song) {
    console.log("creating controller for ...");
    console.log(song);

    var html = "";
    html += "<h2>" + this.current_title + "</h2>";
    html += '<img class="art" src="' + serverurl + '/art/' + song.id + '">'

    html += '<audio controls autoplay class="controller">';
    html += '<source src=';
    html += '"';
    html += song.url;
    html += '"';
    html += 'type="audio/mpeg">"';
    html += "</audio>";
    console.log(html);
    $("#visualizer").html(html);
};

/* -----------------------------------------

    SEARCH

-------------------------------------------*/

var Searcher = function() {};
Searcher.prototype.search = function(songlist, phrase) {
    var results = [];
    for (i=0; i<songlist.length; i++) {
        if (songlist[i].artist.toLowerCase().includes(phrase.toLowerCase()) || songlist[i].title.toLowerCase().includes(phrase.toLowerCase())) {
            results.push(songlist[i]);
        }
    }
    return results;
};

Searcher.prototype.render_search_box = function() {
    //var html = "<form>";
    var html = '<input type="text" id="searchphrase" class="searchbox"></input>'
    //html += "</form>";
    $("#search").html(html);

    var searchphrase = document.getElementById('searchphrase');
    searchphrase.addEventListener("keyup", function(event) {
        console.log(event.keyCode);
        if (event.keyCode === 13) {
            console.log('code 13 hit ...')
            player.search();
        }
    });
}


/* -----------------------------------------

    MAIN

-------------------------------------------*/

player = new Player();
player.populate();
player.searcher.render_search_box()