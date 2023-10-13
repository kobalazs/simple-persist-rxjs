import { PersistConfig, JsonMiddleware, Persistor } from '@simple-persist/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';

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

  Object.defineProperty(target, memberName, {
    set: (newSubject: any) => {
      persistor.delete();
      subject = newSubject;
      if (!Object.prototype.hasOwnProperty.call(subject, 'value') || (subject as BehaviorSubject<any>).value === undefined) {
        subject.next(persistor.get());
      }
    },
    get: () => subject.pipe(tap((value) => {
      if (value === undefined) {
        persistor.delete();
      } else {
        persistor.set(value);
      }
    })),
  });
};
