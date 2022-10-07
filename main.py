from flask import Flask, request
import requests

#Main page will get rendered from the static folder
app = Flask(__name__, static_url_path='')

@app.route('/getBusinessDetail', methods=['GET'])
def getBusinessDetail():
    custom_header = {'Authorization': 'Bearer EHiXgU4z71FBXtefe4z5K5nu3jBN4AMv7zSMgsLXl8iKZlxaVHLUL_fBmr5Ndt-4CAIn9-7WyijF3NUG1ZvAZx9SFFL5kopSrcZ6QPZ-HA6ck4zxKV7u1JmDtvovY3Yx'}
    result = requests.get('https://api.yelp.com/v3/businesses/' + request.args['id'], headers=custom_header)
    return result.json()

#Query YELP API and send the response
@app.route('/getNearbyBusinesses', methods=['GET'])
def getNearbyBusinesses():
    args = request.args
    payload = {'term': args['term'], 'latitude': args['latitude'], 'longitude': args['longitude'], 'categories': args['categories'], 'radius': args['radius']}
    custom_header = {'Authorization': 'Bearer EHiXgU4z71FBXtefe4z5K5nu3jBN4AMv7zSMgsLXl8iKZlxaVHLUL_fBmr5Ndt-4CAIn9-7WyijF3NUG1ZvAZx9SFFL5kopSrcZ6QPZ-HA6ck4zxKV7u1JmDtvovY3Yx'}
    result = requests.get('https://api.yelp.com/v3/businesses/search', params=payload, headers=custom_header)
    return result.json()

if __name__ == '__main__':
    # This is used when running locally only. GCP uses Gunicorn
    app.run(host='127.0.0.1', port=8080, debug=True)