#!/usr/bin/env python3

from flask import Flask
from flask import jsonify
from flask import render_template
from flask import request

app = Flask(__name__)


DATA = {
    'numbers': [1,2,3, 99]
}


@app.route('/api/data', methods=['GET', 'POST'])
def api_data():
    global DATA
    print(request.method)
    print(request.headers)
    if request.method == 'POST':
        print(request.data)
        print(request.get_json())
        print(request.form)
        #pass
        DATA['numbers'] = request.get_json().get('numbers', [])
    return jsonify(DATA)


@app.route('/')
def hello():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
