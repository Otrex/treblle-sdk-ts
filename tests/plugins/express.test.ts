import { Request, Response } from 'express';
import { TreblleConfig, TrebllePluginPayload } from '../../core';
import express, { Express } from 'express';
import { expect } from 'chai';
import supertest from 'supertest';
import nock from 'nock';
import { TreblleExpress } from '../../plugins';

describe('TreblleExpress Plugin Test', () => {
  let app: Express;
  let server: Express.Application;

  before(() => {
    // Create an Express app for testing with the Treblle plugin
    app = express();

    // Initialize the Treblle plugin with a mocked config (you can use a test config)
    const treblleConfig: TreblleConfig = {
      apiKey: 'your_api_key',
      projectId: 'your_project_id',
    };
    app.use(TreblleExpress.plugin(treblleConfig));

    // Define a test route
    app.get('/test', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Test response' });
    });

    server = app.listen(0); // Start the Express app on a random port
  });

  after(() => {
    server.close(); // Close the Express app after testing
  });

  it('should send data to Treblle and compare the sent data', async () => {
    const expectedData = {
      // Define the expected data that the plugin should send
      request: {
        // Your expected request data
      },
      response: {
        // Your expected response data
      },
      server: {
        // Your expected server data
      },
      errors: [], // If applicable
    };

    // Mock the HTTP request made by the plugin and capture the data
    const apiMock = nock('https://api.treblle.com') // Replace with the actual API endpoint
      .post('/your/endpoint')
      .reply(200, (uri, requestBody: any) => {
        // Make assertions on the captured data
        const sentData = JSON.parse(requestBody);
        expect(sentData).to.deep.equal(expectedData);
        return { success: true };
      });

    const response = await supertest(server).get('/test');

    // Assert that the HTTP request was made
    expect(apiMock.isDone()).to.be.true;
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Test response');
  });

  it('should have used Treblle Plugin', () => {
    // Your test logic to assert that the TrebllePlugin has been used correctly
    // You may need to check specific behavior or integration points here.
    // Modify this test as per your specific requirements.
  });

  it('should have logged request and response data', () => {
    // Your test logic to assert that request and response data has been logged
    // You can access the Treblle log or storage and check for logged data.
    // Modify this test as per your specific integration and logging requirements.
  });
});
