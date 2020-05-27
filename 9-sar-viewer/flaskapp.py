#!/usr/bin/env python3

import glob
import os

from sarparser import SarParser

from flask import Flask
from flask import jsonify
from flask import render_template

app = Flask(__name__)


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/files')
def files():
    filenames = glob.glob('/tmp/sa/*')
    filenames = sorted(filenames)
    filenames = [os.path.basename(x) for x in filenames]
    return jsonify(filenames)


@app.route('/file/<string:filename>/<string:section>')
def get_one_file(filename, section):
    sp = SarParser(os.path.join('/tmp', 'sa', filename))
    return jsonify(getattr(sp, section))



if __name__ == "__main__":
    app.run(debug=True)
