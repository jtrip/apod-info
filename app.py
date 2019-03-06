import os
from flask import Flask, jsonify, request, g, session, Response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, UserMixin, login_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import requests
from random import choice


basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SECRET_KEY'] or 'bad_wolf'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
CORS(app, expose_headers='Authorization', supports_credentials=True)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password = db.Column(db.String(128))

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)


@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/login', methods=['POST'])
def login():
    request_json = request.get_json()
    if current_user.is_authenticated:
        return jsonify({'status': 'authenticated'})
    user = User.query.filter_by(username=request_json['username']).first()
    if user is None or not user.check_password(request_json['password']):
        return jsonify({'status': 'not authenticated', 'msg': 'incorrect username or password'})
    print(user)
    login_user(user)
    return jsonify({'status': 'authenticated'})


@app.route('/checkuser', methods=['GET'])
def check_user():
    if current_user.is_authenticated:
        return jsonify({'status': 'authenticated'})
    return jsonify({'status': 'not authenticated'})


@app.route('/apod-info', methods=['POST'])
@login_required
def get_apod_and_wiki_info():
    request_json = request.get_json()
    nasa_response = get_nasa_data(request_json)
    nasa_explanation = nasa_response.json()['explanation']
    w_search_terms = naive_entity_extraction(nasa_explanation.split(' '))
    favorite_word = choice(w_search_terms)
    mw_response = get_wiki_data(favorite_word)
    return jsonify({'nasa': nasa_response.json(), 's': w_search_terms, 'w': mw_response.json(), 'fw': favorite_word})


def get_nasa_data(req):
    base_nasa_url = 'https://api.nasa.gov/planetary/apod?'
    apod_date = 'date={}-{}-{}'.format(req['year'], req['month'], req['day'])
    api_key = 'api_key={}'.format(os.environ['NASA_KEY'])
    apod_url_components = [base_nasa_url, apod_date, api_key]
    return requests.get('&'.join(apod_url_components))


def get_wiki_data(word):
    wiki_base_url = 'https://en.wikipedia.org/w/api.php?action=query'
    wiki_generator = 'generator=search'
    wiki_gsrsearch = 'gsrsearch={}'.format(word)
    wiki_prop = 'prop=info'
    wiki_inprop = 'inprop=url'
    wiki_format = 'format=json'
    mw_url_components = [wiki_base_url, wiki_generator, wiki_gsrsearch, wiki_prop, wiki_inprop, wiki_format]
    return requests.get('&'.join(mw_url_components))


def naive_entity_extraction(text):
    capitalized_words = [word for word in text if len(word) > 1 and word[0].isupper()]
    ignored_words = ('The', 'A', 'An', 'Today', 'On', 'Very', 'New', 'One', 'Many', 'Small', 'Large', 'There')
    return [word for word in capitalized_words if word not in ignored_words]


if __name__ == '__main__':
    app.run()
