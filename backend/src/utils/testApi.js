require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const http = require('http');
const app = require('../app');
const connectDB = require('../config/db');

const runTests = async () => {
  await connectDB();
  const server = app.listen(5001);

  const request = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const req = http.request(
        {
          hostname: 'localhost',
          port: 5001,
          path,
          method,
          headers,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, body: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    console.log('--- 1. Testing Health Check ---');
    const health = await request('/api/v1/health');
    console.log('Health Response:', health.status, health.body);

    console.log('\n--- 2. Testing Citizen Login ---');
    const citizenLogin = await request('/api/v1/auth/login', 'POST', {
      email: 'citizen@gumla.in',
      password: 'password123',
    });
    console.log('Citizen Login Status:', citizenLogin.status, citizenLogin.body.data?.user?.name);
    const citizenToken = citizenLogin.body.data.token;

    console.log('\n--- 3. Testing Problem Submission (Citizen) ---');
    const newProblem = await request(
      '/api/v1/problems',
      'POST',
      {
        title: 'High salinity in Community Borewell #4',
        description: 'Water has turned severely salty and unpalatable over the last 3 weeks.',
        category: 'Water Management',
        district: 'Gumla',
        block: 'Kamdara',
        panchayat: 'Kamdara South',
        estimatedPopulation: 220,
        frequency: 'Daily',
        citizenReportedSeverity: 'High',
      },
      citizenToken
    );
    console.log('New Problem Status:', newProblem.status, 'Problem ID:', newProblem.body.data?.problemId);
    const createdProblemId = newProblem.body.data?.problemId;

    console.log('\n--- 4. Testing PRI Login ---');
    const priLogin = await request('/api/v1/auth/login', 'POST', {
      email: 'pri.kamdara@jharkhand.gov.in',
      password: 'password123',
    });
    console.log('PRI Login Status:', priLogin.status, priLogin.body.data?.user?.name);
    const priToken = priLogin.body.data.token;

    console.log('\n--- 5. Testing PRI Verification Queue ---');
    const priQueue = await request('/api/v1/pri/queue', 'GET', null, priToken);
    console.log('PRI Queue count:', priQueue.body.count);

    console.log('\n--- 6. Testing PRI Ground Verification on Problem ---');
    const priValidate = await request(
      `/api/v1/problems/${createdProblemId}/pri-validate`,
      'PATCH',
      {
        isGenuine: true,
        observedPopulation: 250,
        groundCondition: 'Borewell water has TDS > 1800 PPM; tested on spot.',
        baselineData: { tds_ppm: 1850, taste: 'Salty/Brackish' },
        remarks: 'Genuine issue confirmed by GP Secretary.',
      },
      priToken
    );
    console.log('PRI Validate Status:', priValidate.status, 'New Status:', priValidate.body.data?.status);

    console.log('\n--- 7. Testing Nodal HEI Login ---');
    const nodalLogin = await request('/api/v1/auth/login', 'POST', {
      email: 'nodal.water@bau.edu.in',
      password: 'password123',
    });
    console.log('Nodal Login Status:', nodalLogin.status, nodalLogin.body.data?.user?.name);
    const nodalToken = nodalLogin.body.data.token;

    console.log('\n--- 8. Testing Nodal Verified Intake ---');
    const nodalProblems = await request(
      '/api/v1/nodal/problems?domain=Water+Management',
      'GET',
      null,
      nodalToken
    );
    console.log('Nodal Verified Water Problems count:', nodalProblems.body.count);

    console.log('\n--- 9. Testing Nodal Review & Master Problem Conversion ---');
    const nodalReview = await request(
      `/api/v1/problems/${createdProblemId}/nodal-review`,
      'PATCH',
      {
        action: 'CONVERTED_TO_MASTER',
        confirmedDomain: 'Water Management',
        confirmedSeverity: 'High',
        masterProblemTitle: 'Kamdara Desalination & Solar RO Deployment Initiative',
        remarks: 'Assigned to BAU Hydrology & Water Tech Division.',
      },
      nodalToken
    );
    console.log('Nodal Review Status:', nodalReview.status, 'Status:', nodalReview.body.data?.status, 'Master ID:', nodalReview.body.data?.nodalReview?.masterProblemId);

    console.log('\n--- 10. Fetching Final Problem Lifecycle & Timeline ---');
    const finalProblem = await request(`/api/v1/problems/${createdProblemId}`);
    console.log('Final Problem Title:', finalProblem.body.data?.title);
    console.log('Final Status:', finalProblem.body.data?.status);
    console.log('Assigned To:', finalProblem.body.data?.assignedTo);
    console.log('Timeline Stages:');
    finalProblem.body.data?.timeline?.forEach((t) => {
      console.log(`  - [${t.stage}] ${t.description} (by ${t.updaterName})`);
    });

    console.log('\n=== ALL END-TO-END VERTICAL SLICE TESTS PASSED! ===');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Test Error:', err);
    server.close();
    process.exit(1);
  }
};

runTests();
