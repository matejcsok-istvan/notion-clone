import * as Y from "yjs";
import { useSyncedStore } from "@syncedstore/react";
import { getYjsDoc, syncedStore } from "@syncedstore/core";
import { IndexeddbPersistence } from "y-indexeddb";
import { docElementTypeDescription } from "@syncedstore/core/types/doc";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useMemo } from "react";

export type SyncedState = {
  prosemirror: docElementTypeDescription;
};

export const useSyncStore = (docId?: string) => {
  const store = useMemo(
    () => {
      return syncedStore<SyncedState>(
        {
          prosemirror: {},
        },
        new Y.Doc({ gc: false })
      );
    },
    // we want a new store every time the docId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [docId]
  );
  const ydoc = useMemo(() => getYjsDoc(store), [store]);
  const syncedState = useSyncedStore(store);

  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: "ws://127.0.0.1:8080",
      name: docId || "default",
      document: ydoc,
    });
  }, [docId, ydoc]);

  useEffect(() => {
    const idbPersistence = new IndexeddbPersistence(docId ?? "test", ydoc);
    return () => idbPersistence.destroy();
  }, [ydoc, docId]);

  return useMemo(() => ({ syncedState, provider }), [syncedState, provider]);
};
