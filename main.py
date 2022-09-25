from flask import Flask, render_template

app = Flask(__name__)

#Render main web page
@app.route('/')
def home():
    return render_template("home.html");

if __name__ == '__main__':
    # This is used when running locally only. GCP uses Gunicorn
    app.run(host='127.0.0.1', port=8080, debug=True)