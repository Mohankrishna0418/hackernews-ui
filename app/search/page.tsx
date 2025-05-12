import { Suspense } from "react";
import SearchClient from "./SearchBar";

export default function SearchPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  );
}