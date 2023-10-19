import { expect } from 'chai';
import { TreblleConfig } from '../../core';
import PayloadBuilder from '../../core/payload-builder';
import * as pkg from "../../package.json";


describe('PayloadBuilder', () => {
  it('should prepare the payload with default values', () => {
    const config: TreblleConfig = {
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
      additionalFieldsToMask: ['custom_field'],
    };
    const payloadBuilder = new PayloadBuilder(config);

    const data: any = {
      server: {
        version: '1.0.0',
      },
      language: {
        name: 'Node',
        version: 'v14.17.3',
      },
      request: {
        url: 'http://example.com',
      },
      response: {
        status: 200,
        load_time: [1, 123456789],
        body: {
          custom_field: 'sensitive-data',
        }
      },

    };

    const preparedPayload = payloadBuilder.prepare(data);


    expect(preparedPayload.api_key).to.equal('your-api-key');
    expect(preparedPayload.project_id).to.equal('your-project-id');
    expect(preparedPayload.version).to.equal('1.0.0'); // Server version
    expect(preparedPayload.sdk).to.equal(pkg.name); // SDK name
    expect(preparedPayload.data.server.software).to.be.null; // Software is set to null
    expect(preparedPayload.data.language.version).to.equal('v14.17.3');
    expect(preparedPayload.data.request.timestamp).to.have.lengthOf(19); // Timestamp format check
    expect(preparedPayload.data.response.status).to.equal(200);
    expect(preparedPayload.data.response.load_time).to.be.a('number');
    expect(preparedPayload.data.errors).to.be.an('array').that.is.empty;
    expect(preparedPayload.data.response.body.custom_field).to.equal('***');
  });

  it('should mask sensitive fields in the object', () => {
    const config: TreblleConfig = {
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
      additionalFieldsToMask: ['custom_field'],
    };
    const payloadBuilder = new PayloadBuilder(config);

    const data = {
      request: {
        body: {
          custom_field: 'sensitive-data',
          password: 'password123',
        }
      }
    } as any;

    const maskedData = payloadBuilder.prepare(data);
    expect(maskedData.data.request.body.custom_field).to.equal('***');
    expect(maskedData.data.request.body.password).to.equal('***');
  });

  it('should return null for software when not provided', () => {
    const config: TreblleConfig = {
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
    };
    const payloadBuilder = new PayloadBuilder(config);

    const data = {
      response: {},
    } as any;

    const preparedPayload = payloadBuilder.prepare(data);

    expect(preparedPayload.data.server.software).to.be.null;
  });

  it('should prepare the payload with custom load time format', () => {
    const config: TreblleConfig = {
      apiKey: 'your-api-key',
      projectId: 'your-project-id',
    };
    const payloadBuilder = new PayloadBuilder(config);

    const data: any = {
      response: {
        load_time: 1234,
      },
    };

    const preparedPayload = payloadBuilder.prepare(data);

    expect(preparedPayload.data.response.load_time).to.equal(1234);
  });
});
