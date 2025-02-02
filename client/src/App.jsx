import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Dashboard from "./note/dashboard";
import CategoryList from "./category/category-list";
import { NoteListProvider } from "./note/note-list-provider";

function App() {
  return (
      <div>
        <BrowserRouter>
          <NoteListProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/categoryList" element={<CategoryList />} />
              </Route>
            </Routes>
          </NoteListProvider>
        </BrowserRouter>
      </div>
  );
}

export default App;

