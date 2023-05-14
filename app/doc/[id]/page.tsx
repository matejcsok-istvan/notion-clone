"use client";

import {
  ySyncPlugin,
  yCursorPlugin,
  yUndoPlugin,
  undo,
  redo,
} from "y-prosemirror";
import { NextPage } from "next";
import { usePathname } from "next/navigation";
import { getYjsDoc } from "@syncedstore/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSyncStore } from "../../hooks/useSyncedStore";
import { schema } from "prosemirror-schema-basic";
import { keymap } from "prosemirror-keymap";
import { exampleSetup } from "prosemirror-example-setup";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { SidebarTree } from "@/app/tree/Tree";
import styled from "styled-components";

const Root = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 20rem auto;
  height: 100%;
  width: 100%;
`;

const Editor = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const DocPage: NextPage = () => {
  const pathname = usePathname();
  const docId = useMemo(() => pathname.replace("/doc/", ""), [pathname]);
  console.log({ docId });

  const { syncedState, provider } = useSyncStore(docId);
  // console.log(getYjsDoc(syncedState).toJSON());

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

  return (
    <Root>
      <SidebarTree />
      <Editor ref={editorRef} />
    </Root>
  );
};

export default DocPage;
