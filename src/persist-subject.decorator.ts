import { PersistConfig, JsonMiddleware, Persistor } from '@simple-persist/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

const defaultConfig: Required<PersistConfig> = {
  keygens: [],
  middlewares: [new JsonMiddleware()],
  storage: window.localStorage,
};

export const PersistSubject = (config?: PersistConfig) => (target: any, memberName: string): void => {
  const persistor = new Persistor({
    keygens: [() => memberName, ...(config?.keygens ?? defaultConfig.keygens)],
    middlewares: config?.middlewares ?? defaultConfig.middlewares,
    storage: config?.storage ?? defaultConfig.storage,
  });

  let subject: Subject<any> | BehaviorSubject<any> = target[memberName];
  let subscription: Subscription;

  Object.defineProperty(target, memberName, {
    set: (newSubject: any) => {
      // Check type
      if (!(newSubject instanceof Subject)) {
        throw new TypeError(`PersistSubject() only accepts Subject or BehaviorSubject, received ${typeof newSubject} instead.`);
      }

      // Clear up previous state
      if (subject) {
        persistor.delete();
        subscription?.unsubscribe();
      }

      // Set up new state
      subject = newSubject;
      subscription = subject.subscribe((value) => {
        if (value === undefined) {
          persistor.delete();
        } else {
          persistor.set(value);
        }
      });

      // Load or set initial value
      if (!(subject instanceof BehaviorSubject) || subject.value === undefined) {
        const persistedValue = persistor.get();
        if (persistedValue !== undefined && persistedValue !== null) {
          subject.next(persistedValue);
        }
      } else {
        persistor.set(subject.value);
      }
    },
    get: () => subject,
  });
};
