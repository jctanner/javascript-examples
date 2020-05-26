#!/usr/bin/env python3

import json
import glob
import os

from pprint import pprint
from flask import Flask
from flask import jsonify
from flask import render_template
from flask import send_file

import requests
import eyed3


app = Flask(__name__)

"""
all_songs = [
    {"id": 1, "title": "barbluez 1", "artist": "phillyman", "album": "bluezsessionz"},
    {"id": 2, "title": "barbluez 2", "artist": "phillyman", "album": "bluezsessionz"},
    {"id": 3, "title": "barbluez 3", "artist": "phillyman", "album": "bluezsessionz"},
]
"""


class SongDB:
    def __init__(self):
        self.cachedir = '.cache'
        self.basedir = '/mnt/c/Users/jtanner/Music'
        self._mp3s = {}

    def get_new_id(self):
        ids = [x['id'] for x in self._mp3s.values()]
        ids = sorted(ids)
        if ids:
            return ids[-1] + 1
        return 0

    @property
    def mp3s(self):
        return sorted(list(self._mp3s.values()), key=lambda x: x['id'])

    def is_known(self, filepath):
        found = False
        for info in self._mp3s.values():
            if info['path'] == filepath:
                found = True
        return found

    def load_cache(self):
        if not os.path.exists(self.cachedir):
            os.makedirs(self.cachedir)
        fns = glob.glob('%s/*.json' % self.cachedir)
        for fn in fns:
            with open(fn, 'r') as f:
                thismp3 = json.loads(f.read())
            self._mp3s[thismp3['id']] = thismp3

    def store_info(self, info):
        fn = os.path.join(self.cachedir, '%s.json' % info['id'])
        with open(fn, 'w') as f:
            f.write(json.dumps(info, indent=2, sort_keys=True))

    def populate(self):
        for root, dirs, files in os.walk(self.basedir):
            for filen in files:
                if filen.endswith('.mp3'):
                    if self.is_known(os.path.join(root, filen)):
                        continue
                    thisid = self.get_new_id()
                    thismp3 = {
                        'id': thisid,
                        'path': os.path.join(root, filen)
                    }
                    e3 = eyed3.load(os.path.join(root, filen))
                    if e3 is None:
                        continue
                    if e3.tag is None:
                        continue
                    if e3.tag.artist is None:
                        continue
                    thismp3['artist'] = e3.tag.artist
                    if e3.tag.title is None:
                        continue
                    thismp3['title'] = e3.tag.title
                    if e3.tag.album is None:
                        continue
                    thismp3['album'] = e3.tag.album
                    thismp3['url'] = '/serve/%s' % thisid
                    self._mp3s[thisid] = thismp3
                    self.store_info(thismp3)

    def get_path_by_id(self, songid):
        return self._mp3s[songid]['path']
    
    def get_image_by_songid(self, songid):
        thissong = self._mp3s[songid]
        if thissong.get('image'):
            return self._mp3s[songid].get('image')

        thisimage = None
        for bits in [['artist', 'title'], ['artist', 'album'], ['artist']]:

            qs = [thissong.get(x,'') for x in bits]
            qs = " ".join(qs)
            #qs = thissong['artist'] + " " + thissong['album']
            #qs = qs.replace(" ", "%20")
            qurl = "http://api.duckduckgo.com/?format=json&iax=image&ia=images&q=%s" % qs
            print(qurl)
            rr = requests.get(qurl)
            results = rr.json()

            if isinstance(results, dict):
                results = [results]

            for result in results:
                if 'Image' in result and result.get('Image'):
                    print("IMAGE: %s" % result['Image'])
                    thisimage = result['Image']
                    break

            if thisimage:
                break
                
        if thisimage:
            fn = os.path.basename(thisimage)
            fn = os.path.join(self.cachedir, '%s_%s' % (songid, fn))
            self._mp3s[songid]['image'] = fn
            self.store_info(self._mp3s[songid])

            rr = requests.get(thisimage)
            with open(fn, 'wb') as f:
                f.write(rr.content)
        
        return self._mp3s[songid].get('image')


songdb = SongDB()
songdb.load_cache()
songdb.populate()
songdb.get_image_by_songid(1378)
#pprint(songdb.mp3s)
#import epdb; epdb.st()


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/api/songs', methods=['GET'])
def songs():
    return jsonify(songdb.mp3s)


@app.route('/serve/<int:songid>')
def serve_song(songid):
    thispath = songdb.get_path_by_id(songid)
    return send_file(thispath)

@app.route('/art/<int:songid>')
def get_art(songid):
    thisimg = songdb.get_image_by_songid(songid)
    print("IMAGEFILE: %s" % thisimg)
    if thisimg:
        return send_file(thisimg)
    return ''


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)