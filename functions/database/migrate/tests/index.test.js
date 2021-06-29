/**
 *
 * Tests for PostConfirmation
 *
 */

import { handler } from '../index';

describe('PostConfirmation', () => {
  let event;
  let mocks;
  beforeEach(async () => {
    mocks = {
      callback: jest.fn()
    };
    jest.spyOn(mocks, 'callback');
  });
  it('should be successful', async () => {
    await handler(event, null, mocks.callback);

    expect(mocks.callback.mock.calls.length).toBe(1);
    expect(mocks.callback.mock.calls[0][0]).toBe(null);
    expect(mocks.callback.mock.calls[0][1]).toEqual({});
  });
});
