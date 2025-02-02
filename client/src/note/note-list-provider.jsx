import { createContext, useState, useEffect } from "react";

import FetchHelper from "../fetch-helper.js";

export const noteListContext = createContext();

export function NoteListProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear().toString(); // Correctly sets the default to the current year
  });

  const [noteListDto, setnoteListDto] = useState({
    state: "ready", // one of ready/pending/error
    data: null,
    error: null,
  });

  async function handleLoad() {
    setnoteListDto((current) => {
      return { ...current, state: "pending" };
    });
    const result = await FetchHelper.note.list({ date: selectedYear });
    setnoteListDto((current) => {
      if (result.ok) {
        return { ...current, state: "ready", data: result.data, error: null };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
  }

  /* eslint-disable */
  useEffect(() => {
    handleLoad();
  }, [selectedYear]);
  /* eslint-enable */

  async function handleCreate(dtoIn) {
    setnoteListDto((current) => {
      return { ...current, state: "pending" };
    });

    const result = await FetchHelper.note.create(dtoIn);

    setnoteListDto((current) => {
      if (result.ok) {
        return {
          ...current,
          state: "ready",
          data: {
            ...current.data,
            itemList: [...(current.data?.itemList || []), result.data],
          },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });

    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }


  async function handleUpdate(dtoIn) {
    setnoteListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.note.update(dtoIn);
    setnoteListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
            (item) => item.id === dtoIn.id
        );
        current.data.itemList[itemIndex] = dtoIn;
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
          pendingId: undefined,
        };
      } else {
        return {
          ...current,
          state: "error",
          error: result.data,
          pendingId: undefined,
        };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  async function handleDelete(dtoIn) {
    setnoteListDto((current) => {
      return { ...current, state: "pending", pendingId: dtoIn.id };
    });
    const result = await FetchHelper.note.delete(dtoIn);
    setnoteListDto((current) => {
      if (result.ok) {
        const itemIndex = current.data.itemList.findIndex(
            (item) => item.id === dtoIn.id
        );
        current.data.itemList.splice(itemIndex, 1);
        return {
          ...current,
          state: "ready",
          data: { ...current.data, itemList: current.data.itemList.slice() },
          error: null,
        };
      } else {
        return { ...current, state: "error", error: result.data };
      }
    });
    return { ok: result.ok, error: result.ok ? undefined : result.data };
  }

  const value = {
    ...noteListDto,
    selectedYear,
    setSelectedYear,
    handlerMap: { handleLoad, handleCreate, handleUpdate, handleDelete },
  };

  return (
      <noteListContext.Provider value={value}>
        {children}
      </noteListContext.Provider>
  );
}

export default NoteListProvider;