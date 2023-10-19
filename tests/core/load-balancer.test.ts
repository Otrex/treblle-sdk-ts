import { expect } from 'chai';
import LoadBalancer from '../../core/load-balancer';

describe('LoadBalancer', () => {
  it('should return the next endpoint in round-robin order', () => {
    const endpoints = ['http://endpoint1.com', 'http://endpoint2.com', 'http://endpoint3.com'];
    const loadBalancer = new LoadBalancer(endpoints);

    const result1 = loadBalancer.getNextEndpoint();
    expect(result1).to.equal('http://endpoint1.com');

    const result2 = loadBalancer.getNextEndpoint();
    expect(result2).to.equal('http://endpoint2.com');

    const result3 = loadBalancer.getNextEndpoint();
    expect(result3).to.equal('http://endpoint3.com');

    // After cycling through all endpoints, it should return to the first one
    const result4 = loadBalancer.getNextEndpoint();
    expect(result4).to.equal('http://endpoint1.com');
  });

  it('should return the next endpoint when initialized with a single endpoint', () => {
    const endpoints = ['http://endpoint1.com'];
    const loadBalancer = new LoadBalancer(endpoints);

    const result1 = loadBalancer.getNextEndpoint();
    expect(result1).to.equal('http://endpoint1.com');

    // When there is only one endpoint, it should keep returning the same endpoint
    const result2 = loadBalancer.getNextEndpoint();
    expect(result2).to.equal('http://endpoint1.com');
  });
});
