from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Simulated sensor values (use real values from Arduino later)
sensor_data = {
    "moisture": 55,
    "humidity": 43,
    "temperature": 28,
    "pump": False,
    "chart": [55, 60, 58, 62, 65, 70, 72, 68, 60, 57, 55, 52,
            50, 48, 47, 49, 52, 56, 60, 65, 66, 64, 60, 58]
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_data")
def get_data():
    return jsonify(sensor_data)

@app.route("/toggle_pump", methods=["POST"])
def toggle_pump():
    sensor_data["pump"] = not sensor_data["pump"]
    return jsonify({"pump": sensor_data["pump"]})

if __name__ == "__main__":
    app.run(debug=True)
