import { AddToCartBook } from "@/components/add-to-cart-book";
import { getBook } from "@/lib/data";
import { formatPrice, getBookCost } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookReviewSection } from "./book-reviews";

type Params = { book_id: string };

type Props = {
  params: Promise<Params>;
};

const getBookFromProps = async (props: Props) => {
  const params = await props.params;
  const book = await getBook(params.book_id);
  if (!book) {
    notFound();
  }
  return book;
};

export default async function BookPage(props: Props) {
  const book = await getBookFromProps(props);
  const bookCost = getBookCost(book);

  return (
    <div className="container py-12 flex flex-col gap-8">
      {/* Phần hình ảnh và thông tin chính */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72">
          <Image
            src={book.cover_url}
            width={288}
            height={432}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover rounded shadow-lg"
            priority
          />
        </div>

        <div className="md:flex-1">
          <h1 className="text-3xl md:text-5xl font-medium mb-2">
            {book.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-4">
            by {book.author}
          </p>
          <p className="text-base md:text-lg mb-4">{book.description}</p>
          <p className="text-xl md:text-2xl mb-6 text-gray-700">
            {bookCost.price === bookCost.originalPrice ? (
              <>${formatPrice(bookCost.price)}</>
            ) : (
              <>
                <span className="line-through text-neutral-500">
                  ${formatPrice(bookCost.originalPrice)}
                </span>{" "}
                ${formatPrice(bookCost.price)}{" "}
                <span className="bg-rose-600 text-white font-semibold py-1 px-2 rounded text-sm">
                  ({parseInt(book.discount_percent)}% off)
                </span>
              </>
            )}
          </p>
          <AddToCartBook book={book} />
        </div>
      </div>

      {/* Bảng thông tin chi tiết sách */}
      <div className="border rounded-lg overflow-hidden shadow-sm w-full md:w-2/3">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Publisher</td>
              <td className="px-4 py-2 text-gray-900">{book.publisher}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Publication Year</td>
              <td className="px-4 py-2 text-gray-900">{book.publication_year}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">Pages</td>
              <td className="px-4 py-2 text-gray-900">{book.page_count}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-700">ISBN</td>
              <td className="px-4 py-2 text-gray-900">{book.isbn}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phần đánh giá sách */}
      <BookReviewSection book={book} />
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const book = await getBookFromProps(props);

  return {
    title: `${book.title} - The Book Haven`,
    description: book.description,
    openGraph: {
      images: [
        {
          url: book.cover_url,
          alt: book.title,
        },
      ],
    },
  };
}
