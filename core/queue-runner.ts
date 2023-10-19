/**
 * Represents a task to be executed by the Queue.
 */
interface ITask {
  /**
   * A function that defines the task to be executed, which returns a Promise.
   */
  job: () => Promise<void>;

  /**
   * The number of retries for the task.
   */
  retries: number;
}

/**
 * Queue class for managing and executing asynchronous tasks with retries.
 */
export default class QueueRunner {
  /**
   * An array that holds tasks to be executed by the queue.
   */
  private queue: ITask[] = [];

  /**
   * The maximum number of retries for each task in the queue.
   *
   * @param {number} maxRetries - The maximum number of retries for each task. Defaults to 3 if not provided.
   */
  constructor(private maxRetries: number = 3) { }

  /**
   * Get the current size of the queue.
   */
  get size() {
    return this.queue.length;
  }

  get $queue() {
    return this.queue;
  }

  /**
   * Processes the tasks in the queue by dequeuing and executing them if there are pending tasks.
   * Retries are handled when tasks fail.
   */
  private async process() {
    if (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) this.run(task);
    }
  }

  /**
   * Adds a new task to the queue for execution.
   *
   * @param {ITask["job"]} job - The job function to be executed as a task.
   */
  public add(job: ITask["job"], onFail = (job: ITask["job"]) => { }) {
    this.queue.push({ job, retries: 0 });
    this.process();
  }

  /**
   * Executes a task from the queue and handles retries if the task fails.
   *
   * @param {ITask} task - The task to be executed.
   */
  async run(task: ITask) {
    try {
      await task.job();
    } catch (error) {
      if (task.retries < this.maxRetries) {
        task.retries += 1;
        this.queue.unshift(task);
      }
    } finally {
      await this.process();
    }
  }
}
