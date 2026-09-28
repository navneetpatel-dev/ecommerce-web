// Search feature — public API
export { SearchBar } from "./components/search-bar/SearchBar.component";
export { SearchBarContainer } from "./containers/search-bar/SearchBarContainer.container";
export { useAutocomplete } from "./api/search/search.queries";
export { searchApi } from "./api/search/search.api";
export { suggestionHref } from "./utils/suggestions/suggestionHref";
export { SearchDidYouMean } from "./components/did-you-mean/SearchDidYouMean.component";
export { useSearchDidYouMean } from "./hooks/did-you-mean/useSearchDidYouMean.hook";
export type { SearchSuggestion } from "./types/search/index";
