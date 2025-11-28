import { getBooks } from "@/lib/data";
import LandingPage from "./landing-page-content";

export default async function Page() {
  const allBooks = await getBooks();
  const featuredBooks = allBooks.filter(book => book.featured);

  return <LandingPage featuredBooks={featuredBooks} />;
}