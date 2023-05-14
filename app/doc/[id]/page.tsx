"use client";

import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from "y-prosemirror";
import { NextPage } from "next";
import "@blocknote/core/style.css";
import { usePathname } from "next/navigation";
import { getYjsDoc } from "@syncedstore/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSyncStore } from "../../hooks/useSyncedStore";
import { schema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { exampleSetup } from "prosemirror-example-setup";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

const DocPage: NextPage = () => {
  const pathname = usePathname();
  const docId = useMemo(() => pathname.replace("/doc/", ""), [pathname]);
  console.log({ docId });

  const { syncedState, provider } = useSyncStore(docId);
  console.log(getYjsDoc(syncedState).toJSON());

  const doc = useMemo(() => {
    return getYjsDoc(syncedState).getXmlFragment("prosemirror");
  }, [syncedState]);

  const [view, setView] = useState<EditorView | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prosemirrorView = new EditorView(editorRef.current, {
      state: EditorState.create({
        schema,
        plugins: [
          ySyncPlugin(doc),
          yCursorPlugin(provider?.awareness),
          yUndoPlugin(),
          keymap({
            "Mod-z": undo,
            "Mod-y": redo,
            "Mod-Shift-z": redo,
          }),
        ].concat(exampleSetup({ schema })),
      }),
    });

    setView(prosemirrorView);

    return () => {
      prosemirrorView.destroy();
    };
  }, [doc]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [provider]);

  return <div ref={editorRef} />;
};

export default DocPage;
