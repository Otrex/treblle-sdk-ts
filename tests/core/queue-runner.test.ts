import { expect } from 'chai';// Adjust the import path accordingly
import QueueRunner from '../../core/queue-runner';


const delay = async (time: number) => new Promise((resolve) => {
  setTimeout(resolve, time)
});

describe('QueueRunner', () => {
  let queue: QueueRunner;

  beforeEach(() => {
    queue = new QueueRunner();
  });

  it('should add a task to the queue and execute it', (done) => {
    const job = async () => {
      done();
    };

    queue.add(job);

    expect(queue.size).to.equal(1);
  });

  it('should handle retries when a task fails', (done) => {
    const job = async () => {
      await delay(100);
      throw new Error('Simulated error');
    };

    queue.add(job, (failedTask) => {
      expect(queue.size).to.equal(1);
      done();
    });
  });

  it('should not retry a task if max retries exceeded', (done) => {
    const job = async () => {
      throw new Error('Simulated error');
    };

    queue.add(job);

    setTimeout(() => {
      expect(queue.size).to.equal(0);
      done();
    }, 50);
  });

  it('should execute multiple tasks in the queue', (done) => {
    const taskCount = 5;
    let executedCount = 0;

    const job = async () => {
      executedCount++;
      if (executedCount === taskCount) {
        expect(queue.size).to.equal(0);
        done();
      }
    };

    for (let i = 0; i < taskCount; i++) {
      queue.add(job);
    }
  });

  it('should execute tasks in the order they were added', (done) => {
    const executionOrder: number[] = [];
    const job1 = async () => {
      executionOrder.push(1);
    };
    const job2 = async () => {
      executionOrder.push(2);
    };

    queue.add(job1);
    queue.add(job2);

    setTimeout(() => {
      expect(executionOrder).to.deep.equal([1, 2]);
      done();
    }, 10);
  });
});
