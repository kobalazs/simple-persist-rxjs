import { BehaviorSubject, Subject } from 'rxjs';
import { PersistSubject } from './persist-subject.decorator';

// https://github.com/jestjs/jest/issues/6798#issuecomment-440988627
const localStorageGetItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
const localStorageSetItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');

class TestBed {
  @PersistSubject() public foo?: Subject<any> | BehaviorSubject<any>;
}

class EarlyTestBed {
  @PersistSubject() public foo = new BehaviorSubject(undefined);
}

describe('@PersistSubject()', () => {
  let testBed: TestBed;

  beforeEach(() => {
    testBed = new TestBed();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle invalid types', () => {
    expect(() => { (testBed.foo as any) = 'bar'; }).toThrow(TypeError);
    expect(() => { (testBed.foo as any) = {}; }).toThrow(TypeError);
    expect(() => { testBed.foo = new Subject(); }).not.toThrow(TypeError);
    expect(() => { testBed.foo = new BehaviorSubject('bar'); }).not.toThrow(TypeError);
  });

  it('should load initial value for Subject', (done) => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    const subject = new Subject();
    subject.subscribe((value) => {
      expect(value).toBe('bar');
      done();
    });
    testBed.foo = subject;
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('foo');
  });

  it('should load initial value for empty BehaviorSubject', () => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    testBed.foo = new BehaviorSubject(undefined);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', '"bar"');
    expect((testBed.foo as BehaviorSubject<any>).value).toBe('bar');
  });

  it('should load initial value for empty BehaviorSubject set early', () => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    const earlyTestBed = new EarlyTestBed();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageRemoveItemSpy).not.toHaveBeenCalled();
    expect((earlyTestBed.foo as BehaviorSubject<any>).value).toBe('bar');
  });

  it('should set initial value for non-empty BehaviorSubject', () => {
    testBed.foo = new BehaviorSubject('bar');
    testBed.foo?.next(undefined);
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect((testBed.foo as BehaviorSubject<any>).value).toBeUndefined();
  });

  it('should persist value', () => {
    localStorageGetItemSpy.mockReturnValue('"bar"');
    testBed.foo = new BehaviorSubject('bar');
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect(localStorageSetItemSpy).toHaveBeenCalledWith('foo', '"bar"');
    expect((testBed.foo as BehaviorSubject<any>).value).toBe('bar');
  });

  it('should remove key from storage if value is undefined', () => {
    testBed.foo = new BehaviorSubject('bar');
    testBed.foo?.next(undefined);
    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('foo');
    expect((testBed.foo as BehaviorSubject<any>).value).toBeUndefined();
  });
});
