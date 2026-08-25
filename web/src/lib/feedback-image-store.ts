const DB_NAME = "ggm_feedback_db";
const DB_VERSION = 1;
const STORE = "screenshots";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const request = fn(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
        tx.onerror = () => reject(tx.error);
      }),
  );
}

export async function saveFeedbackScreenshot(id: string, dataUrl: string) {
  if (!dataUrl) return;
  await runTransaction("readwrite", (store) => store.put(dataUrl, id));
}

export async function getFeedbackScreenshot(id: string): Promise<string | null> {
  try {
    return await runTransaction("readonly", (store) => store.get(id));
  } catch {
    return null;
  }
}

export async function deleteFeedbackScreenshot(id: string) {
  try {
    await runTransaction("readwrite", (store) => store.delete(id));
  } catch {
    // ignore
  }
}

export async function clearFeedbackScreenshots() {
  try {
    await runTransaction("readwrite", (store) => store.clear());
  } catch {
    // ignore
  }
}
