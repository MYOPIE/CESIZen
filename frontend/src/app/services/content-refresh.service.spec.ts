import { describe, expect, it } from 'vitest';
import { ContentRefreshService } from './content-refresh.service';

describe('ContentRefreshService', () => {
  function createService(): ContentRefreshService {
    return new ContentRefreshService();
  }

  it('emits when activities are refreshed', () => {
    const service = createService();
    let emitted = false;

    service.activitiesChanged$.subscribe(() => {
      emitted = true;
    });

    service.notifyActivitiesChanged();

    expect(emitted).toBe(true);
  });

  it('emits when informations are refreshed', () => {
    const service = createService();
    let emitted = false;

    service.informationsChanged$.subscribe(() => {
      emitted = true;
    });

    service.notifyInformationsChanged();

    expect(emitted).toBe(true);
  });

  it('emits when users are refreshed', () => {
    const service = createService();
    let emitted = false;

    service.usersChanged$.subscribe(() => {
      emitted = true;
    });

    service.notifyUsersChanged();

    expect(emitted).toBe(true);
  });
});
