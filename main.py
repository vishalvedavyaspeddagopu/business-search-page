from flask import Flask, render_template, request
import requests

app = Flask(__name__)

#Render main web page
@app.route('/')
def home():
    return render_template("home.html");

@app.route('/getBusinessDetail', methods=['GET'])
def getBusinessDetail():
    #payload = {'term': 'Pizza', 'latitude': 34.0223519, 'longitude': -118.285117, 'categories': 'Food', 'radius': 16100}
    custom_header = {'Authorization': 'Bearer EHiXgU4z71FBXtefe4z5K5nu3jBN4AMv7zSMgsLXl8iKZlxaVHLUL_fBmr5Ndt-4CAIn9-7WyijF3NUG1ZvAZx9SFFL5kopSrcZ6QPZ-HA6ck4zxKV7u1JmDtvovY3Yx'}
    result = requests.get('https://api.yelp.com/v3/businesses/' + request.args['id'], headers=custom_header)
    return result.json()

#Query YELP API and send the response
@app.route('/getNearbyBusinesses', methods=['GET'])
def getNearbyBusinesses():
    print(request.args)
    args = request.args
    payload = {'term': args['term'], 'latitude': args['latitude'], 'longitude': args['longitude'], 'categories': args['categories'], 'radius': args['radius']}
    custom_header = {'Authorization': 'Bearer EHiXgU4z71FBXtefe4z5K5nu3jBN4AMv7zSMgsLXl8iKZlxaVHLUL_fBmr5Ndt-4CAIn9-7WyijF3NUG1ZvAZx9SFFL5kopSrcZ6QPZ-HA6ck4zxKV7u1JmDtvovY3Yx'}
    result = requests.get('https://api.yelp.com/v3/businesses/search', params=payload, headers=custom_header)
    return result.json()
    if not request.json or not 'text' in request.json:
        return {"message": "invalid input format"}, 400

    obj = TTSClient(request.json['text'])
    
    obj.getAudio()
    path = f"/tmp/audio.mp3"
    if os.path.isfile(path):
        return send_file(path, mimetype="audio/mpeg", as_attachment=True)
    else:
        return {"message": "cannot get audio"}, 401

if __name__ == '__main__':
    # This is used when running locally only. GCP uses Gunicorn
    app.run(host='127.0.0.1', port=8080, debug=True)