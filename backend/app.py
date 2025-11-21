from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from db_connection import get_db_connection
from model_and_nlp import predict_disease
from predict import predict_pneumonia
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  

app.config['UPLOAD_FOLDER'] = 'retinodemo'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

model = pickle.load(open("model.pkl", "rb"))

DOCTOR_USERNAME = "drdhruvil"
DOCTOR_PASSWORD = "doctor123" 

tests_dic = {
    "Fasting Blood Sugar" : 200,
    "HbA1c" : 300,
    "Lipid Profile" : 250,
    "CBC" : 400,
    "Urine Routine" : 350,
    "Kidney Function (KFT)" : 600,
    "Liver Function (LFT)" : 800
}

@app.route('/')
def index():
    return jsonify({"message": "Diabetes Prediction API running"}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username == DOCTOR_USERNAME and password == DOCTOR_PASSWORD:
        return jsonify({"success": True, "message": "Login successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    glucose = float(data.get('glucose', 0))
    bmi = float(data.get('bmi', 0))
    age = int(data.get('age', 0))
    disease = str(data.get('symptom', 0))
    symptom = predict_disease(disease)
    username = data.get('username', '').strip()
    
    pred = model.predict([[0, glucose, 0, 0, 0, bmi, 0, age]])[0]
    result = "Diabetic" if pred == 1 else "Non-Diabetic"

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE history SET glucose=%s, bmi=%s, age=%s, prediction=%s, possible_disease=%s , symptoms=%s "
        "WHERE username=%s",
        (glucose, bmi, age, result, symptom, disease, username )
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"prediction": result})

@app.route('/predict_xray', methods=['POST'])
def predict_img():

    if 'xray_image' not in request.files:
        print("ERROR: 'xray_image' key missing in request.")
        return jsonify({'error': 'No image file uploaded under key "xray_image"'}), 400

    file = request.files['xray_image']
    username = request.form.get('username')

    if file.filename == '':
        print("ERROR: Filename is empty.")
        return jsonify({'error': 'No selected file or empty filename'}), 400
    
    try:
       
        filename = secure_filename(file.filename)
        upload_folder = app.config['UPLOAD_FOLDER']
        save_path = os.path.join(upload_folder, filename)
        file.save(save_path)
        print(save_path)
        image_disease = predict_pneumonia(save_path)  
        print(image_disease)
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
        "UPDATE history SET imagedisease=%s"
        "WHERE username=%s",
        (image_disease[0], username)
        )
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({
            'message': 'Image received and prediction initiated.',
            'file_path': save_path 
        }), 202

    except Exception as e:
        print(f"An unexpected error occurred during file upload: {e}")
        return jsonify({'error': f'Server error during upload: {str(e)}'}), 500



@app.route('/history', methods=['GET'])
def get_history():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM history WHERE display = 1 ORDER BY id DESC")
    records = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(records)

@app.route('/edit/<int:id>', methods=['PUT'])
def edit_record(id):
    data = request.json
    glucose = float(data.get('glucose'))
    bmi = float(data.get('bmi'))
    age = int(data.get('age'))
    prediction = data.get('prediction')
    symptom = str(data.get('symptom',0))

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE history SET glucose=%s, bmi=%s, age=%s, prediction=%s ,possible_disease=%s WHERE id=%s
    """, (glucose, bmi, age, prediction, symptom, id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Record updated successfully"})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_record(id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE history SET display = 0 Where id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Record deleted successfully"})

@app.route('/ambulance', methods=['POST'])
def create_ambulance_request():
    data = request.json or {}
    pname = str(data.get('pname', '')).strip()
    contact = str(data.get('contact', '')).strip()
    location = str(data.get('location', '')).strip()

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO ambulance (pname, contact, location) VALUES (%s, %s, %s)",
        (pname, contact, location)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"success": True, "message": "Ambulance request recorded"}), 201

@app.route('/ambulance', methods=['GET'])
def list_ambulance_requests():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, pname, contact, location, created_at FROM ambulance ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows), 200

@app.route('/book-test', methods=['POST'])
def book_test():
    BILL = 800
    data = request.json or {}
    patient_id = data.get('patient_id')
    tests = str(data.get('tests'))
    print(tests)
    # print(patient_id)

    conn = get_db_connection()
    for test , bill in tests_dic.items():
        if test in tests:
            BILL = BILL+bill 
    # print(BILL)

    conn = get_db_connection()
    cur = conn.cursor()  
    cur.execute(
        "UPDATE history SET bill=%s WHERE id=%s",
        (BILL,patient_id)
    )
    cur.execute(
        "UPDATE history SET tests=%s WHERE id=%s",
        (tests,patient_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Tests booked successfully.",
        "patient_id": patient_id,
        "tests": tests
    }), 201


@app.route("/bill/<int:patient_id>", methods=["GET"])
def get_bill(patient_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT Pname, tests, bill FROM history WHERE id=%s", (patient_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Patient not found"}), 404

    return jsonify({
        "success": True,
        "patient_name": row[0] or "",
        "tests": row[1] or "",
        "total_bill": row[2] or 0
    }), 200

@app.route('/patientregister', methods=['POST'])
def patient_register():
    data = request.json or {}
    name = data.get('name', '').strip()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    email = data.get('email', '').strip()
    contact = data.get('contact', '').strip()

    if not all([name, username, password, email, contact]):
        return jsonify({'success': False, 'message': 'All fields required'}), 400

    password_hash = generate_password_hash(password)
    
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT id FROM history WHERE username=%s", (username,))
    if cur.fetchone():
        return jsonify({'success': False, 'message': 'Username already exists'}), 409

    cur.execute(
        "INSERT INTO history "
        "(Pname, username, password_hash, email, contact) "
        "VALUES (%s, %s, %s, %s, %s)",
        (name, username, password_hash, email, contact)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'success': True, 'message': 'Registered successfully'})


@app.route('/patientlogin', methods=['POST'])
def patient_login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT password_hash, Pname FROM history WHERE username=%s", (username,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row and check_password_hash(row[0], password):
        return jsonify({'success': True, 'name': row[1], 'username': username})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401



if __name__ == "__main__":
    app.run(debug=True)
