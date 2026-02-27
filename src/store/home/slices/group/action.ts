import { type HomeStore } from '@/store/home/store';
import { type StoreSetter } from '@/store/types';

type Setter = StoreSetter<HomeStore>;
export const createGroupSlice = (set: Setter, get: () => HomeStore, _api?: unknown) =>
  new GroupActionImpl(set, get, _api);

export class GroupActionImpl {
  readonly #get: () => HomeStore;

  constructor(_set: Setter, get: () => HomeStore, _api?: unknown) {
    void _set;
    void _api;
    this.#get = get;
  }

  switchToGroup = (groupId: string): void => {
    const { navigate } = this.#get();
    navigate?.(`/group/${groupId}`);
  };
}

export type GroupAction = Pick<GroupActionImpl, keyof GroupActionImpl>;
