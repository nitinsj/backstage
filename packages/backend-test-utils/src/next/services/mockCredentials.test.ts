/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { mockCredentials } from './mockCredentials';

describe('mockCredentials', () => {
  it('creates a mocked credentials object for a none principal', () => {
    expect(mockCredentials.none()).toEqual({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'none' },
    });
  });

  it('creates a mocked credentials object for a user principal', () => {
    expect(mockCredentials.user()).toEqual({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'user', userEntityRef: 'user:default/mock' },
    });

    expect(mockCredentials.user('user:default/other')).toEqual({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'user', userEntityRef: 'user:default/other' },
    });
  });

  it('creates a mocked credentials object for a service principal', () => {
    expect(mockCredentials.service()).toEqual({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'service', subject: 'external:test-service' },
    });

    expect(mockCredentials.service('plugin:other')).toEqual({
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'service', subject: 'plugin:other' },
    });
  });

  it('creates user tokens and headers', () => {
    expect(mockCredentials.user.token()).toBe('mock-user-token');
    expect(mockCredentials.user.token('user:default/other')).toBe(
      'mock-user-token:{"userEntityRef":"user:default/other"}',
    );
    expect(mockCredentials.user.header()).toBe('Bearer mock-user-token');
    expect(mockCredentials.user.header('user:default/other')).toBe(
      'Bearer mock-user-token:{"userEntityRef":"user:default/other"}',
    );
  });

  it('creates service tokens and headers', () => {
    expect(mockCredentials.service.token()).toBe('mock-service-token');
    expect(mockCredentials.service.token({ subject: 'external:other' })).toBe(
      'mock-service-token:{"subject":"external:other"}',
    );
    expect(
      mockCredentials.service.token({
        targetPluginId: 'other',
      }),
    ).toBe('mock-service-token:{"targetPluginId":"other"}');
    expect(
      mockCredentials.service.token({
        subject: 'external:other',
        targetPluginId: 'other',
      }),
    ).toBe(
      'mock-service-token:{"subject":"external:other","targetPluginId":"other"}',
    );
    // Object keys are reordered, ordering in the token should be stable
    expect(
      mockCredentials.service.token({
        targetPluginId: 'other',
        subject: 'external:other',
      }),
    ).toBe(
      'mock-service-token:{"subject":"external:other","targetPluginId":"other"}',
    );

    expect(mockCredentials.service.header()).toBe('Bearer mock-service-token');
    expect(mockCredentials.service.header({ subject: 'external:other' })).toBe(
      'Bearer mock-service-token:{"subject":"external:other"}',
    );
    expect(
      mockCredentials.service.header({
        targetPluginId: 'other',
      }),
    ).toBe('Bearer mock-service-token:{"targetPluginId":"other"}');
    expect(
      mockCredentials.service.header({
        subject: 'external:other',
        targetPluginId: 'other',
      }),
    ).toBe(
      'Bearer mock-service-token:{"subject":"external:other","targetPluginId":"other"}',
    );
    // Object keys are reordered, ordering in the token should be stable
    expect(
      mockCredentials.service.header({
        targetPluginId: 'other',
        subject: 'external:other',
      }),
    ).toBe(
      'Bearer mock-service-token:{"subject":"external:other","targetPluginId":"other"}',
    );
  });

  it('should throw on invalid user entity refs', () => {
    expect(() => mockCredentials.user('wrong')).toThrow(
      "Invalid user entity reference 'wrong', expected <kind>:<namespace>/<name>",
    );
    expect(() => mockCredentials.user('wr:ong')).toThrow(
      "Invalid user entity reference 'wr:ong', expected <kind>:<namespace>/<name>",
    );
    expect(() => mockCredentials.user('wr/ong')).toThrow(
      "Invalid user entity reference 'wr/ong', expected <kind>:<namespace>/<name>",
    );
    expect(() => mockCredentials.user('wr/o:ng')).toThrow(
      "Invalid user entity reference 'wr/o:ng', expected <kind>:<namespace>/<name>",
    );
    expect(() => mockCredentials.user('wr:/ong')).toThrow(
      "Invalid user entity reference 'wr:/ong', expected <kind>:<namespace>/<name>",
    );

    expect(() => mockCredentials.user.token('wrong')).toThrow(
      "Invalid user entity reference 'wrong', expected <kind>:<namespace>/<name>",
    );
    expect(() => mockCredentials.user.header('wrong')).toThrow(
      "Invalid user entity reference 'wrong', expected <kind>:<namespace>/<name>",
    );
  });
});
