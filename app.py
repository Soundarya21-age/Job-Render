from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import boto3
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# DynamoDB setup (make sure this region matches your table)
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('JobApplications')

# -----------------------
# Route: Dashboard Page
# -----------------------
@app.route('/')
def dashboard():
    return render_template('dashboard.html')

# -----------------------
# Route: Add Page
# -----------------------
@app.route('/add')
def add_page():
    return render_template('add.html')

# -----------------------
# Route: View/Delete Page
# -----------------------
@app.route('/view-delete')
def view_delete():
    return render_template('view_delete.html')

# -----------------------
# Route: Update Page
# -----------------------
@app.route('/update')
def update_page():
    return render_template('update.html')

# -----------------------
# API: Get all jobs
# -----------------------
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    response = table.scan()
    return jsonify(response.get('Items', []))

# -----------------------
# API: Add a job
# -----------------------
@app.route('/api/jobs', methods=['POST'])
def add_job():
    data = request.get_json()
    job_id = str(uuid.uuid4())
    item = {
        'jobId': job_id,
        'company': data['company'],
        'role': data['role'],
        'status': data['status'],
        'dateApplied': data['dateApplied'],
        'notes': data['notes']
    }
    table.put_item(Item=item)
    return jsonify({'message': 'Job added', 'jobId': job_id})

# -----------------------
# API: Delete a job
# -----------------------
@app.route('/api/jobs/<string:job_id>', methods=['DELETE'])
def delete_job(job_id):
    table.delete_item(Key={'jobId': job_id})
    return jsonify({'message': 'Job deleted'})

# -----------------------
# API: Update a job
# -----------------------
@app.route("/api/jobs/<string:job_id>", methods=["PUT"])
def update_job(job_id):
    data = request.json

    update_expression = "SET #company=:company, #role=:role, #status=:status, #dateApplied=:dateApplied, #notes=:notes"
    expression_attribute_names = {
        "#company": "company",
        "#role": "role",  # 'role' is a reserved keyword in DynamoDB
        "#status": "status",
        "#dateApplied": "dateApplied",
        "#notes": "notes"
    }
    expression_attribute_values = {
        ":company": data["company"],
        ":role": data["role"],
        ":status": data["status"],
        ":dateApplied": data["dateApplied"],
        ":notes": data["notes"]
    }

    try:
        table.update_item(
            Key={"jobId": job_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values
        )
        return jsonify({"message": "Job updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)})



# -----------------------
# Run the app
# -----------------------
if __name__ == '__main__':
    app.run(debug=True)
